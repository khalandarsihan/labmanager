app_name = "labmanager"
app_title = "LabManager"
app_publisher = "Khalandar Sihan"
app_description = "Manage labs"
app_email = "khasihanai@gmail.com"
app_license = "mit"

# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "labmanager",
# 		"logo": "/assets/labmanager/logo.png",
# 		"title": "LabManager",
# 		"route": "/labmanager",
# 		"has_permission": "labmanager.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/labmanager/css/labmanager.css"
# app_include_js = "/assets/labmanager/js/labmanager.js"
app_include_js = ["/assets/labmanager/js/lab_dockerfile.js"]

# include js, css files in header of web template
# web_include_css = "/assets/labmanager/css/labmanager.css"
# web_include_js = "/assets/labmanager/js/labmanager.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "labmanager/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}

doctype_js = {
    "Lab Dockerfile": "public/js/lab_dockerfile.js"
}

# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "labmanager/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
home_page = "home"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# automatically load and sync documents of this doctype from downstream apps
# importable_doctypes = [doctype_1]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "labmanager.utils.jinja_methods",
# 	"filters": "labmanager.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "labmanager.install.before_install"
# after_install = "labmanager.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "labmanager.uninstall.before_uninstall"
# after_uninstall = "labmanager.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "labmanager.utils.before_app_install"
# after_app_install = "labmanager.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "labmanager.utils.before_app_uninstall"
# after_app_uninstall = "labmanager.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "labmanager.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"labmanager.tasks.all"
# 	],
# 	"daily": [
# 		"labmanager.tasks.daily"
# 	],
# 	"hourly": [
# 		"labmanager.tasks.hourly"
# 	],
# 	"weekly": [
# 		"labmanager.tasks.weekly"
# 	],
# 	"monthly": [
# 		"labmanager.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "labmanager.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "labmanager.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "labmanager.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["labmanager.utils.before_request"]
# after_request = ["labmanager.utils.after_request"]

# Job Events
# ----------
# before_job = ["labmanager.utils.before_job"]
# after_job = ["labmanager.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"labmanager.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }



#  Include lab_core in modules
modules = {
    "LabManager": {
        "lab_core": ["session_manager", "container_manager", "guacamole_manager"]
    }
}

allow_cors = "*"

whitelisted_methods = {
    "frappe.auth.get_csrf_token": True,
    "labmanager.labmanager.lab_core.lab_controller.start_lab_session": True,
    "labmanager.labmanager.lab_core.lab_controller.end_lab_session": True,
    "labmanager.labmanager.lab_core.lab_controller.extend_lab_session": True,
    "labmanager.labmanager.lab_core.lab_controller.get_active_session": True,
    "labmanager.labmanager.api.api.get_course_details": True,
    "labmanager.api.api.register_student": True,
    "labmanager.api.api.get_registration_status": True,
    "labmanager.api.api.update_registration": True,
    "labmanager.api.api.get_education_levels": True,
    "labmanager.api.api.get_academic_programs": True,
    "labmanager.api.api.get_islamic_specializations": True,
    "labmanager.api.api.get_registration_details": True,
}

# Add CORS configuration for your frontend
cors_allowed_origins = ["*"]  # For development - restrict this in production
cors_allowed_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
cors_allowed_headers = ["*"]
cors_expose_headers = [
    "X-Frappe-CSRF-Token",
    "Content-Type",
    "X-Rate-Limit-Limit",
    "X-Rate-Limit-Remaining",
    "X-Rate-Limit-Reset"
]
cors_allow_credentials = True

# In hooks.py
web_template = [
    {
        "template": "labmanager/web_template/techethica_navbar/techethica_navbar.html",
        "condition": [],
        "name": "techethica_navbar"
    },
    {
        "template": "labmanager/web_template/techethica_footer/techethica_footer.html",
        "condition": [],
        "name": "techethica_footer"
    }
]

website_context = {
    "hide_login": 1,
    "hide_signup": 1,
    "hide_footer": 1,
    # "hide_navbar": 1,
    "top_bar_items": []
}

{
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack --mode development --watch",
    "build:css": "tailwindcss -i ./src/styles/base.css -o ../labmanager/public/css/style.css --watch"
  }
}

# website_route_rules = [
#     {"from_route": "/courses/<course>", "to_route": "courses/details"},
#     {"from_route": "/student/enrollment", "to_route": "www/student/enrollment.html"},
# ]

# website_route_rules = [
#     # {"from_route": "/courses/<course>", "to_route": "www/courses/details.html"},
#     {"from_route": "/courses/<course>", "to_route": "courses/details"},
#     {"from_route": "/student-registration/<name>", "to_route": "student-registration/details"},
# ]

website_route_rules = [
    {"from_route": "/home-react", "to_route": "home_react"},
    {"from_route": "/courses/<course>", "to_route": "courses/details"},
    {"from_route": "/student-registration/new", "to_route": "student-registration/new"},
    {"from_route": "/student-registration/<name>", "to_route": "student-registration/details"},
    {"from_route": "/student-registration", "to_route": "student-registration/index"},
    {"from_route": "/student-registration/success", "to_route": "student-registration/success"},
]

api_spec = {
    'labmanager.api.get_course_data': {
        'methods': ['GET']
    },
        'labmanager.api.api.register_student': {
        'methods': ['POST'],
        'auth_required': False
    },
    'labmanager.api.api.get_registration_status': {
        'methods': ['GET'],
        'auth_required': False
    },
    'labmanager.api.api.update_registration': {
        'methods': ['PUT'],
        'auth_required': False
    },
    'labmanager.api.api.get_education_levels': {
        'methods': ['GET'],
        'auth_required': False
    },
    'labmanager.api.api.get_academic_programs': {
        'methods': ['GET'],
        'auth_required': False
    },
    'labmanager.api.api.get_islamic_specializations': {
        'methods': ['GET'],
        'auth_required': False
    },
    'labmanager.api.api.get_registration_details': {
        'methods': ['GET'],
        'auth_required': False
    }
}


override_whitelisted_methods = {
    "your_app.api.get_course_details": "labmanager.api.get_course_details",
    "your_app.api.enroll_student": "labmanager.api.enroll_student"
}

socketio = True

max_file_size = 10 * 1024 * 1024  # 10MB