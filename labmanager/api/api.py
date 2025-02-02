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
            fields=["name", "title", "description", "duration", "unit", "sequence"],
            order_by="sequence",
            ignore_permissions=True
        )
        
        for module in modules:
            # Get lessons for each module
            module.lessons = frappe.get_all(
                "Course Module Lesson", 
                filters={"module": module.name},
                fields=["title", "duration", "unit", "type", "preview_enabled", "sequence"],
                order_by="sequence",
                ignore_permissions=True
            )
        
        response = {
            "course_code": course.course_code,
            "title": course.title,
            "description": course.description,
            "duration": course.duration,
            "unit": course.unit,
            "level": course.level,
            "price": course.price,
            "start_date": course.start_date,
            "status": course.status,
            "featured_image": course.featured_image,
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
                    "unit": module.unit,
                    "sequence": module.sequence,
                    "lessons": [
                        {
                            "title": lesson.title,
                            "duration": lesson.duration,
                            "unit": lesson.unit,
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
def get_lesson_quiz(course_code):
    frappe.logger().debug(f"Fetching quiz for course: {course_code}")
    try:
        # First get sample lesson using basic db query
        lesson_name = frappe.db.sql("""
            SELECT name 
            FROM `tabCourse Module Lesson`
            WHERE course = %s AND preview_enabled = 1
            LIMIT 1
        """, (course_code,))

        if not lesson_name or not lesson_name[0]:
            return {"questions": []}

        # Get quiz using basic db query
        quiz_name = frappe.db.sql("""
            SELECT name 
            FROM `tabQuiz`
            WHERE lesson = %s
            LIMIT 1
        """, (lesson_name[0][0],))
        
        frappe.logger().debug(f"Found quiz: {quiz_name[0][0] if quiz_name and quiz_name[0] else 'None'}")

        if not quiz_name or not quiz_name[0]:
            return {"questions": []}

        # Get question mappings
        question_mappings = frappe.db.sql("""
            SELECT question, sequence
            FROM `tabQuiz Question Mapping`
            WHERE quiz = %s
            ORDER BY sequence
        """, (quiz_name[0][0],), as_dict=1)

        questions = []
        for mapping in question_mappings:
            try:
                # Load each question
                question = frappe.get_doc("Quiz Question", mapping.question)
                
                question_data = {
                    "id": question.name,
                    "question": question.question,
                    "question_type": question.question_type
                }

                # Handle MCQ type
                if question.question_type == "MCQ":
                    options = []
                    for opt in question.options:
                        options.append({
                            "option_text": opt.option_text,
                            "is_correct": opt.is_correct
                        })
                    question_data["options"] = options

                # Handle True/False type
                elif question.question_type == "True/False":
                    question_data["correct_answer"] = question.correct_boolean

                # Handle Fill in the Blank type
                elif question.question_type == "Fill in the Blank":
                    question_data["correct_answer"] = question.correct_text

                # Handle Matching type
                elif question.question_type == "Matching":
                    pairs = []
                    for pair in question.matching_pairs:
                        pairs.append({
                            "left_item": pair.left_item,
                            "right_item": pair.right_item
                        })
                    question_data["matching_pairs"] = pairs

                # Handle Code Assessment type
                elif question.question_type == "Code Assessment":
                    question_data["initial_code"] = question.initial_code
                    test_cases = frappe.get_all(
                        "Code Test Case",
                        filters={"parent": question.name},
                        fields=["input", "expected_output"]
                    )
                    question_data["test_cases"] = test_cases

                questions.append(question_data)
            except Exception as qe:
                frappe.log_error(f"Error processing question {mapping.question}: {str(qe)}")
                continue

        return {
            "questions": questions
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Quiz Fetch Error")
        return {"error": str(e), "questions": []}


@frappe.whitelist(allow_guest=True)
def get_course_outcomes(course_code):
    try:
        # Debug log
        frappe.logger().debug(f"Fetching outcomes for course: {course_code}")
        
        # Get all roles for this course
        roles = frappe.db.get_all(
            "Roles",
            filters={"course": course_code},
            fields=["role_title"],
            order_by="role_title"
        )
        
        # Get all skills for this course
        skills = frappe.db.get_all(
            "Skills", 
            filters={"course": course_code},
            fields=["skill_name"],
            order_by="skill_name"
        )
        
        # Debug log
        frappe.logger().debug(f"Found {len(roles)} roles and {len(skills)} skills")
        
        # Format the response
        response = {
            "message": {
                "roles": [role.get("role_title") for role in roles],
                "skills": [skill.get("skill_name") for skill in skills]
            }
        }
        
        return response
        
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Course Outcomes Error")
        return {
            "error": str(e),
            "message": {
                "roles": [],
                "skills": []
            }
        }


@frappe.whitelist(allow_guest=True)
def get_lesson_resources(course_code):
    try:
        resources = frappe.get_all(
            "Course Resource",
            filters={"course": course_code, "preview_enabled": 1},
            fields=["title", "type", "file", "url", "description"]
        )
        
        # Clean and validate URLs
        for resource in resources:
            if resource.type == 'Video' and resource.url:
                resource.url = resource.url.replace('www.youtube-nocookie.com', 'www.youtube.com')
            elif resource.type == 'PDF' and resource.file:
                resource.file = frappe.utils.get_url(resource.file)
                
        return {"message": {"resources": resources}}
    except Exception as e:
        frappe.log_error(frappe.get_traceback())
        return {"error": str(e)}

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


  
@frappe.whitelist(allow_guest=True)
def get_featured_courses():
    try:
        courses = frappe.get_all(
            "Course",
            fields=["course_code", "title", "price", "featured_image_small", "short_description"],
            filters={"status": "Active", "show_in_featured_section": 1}
        )
        # Changed to return direct courses array without message wrapper
        return {"courses": courses} if courses else {"courses": []}
    except Exception as e:
        frappe.log_error(frappe.get_traceback())
        return {"error": str(e)}
    

# @frappe.whitelist(allow_guest=True)
# def get_active_announcements():
#     """Get all active announcements for the homepage."""
#     try:
#         current_date = frappe.utils.today()
#         announcements = frappe.get_all(
#             "Homepage Announcement",
#             fields=["title", "content", "custom_css_class"],
#             filters={
#                 "is_active": 1,
#                 "valid_from": ("<=", current_date),
#                 "valid_till": (">=", current_date)
#             },
#             order_by="priority desc, valid_from desc"
#         )
#         # Return in same format as featured courses
#         return {"announcements": announcements} if announcements else {"announcements": []}
#     except Exception as e:
#         frappe.log_error(frappe.get_traceback())
#         return {"error": str(e)}
    
    
@frappe.whitelist(allow_guest=True)
def get_homepage_faqs():
    """Get all active FAQs with their categories for the homepage."""
    try:
        # Get categories with their sequence
        categories = frappe.get_all(
            "FAQ Category",
            fields=["name", "category_name", "sequence"],
            order_by="sequence"
        )
        
        # Get FAQs
        faqs = frappe.get_all(
            "Homepage FAQ",
            fields=["question", "answer", "category", "sequence"],
            filters={"is_active": 1},
            order_by="category, sequence"
        )
        
        # Return in same format as featured courses
        return {
            "categories": categories,
            "faqs": faqs
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback())
        return {"error": str(e)}
    
    
@frappe.whitelist(allow_guest=True)
def get_homepage_content():
    """Get both welcome content and active announcements for the homepage."""
    try:
        # Get welcome content
        welcome_content = frappe.get_all(
            "Website Content",
            fields=["title", "content"],
            filters={
                "section": "Welcome",
                "is_active": 1
            },
            order_by="sequence",
            limit=1
        )

        # Use default content if no welcome content is found
        if not welcome_content:
            welcome_content = [{
                "title": "Welcome to TechEthica",
                "content": """
                    <p>
                        TechEthica is a premier educational institution dedicated to empowering learners with 
                        cutting-edge technical skills and a deep understanding of Islamic values. Our mission 
                        is to cultivate well-rounded individuals proficient in <strong>Computer Science, Data Science, AI, 
                        DevOps, Cloud Computing, Full-Stack Development, Frappe, React, Python</strong>, and more, while also 
                        nurturing their spiritual and ethical growth through <strong>Quran, Hadith, Fiqh, Seerah, Tariqh, 
                        Tasawwuf, Arabic Language, and Literature</strong>.
                    </p>
                    
                    <p>
                        TechEthica is a unique platform designed to <strong>equip students with industry-ready skills 
                        and instill strong moral values</strong>, shaping them into <strong>ethical professionals and responsible 
                        global citizens</strong>. Our <strong>holistic approach to education</strong> ensures the intellectual, spiritual, and 
                        professional development of every student, providing them with an environment that is both 
                        <strong>technologically advanced and spiritually enriching</strong>.
                    </p>
                """
            }]

        # Get active announcements
        current_date = frappe.utils.today()
        announcements = frappe.get_all(
            "Homepage Announcement",
            fields=["title", "content", "priority", "custom_css_class"],
            filters={
                "is_active": 1,
                "valid_from": ("<=", current_date),
                "valid_till": (">=", current_date)
            },
            order_by="priority desc, valid_from desc"
        )

        return {
            "welcome_content": welcome_content[0] if welcome_content else None,
            "announcements": announcements
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback())
        return {"error": str(e)}

@frappe.whitelist(allow_guest=True)
def get_homepage_faqs():
    """Get all active FAQs with their categories for the homepage."""
    try:
        # Get categories with their sequence
        categories = frappe.get_all(
            "FAQ Category",
            fields=["name", "category_name", "sequence"],
            order_by="sequence"
        )
        
        # Get FAQs
        faqs = frappe.get_all(
            "Homepage FAQ",
            fields=["question", "answer", "category", "sequence"],
            filters={"is_active": 1},
            order_by="category, sequence"
        )
        
        return {
            "categories": categories,
            "faqs": faqs
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback())
        return {"error": str(e)}