# import frappe
# from frappe import _
# import json
# from datetime import datetime

# @frappe.whitelist(allow_guest=True)
# def get_events():
#     """Get all active events for the events page."""
#     try:
#         # Current date for filtering events
#         current_date = frappe.utils.getdate()
        
#         # Get upcoming and recent events
#         # You could choose to filter by date range or just get the latest/upcoming
#         events = frappe.get_all(
#             "Events",  # Replace with your actual doctype name for events
#             fields=[
#                 "name", "title", "description", "date", 
#                 "location", "organizer", "category", "image", "is_featured"
#             ],
#             filters={
#                 "is_active": 1
#             },
#             order_by="date desc"
#         )
        
#         # Process events
#         processed_events = []
#         for event in events:
#             # Format date if needed
#             if event.get("date"):
#                 # Make sure date is in a standard format
#                 event["date"] = event["date"].isoformat() if hasattr(event["date"], "isoformat") else str(event["date"])
            
#             # Get attendees if applicable
#             attendees = []
#             if frappe.db.exists("DocType", "Event Attendee"):
#                 attendees = frappe.get_all(
#                     "Event Attendee",
#                     filters={"event": event.name},
#                     fields=["name1", "title"]
#                 )
#                 event["attendees"] = attendees
            
#             processed_events.append(event)
        
#         # If no events found, return empty list
#         if not processed_events:
#             return {
#                 "status": "success",
#                 "events": []
#             }
        
#         return {
#             "status": "success",
#             "events": processed_events
#         }
#     except Exception as e:
#         frappe.log_error(f"Events API Error: {str(e)}\n{frappe.get_traceback()}")
#         return {
#             "status": "error",
#             "message": str(e)
#         }

# @frappe.whitelist(allow_guest=True)
# def get_event_details(event_id):
#     """Get detailed information about a specific event"""
#     try:
#         if not event_id:
#             return {
#                 "status": "error",
#                 "message": "Event ID is required"
#             }
            
#         # Get the event
#         event = frappe.get_doc("Events", event_id)
        
#         # Format the response
#         response = {
#             "id": event.name,
#             "title": event.title,
#             "description": event.description,
#             "date": event.date.isoformat() if hasattr(event.date, "isoformat") else str(event.date),
#             "location": event.location,
#             "organizer": event.organizer,
#             "category": event.category,
#             "image": event.image,
#             "is_featured": event.is_featured
#         }
        
#         # Get attendees if applicable
#         if frappe.db.exists("DocType", "Event Attendee"):
#             attendees = frappe.get_all(
#                 "Event Attendee",
#                 filters={"event": event_id},
#                 fields=["name1", "title"],
#                 order_by="sequence"
#             )
#             response["attendees"] = attendees
#         else:
#             response["attendees"] = []
            
#         # Get additional details if applicable
#         if frappe.db.exists("DocType", "Event Gallery"):
#             gallery_images = frappe.get_all(
#                 "Event Gallery",
#                 filters={"event": event_id},
#                 fields=["image", "caption"],
#                 order_by="sequence"
#             )
#             response["gallery"] = gallery_images
#         else:
#             response["gallery"] = []
            
#         # Get related documents if applicable
#         if frappe.db.exists("DocType", "Event Document"):
#             documents = frappe.get_all(
#                 "Event Document",
#                 filters={"event": event_id},
#                 fields=["title", "file", "description"],
#                 order_by="sequence"
#             )
#             response["documents"] = documents
#         else:
#             response["documents"] = []
        
#         return {
#             "status": "success",
#             "event": response
#         }
#     except Exception as e:
#         frappe.log_error(f"Event Details API Error: {str(e)}\n{frappe.get_traceback()}")
#         return {
#             "status": "error",
#             "message": str(e)
#         }

# @frappe.whitelist()
# def create_event(**kwargs):
#     """Create a new event"""
#     try:
#         # Validate required fields
#         required_fields = ["title", "date", "category"]
#         missing_fields = [field for field in required_fields if not kwargs.get(field)]
        
