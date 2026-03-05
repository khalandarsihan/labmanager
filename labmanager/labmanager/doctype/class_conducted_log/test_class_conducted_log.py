# Copyright (c) 2026, Khalandar Sihan and Contributors
# See license.txt

from frappe.tests import IntegrationTestCase, UnitTestCase

EXTRA_TEST_RECORD_DEPENDENCIES = ["Timetable Master", "Batch TE"]
IGNORE_TEST_RECORD_DEPENDENCIES = []


class UnitTestClassConductedLog(UnitTestCase):
	"""Unit tests for ClassConductedLog."""

	pass


class IntegrationTestClassConductedLog(IntegrationTestCase):
	"""Integration tests for ClassConductedLog."""

	pass
