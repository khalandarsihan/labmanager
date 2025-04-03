# Required Document doctype hooks in required_document.py
import frappe
from frappe.model.document import Document
from labmanager.timeline_service import create_timeline_entry

class RequiredDocument(Document):
	def validate(self):
		self.validate_registration_id()

	def validate_registration_id(self):
		if self.registration_id and not frappe.db.exists("Student Registration", self.registration_id):
			frappe.throw("Invalid Registration ID")


	# When changing document status in required_document.py
	def on_update(self):
		# Track document status changes
		if self.has_value_changed("status"):
			# Create timeline entry for document status change
			old_status = self.get_db_value("status") or "Pending"
			
			# Determine description based on status change
			if self.status == "Submitted":
				description = f"Document '{self.document_type}' has been submitted for review"
			elif self.status == "Approved":
				description = f"Document '{self.document_type}' has been requested by admissions team"
			elif self.status == "Rejected":
				reason = f" - Reason: {self.rejection_reason}" if self.rejection_reason else ""
				description = f"Document '{self.document_type}' has been rejected{reason}"
			else:
				description = f"Document '{self.document_type}' status updated from {old_status} to {self.status}"
			
			# Create timeline entry
			create_timeline_entry(
				self.registration_id,
				status="Documents Requested",
				description=description,
				created_by=frappe.session.user
			)