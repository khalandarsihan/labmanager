// Copyright (c) 2025, Khalandar Sihan and contributors
// For license information, please see license.txt

frappe.ui.form.on("Student Profile", {
	refresh(frm) {
		frm.add_custom_button(__("Print ID Card"), function () {
			window.open(`/student-id-card?student=${frm.doc.name}`, "_blank");
		}, __("Actions"));

		frm.add_custom_button(__("Generate / Refresh QR"), function () {
			frappe.call({
				method: "regenerate_qr",
				doc: frm.doc,
				callback(r) {
					if (!r.exc) {
						frm.reload_doc();
						frappe.show_alert({ message: __("QR code regenerated"), indicator: "green" });
					}
				},
			});
		}, __("Actions"));

		if (frappe.user.has_role("System Manager")) {
			frm.add_custom_button(__("Regenerate All QR Codes"), function () {
				frappe.confirm(
					"Regenerate QR codes for ALL students? This may take a moment.",
					function () {
						frappe.call({
							method: "labmanager.labmanager.doctype.student_profile.student_profile.regenerate_all_qr",
							callback(r) {
								if (!r.exc) frappe.show_alert({ message: r.message, indicator: "green" });
							},
						});
					}
				);
			}, __("Actions"));
		}
	},
});
