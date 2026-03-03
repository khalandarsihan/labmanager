# Copyright (c) 2026, Khalandar Sihan and Contributors
# See license.txt

from frappe.tests import IntegrationTestCase, UnitTestCase

EXTRA_TEST_RECORD_DEPENDENCIES = ["Class Conducted Log", "Student"]
IGNORE_TEST_RECORD_DEPENDENCIES = []


class UnitTestStudentAttendanceTE(UnitTestCase):
	"""Unit tests for StudentAttendanceTE."""

	pass


class IntegrationTestStudentAttendanceTE(IntegrationTestCase):
	"""Integration tests for StudentAttendanceTE."""

	pass
