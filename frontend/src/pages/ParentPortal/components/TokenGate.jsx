import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import InvalidTokenScreen from "./InvalidTokenScreen";
import LoadingSkeleton from "./LoadingSkeleton";

async function verifyToken(token) {
	const res = await fetch("/api/method/labmanager.portal.api.verify_portal_token", {
		method: "POST",
		headers: { "Content-Type": "application/json", "X-Frappe-CSRF-Token": "fetch" },
		body: JSON.stringify({ token }),
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	const data = await res.json();
	return data.message;
}

export default function TokenGate({ token }) {
	const [state, setState] = useState("loading"); // loading | invalid | authenticated
	const [portalData, setPortalData] = useState(null);

	useEffect(() => {
		if (!token) {
			setState("invalid");
			return;
		}

		let cancelled = false;
		verifyToken(token)
			.then((result) => {
				if (cancelled) return;
				if (result && result.valid) {
					setPortalData(result);
					setState("authenticated");
				} else {
					// Invalid token — clear from localStorage
					try { localStorage.removeItem("te_portal_token"); } catch {}
					setState("invalid");
				}
			})
			.catch(() => {
				if (!cancelled) setState("invalid");
			});

		return () => { cancelled = true; };
	}, [token]);

	if (state === "loading")       return <LoadingSkeleton />;
	if (state === "invalid")       return <InvalidTokenScreen />;
	if (state === "authenticated") return (
		<Dashboard
			token={token}
			students={portalData.students}
			parentName={portalData.parent_name}
		/>
	);

	return null;
}
