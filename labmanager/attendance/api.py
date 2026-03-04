# Copyright (c) 2026, Khalandar Sihan and contributors
# For license information, please see license.txt

from datetime import datetime

import frappe
from frappe import _
from frappe.utils import get_time, nowdate


def _time_to_minutes(t) -> int:
	"""Convert a datetime.time object to total minutes since midnight."""
	return t.hour * 60 + t.minute


@frappe.whitelist()
def get_current_timetable_slot() -> dict:
	"""
	Return the active timetable slot for the logged-in teacher.
	Falls back to the next upcoming slot if no class is currently active.
	Includes the student list for the slot's batch.
	"""
	teacher = frappe.session.user
	day_map = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
	day_of_week = day_map[datetime.today().weekday()]
	now = datetime.now().time()

	slots = frappe.get_all(
		"Timetable Master",
		filters={"teacher": teacher, "day_of_week": day_of_week, "is_active": 1},
		fields=["name", "subject", "batch", "scheduled_start", "scheduled_end", "period_number"],
		order_by="scheduled_start asc",
	)

	active_slot = None
	next_slot = None
	for slot in slots:
		start = get_time(slot.scheduled_start)
		end = get_time(slot.scheduled_end)
		if start <= now <= end:
			active_slot = slot
			break
		elif start > now and not next_slot:
			next_slot = slot

	if not active_slot and not next_slot:
		return {"slot": None, "message": "No class scheduled for today."}

	result_slot = active_slot or next_slot
	is_active = active_slot is not None

	slot_start = get_time(result_slot.scheduled_start)
	delay_minutes = max(0, _time_to_minutes(now) - _time_to_minutes(slot_start)) if is_active else 0

	students = frappe.get_all(
		"Student Profile",
		filters={"batch": result_slot.batch},
		fields=["name", "full_name", "qr_id"],
	)

	return {
		"slot": result_slot.name,
		"subject": result_slot.subject,
		"batch": result_slot.batch,
		"scheduled_start": str(result_slot.scheduled_start),
		"scheduled_end": str(result_slot.scheduled_end),
		"is_active": is_active,
		"is_late": delay_minutes > 5,
		"delay_minutes": delay_minutes,
		"student_list": students,
	}


@frappe.whitelist()
def create_class_log(timetable_slot: str) -> str:
	"""
	Create a Class Conducted Log for today's timetable slot.
	Returns the existing log name if one already exists for today.
	"""
	today = nowdate()
	existing = frappe.db.get_value(
		"Class Conducted Log",
		{"timetable_slot": timetable_slot, "date": today},
		"name",
	)
	if existing:
		return existing

	slot = frappe.get_doc("Timetable Master", timetable_slot)
	now = datetime.now().time()
	sched = get_time(slot.scheduled_start)
	delay = max(0, _time_to_minutes(now) - _time_to_minutes(sched))

	doc = frappe.get_doc({
		"doctype": "Class Conducted Log",
		"timetable_slot": timetable_slot,
		"date": today,
		"actual_start": now.strftime("%H:%M:%S"),
		"status": "Ongoing",
		"late_start": 1 if delay > 5 else 0,
		"delay_minutes": delay,
	})
	doc.insert(ignore_permissions=True)
	return doc.name


@frappe.whitelist()
def mark_attendance(class_log: str, qr_id: str, scan_time: str = None) -> dict:
	"""
	Mark attendance for the student identified by qr_id.
	Returns {student_name, status, late_minutes, already_marked}.
	Throws if the QR code is invalid or student is not in the batch.
	"""
	log = frappe.get_doc("Class Conducted Log", class_log)

	# QR encodes the student doc name (e.g. STUD-001); also fall back to qr_id field.
	# Look up WITHOUT batch filter first so we can give a clear "wrong batch" message.
	student = frappe.db.get_value(
		"Student Profile",
		{"name": qr_id},
		["name", "full_name", "batch"],
		as_dict=True,
	) or frappe.db.get_value(
		"Student Profile",
		{"qr_id": qr_id},
		["name", "full_name", "batch"],
		as_dict=True,
	)
	if not student:
		frappe.throw(_("QR code not recognised. Please check the student ID."))
	if log.batch and student.batch != log.batch:
		frappe.throw(_("{0} is not enrolled in this batch.").format(student.full_name))

	existing = frappe.db.get_value(
		"Student Attendance TE",
		{"class_log": class_log, "student": student.name},
		["name", "status"],
		as_dict=True,
	)
	if existing:
		return {
			"student_name": student.full_name,
			"status": existing.status,
			"late_minutes": 0,
			"already_marked": True,
		}

	scan = get_time(scan_time) if scan_time else datetime.now().time()
	actual_start = get_time(log.actual_start) if log.actual_start else None
	late_minutes = 0
	status = "Present"
	if actual_start:
		diff = _time_to_minutes(scan) - _time_to_minutes(actual_start)
		if diff > 5:
			late_minutes = diff
			status = "Late"

	att = frappe.get_doc({
		"doctype": "Student Attendance TE",
		"class_log": class_log,
		"date": log.date,
		"subject": log.subject,
		"student": student.name,
		"student_name": student.full_name,
		"status": status,
		"entry_time": scan.strftime("%H:%M:%S"),
		"late_minutes": late_minutes,
		"marked_by": frappe.session.user,
	})
	att.insert(ignore_permissions=True)

	return {
		"student_name": student.full_name,
		"status": status,
		"late_minutes": late_minutes,
		"already_marked": False,
	}


@frappe.whitelist()
def close_class_log(class_log: str) -> dict:
	"""
	Close a class: mark all unmarked students Absent, set actual_end,
	enqueue WhatsApp alerts, and return final totals + duration.
	"""
	log = frappe.get_doc("Class Conducted Log", class_log)

	all_students = frappe.get_all(
		"Student Profile",
		filters={"batch": log.batch},
		fields=["name", "full_name"],
	)
	marked = {
		r.student
		for r in frappe.get_all(
			"Student Attendance TE", filters={"class_log": class_log}, fields=["student"]
		)
	}

	for student in all_students:
		if student.name in marked:
			continue
		att = frappe.get_doc({
			"doctype": "Student Attendance TE",
			"class_log": class_log,
			"date": log.date,
			"subject": log.subject,
			"student": student.name,
			"student_name": student.full_name,
			"status": "Absent",
			"marked_by": frappe.session.user,
		})
		att.insert(ignore_permissions=True)
		frappe.enqueue(
			"labmanager.labmanager.doctype.notification_log_te.notification_log_te.create_absent_alert",
			student=student.name,
			class_log=class_log,
			queue="short",
		)

	now_time = datetime.now().time()
	actual_start = get_time(log.actual_start) if log.actual_start else None
	duration_minutes = (
		max(0, _time_to_minutes(now_time) - _time_to_minutes(actual_start)) if actual_start else 0
	)

	result = frappe.db.sql(
		"""
		SELECT
			SUM(status = 'Present') AS present,
			SUM(status = 'Absent')  AS absent,
			SUM(status = 'Late')    AS late
		FROM `tabStudent Attendance TE`
		WHERE class_log = %s
		""",
		class_log,
		as_dict=True,
	)[0]

	frappe.db.set_value(
		"Class Conducted Log",
		class_log,
		{
			"status": "Completed",
			"actual_end": now_time.strftime("%H:%M:%S"),
			"total_present": result.present or 0,
			"total_absent": result.absent or 0,
			"total_late": result.late or 0,
		},
	)

	return {
		"total_present": result.present or 0,
		"total_absent": result.absent or 0,
		"total_late": result.late or 0,
		"duration_minutes": duration_minutes,
	}