#         if missing_fields:
#             return {
#                 "status": "error",
#                 "message": f"Missing required fields: {', '.join(missing_fields)}"
#             }
            
#         # Create event document
#         event = frappe.new_doc("Events")
        
#         # Set fields
#         event.title = kwargs.get("title")
#         event.description = kwargs.get("description", "")
#         event.date = kwargs.get("date")
#         event.location = kwargs.get("location", "")
#         event.organizer = kwargs.get("organizer", "")
#         event.category = kwargs.get("category")
#         event.image = kwargs.get("image", "")
#         event.is_featured = kwargs.get("is_featured", 0)
#         event.is_active = kwargs.get("is_active", 1)
        
#         # Save the document
#         event.insert(ignore_permissions=True)
        
#         # Process attendees if provided
#         if kwargs.get("attendees") and frappe.db.exists("DocType", "Event Attendee"):
#             attendees = kwargs.get("attendees")
#             if isinstance(attendees, str):
#                 try:
#                     attendees = json.loads(attendees)
#                 except:
#                     attendees = []
                    
#             for i, attendee in enumerate(attendees):
#                 doc = frappe.new_doc("Event Attendee")
#                 doc.event = event.name
#                 doc.name = attendee.get("name1", "")
#                 doc.title = attendee.get("title", "")
#                 doc.sequence = i + 1
#                 doc.insert(ignore_permissions=True)
                
#         return {
#             "status": "success",
#             "message": "Event created successfully",
#             "event_id": event.name
#         }
#     except Exception as e:
#         frappe.log_error(f"Create Event API Error: {str(e)}\n{frappe.get_traceback()}")
#         return {
#             "status": "error",
#             "message": str(e)
#         }

import frappe
from frappe import _
import json
from datetime import datetime

@frappe.whitelist(allow_guest=True)
def get_events():
    """Get all active events for the events page."""
    try:
        # Current date for filtering events
        current_date = frappe.utils.getdate()
        
        # Get upcoming and recent events
        # You could choose to filter by date range or just get the latest/upcoming
        events = frappe.get_all(
            "Events",  # Replace with your actual doctype name for events
            fields=[
                "name", "title", "description", "date", 
                "location", "organizer", "category", "image", "is_featured", "is_active"
            ],
            filters={
                "is_active": 1
            },
            order_by="date desc"
        )
        
        # Process events
        processed_events = []
        for event in events:
            # Format date if needed
            if event.get("date"):
                # Make sure date is in a standard format
                event["date"] = event["date"].isoformat() if hasattr(event["date"], "isoformat") else str(event["date"])
            
            # Get attendees if applicable
            attendees = []
            if frappe.db.exists("DocType", "Event Attendee"):
                attendees = frappe.get_all(
                    "Event Attendee",
                    filters={"event": event.name},
                    fields=["name1", "title"]
                )
                event["attendees"] = attendees
            
            processed_events.append(event)
        
        # If no events found, return empty list
        if not processed_events:
            return {
                "status": "success",
                "events": []
            }
        
        return {
            "status": "success",
            "events": processed_events
        }
    except Exception as e:
        frappe.log_error(f"Events API Error: {str(e)}\n{frappe.get_traceback()}")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist(allow_guest=True)
