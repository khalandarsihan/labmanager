# Copyright (c) 2025, Khalandar Sihan and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime

class EventComment(Document):
    def before_insert(self):
        # Set comment date if not already set
        if not self.comment_date:
            self.comment_date = now_datetime()
        
        # Get IP address from request
        try:
            self.ip_address = frappe.request.environ.get('REMOTE_ADDR')
        except Exception:
            pass
    
    def after_insert(self):
        # Notify admin about new comment
        self.notify_admin()
    
    def notify_admin(self):
        """Notify admin about new comment"""
        try:
            # Get event details
            event = frappe.get_doc("Events", self.event)
            
            # Send email
            frappe.sendmail(
                recipients=[frappe.get_value("Website Settings", "Website Settings", "admin_email") or "admin@example.com"],
                sender=frappe.get_value("Website Settings", "Website Settings", "default_sender"),
                subject=f"New Comment on Event: {event.title}",
                message=f"""
                <p>A new comment has been posted on the event "{event.title}".</p>
                
                <p><strong>Name:</strong> {self.name1}<br>
                <strong>Email:</strong> {self.email}<br>
                <strong>Date:</strong> {self.comment_date}</p>
                
                <p><strong>Comment:</strong><br>
                {self.comment}</p>
                
                <p>Status: {self.status}</p>
                
                <p>Please review and approve/reject this comment.</p>
                
                <p><a href="{frappe.utils.get_url()}/desk#Form/Event%20Comment/{self.name}">View Comment</a></p>
                """
            )
        except Exception as e:
            frappe.log_error(f"Failed to send comment notification email: {str(e)}", "Event Comment")