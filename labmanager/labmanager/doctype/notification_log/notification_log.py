# Copyright (c) 2026, Khalandar Sihan and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import now_datetime


class NotificationLog(Document):
	def before_insert(self):
		if not self.status:
			self.status = "Pending"

	@frappe.whitelist()
	def send(self):
		"""
		Dispatch the notification via the configured channel.
		Mark status Sent or Failed, and record sent_at / error_log.

		Extend this method with real gateway integrations (Twilio, MSG91, etc.).
		"""
		if self.status == "Sent":
			frappe.throw(_("This notification has already been sent."))

		try:
			if self.notification_type == "Email":
				self._send_email()
			elif self.notification_type in ("WhatsApp", "SMS"):
				# Placeholder — integrate your SMS/WhatsApp gateway here
				self._send_sms_or_whatsapp()

			self.status = "Sent"
			self.sent_at = now_datetime()
			self.error_log = None
		except Exception as exc:
			self.status = "Failed"
			self.error_log = str(exc)
			frappe.log_error(str(exc), "Notification Log Send Error")
		finally:
			self.save(ignore_permissions=True)

	def _send_email(self):
		contact = frappe.get_doc("Parent Contact", self.parent_contact)
		if not contact.email:
			frappe.throw(_("Parent Contact {0} has no email address.").format(self.parent_contact))
		frappe.sendmail(
			recipients=[contact.email],
			subject=_("Attendance Notification – TechEthica"),
			message=self.message,
		)

	def _send_sms_or_whatsapp(self):
		"""
		Stub for SMS / WhatsApp integration.
		Replace with your gateway client (e.g. MSG91, Twilio, WhatsApp Business API).
		"""
		contact = frappe.get_doc("Parent Contact", self.parent_contact)
		number = contact.whatsapp_number if self.notification_type == "WhatsApp" else contact.phone
		if not number:
			frappe.throw(
				_("Parent Contact {0} has no {1} number.").format(
					self.parent_contact, self.notification_type
				)
			)
		# TODO: Call your SMS/WhatsApp gateway API here
		frappe.logger().info(
			f"[NotificationLog] Would send {self.notification_type} to {number}: {self.message[:80]}…"
		)


@frappe.whitelist()
def send_notification(name: str):
	"""Whitelisted wrapper so the JS 'Send' button can call doc.send()."""
	doc = frappe.get_doc("Notification Log", name)
	doc.send()
	return {"status": doc.status, "sent_at": str(doc.sent_at)}
