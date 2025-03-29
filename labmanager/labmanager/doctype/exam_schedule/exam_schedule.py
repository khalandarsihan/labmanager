# Copyright (c) 2025, Khalandar Sihan and contributors
# For license information, please see license.txt

# Copyright (c) 2025, Khalandar Sihan and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class ExamSchedule(Document):
    def before_save(self):
        """Calculate duration from start and end time if not specified"""
        if not self.duration and self.start_time and self.end_time:
            start_dt = frappe.utils.get_datetime(f"2000-01-01 {self.start_time}")
            end_dt = frappe.utils.get_datetime(f"2000-01-01 {self.end_time}")
            
            # Handle end time that crosses midnight
            if end_dt < start_dt:
                end_dt = frappe.utils.add_days(end_dt, 1)
                
            duration_seconds = (end_dt - start_dt).total_seconds()
            self.duration = int(duration_seconds / 60)  # Convert to minutes
            
    def validate(self):
        """Validate exam schedule"""
        self.validate_dates()
        self.validate_times()
        
    def validate_dates(self):
        """Ensure exam date falls within academic term dates"""
        if self.term and self.exam_date:
            term_doc = frappe.get_doc("Academic Term", self.term)
            
            # Convert string dates to datetime.date objects for comparison
            exam_date = frappe.utils.getdate(self.exam_date)
            
            if term_doc.start_date:
                term_start_date = frappe.utils.getdate(term_doc.start_date)
                if exam_date < term_start_date:
                    frappe.throw(f"Exam date cannot be before term start date ({term_doc.start_date})")
                    
            if term_doc.end_date:
                term_end_date = frappe.utils.getdate(term_doc.end_date)
                if exam_date > term_end_date:
                    frappe.throw(f"Exam date cannot be after term end date ({term_doc.end_date})")
    
    def validate_times(self):
        """Validate start and end times"""
        if self.start_time and self.end_time:
            if self.start_time >= self.end_time:
                frappe.throw("End time must be after start time")
            
            # Validate against duration if provided
            if self.duration:
                start_dt = frappe.utils.get_datetime(f"2000-01-01 {self.start_time}")
                end_dt = frappe.utils.get_datetime(f"2000-01-01 {self.end_time}")
                
                # Handle end time that crosses midnight
                if end_dt < start_dt:
                    end_dt = frappe.utils.add_days(end_dt, 1)
                    
                duration_minutes = int((end_dt - start_dt).total_seconds() / 60)
                if duration_minutes != self.duration:
                    self.duration = duration_minutes