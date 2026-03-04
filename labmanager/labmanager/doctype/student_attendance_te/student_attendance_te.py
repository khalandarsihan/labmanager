# Copyright (c) 2026, Khalandar Sihan and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document


class StudentAttendanceTE(Document):
	def before_insert(self):
		if not self.marked_by:
			self.marked_by = frappe.session.user
		self._populate_student_name()

	def _populate_student_name(self):
		"""Auto-fill student_name from the linked Student Profile."""
		if self.student and not self.student_name:
			self.student_name = frappe.db.get_value("Student Profile", self.student, "full_name") or self.student

	def validate(self):
		self._validate_no_duplicate()
		self._validate_late_minutes()

	def after_insert(self):
		self._update_class_log_totals()

	def on_update(self):
		self._update_class_log_totals()

	def on_trash(self):
		self._update_class_log_totals()

	def _validate_no_duplicate(self):
		existing = frappe.db.get_value(
			"Student Attendance TE",
			{
				"class_log": self.class_log,
				"student": self.student,
				"name": ("!=", self.name),
			},
			"name",
		)
		if existing:
			frappe.throw(
				_("Attendance already marked for student {0} in this class log ({1}).").format(
					self.student_name or self.student, existing
				)
			)

	def _validate_late_minutes(self):
		if self.status != "Late" and self.late_minutes:
			self.late_minutes = 0

	def _update_class_log_totals(self):
		"""Recalculate and update present/absent/late totals on the parent Class Conducted Log."""
		result = frappe.db.sql(
			"""
			SELECT
				SUM(status = 'Present') AS present,
				SUM(status = 'Absent')  AS absent,
				SUM(status = 'Late')    AS late
			FROM `tabStudent Attendance TE`
			WHERE class_log = %s
			""",
			self.class_log,
			as_dict=True,
		)[0]

		frappe.db.set_value(
			"Class Conducted Log",
			self.class_log,
			{
				"total_present": result.present or 0,
				"total_absent": result.absent or 0,
				"total_late": result.late or 0,
			},
		)
