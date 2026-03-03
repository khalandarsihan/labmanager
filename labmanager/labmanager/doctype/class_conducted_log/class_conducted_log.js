// Copyright (c) 2026, Khalandar Sihan and contributors
// For license information, please see license.txt

frappe.ui.form.on("Class Conducted Log", {
	date(frm) {
		if (!frm.doc.date) return;
		// Derive day name from selected date
		const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		frm.set_value("day", days[frappe.datetime.str_to_obj(frm.doc.date).getDay()]);
	},

	timetable_master(frm) {
		// Reset slot-dependent fields when timetable changes
		frm.set_value("time_slot", "");
		frm.set_value("subject", "");
		frm.set_value("teacher", "");
		frm.set_value("classroom", "");
	},

	time_slot(frm) {
		if (!frm.doc.timetable_master || !frm.doc.day || !frm.doc.time_slot) return;

		// Auto-fill subject / teacher / classroom from the matching timetable entry
		frappe.db.get_list("Timetable Entry", {
			parent: frm.doc.timetable_master,
			filters: { day: frm.doc.day, time_slot: frm.doc.time_slot },
			fields: ["subject", "teacher", "classroom"],
			limit: 1,
		}).then((rows) => {
			if (rows.length) {
				const r = rows[0];
				frm.set_value("subject", r.subject);
				frm.set_value("teacher", r.teacher);
				frm.set_value("classroom", r.classroom);
			}
		});
	},

	refresh(frm) {
		if (!frm.is_new() && frm.doc.status === "Draft") {
			frm.add_custom_button(__("Mark as Conducted"), () => {
				frm.set_value("status", "Conducted");
				frm.save();
			});
		}
	},
});
