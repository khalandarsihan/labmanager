import React from "react";

function fmtDate(dateStr) {
	if (!dateStr) return "";
	try {
		return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
	} catch { return dateStr; }
}

function daysLeft(dateStr) {
	if (!dateStr) return null;
	const today = new Date(); today.setHours(0, 0, 0, 0);
	const due = new Date(dateStr); due.setHours(0, 0, 0, 0);
	return Math.ceil((due - today) / 86400000);
}

const SUBJECT_GRADIENTS = [
	"linear-gradient(135deg, #1B4332, #166534)",
	"linear-gradient(135deg, #14532D, #166534)",
	"linear-gradient(135deg, #064E3B, #0F766E)",
	"linear-gradient(135deg, #134E4A, #0F766E)",
	"linear-gradient(135deg, #0C4A6E, #0369A1)",
];

export default function AssignmentCard({ assignments }) {
	const { pending = [], submitted_count = 0, overdue_count = 0 } = assignments || {};

	return (
		<div className="rounded-3xl overflow-hidden" style={{ background: "#fff", boxShadow: "0 8px 32px rgba(27,67,50,0.1)" }}>
			{/* Gold top bar */}
			<div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #D4AF37, #F0D060, #D4AF37)" }} />

			<div className="p-5">
				{/* Title */}
				<div className="flex items-center gap-2 mb-5">
					<div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #1B4332, #166534)" }} />
					<h3 className="flex-1 text-base font-bold" style={{ color: "#111827" }}>Assignments</h3>
					{pending.length > 0 && (
						<span
							className="text-xs font-black px-3 py-1 rounded-full"
							style={{
								background: overdue_count > 0 ? "#FEE2E2" : "#DBEAFE",
								color: overdue_count > 0 ? "#DC2626" : "#1D4ED8",
							}}
						>
							{pending.length} pending
						</span>
					)}
				</div>

				{pending.length === 0 ? (
					<div className="flex flex-col items-center py-8">
						<div
							className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
							style={{ background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)" }}
						>
							<span className="text-3xl">✅</span>
						</div>
						<p className="text-sm font-medium" style={{ color: "#6B7280" }}>All caught up!</p>
						<p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>No pending assignments</p>
					</div>
				) : (
					<div className="space-y-3">
						{pending.map((a, idx) => {
							const days = daysLeft(a.due_date);
							const isOverdue = days !== null && days < 0;
							const isUrgent = days !== null && days <= 2 && days >= 0;
							const urgencyColor = isOverdue ? "#DC2626" : isUrgent ? "#D97706" : "#6B7280";

							return (
								<div
									key={idx}
									className="rounded-2xl p-3 flex items-start gap-3"
									style={{
										background: isOverdue ? "#FEF2F2" : isUrgent ? "#FFFBEB" : "#F9FAFB",
										border: `1px solid ${isOverdue ? "#FECACA" : isUrgent ? "#FDE68A" : "#F3F4F6"}`,
									}}
								>
									{/* Subject badge */}
									<div
										className="flex-shrink-0 text-[10px] font-black text-white px-2 py-1 rounded-lg"
										style={{ background: SUBJECT_GRADIENTS[idx % SUBJECT_GRADIENTS.length] }}
									>
										{(a.subject || "Gen").slice(0, 6)}
									</div>

									{/* Content */}
									<div className="flex-1 min-w-0">
										<div className="text-sm font-semibold truncate" style={{ color: "#111827" }}>
											{a.title}
										</div>
										<div className="text-xs mt-0.5 font-medium" style={{ color: urgencyColor }}>
											{isOverdue
												? `⚠ OVERDUE · ${Math.abs(days)}d ago`
												: days === 0
												? "⚡ Due today"
												: days !== null
												? `Due ${fmtDate(a.due_date)} · ${days}d left`
												: `Due ${fmtDate(a.due_date)}`}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}

				{(submitted_count > 0 || overdue_count > 0) && (
					<div className="flex gap-4 mt-4 pt-4 border-t" style={{ borderColor: "#F3F4F6" }}>
						{submitted_count > 0 && (
							<div className="flex items-center gap-1.5">
								<div className="w-2 h-2 rounded-full" style={{ background: "#16A34A" }} />
								<span className="text-xs font-medium" style={{ color: "#6B7280" }}>{submitted_count} submitted</span>
							</div>
						)}
						{overdue_count > 0 && (
							<div className="flex items-center gap-1.5">
								<div className="w-2 h-2 rounded-full" style={{ background: "#DC2626" }} />
								<span className="text-xs font-medium" style={{ color: "#DC2626" }}>{overdue_count} overdue</span>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
