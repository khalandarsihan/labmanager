# Copyright (c) 2026, Khalandar Sihan and contributors
# For license information, please see license.txt

from datetime import datetime

import frappe
from frappe import _
from frappe.utils import get_time, nowdate


def _time_to_minutes(t) -> int:
	"""Convert a datetime.time object to total minutes since midnight."""
	return t.hour * 60 + t.minute


def _students_in_batch(batch: str) -> list[dict]:
	"""Return all active Student Profile rows enrolled in the given batch."""
	return frappe.db.sql(
		"""
		SELECT sp.name, sp.full_name
		FROM `tabStudent Profile` sp
		INNER JOIN `tabStudent Batch Enrollment` sbe ON sbe.parent = sp.name
		WHERE sbe.batch = %s AND sbe.is_active = 1
		""",
		batch,
		as_dict=True,
	)


@frappe.whitelist()
def get_today_slots() -> dict:
	"""
	Return ALL timetable slots for the logged-in teacher today, annotated
	with whether each is active, upcoming, or past.
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

	if not slots:
		return {"slots": [], "message": "No classes scheduled for today."}

	result = []
	for slot in slots:
		start = get_time(slot.scheduled_start)
		end   = get_time(slot.scheduled_end) if slot.scheduled_end else None

		if start > now:
			status = "upcoming"
		elif end and now > end:
			status = "past"
		else:
			# now >= start and (no end time OR now <= end)
			status = "active"

		# Delay is always measured from scheduled_start — even for past slots that
		# the teacher is opening late.  This ensures the late-reason prompt fires
		# regardless of whether the class window has technically ended.
		delay_minutes = max(0, _time_to_minutes(now) - _time_to_minutes(start)) if start <= now else 0
		result.append({
			"slot":            slot.name,
			"subject":         slot.subject,
			"batch":           slot.batch,
			"period_number":   slot.period_number,
			"scheduled_start": str(slot.scheduled_start),
			"scheduled_end":   str(slot.scheduled_end) if slot.scheduled_end else "",
			"status":          status,
			"is_late":         delay_minutes > 5,
			"delay_minutes":   delay_minutes,
		})

	return {"slots": result}


@frappe.whitelist()
def get_slot_students(timetable_slot: str) -> list:
	"""Return the student list for a specific timetable slot."""
	batch = frappe.db.get_value("Timetable Master", timetable_slot, "batch")
	if not batch:
		return []
	return _students_in_batch(batch)


@frappe.whitelist()
def get_current_timetable_slot() -> dict:
	"""
	Legacy: return the single active/next slot for the logged-in teacher.
	Kept for backwards compatibility; new code should use get_today_slots.
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
		end   = get_time(slot.scheduled_end) if slot.scheduled_end else None
		if end and start <= now <= end:
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
	students = _students_in_batch(result_slot.batch)

	return {
		"slot": result_slot.name,
		"subject": result_slot.subject,
		"batch": result_slot.batch,
		"scheduled_start": str(result_slot.scheduled_start),
		"scheduled_end":   str(result_slot.scheduled_end) if result_slot.scheduled_end else "",
		"is_active": is_active,
		"is_late": delay_minutes > 5,
		"delay_minutes": delay_minutes,
		"student_list": students,
	}


@frappe.whitelist()
def get_class_attendance(class_log: str) -> dict:
	"""
	Return live attendance counts and the full scan list for an ongoing class.
	Used by the frontend to keep counters accurate across page reloads.
	"""
	records = frappe.get_all(
		"Student Attendance TE",
		filters={"class_log": class_log},
		fields=["student", "student_name", "status", "late_minutes", "entry_time"],
		order_by="creation desc",
	)
	present = sum(1 for r in records if r.status == "Present")
	late = sum(1 for r in records if r.status == "Late")
	absent = sum(1 for r in records if r.status == "Absent")
	return {
		"records": records,
		"present": present,
		"late": late,
		"absent": absent,
		"total": len(records),
	}


@frappe.whitelist()
def create_class_log(timetable_slot: str, late_reason: str = "") -> str:
	"""
	Create a Class Conducted Log for today's timetable slot.
	Returns the existing log name if one already exists for today.
	If late_reason is provided the teacher acknowledges they started late;
	students will not be penalised for lateness in this session.
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
		"teacher_late_reason": late_reason.strip() if late_reason else "",
	})
	doc.insert(ignore_permissions=True)
	return doc.name


@frappe.whitelist()
def mark_attendance(class_log: str, qr_id: str, scan_time: str = None) -> dict:
	"""
	Mark attendance for the student identified by qr_id.
	Returns {student_name, status, late_minutes, already_marked}.
	Throws if the QR code is invalid or student is not enrolled in the batch.
	"""
	log = frappe.get_doc("Class Conducted Log", class_log)

	# QR payload: student ID on line 0, optional info lines below.
	# A plain "STUD-001" (old format) and the new multi-line format both work.
	qr_id = qr_id.split("\n")[0].strip()

	# Look up by doc name first, then fall back to qr_id field.
	student = frappe.db.get_value(
		"Student Profile",
		{"name": qr_id},
		["name", "full_name"],
		as_dict=True,
	) or frappe.db.get_value(
		"Student Profile",
		{"qr_id": qr_id},
		["name", "full_name"],
		as_dict=True,
	)
	if not student:
		frappe.throw(_("QR code not recognised. Please check the student ID."))

	# Verify the student is enrolled in the batch for this class
	if log.batch:
		enrolled = frappe.db.exists(
			"Student Batch Enrollment",
			{"parent": student.name, "batch": log.batch, "is_active": 1},
		)
		if not enrolled:
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
	# If teacher logged a late-start reason, measure lateness from when class actually began
	# (students should not be penalised for the teacher's delay).
	# Otherwise use scheduled_start so an early-starting teacher doesn't penalise students.
	if log.teacher_late_reason and log.actual_start:
		ref_time = get_time(log.actual_start)
	elif log.scheduled_start:
		ref_time = get_time(log.scheduled_start)
	else:
		ref_time = get_time(log.actual_start) if log.actual_start else None
	late_minutes = 0
	status = "Present"
	if ref_time:
		diff = _time_to_minutes(scan) - _time_to_minutes(ref_time)
		if diff > 5:
			late_minutes = diff - 5  # minutes past the grace period, not total time since start
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
	Close a class: mark all unenrolled/unmarked students Absent, set actual_end,
	enqueue WhatsApp alerts, and return final totals + duration.
	"""
	log = frappe.get_doc("Class Conducted Log", class_log)

	all_students = _students_in_batch(log.batch)
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
