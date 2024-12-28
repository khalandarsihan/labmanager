# labmanager/labmanager/api/test_lab_api.py

import unittest
import frappe
from frappe.utils import now_datetime

class TestLabAPI(unittest.TestCase):
    def test_session_lifecycle(self):
        # Create session
        response = frappe.call('labmanager.api.lab.create_lab_session', 
                             template="Test Ubuntu Lab")
        session_id = response['session_id']
        self.assertIsNotNone(session_id)
        
        # Check status
        status = frappe.call('labmanager.api.lab.get_session_status', 
                            session_id=session_id)
        self.assertEqual(status['status'], 'Active')
        
        # Extend session
        extended = frappe.call('labmanager.api.lab.extend_session', 
                             session_id=session_id, 
                             duration=1800)
        self.assertTrue(extended['end_time'] > status['end_time'])
        
        # Get metrics
        metrics = frappe.call('labmanager.api.lab.get_session_metrics', 
                            session_id=session_id)
        self.assertIsNotNone(metrics['cpu_usage'])
        
        # Terminate session
        result = frappe.call('labmanager.api.lab.terminate_session', 
                           session_id=session_id)
        self.assertEqual(result['status'], 'success')