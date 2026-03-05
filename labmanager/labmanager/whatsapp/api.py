# Copyright (c) 2026, Khalandar Sihan and contributors
# For license information, please see license.txt
"""
WhatsApp Cloud API integration for TechEthica / LabManager.

Credentials must be set in site_config.json (bench --site lms.localhost set-config):
  whatsapp_phone_number_id   – from Meta developer console (Phone Number ID)
  whatsapp_access_token      – permanent system user token
  whatsapp_api_version       – (optional) default "v19.0"

All outbound messages are logged in Notification Log TE.
"""

import json

import frappe
import requests
from frappe.utils import format_date


# ── Config helpers ─────────────────────────────────────────────────────────────

def _cfg(key: str, default=None):
	"""Read a key from site_config.json."""
	return frappe.conf.get(key, default)


def _fmt_phone(number: str) -> str:
	"""
	Normalise any Indian phone string to E.164 digits-only.
	e.g. "+91 98765 43210" → "919876543210"
	     "9876543210"       → "919876543210"
	     "09876543210"      → "919876543210"
	"""
	digits = "".join(c for c in (number or "") if c.isdigit())
	if digits.startswith("0"):
		digits = "91" + digits[1:]
	if len(digits) == 10:
		digits = "91" + digits
	return digits


# ── Core sender ────────────────────────────────────────────────────────────────

def send_whatsapp(
	*,
	to: str,
	template_name: str,
	language_code: str = "en",
	components: list | None = None,
	nlog_name: str = "",
) -> dict:
	"""
	Send a WhatsApp template message via Meta Cloud API.

	Parameters
	----------
	to            : recipient phone (any format; normalised internally)
	template_name : Meta-approved template name
	language_code : template language code (default "en")
	components    : list of component dicts (header/body/button parameters)
	nlog_name     : Notification Log TE name to update on success/failure

	Returns
	-------
	{"success": True,  "message_id": "wamid.xxx"}
	{"success": False, "error": "..."}
	"""
	phone_id = _cfg("whatsapp_phone_number_id")
	token    = _cfg("whatsapp_access_token")
	version  = _cfg("whatsapp_api_version", "v19.0")

	if not phone_id or not token:
		err = "WhatsApp credentials not configured. Add whatsapp_phone_number_id and whatsapp_access_token to site_config.json."
		frappe.log_error(err, "WhatsApp Config Missing")
		_nlog_failed(nlog_name, err)
		return {"success": False, "error": err}

	phone = _fmt_phone(to)
	if len(phone) < 10:
		err = f"Invalid phone number: {to!r}"
		frappe.log_error(err, "WhatsApp Invalid Phone")
		_nlog_failed(nlog_name, err)
		return {"success": False, "error": err}

	payload = {
		"messaging_product": "whatsapp",
		"to": phone,
		"type": "template",
		"template": {
			"name": template_name,
			"language": {"code": language_code},
		},
	}
	if components:
		payload["template"]["components"] = components

	url = f"https://graph.facebook.com/{version}/{phone_id}/messages"
	headers = {
		"Authorization": f"Bearer {token}",
		"Content-Type": "application/json",
	}

	last_error = ""
	for _attempt in range(2):  # one automatic retry
		try:
			resp = requests.post(url, headers=headers, json=payload, timeout=10)
			data = resp.json()
			if resp.ok and data.get("messages"):
				msg_id = data["messages"][0].get("id", "")
				_nlog_sent(nlog_name, msg_id)
				return {"success": True, "message_id": msg_id}
			last_error = json.dumps(data)
		except requests.RequestException as exc:
			last_error = str(exc)

	frappe.log_error(last_error, f"WhatsApp Send Failed – {template_name}")
	_nlog_failed(nlog_name, last_error)
	return {"success": False, "error": last_error}


# ── NLOG status updaters ───────────────────────────────────────────────────────

def _nlog_sent(nlog_name: str, message_id: str):
	if not nlog_name:
		return
	try:
		frappe.get_doc("Notification Log TE", nlog_name).mark_sent(message_id)
	except Exception:
		frappe.log_error(frappe.get_traceback(), "WhatsApp NLOG mark_sent")


