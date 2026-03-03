# Copyright (c) 2026, Khalandar Sihan and Contributors
# See license.txt

from frappe.tests import IntegrationTestCase, UnitTestCase

EXTRA_TEST_RECORD_DEPENDENCIES = ["Class Conducted Log", "Student Profile"]
IGNORE_TEST_RECORD_DEPENDENCIES = []


class UnitTestStudentAttendance(UnitTestCase):
	"""Unit tests for StudentAttendance."""

	pass


class IntegrationTestStudentAttendance(IntegrationTestCase):
	"""Integration tests for StudentAttendance."""

	pass
