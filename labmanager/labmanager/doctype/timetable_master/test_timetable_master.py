# Copyright (c) 2026, Khalandar Sihan and Contributors
# See license.txt

import frappe
from frappe.tests import IntegrationTestCase, UnitTestCase

EXTRA_TEST_RECORD_DEPENDENCIES = ["Class Schedule", "Academic Year", "Academic Term"]
IGNORE_TEST_RECORD_DEPENDENCIES = []


class UnitTestTimetableMaster(UnitTestCase):
	"""Unit tests for TimetableMaster."""

	def test_effective_date_validation(self):
		doc = frappe.new_doc("Timetable Master")
		doc.effective_from = "2026-06-01"
		doc.effective_to = "2026-05-01"  # before effective_from
		self.assertRaises(frappe.ValidationError, doc._validate_dates)

	def test_duplicate_slot_validation(self):
		doc = frappe.new_doc("Timetable Master")
		doc.append("timetable_entries", {"day": "Monday", "time_slot": "P1", "subject": "Math"})
		doc.append("timetable_entries", {"day": "Monday", "time_slot": "P1", "subject": "Science"})
		self.assertRaises(frappe.ValidationError, doc._validate_no_duplicate_slots)


class IntegrationTestTimetableMaster(IntegrationTestCase):
	"""Integration tests for TimetableMaster."""

	pass
