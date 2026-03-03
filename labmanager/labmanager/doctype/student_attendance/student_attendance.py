# Copyright (c) 2026, Khalandar Sihan and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document


class StudentAttendance(Document):
	def validate(self):
		self._validate_no_duplicate()

	def after_insert(self):
		if self.status == "Absent":
			self._create_absence_notification()

	def on_update(self):
		# If status changed to Absent and no notification exists yet, create one
		if self.status == "Absent" and not self._absence_notification_exists():
			self._create_absence_notification()

	def _validate_no_duplicate(self):
		existing = frappe.db.get_value(
			"Student Attendance",
			{
				"class_conducted_log": self.class_conducted_log,
				"student": self.student,
				"name": ("!=", self.name),
			},
			"name",
		)
		if existing:
			frappe.throw(
				_("Attendance record ({0}) already exists for student {1} in this class log.").format(
					existing, self.student
				)
			)

	def _absence_notification_exists(self) -> bool:
		return frappe.db.exists(
			"Notification Log",
			{"student_attendance": self.name, "triggered_by": "Absence"},
		)

	def _create_absence_notification(self):
		"""Queue a Notification Log when a student is marked Absent."""
		parent_contact = frappe.db.get_value(
			"Parent Contact",
			{"student": self.student, "is_primary": 1},
			"name",
		)
		if not parent_contact:
			return  # No primary contact configured — skip silently

		log = frappe.get_doc(
			{
				"doctype": "Notification Log",
				"student": self.student,
				"parent_contact": parent_contact,
				"notification_type": frappe.db.get_value(
					"Parent Contact", parent_contact, "preferred_contact_method"
				)
				or "WhatsApp",
				"triggered_by": "Absence",
				"student_attendance": self.name,
				"class_conducted_log": self.class_conducted_log,
				"message": self._build_absence_message(),
			}
		)
		log.insert(ignore_permissions=True)

	def _build_absence_message(self) -> str:
		log_doc = frappe.db.get_value(
			"Class Conducted Log",
			self.class_conducted_log,
			["date", "subject", "time_slot"],
			as_dict=True,
		)
		return (
			f"Dear Parent,\n\nYour ward ({self.student}) was marked Absent "
			f"for {log_doc.subject} on {log_doc.date} ({log_doc.time_slot}).\n\n"
			"Please contact the school for more information.\n\nRegards,\nTechEthica"
		)
