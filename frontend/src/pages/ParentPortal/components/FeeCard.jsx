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

function daysSince(dateStr) {
	if (!dateStr) return null;
	const today = new Date(); today.setHours(0, 0, 0, 0);
	const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
	return Math.ceil((today - d) / 86400000);
}

const STATUS_CFG = {
	paid: {
		grad: "linear-gradient(135deg, #1B4332 0%, #166534 100%)",
		icon: "✓", iconBg: "rgba(255,255,255,0.2)",
		headline: "All Fees Clear",
		sub: "JazakAllahu Khayran for timely payment",
		headlineColor: "#fff",
	},
	upcoming: {
		grad: "linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)",
		icon: "📅", iconBg: "rgba(255,255,255,0.2)",
		headline: "Payment Upcoming",
		sub: "Plan ahead to stay on time",
		headlineColor: "#fff",
	},
	overdue: {
		grad: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
		icon: "!", iconBg: "rgba(255,255,255,0.2)",
		headline: "Payment Overdue",
		sub: "Please clear dues at the earliest",
		headlineColor: "#fff",
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

	const cfg = STATUS_CFG[status] || STATUS_CFG.paid;
	const overdueDays = status === "overdue" && next_due_date ? daysSince(next_due_date) : null;

	return (
		<div className="rounded-3xl overflow-hidden" style={{ background: "#fff", boxShadow: "0 8px 32px rgba(27,67,50,0.1)" }}>

			{/* Banner */}
			<div className="relative overflow-hidden p-5" style={{ background: cfg.grad }}>
				{/* Decorative circle */}
				<div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-10" style={{ background: "#fff" }} />
				<div className="absolute bottom-0 -left-4 w-20 h-20 rounded-full opacity-10" style={{ background: "#fff" }} />

				<div className="relative flex items-start gap-4">
					{/* Icon */}
					<div
						className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0"
						style={{ background: cfg.iconBg, color: "#fff" }}
					>
						{cfg.icon}
					</div>

					{/* Text */}
					<div className="flex-1 min-w-0">
						<div className="text-lg font-black text-white">{cfg.headline}</div>
						{status === "overdue" && (
							<div className="text-2xl font-black text-white mt-0.5">{fmtAmount(overdue_amount)}</div>
						)}
						{status === "upcoming" && (
							<div className="text-2xl font-black text-white mt-0.5">{fmtAmount(next_due_amount)}</div>
						)}
						<div className="text-xs font-medium mt-1" style={{ color: "rgba(255,255,255,0.75)" }}>
							{status === "overdue" && overdueDays && overdueDays > 0
								? `${overdueDays} day${overdueDays !== 1 ? "s" : ""} past due — ${cfg.sub}`
								: cfg.sub}
						</div>
					</div>
				</div>
			</div>

			{/* Details */}
			<div className="p-5 space-y-3">
				<div className="flex justify-between items-center py-2 border-b" style={{ borderColor: "#F3F4F6" }}>
					<span className="text-sm font-medium" style={{ color: "#6B7280" }}>Paid Amount</span>
					<span className="text-sm font-bold" style={{ color: "#16A34A" }}>{fmtAmount(paid_amount)}</span>
				</div>

				{pending_amount > 0 && (
					<div className="flex justify-between items-center py-2 border-b" style={{ borderColor: "#F3F4F6" }}>
						<span className="text-sm font-medium" style={{ color: "#6B7280" }}>Pending</span>
						<span className="text-sm font-bold" style={{ color: status === "overdue" ? "#DC2626" : "#1D4ED8" }}>
							{fmtAmount(pending_amount)}
						</span>
					</div>
				)}

				{next_due_date && status !== "paid" && (
					<div
						className="flex items-center gap-3 rounded-2xl p-3"
						style={{ background: status === "overdue" ? "#FEF2F2" : "#EFF6FF" }}
					>
						<span className="text-base">📅</span>
						<div>
							<div className="text-xs font-semibold" style={{ color: "#374151" }}>Next Due Date</div>
							<div className="text-sm font-bold" style={{ color: status === "overdue" ? "#DC2626" : "#1D4ED8" }}>
								{fmtDate(next_due_date)}
							</div>
						</div>
						<div className="ml-auto text-right">
							<div className="text-xs" style={{ color: "#9CA3AF" }}>Amount</div>
							<div className="text-sm font-bold" style={{ color: "#111827" }}>{fmtAmount(next_due_amount)}</div>
						</div>
					</div>
				)}

				<p className="text-[11px] text-center pt-1" style={{ color: "#9CA3AF" }}>
					Contact TechEthica admin for payment queries
				</p>
			</div>
		</div>
	);
}
