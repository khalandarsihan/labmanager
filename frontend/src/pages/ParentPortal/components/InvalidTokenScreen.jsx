import React from "react";

export default function InvalidTokenScreen() {
	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				background: "#F9FAFB",
				padding: "24px",
				textAlign: "center",
				fontFamily: "system-ui, -apple-system, sans-serif",
			}}
		>
			{/* Logo area */}
			<div style={{ marginBottom: "24px" }}>
				<div
					style={{
						width: "72px",
						height: "72px",
						borderRadius: "50%",
						background: "#1B4332",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						margin: "0 auto 12px",
					}}
				>
					<span style={{ fontSize: "36px" }}>🔒</span>
				</div>
				<div style={{ fontSize: "13px", color: "#6B7280", fontWeight: 600, letterSpacing: "0.08em" }}>
					TECHETHICA
				</div>
			</div>

			{/* Message */}
			<h1
				style={{
					fontSize: "22px",
					fontWeight: "700",
					color: "#111827",
					margin: "0 0 16px",
				}}
			>
				Link Not Recognised
			</h1>
			<p
				style={{
					fontSize: "15px",
					color: "#6B7280",
					lineHeight: "1.6",
					maxWidth: "320px",
					margin: "0 auto",
				}}
			>
				This portal link is invalid or has been reset. Please contact TechEthica to receive
				a new link on WhatsApp.
			</p>
		</div>
	);
}
