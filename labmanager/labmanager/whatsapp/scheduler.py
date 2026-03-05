# Copyright (c) 2026, Khalandar Sihan and contributors
# For license information, please see license.txt
"""
Scheduled WhatsApp jobs for TechEthica / LabManager.

Registered in hooks.py → scheduler_events → "cron":
  "0 20 * * 0-4,6" → send_daily_attendance_summary   (Mon–Thu + Sat–Sun, 8 PM)
  "0 21 * * 0-4,6" → notify_unconducted_classes       (Mon–Thu + Sat–Sun, 9 PM)
  "0 9  * * *"    → send_fee_reminders              (daily, 9 AM)
  "0 18 * * 5"    → send_weekly_reports             (Friday, 6 PM)
"""

from datetime import timedelta

import frappe
from frappe.utils import add_days, getdate, nowdate

from labmanager.labmanager.whatsapp.api import (
	send_daily_summary_for_log,
	send_fee_reminder,
	send_no_class_alert,
	send_weekly_report_for_student,
)


# ── Template 2: Daily Attendance Summary ─────────────────────────────────────

def send_daily_attendance_summary():
	"""
	Runs Mon–Thu + Sat–Sun at 20:00 (Friday off).
	Finds every completed Class Conducted Log for today and dispatches
	a summary WhatsApp to the teacher of each log.
	"""
	today = nowdate()
	logs = frappe.get_all(
		"Class Conducted Log",
		filters={"date": today, "status": "Completed"},
		fields=["name"],
	)
	for log in logs:
		try:
			send_daily_summary_for_log(log.name)
		except Exception:
			frappe.log_error(
				frappe.get_traceback(),
				f"Daily Summary – {log.name}",
			)


# ── Template 4: Fee Reminders ─────────────────────────────────────────────────

def send_fee_reminders():
	"""
	Runs daily at 09:00.
	Finds Sales Invoices due in exactly 7 days linked to a student,
	and dispatches a fee reminder WhatsApp to the parent.

	Assumption: Sales Invoice → customer field matches Student Profile name,
	or a custom field 'student_profile' links to Student Profile.
	Adjust the query below if your invoicing model differs.
	"""
	target_due = add_days(nowdate(), 7)

	invoices = frappe.db.sql(
		"""
		SELECT si.name AS invoice_name, si.customer AS student_profile
		FROM `tabSales Invoice` si
		WHERE
			si.due_date = %s
			AND si.docstatus = 1
			AND si.outstanding_amount > 0
		""",
		target_due,
		as_dict=True,
	)

	for inv in invoices:
		student = inv.student_profile
		# Only proceed if the customer maps to a Student Profile
		if not frappe.db.exists("Student Profile", student):
			continue
		try:
			send_fee_reminder(student, inv.invoice_name)
		except Exception:
			frappe.log_error(
				frappe.get_traceback(),
				f"Fee Reminder – {inv.invoice_name}",
			)


# ── Template 5: Weekly Reports ────────────────────────────────────────────────

def send_weekly_reports():
	"""
	Runs every Friday at 18:00.
	Sends a weekly attendance summary WhatsApp to parents of all active students.
	Week period: last Saturday through today (Friday).
	"""
	today      = getdate(nowdate())
	week_end   = today
	week_start = today - timedelta(days=6)  # Saturday of the previous week

	# All students with at least one attendance record this week
	students = frappe.db.sql(
		"""
		SELECT DISTINCT student
		FROM `tabStudent Attendance TE`
		WHERE date BETWEEN %s AND %s
		""",
		(str(week_start), str(week_end)),
		as_dict=True,
	)

	for row in students:
		try:
			send_weekly_report_for_student(
				row.student,
				str(week_start),
				str(week_end),
			)
		except Exception:
			frappe.log_error(
				frappe.get_traceback(),
				f"Weekly Report – {row.student}",
			)


# ── No-class notifications ────────────────────────────────────────────────────

def notify_unconducted_classes():
	"""
	Runs Mon–Thu + Sat–Sun at 21:00, after all classes have ended.

	For every Timetable Master slot scheduled today that has NO Class Conducted Log
	(the teacher never opened the attendance page), this job:
	  1. Creates a 'Cancelled' Class Conducted Log so the gap is visible in reports.
	  2. Sends a WhatsApp 'no_class_today' notification to every enrolled student's parent.

	If the teacher started the class but never closed it (status = 'Ongoing'), we leave
	it untouched — the admin can decide whether to close or cancel it manually.
	"""
	today = nowdate()
	day_map = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
	day_of_week = day_map[getdate(today).weekday()]

	slots = frappe.get_all(
		"Timetable Master",
		filters={"day_of_week": day_of_week, "is_active": 1},
		fields=["name", "batch", "subject", "teacher"],
	)

	for slot in slots:
		existing = frappe.db.get_value(
			"Class Conducted Log",
			{"timetable_slot": slot.name, "date": today},
			"name",
		)
		if existing:
			# Class was started (Ongoing or Completed) — do not override
			continue

		# Create a Cancelled log so the absence is recorded in admin reports
		try:
			log = frappe.get_doc({
				"doctype": "Class Conducted Log",
				"timetable_slot": slot.name,
				"date": today,
				"status": "Cancelled",
			})
			log.insert(ignore_permissions=True)
			frappe.db.commit()
		except Exception:
			frappe.log_error(frappe.get_traceback(), f"No-class CCL – {slot.name}")
			continue

		# Notify parents in this batch
		students = frappe.db.sql(
			"""
			SELECT sp.name
			FROM `tabStudent Profile` sp
			INNER JOIN `tabStudent Batch Enrollment` sbe ON sbe.parent = sp.name
			WHERE sbe.batch = %s AND sbe.is_active = 1
			""",
			slot.batch,
			as_dict=True,
		)

		for student in students:
			try:
				send_no_class_alert(
					student=student.name,
					subject=slot.subject or "",
					batch=slot.batch or "",
					date=today,
				)
			except Exception:
				frappe.log_error(
					frappe.get_traceback(),
					f"No-class alert – {student.name}",
				)
