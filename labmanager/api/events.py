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
                "location", "organizer", "category", "image", "is_featured"
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
            "is_featured": event.is_featured
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
                doc.name = attendee.get("name1", "")
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