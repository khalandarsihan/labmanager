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
                                 fields=["name", "first_name", "middle_name", "last_name"],
                                 limit=1)
            if regs:
                registration_id = regs[0].name
                # Always use complete name format (first + middle + last)
                student_name = " ".join(filter(None, [
                    regs[0].first_name, 
                    regs[0].middle_name, 
                    regs[0].last_name
                ]))
            else:
                frappe.logger().error(f"Invalid registration ID: {registration_id}")
                return None
        else:
            # Get student name if we have a valid registration ID
            student = frappe.get_doc("Student Registration", registration_id)
            # Always use complete name format (first + middle + last)
            student_name = " ".join(filter(None, [
                student.first_name, 
                student.middle_name, 
                student.last_name
            ]))
            
        # Check for duplicate entries if this is a submission entry
        if status == "Submitted" and description == "Application submitted successfully":
            # Check if any submission entries already exist
            existing = frappe.get_all(
                "Application Timeline",
                filters={
                    "registration_id": registration_id,
                    "status": "Submitted",
                    "description": "Application submitted successfully"
                },
                limit=1
            )
            
            if existing:
                # Update the existing entry with the full name format instead of creating a new one
                entry = frappe.get_doc("Application Timeline", existing[0].name)
                entry.created_by = student_name
                entry.save(ignore_permissions=True)
                frappe.db.commit()
                return existing[0].name
        
        # Skip redundant status changes
        if "changed from" in description:
            old_status = description.split("changed from ")[1].split(" to ")[0]
            new_status = description.split(" to ")[1]
            if old_status == new_status:
                return None  # Skip creating this entry

        # Set default user if not provided
        if not created_by:
            created_by = frappe.session.user
            
        # Special handling for Guest users - use student name instead of Administrator
        if created_by == "Guest" or created_by == "Student" or created_by == "Administrator":
            created_by = student_name
        
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
        # Check if any Submitted timeline entries exist
        existing = frappe.get_all(
            "Application Timeline",
            filters={
                "registration_id": registration_doc.name,
                "status": "Submitted",
                "description": "Application submitted successfully"
            },
            fields=["name"],
            limit=1
        )
        
        if not existing:
            # Use the complete name format
            student_name = " ".join(filter(None, [
                registration_doc.first_name,
                registration_doc.middle_name,
                registration_doc.last_name
            ]))
            
            create_timeline_entry(
                registration_doc.name,
                "Submitted",
                "Application submitted successfully",
                student_name
            )
        else:
            # Entry already exists, make sure it uses full name
            entry = frappe.get_doc("Application Timeline", existing[0].name)
            
            # Use the complete name format
            student_name = " ".join(filter(None, [
                registration_doc.first_name,
                registration_doc.middle_name,
                registration_doc.last_name
            ]))
            
            # Update the name if needed
            if entry.created_by != student_name:
                entry.created_by = student_name
                entry.save(ignore_permissions=True)
                frappe.db.commit()
            
        return True
        
    except Exception as e:
        frappe.logger().error(f"Error ensuring initial timeline: {str(e)}")
        return False