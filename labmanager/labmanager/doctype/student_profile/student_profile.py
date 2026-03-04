# Copyright (c) 2025, Khalandar Sihan and contributors
# For license information, please see license.txt

import io

import frappe
from frappe.model.document import Document
from frappe.utils.file_manager import save_file


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


def _generate_and_attach_qr(doc):
	"""Generate a QR code PNG for *doc* and attach it as qr_code field."""
	try:
		import qrcode
	except ImportError:
		frappe.log_error("qrcode library not installed", "Student Profile QR")
		return

	# QR content: student name (primary key) used for attendance scanning
	qr = qrcode.QRCode(
		version=1,
		error_correction=qrcode.constants.ERROR_CORRECT_M,
		box_size=10,
		border=4,
	)
	qr.add_data(doc.name)
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
