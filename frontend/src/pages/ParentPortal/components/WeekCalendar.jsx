import React, { useState } from "react";

const STATUS_CFG = {
	present:  { bg: "#16A34A", text: "#fff", dot: "#4ADE80",  label: "Present",  detail: { bg: "#DCFCE7", color: "#16A34A", icon: "✅" } },
	absent:   { bg: "#DC2626", text: "#fff", dot: "#FCA5A5",  label: "Absent",   detail: { bg: "#FEE2E2", color: "#DC2626", icon: "❌" } },
	late:     { bg: "#D97706", text: "#fff", dot: "#FCD34D",  label: "Late",     detail: { bg: "#FEF3C7", color: "#D97706", icon: "⏰" } },
	on_leave: { bg: "#2563EB", text: "#fff", dot: "#93C5FD",  label: "On Leave", detail: { bg: "#DBEAFE", color: "#2563EB", icon: "🏖" } },
	no_class: { bg: "#F3F4F6", text: "#9CA3AF", dot: null,    label: "No Class", detail: { bg: "#F9FAFB", color: "#6B7280", icon: "—"  } },
};

function fmtFull(dateStr) {
	try {
		return new Date(dateStr).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
	} catch { return dateStr; }
}

export default function WeekCalendar({ days }) {
	const [selected, setSelected] = useState(null);

	if (!days || days.length === 0) return null;

	const todayStr = new Date().toISOString().split("T")[0];
	const selectedDay = days.find((d) => d.date === selected);

	const handleClick = (date) => {
		setSelected((prev) => (prev === date ? null : date));
	};

	return (
		<div>
			<div className="text-xs font-semibold mb-3" style={{ color: "#6B7280", letterSpacing: "0.05em" }}>
				LAST 7 DAYS
			</div>

			<div className="flex gap-1.5">
				{days.map((day) => {
					const isToday   = day.date === todayStr;
					const isSelected = day.date === selected;
					const cfg = STATUS_CFG[day.status] || STATUS_CFG.no_class;
					const dateNum = day.date ? day.date.split("-")[2] : "";

					return (
						<button
							key={day.date}
							onClick={() => handleClick(day.date)}
							className="flex-1 flex flex-col items-center gap-1 border-none bg-transparent p-0 cursor-pointer"
							style={{ WebkitTapHighlightColor: "transparent" }}
						>
							{/* Day name */}
							<span
								className="text-[10px] font-bold"
								style={{ color: isSelected ? "#1B4332" : isToday ? "#1B4332" : "#9CA3AF" }}
							>
								{day.day_name}
							</span>

							{/* Date circle */}
							<div
								className="w-full flex items-center justify-center font-black rounded-xl transition-transform active:scale-90"
								style={{
									aspectRatio: "1",
									maxWidth: "38px",
									background: cfg.bg,
									color: cfg.text,
									fontSize: "13px",
									boxShadow: isSelected
										? `0 0 0 2px #fff, 0 0 0 4px #1B4332`
										: isToday
										? `0 0 0 2px #fff, 0 0 0 4px #D4AF37`
										: "none",
									transform: isSelected ? "scale(1.1)" : "scale(1)",
									transition: "transform 0.15s ease, box-shadow 0.15s ease",
								}}
							>
								{dateNum}
							</div>

							{/* Status dot */}
							{cfg.dot && (
								<div className="w-1.5 h-1.5 rounded-full" style={{ background: isSelected ? "#1B4332" : cfg.dot }} />
							)}
							{!cfg.dot && <div className="w-1.5 h-1.5" />}
						</button>
					);
				})}
			</div>

			{/* Detail panel — slides in when a date is selected */}
			{selectedDay && (() => {
				const cfg = STATUS_CFG[selectedDay.status] || STATUS_CFG.no_class;
				const d = cfg.detail;
				return (
					<div
						className="mt-3 rounded-2xl p-4 flex items-center gap-3"
						style={{ background: d.bg, border: `1px solid ${d.color}22` }}
					>
						<span className="text-2xl">{d.icon}</span>
						<div className="flex-1">
							<div className="text-sm font-bold" style={{ color: "#111827" }}>
								{fmtFull(selectedDay.date)}
							</div>
							<div className="text-xs font-semibold mt-0.5" style={{ color: d.color }}>
								{cfg.label}
							</div>
						</div>
						<button
							onClick={() => setSelected(null)}
							className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
							style={{ background: `${d.color}22`, color: d.color, border: "none", cursor: "pointer" }}
						>
							✕
						</button>
					</div>
				);
			})()}

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
