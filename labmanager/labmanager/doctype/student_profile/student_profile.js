// Copyright (c) 2025, Khalandar Sihan and contributors
// For license information, please see license.txt

frappe.ui.form.on("Student Profile", {
	refresh(frm) {
		frm.add_custom_button(__("Generate / Refresh QR"), function () {
			frappe.call({
				method: "regenerate_qr",
				doc: frm.doc,
				callback(r) {
					if (!r.exc) {
						frm.reload_doc();
						frappe.show_alert({ message: __("QR code generated"), indicator: "green" });
					}
				},
			});
		}, __("Actions"));
	},
});
