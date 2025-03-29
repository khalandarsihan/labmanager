# Copyright (c) 2025, Khalandar Sihan and Contributors
# See license.txt

# import frappe
from frappe.tests import IntegrationTestCase, UnitTestCase


# On IntegrationTestCase, the doctype test records and all
# link-field test record depdendencies are recursively loaded
# Use these module variables to add/remove to/from that list
EXTRA_TEST_RECORD_DEPENDENCIES = []  # eg. ["User"]
IGNORE_TEST_RECORD_DEPENDENCIES = []  # eg. ["User"]


class UnitTestClassroom(UnitTestCase):
	"""
	Unit tests for Classroom.
	Use this class for testing individual functions and methods.
	"""

	pass


class IntegrationTestClassroom(IntegrationTestCase):
	"""
	Integration tests for Classroom.
	Use this class for testing interactions between multiple components.
	"""

	pass
