# Copyright (c) 2026, Khalandar Sihan and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document


class ParentContact(Document):
	def validate(self):
		self._validate_whatsapp_required()
		if self.is_primary:
			self._enforce_single_primary()

	def _validate_whatsapp_required(self):
		if self.preferred_contact_method == "WhatsApp" and not self.whatsapp_number:
			frappe.throw(_("WhatsApp Number is required when Preferred Contact Method is WhatsApp"))
		if self.preferred_contact_method == "Email" and not self.email:
			frappe.throw(_("Email is required when Preferred Contact Method is Email"))

	def _enforce_single_primary(self):
		"""Ensure only one primary contact per student."""
		others = frappe.get_all(
			"Parent Contact",
			filters={
				"student": self.student,
				"is_primary": 1,
				"name": ("!=", self.name),
			},
			fields=["name"],
		)
		for other in others:
			frappe.db.set_value("Parent Contact", other.name, "is_primary", 0)
