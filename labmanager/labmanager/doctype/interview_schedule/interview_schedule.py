# Interview Schedule doctype hooks in interview_schedule.py
import frappe
from frappe.model.document import Document
from labmanager.timeline_service import create_timeline_entry
from labmanager.utils import create_default_document_requirements, get_default_next_steps

class InterviewSchedule(Document):
    def validate(self):
        self.validate_registration_id()
    
    def validate_registration_id(self):
        if self.registration_id and not frappe.db.exists("Student Registration", self.registration_id):
            frappe.throw("Invalid Registration ID")
    
    def after_insert(self):
        # Create timeline entry for new interview
        description = f"Interview scheduled for {self.date} at {self.time}"
        if self.location:
            description += f" at {self.location}"
        
        create_timeline_entry(
            self.registration_id,
            "Interview Scheduled",
            description,
            frappe.session.user
        )
        
        # Update application status if needed
        registration_doc = frappe.get_doc("Student Registration", self.registration_id)
        if registration_doc.status != "Interview Scheduled":
            registration_doc.status = "Interview Scheduled"
            registration_doc.next_steps = get_default_next_steps("Interview Scheduled")
            registration_doc.save()
    
    def on_update(self):
        # Track interview status changes
        if self.has_value_changed("status"):
            old_status = self.get_db_value("status") or "Scheduled"
            
            # Create timeline entry based on the change
            if self.status == "Completed":
                description = f"Interview on {self.date} completed"
            elif self.status == "Cancelled":
                description = f"Interview on {self.date} cancelled"
            elif self.status == "Missed":
                description = f"Interview on {self.date} marked as missed"
            else:
                description = f"Interview status changed from {old_status} to {self.status}"
            
            create_timeline_entry(
                self.registration_id,
                "Interview Scheduled",
                description,
                frappe.session.user
            )