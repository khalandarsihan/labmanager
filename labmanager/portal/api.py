# Copyright (c) 2026, Khalandar Sihan and contributors
# For license information, please see license.txt
"""
Parent Portal API — TechEthica / LabManager.

All guest-facing methods use allow_guest=True and are rate-limited.
Admin methods use @frappe.whitelist() (logged-in users only).
"""

import datetime

import frappe
from frappe.utils import getdate, nowdate

from labmanager.portal.token_utils import generate_portal_token, get_portal_url


# ── Helpers ───────────────────────────────────────────────────────────────────


def _get_parent_by_token(token: str):
	"""Return Parent Contact doc fields for a given token, or None."""
	return frappe.db.get_value(
		"Parent Contact",
		{"portal_token": token},
		["name", "student", "father_name", "mother_name", "primary_contact",
		 "father_whatsapp", "mother_whatsapp"],
		as_dict=True,
	)


def _get_authorized_students(parent) -> list[str]:
	"""
	Return list of all student IDs authorized for this parent.
	Finds sibling students by matching the primary contact's phone number.
	"""
	phone = (
		parent.father_whatsapp if parent.primary_contact == "Father"
		else parent.mother_whatsapp
	)
	if phone:
		field = "father_whatsapp" if parent.primary_contact == "Father" else "mother_whatsapp"
		siblings = frappe.get_all("Parent Contact", filters={field: phone}, fields=["student"])
	else:
		siblings = [{"student": parent.student}]
	return [s["student"] for s in siblings if s.get("student")]


def _fmt_timedelta(t) -> str:
	if not t:
		return ""
	try:
		total = int(t.total_seconds())
		return f"{total // 3600:02d}:{(total % 3600) // 60:02d}"
	except AttributeError:
		return str(t)[:5]


# ── Guest API ─────────────────────────────────────────────────────────────────


@frappe.whitelist(allow_guest=True)
def verify_portal_token(token: str) -> dict:
	"""
	Verify a portal token and return parent + student info.
	Rate-limited: max 10 attempts per IP per minute.
	"""
	if not token or not isinstance(token, str) or len(token) > 64:
		return {"valid": False}

	# Rate limiting
	ip = getattr(frappe.local, "request_ip", "") or ""
	cache_key = f"pportal:rate:{ip}"
	attempts = frappe.cache.get_value(cache_key) or 0
	if attempts >= 10:
		return {"valid": False}

	parent = _get_parent_by_token(token)
	if not parent:
		frappe.cache.set_value(cache_key, attempts + 1, expires_in_sec=60)
		return {"valid": False}

	parent_name = (
		parent.father_name if parent.primary_contact == "Father"
		else parent.mother_name
	) or "Parent"

	students = []
	for student_id in _get_authorized_students(parent):
		sp = frappe.db.get_value(
			"Student Profile",
			student_id,
			["name", "full_name"],
			as_dict=True,
		)
		if not sp:
			continue
		batches = frappe.get_all(
			"Student Batch Enrollment",
			filters={"parent": student_id, "is_active": 1},
			fields=["batch"],
			order_by="creation asc",
		)
		batch_names = [b.batch for b in batches if b.batch]
		batch_label = ", ".join(batch_names)
		students.append({
			"student_id": sp.name,
			"student_name": sp.full_name or sp.name,
			"batch": batch_label,
			"batches": batch_names,
			"photo_url": "",
			"program": batch_label,
		})

	return {"valid": True, "parent_name": parent_name, "students": students}


