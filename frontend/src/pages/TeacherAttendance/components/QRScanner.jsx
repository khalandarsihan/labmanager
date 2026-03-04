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
		const code = jsQR(imageData.data, imageData.width, imageData.height);

		if (code && code.data) {
			const now = Date.now();
			if (now - lastScanRef.current > COOLDOWN_MS) {
				lastScanRef.current = now;
				onScan(code.data);
			}
		}

		animationRef.current = requestAnimationFrame(tick);
	}, [onScan]);

	useEffect(() => {
		let stream = null;

		navigator.mediaDevices
			.getUserMedia({ video: { facingMode: "environment" } })
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

	if (cameraError) {
		return (
			<div className="rounded-lg border border-red-700/50 bg-red-950/30 p-6 text-center text-red-400 text-sm">
				{cameraError}
			</div>
		);
	}

	return (
		<div className="relative rounded-lg overflow-hidden border border-amber-700/40 bg-black">
			<video ref={videoRef} className="w-full max-h-64 object-cover" playsInline muted />
			<canvas ref={canvasRef} className="hidden" />

			{/* Viewfinder overlay */}
			<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
				<div className="w-44 h-44 border-2 border-amber-400/70 rounded-lg">
					<div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-amber-400 rounded-tl" />
					<div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-amber-400 rounded-tr" />
					<div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-amber-400 rounded-bl" />
					<div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-amber-400 rounded-br" />
				</div>
			</div>

			<div className="absolute bottom-2 left-0 right-0 text-center">
				<span className="text-xs bg-gray-950/80 text-amber-300 px-3 py-1 rounded-full">
					{ready ? "Point camera at student QR code" : "Starting camera…"}
				</span>
			</div>
		</div>
	);
};

export default QRScanner;
