# Copyright (c) 2025, Khalandar Sihan and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime

class EventRSVP(Document):
    def before_insert(self):
        # Set registration date if not already set
        if not self.registration_date:
            self.registration_date = now_datetime()
    
    def after_insert(self):
        # Send email notification to the user
        self.send_confirmation_email()
    
    def send_confirmation_email(self):
        """Send a confirmation email to the user"""
        try:
            # Get event details
            event = frappe.get_doc("Events", self.event)
            
            # Send email
            frappe.sendmail(
                recipients=[self.email],
                sender=frappe.get_value("Website Settings", "Website Settings", "default_sender"),
                subject=f"RSVP Confirmation: {event.title}",
                message=f"""
                <p>Dear {self.name1},</p>
                
                <p>Thank you for registering for {event.title} on {event.date}.</p>
                
                <p>Location: {event.location}</p>
                
                <p>Status: {self.status}</p>
                
                <p>We look forward to seeing you there!</p>
                
                <p>Regards,<br>
                TechEthica Team</p>
                """
            )
        except Exception as e:
            frappe.log_error(f"Failed to send RSVP confirmation email: {str(e)}", "Event RSVP")