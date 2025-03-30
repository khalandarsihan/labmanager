import frappe
from frappe import _
import requests
import json
from datetime import datetime

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
        

# @frappe.whitelist(allow_guest=True)  
# def get_course_catalog(filters=None):  
#     try:  
#         frappe.logger().debug(f"Received filters parameter: {filters}")
        
#         # Parse filters if they're passed as a string  
#         if isinstance(filters, str):  
#             try:
#                 filters = json.loads(filters)
#                 frappe.logger().debug(f"Successfully parsed filters: {filters}")
#             except json.JSONDecodeError as e:
#                 frappe.logger().error(f"Error parsing filters JSON: {str(e)}")
#                 filters = {}
#         else:
#             filters = filters or {}
        
#         # Check if there's a search term
#         search_term = None
#         if isinstance(filters, dict) and 'search' in filters:
#             search_term = filters.get('search')
#             if not (isinstance(search_term, str) and search_term.strip()):
#                 search_term = None
        
#         if search_term:
#             # Use SQL for more advanced search capabilities with instructor join
#             search_term = f"%{search_term}%"
#             frappe.logger().debug(f"Searching for: '{search_term}'")
            
#             # Get courses with title, description, and instructor matches
#             # Order by relevance: title matches first, then instructor, then description
#             courses = frappe.db.sql("""
#                 SELECT 
#                     c.name, c.course_code, c.title, c.short_description, 
#                     c.duration, c.unit, c.level, c.price, 
#                     c.total_lessons, c.total_projects,
#                     c.featured_image_catalog, c.instructor, c.show_in_featured_section,
#                     CASE 
#                         WHEN c.title LIKE %(term)s THEN 1
#                         WHEN i.full_name LIKE %(term)s THEN 2
#                         WHEN c.short_description LIKE %(term)s THEN 3
#                         WHEN c.level LIKE %(term)s THEN 4
#                         ELSE 5
#                     END as relevance
#                 FROM `tabCourse` c
#                 LEFT JOIN `tabCourse Instructor` i ON c.instructor = i.name
#                 WHERE c.status = 'Active'
#                 AND (
#                     c.title LIKE %(term)s 
#                     OR c.short_description LIKE %(term)s
#                     OR i.full_name LIKE %(term)s
#                     OR c.level LIKE %(term)s
#                 )
#                 ORDER BY relevance, c.title
#             """, {"term": search_term}, as_dict=1)
            
#             frappe.logger().debug(f"Found {len(courses)} courses matching search term")
#         else:
#             # Base filters - ensure only active courses  
#             base_filters = {"status": "Active"}
            
#             # Apply other filters here...
            
#             frappe.logger().debug(f"Using standard query filters: {base_filters}")
#             courses = frappe.get_all(
#                 "Course",
#                 fields=[
#                     "name", "course_code", "title", "short_description", "duration",
#                     "unit", "level", "price", "total_lessons", "total_projects",
#                     "featured_image_catalog", "instructor", "show_in_featured_section"
#                 ],
#                 filters=base_filters
#             )
#             frappe.logger().debug(f"Found {len(courses)} courses")
        
#         # Process course data...
#         for course in courses:  
#             # Get instructor details if available  
#             if course.get('instructor'):  
#                 try:
#                     instructor = frappe.get_doc("Course Instructor", course.get('instructor'))  
#                     course["instructor"] = {  
#                         "name": instructor.full_name,  
#                         "title": instructor.title,  
#                         "image": instructor.image  
#                     }
#                 except Exception as e:
#                     frappe.logger().error(f"Error getting instructor: {str(e)}")
#                     course["instructor"] = {"name": "Unknown"}
             
#             # Get course tags  
#             try:
#                 course_features = frappe.get_all(  
#                     "Course Features",  
#                     fields=["feature_name"],  
#                     filters={"course": course.get('course_code')},  
#                     order_by="sequence"  
#                 )  
#                 course["tags"] = [feature.get("feature_name") for feature in course_features]
#             except Exception as e:
#                 frappe.logger().error(f"Error getting course features: {str(e)}")
#                 course["tags"] = []
            
#             # Remove relevance field if it exists
#             if 'relevance' in course:
#                 del course['relevance']
        
#         frappe.logger().debug(f"Returning {len(courses)} processed courses")
#         return {  
#             "message": {  
#                 "courses": courses  
#             }  
#         }

#     except Exception as e:  
#         frappe.logger().error(f"Course Catalog API Error: {str(e)}\n{frappe.get_traceback()}")  
#         return {  
#             "error": str(e)  
#         }

