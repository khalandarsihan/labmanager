# timeline_service.py
import frappe
from frappe.utils import now_datetime

def create_timeline_entry(registration_id, status, description, created_by=None):
    """
    Centralized function to create application timeline entries
    
    Args:
        registration_id: Registration document name or encoded ID
        status: Status for the timeline entry
        description: Description of the action/event
        created_by: User who performed the action
    
    Returns:
        str: Timeline entry name if successful, None if failed
    """
    try:
        # Handle both encoded ID and document name
        if registration_id and not frappe.db.exists("Student Registration", registration_id):
            # Try to find by registration_id field
            regs = frappe.get_all("Student Registration", 
                                 filters={"registration_id": registration_id},
                                 fields=["name"],
                                 limit=1)
            if regs:
                registration_id = regs[0].name
            else:
                frappe.logger().error(f"Invalid registration ID: {registration_id}")
                return None
            
            # Skip redundant status changes
        if "changed from" in description:
            old_status = description.split("changed from ")[1].split(" to ")[0]
            new_status = description.split(" to ")[1]
            if old_status == new_status:
                return None  # Skip creating this entry

        
        # Set default user if not provided
        if not created_by:
            created_by = frappe.session.user
            if not created_by or created_by == "Guest":
                created_by = "Administrator"
        
        # Create timeline entry with error handling
        timeline_doc = frappe.get_doc({
            "doctype": "Application Timeline",
            "registration_id": registration_id,
            "date": now_datetime(),
            "status": status,
            "description": description,
            "created_by": created_by
        })
        
        # Insert with ignore_permissions to ensure it works for all users
        timeline_doc.insert(ignore_permissions=True)
        frappe.db.commit()
        
        frappe.logger().debug(f"Created timeline entry: {timeline_doc.name}")
        return timeline_doc.name
    
    except Exception as e:
        # Log error but don't fail the parent transaction
        frappe.logger().error(f"Error creating timeline entry: {str(e)}\n{frappe.get_traceback()}")
        return None

def get_application_timeline(registration_id):
    """
    Get all timeline entries for a registration
    
    Args:
        registration_id: Registration document name or encoded ID
        
    Returns:
        list: Timeline entries sorted by date
    """
    try:
        # Handle both encoded ID and document name
        doc_name = registration_id
        if registration_id and not frappe.db.exists("Student Registration", registration_id):
            # Try to find by registration_id field
            regs = frappe.get_all("Student Registration", 
                                 filters={"registration_id": registration_id},
                                 fields=["name"],
                                 limit=1)
            if regs:
                doc_name = regs[0].name
            else:
                return []
        
        # Get all timeline entries
        timeline = frappe.get_all(
            "Application Timeline",
            filters={"registration_id": doc_name},
            fields=["name", "date", "status", "description", "created_by"],
            order_by="date desc"
        )
        
        return timeline
    
    except Exception as e:
        frappe.logger().error(f"Error getting timeline: {str(e)}")
        return []

def ensure_initial_timeline_entry(registration_doc):
    """
    Ensure there's at least one timeline entry for submission
    
    Args:
        registration_doc: Student Registration document
        
    Returns:
        bool: True if entry exists or was created, False on error
    """
    try:
        # Check if any timeline entries exist
        existing = frappe.get_all(
            "Application Timeline",
            filters={"registration_id": registration_doc.name},
            limit=1
        )
        
        if not existing:
            # Create initial submission entry
            create_timeline_entry(
                registration_doc.name,
                "Submitted",
                "Application submitted successfully",
                "Administrator"  # Use administrator to ensure it works
            )
            
        return True
        
    except Exception as e:
        frappe.logger().error(f"Error ensuring initial timeline: {str(e)}")
        return False