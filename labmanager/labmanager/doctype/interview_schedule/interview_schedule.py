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
        # Create timeline entry for NEW interview
        description = f"Interview scheduled for {self.date} at {self.time}"
        if self.location:
            description += f" at {self.location}"
        
        # Use Admissions Team
        created_by = "Admissions Team"
        
        create_timeline_entry(
            self.registration_id,
            "Interview Scheduled",
            description,
            created_by
        )
        
        # Update application status if needed
        registration_doc = frappe.get_doc("Student Registration", self.registration_id)
        if registration_doc.status != "Interview Scheduled":
            registration_doc.status = "Interview Scheduled"
            registration_doc.next_steps = get_default_next_steps("Interview Scheduled")
            registration_doc.save()

    def on_update(self):
        """
        Update timeline when interview details change, but only when actual changes occur
        """
        # Track if this was a new record being created - don't create redundant entries
        is_new_record = self.is_new()
        
        # Check if date or time has changed
        if not is_new_record and (self.has_value_changed("date") or self.has_value_changed("time") or self.has_value_changed("location")):
            # Get old values
            old_date = self.get_db_value("date")
            old_time = self.get_db_value("time")
            old_location = self.get_db_value("location") or ""
            
            # Only create a timeline entry if there's an actual change
            date_changed = self.has_value_changed("date")
            time_changed = self.has_value_changed("time")
            location_changed = self.location != old_location
            
            
            if date_changed or time_changed or location_changed:
                # Create a new timeline entry with updated information
                description = f"Interview rescheduled to {self.date} at {self.time}"
                if self.location:
                    description += f" at {self.location}"
                    
                # Always use Admissions Team for interview updates
                created_by = "Admissions Team"
                
                # Create a new timeline entry
                create_timeline_entry(
                    self.registration_id,
                    "Interview Scheduled",
                    description,
                    created_by
                )
        
        # Handle status changes - but not for initial "Scheduled" status which is handled in after_insert
        if not is_new_record and self.has_value_changed("status"):
            # We want timeline entries for all status changes EXCEPT when setting to "Scheduled" 
            # during creation (that's handled in after_insert)
            old_status = self.get_db_value("status") or ""
            
            # Skip redundant "Scheduled" status updates since initial scheduling is handled in after_insert
            if self.status != "Scheduled" or old_status not in ["", None, "Scheduled"]:
                if self.status == "Completed":
                    description = f"Interview on {self.date} completed"
                elif self.status == "Cancelled":
                    description = f"Interview on {self.date} cancelled"
                elif self.status == "Missed":
                    description = f"Interview on {self.date} marked as missed"
                else:
                    description = f"Interview status updated to: {self.status}"
                
                # Create a timeline entry for status change
                create_timeline_entry(
                    self.registration_id,
                    "Interview Scheduled",
                    description,
                    "Admissions Team"
                )