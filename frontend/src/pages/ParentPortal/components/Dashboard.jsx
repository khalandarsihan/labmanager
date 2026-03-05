import React, { useCallback, useEffect, useState } from "react";
import StudentSelector from "./StudentSelector";
import AttendanceCard from "./AttendanceCard";
import AssignmentCard from "./AssignmentCard";
import FeeCard from "./FeeCard";
import TodaySchedule from "./TodaySchedule";
import NotificationsCard from "./NotificationsCard";
import LeaveRequestModal from "./LeaveRequestModal";
import LoadingSkeleton from "./LoadingSkeleton";

async function apiCall(method, args) {
	const res = await fetch(`/api/method/${method}`, {
		method: "POST",
		headers: { "Content-Type": "application/json", "X-Frappe-CSRF-Token": "fetch" },
		body: JSON.stringify(args),
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	const data = await res.json();
	return data.message;
}

/* ── SVG icons ─────────────────────────────────────────── */
const CalendarIcon = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
		<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
	</svg>
);
const ShieldIcon = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
		<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
	</svg>
);
const BookIcon = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
		<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
	</svg>
);
const CoinIcon = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
		<circle cx="12" cy="12" r="10"/><path d="M12 6v2m0 8v2m-4-6h8"/>
	</svg>
);
const BellIcon = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
		<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
	</svg>
);

const NAV_ITEMS = [
	{ id: "today",         Icon: CalendarIcon, label: "Today" },
	{ id: "assignments",   Icon: BookIcon,     label: "Homework" },
	{ id: "fees",          Icon: CoinIcon,     label: "Fees" },
	{ id: "notifications", Icon: BellIcon,     label: "Alerts" },
];

/* ── Islamic star pattern for header ──────────────────── */
const StarPattern = () => (
	<svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
		<defs>
			<pattern id="star" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
				<polygon points="30,5 35,22 52,22 38,33 43,50 30,39 17,50 22,33 8,22 25,22" fill="white"/>
			</pattern>
		</defs>
		<rect width="100%" height="100%" fill="url(#star)"/>
	</svg>
);