def get_event_details(event_id):
    """Get detailed information about a specific event"""
    try:
        if not event_id:
            return {
                "status": "error",
                "message": "Event ID is required"
            }
            
        # Get the event
        event = frappe.get_doc("Events", event_id)
        
        # Format the response
        response = {
            "id": event.name,
            "title": event.title,
            "description": event.description,
            "date": event.date.isoformat() if hasattr(event.date, "isoformat") else str(event.date),
            "location": event.location,
            "organizer": event.organizer,
            "category": event.category,
            "image": event.image,
            "is_featured": event.is_featured,
            "is_active": event.is_active,
            "time": "9:00 AM - 12:00 PM"  # You might want to add a time field to your Events doctype
        }
        
        # Get attendees if applicable
        if frappe.db.exists("DocType", "Event Attendee"):
            attendees = frappe.get_all(
                "Event Attendee",
                filters={"event": event_id},
                fields=["name1", "title"],
                order_by="sequence"
            )
            response["attendees"] = attendees
        else:
            response["attendees"] = []
            
        # Get additional details if applicable
        if frappe.db.exists("DocType", "Event Gallery"):
            gallery_images = frappe.get_all(
                "Event Gallery",
                filters={"event": event_id},
                fields=["image", "caption"],
                order_by="sequence"
            )
            response["gallery"] = gallery_images
        else:
            response["gallery"] = []
            
        # Get related documents if applicable
        if frappe.db.exists("DocType", "Event Document"):
            documents = frappe.get_all(
                "Event Document",
                filters={"event": event_id},
                fields=["title", "file", "description"],
                order_by="sequence"
            )
            response["documents"] = documents
        else:
            response["documents"] = []
        
        return {
            "status": "success",
            "event": response
        }
    except Exception as e:
        frappe.log_error(f"Event Details API Error: {str(e)}\n{frappe.get_traceback()}")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist()
def create_event(**kwargs):
    """Create a new event"""
    try:
        # Validate required fields
        required_fields = ["title", "date", "category"]
        missing_fields = [field for field in required_fields if not kwargs.get(field)]
        
        if missing_fields:
            return {
                "status": "error",
                "message": f"Missing required fields: {', '.join(missing_fields)}"
            }
            
        # Create event document
        event = frappe.new_doc("Events")
        
        # Set fields
        event.title = kwargs.get("title")
        event.description = kwargs.get("description", "")
        event.date = kwargs.get("date")
        event.location = kwargs.get("location", "")
        event.organizer = kwargs.get("organizer", "")
        event.category = kwargs.get("category")
        event.image = kwargs.get("image", "")
        event.is_featured = kwargs.get("is_featured", 0)
        event.is_active = kwargs.get("is_active", 1)
        
        # Save the document
        event.insert(ignore_permissions=True)
        
        # Process attendees if provided
        if kwargs.get("attendees") and frappe.db.exists("DocType", "Event Attendee"):
            attendees = kwargs.get("attendees")
            if isinstance(attendees, str):
                try:
                    attendees = json.loads(attendees)
                except:
                    attendees = []
                    
            for i, attendee in enumerate(attendees):
                doc = frappe.new_doc("Event Attendee")
                doc.event = event.name
                doc.name1 = attendee.get("name1", "")
                doc.title = attendee.get("title", "")
                doc.sequence = i + 1
                doc.insert(ignore_permissions=True)
                
        return {
            "status": "success",
            "message": "Event created successfully",
            "event_id": event.name
        }
    except Exception as e:
        frappe.log_error(f"Create Event API Error: {str(e)}\n{frappe.get_traceback()}")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist()
def add_event_gallery_image(event_id, image, caption=None, sequence=0):
    """Add an image to the event gallery"""
    try:
        if not event_id or not image:
            return {
                "status": "error",
                "message": "Event ID and image are required"
            }
            
        # Check if the event exists
        if not frappe.db.exists("Events", event_id):
            return {
                "status": "error",
                "message": "Event not found"
            }
            
        # Create gallery item
        gallery_item = frappe.new_doc("Event Gallery")
        gallery_item.event = event_id
        gallery_item.image = image
        gallery_item.caption = caption or f"Image for {event_id}"
        gallery_item.sequence = sequence
        
        # Save the document
        gallery_item.insert(ignore_permissions=True)
        
        return {
            "status": "success",
            "message": "Gallery image added successfully",
            "gallery_id": gallery_item.name
        }
    except Exception as e:
        frappe.log_error(f"Add Event Gallery Image Error: {str(e)}\n{frappe.get_traceback()}")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist()
