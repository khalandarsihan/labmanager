import React from "react";

const TYPE_CFG = {
	"Absent Alert":  { icon: "❌", dot: "#DC2626", bg: "#FEE2E2", color: "#DC2626" },
	"Daily Summary": { icon: "📊", dot: "#2563EB", bg: "#DBEAFE", color: "#2563EB" },
	"Assignment":    { icon: "📝", dot: "#7C3AED", bg: "#EDE9FE", color: "#7C3AED" },
	"Fee Reminder":  { icon: "💰", dot: "#D97706", bg: "#FEF3C7", color: "#D97706" },
	"Leave Update":  { icon: "🏖", dot: "#0891B2", bg: "#CFFAFE", color: "#0891B2" },
	"Weekly Report": { icon: "📅", dot: "#16A34A", bg: "#DCFCE7", color: "#16A34A" },
	"No Class":      { icon: "🕌", dot: "#6B7280", bg: "#F3F4F6", color: "#6B7280" },
};

const DEFAULT_CFG = { icon: "🔔", dot: "#9CA3AF", bg: "#F9FAFB", color: "#6B7280" };

function fmtDate(dateStr) {
	if (!dateStr) return "";
	try {
		return new Date(dateStr).toLocaleDateString("en-IN", {
			day: "numeric", month: "short", year: "numeric",
		});
	} catch { return dateStr; }
}

export default function NotificationsCard({ notifications }) {
	const list = notifications || [];

	return (
		<div className="rounded-3xl overflow-hidden" style={{ background: "#fff", boxShadow: "0 8px 32px rgba(27,67,50,0.1)" }}>
			{/* Gold top bar */}
			<div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#D4AF37,#F0D060,#D4AF37)" }} />

			<div className="p-5">
				{/* Title */}
				<div className="flex items-center gap-2 mb-4">
					<div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg,#1B4332,#166534)" }} />
					<h3 className="text-base font-bold" style={{ color: "#111827" }}>Notifications</h3>
					{list.length > 0 && (
						<span
							className="text-[10px] font-black px-2 py-0.5 rounded-full"
							style={{ background: "linear-gradient(135deg,#1B4332,#166534)", color: "#D4AF37" }}
						>
							{list.length}
						</span>
					)}
				</div>

				{list.length === 0 ? (
					<div className="flex flex-col items-center py-10">
						<div
							className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
							style={{ background: "linear-gradient(135deg,#F0F7F2,#DCFCE7)" }}
						>
							<span className="text-3xl">🔔</span>
						</div>
						<p className="text-sm font-medium" style={{ color: "#6B7280" }}>No notifications yet</p>
					</div>
				) : (
					<div className="space-y-2">
						{list.map((n, i) => {
							const cfg = TYPE_CFG[n.message_type] || DEFAULT_CFG;
							return (
								<div
									key={i}
									className="flex items-start gap-3 rounded-2xl p-3"
									style={{ background: cfg.bg, border: `1px solid ${cfg.dot}22` }}
								>
									{/* Icon */}
									<div
										className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
										style={{ background: "#fff", boxShadow: `0 2px 8px ${cfg.dot}33` }}
									>
										{cfg.icon}
									</div>

									{/* Text */}
									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between gap-2 mb-0.5">
											<span
												className="text-[10px] font-black px-2 py-0.5 rounded-full"
												style={{ background: cfg.dot, color: "#fff" }}
											>
												{n.message_type}
											</span>
											{n.sent_at && (
												<span className="text-[10px]" style={{ color: "#9CA3AF" }}>
													{fmtDate(n.sent_at)}
												</span>
											)}
										</div>
										<p className="text-xs leading-relaxed" style={{ color: "#374151" }}>
											{n.message_preview}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