export default function Dashboard({ token, students, parentName }) {
	const [activeStudentId, setActiveStudentId] = useState(
		students?.length > 0 ? students[0].student_id : null
	);
	const [activeTab, setActiveTab] = useState("today");
	const [dashData, setDashData]   = useState(null);
	const [loading, setLoading]     = useState(false);
	const [showLeave, setShowLeave] = useState(false);

	const activeStudent = students?.find((s) => s.student_id === activeStudentId);

	const fetchDashboard = useCallback(async (studentId) => {
		if (!studentId) return;
		setLoading(true);
		setDashData(null);
		try {
			const data = await apiCall("labmanager.portal.api.get_student_dashboard", {
				token, student_id: studentId,
			});
			if (data && !data.error) setDashData(data);
		} catch (e) {
			console.error("Dashboard fetch error:", e);
		} finally {
			setLoading(false);
		}
	}, [token]);

	useEffect(() => {
		if (activeStudentId) fetchDashboard(activeStudentId);
	}, [activeStudentId, fetchDashboard]);

	const handleStudentSelect = (id) => {
		setActiveStudentId(id);
		setActiveTab("today");
	};

	// Pull-to-refresh
	useEffect(() => {
		let startY = 0;
		const onTouchStart = (e) => { startY = e.touches[0].clientY; };
		const onTouchEnd   = (e) => {
			if (e.changedTouches[0].clientY - startY > 120 && window.scrollY === 0)
				window.location.reload();
		};
		window.addEventListener("touchstart", onTouchStart, { passive: true });
		window.addEventListener("touchend",   onTouchEnd,   { passive: true });
		return () => {
			window.removeEventListener("touchstart", onTouchStart);
			window.removeEventListener("touchend",   onTouchEnd);
		};
	}, []);

	const hour = new Date().getHours();
	const greeting = hour < 12 ? "Sabah ul Khair 🌅" : hour < 17 ? "Assalamu Alaikum ☀️" : "Masa ul Khair 🌙";

	const attendancePct = dashData?.attendance?.this_month_percent ?? null;
	const pctColor = attendancePct === null ? "#fff"
		: attendancePct >= 75 ? "#4ADE80"
		: attendancePct >= 60 ? "#FCD34D"
		: "#FCA5A5";

	const renderContent = () => {
		if (loading) return <LoadingSkeleton />;
		if (!dashData) return (
			<div className="flex flex-col items-center justify-center py-16 text-gray-400">
				<div className="text-5xl mb-3">📊</div>
				<p className="text-sm">No data available</p>
			</div>
		);

		const studentBatches = activeStudent?.batches?.length > 0
			? activeStudent.batches
			: activeStudent?.batch ? [activeStudent.batch] : [];

		switch (activeTab) {
			case "today":
				return (
					<div className="space-y-4">
						<TodaySchedule schedule={dashData.schedule_today} batches={studentBatches} />
						<AttendanceCard attendance={dashData.attendance} token={token} studentId={activeStudentId} />
					</div>
				);
			case "assignments":   return <AssignmentCard assignments={dashData.assignments} />;
			case "fees":          return <FeeCard fees={dashData.fees} />;
			case "notifications": return <NotificationsCard notifications={dashData.notifications} />;
			default:              return null;
		}
	};

	return (
		<div className="min-h-screen pb-24" style={{ background: "linear-gradient(180deg, #F0F7F2 0%, #F9FAFB 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>

			{/* ══ HEADER ══════════════════════════════════════════ */}
			<div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0D2B1D 0%, #1B4332 50%, #166534 100%)", paddingBottom: "56px" }}>
				<StarPattern />

				{/* Gold accent orb top-right */}
				<div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }} />
				<div className="absolute bottom-8 -left-6 w-24 h-24 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }} />

				<div className="relative px-5 pt-10 pb-2">
					{/* TechEthica wordmark */}
					<div className="flex items-center gap-2 mb-5">
						<div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.3)" }}>
							<span className="text-base">🌙</span>
						</div>
						<span className="text-xs font-bold tracking-widest" style={{ color: "rgba(212,175,55,0.9)" }}>TECHETHICA</span>
					</div>

					{/* Greeting */}
					<p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>{greeting}</p>
					<h1 className="text-2xl font-bold text-white mb-5">{parentName || "Parent"}</h1>

					{/* Quick stats chips */}
					{dashData && (
						<div className="flex gap-3 flex-wrap">
							{attendancePct !== null && (
								<div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
									<span className="text-xl font-bold" style={{ color: pctColor }}>{attendancePct}%</span>
									<span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Attendance</span>
								</div>
							)}
							{activeStudent?.batches?.length > 0
								? activeStudent.batches.map((b) => (
									<div key={b} className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
										<span className="text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>📚 {b}</span>
									</div>
								))
								: activeStudent?.batch && (
									<div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
										<span className="text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>📚 {activeStudent.batch}</span>
									</div>
								)
							}
						</div>
					)}
				</div>

				{/* Wave bottom */}
				<svg className="absolute bottom-0 left-0 w-full" style={{ height: "48px" }} viewBox="0 0 375 48" preserveAspectRatio="none">
					<path d="M0,48 L0,20 Q60,48 120,28 Q180,8 240,30 Q300,52 375,20 L375,48 Z" fill="#F0F7F2"/>
				</svg>
			</div>

			{/* ══ STUDENT CARD ════════════════════════════════════ */}
			<div className="px-4 -mt-3 mb-4">
				<div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 8px 32px rgba(27,67,50,0.12)" }}>
					{/* Gold top bar */}
					<div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #D4AF37, #F0D060, #D4AF37)" }} />

					<div className="p-4">
						{students?.length > 1 && (
							<div className="mb-4">
								<StudentSelector students={students} activeId={activeStudentId} onSelect={handleStudentSelect} />
							</div>
						)}

						{activeStudent && (
							<div className="flex items-center gap-4">
								{/* Avatar with ring */}
								<div className="relative flex-shrink-0">
									<div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black" style={{ background: "linear-gradient(135deg, #1B4332, #166534)", color: "#D4AF37", boxShadow: "0 4px 12px rgba(27,67,50,0.35)" }}>
										{activeStudent.photo_url
											? <img src={activeStudent.photo_url} alt="" className="w-full h-full object-cover rounded-2xl" />
											: (activeStudent.student_name || "?")[0].toUpperCase()
										}
									</div>
									<div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
										<div className="w-2 h-2 bg-white rounded-full" />
									</div>
								</div>

								<div className="flex-1 min-w-0">
									<h2 className="text-base font-bold text-gray-900 truncate">{activeStudent.student_name}</h2>
									<div className="flex flex-wrap gap-1 mt-1">
										{(activeStudent.batches?.length > 0 ? activeStudent.batches : activeStudent.batch ? [activeStudent.batch] : []).map((b) => (
											<span key={b} className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "linear-gradient(90deg, #DCFCE7, #F0FDF4)", color: "#166534" }}>
												📚 {b}
											</span>
										))}
									</div>
								</div>

								{/* Attendance ring mini */}
								{attendancePct !== null && (
									<div className="flex-shrink-0 flex flex-col items-center">
										<svg width="44" height="44" viewBox="0 0 44 44">
											<circle cx="22" cy="22" r="18" fill="none" stroke="#F3F4F6" strokeWidth="5"/>
											<circle cx="22" cy="22" r="18" fill="none" stroke={pctColor === "#FCA5A5" ? "#DC2626" : pctColor === "#FCD34D" ? "#D97706" : "#16A34A"} strokeWidth="5"
												strokeDasharray={`${(attendancePct / 100) * (2 * Math.PI * 18)} ${2 * Math.PI * 18}`}
												strokeLinecap="round" transform="rotate(-90 22 22)"
											/>
											<text x="22" y="26" textAnchor="middle" fontSize="10" fontWeight="800" fill={pctColor === "#FCA5A5" ? "#DC2626" : pctColor === "#FCD34D" ? "#D97706" : "#16A34A"}>{attendancePct}%</text>
										</svg>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* ══ CONTENT ═════════════════════════════════════════ */}
			<div className="px-4">
				{renderContent()}
			</div>

			{/* ══ LEAVE FAB ═══════════════════════════════════════ */}
			{activeStudent && (
				<button
					onClick={() => setShowLeave(true)}
					className="fixed z-40 flex items-center gap-2 text-sm font-bold rounded-full shadow-2xl"
					style={{
						bottom: "80px", right: "16px",
						background: "linear-gradient(135deg, #D4AF37, #F0D060)",
						color: "#1B4332", border: "none", padding: "12px 20px",
						boxShadow: "0 6px 20px rgba(212,175,55,0.5)",
					}}
				>
					<span>📋</span> Leave
				</button>
			)}

			{showLeave && activeStudent && (
				<LeaveRequestModal token={token} studentId={activeStudentId} studentName={activeStudent.student_name} onClose={() => setShowLeave(false)} />
			)}

			{/* ══ BOTTOM NAV ══════════════════════════════════════ */}
			<nav className="fixed bottom-0 left-0 right-0 z-50 flex" style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderTop: "1px solid #F3F4F6", boxShadow: "0 -4px 24px rgba(0,0,0,0.08)", paddingBottom: "env(safe-area-inset-bottom,0px)" }}>
				{NAV_ITEMS.map(({ id, Icon, label }) => {
					const active = activeTab === id;
					return (
						<button key={id} onClick={() => setActiveTab(id)}
							className="flex-1 flex flex-col items-center justify-center gap-1 py-3 border-none cursor-pointer transition-all duration-200"
							style={{ background: "none", minHeight: "58px" }}
						>
							{/* Active pill background */}
							<div className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200"
								style={{ background: active ? "linear-gradient(135deg, #1B4332, #166534)" : "transparent" }}
							>
								<span style={{ color: active ? "#D4AF37" : "#9CA3AF" }}><Icon /></span>
								<span className="text-[10px] font-bold" style={{ color: active ? "#1B4332" : "#9CA3AF" }}>
									{label}
								</span>
							</div>
						</button>
					);
				})}
			</nav>
		</div>
	);
}
