import React, { useState, useMemo } from "react";

// Cycles through TechEthica-flavoured subject colours
const SUBJECT_PALETTE = [
	"#1B4332", "#166534", "#065F46", "#0F766E", "#1E40AF",
	"#4338CA", "#6D28D9", "#9333EA", "#BE185D", "#B45309",
	"#92400E", "#991B1B", "#0369A1", "#0E7490", "#374151",
];

const STATUS_CFG = {
	ongoing:   { dot: "#16A34A", label: "Live",  glow: true,  border: "#16A34A33", bg: "linear-gradient(135deg,#F0FDF4,#DCFCE7)" },
	upcoming:  { dot: "#D4AF37", label: "Soon",  glow: false, border: "#F3F4F6",   bg: "#fff" },
	completed: { dot: "#9CA3AF", label: "Done",  glow: false, border: "#F3F4F6",   bg: "#F9FAFB" },
};

export default function TodaySchedule({ schedule, batches }) {
	const [activeBatch, setActiveBatch] = useState(""); // "" = All

	// Stable subject → colour mapping
	const subjectColor = useMemo(() => {
		const map = {};
		let i = 0;
		for (const p of (schedule || [])) {
			if (p.subject && !map[p.subject]) {
				map[p.subject] = SUBJECT_PALETTE[i % SUBJECT_PALETTE.length];
				i++;
			}
		}
		return map;
	}, [schedule]);

	const filtered = useMemo(() => {
		if (!schedule) return [];
		if (!activeBatch) return schedule;
		return schedule.filter((p) => p.batch === activeBatch);
	}, [schedule, activeBatch]);

	const hasBatchFilter = batches && batches.length > 1;

	return (
		<div className="rounded-3xl overflow-hidden" style={{ background: "#fff", boxShadow: "0 8px 32px rgba(27,67,50,0.1)" }}>
			{/* Gold top bar */}
			<div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#D4AF37,#F0D060,#D4AF37)" }} />

			<div className="p-5">
				{/* Title + batch dropdown */}
				<div className="flex items-center justify-between gap-3 mb-4">
					<div className="flex items-center gap-2">
						<div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg,#1B4332,#166534)" }} />
						<h3 className="text-base font-bold" style={{ color: "#111827" }}>Today&rsquo;s Classes</h3>
					</div>

					{hasBatchFilter && (
						<select
							value={activeBatch}
							onChange={(e) => setActiveBatch(e.target.value)}
							className="text-xs font-semibold rounded-xl px-3 py-1.5 outline-none cursor-pointer"
							style={{
								background: "linear-gradient(135deg,#1B4332,#166534)",
								color: "#D4AF37",
								border: "none",
								appearance: "none",
								WebkitAppearance: "none",
								paddingRight: "28px",
								backgroundImage: `linear-gradient(135deg,#1B4332,#166534), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23D4AF37' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
								backgroundRepeat: "no-repeat, no-repeat",
								backgroundPosition: "0 0, right 10px center",
							}}
						>
							<option value="">All</option>
							{batches.map((b) => (
								<option key={b} value={b}>{b}</option>
							))}
						</select>
					)}
				</div>

				{/* Period boxes */}
				{filtered.length === 0 ? (
					<div className="flex flex-col items-center py-8">
						<span className="text-3xl mb-2">🕌</span>
						<p className="text-sm font-medium" style={{ color: "#6B7280" }}>
							{schedule && schedule.length > 0 ? "No classes for this batch today" : "No classes scheduled today"}
						</p>
					</div>
				) : (
					<div className="space-y-2">
						{filtered.map((period, idx) => {
							const st  = STATUS_CFG[period.status] || STATUS_CFG.upcoming;
							const col = subjectColor[period.subject] || SUBJECT_PALETTE[0];

							return (
								<div
									key={idx}
									className="rounded-2xl overflow-hidden"
									style={{ border: `1px solid ${st.border}`, background: st.bg }}
								>
									<div className="flex items-stretch">
										{/* ── Left: time column ── */}
										<div
											className="flex flex-col items-center justify-center px-3 py-3 flex-shrink-0"
											style={{ minWidth: "58px", borderRight: "1px solid rgba(0,0,0,0.05)" }}
										>
											<div className="text-[10px] font-bold" style={{ color: "#9CA3AF" }}>
												P{period.period}
											</div>
											<div
												className="text-xs font-semibold mt-0.5"
												style={{ color: period.status === "ongoing" ? "#166534" : "#6B7280" }}
											>
												{period.start_time}
											</div>
											{period.end_time && (
												<div className="text-[9px]" style={{ color: "#9CA3AF" }}>
													→ {period.end_time}
												</div>
											)}
										</div>

										{/* ── Right: subject box ── */}
										<div className="flex-1 p-3">
											<div className="flex items-start justify-between gap-2">
												<div className="flex-1 min-w-0">
													{/* Coloured subject pill */}
													<div
														className="inline-flex items-center px-3 py-1 rounded-xl mb-1.5"
														style={{ background: col }}
													>
														<span className="text-sm font-bold text-white truncate max-w-[160px]">
															{period.subject}
														</span>
													</div>
													{period.teacher_name && (
														<div className="text-xs truncate" style={{ color: "#9CA3AF" }}>
															{period.teacher_name}
														</div>
													)}
													{/* Batch chip — only when viewing All */}
													{!activeBatch && period.batch && (
														<span
															className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-1"
															style={{ background: "rgba(27,67,50,0.08)", color: "#1B4332" }}
														>
															{period.batch}
														</span>
													)}
												</div>

												{/* Status dot */}
												<div className="flex flex-col items-end gap-0.5 flex-shrink-0">
													<div
														className="w-2.5 h-2.5 rounded-full"
														style={{
															background: st.dot,
															boxShadow: st.glow ? `0 0 0 3px ${st.dot}33` : "none",
														}}
													/>
													<span className="text-[9px] font-bold" style={{ color: st.dot }}>
														{st.label}
													</span>
												</div>
											</div>
										</div>
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
