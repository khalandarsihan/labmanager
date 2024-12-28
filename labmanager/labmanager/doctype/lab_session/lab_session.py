# # Copyright (c) 2024, Khalandar Sihan and contributors
# # For license information, please see license.txt

import frappe
from frappe.model.document import Document
from labmanager.labmanager.lab_core.session_manager import LabSessionManager
import secrets
import string
from datetime import datetime

class LabSession(Document):
    def before_insert(self):
        """Generate initial session details and metadata."""
        # Basic status
        if not self.status:
            self.status = "Draft"
        
        # Set default duration if not specified
        if not self.duration:
            self.duration = 3600  # 1 hour in seconds
        
        # Set start time
        self.start_time = datetime.now()
        
        # Calculate end time based on duration
        self.end_time = frappe.utils.add_to_date(self.start_time, self.duration)
        
        # Record user info
        self.user = frappe.session.user
        self.user_ip = frappe.local.request_ip
        self.user_agent = frappe.get_request_header('User-Agent')

    def after_insert(self):
        """Create container and Guacamole connection after document is created."""
        if self.status == "Draft":
            session_mgr = LabSessionManager()
            try:
                result = session_mgr.create_session(self)
                
                # Update container details
                self.container_id = result.get("container_id")
                self.container_name = result.get("container_name")
                self.container_port = result.get("port")
                self.image_name = result.get("image_name")
                self.image_id = result.get("image_id")
                
                # Update Guacamole details
                self.guacamole_connection_id = result.get("connection_id")
                self.guacamole_connection_name = result.get("connection_name")
                self.guacamole_url = result.get("connection_url")
                
                # Update credentials
                self.username = result.get("username")
                self.password = result.get("password")  # This should be encrypted
                
                # Update status and metadata
                self.status = "Active"
                self.last_activity = datetime.now()
                self.connection_attempts = 0
                self.session_logs = []
                
                self.db_update()
                
                # Log session creation
                self.add_session_log("Session created successfully")
                
            except Exception as e:
                error_msg = f"Lab Session Creation Error: {str(e)}"
                frappe.log_error(error_msg, "Lab Session Creation")
                self.add_session_log(error_msg, log_type="Error")
                raise

    def on_update(self):
        """Handle updates to the session document."""
        self.last_activity = datetime.now()
        if self.status == "Active":
            # Check if session has expired
            if frappe.utils.now_datetime() > self.end_time:
                self.end_session("Session expired")

    def on_trash(self):
        """Clean up resources when document is deleted."""
        try:
            if self.container_id or self.guacamole_connection_id:
                session_mgr = LabSessionManager()
                session_mgr.cleanup_session(self)
                self.add_session_log("Resources cleaned up during deletion")
        except Exception as e:
            error_msg = f"Cleanup Error: {str(e)}"
            frappe.log_error(error_msg, "Lab Session Cleanup")
            self.add_session_log(error_msg, log_type="Error")

    def extend_session(self, duration: int):
        """Extend session duration."""
        if self.status != "Active":
            frappe.throw("Can only extend active sessions")
        
        old_end_time = self.end_time
        self.end_time = frappe.utils.add_seconds(self.end_time, duration)
        self.add_session_log(f"Session extended by {duration} seconds")
        self.save()

    def end_session(self, reason: str = "User requested"):
        """End the lab session and cleanup resources."""
        if self.status == "Active":
            try:
                # Call Flask API to cleanup resources
                flask_url = frappe.conf.get("flask_api_url", "http://localhost:5000")
                cleanup_payload = {
                    "container_id": self.container_id,
                    "image_name": self.image_name,
                    "username": self.username,
                    "connection_id": self.guacamole_connection_id
                }
                
                response = requests.post(
                    f"{flask_url}/api/end-lab-session",
                    json=cleanup_payload
                )
                response.raise_for_status()
                cleanup_result = response.json()
                
                if not cleanup_result.get("success"):
                    raise Exception(f"Resource cleanup failed: {cleanup_result.get('error')}")
                
                self.status = "Completed"
                self.actual_end_time = datetime.now()
                self.end_reason = reason
                
                self.add_session_log(f"Session ended: {reason}")
                self.save()
                
                return True
                
            except Exception as e:
                error_msg = f"Session End Error: {str(e)}"
                self.add_session_log(error_msg, log_type="Error")
                frappe.log_error(error_msg, "Lab Session End")
                raise Exception(f"Failed to end session: {str(e)}")
        
        return False
    
    def record_connection_attempt(self, success: bool = True):
        """Record a connection attempt to the lab session."""
        self.connection_attempts += 1
        status = "successful" if success else "failed"
        self.add_session_log(f"Connection attempt {status}")
        self.save()

    def add_session_log(self, message: str, log_type: str = "Info"):
        """Add an entry to session logs."""
        if not hasattr(self, 'session_logs'):
            self.session_logs = []
            
        log_entry = {
            "timestamp": str(datetime.now()),
            "type": log_type,
            "message": message
        }
        self.append("session_logs", log_entry)

    def get_connection_url(self):
        """Get Guacamole connection URL."""
        if not self.guacamole_connection_id:
            return None
        
        if not hasattr(self, 'guacamole_url') or not self.guacamole_url:
            session_mgr = LabSessionManager()
            self.guacamole_url = session_mgr.guacamole_mgr.get_connection_url(self.guacamole_connection_id)
            self.save()
            
        return self.guacamole_url

    def get_session_stats(self):
        """Get session statistics."""
        return {
            "duration": frappe.utils.time_diff_in_seconds(self.start_time, self.actual_end_time or frappe.utils.now_datetime()),
            "connection_attempts": self.connection_attempts,
            "status": self.status,
            "time_remaining": frappe.utils.time_diff_in_seconds(frappe.utils.now_datetime(), self.end_time) if self.status == "Active" else 0
        }