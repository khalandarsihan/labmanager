# Copyright (c) 2026, Khalandar Sihan and contributors
# For license information, please see license.txt

import secrets

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import add_days, now_datetime


class ParentContact(Document):
	def before_insert(self):
		self._generate_portal_token()

	def validate(self):
		self._validate_primary_contact_number()

	def _generate_portal_token(self):
		self.portal_token = secrets.token_urlsafe(32)
		self.token_expiry = add_days(now_datetime(), 30)

	def _validate_primary_contact_number(self):
		if self.primary_contact == "Father" and not self.father_whatsapp:
			frappe.msgprint(
				_("Father WhatsApp number is not set — notifications may not be delivered."),
				alert=True,
			)
		elif self.primary_contact == "Mother" and not self.mother_whatsapp:
			frappe.msgprint(
				_("Mother WhatsApp number is not set — notifications may not be delivered."),
				alert=True,
			)

	@frappe.whitelist()
	def refresh_token(self):
		"""Regenerate portal token. Called from the form's Refresh Token button."""
		self._generate_portal_token()
		self.save(ignore_permissions=True)
		return self.portal_token

	def get_whatsapp_number(self) -> str | None:
		"""Return the WhatsApp number of the primary contact."""
		if self.primary_contact == "Father":
			return self.father_whatsapp
		return self.mother_whatsapp