def _nlog_failed(nlog_name: str, error: str):
	if not nlog_name:
		return
	try:
		frappe.get_doc("Notification Log TE", nlog_name).mark_failed(error[:500])
	except Exception:
		frappe.log_error(frappe.get_traceback(), "WhatsApp NLOG mark_failed")


# ── Component builder helper ───────────────────────────────────────────────────

def _body(*texts) -> dict:
	"""Build a WhatsApp template body component from positional text parameters."""
	return {
		"type": "body",
		"parameters": [{"type": "text", "text": str(t)} for t in texts],
	}


# ══════════════════════════════════════════════════════════════════════════════
# Template 1 — Absent Alert
# Called from: notification_log_te.create_absent_alert (via enqueue)
# ══════════════════════════════════════════════════════════════════════════════

def send_absent_alert(nlog_name: str):
	"""
	Dispatch an absent-alert WhatsApp using an existing Notification Log TE.
	Must be called via frappe.enqueue (runs in background worker).

	Template: student_absent_alert
	Params  : {{1}} student name  {{2}} subject  {{3}} date
	"""
	try:
		nlog = frappe.get_doc("Notification Log TE", nlog_name)

		if not nlog.whatsapp_number:
			nlog.mark_failed("No WhatsApp number on Parent Contact")
			return

		student_name = (
			frappe.db.get_value("Student Profile", nlog.student, "full_name") or nlog.student
		)

		# Fetch the most recent absent attendance record for this student
		att = frappe.db.get_value(
			"Student Attendance TE",
			{"student": nlog.student, "status": "Absent"},
			["subject", "date"],
			as_dict=True,
			order_by="creation desc",
		) or {}

		subject  = att.get("subject") or "a class"
		date_str = format_date(att.get("date")) if att.get("date") else ""

		send_whatsapp(
			to=nlog.whatsapp_number,
			template_name="student_absent_alert",
			components=[_body(student_name, subject, date_str)],
			nlog_name=nlog_name,
		)

	except Exception:
		frappe.log_error(frappe.get_traceback(), "WhatsApp send_absent_alert")
		_nlog_failed(nlog_name, "Internal error — see Error Log")


# ══════════════════════════════════════════════════════════════════════════════
# Template 2 — Daily Attendance Summary
# Called from: scheduler at 16:00 daily
# ══════════════════════════════════════════════════════════════════════════════

def send_daily_summary_for_log(class_log_name: str):
	"""
	Send a daily attendance summary WhatsApp to the teacher for one class log.

	Template: daily_attendance_summary
	Params  : {{1}} date  {{2}} batch  {{3}} present  {{4}} absent
	          {{5}} late  {{6}} attendance_rate
	"""
	try:
		log = frappe.get_doc("Class Conducted Log", class_log_name)

		teacher_user = frappe.db.get_value(
			"Timetable Master", log.timetable_slot, "teacher"
		) if log.timetable_slot else None

		if not teacher_user:
			return

		teacher_phone = frappe.db.get_value("User", teacher_user, "mobile_no")
		if not teacher_phone:
			return

		total    = (log.total_present or 0) + (log.total_absent or 0) + (log.total_late or 0)
		rate     = round((((log.total_present or 0) + (log.total_late or 0)) / total) * 100) if total else 0
		date_str = format_date(log.date)

		nlog = frappe.get_doc({
			"doctype": "Notification Log TE",
			"student": "",
			"message_type": "Daily Summary",
			"whatsapp_number": teacher_phone,
			"message_preview": (
				f"Daily summary for {log.batch} on {date_str}: "
				f"P={log.total_present} A={log.total_absent} L={log.total_late}"
			),
		})
		# student is reqd — use a placeholder or make it optional; skip if field is mandatory
		# We insert with ignore_mandatory for summary logs (no student link needed)
		nlog.flags.ignore_mandatory = True
		nlog.insert(ignore_permissions=True)

		send_whatsapp(
			to=teacher_phone,
			template_name="daily_attendance_summary",
			components=[_body(
				date_str,
				log.batch or "",
				log.total_present or 0,
				log.total_absent or 0,
				log.total_late or 0,
				rate,
			)],
			nlog_name=nlog.name,
		)

	except Exception:
		frappe.log_error(frappe.get_traceback(), "WhatsApp send_daily_summary_for_log")


