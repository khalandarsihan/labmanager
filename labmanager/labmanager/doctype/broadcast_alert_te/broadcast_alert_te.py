# Copyright (c) 2026, Khalandar Sihan and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime


class BroadcastAlertTE(Document):
	@frappe.whitelist()
	def send_alert(self):
		"""
		Send a WhatsApp broadcast alert to all targeted parents.
		Enqueues each message individually so one failure doesn't block others.
		"""
		if self.status not in ("Draft", "Failed"):
			frappe.throw("Only Draft or Failed alerts can be sent.")

		students = self._get_target_students()
		if not students:
			frappe.throw("No active students found for the selected target.")

		# Mark as Sending so the button is hidden while in progress
		self.db_set("status", "Sending")
		frappe.db.commit()

		sent = 0
		failed = 0
		for student in students:
			parent = frappe.db.get_value(
				"Parent Contact",
				{"student": student.name},
				["name", "whatsapp_number"],
				as_dict=True,
			)
			if not parent or not parent.whatsapp_number:
				failed += 1
				continue

			# Create Notification Log TE
			nlog = frappe.get_doc({
				"doctype": "Notification Log TE",
				"student": student.name,
				"parent_contact": parent.name,
				"message_type": "Broadcast",
				"whatsapp_number": parent.whatsapp_number,
				"message_preview": f"{self.title}: {self.message[:100]}",
			})
			nlog.insert(ignore_permissions=True)

			# Dispatch WhatsApp in background
			frappe.enqueue(
				"labmanager.labmanager.whatsapp.api.send_broadcast_alert",
				nlog_name=nlog.name,
				title=self.title,
				message=self.message,
				queue="short",
			)
			sent += 1

		frappe.db.commit()
		self.db_set({
			"status": "Sent" if sent > 0 else "Failed",
			"sent_at": now_datetime(),
			"sent_count": sent,
			"failed_count": failed,
		})
		frappe.db.commit()

		frappe.msgprint(
			f"Alert dispatched to {sent} parent(s). {failed} skipped (no WhatsApp number).",
			title="Alert Sent",
			indicator="green" if sent > 0 else "orange",
		)

	def _get_target_students(self) -> list:
		"""Return Student Profile rows based on target_type."""
		if self.target_type == "Individual Student":
			sp = frappe.db.get_value(
				"Student Profile", self.student, ["name", "full_name"], as_dict=True
			)
			return [sp] if sp else []

		filters = {"is_active": 1}
		if self.target_type == "Batch":
			# Get all students enrolled in this batch
			rows = frappe.db.sql(
				"""
				SELECT sp.name, sp.full_name
				FROM `tabStudent Profile` sp
				INNER JOIN `tabStudent Batch Enrollment` sbe ON sbe.parent = sp.name
				WHERE sbe.batch = %s AND sbe.is_active = 1
				""",
				self.batch,
				as_dict=True,
			)
			return rows

		# All Students
		return frappe.get_all(
			"Student Profile",
			filters={},
			fields=["name", "full_name"],
		)
