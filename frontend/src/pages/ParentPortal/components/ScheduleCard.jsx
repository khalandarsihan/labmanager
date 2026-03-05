import React, { useState, useMemo } from "react";

const STATUS_CFG = {
	completed: {
		dot:   "#9CA3AF",
		bg:    "#F9FAFB",
		badge: { bg: "#F3F4F6", color: "#6B7280" },
		label: "Done",
	},
	ongoing: {
		dot:   "#16A34A",
		bg:    "linear-gradient(135deg, #F0FDF4, #DCFCE7)",
		badge: { bg: "#16A34A", color: "#fff" },
		label: "Live",
	},
	upcoming: {
		dot:   "#D4AF37",
		bg:    "#fff",
		badge: { bg: "#FEF9E7", color: "#D97706" },
		label: "Soon",
	},
};

export default function ScheduleCard({ schedule }) {
	// Derive unique batch list from schedule
	const batches = useMemo(() => {
		if (!schedule) return [];
		const seen = new Set();
		const list = [];
		for (const p of schedule) {
			if (p.batch && !seen.has(p.batch)) { seen.add(p.batch); list.push(p.batch); }
		}
		return list;
	}, [schedule]);

	const [activeBatch, setActiveBatch] = useState(null); // null = All

	// When batches load, default to "All" (null) so parent sees all initially
	const filtered = useMemo(() => {
		if (!schedule) return [];
		if (!activeBatch) return schedule;
		return schedule.filter((p) => p.batch === activeBatch);
	}, [schedule, activeBatch]);

	return (
		<div className="rounded-3xl overflow-hidden" style={{ background: "#fff", boxShadow: "0 8px 32px rgba(27,67,50,0.1)" }}>
			{/* Gold top bar */}
			<div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #D4AF37, #F0D060, #D4AF37)" }} />

			<div className="p-5">
				{/* Title */}
				<div className="flex items-center gap-2 mb-4">
					<div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #1B4332, #166534)" }} />
					<h3 className="text-base font-bold" style={{ color: "#111827" }}>Today&rsquo;s Classes</h3>
				</div>

				{/* Batch filter tabs — only shown when multiple batches */}
				{batches.length > 1 && (
					<div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
						<button
							onClick={() => setActiveBatch(null)}
							className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-all"
							style={{
								background: !activeBatch ? "linear-gradient(135deg, #1B4332, #166534)" : "#F3F4F6",
								color: !activeBatch ? "#D4AF37" : "#6B7280",
								border: "none", cursor: "pointer",
							}}
						>
							All
						</button>
						{batches.map((b) => (
							<button
								key={b}
								onClick={() => setActiveBatch(b)}
								className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-all"
								style={{
									background: activeBatch === b ? "linear-gradient(135deg, #1B4332, #166534)" : "#F3F4F6",
									color: activeBatch === b ? "#D4AF37" : "#6B7280",
									border: "none", cursor: "pointer",
									maxWidth: "160px", overflow: "hidden",
									textOverflow: "ellipsis", whiteSpace: "nowrap",
								}}
							>
								{b}
							</button>
						))}
					</div>
				)}

				{!schedule || schedule.length === 0 ? (
					<div className="flex flex-col items-center py-8">
						<div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3" style={{ background: "linear-gradient(135deg, #F0F7F2, #DCFCE7)" }}>
							<span className="text-3xl">🕌</span>
						</div>
						<p className="text-sm font-medium" style={{ color: "#6B7280" }}>No classes scheduled today</p>
					</div>
				) : filtered.length === 0 ? (
					<div className="flex flex-col items-center py-8">
						<span className="text-3xl mb-2">📭</span>
						<p className="text-sm font-medium" style={{ color: "#6B7280" }}>No classes for this batch today</p>
					</div>
				) : (
					<div className="relative">
						{/* Timeline line */}
						<div
							className="absolute left-[18px] top-3 bottom-3 w-0.5"
							style={{ background: "linear-gradient(180deg, #1B4332 0%, #E5E7EB 100%)" }}
						/>

						<div className="space-y-2 pl-10">
							{filtered.map((period, idx) => {
								const cfg = STATUS_CFG[period.status] || STATUS_CFG.upcoming;
								const isOngoing = period.status === "ongoing";

								return (
									<div key={idx} className="relative">
										{/* Timeline dot */}
										<div
											className="absolute -left-10 top-3.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center"
											style={{ background: cfg.dot, boxShadow: isOngoing ? `0 0 0 3px ${cfg.dot}33` : "none" }}
										>
											{isOngoing && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
										</div>

										{/* Period card */}
										<div
											className="rounded-2xl p-3"
											style={{
												background: cfg.bg,
												border: isOngoing ? "1px solid #16A34A33" : "1px solid #F3F4F6",
											}}
										>
											<div className="flex items-start gap-2">
												{/* Time */}
												<div className="flex-shrink-0 text-right" style={{ minWidth: "52px" }}>
													<div className="text-[10px] font-bold" style={{ color: "#9CA3AF" }}>P{period.period}</div>
													<div className="text-xs font-semibold" style={{ color: isOngoing ? "#166534" : "#6B7280" }}>
														{period.start_time}
													</div>
													{period.end_time && (
														<div className="text-[10px]" style={{ color: "#9CA3AF" }}>→ {period.end_time}</div>
													)}
												</div>

												{/* Subject + teacher */}
												<div className="flex-1 min-w-0">
													<div className="text-sm font-bold truncate" style={{ color: isOngoing ? "#111827" : "#374151" }}>
														{period.subject}
													</div>
													{period.teacher_name && (
														<div className="text-xs mt-0.5 truncate" style={{ color: "#9CA3AF" }}>
															{period.teacher_name}
															{period.room && ` · ${period.room}`}
														</div>
													)}
													{/* Show batch chip only when viewing "All" */}
													{!activeBatch && period.batch && (
														<span
															className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-1"
															style={{ background: "rgba(27,67,50,0.08)", color: "#1B4332" }}
														>
															{period.batch}
														</span>
													)}
												</div>

												{/* Status badge */}
												<div
													className="flex-shrink-0 text-[10px] font-black px-2.5 py-1 rounded-full"
													style={cfg.badge}
												>
													{cfg.label}
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
