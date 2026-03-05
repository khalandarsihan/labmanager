import React, { useEffect, useState } from "react";
import TokenGate from "./components/TokenGate";
import InvalidTokenScreen from "./components/InvalidTokenScreen";

const LOCAL_KEY = "te_portal_token";

export default function ParentPortal() {
	const [token, setToken] = useState(null);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		// 1. Read token from URL ?token=...
		const params = new URLSearchParams(window.location.search);
		const urlToken = params.get("token");

		if (urlToken) {
			// Save permanently to localStorage
			try { localStorage.setItem(LOCAL_KEY, urlToken); } catch {}
			// Clean URL — remove token from address bar
			window.history.replaceState({}, "", window.location.pathname);
			setToken(urlToken);
		} else {
			// 2. Fall back to localStorage
			let stored = null;
			try { stored = localStorage.getItem(LOCAL_KEY); } catch {}
			setToken(stored);
		}

		setReady(true);
	}, []);

	if (!ready) return null;
	if (!token) return <InvalidTokenScreen />;

	return <TokenGate token={token} />;
}
