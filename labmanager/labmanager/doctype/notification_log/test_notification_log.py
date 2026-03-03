# Copyright (c) 2026, Khalandar Sihan and Contributors
# See license.txt

from frappe.tests import IntegrationTestCase, UnitTestCase

EXTRA_TEST_RECORD_DEPENDENCIES = ["Parent Contact", "Student Profile"]
IGNORE_TEST_RECORD_DEPENDENCIES = []


class UnitTestNotificationLog(UnitTestCase):
	"""Unit tests for NotificationLog."""

	pass


class IntegrationTestNotificationLog(IntegrationTestCase):
	"""Integration tests for NotificationLog."""

	pass
