# Copyright (c) 2026, Khalandar Sihan and Contributors
# See license.txt

from frappe.tests import IntegrationTestCase, UnitTestCase

EXTRA_TEST_RECORD_DEPENDENCIES = ["Student", "Parent Contact"]
IGNORE_TEST_RECORD_DEPENDENCIES = []


class UnitTestNotificationLogTE(UnitTestCase):
	"""Unit tests for NotificationLogTE."""

	pass


class IntegrationTestNotificationLogTE(IntegrationTestCase):
	"""Integration tests for NotificationLogTE."""

	pass