@frappe.whitelist(allow_guest=True)    
def get_course_catalog(filters=None):    
   try:    
       frappe.logger().debug(f"Received filters parameter: {filters}")   
         
       # Parse filters if they're passed as a string    
       if isinstance(filters, str):    
           try:   
               filters = json.loads(filters)   
               frappe.logger().debug(f"Successfully parsed filters: {filters}")   
           except json.JSONDecodeError as e:   
               frappe.logger().error(f"Error parsing filters JSON: {str(e)}")   
               filters = {}   
       else:   
           filters = filters or {}   
         
       # Check if there's a search term   
       search_term = None   
       if isinstance(filters, dict) and 'search' in filters:   
           search_term = filters.get('search')   
           if not (isinstance(search_term, str) and search_term.strip()):   
               search_term = None   
        
       # Extract level filter if it exists
       level_filter = None
       if isinstance(filters, dict) and 'level' in filters:
           if isinstance(filters['level'], dict) and 'level' in filters['level']:
               level_value = filters['level']['level']
               if isinstance(level_value, str) and level_value.strip():
                   level_filter = level_value
                   frappe.logger().debug(f"Extracted level filter: {level_filter}")

       # Extract price filter if it exists  
       price_filter = None  
       if isinstance(filters, dict) and 'price' in filters:  
           if isinstance(filters['price'], dict) and 'price' in filters['price']:  
               price_value = filters['price']['price']  
               # Handle numeric price (for Free courses or exact price)  
               if isinstance(price_value, (int, float)):  
                   price_filter = {'operator': '=', 'value': price_value}  
                   frappe.logger().debug(f"Extracted exact price filter: {price_value}")  
               # Handle price range/comparison as list  
               elif isinstance(price_value, list) and len(price_value) >= 2:  
                   operator = price_value[0]  
                   if operator == "between" and len(price_value) >= 3:  
                       price_filter = {  
                           'operator': 'between',  
                           'min_value': price_value[1],  
                           'max_value': price_value[2]  
                       }  
                   else:  
                       price_filter = {  
                           'operator': operator,  
                           'value': price_value[1]  
                       }  
                   frappe.logger().debug(f"Extracted price range filter: {price_filter}")

       frappe.logger().debug(f"Final extracted price filter: {price_filter}")  
         
       if search_term:   
           # Use SQL for more advanced search capabilities with instructor join   
           search_term = f"%{search_term}%"   
           frappe.logger().debug(f"Searching for: '{search_term}'")   
             
           # Get courses with title, description, and instructor matches   
           # Order by relevance: title matches first, then instructor, then description  
           query_params = {"term": search_term}
           
           # Add level parameter if level filter exists
           if level_filter:
               query_params["level"] = level_filter
               frappe.logger().debug(f"Added level parameter to search query: {level_filter}")
            
           # Base query building  
           query = """   
               SELECT   
                   c.name, c.course_code, c.title, c.short_description,   
                   c.duration, c.unit, c.level, c.price,   
                   c.total_lessons, c.total_projects,   
                   c.featured_image_catalog, c.instructor, c.show_in_featured_section,   
                   CASE   
                       WHEN c.title LIKE %(term)s THEN 1   
                       WHEN i.full_name LIKE %(term)s THEN 2   
                       WHEN c.short_description LIKE %(term)s THEN 3   
                       WHEN c.level LIKE %(term)s THEN 4   
                       ELSE 5   
                   END as relevance   
               FROM `tabCourse` c   
               LEFT JOIN `tabCourse Instructor` i ON c.instructor = i.name   
               WHERE c.status = 'Active'   
               AND (   
                   c.title LIKE %(term)s   
                   OR c.short_description LIKE %(term)s   
                   OR i.full_name LIKE %(term)s   
                   OR c.level LIKE %(term)s   
               )  
           """  
            
           # Add level filter if it exists
           if level_filter:
               query += " AND c.level = %(level)s"
               frappe.logger().debug(f"Added level filter to query: {level_filter}")
           
           # Add price filter if it exists  
           if price_filter:  
               if price_filter['operator'] == '=':  
                   query += " AND c.price = %(price_value)s"  
                   query_params["price_value"] = price_filter['value']  
               elif price_filter['operator'] == '<':  
                   query += " AND c.price < %(price_value)s"  
                   query_params["price_value"] = price_filter['value']  
               elif price_filter['operator'] == '>':  
                   query += " AND c.price > %(price_value)s"  
                   query_params["price_value"] = price_filter['value']  
               elif price_filter['operator'] == 'between':  
                   query += " AND c.price BETWEEN %(price_min)s AND %(price_max)s"  
                   query_params["price_min"] = price_filter['min_value']  
                   query_params["price_max"] = price_filter['max_value']  
                
               frappe.logger().debug(f"Added price filter to query: {price_filter}")  
               frappe.logger().debug(f"Query parameters: {query_params}")  
            
           # Add sorting  
           query += " ORDER BY relevance, c.title"  
            
           # Execute the query  
           courses = frappe.db.sql(query, query_params, as_dict=1)  
           frappe.logger().debug(f"Found {len(courses)} courses matching search term")  
       else:   
           # Base filters - ensure only active courses    
           base_filters = {"status": "Active"} 
           
           # Apply level filter if it exists
           if level_filter:
               base_filters["level"] = level_filter
               frappe.logger().debug(f"Added level filter to base filters: {level_filter}")
            
           # Apply price filter to the base filters if it exists  
           if price_filter:  
               if price_filter['operator'] == '=':  
                   base_filters["price"] = price_filter['value']  
               elif price_filter['operator'] == '<':  
                   base_filters["price"] = ["<", price_filter['value']]  
               elif price_filter['operator'] == '>':  
                   base_filters["price"] = [">", price_filter['value']]  
               elif price_filter['operator'] == 'between':  
                   # Fix: Use Frappe's correct filter syntax for range queries
                   min_value = float(price_filter['min_value'])
                   max_value = float(price_filter['max_value'])
                   
                   # Create a complex filter condition
                   # First: remove the automatic "price" filter 
                   # We'll use a custom filter list instead
                   if "price" in base_filters:
                       del base_filters["price"]
                       
                   frappe.logger().debug(f"Using corrected price range filter with min={min_value}, max={max_value}")
                
               frappe.logger().debug(f"Added price filter to base filters: {base_filters}")  
             
           frappe.logger().debug(f"Using standard query filters: {base_filters}")
           
           # Special handling for between price filter
           if price_filter and price_filter['operator'] == 'between':
               min_value = float(price_filter['min_value'])
               max_value = float(price_filter['max_value'])
               
               # Build the query with level filter if applicable
               query = """
                   SELECT
                       name, course_code, title, short_description, duration,
                       unit, level, price, total_lessons, total_projects,
                       featured_image_catalog, instructor, show_in_featured_section
                   FROM `tabCourse`
                   WHERE status = 'Active'
                   AND price BETWEEN %s AND %s
               """
               
               params = [min_value, max_value]
               
               # Add level condition if level filter exists
               if level_filter:
                   query += " AND level = %s"
                   params.append(level_filter)
                   frappe.logger().debug(f"Added level filter '{level_filter}' to between price query")
               
               courses = frappe.db.sql(query, params, as_dict=1)
               frappe.logger().debug(f"Used direct SQL query for between price filter: {min_value}-{max_value}")
           else:
               # Standard get_all for other filters
               courses = frappe.get_all(   
                   "Course",   
                   fields=[   
                       "name", "course_code", "title", "short_description", "duration",   
                       "unit", "level", "price", "total_lessons", "total_projects",   
                       "featured_image_catalog", "instructor", "show_in_featured_section"   
                   ],   
                   filters=base_filters   
               )
           frappe.logger().debug(f"Found {len(courses)} courses")   
         
       # Process course data...   
       for course in courses:    
           # Get instructor details if available    
           if course.get('instructor'):    
               try:   
                   instructor = frappe.get_doc("Course Instructor", course.get('instructor'))    
                   course["instructor"] = {    
                       "name": instructor.full_name,    
                       "title": instructor.title,    
                       "image": instructor.image    
                   }   
               except Exception as e:   
                   frappe.logger().error(f"Error getting instructor: {str(e)}")   
                   course["instructor"] = {"name": "Unknown"}   
              
           # Get course tags    
           try:   
               course_features = frappe.get_all(    
                   "Course Features",    
                   fields=["feature_name"],    
                   filters={"course": course.get('course_code')},    
                   order_by="sequence"    
               )    
               course["tags"] = [feature.get("feature_name") for feature in course_features]   
           except Exception as e:   
               frappe.logger().error(f"Error getting course features: {str(e)}")   
               course["tags"] = []   
             
           # Remove relevance field if it exists   
           if 'relevance' in course:   
               del course['relevance']   
         
       frappe.logger().debug(f"Returning {len(courses)} processed courses")   
       return {    
           "message": {    
               "courses": courses    
           }    
       }

   except Exception as e:    
       frappe.logger().error(f"Course Catalog API Error: {str(e)}\n{frappe.get_traceback()}")    
       return {    
           "error": str(e)    
       }

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
def get_features():
    try:
        features = frappe.get_all(
            "Feature",
            fields=["title", "icon", "description", "sequence_no"],
            order_by="sequence_no"
        )
        return {"features": features}
    except Exception as e:
        frappe.log_error(frappe.get_traceback())
        return {"error": str(e)}
    
    
@frappe.whitelist(allow_guest=True)
def get_carousel_slides():
    try:
        slides = frappe.get_all(
            "Carousel",  # Your doctype name
            fields=["title", "description", "image", "sequence_no"],
            order_by="sequence_no"
        )
        return {"slides": slides}
    except Exception as e:
        frappe.log_error(frappe.get_traceback())
        return {"error": str(e)}
    
  
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
    
# Student Registration API

def generate_registration_id(academic_program):
    try:
        # Get current year
        current_year = frappe.utils.today()[:4]
        
        # Get program code from Academic Program
        program_doc = frappe.get_doc("Academic Program", {"program_name": academic_program})
        program_code = program_doc.code

        # Get the count of registrations for this year and program
        registration_count = frappe.db.count(
            "Student Registration",
            filters={
                "creation": [">=", f"{current_year}-01-01"],
                "creation": ["<=", f"{current_year}-12-31"],
                "desired_academic_program": academic_program
            }
        )
        
        # Generate sequential decoded ID
        sequence_number = str(registration_count + 1).zfill(4)
        decoded_id = f"{current_year}-{program_code}-{sequence_number}"
        
        # Generate encoded ID with hash
        base_number = 1000 + registration_count
        sequence_hash = frappe.generate_hash(str(base_number), 5)[:4]
        encoded_id = f"{current_year}-{program_code}-{sequence_hash}"
        
        # Ensure uniqueness of encoded ID
        while frappe.db.exists("Student Registration", encoded_id):
            base_number += 1
            sequence_hash = frappe.generate_hash(str(base_number), 5)[:4]
            encoded_id = f"{current_year}-{program_code}-{sequence_hash}"
        
        return {
            "encoded_id": encoded_id,
            "decoded_id": decoded_id
        }

    except Exception as e:
        frappe.log_error(f"Registration ID generation failed: {str(e)}")
        fallback_hash = frappe.generate_hash()[:8]
        return {
            "encoded_id": f"REG-E-{fallback_hash}",
            "decoded_id": f"REG-D-{fallback_hash}"
        }


