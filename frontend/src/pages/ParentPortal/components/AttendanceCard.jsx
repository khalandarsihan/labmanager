import React, { useState } from "react";
import WeekCalendar from "./WeekCalendar";
import SubjectAttendance from "./SubjectAttendance";

function CircularRing({ pct }) {
	const R   = 48;
	const C   = 2 * Math.PI * R;
	const color = pct >= 75 ? "#16A34A" : pct >= 60 ? "#D97706" : "#DC2626";
	const bg    = pct >= 75 ? "#DCFCE7" : pct >= 60 ? "#FEF3C7" : "#FEE2E2";
	const dash  = (pct / 100) * C;
	const msg   = pct >= 75 ? "Great!" : pct >= 60 ? "Improve" : "At Risk";

	return (
		<div className="flex flex-col items-center">
			<div
				className="relative flex items-center justify-center rounded-full"
				style={{ width: "148px", height: "148px", background: bg }}
			>
				<svg width="148" height="148" viewBox="0 0 120 120" className="absolute inset-0">
					<circle cx="60" cy="60" r={R} fill="none" stroke="#fff" strokeWidth="10" />
					<circle
						cx="60" cy="60" r={R}
						fill="none"
						stroke={color}
						strokeWidth="10"
						strokeDasharray={`${dash} ${C}`}
						strokeLinecap="round"
						transform="rotate(-90 60 60)"
						style={{ transition: "stroke-dasharray 0.8s ease" }}
					/>
				</svg>
				{/* Center text */}
				<div className="relative text-center z-10">
					<div className="text-3xl font-black leading-none" style={{ color }}>{pct}%</div>
					<div className="text-xs font-semibold mt-1" style={{ color }}>This Month</div>
					<div
						className="text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full"
						style={{ background: color, color: "#fff" }}
					>
						{msg}
					</div>
				</div>
			</div>
		</div>
	);
}

function StatChip({ icon, label, value, color, bg }) {
	return (
		<div className="flex-1 flex flex-col items-center gap-0.5 rounded-2xl py-3" style={{ background: bg }}>
			<span className="text-base">{icon}</span>
			<span className="text-xl font-black leading-none" style={{ color }}>{value}</span>
			<span className="text-[10px] font-semibold" style={{ color: "#6B7280" }}>{label}</span>
		</div>
	);
}

export default function AttendanceCard({ attendance, token, studentId }) {
	const [showSubjects, setShowSubjects] = useState(false);
	const [dayDetail, setDayDetail]       = useState(null); // { date, day_name, classes } | null

	if (!attendance) return null;

	const {
		this_month_percent = 0,
		present = 0, absent = 0, late = 0, on_leave = 0,
		subject_wise = [], recent_7_days = [],
	} = attendance;

	// When a day is selected compute its counts from the class-level detail
	const dayCounts = dayDetail
		? dayDetail.classes.reduce(
			(acc, cls) => {
				const s = (cls.status || "").toLowerCase();
				if (s === "present")       acc.present++;
				else if (s === "absent")   acc.absent++;
				else if (s === "late")     acc.late++;
				else if (s === "on leave") acc.on_leave++;
				return acc;
			},
			{ present: 0, absent: 0, late: 0, on_leave: 0 }
		  )
		: null;

	const chipPeriod = dayDetail
		? new Date(dayDetail.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })
		: "This Month";

	const chipValues = dayCounts ?? { present, absent, late, on_leave };

	return (
		<div className="rounded-3xl overflow-hidden" style={{ background: "#fff", boxShadow: "0 8px 32px rgba(27,67,50,0.1)" }}>
			{/* Gold top bar */}
			<div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #D4AF37, #F0D060, #D4AF37)" }} />

			<div className="p-5">
				{/* Title */}
				<div className="flex items-center gap-2 mb-5">
					<div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #1B4332, #166534)" }} />
					<h3 className="text-base font-bold" style={{ color: "#111827" }}>Attendance</h3>
				</div>

				{/* Ring */}
				<div className="flex justify-center mb-5">
					<CircularRing pct={this_month_percent} />
				</div>

				{/* Stat chips */}
				<div className="mb-1">
					<div className="text-[10px] font-bold mb-2 text-center" style={{ color: "#9CA3AF", letterSpacing: "0.05em" }}>
						{chipPeriod.toUpperCase()}
					</div>
					<div className="flex gap-2">
						<StatChip icon="✅" label="Present" value={chipValues.present}  color="#16A34A" bg="#DCFCE7" />
						<StatChip icon="❌" label="Absent"  value={chipValues.absent}   color="#DC2626" bg="#FEE2E2" />
						<StatChip icon="⏰" label="Late"    value={chipValues.late}     color="#D97706" bg="#FEF3C7" />
						<StatChip icon="🏖" label="Leave"   value={chipValues.on_leave} color="#2563EB" bg="#DBEAFE" />
					</div>
				</div>

				{/* Divider */}
				<div className="h-px my-5" style={{ background: "#F3F4F6" }} />

				{/* Week calendar — owns selected state, reports day detail back */}
				<WeekCalendar
					days={recent_7_days}
					token={token}
					studentId={studentId}
					onDayDetail={setDayDetail}
				/>

				{/* Subject-wise toggle */}
				{subject_wise.length > 0 && (
					<>
						<button
							onClick={() => setShowSubjects(!showSubjects)}
							className="w-full mt-5 flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all"
							style={{
								background: showSubjects ? "linear-gradient(135deg, #1B4332, #166534)" : "#F9FAFB",
								color: showSubjects ? "#D4AF37" : "#1B4332",
								border: showSubjects ? "none" : "1px solid #E5E7EB",
								minHeight: "44px",
							}}
						>
							<span>Subject-wise Breakdown</span>
							<span style={{ fontSize: "10px" }}>{showSubjects ? "▲" : "▼"}</span>
						</button>

						{showSubjects && (
							<div className="mt-3">
								<SubjectAttendance subjects={subject_wise} />
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
