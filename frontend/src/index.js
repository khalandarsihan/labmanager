import React from "react";
import { createRoot } from "react-dom/client";
import { FrappeProvider } from "frappe-react-sdk";
import CourseDetails from "./pages/CourseDetails";

// Get the container element
const container = document.getElementById("react-root");

if (!container) {
	console.error("Could not find root element with id 'react-root'");
} else {
	const root = createRoot(container);

	// Get courseCode from window object or URL parameters
	const courseCode =
		window.courseCode || new URLSearchParams(window.location.search).get("name");

	if (!courseCode) {
		console.error("No course code provided");
		root.render(<div className="text-red-500 p-4">Error: No course code provided</div>);
	} else {
		root.render(
			<React.StrictMode>
				<FrappeProvider socketPort={window.socketPort}>
					<CourseDetails courseCode={courseCode} />
				</FrappeProvider>
			</React.StrictMode>
		);
	}
}