@frappe.whitelist(allow_guest=True)
def get_student_dashboard(token: str, student_id: str) -> dict:
	"""
	Return full dashboard data for a student.
	Token ownership is verified before returning any data.
	"""
	parent = _get_parent_by_token(token)
	if not parent or student_id not in _get_authorized_students(parent):
		return {"error": "unauthorized"}

	today = getdate(nowdate())
	month_start = today.replace(day=1)
	week_start = today - datetime.timedelta(days=6)

	# ── Attendance ────────────────────────────────────────────────────────────
	monthly = frappe.db.sql(
		"""
		SELECT
			SUM(status = 'Present')  AS present,
			SUM(status = 'Absent')   AS absent,
			SUM(status = 'Late')     AS late,
			SUM(status = 'On Leave') AS on_leave,
			COUNT(*)                 AS total
		FROM `tabStudent Attendance TE`
		WHERE student = %s AND date >= %s AND date <= %s
		""",
		(student_id, str(month_start), str(today)),
		as_dict=True,
	)[0]

	present  = int(monthly.present  or 0)
	absent   = int(monthly.absent   or 0)
	late     = int(monthly.late     or 0)
	on_leave = int(monthly.on_leave or 0)
	total    = present + absent + late + on_leave
	pct      = round(((present + late) / total) * 100) if total else 0

	# Subject-wise (worst first)
	subject_rows = frappe.db.sql(
		"""
		SELECT
			ccl.subject,
			COUNT(*)                       AS conducted,
			SUM(sa.status = 'Present')     AS present,
			SUM(sa.status = 'Absent')      AS absent
		FROM `tabStudent Attendance TE` sa
		JOIN `tabClass Conducted Log` ccl ON ccl.name = sa.class_log
		WHERE sa.student = %s AND sa.date >= %s
		GROUP BY ccl.subject
		ORDER BY (SUM(sa.status = 'Present') / COUNT(*)) ASC
		""",
		(student_id, str(month_start)),
		as_dict=True,
	)
	subject_wise = []
	for row in subject_rows:
		conducted = int(row.conducted)
		p = int(row.present or 0)
		subj_pct = round((p / conducted) * 100) if conducted else 0
		status = "good" if subj_pct >= 75 else ("warning" if subj_pct >= 60 else "danger")
		subject_wise.append({
			"subject": row.subject or "Unknown",
			"conducted": conducted,
			"present": p,
			"absent": int(row.absent or 0),
			"percent": subj_pct,
			"status": status,
		})

	# Recent 7 days — aggregate all records per day, pick worst status.
	# Priority: Absent > Late > Present > On Leave  (so one absence doesn't hide presents)
	day_start = today - datetime.timedelta(days=6)
	_day_rows = frappe.db.sql(
		"""
		SELECT date, status, COUNT(*) AS cnt
		FROM `tabStudent Attendance TE`
		WHERE student = %s AND date BETWEEN %s AND %s
		GROUP BY date, status
		""",
		(student_id, str(day_start), str(today)),
		as_dict=True,
	)
	_day_map: dict[str, dict[str, int]] = {}
	for r in _day_rows:
		d = str(r.date)
		_day_map.setdefault(d, {})[r.status] = int(r.cnt or 0)

	_PRIORITY = ["Absent", "Late", "Present", "On Leave"]
	recent_7 = []
	for i in range(6, -1, -1):
		day = today - datetime.timedelta(days=i)
		day_str = str(day)
		statuses = _day_map.get(day_str, {})
		mapped = "no_class"
		for s in _PRIORITY:
			if s in statuses:
				mapped = s.lower().replace(" ", "_")
				break
		recent_7.append({
			"date": day_str,
			"day_name": day.strftime("%a"),
			"status": mapped,
		})

	# ── Fees ──────────────────────────────────────────────────────────────────
	fees = _get_fee_data(student_id, today)

	# ── Today's schedule ──────────────────────────────────────────────────────
	schedule_today = _get_schedule_today(student_id, today)

	# ── Notifications (last 20) ───────────────────────────────────────────────
	notifs = frappe.get_all(
		"Notification Log TE",
		filters={"student": student_id},
		fields=["name", "message_type", "sent_at", "message_preview", "is_read", "delivery_status"],
		order_by="creation desc",
		limit=20,
	)
	unread_count = sum(1 for n in notifs if not n.is_read)

	return {
		"attendance": {
			"this_month_percent": pct,
			"total_classes": total,
			"present": present,
			"absent": absent,
			"late": late,
			"on_leave": on_leave,
			"subject_wise": subject_wise,
			"recent_7_days": recent_7,
		},
		"assignments": {
			"pending": [],
			"submitted_count": 0,
			"overdue_count": 0,
		},
		"fees": fees,
		"schedule_today": schedule_today,
		"notifications": [dict(n) for n in notifs],
		"unread_count": unread_count,
	}


