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