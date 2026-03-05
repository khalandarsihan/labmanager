import React from "react";

export default function StudentSelector({ students, activeId, onSelect }) {
	if (!students || students.length <= 1) return null;

	return (
		<div
			style={{
				display: "flex",
				gap: "10px",
				overflowX: "auto",
				padding: "0 16px 4px",
				scrollbarWidth: "none",
				WebkitOverflowScrolling: "touch",
			}}
		>
			{students.map((s) => {
				const isActive = s.student_id === activeId;
				return (
					<button
						key={s.student_id}
						onClick={() => onSelect(s.student_id)}
						style={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
							padding: "8px 16px 8px 8px",
							border: `2px solid ${isActive ? "#1B4332" : "#E5E7EB"}`,
							borderRadius: "40px",
							background: isActive ? "#F0FDF4" : "#fff",
							cursor: "pointer",
							whiteSpace: "nowrap",
							flexShrink: 0,
							minHeight: "44px",
							transition: "all 0.2s",
						}}
					>
						{/* Photo or initial */}
						<div
							style={{
								width: "30px",
								height: "30px",
								borderRadius: "50%",
								overflow: "hidden",
								background: "#1B4332",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexShrink: 0,
							}}
						>
							{s.photo_url ? (
								<img
									src={s.photo_url}
									alt={s.student_name}
									style={{ width: "100%", height: "100%", objectFit: "cover" }}
								/>
							) : (
								<span style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>
									{(s.student_name || "?")[0].toUpperCase()}
								</span>
							)}
						</div>

						{/* Name */}
						<span
							style={{
								fontSize: "14px",
								fontWeight: isActive ? 700 : 500,
								color: isActive ? "#1B4332" : "#374151",
							}}
						>
							{s.student_name.split(" ")[0]}
						</span>
					</button>
				);
			})}
		</div>
	);
}
