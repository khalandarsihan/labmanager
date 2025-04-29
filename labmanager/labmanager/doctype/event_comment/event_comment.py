import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime

class EventComment(Document):
    def before_insert(self):
        # Set comment date if not already set
        if not self.comment_date:
            self.comment_date = now_datetime()
        
        # Set initial status to Pending if not specified
        if not self.status:
            self.status = "Pending"
        
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
            
            # Get admin email - with fallback options
            admin_email = frappe.get_value("Website Settings", "Website Settings", "admin_email")
            if not admin_email:
                # Try to get from ERPNext settings or use a default email
                admin_email = frappe.get_value("Website Settings", "Website Settings", "contact_email") or "admin@example.com"
            
            # Send email
            frappe.sendmail(
                recipients=[admin_email],
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
                
                <p>To quickly approve this comment, you can use the following API call:</p>
                <p><code>{frappe.utils.get_url()}/api/method/labmanager.api.events.update_comment_status?comment_id={self.name}&status=Approved</code></p>
                """
            )
        except Exception as e:
            frappe.log_error(f"Failed to send comment notification email: {str(e)}", "Event Comment")
    
    def on_update(self):
        """Handle status change notifications"""
        # Check if status field was changed to Approved or Rejected
        if self.has_value_changed("status") and self.status in ["Approved", "Rejected"]:
            self.notify_user_about_status_change()
    
    def notify_user_about_status_change(self):
        """Notify user about comment status change"""
        try:
            # Get event details
            event = frappe.get_doc("Events", self.event)
            
            # Email subject and message
            subject = f"Your comment on '{event.title}' has been {self.status.lower()}"
            
            if self.status == "Approved":
                message = f"""
                <p>Dear {self.name1},</p>
                
                <p>Your comment on the event "{event.title}" has been approved and is now visible on the website.</p>
                
                <p><strong>Your comment:</strong><br>
                {self.comment}</p>
                
                <p>Thank you for your participation!</p>
                
                <p>Regards,<br>
                TechEthica Team</p>
                """
            else:  # Rejected
                message = f"""
                <p>Dear {self.name1},</p>
                
                <p>We regret to inform you that your comment on the event "{event.title}" has not been approved.</p>
                
                <p>This can happen for various reasons, including community guidelines or relevance to the event.</p>
                
                <p>Thank you for your understanding.</p>
                
                <p>Regards,<br>
                TechEthica Team</p>
                """
                
            # Send email
            frappe.sendmail(
                recipients=[self.email],
                sender=frappe.get_value("Website Settings", "Website Settings", "default_sender"),
                subject=subject,
                message=message
            )
        except Exception as e:
            frappe.log_error(f"Failed to notify user about comment status: {str(e)}", "Event Comment")