@frappe.whitelist(allow_guest=True)
def register_student(**kwargs):
    """API endpoint to register a new student"""
    try:
        # Generate both encoded and decoded registration IDs
        registration_ids = generate_registration_id(kwargs.get('desired_academic_program'))
        
        # Validate required fields
        required_fields = [
            'first_name', 'email', 'desired_academic_program',
            'islamic_studies_specialization', 'previous_education'
        ]
        
        missing_fields = [field for field in required_fields if not kwargs.get(field)]
        if missing_fields:
            return {
                "status": "error",
                "message": f"Missing required fields: {', '.join(missing_fields)}"
            }

        # Create student registration document
        doc = frappe.get_doc({
            "doctype": "Student Registration",
            "registration_id": registration_ids["encoded_id"],
            "decoded_registration_id": registration_ids["decoded_id"],
            "first_name": kwargs.get('first_name'),
            "middle_name": kwargs.get('middle_name'),
            "last_name": kwargs.get('last_name'),
            "date_of_birth": kwargs.get('date_of_birth'),
            "gender": kwargs.get('gender'),
            "email": kwargs.get('email'),
            "phone": kwargs.get('phone'),
            "address": kwargs.get('address'),
            "city": kwargs.get('city'),
            "state": kwargs.get('state'),
            "country": kwargs.get('country'),
            "postal_code": kwargs.get('postal_code'),
            "previous_education": kwargs.get('previous_education'),
            "desired_academic_program": kwargs.get('desired_academic_program'),
            "institution": kwargs.get('institution'),
            "islamic_studies_specialization": kwargs.get('islamic_studies_specialization'),
            "year_of_completion": kwargs.get('year_of_completion')
        })

        if kwargs.get('profile_image'):
            doc.profile_image = kwargs.get('profile_image')

        doc.insert(ignore_permissions=True)
        
        # Send confirmation email with the encoded registration ID
        try:
            send_registration_confirmation(doc)
        except Exception as email_error:
            frappe.logger().error(f"Email sending failed: {str(email_error)}")

        # Return only the encoded ID to the frontend
        return {
            "status": "success",
            "message": "Registration successful",
            "registration_id": registration_ids["encoded_id"]
        }

    except Exception as e:
        frappe.logger().error(f"Registration failed: {str(e)}\n{frappe.get_traceback()}")
        return {
            "status": "error",
            "message": f"Registration failed: {str(e)}"
        }

def send_registration_confirmation(doc):
    """Send confirmation email to student"""
    try:
        frappe.sendmail(
            recipients=[doc.email],
            subject=_("Registration Confirmation - TechEthica"),
            template="student_registration_confirmation",
            args={
                "first_name": doc.first_name,
                "registration_id": doc.registration_id,  # Using encoded ID in email
                "program": doc.desired_academic_program,
                "support_email": frappe.get_value("Education Settings", None, "support_email")
            }
        )
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Student Registration Email Failed"))

