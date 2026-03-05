import React, { useState } from "react";

const LEAVE_TYPES = [
	{ value: "Medical",  label: "Medical",  icon: "🏥", desc: "Illness or hospital visit" },
	{ value: "Personal", label: "Personal", icon: "👤", desc: "Personal reason" },
	{ value: "Family",   label: "Family",   icon: "👨‍👩‍👧", desc: "Family event or emergency" },
];

async function submitLeave(token, studentId, payload) {
	const res = await fetch("/api/method/labmanager.portal.api.submit_leave_request", {
		method: "POST",
		headers: { "Content-Type": "application/json", "X-Frappe-CSRF-Token": "fetch" },
		body: JSON.stringify({ token, student_id: studentId, ...payload }),
	});
	if (!res.ok) throw new Error("Network error");
	const data = await res.json();
	return data.message;
}

export default function LeaveRequestModal({ token, studentId, studentName, onClose }) {
	const [leaveType, setLeaveType] = useState("Medical");
	const [fromDate, setFromDate]   = useState("");
	const [toDate, setToDate]       = useState("");
	const [reason, setReason]       = useState("");
	const [loading, setLoading]     = useState(false);
	const [toast, setToast]         = useState(null);

	const today = new Date().toISOString().split("T")[0];

	const showToast = (msg, type) => {
		setToast({ msg, type });
		setTimeout(() => setToast(null), 4000);
	};

	const handleSubmit = async () => {
		if (!fromDate || !toDate) {
			showToast("Please select both From and To dates.", "error");
			return;
		}
		if (fromDate > toDate) {
			showToast("'From' date cannot be after 'To' date.", "error");
			return;
		}

		setLoading(true);
		try {
			const result = await submitLeave(token, studentId, {
				leave_type: leaveType,
				from_date: fromDate,
				to_date: toDate,
				reason,
			});
			if (result && result.error) {
				showToast("Could not submit. Please try again or contact TechEthica.", "error");
			} else {
				showToast(
					"JazakAllahu Khayran! Your leave request has been sent. Admin will review shortly.",
					"success"
				);
				setTimeout(onClose, 2500);
			}
		} catch {
			showToast("Could not submit. Please try again or contact TechEthica.", "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			style={{
				position: "fixed", inset: 0, zIndex: 1000,
				background: "rgba(0,0,0,0.5)",
				display: "flex", alignItems: "flex-end",
				fontFamily: "system-ui, -apple-system, sans-serif",
			}}
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<div
				style={{
					width: "100%",
					background: "#fff",
					borderRadius: "24px 24px 0 0",
					padding: "24px 20px 40px",
					maxHeight: "92vh",
					overflowY: "auto",
				}}
			>
				{/* Handle bar */}
				<div
					style={{
						width: "40px", height: "4px", background: "#E5E7EB",
						borderRadius: "2px", margin: "0 auto 20px",
					}}
				/>

				{/* Header */}
				<div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
					<h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", margin: 0, flex: 1 }}>
						Apply for Leave
					</h2>
					<button
						onClick={onClose}
						style={{
							background: "#F3F4F6", border: "none", borderRadius: "50%",
							width: "36px", height: "36px", cursor: "pointer",
							fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center",
						}}
					>
						✕
					</button>
				</div>

				{studentName && (
					<div
						style={{
							background: "#F0FDF4", borderRadius: "10px",
							padding: "10px 14px", marginBottom: "20px",
							fontSize: "13px", color: "#166534",
						}}
					>
						📋 Leave request for <strong>{studentName}</strong>
					</div>
				)}

				{/* Leave type */}
				<label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "10px" }}>
					Leave Type
				</label>
				<div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
					{LEAVE_TYPES.map((t) => (
						<button
							key={t.value}
							onClick={() => setLeaveType(t.value)}
							style={{
								display: "flex", alignItems: "center", gap: "12px",
								padding: "14px 16px",
								border: `2px solid ${leaveType === t.value ? "#1B4332" : "#E5E7EB"}`,
								borderRadius: "14px",
								background: leaveType === t.value ? "#F0FDF4" : "#fff",
								cursor: "pointer",
								textAlign: "left",
								minHeight: "44px",
							}}
						>
							<span style={{ fontSize: "22px" }}>{t.icon}</span>
							<div>
								<div style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>
									{t.label}
								</div>
								<div style={{ fontSize: "12px", color: "#9CA3AF" }}>{t.desc}</div>
							</div>
							{leaveType === t.value && (
								<div style={{ marginLeft: "auto", color: "#1B4332", fontWeight: 700 }}>✓</div>
							)}
						</button>
					))}
				</div>

				{/* Date range */}
				<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
					<div>
						<label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
							From Date
						</label>
						<input
							type="date"
							value={fromDate}
							min={today}
							onChange={(e) => setFromDate(e.target.value)}
							style={{
								width: "100%", padding: "12px", border: "1.5px solid #E5E7EB",
								borderRadius: "10px", fontSize: "14px", color: "#111827",
								boxSizing: "border-box", minHeight: "44px",
							}}
						/>
					</div>
					<div>
						<label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
							To Date
						</label>
						<input
							type="date"
							value={toDate}
							min={fromDate || today}
							onChange={(e) => setToDate(e.target.value)}
							style={{
								width: "100%", padding: "12px", border: "1.5px solid #E5E7EB",
								borderRadius: "10px", fontSize: "14px", color: "#111827",
								boxSizing: "border-box", minHeight: "44px",
							}}
						/>
					</div>
				</div>

				{/* Reason */}
				<label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
					Reason <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(optional)</span>
				</label>
				<textarea
					value={reason}
					onChange={(e) => setReason(e.target.value)}
					placeholder="Briefly describe the reason for leave..."
					rows={3}
					style={{
						width: "100%", padding: "12px", border: "1.5px solid #E5E7EB",
						borderRadius: "10px", fontSize: "14px", resize: "vertical",
						marginBottom: "24px", boxSizing: "border-box", color: "#111827",
					}}
				/>

				{/* Submit */}
				<button
					onClick={handleSubmit}
					disabled={loading}
					style={{
						width: "100%",
						padding: "16px",
						background: loading ? "#9CA3AF" : "#1B4332",
						color: "#fff",
						border: "none",
						borderRadius: "14px",
						fontSize: "16px",
						fontWeight: 700,
						cursor: loading ? "not-allowed" : "pointer",
						minHeight: "52px",
					}}
				>
					{loading ? "Submitting…" : "Apply for Leave"}
				</button>

				{/* Toast */}
				{toast && (
					<div
						style={{
							position: "fixed", bottom: "100px", left: "16px", right: "16px",
							background: toast.type === "success" ? "#1B4332" : "#DC2626",
							color: "#fff", borderRadius: "14px", padding: "14px 16px",
							fontSize: "14px", fontWeight: 500, zIndex: 1100,
							boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
						}}
					>
						{toast.msg}
					</div>
				)}
			</div>
		</div>
	);
}
