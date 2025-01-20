# labmanager/labmanager/lab_core/container_manager.py

import docker
import socket
from typing import Dict, Tuple, Optional
import frappe
from frappe import _

class ContainerManager:
    def __init__(self, port_range: Tuple[int, int] = (49152, 65535)):
        self.docker_client = docker.from_env()
        self.port_range = port_range

    def find_available_port(self) -> int:
        """Find an available port in the specified range."""
        for port in range(self.port_range[0], self.port_range[1]):
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                try:
                    s.bind(('', port))
                    return port
                except socket.error:
                    continue
        raise Exception(_("No available ports found"))

    def create_container(self, lab_session: 'frappe.model.document.Document') -> Dict:
        """Create a container for a lab session."""
        try:
            # Get template details
            template = frappe.get_doc("Lab Template", lab_session.lab_template)
            port = self.find_available_port()

            # Create container
            container = self.docker_client.containers.run(
                template.docker_image,
                name=f"lab-{lab_session.name}",
                ports={'22/tcp': port},
                detach=True,
                environment={
                    "LAB_USER": lab_session.username,
                    "LAB_PASSWORD": lab_session.get_password('password')
                }
            )

            return {
                "container_id": container.id,
                "port": port,
                "status": "created"
            }

        except Exception as e:
            frappe.log_error(
                message=f"Container creation failed: {str(e)}",
                title="Lab Container Creation Error"
            )
            raise

    def cleanup_container(self, container_id: str) -> bool:
        """Remove a container."""
        try:
            container = self.docker_client.containers.get(container_id)
            container.remove(force=True)
            return True
        except Exception as e:
            frappe.log_error(
                message=f"Container cleanup failed: {str(e)}",
                title="Lab Container Cleanup Error"
            )
            return False

    def get_container_status(self, container_id: str) -> Dict:
        """Get container status and details."""
        try:
            container = self.docker_client.containers.get(container_id)
            return {
                "status": container.status,
                "running": container.status == "running",
                "details": container.attrs.get('State', {})
            }
        except Exception as e:
            frappe.log_error(
                message=f"Failed to get container status: {str(e)}",
                title="Lab Container Status Error"
            )
            return {"status": "error", "running": False, "details": {}}