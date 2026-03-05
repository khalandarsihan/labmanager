import React from "react";

const STATUS_CFG = {
	present:  { bg: "#16A34A", text: "#fff", dot: "#4ADE80" },
	absent:   { bg: "#DC2626", text: "#fff", dot: "#FCA5A5" },
	late:     { bg: "#D97706", text: "#fff", dot: "#FCD34D" },
	on_leave: { bg: "#2563EB", text: "#fff", dot: "#93C5FD" },
	no_class: { bg: "#F3F4F6", text: "#9CA3AF", dot: null },
};

export default function WeekCalendar({ days }) {
	if (!days || days.length === 0) return null;

	const todayStr = new Date().toISOString().split("T")[0];

	return (
		<div>
			<div className="text-xs font-semibold mb-3" style={{ color: "#6B7280", letterSpacing: "0.05em" }}>
				LAST 7 DAYS
			</div>

			<div className="flex gap-1.5">
				{days.map((day) => {
					const isToday = day.date === todayStr;
					const cfg = STATUS_CFG[day.status] || STATUS_CFG.no_class;
					const dateNum = day.date ? day.date.split("-")[2] : "";

					return (
						<div key={day.date} className="flex-1 flex flex-col items-center gap-1">
							{/* Day name */}
							<span className="text-[10px] font-bold" style={{ color: isToday ? "#1B4332" : "#9CA3AF" }}>
								{day.day_name}
							</span>

							{/* Date circle */}
							<div
								className="w-full flex items-center justify-center text-xs font-black rounded-xl"
								style={{
									aspectRatio: "1",
									maxWidth: "38px",
									background: cfg.bg,
									color: cfg.text,
									boxShadow: isToday
										? `0 0 0 2px #fff, 0 0 0 4px #1B4332`
										: "none",
									fontSize: "13px",
								}}
							>
								{dateNum}
							</div>

							{/* Status dot */}
							{cfg.dot && (
								<div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
							)}
						</div>
					);
				})}
			</div>

			{/* Legend */}
			<div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
				{[
					["present",  "Present"],
					["absent",   "Absent"],
					["late",     "Late"],
					["on_leave", "Leave"],
				].map(([key, label]) => (
					<div key={key} className="flex items-center gap-1">
						<div className="w-2.5 h-2.5 rounded-sm" style={{ background: STATUS_CFG[key].bg }} />
						<span className="text-[10px] font-medium" style={{ color: "#6B7280" }}>{label}</span>
					</div>
				))}
			</div>
		</div>
	);
}
