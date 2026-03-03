# Copyright (c) 2026, Khalandar Sihan and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document


class TimetableMaster(Document):
	def validate(self):
		self._validate_timing()
		self._validate_no_duplicate_slot()

	def _validate_timing(self):
		if self.scheduled_start and self.scheduled_end:
			if self.scheduled_start >= self.scheduled_end:
				frappe.throw(_("Scheduled Start must be before Scheduled End"))

	def _validate_no_duplicate_slot(self):
		existing = frappe.db.get_value(
			"Timetable Master",
			{
				"batch": self.batch,
				"day_of_week": self.day_of_week,
				"period_number": self.period_number,
				"is_active": 1,
				"name": ("!=", self.name),
			},
			"name",
		)
		if existing:
			frappe.throw(
				_("An active slot already exists for batch {0} on {1} period {2}: {3}").format(
					self.batch, self.day_of_week, self.period_number, existing
				)
			)