def add_event_document(event_id, title, file, description=None, sequence=0):
    """Add a document to the event"""
    try:
        if not event_id or not title or not file:
            return {
                "status": "error",
                "message": "Event ID, title, and file are required"
            }
            
        # Check if the event exists
        if not frappe.db.exists("Events", event_id):
            return {
                "status": "error",
                "message": "Event not found"
            }
            
        # Create document
        event_doc = frappe.new_doc("Event Document")
        event_doc.event = event_id
        event_doc.title = title
        event_doc.file = file
        event_doc.description = description or ""
        event_doc.sequence = sequence
        
        # Save the document
        event_doc.insert(ignore_permissions=True)
        
        return {
            "status": "success",
            "message": "Document added successfully",
            "document_id": event_doc.name
        }
    except Exception as e:
        frappe.log_error(f"Add Event Document Error: {str(e)}\n{frappe.get_traceback()}")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist(allow_guest=True)
def rsvp_for_event(event_id, name, email, attending="yes", comments=None):
    """RSVP for an event"""
    try:
        if not event_id or not name or not email:
            return {
                "status": "error",
                "message": "Event ID, name, and email are required"
            }
            
        # Check if the event exists
        if not frappe.db.exists("Events", event_id):
            return {
                "status": "error",
                "message": "Event not found"
            }
        
        # Check if the user has already RSVPed
        existing_rsvp = frappe.db.exists("Event RSVP", {
            "event": event_id,
            "email": email
        })
        
        if existing_rsvp:
            # Update existing RSVP
            rsvp = frappe.get_doc("Event RSVP", existing_rsvp)
            rsvp.attending = attending.capitalize()
            if comments:
                rsvp.comments = comments
            rsvp.save(ignore_permissions=True)
            
            return {
                "status": "success",
                "message": "Your RSVP has been updated",
                "rsvp_id": rsvp.name
            }
        
        # Create new RSVP
        rsvp = frappe.new_doc("Event RSVP")
        rsvp.event = event_id
        rsvp.name1 = name
        rsvp.email = email
        rsvp.attending = attending.capitalize()
        if comments:
            rsvp.comments = comments
        
        # Save the document - the after_insert hook will send the email
        rsvp.insert(ignore_permissions=True)
        
        return {
            "status": "success",
            "message": "RSVP received successfully",
            "rsvp_id": rsvp.name
        }
    except Exception as e:
        frappe.log_error(f"RSVP Error: {str(e)}\n{frappe.get_traceback()}")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist()
def get_event_rsvps(event_id):
    """Get all RSVPs for an event"""
    try:
        if not event_id:
            return {
                "status": "error",
                "message": "Event ID is required"
            }
            
        # Check if the event exists
        if not frappe.db.exists("Events", event_id):
            return {
                "status": "error",
                "message": "Event not found"
            }
            
        # Get RSVPs
        rsvps = frappe.get_all(
            "Event RSVP",
            filters={"event": event_id},
            fields=["name", "name1", "email", "attending", "registration_date", "status", "comments"],
            order_by="registration_date desc"
        )
        
        return {
            "status": "success",
            "rsvps": rsvps
        }
    except Exception as e:
        frappe.log_error(f"Get Event RSVPs Error: {str(e)}\n{frappe.get_traceback()}")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist(allow_guest=True)
def add_event_comment(event_id, name, email, comment):
    """Add a comment to an event"""
    try:
        if not event_id or not name or not email or not comment:
            return {
                "status": "error",
                "message": "Event ID, name, email, and comment are required"
            }
            
        # Check if the event exists
        if not frappe.db.exists("Events", event_id):
            return {
                "status": "error",
                "message": "Event not found"
            }
        
        # Create new comment
        event_comment = frappe.new_doc("Event Comment")
        event_comment.event = event_id
        event_comment.name1 = name
        event_comment.email = email
        event_comment.comment = comment
        
        # Save the document - the after_insert hook will notify admin
        event_comment.insert(ignore_permissions=True)
        
        return {
            "status": "success",
            "message": "Your comment has been submitted for review",
            "comment_id": event_comment.name
        }
    except Exception as e:
        frappe.log_error(f"Add Event Comment Error: {str(e)}\n{frappe.get_traceback()}")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist()
