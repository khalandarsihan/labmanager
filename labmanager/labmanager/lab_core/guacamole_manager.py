# labmanager/labmanager/lab_core/guacamole_manager.py

import requests
from typing import Dict, Tuple, Any
import frappe
from frappe import _

class GuacamoleManager:
    def __init__(self):
        self.base_url = frappe.conf.get('guacamole_url', 'http://localhost:8181/guacamole')
        self.admin_user = frappe.conf.get('guacamole_user', 'guacadmin')
        self.admin_pass = frappe.conf.get('guacamole_pass', 'guacadmin')

    def authenticate(self) -> Tuple[str, str]:
        """Authenticate with Guacamole and return token and datasource."""
        try:
            data = {
                "username": self.admin_user,
                "password": self.admin_pass
            }
            headers = {"Content-Type": "application/x-www-form-urlencoded"}
            
            response = requests.post(
                f"{self.base_url}/api/tokens",
                data=data,
                headers=headers
            )
            response.raise_for_status()
            
            data = response.json()
            auth_token = data.get("authToken")
            data_source = data.get("dataSource")

            if not auth_token or not data_source:
                raise ValueError(_("Authentication failed: Missing authToken or dataSource"))

            return auth_token, data_source

        except Exception as e:
            frappe.log_error(
                message=f"Guacamole authentication failed: {str(e)}",
                title="Guacamole Authentication Error"
            )
            raise

    def get_headers(self, auth_token: str) -> Dict[str, str]:
        """Get standardized headers for all API calls."""
        return {
            "Authorization": f"Bearer {auth_token}",
            "Guacamole-Token": auth_token,
            "Content-Type": "application/json"
        }

    def create_connection(self, lab_session: 'frappe.model.document.Document') -> Dict[str, Any]:
        """Create a new Guacamole connection for a lab session."""
        try:
            auth_token, datasource = self.authenticate()
            
            connection_data = {
                "name": f"Lab-{lab_session.name}",
                "protocol": "ssh",
                "parameters": {
                    "hostname": "host.docker.internal",
                    "port": str(lab_session.port),
                    "username": lab_session.username,
                    "password": lab_session.get_password('password'),
                    "enable-sftp": "false",
                    "sftp-root-directory": "/",
                    "color-scheme": "green-black"
                },
                "attributes": {
                    "max-connections": "1",
                    "max-connections-per-user": "1"
                }
            }

            url = f"{self.base_url}/api/session/data/{datasource}/connections?token={auth_token}"
            response = requests.post(
                url,
                json=connection_data,
                headers=self.get_headers(auth_token)
            )
            response.raise_for_status()
            
            return response.json()

        except Exception as e:
            frappe.log_error(
                message=f"Failed to create Guacamole connection: {str(e)}",
                title="Guacamole Connection Error"
            )
            raise

    def delete_connection(self, connection_id: str) -> bool:
        """Delete a Guacamole connection."""
        try:
            auth_token, datasource = self.authenticate()
            
            url = f"{self.base_url}/api/session/data/{datasource}/connections/{connection_id}"
            response = requests.delete(
                url,
                headers=self.get_headers(auth_token)
            )
            response.raise_for_status()
            return True

        except Exception as e:
            frappe.log_error(
                message=f"Failed to delete Guacamole connection: {str(e)}",
                title="Guacamole Deletion Error"
            )
            return False

    def get_connection_url(self, connection_id: str) -> str:
        """Get the Guacamole connection URL."""
        return f"{self.base_url}/#/client/{connection_id}"

    def verify_connection(self, connection_id: str) -> bool:
        """Verify if a Guacamole connection exists and is accessible."""
        try:
            auth_token, datasource = self.authenticate()
            
            url = f"{self.base_url}/api/session/data/{datasource}/connections/{connection_id}"
            response = requests.get(
                url,
                headers=self.get_headers(auth_token)
            )
            return response.status_code == 200

        except Exception:
            return False