# labmanager/utils.py
import frappe
from labmanager.timeline_service import create_timeline_entry

# Update create_default_document_requirements function
def create_default_document_requirements(registration_doc):
    """Create default document requirements based on the program and education level"""
    try:
        # Different document requirements based on education level
        if registration_doc.previous_education in ["Class X", "SSLC"]:
            documents = [
                {
                    "document_type": "Class X / SSLC Transcript",
                    "status": "Approved",
                    "notes": "Please submit a copy of your Class X or SSLC transcript"
                }
            ]
        elif registration_doc.previous_education == "Plus One":
            documents = [
                {
                    "document_type": "Plus One Transcript",
                    "status": "Approved",
                    "notes": "Please submit a copy of your Plus One transcript"
                }
            ]
        elif registration_doc.previous_education in ["Plus Two", "Pre-University (PU)"]:
            documents = [
                {
                    "document_type": "PU / Plus Two Transcript",
                    "status": "Approved",
                    "notes": "Please submit a copy of your Pre-University or Plus Two transcript"
                }
            ]
        else:
            documents = []
            
            
        # Common documents for all applicants
        common_documents = [
            {
                "document_type": "Aadhaar Card",
                "status": "Approved",
                "notes": "Upload Aadhaar card as identity proof"
            },
            {
                "document_type": "Passport Size Photo",
                "status": "Approved",
                "notes": "Upload a recent passport-size photo"
            }
        ]
        
        documents.extend(common_documents)
        
        # Get the admissions staff user who requested the documents
        # Use a default if session user is not available or is Guest
        created_by = frappe.session.user
        if not created_by or created_by == "Guest":
            created_by = "Admissions Team"
        
        # Get student name for display
        student_name = f"{registration_doc.first_name} {registration_doc.last_name}".strip()
        
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
            
            # Create timeline entry for each document request with the proper creator
            create_timeline_entry(
                registration_doc.name,
                "Documents Requested",
                f"Document requested: {doc['document_type']}",
                created_by  # Use the admissions staff who requested it
            )
            
        frappe.db.commit()
        
        # If this is the first set of document requests, update the application status
        # but don't create redundant timeline entry
        if registration_doc.status != "Documents Requested":
            registration_doc.status = "Documents Requested"
            registration_doc.next_steps = get_default_next_steps("Documents Requested")
            registration_doc.save()
            
       
        return True
    except Exception as e:
        frappe.log_error(f"Error creating document requirements: {str(e)}")
        return False

def get_default_next_steps(status):
    """Get default next steps text based on application status"""
    
    next_steps = {
        "Submitted": """
1. Please check back regularly for updates on your application status.
2. Our admissions team will review your application within 5-7 business days.
3. You may be requested to provide additional documents or attend an interview.
4. For any questions, please contact admin@techethica.in
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
4. If you have any questions about the required documents, please contact admin@techethica.in
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
4. Contact admin@techethica.in for more detailed feedback.
        """
    }
    
    return next_steps.get(status, next_steps["Submitted"])