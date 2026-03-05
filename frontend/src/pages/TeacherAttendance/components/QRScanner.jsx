import React, { useRef, useEffect, useState } from "react";
import jsQR from "jsqr";
import { useTheme } from "../../../components/ui/ThemeContext";

const COOLDOWN_MS = 2000;

const QRScanner = ({ onScan }) => {
	const { useLightTheme, themeStyles } = useTheme();
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const animationRef = useRef(null);
	const lastScanRef = useRef(0);
	const detectorRef = useRef(null);
	const scanningRef = useRef(false);
	// Keep onScan always current without it being a dep of the camera effect
	const onScanRef = useRef(onScan);
	useEffect(() => { onScanRef.current = onScan; });

	const [cameraError, setCameraError] = useState(null);
	const [ready, setReady] = useState(false);
	const [lastDetected, setLastDetected] = useState(null);
	const [manualInput, setManualInput] = useState("");
	const [engine, setEngine] = useState("");

	// Initialise detector once
	useEffect(() => {
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

	// Camera lifecycle — runs once on mount, never restarts due to parent re-renders
	useEffect(() => {
		let stream = null;
		let cancelled = false;

		const fireScan = (data) => {
			const now = Date.now();
			if (now - lastScanRef.current > COOLDOWN_MS) {
				lastScanRef.current = now;
				setLastDetected(data);
				onScanRef.current(data);
			}
		};

		const tick = () => {
			if (cancelled) return;
			const video = videoRef.current;
			const canvas = canvasRef.current;
			if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
				animationRef.current = requestAnimationFrame(tick);
				return;
			}

			if (detectorRef.current) {
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
		};

		navigator.mediaDevices
			.getUserMedia({
				video: {
					facingMode: { ideal: "environment" },
					width: { ideal: 1280 },
					height: { ideal: 720 },
				},
			})
			.then((s) => {
				if (cancelled) { s.getTracks().forEach((t) => t.stop()); return; }
				stream = s;
				if (videoRef.current) {
					videoRef.current.muted = true;
					videoRef.current.srcObject = s;
					videoRef.current
						.play()
						.then(() => {
							if (!cancelled) {
								setReady(true);
								animationRef.current = requestAnimationFrame(tick);
							}
						})
						.catch(() => { if (!cancelled) setCameraError("Could not start camera stream."); });
				}
			})
			.catch(() => { if (!cancelled) setCameraError("Camera access denied. Please allow camera permissions."); });

		return () => {
			cancelled = true;
			cancelAnimationFrame(animationRef.current);
			if (stream) stream.getTracks().forEach((t) => t.stop());
		};
	}, []); // empty deps — camera starts once and stays running

	const handleManualSubmit = (e) => {
		e.preventDefault();
		const val = manualInput.trim();
		if (val) {
			const now = Date.now();
			lastScanRef.current = now;
			setLastDetected(val);
			onScanRef.current(val);
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
			<div className={`relative rounded-lg overflow-hidden border ${accentColor} bg-black`}>
				<video ref={videoRef} className="w-full max-h-72 object-cover" playsInline muted />
				<canvas ref={canvasRef} className="hidden" />

				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div className="w-48 h-48 relative">
						<div className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 ${cornerColor} rounded-tl`} />
						<div className={`absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 ${cornerColor} rounded-tr`} />
						<div className={`absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 ${cornerColor} rounded-bl`} />
						<div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 ${cornerColor} rounded-br`} />
					</div>
				</div>

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
