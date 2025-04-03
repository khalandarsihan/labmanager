# Copyright (c) 2025, Khalandar Sihan and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class ApplicationTimeline(Document):
    def validate(self):
        # Ensure registration_id is valid
        if self.registration_id:
            if not frappe.db.exists("Student Registration", self.registration_id):
                frappe.throw("Invalid Registration ID")
        
        # Set current user if not provided
        if not self.created_by:
            self.created_by = frappe.session.user
            if self.created_by == "Guest":
                self.created_by = "Administrator"
    
    def before_insert(self):
        # Set current datetime if not provided
        if not self.date:
            self.date = frappe.utils.now_datetime()