@frappe.whitelist(allow_guest=True)
def submit_leave_request(
	token: str,
	student_id: str,
	leave_type: str,
	from_date: str,
	to_date: str,
	reason: str = "",
) -> dict:
	"""Create a leave request ToDo for admin review."""
	parent = _get_parent_by_token(token)
	if not parent or student_id not in _get_authorized_students(parent):
		return {"error": "unauthorized"}

	student_name = frappe.db.get_value("Student Profile", student_id, "full_name") or student_id

	todo = frappe.get_doc({
		"doctype": "ToDo",
		"status": "Open",
		"priority": "Medium",
		"description": (
			f"<b>Leave Request — {student_name}</b><br>"
			f"Type: {leave_type}<br>"
			f"From: {from_date} → To: {to_date}<br>"
			f"Reason: {reason or 'Not specified'}<br>"
			f"<em>Submitted via Parent Portal</em>"
		),
		"reference_type": "Student Profile",
		"reference_name": student_id,
	})
	todo.insert(ignore_permissions=True)
	frappe.db.commit()

	return {"leave_id": todo.name, "status": "Pending"}


@frappe.whitelist(allow_guest=True)
def get_day_attendance(token: str, student_id: str, date: str) -> dict:
	"""Return per-class attendance for a student on a specific date."""
	parent = _get_parent_by_token(token)
	if not parent or student_id not in _get_authorized_students(parent):
		return {"error": "unauthorized"}

	try:
		target = getdate(date)
	except Exception:
		return {"error": "invalid_date"}

	rows = frappe.db.sql(
		"""
		SELECT
			sa.status,
			sa.late_minutes,
			ccl.subject,
			ccl.actual_start,
			ccl.scheduled_start,
			ccl.scheduled_end,
			ccl.teacher
		FROM `tabStudent Attendance TE` sa
		JOIN `tabClass Conducted Log` ccl ON ccl.name = sa.class_log
		WHERE sa.student = %s AND sa.date = %s
		ORDER BY ccl.scheduled_start ASC
		""",
		(student_id, str(target)),
		as_dict=True,
	)

	classes = []
	for r in rows:
		teacher_name = ""
		if r.teacher:
			teacher_name = frappe.db.get_value("User", r.teacher, "full_name") or r.teacher
		classes.append({
			"subject": r.subject or "Unknown",
			"status": r.status or "Unknown",
			"late_minutes": int(r.late_minutes or 0),
			"start_time": _fmt_timedelta(r.scheduled_start),
			"end_time": _fmt_timedelta(r.scheduled_end),
			"teacher_name": teacher_name,
		})

	return {
		"date": str(target),
		"day_name": target.strftime("%A"),
		"classes": classes,
	}


@frappe.whitelist(allow_guest=True)
def mark_notifications_read(token: str, student_id: str) -> dict:
	"""Mark all unread Notification Log TE records as read for this student."""
	parent = _get_parent_by_token(token)
	if not parent or student_id not in _get_authorized_students(parent):
		return {"error": "unauthorized"}
	frappe.db.sql(
		"UPDATE `tabNotification Log TE` SET is_read = 1 WHERE student = %s AND is_read = 0",
		student_id,
	)
	frappe.db.commit()
	return {"ok": True}


# ── Admin API (whitelisted, not guest) ────────────────────────────────────────


@frappe.whitelist()
def generate_and_save_token(parent_contact_name: str) -> str:
	"""Generate a new permanent portal token and save it. Returns the portal URL."""
	token = generate_portal_token()
	frappe.db.set_value("Parent Contact", parent_contact_name, "portal_token", token)
	frappe.db.commit()
	return get_portal_url(token)


