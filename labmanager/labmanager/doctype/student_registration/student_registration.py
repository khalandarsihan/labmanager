# # Student Registration doctype hooks in student_registration.py
# import frappe
# from frappe.model.document import Document
# from labmanager.timeline_service import create_timeline_entry, ensure_initial_timeline_entry
# from labmanager.utils import create_default_document_requirements, get_default_next_steps

# class StudentRegistration(Document):
#     def validate(self):
#         # Set default values for new registrations
#         if not self.is_new():
#             return
            
#         if not self.status:
#             self.status = "Submitted"
            
#         if not self.next_steps:
#             self.next_steps = get_default_next_steps("Submitted")
    
#     def after_insert(self):
#         # Ensure initial timeline entry exists
#         ensure_initial_timeline_entry(self)
        
#         # Create default document requirements if needed
#         if frappe.db.count("Required Document", filters={"registration_id": self.name}) == 0:
#             create_default_document_requirements(self)
    
#     def on_update(self):
#         # Track status changes
#         if self.has_value_changed("status"):
#             old_status = self.get_db_value("status") or "Submitted"
            
#             # Create timeline entry for status change
#             description = f"Application status changed from {old_status} to {self.status}"
#             create_timeline_entry(
#                 self.name, 
#                 self.status, 
#                 description,
#                 frappe.session.user
#             )

# Student Registration doctype hooks in student_registration.py
import frappe
from frappe.model.document import Document
from labmanager.timeline_service import create_timeline_entry, ensure_initial_timeline_entry
from labmanager.utils import create_default_document_requirements, get_default_next_steps

class StudentRegistration(Document):
    def validate(self):
        # Set default values for new registrations
        if self.is_new():
            if not self.status:
                self.status = "Submitted"
                
            if not self.next_steps:
                self.next_steps = get_default_next_steps("Submitted")
        else:
            # Always update next_steps when status changes (for existing documents)
            if self.has_value_changed("status"):
                self.next_steps = get_default_next_steps(self.status)
    
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
            
            # Send acceptance notification if status changed to Accepted
            if self.status == "Accepted":
                try:
                    from labmanager.api.api import send_acceptance_notification
                    send_acceptance_notification(self.registration_id)
                except Exception as e:
                    frappe.log_error(f"Failed to send acceptance notification: {str(e)}", "Acceptance Email Error")

                self._create_student_profile()

    def _create_student_profile(self):
        """Create a Student Profile from this registration if one doesn't exist yet."""
        if self.student_profile:
            return

        # Check if a profile was already created for this registration (e.g. from a previous save)
        existing = frappe.db.get_value("Student Profile", {"registration": self.name}, "name")
        if existing:
            frappe.db.set_value("Student Registration", self.name, "student_profile", existing)
            return

        parts = [self.first_name, self.middle_name, self.last_name]
        full_name = " ".join(p for p in parts if p)

        profile = frappe.get_doc({
            "doctype": "Student Profile",
            "full_name": full_name,
            "registration": self.name,
        })
        profile.insert(ignore_permissions=True)
        frappe.db.set_value("Student Registration", self.name, "student_profile", profile.name)
        frappe.msgprint(
            f"Student Profile {profile.name} created for {full_name}.",
            alert=True,
        )