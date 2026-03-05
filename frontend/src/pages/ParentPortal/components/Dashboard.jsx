import React, { useCallback, useEffect, useState } from "react";
import StudentSelector from "./StudentSelector";
import AttendanceCard from "./AttendanceCard";
import AssignmentCard from "./AssignmentCard";
import FeeCard from "./FeeCard";
import ScheduleCard from "./ScheduleCard";
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

const NAV_ITEMS = [
	{ id: "today",       icon: "📅", label: "Today" },
	{ id: "attendance",  icon: "✓",  label: "Attendance" },
	{ id: "assignments", icon: "📝", label: "Assignments" },
	{ id: "fees",        icon: "💰", label: "Fees" },
];

export default function Dashboard({ token, students, parentName }) {
	const [activeStudentId, setActiveStudentId] = useState(
		students && students.length > 0 ? students[0].student_id : null
	);
	const [activeTab, setActiveTab]   = useState("today");
	const [dashData, setDashData]     = useState(null);
	const [loading, setLoading]       = useState(false);
	const [showLeave, setShowLeave]   = useState(false);

	const activeStudent = students?.find((s) => s.student_id === activeStudentId);

	const fetchDashboard = useCallback(async (studentId) => {
		if (!studentId) return;
		setLoading(true);
		setDashData(null);
		try {
			const data = await apiCall(
				"labmanager.portal.api.get_student_dashboard",
				{ token, student_id: studentId }
			);
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
		const onTouchEnd = (e) => {
			const dy = e.changedTouches[0].clientY - startY;
			if (dy > 120 && window.scrollY === 0) window.location.reload();
		};
		window.addEventListener("touchstart", onTouchStart, { passive: true });
		window.addEventListener("touchend", onTouchEnd, { passive: true });
		return () => {
			window.removeEventListener("touchstart", onTouchStart);
			window.removeEventListener("touchend", onTouchEnd);
		};
	}, []);

	const renderContent = () => {
		if (loading) return <LoadingSkeleton />;
		if (!dashData)  return (
			<div style={{ textAlign: "center", padding: "40px 20px", color: "#9CA3AF" }}>
				<div style={{ fontSize: "32px", marginBottom: "10px" }}>📊</div>
				<p>No data available</p>
			</div>
		);

		switch (activeTab) {
			case "today":
				return (
					<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
						<ScheduleCard schedule={dashData.schedule_today} />
						<AttendanceCard attendance={dashData.attendance} />
					</div>
				);
			case "attendance":
				return <AttendanceCard attendance={dashData.attendance} />;
			case "assignments":
				return <AssignmentCard assignments={dashData.assignments} />;
			case "fees":
				return <FeeCard fees={dashData.fees} />;
			default:
				return null;
		}
	};

	const greeting = (() => {
		const h = new Date().getHours();
		if (h < 12) return "Good Morning";
		if (h < 17) return "Good Afternoon";
		return "Good Evening";
	})();

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#F9FAFB",
				fontFamily: "system-ui, -apple-system, sans-serif",
				paddingBottom: "80px",
			}}
		>
			{/* ── Header ─────────────────────────────────────────── */}
			<div
				style={{
					background: "linear-gradient(135deg, #1B4332 0%, #166534 100%)",
					padding: "20px 16px 32px",
					position: "relative",
					overflow: "hidden",
				}}
			>
				{/* Decorative circle */}
				<div
					style={{
						position: "absolute", top: "-20px", right: "-20px",
						width: "120px", height: "120px",
						borderRadius: "50%", background: "rgba(212,175,55,0.12)",
					}}
				/>
				<div
					style={{
						position: "absolute", bottom: "-30px", left: "30px",
						width: "80px", height: "80px",
						borderRadius: "50%", background: "rgba(255,255,255,0.05)",
					}}
				/>

				{/* Logo + greeting */}
				<div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
					<div
						style={{
							width: "32px", height: "32px", borderRadius: "8px",
							background: "rgba(212,175,55,0.25)",
							display: "flex", alignItems: "center", justifyContent: "center",
							fontSize: "18px",
						}}
					>
						🌙
					</div>
					<span style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", fontWeight: 600, letterSpacing: "0.06em" }}>
						TECHETHICA
					</span>
				</div>
				<div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
					{greeting},
				</div>
				<div style={{ fontSize: "20px", fontWeight: 700, color: "#fff" }}>
					{parentName || "Parent"}
				</div>
			</div>

			{/* ── Student card (overlaps header) ─────────────────── */}
			<div style={{ padding: "0 16px", marginTop: "-18px", marginBottom: "16px" }}>
				<div
					style={{
						background: "#fff",
						borderRadius: "20px",
						padding: "16px",
						boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
					}}
				>
					{/* Student selector (multi-child tabs) */}
					{students && students.length > 1 && (
						<div style={{ marginBottom: "14px" }}>
							<StudentSelector
								students={students}
								activeId={activeStudentId}
								onSelect={handleStudentSelect}
							/>
						</div>
					)}

					{/* Active student info */}
					{activeStudent && (
						<div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
							{/* Photo */}
							<div
								style={{
									width: "56px", height: "56px", borderRadius: "50%",
									overflow: "hidden", flexShrink: 0,
									background: "#1B4332",
									display: "flex", alignItems: "center", justifyContent: "center",
									boxShadow: "0 2px 8px rgba(27,67,50,0.3)",
								}}
							>
								{activeStudent.photo_url ? (
									<img
										src={activeStudent.photo_url}
										alt={activeStudent.student_name}
										style={{ width: "100%", height: "100%", objectFit: "cover" }}
									/>
								) : (
									<span style={{ color: "#D4AF37", fontSize: "22px", fontWeight: 800 }}>
										{(activeStudent.student_name || "?")[0].toUpperCase()}
									</span>
								)}
							</div>

							<div>
								<div style={{ fontSize: "17px", fontWeight: 700, color: "#111827" }}>
									{activeStudent.student_name}
								</div>
								{activeStudent.batch && (
									<div
										style={{
											display: "inline-flex", alignItems: "center", gap: "4px",
											background: "#F0FDF4", color: "#166534",
											fontSize: "11px", fontWeight: 600,
											padding: "3px 8px", borderRadius: "20px", marginTop: "4px",
										}}
									>
										📚 {activeStudent.batch}
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* ── Tab content ──────────────────────────────────────── */}
			<div style={{ padding: "0 16px" }}>
				{renderContent()}
			</div>

			{/* ── Leave request FAB ──────────────────────────────── */}
			{activeStudent && (
				<button
					onClick={() => setShowLeave(true)}
					style={{
						position: "fixed",
						bottom: "90px",
						right: "16px",
						width: "52px",
						height: "52px",
						borderRadius: "50%",
						background: "#D4AF37",
						color: "#1B4332",
						border: "none",
						fontSize: "22px",
						cursor: "pointer",
						boxShadow: "0 4px 16px rgba(212,175,55,0.5)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 40,
					}}
					title="Apply for Leave"
				>
					📋
				</button>
			)}

			{/* ── Leave request modal ────────────────────────────── */}
			{showLeave && activeStudent && (
				<LeaveRequestModal
					token={token}
					studentId={activeStudentId}
					studentName={activeStudent.student_name}
					onClose={() => setShowLeave(false)}
				/>
			)}

			{/* ── Bottom navigation ────────────────────────────────── */}
			<nav
				style={{
					position: "fixed",
					bottom: 0, left: 0, right: 0,
					background: "#fff",
					borderTop: "1px solid #F3F4F6",
					display: "flex",
					zIndex: 50,
					boxShadow: "0 -2px 12px rgba(0,0,0,0.06)",
					paddingBottom: "env(safe-area-inset-bottom, 0px)",
				}}
			>
				{NAV_ITEMS.map((item) => {
					const isActive = activeTab === item.id;
					return (
						<button
							key={item.id}
							onClick={() => setActiveTab(item.id)}
							style={{
								flex: 1,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								gap: "3px",
								padding: "10px 4px",
								minHeight: "58px",
								border: "none",
								background: "none",
								cursor: "pointer",
								position: "relative",
							}}
						>
							{/* Active indicator */}
							{isActive && (
								<div
									style={{
										position: "absolute",
										top: 0, left: "25%", right: "25%",
										height: "3px",
										background: "#1B4332",
										borderRadius: "0 0 4px 4px",
									}}
								/>
							)}
							<span style={{ fontSize: "20px", lineHeight: 1 }}>{item.icon}</span>
							<span
								style={{
									fontSize: "10px",
									fontWeight: isActive ? 700 : 500,
									color: isActive ? "#1B4332" : "#9CA3AF",
								}}
							>
								{item.label}
							</span>
						</button>
					);
				})}
			</nav>
		</div>
	);
}