@frappe.whitelist()
def send_portal_link_whatsapp(parent_contact_name: str) -> dict:
	"""Send the portal link WhatsApp message to the parent's primary number."""
	from labmanager.labmanager.whatsapp.api import _body, send_whatsapp  # noqa: PLC0415

	try:
		doc = frappe.get_doc("Parent Contact", parent_contact_name)
		phone = doc.get_whatsapp_number()
		if not phone:
			return {"error": "No WhatsApp number on this Parent Contact"}

		token = doc.portal_token
		if not token:
			return {"error": "No portal token — generate one first"}

		portal_url = get_portal_url(token)
		student_name = (
			frappe.db.get_value("Student Profile", doc.student, "full_name") or doc.student
		)
		parent_name = (
			doc.father_name if doc.primary_contact == "Father" else doc.mother_name
		) or "Parent"

		result = send_whatsapp(
			to=phone,
			template_name="te_portal_link",
			components=[_body(parent_name, student_name, portal_url)],
		)
		return result
	except Exception:
		frappe.log_error(frappe.get_traceback(), "send_portal_link_whatsapp")
		return {"error": "Failed — see Error Log"}


# ── Private helpers ───────────────────────────────────────────────────────────


def _get_fee_data(student_id: str, today) -> dict:
	empty = {
		"status": "paid", "total_due": 0, "paid_amount": 0,
		"pending_amount": 0, "next_due_date": "", "next_due_amount": 0,
		"overdue_amount": 0,
	}
	try:
		invoices = frappe.db.sql(
			"""
			SELECT grand_total, outstanding_amount, due_date
			FROM `tabSales Invoice`
			WHERE customer = %s AND docstatus = 1
			ORDER BY due_date ASC
			""",
			student_id,
			as_dict=True,
		)
		if not invoices:
			return empty

		total_due     = sum(float(i.grand_total) for i in invoices)
		pending       = sum(float(i.outstanding_amount) for i in invoices)
		paid          = total_due - pending
		overdue       = sum(
			float(i.outstanding_amount)
			for i in invoices
			if i.outstanding_amount > 0 and getdate(i.due_date) < today
		)
		next_inv      = next(
			(i for i in invoices if i.outstanding_amount > 0 and getdate(i.due_date) >= today),
			None,
		)
		status = "overdue" if overdue > 0 else ("upcoming" if pending > 0 else "paid")

		return {
			"status": status,
			"total_due": total_due,
			"paid_amount": paid,
			"pending_amount": pending,
			"next_due_date": str(next_inv.due_date) if next_inv else "",
			"next_due_amount": float(next_inv.outstanding_amount) if next_inv else 0,
			"overdue_amount": overdue,
		}
	except Exception:
		return empty


def _get_schedule_today(student_id: str, today) -> list:
	try:
		batches = frappe.get_all(
			"Student Batch Enrollment",
			filters={"parent": student_id, "is_active": 1},
			fields=["batch"],
			order_by="creation asc",
		)
		batch_names = [b.batch for b in batches if b.batch]
		if not batch_names:
			return []

		day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
		weekday = today.weekday()
		if weekday == 6:  # Sunday
			return []
		today_name = day_names[weekday]

		all_slots = []
		for batch in batch_names:
			slots = frappe.get_all(
				"Timetable Master",
				filters={"batch": batch, "day_of_week": today_name, "is_active": 1},
				fields=["name", "period_number", "subject", "teacher",
				        "scheduled_start", "scheduled_end", "room", "batch"],
				order_by="scheduled_start asc",
			)
			all_slots.extend(slots)

		# Sort all slots across batches by start time
		all_slots.sort(key=lambda s: s.scheduled_start or datetime.time())

		result = []
		for slot in all_slots:
			log_status = frappe.db.get_value(
				"Class Conducted Log",
				{"timetable_slot": slot.name, "date": str(today)},
				"status",
			)
			period_status = (
				"completed" if log_status == "Completed"
				else ("ongoing" if log_status == "In Progress" else "upcoming")
			)
			teacher_name = ""
			if slot.teacher:
				teacher_name = (
					frappe.db.get_value("User", slot.teacher, "full_name") or slot.teacher
				)
			result.append({
				"period": slot.period_number,
				"subject": slot.subject or "",
				"teacher_name": teacher_name,
				"start_time": _fmt_timedelta(slot.scheduled_start),
				"end_time": _fmt_timedelta(slot.scheduled_end),
				"room": slot.room or "",
				"batch": slot.batch or "",
				"status": period_status,
			})
		return result
	except Exception:
		frappe.log_error(frappe.get_traceback(), "portal _get_schedule_today")
		return []
