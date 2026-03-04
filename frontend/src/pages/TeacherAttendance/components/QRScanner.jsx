import React, { useRef, useEffect, useCallback, useState } from "react";
import jsQR from "jsqr";
import { useTheme } from "../../../components/ui/ThemeContext";

const COOLDOWN_MS = 2000;

const QRScanner = ({ onScan }) => {
	const { useLightTheme, themeStyles } = useTheme();
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const animationRef = useRef(null);
	const lastScanRef = useRef(0);
	const detectorRef = useRef(null); // native BarcodeDetector if available
	const scanningRef = useRef(false); // prevent concurrent async detections
	const [cameraError, setCameraError] = useState(null);
	const [ready, setReady] = useState(false);
	const [lastDetected, setLastDetected] = useState(null);
	const [manualInput, setManualInput] = useState("");
	const [engine, setEngine] = useState(""); // "native" | "jsqr"

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
		if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
			animationRef.current = requestAnimationFrame(tick);
			return;
		}

		if (detectorRef.current) {
			// Native BarcodeDetector (Chrome / Chromium — best detection)
			if (!scanningRef.current) {
				scanningRef.current = true;
				detectorRef.current
					.detect(video)
					.then((codes) => {
						if (codes.length > 0) fireScan(codes[0].rawValue);
					})
					.catch(() => {})
					.finally(() => { scanningRef.current = false; });
			}
		} else if (canvas) {
			// jsQR fallback (Firefox / older browsers)
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			const ctx = canvas.getContext("2d");
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			const code = jsQR(imageData.data, imageData.width, imageData.height, {
				inversionAttempts: "invertFirst",
			});
			if (code && code.data) fireScan(code.data);
		}

		animationRef.current = requestAnimationFrame(tick);
	}, [fireScan]);

	useEffect(() => {
		// Initialise the best available detector
		if ("BarcodeDetector" in window) {
			BarcodeDetector.getSupportedFormats().then((formats) => {
				if (formats.includes("qr_code")) {
					detectorRef.current = new BarcodeDetector({ formats: ["qr_code"] });
					setEngine("native");
				} else {
					setEngine("jsqr");
				}
			});
		} else {
			setEngine("jsqr");
		}
	}, []);

	useEffect(() => {
		let stream = null;

		navigator.mediaDevices
			.getUserMedia({
				video: {
					facingMode: { ideal: "environment" },
					width: { ideal: 1280 },
					height: { ideal: 720 },
				},
			})
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

	const accentColor = useLightTheme ? "border-purple-400" : "border-amber-400";
	const cornerColor = useLightTheme ? "border-purple-500" : "border-amber-400";

	if (cameraError) {
		return (
			<div className="space-y-3">
				<div className={`rounded-lg border p-4 text-center text-sm ${
					useLightTheme
						? "border-red-300 bg-red-50 text-red-600"
						: "border-red-700/50 bg-red-950/30 text-red-400"
				}`}>
					{cameraError}
				</div>
				<ManualInput
					value={manualInput}
					onChange={setManualInput}
					onSubmit={handleManualSubmit}
					useLightTheme={useLightTheme}
					themeStyles={themeStyles}
				/>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{/* Camera viewport — always dark for contrast */}
			<div className={`relative rounded-lg overflow-hidden border ${accentColor} bg-black`}>
				<video ref={videoRef} className="w-full max-h-72 object-cover" playsInline muted />
				<canvas ref={canvasRef} className="hidden" />

				{/* Viewfinder corners */}
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div className="w-48 h-48 relative">
						<div className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 ${cornerColor} rounded-tl`} />
						<div className={`absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 ${cornerColor} rounded-tr`} />
						<div className={`absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 ${cornerColor} rounded-bl`} />
						<div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 ${cornerColor} rounded-br`} />
					</div>
				</div>

				{/* Status bar — always on dark camera bg */}
				<div className="absolute bottom-2 left-0 right-0 text-center space-y-1">
					<div>
						<span className={`text-xs px-3 py-1 rounded-full bg-gray-950/80 ${
							useLightTheme ? "text-purple-300" : "text-amber-300"
						}`}>
							{!ready
								? "Starting camera…"
								: lastDetected
								? `✓ ${lastDetected}`
								: "Point camera at student QR code"}
						</span>
					</div>
					{engine && (
						<div>
							<span className="text-xs text-gray-500">
								{engine === "native" ? "● Native scanner" : "● jsQR fallback"}
							</span>
						</div>
					)}
				</div>
			</div>

			{/* Manual fallback — always visible */}
			<ManualInput
				value={manualInput}
				onChange={setManualInput}
				onSubmit={handleManualSubmit}
				useLightTheme={useLightTheme}
				themeStyles={themeStyles}
			/>
		</div>
	);
};

const ManualInput = ({ value, onChange, onSubmit, useLightTheme, themeStyles }) => (
	<form onSubmit={onSubmit} className="flex gap-2">
		<input
			type="text"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder="Type student ID manually (e.g. STUD-001)"
			className={`flex-1 rounded-lg border text-sm px-3 py-2 focus:outline-none ${
				useLightTheme
					? "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-purple-500"
					: "bg-gray-900 border-gray-700 text-amber-100 placeholder-gray-600 focus:border-amber-600"
			}`}
		/>
		<button
			type="submit"
			className={`rounded-lg text-sm font-medium px-4 py-2 transition-colors ${
				useLightTheme
					? "bg-purple-600 hover:bg-purple-700 text-white"
					: "bg-amber-700 hover:bg-amber-600 text-white"
			}`}
		>
			Mark
		</button>
	</form>
);

export default QRScanner;
