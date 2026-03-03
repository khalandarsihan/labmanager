// Copyright (c) 2026, Khalandar Sihan and contributors
// For license information, please see license.txt

frappe.ui.form.on("Timetable Master", {
	class_schedule(frm) {
		if (!frm.doc.class_schedule) return;

		// Auto-fill Academic Year and Term from the chosen Class Schedule
		frappe.db.get_value(
			"Class Schedule",
			frm.doc.class_schedule,
			["academic_year", "term"],
			(r) => {
				if (r) {
					frm.set_value("academic_year", r.academic_year);
					frm.set_value("term", r.term);
				}
			}
		);
	},

	refresh(frm) {
		if (!frm.is_new() && frm.doc.status === "Draft") {
			frm.add_custom_button(__("Activate"), () => {
				frm.set_value("status", "Active");
				frm.save();
			});
		}
	},
});
