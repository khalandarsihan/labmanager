# Copyright (c) 2026, Khalandar Sihan and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import now_datetime


class NotificationLogTE(Document):
	def before_insert(self):
		if not self.delivery_status:
			self.delivery_status = "Pending"
		self._populate_whatsapp_number()

	def _populate_whatsapp_number(self):
		"""Auto-fill WhatsApp number from the linked Parent Contact."""
		if self.parent_contact and not self.whatsapp_number:
			contact = frappe.get_doc("Parent Contact", self.parent_contact)
			self.whatsapp_number = contact.get_whatsapp_number()

	@frappe.whitelist()
	def mark_sent(self, meta_message_id: str = ""):
		"""Mark notification as Sent. Called after successful WhatsApp API dispatch."""
		self.delivery_status = "Sent"
		self.sent_at = now_datetime()
		if meta_message_id:
			self.meta_message_id = meta_message_id
		self.save(ignore_permissions=True)

	@frappe.whitelist()
	def mark_failed(self, error: str = ""):
		"""Mark notification as Failed with an error message."""
		self.delivery_status = "Failed"
		self.error_message = error
		self.save(ignore_permissions=True)


@frappe.whitelist()
def create_absent_alert(student: str, class_log: str) -> str:
	"""
	Create an Absent Alert Notification Log TE for a student.
	Called automatically when a Student Attendance TE is marked Absent.
	Returns the name of the created Notification Log TE.
	"""
	parent_contact = frappe.db.get_value(
		"Parent Contact", {"student": student}, "name"
	)
	if not parent_contact:
		return ""

	log_info = frappe.db.get_value(
		"Class Conducted Log",
		class_log,
		["date", "subject", "batch"],
		as_dict=True,
	)

	student_name = frappe.db.get_value("Student Profile", student, "full_name") or student

	message = (
		f"Dear Parent,\n\n"
		f"Your ward *{student_name}* was marked *Absent* for "
		f"{log_info.subject} on {log_info.date} (Batch: {log_info.batch}).\n\n"
		f"Please contact the school for more information.\n\n"
		f"— TechEthica"
	)

	doc = frappe.get_doc(
		{
			"doctype": "Notification Log TE",
			"student": student,
			"parent_contact": parent_contact,
			"message_type": "Absent Alert",
			"message_preview": message,
		}
	)
	doc.insert(ignore_permissions=True)

	# Dispatch WhatsApp in background so the attendance flow is not blocked
	frappe.enqueue(
		"labmanager.labmanager.whatsapp.api.send_absent_alert",
		nlog_name=doc.name,
		queue="short",
	)

	return doc.name
