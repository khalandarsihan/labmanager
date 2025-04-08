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



# In required_document.py
def on_update(self):
    # Track document status changes
    if self.has_value_changed("status"):
        # Get the creator - use someone meaningful 
        created_by = frappe.session.user
        if not created_by or created_by == "Guest":
            created_by = "Admissions Team"
        
        # If document is being submitted, use the student name
        if self.status == "Submitted":
            # Get student information
            student = frappe.get_doc("Student Registration", self.registration_id)
            if student:
                # Use full name format
                created_by = " ".join(filter(None, [
                    student.first_name,
                    student.middle_name,
                    student.last_name
                ]))
                
                # Check if an upload message already exists
                existing = frappe.get_all(
                    "Application Timeline",
                    filters={
                        "registration_id": self.registration_id,
                        "description": ["like", f"%{self.document_type}%uploaded%"]
                    },
                    limit=1
                )
                
                # If there's already an upload message, don't create a duplicate
                if existing:
                    return
        
        # Create timeline entry for document status change
        old_status = self.get_db_value("status") or "Pending"
        
        # Determine description based on status change
        if self.status == "Submitted":
            description = f"Document '{self.document_type}' has been submitted for review"
        elif self.status == "Approved":
            # SKIP timeline entry for initial document approval since it gets created in create_default_document_requirements
            return
        elif self.status == "Rejected":
            reason = f" - Reason: {self.rejection_reason}" if self.rejection_reason else ""
            description = f"Document '{self.document_type}' has been rejected{reason}"
        else:
            description = f"Document '{self.document_type}' status updated from {old_status} to {self.status}"
        
        # Create timeline entry with correct status name for uploads
        status = "Documents Uploaded" if self.status == "Submitted" else "Documents Requested"
        
        create_timeline_entry(
            self.registration_id,
            status=status,
            description=description,
            created_by=created_by
        )