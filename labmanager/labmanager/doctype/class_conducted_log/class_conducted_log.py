# Copyright (c) 2026, Khalandar Sihan and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import get_time


class ClassConductedLog(Document):
	def before_insert(self):
		self._fetch_from_timetable()

	def validate(self):
		self._fetch_from_timetable()
		self._calculate_delay()

	def _fetch_from_timetable(self):
		"""Auto-fill batch, subject, teacher, and scheduled times from the timetable slot."""
		if not self.timetable_slot:
			return
		slot = frappe.get_doc("Timetable Master", self.timetable_slot)
		if not self.batch:
			self.batch = slot.batch
		if not self.subject:
			self.subject = slot.subject
		if not self.teacher:
			self.teacher = slot.teacher
		if not self.scheduled_start:
			self.scheduled_start = slot.scheduled_start
		if not self.scheduled_end:
			self.scheduled_end = slot.scheduled_end

	def _calculate_delay(self):
		"""Calculate late_start and delay_minutes from actual_start vs scheduled_start."""
		if not (self.actual_start and self.scheduled_start):
			return
		actual = get_time(self.actual_start)
		scheduled = get_time(self.scheduled_start)
		actual_minutes = actual.hour * 60 + actual.minute
		scheduled_minutes = scheduled.hour * 60 + scheduled.minute
		diff = actual_minutes - scheduled_minutes
		if diff > 0:
			self.late_start = 1
			self.delay_minutes = diff
		else:
			self.late_start = 0
			self.delay_minutes = 0
