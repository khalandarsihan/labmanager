# # Copyright (c) 2024, Khalandar Sihan and contributors
# # For license information, please see license.txt

import frappe
from frappe import _
from typing import Dict, Any
from .container_manager import ContainerManager
from .guacamole_manager import GuacamoleManager

class LabSessionManager:
    def __init__(self):
        self.container_mgr = ContainerManager()
        self.guacamole_mgr = GuacamoleManager()

    def create_session(self, lab_session: 'frappe.model.document.Document') -> Dict[str, Any]:
        """Create a complete lab session with container and Guacamole access."""
        try:
            # Create container
            container_info = self.container_mgr.create_container(lab_session)
            lab_session.container_id = container_info['container_id']
            lab_session.port = container_info['port']

            # Create Guacamole connection
            connection = self.guacamole_mgr.create_connection(lab_session)
            lab_session.guacamole_connection_id = connection['identifier']
            
            # Update session status
            lab_session.status = 'Active'
            lab_session.save()

            return {
                "session_id": lab_session.name,
                "connection_url": self.guacamole_mgr.get_connection_url(connection['identifier']),
                "status": "active"
            }

        except Exception as e:
            self.cleanup_session(lab_session)
            frappe.log_error(
                message=f"Session creation failed: {str(e)}",
                title="Lab Session Error"
            )
            raise

    def cleanup_session(self, lab_session: 'frappe.model.document.Document'):
        """Clean up session resources."""
        if lab_session.container_id:
            self.container_mgr.cleanup_container(lab_session.container_id)
        
        if lab_session.guacamole_connection_id:
            self.guacamole_mgr.delete_connection(lab_session.guacamole_connection_id)

    def get_session_status(self, lab_session: 'frappe.model.document.Document') -> Dict[str, Any]:
        """Get current session status."""
        status = {
            "session_id": lab_session.name,
            "status": lab_session.status
        }

        if lab_session.container_id:
            status.update(self.container_mgr.get_container_status(lab_session.container_id))

        return status