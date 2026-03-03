# Copyright (c) 2026, Khalandar Sihan and Contributors
# See license.txt

from frappe.tests import IntegrationTestCase, UnitTestCase

EXTRA_TEST_RECORD_DEPENDENCIES = ["Batch", "Academic Year"]
IGNORE_TEST_RECORD_DEPENDENCIES = []


class UnitTestTimetableMaster(UnitTestCase):
	"""Unit tests for TimetableMaster."""

	pass


class IntegrationTestTimetableMaster(IntegrationTestCase):
	"""Integration tests for TimetableMaster."""

	pass
