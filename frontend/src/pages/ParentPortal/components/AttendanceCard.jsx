import React, { useState } from "react";
import WeekCalendar from "./WeekCalendar";
import SubjectAttendance from "./SubjectAttendance";

function CircularProgress({ pct }) {
	const R   = 45;
	const C   = 2 * Math.PI * R;
	const color = pct >= 75 ? "#16A34A" : pct >= 60 ? "#D97706" : "#DC2626";
	const dash  = (pct / 100) * C;

	return (
		<svg width="130" height="130" viewBox="0 0 100 100">
			<circle cx="50" cy="50" r={R} fill="none" stroke="#F3F4F6" strokeWidth="9" />
			<circle
				cx="50" cy="50" r={R}
				fill="none"
				stroke={color}
				strokeWidth="9"
				strokeDasharray={`${dash} ${C}`}
				strokeLinecap="round"
				transform="rotate(-90 50 50)"
				style={{ transition: "stroke-dasharray 0.8s ease" }}
			/>
			<text x="50" y="44" textAnchor="middle" fontSize="20" fontWeight="800" fill={color}>
				{pct}%
			</text>
			<text x="50" y="58" textAnchor="middle" fontSize="9" fill="#9CA3AF">
				This Month
			</text>
		</svg>
	);
}

function StatChip({ icon, label, value, color }) {
	return (
		<div
			style={{
				flex: 1,
				background: "#F9FAFB",
				borderRadius: "12px",
				padding: "10px 4px",
				textAlign: "center",
			}}
		>
			<div style={{ fontSize: "18px", marginBottom: "2px" }}>{icon}</div>
			<div style={{ fontSize: "16px", fontWeight: 800, color }}>{value}</div>
			<div style={{ fontSize: "10px", color: "#9CA3AF", fontWeight: 500 }}>{label}</div>
		</div>
	);
}

export default function AttendanceCard({ attendance }) {
	const [showSubjects, setShowSubjects] = useState(false);

	if (!attendance) return null;

	const {
		this_month_percent = 0,
		present = 0, absent = 0, late = 0, on_leave = 0,
		subject_wise = [], recent_7_days = [],
	} = attendance;

	return (
		<div
			style={{
				background: "#fff",
				borderRadius: "20px",
				padding: "20px",
				boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
			}}
		>
			<h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>
				Attendance
			</h3>

			{/* Circular progress */}
			<div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
				<CircularProgress pct={this_month_percent} />
			</div>

			{/* Stat chips */}
			<div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
				<StatChip icon="✅" label="Present" value={present} color="#16A34A" />
				<StatChip icon="❌" label="Absent"  value={absent}  color="#DC2626" />
				<StatChip icon="⏰" label="Late"    value={late}    color="#D97706" />
				<StatChip icon="🏖" label="Leave"   value={on_leave} color="#2563EB" />
			</div>

			{/* 7-day calendar */}
			<WeekCalendar days={recent_7_days} />

			{/* Subject-wise toggle */}
			{subject_wise.length > 0 && (
				<>
					<button
						onClick={() => setShowSubjects(!showSubjects)}
						style={{
							width: "100%",
							marginTop: "20px",
							padding: "12px",
							background: "none",
							border: "1px solid #E5E7EB",
							borderRadius: "12px",
							fontSize: "14px",
							fontWeight: 600,
							color: "#1B4332",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "6px",
							minHeight: "44px",
						}}
					>
						View by Subject {showSubjects ? "▲" : "▼"}
					</button>

					{showSubjects && (
						<div style={{ marginTop: "16px" }}>
							<SubjectAttendance subjects={subject_wise} />
						</div>
					)}
				</>
			)}
		</div>
	);
}
