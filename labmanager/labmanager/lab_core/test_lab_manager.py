# labmanager/labmanager/lab_core/test_lab_manager.py

import unittest
import frappe
import time
from labmanager.labmanager.lab_core.session_manager import LabSessionManager
from labmanager.labmanager.lab_core.container_manager import ContainerManager

class TestLabManager(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Any one-time setup needed
        pass

    def setUp(self):
        """Create test data before each test."""
        self.cleanup_test_data()
        
        # Create test template
        self.template = frappe.get_doc({
            "doctype": "Lab Template",
            "template_name": "Test Ubuntu Lab",
            "docker_image": "ubuntu-lab:latest",
            "cpu_limit": 1.0,
            "memory_limit": 512
        }).insert()

    def tearDown(self):
        """Clean up after each test."""
        self.cleanup_test_data()

    def cleanup_test_data(self):
        """Utility method to clean up test data."""
        # Delete lab sessions first (due to foreign key constraints)
        lab_sessions = frappe.get_all("Lab Session", filters={"lab_template": ["like", "Test%"]})
        for session in lab_sessions:
            try:
                frappe.delete_doc("Lab Session", session.name, force=1)
            except Exception:
                pass

        # Then delete templates
        templates = frappe.get_all("Lab Template", filters={"template_name": ["like", "Test%"]})
        for template in templates:
            try:
                frappe.delete_doc("Lab Template", template.name, force=1)
            except Exception:
                pass

    def test_session_creation(self):
        """Test basic lab session creation."""
        lab_session = frappe.get_doc({
            "doctype": "Lab Session",
            "lab_template": self.template.name,
            "user": "Administrator",
            "status": "Draft"
        }).insert()

        self.assertIsNotNone(lab_session.name)
        self.assertEqual(lab_session.status, "Active")
        self.assertIsNotNone(lab_session.container_id)
        self.assertIsNotNone(lab_session.guacamole_connection_id)

    def test_session_extension(self):
        """Test extending a lab session."""
        # Create session
        lab_session = frappe.get_doc({
            "doctype": "Lab Session",
            "lab_template": self.template.name,
            "user": "Administrator",
            "status": "Draft"
        }).insert()

        original_end_time = lab_session.end_time

        # Wait a moment to ensure time difference
        time.sleep(1)

        # Extend session
        lab_session.extend_session(duration=1800)  # extend by 30 minutes
        
        self.assertNotEqual(lab_session.end_time, original_end_time)
        self.assertTrue(lab_session.end_time > original_end_time)

    def test_session_cleanup(self):
        """Test proper cleanup of lab session resources."""
        # Create session
        lab_session = frappe.get_doc({
            "doctype": "Lab Session",
            "lab_template": self.template.name,
            "user": "Administrator",
            "status": "Draft"
        }).insert()

        container_id = lab_session.container_id
        guacamole_conn_id = lab_session.guacamole_connection_id

        # Delete session
        frappe.delete_doc("Lab Session", lab_session.name)

        # Verify container is removed
        container_mgr = ContainerManager()
        try:
            container_mgr.docker_client.containers.get(container_id)
            container_exists = True
        except:
            container_exists = False
        
        self.assertFalse(container_exists)

        # Verify Guacamole connection is removed
        session_mgr = LabSessionManager()
        self.assertFalse(session_mgr.guacamole_mgr.verify_connection(guacamole_conn_id))

    def test_concurrent_sessions(self):
        """Test creating multiple concurrent sessions."""
        sessions = []
        try:
            # Create 3 concurrent sessions
            for i in range(3):
                session = frappe.get_doc({
                    "doctype": "Lab Session",
                    "lab_template": self.template.name,
                    "user": "Administrator",
                    "status": "Draft"
                }).insert()
                sessions.append(session)

            # Verify all sessions are active
            for session in sessions:
                self.assertEqual(session.status, "Active")
                self.assertIsNotNone(session.container_id)
                self.assertIsNotNone(session.guacamole_connection_id)

        finally:
            # Cleanup
            for session in sessions:
                try:
                    frappe.delete_doc("Lab Session", session.name, force=1)
                except:
                    pass

                    