def get_event_comments(event_id, include_pending=False):
    """Get all approved comments for an event"""
    try:
        if not event_id:
            return {
                "status": "error",
                "message": "Event ID is required"
            }
            
        # Check if the event exists
        if not frappe.db.exists("Events", event_id):
            return {
                "status": "error",
                "message": "Event not found"
            }
        
        # Default filter for approved comments only
        filters = {
            "event": event_id,
            "status": "Approved"
        }
        
        # If include_pending is True, get all comments regardless of status
        if frappe.utils.cint(include_pending):
            filters = {
                "event": event_id
            }
            
        # Get comments
        comments = frappe.get_all(
            "Event Comment",
            filters=filters,
            fields=["name", "name1", "email", "comment", "comment_date", "status"],
            order_by="comment_date desc"
        )
        
        return {
            "status": "success",
            "comments": comments
        }
    except Exception as e:
        frappe.log_error(f"Get Event Comments Error: {str(e)}\n{frappe.get_traceback()}")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist()
def update_comment_status(comment_id, status):
    """Update the status of a comment (approve/reject)"""
    try:
        if not comment_id or not status:
            return {
                "status": "error",
                "message": "Comment ID and status are required"
            }
            
        # Check if the comment exists
        if not frappe.db.exists("Event Comment", comment_id):
            return {
                "status": "error",
                "message": "Comment not found"
            }
            
        # Validate status
        if status not in ["Approved", "Rejected", "Pending"]:
            return {
                "status": "error",
                "message": "Invalid status. Must be Approved, Rejected, or Pending"
            }
            
        # Update comment status
        comment = frappe.get_doc("Event Comment", comment_id)
        comment.status = status
        comment.save(ignore_permissions=True)
        
        # Notify user if comment is approved or rejected
        if status in ["Approved", "Rejected"]:
            self.notify_user_about_comment_status(comment)
        
        return {
            "status": "success",
            "message": f"Comment status updated to {status}"
        }
    except Exception as e:
        frappe.log_error(f"Update Comment Status Error: {str(e)}\n{frappe.get_traceback()}")
        return {
            "status": "error",
            "message": str(e)
        }
        
def notify_user_about_comment_status(comment):
    """Notify user about comment status change"""
    try:
        # Get event details
        event = frappe.get_doc("Events", comment.event)
        
        # Email subject and message
        subject = f"Your comment on '{event.title}' has been {comment.status.lower()}"
        
        if comment.status == "Approved":
            message = f"""
            <p>Dear {comment.name1},</p>
            
            <p>Your comment on the event "{event.title}" has been approved and is now visible on the website.</p>
            
            <p><strong>Your comment:</strong><br>
            {comment.comment}</p>
            
            <p>Thank you for your participation!</p>
            
            <p>Regards,<br>
            TechEthica Team</p>
            """
        else:  # Rejected
            message = f"""
            <p>Dear {comment.name1},</p>
            
            <p>We regret to inform you that your comment on the event "{event.title}" has not been approved.</p>
            
            <p>This can happen for various reasons, including community guidelines or relevance to the event.</p>
            
            <p>Thank you for your understanding.</p>
            
            <p>Regards,<br>
            TechEthica Team</p>
            """
            
        # Send email
        frappe.sendmail(
            recipients=[comment.email],
            sender=frappe.get_value("Website Settings", "Website Settings", "default_sender"),
            subject=subject,
            message=message
        )
    except Exception as e:
        frappe.log_error(f"Failed to notify user about comment status: {str(e)}", "Event Comment")

@frappe.whitelist(allow_guest=True)
def get_event_categories():
    """Get all event categories"""
    try:
        # This should match the options in your Events doctype field
        categories = [
            "Launch",
            "Workshop",
            "Seminar",
            "Conference",
            "Symposium",
            "Lecture",
            "CompetitionEducation",
            "Other"
        ]
        
        return {
            "status": "success",
            "categories": categories
        }
    except Exception as e:
        frappe.log_error(f"Get Event Categories Error: {str(e)}\n{frappe.get_traceback()}")
        return {
            "status": "error",
            "message": str(e)
        }