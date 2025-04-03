# Student Registration doctype hooks in student_registration.py
import frappe
from frappe.model.document import Document
from labmanager.timeline_service import create_timeline_entry, ensure_initial_timeline_entry
from labmanager.utils import create_default_document_requirements, get_default_next_steps

class StudentRegistration(Document):
    def validate(self):
        # Set default values for new registrations
        if not self.is_new():
            return
            
        if not self.status:
            self.status = "Submitted"
            
        if not self.next_steps:
            self.next_steps = get_default_next_steps("Submitted")
    
    def after_insert(self):
        # Ensure initial timeline entry exists
        ensure_initial_timeline_entry(self)
        
        # Create default document requirements if needed
        if frappe.db.count("Required Document", filters={"registration_id": self.name}) == 0:
            create_default_document_requirements(self)
    
    def on_update(self):
        # Track status changes
        if self.has_value_changed("status"):
            old_status = self.get_db_value("status") or "Submitted"
            
            # Create timeline entry for status change
            description = f"Application status changed from {old_status} to {self.status}"
            create_timeline_entry(
                self.name, 
                self.status, 
                description,
                frappe.session.user
            )