# ══════════════════════════════════════════════════════════════════════════════
# Template 3 — Assignment Notification
# Doc event: after_insert on Assignment TE
# ══════════════════════════════════════════════════════════════════════════════

def on_assignment_created(doc, method=None):
	"""
	Document event hook — after_insert on Assignment TE.
	Sends an assignment notification WhatsApp to parents of all enrolled students.
	"""
	if not doc.get("batch"):
		return

	students = frappe.db.sql(
		"""
		SELECT sp.name, sp.full_name
		FROM `tabStudent Profile` sp
		INNER JOIN `tabStudent Batch Enrollment` sbe ON sbe.parent = sp.name
		WHERE sbe.batch = %s AND sbe.is_active = 1
		""",
		doc.batch,
		as_dict=True,
	)

	due_str = format_date(doc.get("due_date")) if doc.get("due_date") else "TBD"

	for student in students:
		parent = frappe.db.get_value(
			"Parent Contact",
			{"student": student.name},
			["name", "whatsapp_number"],
			as_dict=True,
		)
		if not parent or not parent.whatsapp_number:
			continue

		nlog = frappe.get_doc({
			"doctype": "Notification Log TE",
			"student": student.name,
			"parent_contact": parent.name,
			"message_type": "Assignment",
			"message_preview": f"Assignment: {doc.title} – due {due_str}",
		})
		nlog.insert(ignore_permissions=True)

		frappe.enqueue(
			"labmanager.labmanager.whatsapp.api._dispatch_assignment_notification",
			nlog_name=nlog.name,
			student_name=student.full_name,
			assignment_title=doc.title,
			subject=doc.get("subject") or "",
			due_date=due_str,
			queue="short",
		)

	frappe.db.commit()


def _dispatch_assignment_notification(
	nlog_name: str,
	student_name: str,
	assignment_title: str,
	subject: str,
	due_date: str,
):
	"""
	Template: assignment_notification
	Params  : {{1}} student/parent name  {{2}} assignment title
	          {{3}} subject              {{4}} due date
	"""
	try:
		nlog = frappe.get_doc("Notification Log TE", nlog_name)
		if not nlog.whatsapp_number:
			nlog.mark_failed("No WhatsApp number")
			return
		send_whatsapp(
			to=nlog.whatsapp_number,
			template_name="assignment_notification",
			components=[_body(student_name, assignment_title, subject, due_date)],
			nlog_name=nlog_name,
		)
	except Exception:
		frappe.log_error(frappe.get_traceback(), "WhatsApp _dispatch_assignment_notification")


# ══════════════════════════════════════════════════════════════════════════════
# Template 3b — No Class Today
# Called from: scheduler at 21:00 for unconducted slots
# ══════════════════════════════════════════════════════════════════════════════

def send_no_class_alert(student: str, subject: str, batch: str, date: str):
	"""
	Notify the parent that no class was held today for a given subject.

	Template: no_class_today
	Params  : {{1}} student name  {{2}} subject  {{3}} batch  {{4}} date
	"""
	try:
		parent = frappe.db.get_value(
			"Parent Contact",
			{"student": student},
			["name", "whatsapp_number"],
			as_dict=True,
		)
		if not parent or not parent.whatsapp_number:
			return

		student_full = frappe.db.get_value("Student Profile", student, "full_name") or student
		date_str = format_date(date)

		nlog = frappe.get_doc({
			"doctype": "Notification Log TE",
			"student": student,
			"parent_contact": parent.name,
			"message_type": "No Class",
			"whatsapp_number": parent.whatsapp_number,
			"message_preview": f"No class for {subject} on {date_str}",
		})
		nlog.insert(ignore_permissions=True)
		frappe.db.commit()

		send_whatsapp(
			to=parent.whatsapp_number,
			template_name="no_class_today",
			components=[_body(student_full, subject, batch, date_str)],
			nlog_name=nlog.name,
		)

	except Exception:
		frappe.log_error(frappe.get_traceback(), f"WhatsApp send_no_class_alert – {student}")


# ══════════════════════════════════════════════════════════════════════════════
# Template 4 — Fee Reminder
# Called from: scheduler 7 days before Sales Invoice due date
# ══════════════════════════════════════════════════════════════════════════════

