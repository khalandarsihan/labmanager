# Copyright (c) 2026, Khalandar Sihan and Contributors
# See license.txt

from frappe.tests import IntegrationTestCase, UnitTestCase

EXTRA_TEST_RECORD_DEPENDENCIES = ["Academic Year"]
IGNORE_TEST_RECORD_DEPENDENCIES = []


class UnitTestBatchTE(UnitTestCase):
	"""Unit tests for BatchTE."""

	pass


class IntegrationTestBatchTE(IntegrationTestCase):
	"""Integration tests for BatchTE."""

	pass
