import React, { useState } from "react";

const statusCfg = {
	good:    { bar: "#16A34A", badge: { bg: "#DCFCE7", color: "#16A34A" }, label: "Good" },
	warning: { bar: "#D97706", badge: { bg: "#FEF3C7", color: "#D97706" }, label: "Low" },
	danger:  { bar: "#DC2626", badge: { bg: "#FEE2E2", color: "#DC2626" }, label: "At Risk" },
};

export default function SubjectAttendance({ subjects }) {
	const [expanded, setExpanded] = useState(null);

	if (!subjects || subjects.length === 0) {
		return (
			<p className="text-xs text-center py-3" style={{ color: "#9CA3AF" }}>
				No subject data this month
			</p>
		);
	}

	return (
		<div className="space-y-2">
			{subjects.map((row) => {
				const cfg = statusCfg[row.status] || statusCfg.good;
				const isOpen = expanded === row.subject;

				return (
					<div
						key={row.subject}
						className="rounded-2xl overflow-hidden cursor-pointer"
						style={{ border: "1px solid #F3F4F6", background: isOpen ? "#FAFAFA" : "#fff" }}
						onClick={() => setExpanded(isOpen ? null : row.subject)}
					>
						<div className="flex items-center gap-3 px-4 py-3">
							{/* Subject name */}
							<div className="flex-1 min-w-0">
								<div className="text-sm font-semibold truncate" style={{ color: "#111827" }}>
									{row.subject}
								</div>
								{/* Progress bar */}
								<div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: "#F3F4F6" }}>
									<div
										className="h-full rounded-full transition-all duration-700"
										style={{ width: `${row.percent}%`, background: cfg.bar }}
									/>
								</div>
							</div>

							{/* Percentage */}
							<span className="text-base font-black flex-shrink-0" style={{ color: cfg.bar, minWidth: "42px", textAlign: "right" }}>
								{row.percent}%
							</span>

							{/* Badge */}
							<span
								className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
								style={cfg.badge}
							>
								{cfg.label}
							</span>

							{/* Chevron */}
							<span className="text-[10px] flex-shrink-0" style={{ color: "#9CA3AF" }}>
								{isOpen ? "▲" : "▼"}
							</span>
						</div>

						{/* Expanded detail */}
						{isOpen && (
							<div className="px-4 pb-4">
								<div className="rounded-xl p-3 flex gap-4" style={{ background: "#F0FDF4" }}>
									{[
										{ label: "Conducted", value: row.conducted, color: "#111827" },
										{ label: "Present",   value: row.present,   color: "#16A34A" },
										{ label: "Absent",    value: row.absent,    color: "#DC2626" },
									].map(({ label, value, color }) => (
										<div key={label} className="flex-1 text-center">
											<div className="text-lg font-black" style={{ color }}>{value}</div>
											<div className="text-[10px] font-medium" style={{ color: "#9CA3AF" }}>{label}</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
