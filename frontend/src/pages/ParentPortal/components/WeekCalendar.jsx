import React, { useState } from "react";

const STATUS_CFG = {
	present:  { bg: "#16A34A", text: "#fff", dot: "#4ADE80",  label: "Present",  badge: { bg: "#DCFCE7", color: "#16A34A" } },
	absent:   { bg: "#DC2626", text: "#fff", dot: "#FCA5A5",  label: "Absent",   badge: { bg: "#FEE2E2", color: "#DC2626" } },
	late:     { bg: "#D97706", text: "#fff", dot: "#FCD34D",  label: "Late",     badge: { bg: "#FEF3C7", color: "#D97706" } },
	on_leave: { bg: "#2563EB", text: "#fff", dot: "#93C5FD",  label: "On Leave", badge: { bg: "#DBEAFE", color: "#2563EB" } },
	no_class: { bg: "#F3F4F6", text: "#9CA3AF", dot: null,    label: "No Class", badge: { bg: "#F3F4F6", color: "#6B7280" } },
};

const STATUS_ICON = { present: "✅", absent: "❌", late: "⏰", on_leave: "🏖", no_class: "—" };

async function fetchDayAttendance(token, studentId, date) {
	const res = await fetch("/api/method/labmanager.portal.api.get_day_attendance", {
		method: "POST",
		headers: { "Content-Type": "application/json", "X-Frappe-CSRF-Token": "fetch" },
		body: JSON.stringify({ token, student_id: studentId, date }),
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	const data = await res.json();
	return data.message;
}

function fmtFull(dateStr) {
	try {
		return new Date(dateStr).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
	} catch { return dateStr; }
}

export default function WeekCalendar({ days, token, studentId }) {
	const [selected, setSelected] = useState(null);   // date string
	const [detail, setDetail]     = useState(null);   // { date, day_name, classes }
	const [loading, setLoading]   = useState(false);

	if (!days || days.length === 0) return null;

	const todayStr = new Date().toISOString().split("T")[0];

	const handleClick = async (date) => {
		if (selected === date) {
			setSelected(null);
			setDetail(null);
			return;
		}
		setSelected(date);
		setDetail(null);
		if (!token || !studentId) return;
		setLoading(true);
		try {
			const d = await fetchDayAttendance(token, studentId, date);
			if (d && !d.error) setDetail(d);
		} catch (e) {
			console.error("Day attendance fetch:", e);
		} finally {
			setLoading(false);
		}
	};

	const selectedDay = days.find((d) => d.date === selected);

	return (
		<div>
			<div className="text-xs font-semibold mb-3" style={{ color: "#6B7280", letterSpacing: "0.05em" }}>
				LAST 7 DAYS
			</div>

			<div className="flex gap-1.5">
				{days.map((day) => {
					const isToday    = day.date === todayStr;
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
							<span className="text-[10px] font-bold" style={{ color: isSelected || isToday ? "#1B4332" : "#9CA3AF" }}>
								{day.day_name}
							</span>

							<div
								className="w-full flex items-center justify-center font-black rounded-xl"
								style={{
									aspectRatio: "1",
									maxWidth: "38px",
									background: cfg.bg,
									color: cfg.text,
									fontSize: "13px",
									boxShadow: isSelected
										? "0 0 0 2px #fff, 0 0 0 4px #1B4332"
										: isToday
										? "0 0 0 2px #fff, 0 0 0 4px #D4AF37"
										: "none",
									transform: isSelected ? "scale(1.1)" : "scale(1)",
									transition: "transform 0.15s ease, box-shadow 0.15s ease",
								}}
							>
								{dateNum}
							</div>

							{cfg.dot
								? <div className="w-1.5 h-1.5 rounded-full" style={{ background: isSelected ? "#1B4332" : cfg.dot }} />
								: <div className="w-1.5 h-1.5" />
							}
						</button>
					);
				})}
			</div>

			{/* ── Detail panel ─────────────────────────────── */}
			{selected && (
				<div className="mt-3 rounded-2xl overflow-hidden" style={{ border: "1px solid #E5E7EB" }}>
					{/* Panel header */}
					<div
						className="flex items-center justify-between px-4 py-3"
						style={{ background: "linear-gradient(135deg, #1B4332, #166534)" }}
					>
						<div>
							<div className="text-white font-bold text-sm">{fmtFull(selected)}</div>
							{selectedDay && (
								<div className="flex items-center gap-1.5 mt-0.5">
									<span className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>Overall:</span>
									<span
										className="text-[10px] font-black px-2 py-0.5 rounded-full"
										style={(STATUS_CFG[selectedDay.status] || STATUS_CFG.no_class).badge}
									>
										{(STATUS_CFG[selectedDay.status] || STATUS_CFG.no_class).label}
									</span>
								</div>
							)}
						</div>
						<button
							onClick={() => { setSelected(null); setDetail(null); }}
							className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
							style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", cursor: "pointer" }}
						>
							✕
						</button>
					</div>

					{/* Class rows */}
					<div className="bg-white">
						{loading ? (
							<div className="flex items-center justify-center py-5 gap-2">
								<div
									className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
									style={{ borderColor: "#1B4332", borderTopColor: "transparent" }}
								/>
								<span className="text-xs font-medium" style={{ color: "#6B7280" }}>Loading classes…</span>
							</div>
						) : detail && detail.classes.length > 0 ? (
							detail.classes.map((cls, i) => {
								const cfg = STATUS_CFG[cls.status?.toLowerCase().replace(" ", "_")] || STATUS_CFG.no_class;
								return (
									<div
										key={i}
										className="flex items-center gap-3 px-4 py-3"
										style={{ borderBottom: i < detail.classes.length - 1 ? "1px solid #F3F4F6" : "none" }}
									>
										<span className="text-base flex-shrink-0">{STATUS_ICON[cls.status?.toLowerCase().replace(" ", "_")] || "—"}</span>
										<div className="flex-1 min-w-0">
											<div className="text-sm font-semibold truncate" style={{ color: "#111827" }}>
												{cls.subject}
											</div>
											{cls.teacher_name && (
												<div className="text-xs" style={{ color: "#9CA3AF" }}>{cls.teacher_name}</div>
											)}
										</div>
										<div className="text-right flex-shrink-0">
											<div
												className="text-[10px] font-black px-2 py-0.5 rounded-full"
												style={cfg.badge}
											>
												{cfg.label}
											</div>
											{cls.start_time && (
												<div className="text-[10px] mt-0.5" style={{ color: "#9CA3AF" }}>
													{cls.start_time}{cls.end_time ? ` – ${cls.end_time}` : ""}
												</div>
											)}
										</div>
									</div>
								);
							})
						) : (
							<div className="flex flex-col items-center py-5">
								<span className="text-2xl mb-1">📭</span>
								<span className="text-xs font-medium" style={{ color: "#9CA3AF" }}>No class records for this day</span>
							</div>
						)}
					</div>
				</div>
			)}

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
