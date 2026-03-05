import React from "react";

const StarPattern = () => (
	<svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
		<defs>
			<pattern id="star-inv" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
				<polygon points="30,5 35,22 52,22 38,33 43,50 30,39 17,50 22,33 8,22 25,22" fill="white"/>
			</pattern>
		</defs>
		<rect width="100%" height="100%" fill="url(#star-inv)"/>
	</svg>
);

export default function InvalidTokenScreen() {
	return (
		<div
			className="min-h-screen flex flex-col items-center justify-center"
			style={{ background: "linear-gradient(180deg, #F0F7F2 0%, #F9FAFB 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}
		>
			{/* Top banner */}
			<div
				className="w-full relative overflow-hidden flex flex-col items-center pt-16 pb-20"
				style={{ background: "linear-gradient(135deg, #0D2B1D 0%, #1B4332 50%, #166534 100%)" }}
			>
				<StarPattern />

				{/* Decorative orb */}
				<div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }} />

				<div className="relative z-10 flex flex-col items-center">
					{/* Lock icon */}
					<div
						className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
						style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)" }}
					>
						<span style={{ fontSize: "40px" }}>🔒</span>
					</div>

					{/* Brand */}
					<div className="flex items-center gap-2 mb-2">
						<span style={{ fontSize: "16px" }}>🌙</span>
						<span className="text-xs font-bold tracking-widest" style={{ color: "rgba(212,175,55,0.9)" }}>TECHETHICA</span>
					</div>
				</div>

				{/* Wave */}
				<svg className="absolute bottom-0 left-0 w-full" style={{ height: "48px" }} viewBox="0 0 375 48" preserveAspectRatio="none">
					<path d="M0,48 L0,20 Q60,48 120,28 Q180,8 240,30 Q300,52 375,20 L375,48 Z" fill="#F0F7F2"/>
				</svg>
			</div>

			{/* Card */}
			<div className="px-5 -mt-8 w-full max-w-sm">
				<div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 8px 32px rgba(27,67,50,0.15)" }}>
					{/* Gold bar */}
					<div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #D4AF37, #F0D060, #D4AF37)" }} />

					<div className="p-6 text-center">
						<h1 className="text-xl font-black mb-3" style={{ color: "#111827" }}>
							Link Not Recognised
						</h1>
						<p className="text-sm leading-relaxed mb-6" style={{ color: "#6B7280" }}>
							This portal link is invalid or has been reset.
							Please contact TechEthica to receive a new link via WhatsApp.
						</p>

						{/* Contact info box */}
						<div className="rounded-2xl p-4 text-left" style={{ background: "linear-gradient(135deg, #F0F7F2, #DCFCE7)" }}>
							<div className="flex items-start gap-3">
								<span className="text-xl">📲</span>
								<div>
									<div className="text-sm font-bold" style={{ color: "#1B4332" }}>How to get your link</div>
									<div className="text-xs mt-1" style={{ color: "#166534" }}>
										Contact TechEthica administration and request a new parent portal link. It will be sent to your registered WhatsApp number.
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<p className="mt-8 text-xs font-medium" style={{ color: "#9CA3AF" }}>
				TechEthica Parent Portal · Secure Access
			</p>
		</div>
	);
}
