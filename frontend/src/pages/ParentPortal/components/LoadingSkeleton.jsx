import React from "react";

const Pulse = ({ style }) => (
	<div
		className="animate-pulse"
		style={{
			background: "#E5E7EB",
			borderRadius: "8px",
			...style,
		}}
	/>
);

export default function LoadingSkeleton() {
	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#F9FAFB",
				fontFamily: "system-ui, -apple-system, sans-serif",
			}}
		>
			{/* Header skeleton */}
			<div style={{ background: "#1B4332", padding: "20px 16px 24px" }}>
				<Pulse style={{ width: "120px", height: "14px", background: "#2D6A4F", marginBottom: "8px" }} />
				<Pulse style={{ width: "200px", height: "22px", background: "#2D6A4F" }} />
			</div>

			{/* Student card skeleton */}
			<div style={{ margin: "-16px 16px 0", background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
				<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
					<Pulse style={{ width: "60px", height: "60px", borderRadius: "50%" }} />
					<div style={{ flex: 1 }}>
						<Pulse style={{ width: "140px", height: "18px", marginBottom: "8px" }} />
						<Pulse style={{ width: "100px", height: "13px" }} />
					</div>
				</div>
			</div>

			{/* Content skeleton */}
			<div style={{ padding: "24px 16px" }}>
				{/* Attendance card */}
				<div style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
					<Pulse style={{ width: "120px", height: "16px", marginBottom: "20px" }} />
					<div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
						<Pulse style={{ width: "120px", height: "120px", borderRadius: "50%" }} />
					</div>
					<div style={{ display: "flex", gap: "8px" }}>
						{[1, 2, 3, 4].map(i => (
							<Pulse key={i} style={{ flex: 1, height: "48px", borderRadius: "10px" }} />
						))}
					</div>
				</div>

				{/* Schedule card */}
				<div style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
					<Pulse style={{ width: "140px", height: "16px", marginBottom: "16px" }} />
					{[1, 2, 3].map(i => (
						<div key={i} style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
							<Pulse style={{ width: "60px", height: "14px" }} />
							<Pulse style={{ flex: 1, height: "14px" }} />
							<Pulse style={{ width: "70px", height: "22px", borderRadius: "20px" }} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
