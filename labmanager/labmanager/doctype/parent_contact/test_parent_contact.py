# Copyright (c) 2026, Khalandar Sihan and Contributors
# See license.txt

from frappe.tests import IntegrationTestCase, UnitTestCase

EXTRA_TEST_RECORD_DEPENDENCIES = ["Student"]
IGNORE_TEST_RECORD_DEPENDENCIES = []


class UnitTestParentContact(UnitTestCase):
	"""Unit tests for ParentContact."""

	pass


class IntegrationTestParentContact(IntegrationTestCase):
	"""Integration tests for ParentContact."""

	pass
