import frappe
from frappe import _
import requests
import json


@frappe.whitelist(allow_guest=True)
def get_course_details(course_code):
    try:
        frappe.flags.ignore_permissions = True
        
        # Get the main course document
        course = frappe.get_doc("Course", course_code)
        
        # Get instructor details
        instructor = frappe.get_doc("Course Instructor", course.instructor)
        
        # Get prerequisites
        prerequisites = frappe.get_all(
            "Course Prerequisite", 
            filters={"course": course_code},
            fields=["prerequisite"],
            order_by="sequence",
            ignore_permissions=True
        )
        
        # Get learning objectives
        objectives = frappe.get_all(
            "Course Learning Objective", 
            filters={"course": course_code},
            fields=["objective"],
            order_by="sequence",
            ignore_permissions=True
        )
        
        # Get modules and their lessons
        modules = frappe.get_all(
            "Course Module", 
            filters={"course": course_code},
            fields=["name", "title", "description", "duration", "sequence"],
            order_by="sequence",
            ignore_permissions=True
        )
        
        for module in modules:
            # Get lessons for each module
            module.lessons = frappe.get_all(
                "Course Module Lesson", 
                filters={"module": module.name},
                fields=["title", "duration", "type", "preview_enabled", "sequence"],
                order_by="sequence",
                ignore_permissions=True
            )
        
        response = {
            "course_code": course.course_code,
            "title": course.title,
            "description": course.description,
            "duration": course.duration,
            "level": course.level,
            "price": course.price,
            "start_date": course.start_date,
            "status": course.status,
            "instructor": {
                "full_name": instructor.full_name,
                "title": instructor.title,
                "experience": instructor.experience,
                "image": instructor.image,
                "bio": instructor.bio
            },
            "prerequisites": [
                p.prerequisite for p in prerequisites
            ],
            "learning_objectives": [
                o.objective for o in objectives
            ],
            "syllabus": [
                {
                    "name": module.name,
                    "title": module.title,
                    "description": module.description,
                    "duration": module.duration,
                    "sequence": module.sequence,
                    "lessons": [
                        {
                            "title": lesson.title,
                            "duration": lesson.duration,
                            "type": lesson.type,
                            "preview_enabled": lesson.preview_enabled,
                            "sequence": lesson.sequence
                        }
                        for lesson in module.lessons
                    ]
                }
                for module in modules
            ]
        }
        
        return response

    except frappe.DoesNotExistError:
        frappe.throw(_("Course not found"))
    except Exception as e:
        frappe.log_error(frappe.get_traceback())
        frappe.throw(_("Error fetching course details: {0}").format(str(e)))
    finally:
        frappe.flags.ignore_permissions = False


@frappe.whitelist(allow_guest=True)
def enroll_student(course_code, student_data):
    try:
        # Validate if course exists
        if not frappe.db.exists("Course", course_code):
            frappe.throw(_("Course not found"))

        # Parse student data if it's a string
        if isinstance(student_data, str):
            student_data = json.loads(student_data)

        # Create user if doesn't exist
        user_exists = frappe.db.exists("User", student_data.get("email"))
        if not user_exists:
            user = frappe.get_doc({
                "doctype": "User",
                "email": student_data.get("email"),
                "first_name": student_data.get("firstName"),
                "last_name": student_data.get("lastName"),
                "send_welcome_email": 1,
                "role_profile_name": "Student"  # Ensure this role profile exists
            })
            user.insert(ignore_permissions=True)

        # Create enrollment
        enrollment = frappe.get_doc({
            "doctype": "Course Enrollment",
            "course": course_code,
            "student": student_data.get("email"),
            "status": "Pending",
            "enrollment_date": frappe.utils.now(),
            "student_details": {
                "phone": student_data.get("phone"),
                "education": student_data.get("education"),
                "experience": student_data.get("experience"),
                "background": student_data.get("background")
            }
        })
        enrollment.insert(ignore_permissions=True)

        # Moodle Integration
        try:
            # Get course details
            course = frappe.get_doc("Course", course_code)
            
            # Create user in Moodle
            moodle_user = create_moodle_user({
                "username": student_data.get("email"),
                "password": frappe.generate_hash(),  # Generate a secure password
                "firstname": student_data.get("firstName"),
                "lastname": student_data.get("lastName"),
                "email": student_data.get("email")
            })

            # Enroll user in Moodle course
            if moodle_user and course.moodle_course_id:
                enroll_in_moodle_course(moodle_user.get('id'), course.moodle_course_id)
                
                # Update enrollment with Moodle data
                enrollment.moodle_user_id = moodle_user.get('id')
                enrollment.save()

        except Exception as e:
            frappe.log_error(f"Moodle Integration Error: {str(e)}")
            # Don't throw error here, just log it
            # The enrollment is still valid even if Moodle integration fails

        return {
            "status": "success",
            "message": "Enrollment successful",
            "enrollment": enrollment.name
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback())
        frappe.throw(_("Enrollment failed: {0}").format(str(e)))

def create_moodle_user(user_data):
    """
    Create a user in Moodle using Moodle Web Services API
    This is a placeholder implementation - you'll need to add your Moodle API details
    """
    try:
        moodle_url = frappe.db.get_single_value("LMS Settings", "moodle_url")
        moodle_token = frappe.db.get_single_value("LMS Settings", "moodle_token")

        if not (moodle_url and moodle_token):
            frappe.throw(_("Moodle configuration missing"))

        # Example API call - modify according to your Moodle API
        response = requests.post(
            f"{moodle_url}/webservice/rest/server.php",
            params={
                "wstoken": moodle_token,
                "wsfunction": "core_user_create_users",
                "moodlewsrestformat": "json",
                "users[0][username]": user_data["username"],
                "users[0][password]": user_data["password"],
                "users[0][firstname]": user_data["firstname"],
                "users[0][lastname]": user_data["lastname"],
                "users[0][email]": user_data["email"]
            }
        )
        return response.json()

    except Exception as e:
        frappe.log_error(f"Moodle User Creation Error: {str(e)}")
        return None

def enroll_in_moodle_course(user_id, course_id):
    """
    Enroll a user in a Moodle course
    This is a placeholder implementation - you'll need to add your Moodle API details
    """
    try:
        moodle_url = frappe.db.get_single_value("LMS Settings", "moodle_url")
        moodle_token = frappe.db.get_single_value("LMS Settings", "moodle_token")

        if not (moodle_url and moodle_token):
            frappe.throw(_("Moodle configuration missing"))

        # Example API call - modify according to your Moodle API
        response = requests.post(
            f"{moodle_url}/webservice/rest/server.php",
            params={
                "wstoken": moodle_token,
                "wsfunction": "enrol_manual_enrol_users",
                "moodlewsrestformat": "json",
                "enrolments[0][roleid]": 5,  # Student role ID in Moodle
                "enrolments[0][userid]": user_id,
                "enrolments[0][courseid]": course_id
            }
        )
        return response.json()

    except Exception as e:
        frappe.log_error(f"Moodle Enrollment Error: {str(e)}")
        return None