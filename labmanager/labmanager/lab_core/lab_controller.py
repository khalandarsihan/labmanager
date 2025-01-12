import frappe
import requests
from frappe import _
import traceback
from frappe.utils import cstr

@frappe.whitelist()
def get_active_session(dockerfile_id):
    """Get active session for a dockerfile if exists."""
    try:
        # Query for active session
        active_session = frappe.get_list(
            "Lab Session",
            filters={
                "dockerfile": dockerfile_id,
                "status": "Active",
                "user": frappe.session.user
            },
            fields=["name", "status", "start_time", "end_time", 
                   "username", "password", "guacamole_url",
                   "container_id", "image_name", "connection_attempts"],
            limit=1
        )

        if active_session:
            session = frappe.get_doc("Lab Session", active_session[0].name)
            return {
                "success": True,
                "session": session
            }
        
        return {
            "success": True,
            "session": None
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Get Active Session Failed"))
        return {
            "success": False,
            "error": str(e)
        }

@frappe.whitelist(allow_guest=True)
def start_lab_session(dockerfile_id, lab_course, lab_lesson, username, email):
    try:
        
        # Get or create the student user in Frappe
        user = get_or_create_student_user(username, email)
        
        # Set the user context
        frappe.set_user(user.name)
        
        
        # Validate input parameters
        if not dockerfile_id or not lab_course or not lab_lesson:
            return {
                "success": False,
                "error": "Missing required parameters"
            }
            
            
         # Get the dockerfile content from Lab Dockerfile document
        try:
           dockerfile = frappe.get_doc("Lab Dockerfile", dockerfile_id)
           dockerfile_content = dockerfile.dockerfile_content  # or whatever the field name is
           
           if not dockerfile_content:
               return {
                   "success": False,
                   "error": "Dockerfile content not found"
               }
        except Exception as e:
           return {
               "success": False,
               "error": f"Failed to get Dockerfile: {str(e)}"
           }


        # Generate consistent names
        session_id = frappe.generate_hash(length=8)
        container_name = f"lab-container-{session_id}"
        image_name = f"lab-image-{session_id}"

        # Get Flask API URL from config
        flask_url = frappe.conf.get("flask_api_url", "http://localhost:5000")
        
        # Check for existing active session
        active_session = get_active_session(dockerfile_id)
        if active_session.get("session"):
            return {
                "success": False,
                "error": "An active session already exists for this dockerfile"
            }

        # Prepare data for Flask API
        payload = {
            "dockerfile_id": dockerfile_id,
            "lab_course": lab_course,
            "lab_lesson": lab_lesson,
            "dockerfile_content": dockerfile_content,
            "user": frappe.session.user,
            "container_name": container_name,
            "image_name": image_name
        }
        
        # Validate payload before sending
        if not all(payload.values()):
            missing_fields = [k for k, v in payload.items() if not v]
            return {
                "success": False,
                "error": f"Missing required fields: {', '.join(missing_fields)}"
            }

        print("Debug: Sending payload to Flask:", payload)
        
        # Call Flask API with proper error handling
        try:
            response = requests.post(
                f"{flask_url}/api/launch-lab",
                json=payload,
                timeout=300  # 5-minute timeout for long operations
            )
            response.raise_for_status()
            data = response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to communicate with lab service: {str(e)}")

        if not data.get("success"):
            raise Exception(f"Lab service error: {data.get('error')}")

        # Create lab session record in Frappe
        lab_session = frappe.get_doc({
            "doctype": "Lab Session",
            "user": frappe.session.user,
            "dockerfile": dockerfile_id,
            "lab_course": lab_course,
            "lab_lesson": lab_lesson,
            "container_id": data.get("container_id"),
            "container_name": container_name,
            "image_name": image_name,
            "image_id": data.get("image_id"),
            "guacamole_connection_id": data.get("guacamole_connection_id"),
            "guacamole_url": data.get("guacamole_url"),
            "username": data.get("username"),
            "password": data.get("password"),
            "status": "Active",
            "user_ip": frappe.local.request_ip,
            "user_agent": frappe.get_request_header('User-Agent')
        })
        lab_session.insert()

        return {
            "success": True,
            "guacamole_url": data.get("guacamole_url"),
            "session_id": lab_session.name,
            "username": data.get("username"),
            "password": data.get("password")
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Lab Start Failed"))
        return {
            "success": False,
            "error": str(e)
        }
        
        
def get_or_create_student_user(username, email):
    """Get or create a student user in Frappe"""
    try:
        # Try to get existing user
        user = frappe.get_doc("User", email)
        return user
    except frappe.DoesNotExistError:
        # Create new user if doesn't exist
        user = frappe.get_doc({
            "doctype": "User",
            "email": email,
            "first_name": username,
            "username": username,
            "send_welcome_email": 0,
            "role_profile_name": "Student",  # Make sure you have this role profile
            "user_type": "System User",
            "module_profile": "LabManager"  # Make sure you have this module profile
        })
        user.insert(ignore_permissions=True)
        
        # Add student role
        user.add_roles("Student")
        
        return user

@frappe.whitelist()
def extend_lab_session(session_name, duration):
    try:
        session = frappe.get_doc("Lab Session", session_name)
        
        if session.status != "Active":
            return {
                "success": False,
                "error": "Session is not active"
            }

        # Convert duration to integer
        duration = int(duration)
        
        # Update end time
        session.end_time = frappe.utils.add_to_date(
            session.end_time,
            seconds=duration
        )
        session.save()

        return {
            "success": True,
            "message": f"Session extended by {duration} seconds",
            "new_end_time": session.end_time
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Lab Extension Failed"))
        return {
            "success": False,
            "error": str(e)
        }

@frappe.whitelist()
def get_lab_session_credentials(session_id):
    if not frappe.has_permission("Lab Session", "read"):
        frappe.throw(_("Not permitted"))
        
    session = frappe.get_doc("Lab Session", session_id)
    return {
        "username": session.username,
        "password": session.password,
        "guacamole_url": session.guacamole_url
    }

@frappe.whitelist()
def end_lab_session(session_name):
    """End a lab session and cleanup resources."""
    try:
        # Get the session document
        session = frappe.get_doc("Lab Session", session_name)
        
        if session.status != "Active":
            return {
                "success": False,
                "error": "Session is not active"
            }

        # Get Flask API URL from config
        flask_url = frappe.conf.get("flask_api_url", "http://localhost:5000")
        
        # Prepare cleanup payload
        cleanup_payload = {
            "container_id": session.container_id,
            "container_name": session.container_name,
            "image_id": session.image_id,
            "image_name": session.image_name,
            "username": session.username,
            "connection_id": session.guacamole_connection_id
        }

        # Call Flask API to cleanup resources
        try:
            response = requests.post(
                f"{flask_url}/api/end-lab-session",
                json=cleanup_payload
            )
            response.raise_for_status()
            cleanup_result = response.json()
            
            if not cleanup_result.get("success"):
                raise Exception(f"Resource cleanup failed: {cleanup_result.get('error')}")
            
            # Update session status
            session.status = "Completed"
            session.end_reason = "User requested"
            session.save()
            
            return {
                "success": True,
                "message": "Session ended successfully"
            }
            
        except requests.exceptions.RequestException as e:
            error_msg = f"Failed to communicate with cleanup service: {str(e)}"
            frappe.log_error(error_msg, "Lab Session End")
            return {
                "success": False,
                "error": error_msg
            }
            
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Lab End Failed"))
        return {
            "success": False,
            "error": str(e)
        }