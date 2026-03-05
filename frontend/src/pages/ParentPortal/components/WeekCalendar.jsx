import React from "react";

const STATUS_COLORS = {
	present: "#16A34A",
	absent:  "#DC2626",
	late:    "#D97706",
	on_leave: "#2563EB",
	no_class: "#E5E7EB",
};

const STATUS_TEXT = {
	present:  "#fff",
	absent:   "#fff",
	late:     "#fff",
	on_leave: "#fff",
	no_class: "#9CA3AF",
};

export default function WeekCalendar({ days }) {
	if (!days || days.length === 0) return null;

	const todayStr = new Date().toISOString().split("T")[0];

	return (
		<div>
			<div style={{ fontSize: "13px", fontWeight: 600, color: "#6B7280", marginBottom: "10px" }}>
				Last 7 Days
			</div>
			<div style={{ display: "flex", gap: "6px", overflowX: "hidden" }}>
				{days.map((day) => {
					const isToday = day.date === todayStr;
					const bg = STATUS_COLORS[day.status] || STATUS_COLORS.no_class;
					const textCol = STATUS_TEXT[day.status] || STATUS_TEXT.no_class;
					const dateNum = day.date ? day.date.split("-")[2] : "";

					return (
						<div
							key={day.date}
							style={{
								flex: 1,
								minWidth: 0,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: "4px",
							}}
						>
							{/* Day letter */}
							<div
								style={{
									fontSize: "11px",
									fontWeight: 600,
									color: isToday ? "#1B4332" : "#9CA3AF",
								}}
							>
								{day.day_name}
							</div>

							{/* Date box */}
							<div
								style={{
									width: "100%",
									aspectRatio: "1",
									maxWidth: "40px",
									borderRadius: "8px",
									background: bg,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: "13px",
									fontWeight: 700,
									color: textCol,
									boxShadow: isToday
										? `0 0 0 2px #1B4332, 0 0 0 4px ${bg}`
										: "none",
								}}
							>
								{dateNum}
							</div>
						</div>
					);
				})}
			</div>

			{/* Legend */}
			<div style={{ display: "flex", gap: "12px", marginTop: "12px", flexWrap: "wrap" }}>
				{[
					["present", "Present"],
					["absent", "Absent"],
					["late", "Late"],
					["on_leave", "Leave"],
				].map(([key, label]) => (
					<div key={key} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
						<div style={{ width: "10px", height: "10px", borderRadius: "3px", background: STATUS_COLORS[key] }} />
						<span style={{ fontSize: "11px", color: "#6B7280" }}>{label}</span>
					</div>
				))}
			</div>
		</div>
	);
}