def send_fee_reminder(student_name: str, invoice_name: str):
	"""
	Send a fee reminder WhatsApp to the parent of *student_name*.

	Template: fee_reminder
	Params  : {{1}} student name  {{2}} amount  {{3}} description  {{4}} due date
	"""
	try:
		parent = frappe.db.get_value(
			"Parent Contact",
			{"student": student_name},
			["name", "whatsapp_number"],
			as_dict=True,
		)
		if not parent or not parent.whatsapp_number:
			return

		inv = frappe.db.get_value(
			"Sales Invoice",
			invoice_name,
			["grand_total", "due_date", "customer_name"],
			as_dict=True,
		)
		if not inv:
			return

		student_full = (
			frappe.db.get_value("Student Profile", student_name, "full_name") or student_name
		)

		nlog = frappe.get_doc({
			"doctype": "Notification Log TE",
			"student": student_name,
			"parent_contact": parent.name,
			"message_type": "Fee Reminder",
			"message_preview": (
				f"Fee reminder: ₹{inv.grand_total} due on {format_date(inv.due_date)}"
			),
		})
		nlog.insert(ignore_permissions=True)
		frappe.db.commit()

		send_whatsapp(
			to=parent.whatsapp_number,
			template_name="fee_reminder",
			components=[_body(
				student_full,
				f"{inv.grand_total:,.0f}",
				"tuition fee",
				format_date(inv.due_date),
			)],
			nlog_name=nlog.name,
		)

	except Exception:
		frappe.log_error(frappe.get_traceback(), "WhatsApp send_fee_reminder")


# ══════════════════════════════════════════════════════════════════════════════
# Template 5 — Weekly Report
# Called from: scheduler every Friday at 18:00
# ══════════════════════════════════════════════════════════════════════════════

def send_weekly_report_for_student(student_name: str, week_start: str, week_end: str):
	"""
	Send a weekly attendance report WhatsApp to the parent of *student_name*.

	Template: weekly_attendance_report
	Params  : {{1}} week range  {{2}} student name  {{3}} batch
	          {{4}} present     {{5}} absent         {{6}} late
	          {{7}} percentage  {{8}} remark
	"""
	try:
		parent = frappe.db.get_value(
			"Parent Contact",
			{"student": student_name},
			["name", "whatsapp_number"],
			as_dict=True,
		)
		if not parent or not parent.whatsapp_number:
			return

		student_full = (
			frappe.db.get_value("Student Profile", student_name, "full_name") or student_name
		)
		batch = frappe.db.get_value(
			"Student Batch Enrollment",
			{"parent": student_name, "is_active": 1},
			"batch",
		) or ""

		counts = frappe.db.sql(
			"""
			SELECT
				SUM(status = 'Present') AS present,
				SUM(status = 'Absent')  AS absent,
				SUM(status = 'Late')    AS late
			FROM `tabStudent Attendance TE`
			WHERE student = %s AND date BETWEEN %s AND %s
			""",
			(student_name, week_start, week_end),
			as_dict=True,
		)[0]

		present = int(counts.present or 0)
		absent  = int(counts.absent or 0)
		late    = int(counts.late or 0)
		total   = present + absent + late
		pct     = round(((present + late) / total) * 100) if total else 0

		if pct >= 90:
			remark = "Excellent attendance this week! Keep it up."
		elif pct >= 75:
			remark = "Good attendance. Aim for 90% or above."
		else:
			remark = "Attendance needs improvement. Please ensure regular attendance."

		week_label = f"{format_date(week_start)} – {format_date(week_end)}"

		nlog = frappe.get_doc({
			"doctype": "Notification Log TE",
			"student": student_name,
			"parent_contact": parent.name,
			"message_type": "Weekly Report",
			"message_preview": (
				f"Week {week_label}: P={present} A={absent} L={late} ({pct}%)"
			),
		})
		nlog.insert(ignore_permissions=True)
		frappe.db.commit()

		send_whatsapp(
			to=parent.whatsapp_number,
			template_name="weekly_attendance_report",
			components=[_body(
				week_label,
				student_full,
				batch,
				present,
				absent,
				late,
				pct,
				remark,
			)],
			nlog_name=nlog.name,
		)

	except Exception:
		frappe.log_error(frappe.get_traceback(), "WhatsApp send_weekly_report_for_student")