@frappe.whitelist(allow_guest=True)
def get_registration_details(registration_id):
    """Get registration details - Accessible only to staff"""
    try:
        if not frappe.has_permission("Student Registration", "read"):
            frappe.throw(_("Not permitted"))
            
        registration = frappe.get_doc("Student Registration", registration_id)
        
        return {
            "registration_id": registration.registration_id,  # Encoded ID
            "decoded_registration_id": registration.decoded_registration_id,  # Decoded ID (visible only to staff)
            "first_name": registration.first_name,
            "middle_name": registration.middle_name,
            "last_name": registration.last_name,
            "date_of_birth": registration.date_of_birth,
            "gender": registration.gender,
            "email": registration.email,
            "phone": registration.phone,
            "address": registration.address,
            "city": registration.city,
            "state": registration.state,
            "country": registration.country,
            "postal_code": registration.postal_code,
            "profile_image": registration.profile_image,
            "previous_education": registration.previous_education,
            "desired_academic_program": registration.desired_academic_program,
            "institution": registration.institution,
            "islamic_studies_specialization": registration.islamic_studies_specialization,
            "year_of_completion": registration.year_of_completion
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Error fetching registration details")
        return {"error": str(e)}

@frappe.whitelist(allow_guest=True)
def get_registration_status(registration_id):
    """Get registration details and status"""
    try:
        if not registration_id:
            frappe.throw(_("Registration ID is required"))
            
        doc = frappe.get_doc("Student Registration", registration_id)
        
        return {
            "status": "success",
            "data": {
                "registration_id": doc.name,
                "first_name": doc.first_name,
                "email": doc.email,
                "program": doc.desired_academic_program,
                "specialization": doc.islamic_studies_specialization
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist(allow_guest=True)
def update_registration(registration_id, **kwargs):
    """Update registration details"""
    if not frappe.has_permission("Student Registration", "write"):
        frappe.throw(_("Not permitted"))
        
    try:
        doc = frappe.get_doc("Student Registration", registration_id)
        
        # Update personal information
        if kwargs.get('first_name'): doc.first_name = kwargs.get('first_name')
        if kwargs.get('middle_name'): doc.middle_name = kwargs.get('middle_name')
        if kwargs.get('last_name'): doc.last_name = kwargs.get('last_name')
        if kwargs.get('date_of_birth'): doc.date_of_birth = kwargs.get('date_of_birth')
        if kwargs.get('gender'): doc.gender = kwargs.get('gender')
        if kwargs.get('phone'): doc.phone = kwargs.get('phone')
        if kwargs.get('address'): doc.address = kwargs.get('address')
        if kwargs.get('city'): doc.city = kwargs.get('city')
        if kwargs.get('state'): doc.state = kwargs.get('state')
        if kwargs.get('country'): doc.country = kwargs.get('country')
        if kwargs.get('postal_code'): doc.postal_code = kwargs.get('postal_code')
        
        # Update academic details
        if kwargs.get('previous_education'): doc.previous_education = kwargs.get('previous_education')
        if kwargs.get('desired_academic_program'): doc.desired_academic_program = kwargs.get('desired_academic_program')
        if kwargs.get('institution'): doc.institution = kwargs.get('institution')
        if kwargs.get('islamic_studies_specialization'): doc.islamic_studies_specialization = kwargs.get('islamic_studies_specialization')
        if kwargs.get('year_of_completion'): doc.year_of_completion = kwargs.get('year_of_completion')
        
        # Handle profile image update
        if kwargs.get('profile_image'):
            doc.profile_image = kwargs.get('profile_image')
            
        doc.save()
        
        return {
            "status": "success",
            "message": _("Registration updated successfully")
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
        
@frappe.whitelist(allow_guest=True)
def get_education_levels():
    try:
        levels = frappe.get_all("Previous Education", 
            fields=["education_level"], 
            order_by="sequence_no asc")
        return {
            "status": "success",
            "education_levels": [l.education_level for l in levels]
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@frappe.whitelist(allow_guest=True)
def get_academic_programs():
    try:
        programs = frappe.get_all("Academic Program", 
            fields=["program_name"], 
            order_by="sequence_no asc")
        return {
            "status": "success",
            "programs": [p.program_name for p in programs]
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@frappe.whitelist(allow_guest=True)
def get_islamic_specializations():
    try:
        specs = frappe.get_all("Islamic Specialization",
            fields=["*"],
            order_by="sequence_no asc")
        return {
            "status": "success",
            "specializations": [s.specialization_name for s in specs]
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
    
@frappe.whitelist(allow_guest=True)
def get_academic_calendar():
    try:
        # Get current date for filtering
        current_year = frappe.utils.getdate().year
        start_date = f"{current_year-1}-06-01"  # Include previous year from June
        end_date = f"{current_year+1}-09-01"    # Include next year until September
        
        # Fetch active calendar events within date range
        events = frappe.get_all(
            "Academic Calendar Event",
            fields=["name", "title", "description", "start_date", 
                   "end_date", "type", "location"],
            filters={
                "is_active": 1,
                "start_date": [">=", start_date],
                "end_date": ["<=", end_date]
            },
            order_by="start_date asc"
        )
        
        # Map event types to ensure consistency with frontend expectations
        type_mapping = {
            "academic term": "academic-term",
            "academicterm": "academic-term",
            "academic-term": "academic-term",
            "exam": "exam",
            "event": "event",
            "deadline": "deadline",
            "holiday": "holiday",
            "faculty": "faculty"
        }
        
        # Color mapping based on event type - matches the frontend color scheme
        color_mapping = {
            "academic-term": "bg-blue-500/90",
            "exam": "bg-rose-500/90",
            "event": "bg-emerald-500/90",
            "deadline": "bg-amber-500/90",
            "holiday": "bg-purple-600",
            "faculty": "bg-indigo-600"
        }
        
        # Format dates and prepare response
        formatted_events = []
        for event in events:
            # Convert the event type to a standardized format
            event_type = (event.type or "").lower().strip()
            standardized_type = type_mapping.get(event_type, event_type)
            
            # Get the color for this event type
            color = color_mapping.get(standardized_type, "bg-gray-500/90")
            
            formatted_events.append({
                "id": event.name,
                "title": event.title,
                "description": event.description,
                "start": event.start_date,
                "end": event.end_date,
                "type": standardized_type,
                "location": event.location,
                "color": color  # Explicitly add color property expected by frontend
            })
            
        # Log for debugging
        frappe.logger().debug(f"Returning {len(formatted_events)} academic calendar events")
        frappe.logger().debug(f"Sample event: {formatted_events[0] if formatted_events else 'None'}")
            
        return {"events": formatted_events}
    
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Academic Calendar API Error")
        return {"error": str(e), "events": []}


@frappe.whitelist(allow_guest=True)
def get_class_schedule(grade=None, section=None, academic_year=None):
    """Get class schedule for a specific grade and section."""
    try:
        # Debug request parameters
        frappe.logger().debug(f"Request params: grade='{grade}', section='{section}', academic_year='{academic_year}'")
        
        filters = {"is_active": 1}
        
        # Add optional filters
        if grade:
            filters["grade"] = grade.strip() if isinstance(grade, str) else grade
        if section:
            # If section contains "Section " prefix, extract just the letter
            if isinstance(section, str) and section.startswith("Section "):
                section = section.replace("Section ", "")
            filters["section"] = section.strip() if isinstance(section, str) else section
        
        if academic_year:
            filters["academic_year"] = academic_year
        else:
            # Get current academic year if not specified
            current_year = frappe.get_all(
                "Academic Year",
                filters={"is_active": 1},
                fields=["name"],
                order_by="start_date desc",
                limit=1
            )
            if current_year:
                filters["academic_year"] = current_year[0].name
        
        frappe.logger().debug(f"Searching for schedule with filters: {filters}")
        
        # Use a direct SQL query for more control and debugging
        conditions = ["is_active = 1"]
        params = []
        
        if "grade" in filters:
            conditions.append("grade = %s")
            params.append(filters["grade"])
        
        if "section" in filters:
            conditions.append("section = %s")
            params.append(filters["section"])
            
        if "academic_year" in filters:
            conditions.append("academic_year = %s")
            params.append(filters["academic_year"])
            
        # Build and execute the query
        query = f"""
            SELECT name, grade, section, academic_year, term
            FROM `tabClass Schedule`
            WHERE {" AND ".join(conditions)}
            LIMIT 1
        """
        
        frappe.logger().debug(f"Executing query: {query} with params: {params}")
        schedule_doc = frappe.db.sql(query, params, as_dict=1)
        frappe.logger().debug(f"Found schedule: {schedule_doc}")
        
        if not schedule_doc:
            # If no specific schedule found, provide default data
            frappe.logger().debug(f"No schedule found for the specified criteria. Creating default response.")
            
            # Create default schedule data structure if no schedule exists
            days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday", "Sunday"]
            time_slots = frappe.get_all(
                "Time Slot",
                fields=["name", "start_time", "end_time", "block"],
                order_by="start_time"
            )

            # Format time slots
            formatted_time_slots = []
            for i, slot in enumerate(time_slots):
                formatted_time_slots.append({
                    "id": i + 1,
                    "start": slot.start_time.strftime("%H:%M") if hasattr(slot.start_time, "strftime") else slot.start_time,
                    "end": slot.end_time.strftime("%H:%M") if hasattr(slot.end_time, "strftime") else slot.end_time,
                    "block": slot.block,
                    "name": slot.name
                })

            # Create empty classes structure
            classes = {}
            for day in days:
                classes[day] = []

            # Return default data
            return {
                "status": "not_found",
                "message": f"No schedule found for {grade or 'any grade'} {section or 'any section'}.",
                "requested_grade": grade,
                "requested_section": section,
                "grade": None,
                "grade_name": None,
                "section": None,
                "academic_year": None,
                "term": None,
                "schedule_data": {
                    "days": days,
                    "time_slots": formatted_time_slots,
                    "classes": classes
                },
                "subjects": get_all_subjects(),
                "teachers": get_all_teachers(),
                "rooms": get_all_classrooms(),
                "sections": get_all_sections().get("message", [])
            }
        
        schedule = frappe.get_doc("Class Schedule", schedule_doc[0].name)
        frappe.logger().debug(f"Retrieved schedule: {schedule.name}, Grade: {schedule.grade}, Section: {schedule.section}")
        
        # Verify the schedule matches the requested grade and section
        if grade and schedule.grade != grade:
            frappe.logger().warning(f"Retrieved schedule grade '{schedule.grade}' doesn't match requested grade '{grade}'")
        if section and schedule.section != section:
            frappe.logger().warning(f"Retrieved schedule section '{schedule.section}' doesn't match requested section '{section}'")
        
        # Get grade info
        grade_info = None
        if schedule.grade:
            try:
                grade_info = frappe.get_doc("School Grade", schedule.grade)
            except frappe.DoesNotExistError:
                frappe.log_error(f"Grade {schedule.grade} not found", "Class Schedule Error")
        
        # Get all time slots
        time_slots = frappe.get_all(
            "Time Slot",
            fields=["name", "start_time", "end_time", "block"],
            order_by="start_time"
        )
        
        # Format time slots
        formatted_time_slots = []
        for i, slot in enumerate(time_slots):
            formatted_time_slots.append({
                "id": i + 1,  # Use sequential ID for frontend
                "start": slot.start_time.strftime("%H:%M") if hasattr(slot.start_time, "strftime") else slot.start_time,
                "end": slot.end_time.strftime("%H:%M") if hasattr(slot.end_time, "strftime") else slot.end_time,
                "block": slot.block,
                "name": slot.name  # Store actual doctype name for reference
            })
        
        # Get class sessions for this schedule
        class_sessions = frappe.get_all(
            "Class Session",
            filters={"class_schedule": schedule.name},
            fields=["day", "time_slot", "subject", "teacher", "classroom"]
        )
        frappe.logger().debug(f"Found {len(class_sessions)} class sessions for schedule {schedule.name}")
        
        # Organize sessions by day
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday", "Sunday"]
        classes = {}
        
        for day in days:
            classes[day] = []
        
        # Map time slot names to IDs
        time_slot_map = {slot["name"]: i + 1 for i, slot in enumerate(formatted_time_slots)}
        
        # Add class sessions
        for session in class_sessions:
            if session.day in classes:
                time_slot_id = time_slot_map.get(session.time_slot)
                if time_slot_id:
                    classes[session.day].append({
                        "timeSlotId": time_slot_id,
                        "subject": session.subject,
                        "teacher": session.teacher,
                        "classroom": session.classroom
                    })
        
        # Create response structure expected by frontend
        schedule_data = {
            "days": days,
            "time_slots": formatted_time_slots,
            "classes": classes
        }
        
        # Prepare response
        response = {
            "status": "success",
            "schedule_id": schedule.name,
            "grade": schedule.grade,
            "grade_name": grade_info.grade_name if grade_info else schedule.grade,
            "section": schedule.section,
            "academic_year": schedule.academic_year,
            "term": schedule.term,
            "schedule_data": schedule_data,
            "subjects": get_all_subjects(),
            "teachers": get_all_teachers(),
            "rooms": get_all_classrooms(),
        }
        
        # Add sections data
        sections_data = get_all_sections()
        if sections_data.get("status") == "success":
            response["sections"] = sections_data.get("message")
        else:
            # Fallback to default if API fails
            response["sections"] = [
                {"id": "A", "name": "A"},
                {"id": "B", "name": "B"},
                {"id": "C", "name": "C"}
            ]
        
        return response

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Class Schedule API Error")
        return {"error": str(e), "status": "error"}

def get_all_subjects():
    """Get all subjects with their details"""
    subjects = frappe.get_all(
        "Subject", 
        fields=["name", "subject_name", "subject_code", "category", "color"]
    )
    
    return [
        {
            "id": subject.name,
            "name": subject.subject_name,
            "code": subject.subject_code,
            "category": subject.category,
            "color": subject.color or get_default_subject_color(subject.category)
        }
        for subject in subjects
    ]

def get_all_teachers():
    """Get all teachers with their details"""
    teachers = frappe.get_all(
        "Teacher", 
        fields=["name", "teacher_name", "title"]
    )
    
    return [
        {
            "id": teacher.name,
            "name": teacher.teacher_name,
            "title": teacher.title
        }
        for teacher in teachers
    ]

def get_all_classrooms():
    """Get all classrooms with their details"""
    classrooms = frappe.get_all(
        "Classroom", 
        fields=["name", "room_name", "room_number", "room_type"]
    )
    
    return [
        {
            "id": room.name,
            "name": room.room_name,
            "number": room.room_number,
            "type": room.room_type
        }
        for room in classrooms
    ]

def get_default_subject_color(category):
    """Return default color based on subject category"""
    color_map = {
        "Core": "bg-blue-500/90",
        "Islamic": "bg-emerald-500/90",
        "Elective": "bg-purple-600",
        "Specialization": "bg-indigo-600"
    }
    return color_map.get(category, "bg-gray-500/90")

@frappe.whitelist(allow_guest=True)
def create_class_schedule(grade, section, academic_year=None, term=None):
    """Create a new class schedule"""
    try:
        # Validate required fields
        if not grade or not section:
            frappe.throw("Grade and Section are required")
            
        # Get current academic year if not specified
        if not academic_year:
            current_year = frappe.get_all(
                "Academic Year",
                filters={"is_active": 1},
                fields=["name"],
                order_by="start_date desc",
                limit=1
            )
            if current_year:
                academic_year = current_year[0].name
            else:
                frappe.throw("No active academic year found")
        
        # Check if a schedule already exists for this criteria
        existing_schedule = frappe.get_all(
            "Class Schedule",
            filters={
                "grade": grade,
                "section": section,
                "academic_year": academic_year,
                "is_active": 1
            },
            limit=1
        )
        
        if existing_schedule:
            return {
                "status": "exists",
                "message": "A schedule already exists for this grade and section",
                "schedule_id": existing_schedule[0].name
            }
            
        # Create a new schedule
        schedule_doc = frappe.get_doc({
            "doctype": "Class Schedule",
            "grade": grade,
            "section": section,
            "academic_year": academic_year,
            "term": term,
            "is_active": 1
        })
        
        schedule_doc.insert()
        
        return {
            "status": "success",
            "message": "Schedule created successfully",
            "schedule_id": schedule_doc.name
        }
        
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Class Schedule Creation Error")
        return {"error": str(e), "status": "error"}

@frappe.whitelist()
def update_class_session(schedule_id, day, time_slot_id, subject=None, teacher=None, room=None):    
    """Update or create a class session."""
    try:
        # Get the actual time slot name from ID
        time_slots = frappe.get_all(
            "Time Slot",
            fields=["name"],
            order_by="start_time"
        )
        
        if not time_slots or len(time_slots) < time_slot_id:
            frappe.throw(f"Time slot with ID {time_slot_id} not found")
            
        time_slot = time_slots[time_slot_id - 1].name
        
        # Check if session already exists
        existing = frappe.get_all(
            "Class Session",
            filters={
                "class_schedule": schedule_id,
                "day": day,
                "time_slot": time_slot
            },
            fields=["name"]
        )
        
        if existing:
            # Update existing session
            doc = frappe.get_doc("Class Session", existing[0].name)
            doc.subject = subject
            doc.teacher = teacher
            doc.room = room
            doc.save()
        else:
            # Create new session
            doc = frappe.get_doc({
                "doctype": "Class Session",
                "class_schedule": schedule_id,
                "day": day,
                "time_slot": time_slot,
                "subject": subject,
                "teacher": teacher,
                "room": room
            })
            doc.insert()
            
        return {
            "status": "success",
            "message": "Class session updated"
        }
        
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Class Session Update Error")
        return {"error": str(e), "status": "error"}
    
    
@frappe.whitelist(allow_guest=True)
def get_all_grades():
    """Get all grades available in the system"""
    try:
        grades = frappe.get_all(
            "School Grade",
            fields=["name", "grade_name", "sequence_no"],
            order_by="sequence_no"
        )
        
        return {
            "status": "success",
            "message": [
                {
                    "id": grade.name,
                    "name": grade.grade_name
                }
                for grade in grades
            ]
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Get All Grades API Error")
        return {"error": str(e), "status": "error"}
    
@frappe.whitelist(allow_guest=True)
def get_all_sections():
    """Get all active class sections available in the system"""
    try:
        sections = frappe.get_all(
            "Class Section",
            fields=["name", "section_name", "sequence_no"],
            filters={"is_active": 1},
            order_by="sequence_no"
        )
        
        return {
            "status": "success",
            "message": [
                {
                    "id": section.name,
                    "name": section.section_name
                }
                for section in sections
            ]
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Get All Sections API Error")
        return {"error": str(e), "status": "error"}

@frappe.whitelist(allow_guest=True)
def get_exam_dates(**kwargs):
    """
    Get exam dates for a specific grade and section
    
    Args:
        grade (str): The grade ID
        section (str): The section ID
        month (int, optional): Month number (1-12)
        year (int, optional): Year number
        exam_type (str, optional): Type of exam to filter by, defaults to 'all'
        
    Returns:
        dict: Dictionary containing exam dates and related information
    """
    try:
        grade = kwargs.get('grade')
        section = kwargs.get('section')
        month = int(kwargs.get('month', datetime.now().month))
        year = int(kwargs.get('year', datetime.now().year))
        exam_type = kwargs.get('exam_type', 'all')
        
        # If grade or section is missing, return available options instead of an error
        if not grade or not section:
            # Get available grades for dropdown
            grades = frappe.get_all("School Grade", 
                                   fields=["name as id", "grade_name as name"],
                                #    filters={"is_active": 1},
                                   order_by="sequence_no")
            
            # Get available sections for dropdown
            sections = frappe.get_all("Class Section",
                                    fields=["name as id", "section_name as name"],
                                    filters={"is_active": 1},
                                    order_by="sequence_no")
            
            # Get exam types for dropdown
            exam_types = [
                {"id": "all", "name": "All Exams"},
                {"id": "quiz", "name": "Quizzes"},
                {"id": "midterm", "name": "Midterms"},
                {"id": "final", "name": "Finals"},
                {"id": "project", "name": "Projects"},
                {"id": "other", "name": "Other Assessments"}
            ]
            
            return {
                "success": True,
                "exams": [],
                "grades": grades,
                "sections": sections,
                "exam_types": exam_types
            }
        
        # Original code for when grade and section are provided
        # Build filters for the query
        filters = {
            "grade": grade,
            "section": section,
            "is_active": 1
        }
        
        # Add exam type filter if not 'all'
        if exam_type != 'all':
            filters["exam_type"] = exam_type
        
        # Get all matching exams
        exam_schedules = frappe.get_all(
            "Exam Schedule",
            filters=filters,
            fields=[
                "name", "grade", "section", "academic_year", "term", 
                "exam_type", "exam_date", "start_time", "end_time", 
                "duration", "classroom", "proctor", "subject", "notes"
            ]
        )
        
        # Further filter by month and year
        filtered_exams = []
        for exam in exam_schedules:
            
            
            exam_date = frappe.utils.getdate(exam.exam_date)

            
            if exam_date.month == month and exam_date.year == year:
                # Get classroom details
                if exam.classroom:
                    classroom = frappe.get_doc("Classroom", exam.classroom)
                    exam["location"] = f"{classroom.room_name} ({classroom.building}, Floor {classroom.floor})"
                else:
                    exam["location"] = "TBD"
                
                # Get subject details
                if exam.subject:
                    subject = frappe.get_doc("Subject", exam.subject)
                    exam["subject"] = {
                        "id": subject.name,
                        "name": subject.subject_name,
                        "code": subject.subject_code,
                        "category": subject.category
                    }
                
                # Get teacher/proctor details
                if exam.proctor:
                    teacher = frappe.get_doc("Teacher", exam.proctor)
                    exam["teacher"] = {
                        "id": teacher.name,
                        "name": teacher.teacher_name
                    }
                
                filtered_exams.append(exam)
        
        # Get available exam types for the dropdown
        exam_types = [
            {"id": "all", "name": "All Exams"},
            {"id": "quiz", "name": "Quizzes"},
            {"id": "midterm", "name": "Midterms"},
            {"id": "final", "name": "Finals"},
            {"id": "project", "name": "Projects"},
            {"id": "other", "name": "Other Assessments"}
        ]
        
        return {
            "success": True,
            "exams": filtered_exams,
            "exam_types": exam_types
        }
        
    except Exception as e:
        frappe.log_error(f"Error in get_exam_dates: {str(e)}", "Exam Dates API Error")
        return {
            "success": False,
            "error": str(e)
        }
        
# Get Application Status
# Update the get_application_status function in labmanager/api/api.py

# @frappe.whitelist(allow_guest=True)
# def get_application_status(registration_id=None):
#     """Get detailed status of a student registration application"""
#     try:
#         # Add logging to debug
#         frappe.logger().debug(f"get_application_status called with registration_id: {registration_id}")
        
#         if not registration_id:
#             frappe.logger().debug("No registration ID provided")
#             return {
#                 "status": "error",
#                 "message": "Registration ID is required"
#             }
            
#         # Try to get the registration document by the encrypted registration_id field
#         # not by document name
#         registrations = frappe.get_all(
#             "Student Registration",
#             filters={"registration_id": registration_id},
#             fields=["name"],
#             limit=1
#         )
        
#         if not registrations:
#             frappe.logger().debug(f"Registration with ID {registration_id} not found")
#             return {
#                 "status": "error",
#                 "message": f"Application with ID {registration_id} not found"
#             }
            
#         # Get the actual document using the name we found
#         doc = frappe.get_doc("Student Registration", registrations[0].name)
#         frappe.logger().debug(f"Found student registration with name: {doc.name}")
        
#         # If status field doesn't exist yet, we'll treat it as "Submitted"
#         current_status = getattr(doc, "status", "Submitted")
#         frappe.logger().debug(f"Application status: {current_status}")
        
#         # Create a manual timeline for now
#         timeline_entries = [
#             {
#                 "date": str(doc.creation),
#                 "status": "Submitted",
#                 "description": "Application submitted successfully",
#                 "created_by": "System"
#             }
#         ]
        
#         # Mock up document requirements based on the program
#         documents = []
#         if doc.previous_education == "High School":
#             documents.append({
#                 "document_type": "High School Transcript",
#                 "status": "Requested",
#                 "submitted_date": None,
#                 "notes": "Please submit your complete high school transcript"
#             })
#             documents.append({
#                 "document_type": "High School Diploma",
#                 "status": "Requested",
#                 "submitted_date": None,
#                 "notes": "Please submit a copy of your high school diploma"
#             })
#         elif doc.previous_education in ["Bachelor's Degree", "Master's Degree"]:
#             documents.append({
#                 "document_type": "College/University Transcript",
#                 "status": "Requested",
#                 "submitted_date": None,
#                 "notes": "Please submit your complete college/university transcript"
#             })
#             documents.append({
#                 "document_type": "Degree Certificate",
#                 "status": "Requested",
#                 "submitted_date": None,
#                 "notes": f"Please submit a copy of your {doc.previous_education}"
#             })
            
#         # All applicants need these documents
#         documents.append({
#             "document_type": "Identity Document (Passport/National ID)",
#             "status": "Requested",
#             "submitted_date": None,
#             "notes": "Please submit a valid government-issued ID"
#         })
#         documents.append({
#             "document_type": "Recent Passport Photo",
#             "status": "Requested",
#             "submitted_date": None,
#             "notes": "Please submit a recent passport-sized photo (taken within the last 6 months)"
#         })
        
#         # Mock interview schedule (if applicable)
#         interviews = []
#         if doc.desired_academic_program == "Bachelor of Computer Application (BCA)":
#             # Mock interview for BCA program (future date)
#             import datetime
#             interview_date = datetime.datetime.now() + datetime.timedelta(days=14)
#             interviews.append({
#                 "date": interview_date.strftime('%Y-%m-%d'),
#                 "time": "10:00:00",
#                 "interviewer": "Dr. Ahmad Al-Farsi",
#                 "location": "Online (Zoom)",
#                 "status": "Scheduled",
#                 "notes": "Please prepare to discuss your programming experience and academic goals"
#             })
        
#         # Next steps guidance
#         next_steps = f"""
# 1. Please submit all requested documents through the student portal.
# 2. Complete your application fee payment of $50 USD.
# 3. Prepare for your admission interview (if scheduled).
# 4. Check back regularly for updates on your application status.

# For any questions, please contact admissions@techethica.edu
#         """
        
#         # Format the data for the response
#         response_data = {
#             "application_id": doc.name,
#             "registration_id": doc.registration_id,
#             "student_name": f"{doc.first_name} {doc.middle_name or ''} {doc.last_name or ''}".strip(),
#             "email": doc.email,
#             "program": doc.desired_academic_program,
#             "specialization": doc.islamic_studies_specialization,
#             "current_status": current_status,
#             "submission_date": str(doc.creation),
#             "timeline": timeline_entries,
#             "documents": documents,
#             "interviews": interviews,
#             "next_steps": next_steps,
#             "feedback": "" # No feedback yet
#         }
        
#         frappe.logger().debug(f"Returning response data: {response_data}")
#         return {
#             "status": "success",
#             "data": response_data
#         }
#     except Exception as e:
#         frappe.log_error(frappe.get_traceback(), "Application Status API Error")
#         frappe.logger().debug(f"Error in get_application_status: {str(e)}")
#         return {
#             "status": "error",
#             "message": str(e)
#         }

@frappe.whitelist(allow_guest=True)
def get_application_status(registration_id=None):
    """Get detailed status of a student registration application"""
    try:
        # Add logging to debug
        frappe.logger().debug(f"get_application_status called with registration_id: {registration_id}")
        
        if not registration_id:
            frappe.logger().debug("No registration ID provided")
            return {
                "status": "error",
                "message": "Registration ID is required"
            }
            
        # Try to get the registration document by the registration_id field
        # not by document name
        registrations = frappe.get_all(
            "Student Registration",
            filters={"registration_id": registration_id},
            fields=["name", "first_name", "middle_name", "last_name", "email", 
                   "desired_academic_program", "islamic_studies_specialization", 
                   "status", "next_steps", "feedback", "creation"],
            limit=1
        )
        
        if not registrations:
            frappe.logger().debug(f"Registration with ID {registration_id} not found")
            return {
                "status": "error",
                "message": f"Application with ID {registration_id} not found"
            }
            
        # Get the actual document using the name we found
        doc = registrations[0]
        frappe.logger().debug(f"Found student registration with name: {doc.name}")
        
        # If status field doesn't exist yet, we'll treat it as "Submitted"
        current_status = doc.get("status") or "Submitted"
        frappe.logger().debug(f"Application status: {current_status}")
        
        # Get timeline entries
        timeline = frappe.get_all(
            "Application Timeline",
            filters={"registration_id": doc.name},
            fields=["date", "status", "description", "created_by"],
            order_by="date desc"
        )
        
        # If no timeline entries exist, create the initial submission entry
        if not timeline:
            # Create the initial submission entry in the timeline
            timeline_doc = frappe.get_doc({
                "doctype": "Application Timeline",
                "registration_id": doc.name,
                "date": doc.creation,
                "status": "Submitted",
                "description": "Application submitted successfully",
                "created_by": "System"
            })
            timeline_doc.insert(ignore_permissions=True)
            
            # Add to our response
            timeline = [{
                "date": doc.creation,
                "status": "Submitted",
                "description": "Application submitted successfully",
                "created_by": "System"
            }]
        
        # Get document requirements
        documents = frappe.get_all(
            "Required Document",
            filters={"registration_id": doc.name},
            fields=["document_type", "status", "submitted_date", "notes"],
            order_by="creation"
        )
        
        # If no documents are defined yet, create default document requirements
        if not documents:
            create_default_document_requirements(doc)
            
            # Fetch the newly created documents
            documents = frappe.get_all(
                "Required Document",
                filters={"registration_id": doc.name},
                fields=["document_type", "status", "submitted_date", "notes"],
                order_by="creation"
            )
        
        # Get scheduled interviews
        interviews = frappe.get_all(
            "Interview Schedule",
            filters={"registration_id": doc.name},
            fields=["date", "time", "interviewer", "location", "status", "notes"],
            order_by="date"
        )
        
        # Format the data for the response
        student_name = " ".join(filter(None, [doc.first_name, doc.middle_name, doc.last_name]))
        
        response_data = {
            "application_id": doc.name,
            "registration_id": registration_id,
            "student_name": student_name,
            "email": doc.email,
            "program": doc.desired_academic_program,
            "specialization": doc.islamic_studies_specialization,
            "current_status": current_status,
            "submission_date": str(doc.creation),
            "timeline": timeline,
            "documents": documents,
            "interviews": interviews,
            "next_steps": doc.next_steps or get_default_next_steps(current_status),
            "feedback": doc.feedback or ""
        }
        
        frappe.logger().debug(f"Returning response data for application status")
        return {
            "status": "success",
            "data": response_data
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Application Status API Error")
        frappe.logger().debug(f"Error in get_application_status: {str(e)}")
        return {
            "status": "error",
            "message": str(e)
        }

def create_default_document_requirements(registration_doc):
    """Create default document requirements based on the program and education level"""
    try:
        # Different document requirements based on education level
        if registration_doc.previous_education == "High School":
            documents = [
                {
                    "document_type": "High School Transcript",
                    "status": "Requested",
                    "notes": "Please submit your complete high school transcript"
                },
                {
                    "document_type": "High School Diploma",
                    "status": "Requested",
                    "notes": "Please submit a copy of your high school diploma"
                }
            ]
        elif registration_doc.previous_education in ["Bachelor's Degree", "Master's Degree"]:
            documents = [
                {
                    "document_type": "College/University Transcript",
                    "status": "Requested",
                    "notes": "Please submit your complete college/university transcript"
                },
                {
                    "document_type": "Degree Certificate",
                    "status": "Requested",
                    "notes": f"Please submit a copy of your {registration_doc.previous_education}"
                }
            ]
        else:
            documents = []
            
        # Common documents for all applicants
        common_documents = [
            {
                "document_type": "Identity Document (Passport/National ID)",
                "status": "Requested",
                "notes": "Please submit a valid government-issued ID"
            },
            {
                "document_type": "Recent Passport Photo",
                "status": "Requested",
                "notes": "Please submit a recent passport-sized photo (taken within the last 6 months)"
            }
        ]
        
        documents.extend(common_documents)
        
        # Create the document requirements
        for doc in documents:
            req_doc = frappe.get_doc({
                "doctype": "Required Document",
                "registration_id": registration_doc.name,
                "document_type": doc["document_type"],
                "status": doc["status"],
                "notes": doc["notes"]
            })
            req_doc.insert(ignore_permissions=True)
            
        frappe.db.commit()
        
    except Exception as e:
        frappe.log_error(f"Error creating document requirements: {str(e)}")
        
def get_default_next_steps(status):
    """Get default next steps text based on application status"""
    
    next_steps = {
        "Submitted": """
1. Please check back regularly for updates on your application status.
2. Our admissions team will review your application within 5-7 business days.
3. You may be requested to provide additional documents or attend an interview.
4. For any questions, please contact admissions@techethica.edu
        """,
        
        "Under Review": """
1. Your application is currently being reviewed by our admissions committee.
2. This process typically takes 5-7 business days.
3. You will be notified of any additional requirements or next steps.
4. Please check back regularly for updates.
        """,
        
        "Documents Requested": """
1. Please upload the requested documents as soon as possible.
2. Make sure all documents are clear, complete, and in PDF format.
3. Your application will continue to be processed once all documents are received.
4. If you have any questions about the required documents, please contact admissions@techethica.edu
        """,
        
        "Interview Scheduled": """
1. Please prepare for your scheduled interview.
2. Make sure to attend the interview at the scheduled time.
3. Have your ID ready for verification.
4. Test your internet connection and equipment if it's an online interview.
        """,
        
        "Accepted": """
1. Congratulations on your acceptance!
2. Please complete the enrollment process within the next 2 weeks.
3. Submit any pending documents.
4. Pay the enrollment fee to secure your place.
5. Attend the orientation session (details will be provided via email).
        """,
        
        "Waitlisted": """
1. Your application has been waitlisted.
2. We will notify you if a spot becomes available.
3. This usually happens within 4-6 weeks from now.
4. You may consider applying to alternative programs in the meantime.
        """,
        
        "Rejected": """
1. We regret to inform you that your application was not successful at this time.
2. You may apply again for the next academic term.
3. Consider improving areas mentioned in the feedback.
4. Contact admissions@techethica.edu for more detailed feedback.
        """
    }
    
    return next_steps.get(status, next_steps["Submitted"])

@frappe.whitelist()
def update_application_status(registration_id, status, description=None, next_steps=None, feedback=None):
    """Update the status of a student registration application"""
    try:
        if not registration_id:
            return {
                "status": "error",
                "message": "Registration ID is required"
            }
            
        # Find the registration by registration_id
        registrations = frappe.get_all(
            "Student Registration",
            filters={"registration_id": registration_id},
            fields=["name"],
            limit=1
        )
        
        if not registrations:
            return {
                "status": "error",
                "message": f"Application with ID {registration_id} not found"
            }
            
        # Get the document
        doc = frappe.get_doc("Student Registration", registrations[0].name)
        
        # Update status and other fields
        doc.status = status
        
        if next_steps:
            doc.next_steps = next_steps
        else:
            doc.next_steps = get_default_next_steps(status)
            
        if feedback:
            doc.feedback = feedback
            
        doc.save()
        
        # Create a timeline entry
        timeline_doc = frappe.get_doc({
            "doctype": "Application Timeline",
            "registration_id": doc.name,
            "date": frappe.utils.now_datetime(),
            "status": status,
            "description": description or f"Application status updated to {status}",
            "created_by": frappe.session.user
        })
        timeline_doc.insert(ignore_permissions=True)
        
        return {
            "status": "success",
            "message": "Application status updated successfully"
        }
        
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Application Status Update Error")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist()
def request_document(registration_id, document_type, notes=None):
    """Request a document from the student"""
    try:
        if not registration_id or not document_type:
            return {
                "status": "error",
                "message": "Registration ID and document type are required"
            }
            
        # Find the registration by registration_id
        registrations = frappe.get_all(
            "Student Registration",
            filters={"registration_id": registration_id},
            fields=["name"],
            limit=1
        )
        
        if not registrations:
            return {
                "status": "error",
                "message": f"Application with ID {registration_id} not found"
            }
            
        # Check if the document already exists
        existing_docs = frappe.get_all(
            "Required Document",
            filters={
                "registration_id": registrations[0].name,
                "document_type": document_type
            },
            fields=["name"],
            limit=1
        )
        
        if existing_docs:
            # Update existing document request
            doc = frappe.get_doc("Required Document", existing_docs[0].name)
            doc.status = "Requested"
            if notes:
                doc.notes = notes
            doc.save()
        else:
            # Create new document request
            doc = frappe.get_doc({
                "doctype": "Required Document",
                "registration_id": registrations[0].name,
                "document_type": document_type,
                "status": "Requested",
                "notes": notes or f"Please submit your {document_type}"
            })
            doc.insert(ignore_permissions=True)
            
        # Update application status if needed
        registration_doc = frappe.get_doc("Student Registration", registrations[0].name)
        if registration_doc.status != "Documents Requested":
            registration_doc.status = "Documents Requested"
            registration_doc.next_steps = get_default_next_steps("Documents Requested")
            registration_doc.save()
            
            # Create a timeline entry
            timeline_doc = frappe.get_doc({
                "doctype": "Application Timeline",
                "registration_id": registration_doc.name,
                "date": frappe.utils.now_datetime(),
                "status": "Documents Requested",
                "description": f"Document requested: {document_type}",
                "created_by": frappe.session.user
            })
            timeline_doc.insert(ignore_permissions=True)
            
        return {
            "status": "success",
            "message": f"Document request for {document_type} created successfully"
        }
        
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Document Request Error")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist()
def schedule_interview(registration_id, date, time, interviewer=None, location=None, notes=None):
    """Schedule an interview for a student"""
    try:
        if not registration_id or not date or not time:
            return {
                "status": "error",
                "message": "Registration ID, date, and time are required"
            }
            
        # Find the registration by registration_id
        registrations = frappe.get_all(
            "Student Registration",
            filters={"registration_id": registration_id},
            fields=["name"],
            limit=1
        )
        
        if not registrations:
            return {
                "status": "error",
                "message": f"Application with ID {registration_id} not found"
            }
            
        # Create the interview schedule
        interview_doc = frappe.get_doc({
            "doctype": "Interview Schedule",
            "registration_id": registrations[0].name,
            "date": date,
            "time": time,
            "interviewer": interviewer,
            "location": location or "Online (Zoom)",
            "status": "Scheduled",
            "notes": notes or "Please be prepared to discuss your academic background and goals"
        })
        interview_doc.insert(ignore_permissions=True)
        
        # Update application status
        registration_doc = frappe.get_doc("Student Registration", registrations[0].name)
        registration_doc.status = "Interview Scheduled"
        registration_doc.next_steps = get_default_next_steps("Interview Scheduled")
        registration_doc.save()
        
        # Create a timeline entry
        timeline_doc = frappe.get_doc({
            "doctype": "Application Timeline",
            "registration_id": registration_doc.name,
            "date": frappe.utils.now_datetime(),
            "status": "Interview Scheduled",
            "description": f"Interview scheduled for {date} at {time}",
            "created_by": frappe.session.user
        })
        timeline_doc.insert(ignore_permissions=True)
        
        return {
            "status": "success",
            "message": "Interview scheduled successfully"
        }
        
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Interview Scheduling Error")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist(allow_guest=True)
def upload_application_document(registration_id, document_type, file_data):
    """Upload a document for a student application"""
    try:
        if not registration_id or not document_type or not file_data:
            return {
                "status": "error",
                "message": "Registration ID, document type, and file are required"
            }
            
        # Find the registration by registration_id
        registrations = frappe.get_all(
            "Student Registration",
            filters={"registration_id": registration_id},
            fields=["name"],
            limit=1
        )
        
        if not registrations:
            return {
                "status": "error",
                "message": f"Application with ID {registration_id} not found"
            }
            
        # Process the file upload
        # This is a simplified version. In reality, you would handle the file upload
        # using frappe's file API
        file_url = frappe.get_doc({
            "doctype": "File",
            "file_name": f"{document_type.replace(' ', '_')}_{registration_id}.pdf",
            "attached_to_doctype": "Student Registration",
            "attached_to_name": registrations[0].name,
            "content": file_data
        }).insert().file_url
        
        # Create document upload record
        upload_doc = frappe.get_doc({
            "doctype": "Application Document Upload",
            "registration_id": registrations[0].name,
            "document_type": document_type,
            "document_file": file_url,
            "upload_date": frappe.utils.now_datetime(),
            "status": "Submitted"
        })
        upload_doc.insert(ignore_permissions=True)
        
        # Update required document status
        required_docs = frappe.get_all(
            "Required Document",
            filters={
                "registration_id": registrations[0].name,
                "document_type": document_type
            },
            fields=["name"],
            limit=1
        )
        
        if required_docs:
            req_doc = frappe.get_doc("Required Document", required_docs[0].name)
            req_doc.status = "Submitted"
            req_doc.submitted_date = frappe.utils.today()
            req_doc.save()
            
        # Create a timeline entry
        timeline_doc = frappe.get_doc({
            "doctype": "Application Timeline",
            "registration_id": registrations[0].name,
            "date": frappe.utils.now_datetime(),
            "status": frappe.get_doc("Student Registration", registrations[0].name).status,
            "description": f"Document uploaded: {document_type}",
            "created_by": frappe.session.user or "Student"
        })
        timeline_doc.insert(ignore_permissions=True)
        
        return {
            "status": "success",
            "message": "Document uploaded successfully",
            "file_url": file_url
        }
        
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Document Upload Error")
        return {
            "status": "error",
            "message": str(e)
        }