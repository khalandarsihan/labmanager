import React, { useRef, useEffect, useCallback, useState } from "react";
import jsQR from "jsqr";

const COOLDOWN_MS = 2000;

const QRScanner = ({ onScan }) => {
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const animationRef = useRef(null);
	const lastScanRef = useRef(0);
	const [cameraError, setCameraError] = useState(null);
	const [ready, setReady] = useState(false);
	const [lastDetected, setLastDetected] = useState(null);
	const [manualInput, setManualInput] = useState("");

	const fireScan = useCallback(
		(data) => {
			const now = Date.now();
			if (now - lastScanRef.current > COOLDOWN_MS) {
				lastScanRef.current = now;
				setLastDetected(data);
				onScan(data);
			}
		},
		[onScan]
	);

	const tick = useCallback(() => {
		const video = videoRef.current;
		const canvas = canvasRef.current;
		if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
			animationRef.current = requestAnimationFrame(tick);
			return;
		}

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		const ctx = canvas.getContext("2d");
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		// invertFirst helps detect QR codes displayed on phone/screen
		const code = jsQR(imageData.data, imageData.width, imageData.height, {
			inversionAttempts: "invertFirst",
		});

		if (code && code.data) {
			fireScan(code.data);
		}

		animationRef.current = requestAnimationFrame(tick);
	}, [fireScan]);

	useEffect(() => {
		let stream = null;

		// Try rear camera first; browsers fall back to front on laptops
		const constraints = { video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } } };

		navigator.mediaDevices
			.getUserMedia(constraints)
			.then((s) => {
				stream = s;
				if (videoRef.current) {
					videoRef.current.srcObject = s;
					videoRef.current
						.play()
						.then(() => {
							setReady(true);
							animationRef.current = requestAnimationFrame(tick);
						})
						.catch(() => setCameraError("Could not start camera stream."));
				}
			})
			.catch(() => setCameraError("Camera access denied. Please allow camera permissions."));

		return () => {
			cancelAnimationFrame(animationRef.current);
			if (stream) stream.getTracks().forEach((t) => t.stop());
		};
	}, [tick]);

	const handleManualSubmit = (e) => {
		e.preventDefault();
		const val = manualInput.trim();
		if (val) {
			fireScan(val);
			setManualInput("");
		}
	};

	if (cameraError) {
		return (
			<div className="space-y-3">
				<div className="rounded-lg border border-red-700/50 bg-red-950/30 p-4 text-center text-red-400 text-sm">
					{cameraError}
				</div>
				<ManualInput value={manualInput} onChange={setManualInput} onSubmit={handleManualSubmit} />
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<div className="relative rounded-lg overflow-hidden border border-amber-700/40 bg-black">
				<video ref={videoRef} className="w-full max-h-72 object-cover" playsInline muted />
				<canvas ref={canvasRef} className="hidden" />

				{/* Viewfinder overlay */}
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div className="w-48 h-48 border-2 border-amber-400/70 rounded-lg relative">
						<div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-400 rounded-tl" />
						<div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-400 rounded-tr" />
						<div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-400 rounded-bl" />
						<div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-400 rounded-br" />
					</div>
				</div>

				{/* Status bar */}
				<div className="absolute bottom-2 left-0 right-0 text-center">
					<span className="text-xs bg-gray-950/80 text-amber-300 px-3 py-1 rounded-full">
						{!ready ? "Starting camera…" : lastDetected ? `✓ ${lastDetected}` : "Point camera at student QR code"}
					</span>
				</div>
			</div>

			{/* Manual fallback */}
			<ManualInput value={manualInput} onChange={setManualInput} onSubmit={handleManualSubmit} />
		</div>
	);
};

const ManualInput = ({ value, onChange, onSubmit }) => (
	<form onSubmit={onSubmit} className="flex gap-2">
		<input
			type="text"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder="Type student ID manually (e.g. STUD-001)"
			className="flex-1 rounded-lg bg-gray-900 border border-gray-700 text-amber-100 text-sm px-3 py-2 placeholder-gray-600 focus:outline-none focus:border-amber-600"
		/>
		<button
			type="submit"
			className="rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2"
		>
			Mark
		</button>
	</form>
);

export default QRScanner;
