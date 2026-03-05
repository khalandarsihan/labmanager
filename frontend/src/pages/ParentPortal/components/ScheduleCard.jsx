import React from "react";

const STATUS_STYLES = {
	completed: { bg: "#F0FDF4", color: "#16A34A", label: "Done",    border: "transparent" },
	ongoing:   { bg: "#DCFCE7", color: "#15803D", label: "Ongoing", border: "#16A34A" },
	upcoming:  { bg: "#F9FAFB", color: "#6B7280", label: "Soon",    border: "transparent" },
};

export default function ScheduleCard({ schedule }) {
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
				Today&rsquo;s Classes
			</h3>

			{!schedule || schedule.length === 0 ? (
				<div style={{ textAlign: "center", padding: "20px 0" }}>
					<div style={{ fontSize: "28px", marginBottom: "8px" }}>🕌</div>
					<p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
						No classes today
					</p>
				</div>
			) : (
				<div>
					{schedule.map((period, idx) => {
						const s = STATUS_STYLES[period.status] || STATUS_STYLES.upcoming;
						const isOngoing = period.status === "ongoing";

						return (
							<div
								key={idx}
								style={{
									display: "flex",
									alignItems: "center",
									gap: "12px",
									padding: "12px",
									borderRadius: "12px",
									background: s.bg,
									marginBottom: idx < schedule.length - 1 ? "8px" : 0,
									borderLeft: isOngoing ? `4px solid ${s.border}` : "none",
								}}
							>
								{/* Period + time */}
								<div style={{ minWidth: "64px" }}>
									<div style={{ fontSize: "10px", color: "#9CA3AF", fontWeight: 600 }}>
										P{period.period}
									</div>
									<div style={{ fontSize: "12px", color: "#6B7280", fontWeight: 500 }}>
										{period.start_time}
										{period.end_time && ` – ${period.end_time}`}
									</div>
								</div>

								{/* Subject + teacher */}
								<div style={{ flex: 1, minWidth: 0 }}>
									<div
										style={{
											fontSize: "14px",
											fontWeight: isOngoing ? 700 : 600,
											color: isOngoing ? "#111827" : "#374151",
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis",
										}}
									>
										{period.subject}
									</div>
									{period.teacher_name && (
										<div style={{ fontSize: "12px", color: "#9CA3AF" }}>
											{period.teacher_name}
											{period.room && ` · ${period.room}`}
										</div>
									)}
								</div>

								{/* Status pill */}
								<div
									style={{
										background: isOngoing ? "#16A34A" : "#E5E7EB",
										color: isOngoing ? "#fff" : "#6B7280",
										fontSize: "11px",
										fontWeight: 600,
										padding: "4px 10px",
										borderRadius: "20px",
										whiteSpace: "nowrap",
										flexShrink: 0,
									}}
								>
									{s.label}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
