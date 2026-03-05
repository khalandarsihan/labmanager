import React from "react";

function fmtDate(dateStr) {
	if (!dateStr) return "";
	try {
		const d = new Date(dateStr);
		return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
	} catch {
		return dateStr;
	}
}

function daysLeft(dateStr) {
	if (!dateStr) return null;
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const due = new Date(dateStr);
	due.setHours(0, 0, 0, 0);
	return Math.ceil((due - today) / 86400000);
}

const SUBJECT_COLORS = ["#1B4332", "#166534", "#14532D", "#064E3B", "#134E4A"];

export default function AssignmentCard({ assignments }) {
	const { pending = [], submitted_count = 0, overdue_count = 0 } = assignments || {};

	return (
		<div
			style={{
				background: "#fff",
				borderRadius: "20px",
				padding: "20px",
				boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
			}}
		>
			{/* Header */}
			<div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
				<h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: 0, flex: 1 }}>
					Assignments
				</h3>
				{pending.length > 0 && (
					<div
						style={{
							background: overdue_count > 0 ? "#FEE2E2" : "#DBEAFE",
							color: overdue_count > 0 ? "#DC2626" : "#1D4ED8",
							fontSize: "12px",
							fontWeight: 700,
							padding: "3px 10px",
							borderRadius: "20px",
						}}
					>
						{pending.length} pending
					</div>
				)}
			</div>

			{/* Empty state */}
			{pending.length === 0 ? (
				<div style={{ textAlign: "center", padding: "20px 0" }}>
					<div style={{ fontSize: "28px", marginBottom: "8px" }}>✅</div>
					<p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
						No pending assignments
					</p>
				</div>
			) : (
				<div>
					{pending.map((a, idx) => {
						const days = daysLeft(a.due_date);
						const isOverdue = days !== null && days < 0;
						const isUrgent = days !== null && days <= 2 && days >= 0;

						return (
							<div
								key={idx}
								style={{
									borderBottom: idx < pending.length - 1 ? "1px solid #F3F4F6" : "none",
									paddingBottom: "14px",
									marginBottom: "14px",
								}}
							>
								<div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
									{/* Subject chip */}
									<div
										style={{
											background: SUBJECT_COLORS[idx % SUBJECT_COLORS.length],
											color: "#fff",
											fontSize: "10px",
											fontWeight: 700,
											padding: "3px 8px",
											borderRadius: "6px",
											whiteSpace: "nowrap",
											flexShrink: 0,
											marginTop: "2px",
										}}
									>
										{a.subject || "General"}
									</div>

									<div style={{ flex: 1 }}>
										<div style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>
											{a.title}
										</div>
										<div style={{ fontSize: "12px", color: isOverdue ? "#DC2626" : isUrgent ? "#D97706" : "#6B7280", marginTop: "3px" }}>
											{isOverdue
												? `⚠️ OVERDUE by ${Math.abs(days)} day${Math.abs(days) !== 1 ? "s" : ""}`
												: days === 0
												? "⚡ Due today"
												: days !== null
												? `Due: ${fmtDate(a.due_date)} (${days} days left)`
												: `Due: ${fmtDate(a.due_date)}`}
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Footer stats */}
			{(submitted_count > 0 || overdue_count > 0) && (
				<div
					style={{
						marginTop: "12px",
						paddingTop: "12px",
						borderTop: "1px solid #F3F4F6",
						fontSize: "12px",
						color: "#9CA3AF",
						display: "flex",
						gap: "16px",
					}}
				>
					{submitted_count > 0 && <span>✓ {submitted_count} submitted</span>}
					{overdue_count > 0 && <span style={{ color: "#DC2626" }}>⚠ {overdue_count} overdue</span>}
				</div>
			)}
		</div>
	);
}
