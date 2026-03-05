# Copyright (c) 2026, Khalandar Sihan and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document


class ParentContact(Document):
	def before_insert(self):
		self._generate_portal_token()

	def after_insert(self):
		"""Send portal link WhatsApp after doc is saved."""
		try:
			from labmanager.portal.api import send_portal_link_whatsapp
			send_portal_link_whatsapp(self.name)
		except Exception:
			frappe.log_error(frappe.get_traceback(), "Parent Portal Link WhatsApp on Insert")

	def validate(self):
		self._validate_primary_contact_number()

	def _generate_portal_token(self):
		"""Generate a permanent (no-expiry) portal token."""
		from labmanager.portal.token_utils import generate_portal_token
		self.portal_token = generate_portal_token()
		# Token is permanent — no expiry set

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

	def get_whatsapp_number(self) -> str | None:
		"""Return the WhatsApp number of the primary contact."""
		if self.primary_contact == "Father":
			return self.father_whatsapp
		return self.mother_whatsapp
