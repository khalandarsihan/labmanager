// Copyright (c) 2026, Khalandar Sihan and contributors
// For license information, please see license.txt

frappe.ui.form.on("Parent Contact", {
	refresh(frm) {
		// Show the portal URL as a read-only link if token exists
		if (frm.doc.portal_token) {
			const url = `${window.location.origin}/parent-portal?token=${frm.doc.portal_token}`;
			frm.set_intro(
				`<b>Portal Link:</b> <a href="${url}" target="_blank">${url}</a>`,
				"blue"
			);
		}

		// Reset Portal Token button
		frm.add_custom_button(
			__("Reset Portal Token"),
			function () {
				frappe.confirm(
					__(
						"This will invalidate the old portal link and generate a new one. " +
						"A new WhatsApp link will be sent to the parent. Continue?"
					),
					function () {
						frappe.call({
							method: "labmanager.labmanager.portal.api.generate_and_save_token",
							args: { parent_contact_name: frm.doc.name },
							freeze: true,
							freeze_message: __("Generating new token…"),
							callback: function (r) {
								frm.reload_doc();
								frappe.call({
									method: "labmanager.labmanager.portal.api.send_portal_link_whatsapp",
									args: { parent_contact_name: frm.doc.name },
									callback: function (res) {
										if (res.message && res.message.success) {
											frappe.msgprint({
												title: __("Done"),
												message: __("New portal link sent via WhatsApp!"),
												indicator: "green",
											});
										} else {
											frappe.msgprint({
												title: __("Token Reset"),
												message: __(
													"Token regenerated, but WhatsApp could not be sent. " +
													"Please share the portal link manually."
												),
												indicator: "orange",
											});
										}
									},
								});
							},
						});
					}
				);
			},
			__("Portal")
		);

		// Copy Link button
		if (frm.doc.portal_token) {
			frm.add_custom_button(
				__("Copy Portal Link"),
				function () {
					const url = `${window.location.origin}/parent-portal?token=${frm.doc.portal_token}`;
					navigator.clipboard.writeText(url).then(() => {
						frappe.show_alert({ message: __("Portal link copied!"), indicator: "green" });
					});
				},
				__("Portal")
			);
		}
	},
});
