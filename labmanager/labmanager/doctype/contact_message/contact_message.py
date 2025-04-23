# Copyright (c) 2025, Khalandar Sihan and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class ContactMessage(Document):
    def after_insert(self):
        """Send notifications after contact message is inserted"""
        try:
            # Standard Frappe notification
            self.send_frappe_notification()
            
            # Backup direct SMTP email sending
            self.send_direct_smtp_email()
        except Exception as e:
            frappe.log_error(f"Error in contact message notification: {str(e)}", "Contact Message")
    
    def send_frappe_notification(self):
        """Send notification using Frappe's email system"""
        try:
            # Get admin email from settings
            admin_email = frappe.db.get_single_value("Website Settings", "contact_email") or \
                        frappe.db.get_value("User", "Administrator", "email")
            
            if not admin_email:
                frappe.log_error("No admin email found for contact form notifications", "Contact Message")
                return
                
            subject = f"New Contact Message: {self.subject}"
            
            message = f"""
            <h3>New Contact Message Received</h3>
            <p><strong>From:</strong> {self.sender_name} ({self.email})</p>
            <p><strong>Subject:</strong> {self.subject}</p>
            <p><strong>Message:</strong></p>
            <div style="padding: 10px; border-left: 3px solid #ccc; margin-top: 10px;">
                {self.message}
            </div>
            <p>You can view this message in your system at:</p>
            <p>{frappe.utils.get_url()}/app/contact-message/{self.name}</p>
            """
            
            frappe.sendmail(
                recipients=[admin_email],
                subject=subject,
                message=message,
                delayed=False
            )
            
            frappe.logger().debug(f"Frappe notification sent to {admin_email}")
            
        except Exception as e:
            frappe.log_error(f"Failed to send Frappe notification: {str(e)}", "Contact Message")
    
    def send_direct_smtp_email(self):
        """Send email directly using SMTP as a backup method"""
        try:
            # Get admin email from settings
            admin_email = frappe.db.get_single_value("Website Settings", "contact_email") or \
                        frappe.db.get_value("User", "Administrator", "email")
            
            if not admin_email:
                frappe.log_error("No admin email found for direct SMTP email", "Contact Message")
                return
            
            # Get SMTP settings from Email Account
            email_accounts = frappe.get_all(
                "Email Account", 
                filters={"enable_outgoing": 1}, 
                fields=["email_id", "smtp_server", "smtp_port", "login_id", "password", "use_tls"]
            )
            
            if not email_accounts:
                frappe.log_error("No outgoing email account found for direct SMTP", "Contact Message")
                return
                
            # Use the first available email account
            email_account = email_accounts[0]
            
            # Create message
            msg = MIMEMultipart()
            msg['From'] = email_account.email_id
            msg['To'] = admin_email
            msg['Subject'] = f"[DIRECT SMTP] New Contact Message: {self.subject}"
            
            html_body = f"""
            <html>
            <body>
                <h3>New Contact Message Received (sent via direct SMTP)</h3>
                <p><strong>From:</strong> {self.sender_name} ({self.email})</p>
                <p><strong>Subject:</strong> {self.subject}</p>
                <p><strong>Message:</strong></p>
                <div style="padding: 10px; border-left: 3px solid #ccc; margin-top: 10px;">
                    {self.message}
                </div>
                <p>You can view this message in your system at:</p>
                <p>{frappe.utils.get_url()}/app/contact-message/{self.name}</p>
                <p><em>Note: This email was sent via direct SMTP as a backup method.</em></p>
            </body>
            </html>
            """
            
            msg.attach(MIMEText(html_body, 'html'))
            
            # Connect to SMTP server
            if email_account.use_tls:
                server = smtplib.SMTP(email_account.smtp_server, email_account.smtp_port)
                server.starttls()
            else:
                server = smtplib.SMTP(email_account.smtp_server, email_account.smtp_port)
                
            # Login if credentials provided
            if email_account.login_id and email_account.password:
                server.login(email_account.login_id, email_account.password)
                
            # Send email
            server.send_message(msg)
            server.quit()
            
            frappe.logger().debug(f"Direct SMTP email sent to {admin_email}")
            
        except Exception as e:
            frappe.log_error(f"Failed to send direct SMTP email: {str(e)}", "Contact Message")
            
    def on_trash(self):
        """Actions to perform when document is being deleted"""
        pass
        
    def on_update(self):
        """Actions to perform when document is updated"""
        # Send reply if status changed to 'Replied' and reply field is filled
        try:
            if hasattr(self, 'status') and self.status == 'Replied' and self.reply and not self.reply_date:
                self.reply_date = frappe.utils.now()
                self.replied_by = frappe.session.user
                self.send_reply_to_sender()
                self.save()  # Save again to update the reply_date field
        except Exception as e:
            frappe.log_error(f"Error in on_update: {str(e)}", "Contact Message")
            
    def send_reply_to_sender(self):
        """Send reply to the original sender"""
        try:
            subject = f"Re: {self.subject}"
            
            message = f"""
            <p>Dear {self.sender_name},</p>
            
            <p>Thank you for contacting TechEthica. Here is our response to your inquiry:</p>
            
            <div style="padding: 15px; background-color: #f5f5f5; border-left: 3px solid #4a5568; margin: 15px 0;">
                {self.reply}
            </div>
            
            <p>For reference, your original message was:</p>
            
            <div style="padding: 10px; background-color: #f9f9f9; border-left: 3px solid #718096; margin: 10px 0; color: #4a5568;">
                <em>{self.message}</em>
            </div>
            
            <p>If you have any further questions, please don't hesitate to contact us again.</p>
            
            <p>Best regards,<br>
            The TechEthica Team</p>
            """
            
            frappe.sendmail(
                recipients=[self.email],
                subject=subject,
                message=message,
                delayed=False
            )
            
            frappe.logger().debug(f"Reply sent to {self.email}")
            
        except Exception as e:
            frappe.log_error(f"Failed to send reply: {str(e)}", "Contact Message")