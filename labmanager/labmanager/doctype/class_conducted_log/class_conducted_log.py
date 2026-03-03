# Copyright (c) 2026, Khalandar Sihan and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import getdate


DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


class ClassConductedLog(Document):
	def before_insert(self):
		self._set_day_from_date()
		if not self.status:
			self.status = "Draft"

	def validate(self):
		self._set_day_from_date()
		self._validate_time_slot_in_timetable()
		self._validate_no_duplicate_log()
		if self.status == "Cancelled" and not self.cancellation_reason:
			frappe.throw(_("Please provide a Cancellation Reason when status is Cancelled"))

	def _set_day_from_date(self):
		if self.date:
			self.day = DAY_NAMES[getdate(self.date).weekday()]

	def _validate_time_slot_in_timetable(self):
		if not (self.timetable_master and self.day and self.time_slot):
			return
		timetable = frappe.get_doc("Timetable Master", self.timetable_master)
		valid_slots = {row.time_slot for row in timetable.timetable_entries if row.day == self.day}
		if self.time_slot not in valid_slots:
			frappe.throw(
				_("Time Slot {0} is not scheduled on {1} in Timetable {2}").format(
					self.time_slot, self.day, self.timetable_master
				)
			)

	def _validate_no_duplicate_log(self):
		existing = frappe.db.get_value(
			"Class Conducted Log",
			{
				"timetable_master": self.timetable_master,
				"date": self.date,
				"time_slot": self.time_slot,
				"name": ("!=", self.name),
			},
			"name",
		)
		if existing:
			frappe.throw(
				_("A Class Conducted Log ({0}) already exists for this Timetable, Date, and Time Slot.").format(
					existing
				)
			)

	@frappe.whitelist()
	def get_timetable_slots_for_day(self) -> list:
		"""Return time slots available on the log's day from its timetable. Called from JS."""
		if not (self.timetable_master and self.day):
			return []
		timetable = frappe.get_doc("Timetable Master", self.timetable_master)
		return [
			{
				"time_slot": row.time_slot,
				"subject": row.subject,
				"teacher": row.teacher,
				"classroom": row.classroom,
			}
			for row in timetable.timetable_entries
			if row.day == self.day
		]
