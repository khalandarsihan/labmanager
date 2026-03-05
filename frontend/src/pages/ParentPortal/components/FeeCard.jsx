import React from "react";

function fmtAmount(amount) {
	if (!amount && amount !== 0) return "₹0";
	return `₹${Number(amount).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function fmtDate(dateStr) {
	if (!dateStr) return "";
	try {
		const d = new Date(dateStr);
		return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
	} catch {
		return dateStr;
	}
}

function daysSinceOrUntil(dateStr) {
	if (!dateStr) return null;
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const d = new Date(dateStr);
	d.setHours(0, 0, 0, 0);
	return Math.ceil((today - d) / 86400000);
}

const STATUS_CONFIG = {
	paid: {
		bg: "#DCFCE7", color: "#16A34A",
		icon: "✅", text: "All fees paid",
	},
	upcoming: {
		bg: "#DBEAFE", color: "#1D4ED8",
		icon: "📅", text: "Payment upcoming",
	},
	partial: {
		bg: "#FEF3C7", color: "#D97706",
		icon: "⚠️", text: "Partial payment",
	},
	overdue: {
		bg: "#FEE2E2", color: "#DC2626",
		icon: "🔴", text: "Payment overdue",
	},
};

export default function FeeCard({ fees }) {
	if (!fees) return null;

	const {
		status = "paid",
		pending_amount = 0,
		next_due_date = "",
		next_due_amount = 0,
		overdue_amount = 0,
		paid_amount = 0,
	} = fees;

	const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.paid;

	const overdueDays = status === "overdue" && next_due_date
		? daysSinceOrUntil(next_due_date)
		: null;

	return (
		<div
			style={{
				background: "#fff",
				borderRadius: "20px",
				overflow: "hidden",
				boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
			}}
		>
			{/* Status banner */}
			<div
				style={{
					background: cfg.bg,
					padding: "16px 20px",
					display: "flex",
					alignItems: "center",
					gap: "10px",
				}}
			>
				<span style={{ fontSize: "22px" }}>{cfg.icon}</span>
				<div>
					<div style={{ fontSize: "15px", fontWeight: 700, color: cfg.color }}>
						{status === "paid" && "All Fees Paid ✓"}
						{status === "upcoming" && `${fmtAmount(next_due_amount)} due on ${fmtDate(next_due_date)}`}
						{status === "partial" && `${fmtAmount(pending_amount)} remaining`}
						{status === "overdue" && (
							<>
								{fmtAmount(overdue_amount)} overdue
								{overdueDays !== null && overdueDays > 0 && ` — ${overdueDays} day${overdueDays !== 1 ? "s" : ""} past due`}
							</>
						)}
					</div>
					{status !== "paid" && (
						<div style={{ fontSize: "12px", color: cfg.color, opacity: 0.8, marginTop: "2px" }}>
							{cfg.text}
						</div>
					)}
				</div>
			</div>

			{/* Details */}
			<div style={{ padding: "16px 20px" }}>
				<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
					<span style={{ fontSize: "13px", color: "#6B7280" }}>Paid</span>
					<span style={{ fontSize: "13px", fontWeight: 600, color: "#16A34A" }}>
						{fmtAmount(paid_amount)}
					</span>
				</div>
				{pending_amount > 0 && (
					<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
						<span style={{ fontSize: "13px", color: "#6B7280" }}>Pending</span>
						<span style={{ fontSize: "13px", fontWeight: 600, color: cfg.color }}>
							{fmtAmount(pending_amount)}
						</span>
					</div>
				)}
				{next_due_date && status !== "paid" && (
					<div
						style={{
							marginTop: "12px",
							padding: "12px",
							background: "#F9FAFB",
							borderRadius: "10px",
							fontSize: "13px",
							color: "#374151",
						}}
					>
						<span style={{ fontWeight: 600 }}>Next due: </span>
						{fmtDate(next_due_date)} — {fmtAmount(next_due_amount)}
					</div>
				)}

				{/* Info note */}
				<p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "12px", margin: "12px 0 0" }}>
					For payment-related queries, please contact TechEthica administration.
				</p>
			</div>
		</div>
	);
}
