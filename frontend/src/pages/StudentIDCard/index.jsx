import React, { useEffect, useState, useRef } from "react";
import { useFrappePostCall } from "frappe-react-sdk";

const SCHOOL_NAME = "TechEthica";
const SCHOOL_SUBTITLE = "Islamic Tech Academy, Bengaluru";
const ACCENT = "#065f46";   // emerald-800
const GOLD   = "#b45309";   // amber-700

/* ── tiny helpers ──────────────────────────────────────────────── */
function formatDate(iso) {
	if (!iso) return "";
	const [y, m, d] = iso.split("-");
	return `${d}-${m}-${y}`;
}

function bloodLabel(bg) {
	const map = { "A+": "A+ Positive", "A-": "A- Negative", "B+": "B+ Positive", "B-": "B- Negative",
		"O+": "O+ Positive", "O-": "O- Negative", "AB+": "AB+ Positive", "AB-": "AB- Negative" };
	return map[bg] || bg;
}

/* ── ID card ───────────────────────────────────────────────────── */
const IDCard = ({ data }) => (
	<div
		id="id-card"
		style={{
			width: 340,
			borderRadius: 16,
			overflow: "hidden",
			boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
			fontFamily: "'Segoe UI', Arial, sans-serif",
			background: "#fff",
			border: `2px solid ${ACCENT}`,
		}}
	>
		{/* ── header band ── */}
		<div style={{ background: ACCENT, padding: "14px 16px 10px", textAlign: "center" }}>
			<div style={{ color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>
				{SCHOOL_NAME}
			</div>
			<div style={{ color: "#6ee7b7", fontSize: 10.5, marginTop: 2, letterSpacing: 0.5 }}>
				{SCHOOL_SUBTITLE}
			</div>
			<div style={{
				display: "inline-block", marginTop: 8, background: GOLD,
				color: "#fff", fontSize: 9.5, fontWeight: 700, letterSpacing: 2,
				padding: "3px 14px", borderRadius: 20,
			}}>
				STUDENT ID CARD
			</div>
		</div>

		{/* ── photo + name strip ── */}
		<div style={{
			display: "flex", alignItems: "center", gap: 14,
			padding: "14px 16px 10px",
			background: "linear-gradient(135deg, #ecfdf5 0%, #fff 100%)",
			borderBottom: `2px solid ${ACCENT}22`,
		}}>
			{/* photo */}
			<div style={{
				width: 80, height: 80, borderRadius: "50%",
				border: `3px solid ${ACCENT}`,
				overflow: "hidden", flexShrink: 0, background: "#d1fae5",
				display: "flex", alignItems: "center", justifyContent: "center",
			}}>
				{data.profile_image
					? <img src={data.profile_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
					: <span style={{ fontSize: 32 }}>👤</span>
				}
			</div>

			{/* name block */}
			<div style={{ flex: 1, minWidth: 0 }}>
				<div style={{ fontSize: 15, fontWeight: 700, color: "#1a2e20", lineHeight: 1.25, wordBreak: "break-word" }}>
					{data.full_name}
				</div>
				{data.class_section && (
					<div style={{ fontSize: 11, color: ACCENT, fontWeight: 600, marginTop: 3 }}>
						🎓 {data.class_section}
					</div>
				)}
				<div style={{
					marginTop: 6, display: "inline-block",
					background: ACCENT, color: "#fff",
					fontSize: 10, fontWeight: 700, letterSpacing: 1,
					padding: "2px 10px", borderRadius: 10,
				}}>
					{data.name}
				</div>
			</div>
		</div>

		{/* ── details grid ── */}
		<div style={{ padding: "10px 16px 6px" }}>
			{[
				{ icon: "👨", label: "Father", value: data.father_name },
				{ icon: "🩸", label: "Blood",  value: bloodLabel(data.blood_group) },
				{ icon: "📅", label: "DOB",    value: formatDate(data.date_of_birth) },
				{ icon: "📱", label: "Emergency", value: data.emergency_contact },
				{ icon: "🏠", label: "Address", value: data.address },
			].filter(r => r.value).map(({ icon, label, value }) => (
				<div key={label} style={{
					display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start",
				}}>
					<span style={{ fontSize: 13, lineHeight: 1.4, flexShrink: 0 }}>{icon}</span>
					<div style={{ flex: 1, minWidth: 0 }}>
						<span style={{ fontSize: 9.5, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
							{label}
						</span>
						<div style={{ fontSize: 11.5, color: "#1f2937", lineHeight: 1.4, wordBreak: "break-word" }}>
							{value}
						</div>
					</div>
				</div>
			))}
		</div>

		{/* ── QR + footer ── */}
		<div style={{
			display: "flex", alignItems: "flex-end", justifyContent: "space-between",
			padding: "8px 16px 14px",
			borderTop: `2px solid ${ACCENT}22`,
			background: "#f9fafb",
		}}>
			<div style={{ fontSize: 9, color: "#9ca3af", lineHeight: 1.6 }}>
				<div style={{ fontWeight: 700, color: ACCENT, fontSize: 10 }}>Scan to mark attendance</div>
				<div>ID: <strong>{data.qr_id || data.name}</strong></div>
				{data.phone && <div>📞 {data.phone}</div>}
			</div>
			{data.qr_code && (
				<img
					src={data.qr_code}
					alt="QR"
					style={{ width: 72, height: 72, borderRadius: 6, border: "1.5px solid #d1d5db" }}
				/>
			)}
		</div>
	</div>
);

/* ── page ──────────────────────────────────────────────────────── */
const StudentIDCardPage = () => {
	const student = new URLSearchParams(window.location.search).get("student");
	const [data, setData] = useState(null);
	const [error, setError] = useState("");
	const { call } = useFrappePostCall("labmanager.api.api.get_student_id_card");

	useEffect(() => {
		if (!student) { setError("No student ID provided. Add ?student=STUD-001 to the URL."); return; }
		call({ student })
			.then((r) => {
				if (r.message) setData(r.message);
				else setError("Student not found.");
			})
			.catch(() => setError("Failed to load student data."));
	}, [student]);

	const handlePrint = () => window.print();

	return (
		<div style={{ minHeight: "100vh", background: "#f3f4f6", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 16px" }}>
			{/* screen-only controls */}
			<div className="print:hidden" style={{ marginBottom: 24, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
				<button
					onClick={handlePrint}
					disabled={!data}
					style={{
						background: ACCENT, color: "#fff", border: "none",
						borderRadius: 8, padding: "10px 28px", fontSize: 14,
						fontWeight: 600, cursor: data ? "pointer" : "not-allowed",
						opacity: data ? 1 : 0.5,
					}}
				>
					🖨 Print ID Card
				</button>
				{data && (
					<a
						href="/labmanager/student-profile"
						style={{
							background: "#fff", color: ACCENT, border: `1.5px solid ${ACCENT}`,
							borderRadius: 8, padding: "10px 20px", fontSize: 14,
							fontWeight: 600, textDecoration: "none",
						}}
					>
						← Back
					</a>
				)}
			</div>

			{/* card or state */}
			{error && (
				<div style={{ background: "#fee2e2", color: "#991b1b", padding: "16px 24px", borderRadius: 10, maxWidth: 400, textAlign: "center" }}>
					{error}
				</div>
			)}
			{!data && !error && (
				<div style={{ color: "#6b7280", fontSize: 14 }}>Loading student data…</div>
			)}
			{data && <IDCard data={data} />}

			{/* print-only: card centered on the page */}
			<style>{`
				@media print {
					body * { visibility: hidden; }
					#id-card, #id-card * { visibility: visible; }
					#id-card {
						position: fixed;
						top: 50%; left: 50%;
						transform: translate(-50%, -50%);
						box-shadow: none !important;
					}
				}
			`}</style>
		</div>
	);
};

export default StudentIDCardPage;
