// Copyright (c) 2026, Khalandar Sihan and contributors
// For license information, please see license.txt

frappe.ui.form.on("Broadcast Alert TE", {
	refresh(frm) {
		frm.set_intro(
			"Create an alert and click <b>Send Alert</b> to dispatch a WhatsApp message to all targeted parents.",
			"blue"
		);

		// Show Send button only for Draft / Failed and saved docs
		if (!frm.is_new() && ["Draft", "Failed"].includes(frm.doc.status)) {
			frm.add_custom_button(__("Send Alert"), () => {
				frappe.confirm(
					`<b>Send "${frm.doc.title}" to ${frm.doc.target_type}?</b><br><br>
					This will dispatch a WhatsApp message to all matching parents. Continue?`,
					() => {
						frappe.show_progress(__("Sending…"), 50, 100, __("Dispatching WhatsApp messages…"));
						frm.call("send_alert")
							.then(() => {
								frappe.hide_progress();
								frm.reload_doc();
							})
							.catch(() => {
								frappe.hide_progress();
							});
					}
				);
			}).addClass("btn-primary");
		}

		// Colour the status indicator
		const colours = { Draft: "gray", Sending: "orange", Sent: "green", Failed: "red" };
		frm.set_indicator_formatter("status", (doc) => colours[doc.status] || "gray");
	},
});
