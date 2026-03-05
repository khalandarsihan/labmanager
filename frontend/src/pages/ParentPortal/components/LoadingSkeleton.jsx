import React from "react";

const Pulse = ({ className = "", style = {} }) => (
	<div
		className={`animate-pulse rounded-xl ${className}`}
		style={{ background: "#E5E7EB", ...style }}
	/>
);

export default function LoadingSkeleton() {
	return (
		<div
			className="min-h-screen pb-24"
			style={{ background: "linear-gradient(180deg, #F0F7F2 0%, #F9FAFB 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}
		>
			{/* Header skeleton */}
			<div
				className="relative overflow-hidden"
				style={{ background: "linear-gradient(135deg, #0D2B1D 0%, #1B4332 50%, #166534 100%)", paddingBottom: "56px" }}
			>
				<div className="relative px-5 pt-10 pb-2">
					<Pulse style={{ width: "100px", height: "12px", background: "rgba(255,255,255,0.15)", marginBottom: "10px" }} />
					<Pulse style={{ width: "180px", height: "24px", background: "rgba(255,255,255,0.15)", marginBottom: "18px" }} />
					<div className="flex gap-3">
						<Pulse style={{ width: "90px", height: "38px", borderRadius: "12px", background: "rgba(255,255,255,0.1)" }} />
						<Pulse style={{ width: "80px", height: "38px", borderRadius: "12px", background: "rgba(255,255,255,0.1)" }} />
					</div>
				</div>
				<svg className="absolute bottom-0 left-0 w-full" style={{ height: "48px" }} viewBox="0 0 375 48" preserveAspectRatio="none">
					<path d="M0,48 L0,20 Q60,48 120,28 Q180,8 240,30 Q300,52 375,20 L375,48 Z" fill="#F0F7F2"/>
				</svg>
			</div>

			{/* Student card skeleton */}
			<div className="px-4 -mt-3 mb-4">
				<div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 8px 32px rgba(27,67,50,0.12)" }}>
					<div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #D4AF37, #F0D060, #D4AF37)" }} />
					<div className="p-4 flex items-center gap-4">
						<Pulse style={{ width: "64px", height: "64px", borderRadius: "16px", flexShrink: 0 }} />
						<div className="flex-1">
							<Pulse style={{ width: "140px", height: "16px", marginBottom: "8px" }} />
							<Pulse style={{ width: "90px", height: "22px", borderRadius: "20px" }} />
						</div>
						<Pulse style={{ width: "44px", height: "44px", borderRadius: "50%", flexShrink: 0 }} />
					</div>
				</div>
			</div>

			{/* Content skeletons */}
			<div className="px-4 space-y-4">
				{/* Schedule card skeleton */}
				<div className="rounded-3xl overflow-hidden bg-white" style={{ boxShadow: "0 8px 32px rgba(27,67,50,0.08)" }}>
					<div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #D4AF37, #F0D060, #D4AF37)" }} />
					<div className="p-5">
						<Pulse style={{ width: "130px", height: "16px", marginBottom: "20px" }} />
						<div className="space-y-3 pl-10 relative">
							<div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ background: "#F3F4F6" }} />
							{[1, 2, 3].map(i => (
								<div key={i} className="relative flex gap-3">
									<Pulse style={{ position: "absolute", left: "-28px", top: "8px", width: "16px", height: "16px", borderRadius: "50%", background: "#E5E7EB" }} />
									<Pulse style={{ width: "52px", height: "36px", flexShrink: 0 }} />
									<Pulse style={{ flex: 1, height: "36px" }} />
									<Pulse style={{ width: "48px", height: "24px", borderRadius: "20px", flexShrink: 0 }} />
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Attendance card skeleton */}
				<div className="rounded-3xl overflow-hidden bg-white" style={{ boxShadow: "0 8px 32px rgba(27,67,50,0.08)" }}>
					<div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #D4AF37, #F0D060, #D4AF37)" }} />
					<div className="p-5">
						<Pulse style={{ width: "110px", height: "16px", marginBottom: "20px" }} />
						<div className="flex justify-center mb-5">
							<Pulse style={{ width: "148px", height: "148px", borderRadius: "50%" }} />
						</div>
						<div className="flex gap-2 mb-5">
							{[1, 2, 3, 4].map(i => <Pulse key={i} style={{ flex: 1, height: "64px", borderRadius: "16px" }} />)}
						</div>
						<div className="flex gap-1.5">
							{[1, 2, 3, 4, 5, 6, 7].map(i => <Pulse key={i} style={{ flex: 1, height: "42px", borderRadius: "12px" }} />)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
