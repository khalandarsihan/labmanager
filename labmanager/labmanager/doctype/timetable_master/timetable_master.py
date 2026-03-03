# Copyright (c) 2026, Khalandar Sihan and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document


class TimetableMaster(Document):
	def before_insert(self):
		if not self.status:
			self.status = "Draft"

	def validate(self):
		self._validate_dates()
		self._validate_no_duplicate_slots()
		self._auto_update_status()

	def _validate_dates(self):
		if self.effective_to and self.effective_from > self.effective_to:
			frappe.throw(_("Effective From cannot be later than Effective To"))

	def _validate_no_duplicate_slots(self):
		seen = set()
		for row in self.timetable_entries:
			key = (row.day, row.time_slot)
			if key in seen:
				frappe.throw(
					_("Row {0}: Duplicate entry for {1} – {2}. Each day/time-slot combination must be unique.").format(
						row.idx, row.day, row.time_slot
					)
				)
			seen.add(key)

	def _auto_update_status(self):
		"""Transition Draft → Active/Inactive based on today's date when the user saves."""
		if self.status == "Draft":
			return
		today = frappe.utils.today()
		if self.effective_from <= today and (not self.effective_to or self.effective_to >= today):
			self.status = "Active"
		elif self.effective_to and self.effective_to < today:
			self.status = "Inactive"

	def get_schedule_for_day(self, day: str) -> list:
		"""Return timetable entries for the given day, ordered by time slot."""
		return sorted(
			[row for row in self.timetable_entries if row.day == day],
			key=lambda r: r.time_slot or "",
		)

	@staticmethod
	def get_active_timetable(class_schedule: str) -> "TimetableMaster | None":
		"""Return the current Active Timetable Master for a Class Schedule, or None."""
		today = frappe.utils.today()
		name = frappe.db.get_value(
			"Timetable Master",
			{
				"class_schedule": class_schedule,
				"status": "Active",
				"effective_from": ("<=", today),
			},
			"name",
			order_by="effective_from desc",
		)
		if name:
			return frappe.get_doc("Timetable Master", name)
		return None
