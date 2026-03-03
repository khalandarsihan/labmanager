// Copyright (c) 2026, Khalandar Sihan and contributors
// For license information, please see license.txt

frappe.ui.form.on("Notification Log", {
	refresh(frm) {
		if (!frm.is_new() && frm.doc.status === "Pending") {
			frm.add_custom_button(__("Send Now"), () => {
				frappe.confirm(
					__("Send this {0} notification to {1}?", [
						frm.doc.notification_type,
						frm.doc.parent_contact,
					]),
					() => {
						frappe.call({
							method:
								"labmanager.labmanager.doctype.notification_log.notification_log.send_notification",
							args: { name: frm.doc.name },
							freeze: true,
							freeze_message: __("Sending…"),
							callback(r) {
								if (r.message) {
									frm.reload_doc();
									frappe.show_alert(
										{
											message: __("Status: {0}", [r.message.status]),
											indicator: r.message.status === "Sent" ? "green" : "red",
										},
										5
									);
								}
							},
						});
					}
				);
			});
		}
	},

	parent_contact(frm) {
		if (!frm.doc.parent_contact) return;
		// Auto-set notification type from parent's preferred method
		frappe.db.get_value(
			"Parent Contact",
			frm.doc.parent_contact,
			["preferred_contact_method", "student"],
			(r) => {
				if (r) {
					frm.set_value("notification_type", r.preferred_contact_method);
					frm.set_value("student", r.student);
				}
			}
		);
	},
});
