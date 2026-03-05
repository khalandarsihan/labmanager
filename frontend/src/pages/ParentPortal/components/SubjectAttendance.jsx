import React, { useState } from "react";

const statusStyle = {
	good:    { bg: "#DCFCE7", color: "#16A34A", label: "Good" },
	warning: { bg: "#FEF3C7", color: "#D97706", label: "Warning" },
	danger:  { bg: "#FEE2E2", color: "#DC2626", label: "At Risk" },
};

export default function SubjectAttendance({ subjects }) {
	const [expanded, setExpanded] = useState(null);

	if (!subjects || subjects.length === 0) {
		return (
			<p style={{ fontSize: "13px", color: "#9CA3AF", textAlign: "center", margin: "12px 0" }}>
				No subject data this month
			</p>
		);
	}

	return (
		<div>
			{subjects.map((row) => {
				const s = statusStyle[row.status] || statusStyle.good;
				const isOpen = expanded === row.subject;

				return (
					<div
						key={row.subject}
						onClick={() => setExpanded(isOpen ? null : row.subject)}
						style={{
							borderBottom: "1px solid #F3F4F6",
							paddingBottom: "10px",
							marginBottom: "10px",
							cursor: "pointer",
						}}
					>
						<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
							{/* Subject name */}
							<div style={{ flex: 1, fontSize: "14px", fontWeight: 500, color: "#111827" }}>
								{row.subject}
							</div>
							{/* Percentage */}
							<div style={{ fontSize: "15px", fontWeight: 700, color: s.color }}>
								{row.percent}%
							</div>
							{/* Status badge */}
							<div
								style={{
									background: s.bg,
									color: s.color,
									fontSize: "11px",
									fontWeight: 600,
									padding: "3px 8px",
									borderRadius: "20px",
									minWidth: "56px",
									textAlign: "center",
								}}
							>
								{s.label}
							</div>
							{/* Chevron */}
							<div style={{ color: "#9CA3AF", fontSize: "12px" }}>
								{isOpen ? "▲" : "▼"}
							</div>
						</div>

						{/* Expanded detail */}
						{isOpen && (
							<div
								style={{
									marginTop: "10px",
									display: "flex",
									gap: "16px",
									padding: "10px",
									background: "#F9FAFB",
									borderRadius: "10px",
									fontSize: "13px",
								}}
							>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontWeight: 700, color: "#111827" }}>{row.conducted}</div>
									<div style={{ color: "#9CA3AF" }}>Conducted</div>
								</div>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontWeight: 700, color: "#16A34A" }}>{row.present}</div>
									<div style={{ color: "#9CA3AF" }}>Present</div>
								</div>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontWeight: 700, color: "#DC2626" }}>{row.absent}</div>
									<div style={{ color: "#9CA3AF" }}>Absent</div>
								</div>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
