import frappe
from frappe import _
from frappe.utils import now_datetime
from typing import Dict, Any

@frappe.whitelist()
def create_lab_session(template: str, user: str = None) -> Dict[str, Any]:
    """Create a new lab session."""
    if not user:
        user = frappe.session.user

    try:
        session = frappe.get_doc({
            "doctype": "Lab Session",
            "lab_template": template,
            "user": user,
            "status": "Draft",
            "start_time": now_datetime()
        }).insert()

        return {
            "session_id": session.name,
            "connection_url": session.get_connection_url(),
            "status": session.status
        }

    except Exception as e:
        frappe.log_error(str(e), "Lab Session Creation Error")
        frappe.throw(_("Failed to create lab session"))

@frappe.whitelist()
def get_session_status(session_id: str) -> Dict[str, Any]:
    """Get status of a lab session."""
    session = frappe.get_doc("Lab Session", session_id)
    if not session.has_permission("read"):
        frappe.throw(_("Not allowed to access this session"))

    return {
        "session_id": session.name,
        "status": session.status,
        "connection_url": session.get_connection_url(),
        "start_time": session.start_time,
        "end_time": session.end_time
    }

@frappe.whitelist()
def extend_session(session_id: str, duration: int) -> Dict[str, Any]:
    """Extend a lab session."""
    session = frappe.get_doc("Lab Session", session_id)
    if not session.has_permission("write"):
        frappe.throw(_("Not allowed to modify this session"))

    session.extend_session(duration)
    return get_session_status(session_id)



# labmanager/labmanager/api/lab.py

@frappe.whitelist()
def list_active_sessions(user: str = None) -> List[Dict[str, Any]]:
    """List all active sessions for a user."""
    filters = {"status": "Active"}
    if user:
        filters["user"] = user
    
    sessions = frappe.get_all(
        "Lab Session",
        filters=filters,
        fields=["name", "lab_template", "start_time", "end_time"]
    )
    
    return [{
        **session,
        "connection_url": frappe.get_doc("Lab Session", session.name).get_connection_url()
    } for session in sessions]

@frappe.whitelist()
def terminate_session(session_id: str) -> Dict[str, str]:
    """Immediately terminate a lab session."""
    session = frappe.get_doc("Lab Session", session_id)
    if not session.has_permission("write"):
        frappe.throw(_("Not allowed to modify this session"))
    
    session.status = "Completed"
    session.save()
    session.delete()
    
    return {"status": "success", "message": "Session terminated"}

@frappe.whitelist()
def get_session_metrics(session_id: str) -> Dict[str, Any]:
    """Get resource usage metrics for a session."""
    session = frappe.get_doc("Lab Session", session_id)
    if not session.has_permission("read"):
        frappe.throw(_("Not allowed to access this session"))
    
    container_mgr = ContainerManager()
    status = container_mgr.get_container_status(session.container_id)
    
    return {
        "session_id": session.name,
        "cpu_usage": status.get("details", {}).get("cpu_stats", {}),
        "memory_usage": status.get("details", {}).get("memory_stats", {}),
        "network_stats": status.get("details", {}).get("networks", {})
    }

@frappe.whitelist()
def reset_session(session_id: str) -> Dict[str, Any]:
    """Reset a lab session to its initial state."""
    session = frappe.get_doc("Lab Session", session_id)
    if not session.has_permission("write"):
        frappe.throw(_("Not allowed to modify this session"))
    
    # Store old details
    old_container = session.container_id
    old_connection = session.guacamole_connection_id
    
    # Create new container and connection
    session_mgr = LabSessionManager()
    new_session = session_mgr.create_session(session)
    
    # Cleanup old resources
    session_mgr.cleanup_session({
        "container_id": old_container,
        "guacamole_connection_id": old_connection
    })
    
    return get_session_status(session_id)

@frappe.whitelist()
def get_session_logs(session_id: str) -> Dict[str, Any]:
    """Get container logs for a session."""
    session = frappe.get_doc("Lab Session", session_id)
    if not session.has_permission("read"):
        frappe.throw(_("Not allowed to access this session"))
    
    container_mgr = ContainerManager()
    container = container_mgr.docker_client.containers.get(session.container_id)
    
    return {
        "session_id": session.name,
        "logs": container.logs(tail=100).decode('utf-8')  # Last 100 lines
    }