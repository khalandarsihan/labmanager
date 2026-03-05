# Copyright (c) 2025, Khalandar Sihan and contributors
# For license information, please see license.txt

import io

import frappe
from frappe.model.document import Document
from frappe.utils.file_manager import save_file


@frappe.whitelist()
def regenerate_all_qr():
	"""Bulk-regenerate QR codes for all Student Profiles (admin only)."""
	if frappe.session.user == "Guest":
		frappe.throw("Not permitted")
	students = frappe.get_all("Student Profile", fields=["name"])
	for s in students:
		doc = frappe.get_doc("Student Profile", s.name)
		_generate_and_attach_qr(doc)
	frappe.db.commit()
	return f"Regenerated QR for {len(students)} student(s)"


class StudentProfile(Document):
	def before_insert(self):
		# qr_id defaults to the document name (set by Frappe just before insert)
		if not self.qr_id:
			self.qr_id = self.name

	def after_insert(self):
		_generate_and_attach_qr(self)

	@frappe.whitelist()
	def regenerate_qr(self):
		"""Whitelisted — call from desk form button to regenerate QR image."""
		_generate_and_attach_qr(self)
		return self.qr_code


def _build_qr_payload(doc) -> str:
	"""
	Build the QR payload.  The student profile ID is always the first line so
	the attendance scanner can extract it with a simple split('\\n')[0].
	The remaining lines carry human-readable info visible when scanned by any
	generic QR reader (e.g. a phone camera).
	"""
	blood_label = {
		"A+": "A+ Positive", "A-": "A- Negative",
		"B+": "B+ Positive", "B-": "B- Negative",
		"O+": "O+ Positive", "O-": "O- Negative",
		"AB+": "AB+ Positive", "AB-": "AB- Negative",
	}

	def fmt_dob(d):
		# stored as YYYY-MM-DD → display as DD-MM-YYYY
		try:
			y, m, day = str(d).split("-")
			return f"{day}-{m}-{y}"
		except Exception:
			return str(d)

	lines = [doc.name]  # line 0 — primary key for attendance lookup
	if doc.full_name:
		lines.append(f"👤 Name: {doc.full_name}")
	if doc.father_name:
		lines.append(f"👨 Father: {doc.father_name}")
	if doc.blood_group:
		lines.append(f"🩸 Blood: {blood_label.get(doc.blood_group, doc.blood_group)}")
	if doc.class_section:
		lines.append(f"🎓 Class: {doc.class_section}")
	if doc.address:
		lines.append(f"🏠 Address: {doc.address}")
	if doc.emergency_contact:
		lines.append(f"📱 Emergency: {doc.emergency_contact}")
	if doc.date_of_birth:
		lines.append(f"📅 DOB: {fmt_dob(doc.date_of_birth)}")
	return "\n".join(lines)


def _generate_and_attach_qr(doc):
	"""Generate a QR code PNG for *doc* and attach it as qr_code field."""
	try:
		import qrcode
	except ImportError:
		frappe.log_error("qrcode library not installed", "Student Profile QR")
		return

	payload = _build_qr_payload(doc)
	qr = qrcode.QRCode(
		version=None,  # auto-size to fit all data
		error_correction=qrcode.constants.ERROR_CORRECT_M,
		box_size=10,
		border=4,
	)
	qr.add_data(payload)
	qr.make(fit=True)
	img = qr.make_image(fill_color="black", back_color="white")

	buf = io.BytesIO()
	img.save(buf, format="PNG")
	buf.seek(0)

	file_name = f"qr_{doc.name}.png"
	# Remove old QR file if it exists
	old = frappe.db.get_value("File", {"attached_to_doctype": "Student Profile", "attached_to_name": doc.name, "file_name": file_name}, "name")
	if old:
		frappe.delete_doc("File", old, ignore_permissions=True)

	file_doc = save_file(
		fname=file_name,
		content=buf.read(),
		dt="Student Profile",
		dn=doc.name,
		is_private=0,
	)

	frappe.db.set_value("Student Profile", doc.name, {
		"qr_id": doc.name,
		"qr_code": file_doc.file_url,
	})
	doc.qr_id = doc.name
	doc.qr_code = file_doc.file_url
