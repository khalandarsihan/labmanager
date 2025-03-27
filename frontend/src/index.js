// import React from "react";
// import { createRoot } from "react-dom/client";
// import { FrappeProvider } from "frappe-react-sdk";
// import CourseDetails from "./pages/CourseDetails";

// // Get the container element
// const container = document.getElementById("react-root");

// if (!container) {
// 	console.error("Could not find root element with id 'react-root'");
// } else {
// 	const root = createRoot(container);

// 	// Get courseCode from window object or URL parameters
// 	const courseCode =
// 		window.courseCode || new URLSearchParams(window.location.search).get("name");

// 	if (!courseCode) {
// 		console.error("No course code provided");
// 		root.render(<div className="text-red-500 p-4">Error: No course code provided</div>);
// 	} else {
// 		root.render(
// 			<React.StrictMode>
// 				<FrappeProvider socketPort={window.socketPort}>
// 					<CourseDetails courseCode={courseCode} />
// 				</FrappeProvider>
// 			</React.StrictMode>
// 		);
// 	}
// }
// import React from "react";
// import { createRoot } from "react-dom/client";
// import { FrappeProvider } from "frappe-react-sdk";
// import CourseDetails from "./pages/CourseDetails";
// import StudentEnrollment from "./pages/StudentEnrollment";

// // Function to render with FrappeProvider wrapper
// const renderWithProvider = (component, container) => {
// 	const root = createRoot(container);
// 	root.render(
// 		<React.StrictMode>
// 			<FrappeProvider socketPort={window.socketPort}>{component}</FrappeProvider>
// 		</React.StrictMode>
// 	);
// };

// // Course Details Page
// const courseContainer = document.getElementById("react-root");
// if (courseContainer) {
// 	const courseCode =
// 		window.courseCode || new URLSearchParams(window.location.search).get("name");
// 	if (!courseCode) {
// 		const root = createRoot(courseContainer);
// 		root.render(<div className="text-red-500 p-4">Error: No course code provided</div>);
// 	} else {
// 		renderWithProvider(<CourseDetails courseCode={courseCode} />, courseContainer);
// 	}
// }

// // Student Enrollment Page
// const enrollmentContainer = document.getElementById("enrollment-root");
// if (enrollmentContainer) {
// 	renderWithProvider(<StudentEnrollment />, enrollmentContainer);
// }

// import React from "react";
// import { createRoot } from "react-dom/client";
// import { FrappeProvider } from "frappe-react-sdk";
// import CourseDetails from "./pages/CourseDetails";
// import StudentEnrollment from "./pages/StudentEnrollment";
// import RegistrationDetails from "./pages/StudentEnrollment/RegistrationDetails";

// // Function to render with FrappeProvider wrapper
// const renderWithProvider = (component, container) => {
// 	const root = createRoot(container);
// 	root.render(
// 		<React.StrictMode>
// 			<FrappeProvider socketPort={window.socketPort}>{component}</FrappeProvider>
// 		</React.StrictMode>
// 	);
// };

// // Course Details Page
// const courseContainer = document.getElementById("react-root");
// if (courseContainer) {
// 	const courseCode =
// 		window.courseCode || new URLSearchParams(window.location.search).get("name");
// 	if (!courseCode) {
// 		const root = createRoot(courseContainer);
// 		root.render(<div className="text-red-500 p-4">Error: No course code provided</div>);
// 	} else {
// 		renderWithProvider(<CourseDetails courseCode={courseCode} />, courseContainer);
// 	}
// }

// // Student Enrollment Page (New Registration)
// const enrollmentContainer = document.getElementById("enrollment-root");
// if (enrollmentContainer) {
// 	// Check if this is a registration details page
// 	const registrationDataElement = document.getElementById("registration-data");
// 	if (registrationDataElement) {
// 		const registrationId = registrationDataElement.dataset.registration;
// 		renderWithProvider(
// 			<RegistrationDetails registrationId={registrationId} />,
// 			enrollmentContainer
// 		);
// 	} else {
// 		// This is the new registration page
// 		renderWithProvider(<StudentEnrollment />, enrollmentContainer);
// 	}
// }

// import React from "react";
// import { createRoot } from "react-dom/client";
// import { FrappeProvider } from "frappe-react-sdk";
// import CourseDetails from "./pages/CourseDetails";
// import StudentEnrollment from "./pages/StudentEnrollment";
// import RegistrationDetails from "./pages/StudentEnrollment/RegistrationDetails";
// import AppWrapper from "./components/AppWrapper";

// // Function to render with FrappeProvider wrapper
// const renderWithProvider = (component, container) => {
// 	const root = createRoot(container);
// 	root.render(
// 		<React.StrictMode>
// 			<FrappeProvider socketPort={window.socketPort}>
// 				<AppWrapper>{component}</AppWrapper>
// 			</FrappeProvider>
// 		</React.StrictMode>
// 	);
// };

// // Course Details Page
// const courseContainer = document.getElementById("react-root");
// if (courseContainer) {
// 	const courseCode =
// 		window.courseCode || new URLSearchParams(window.location.search).get("name");
// 	if (!courseCode) {
// 		const root = createRoot(courseContainer);
// 		root.render(<div className="text-red-500 p-4">Error: No course code provided</div>);
// 	} else {
// 		renderWithProvider(<CourseDetails courseCode={courseCode} />, courseContainer);
// 	}
// }

// // Student Enrollment Page (New Registration)
// const enrollmentContainer = document.getElementById("enrollment-root");
// if (enrollmentContainer) {
// 	// Check if this is a registration details page
// 	const registrationDataElement = document.getElementById("registration-data");
// 	if (registrationDataElement) {
// 		const registrationId = registrationDataElement.dataset.registration;
// 		renderWithProvider(
// 			<RegistrationDetails registrationId={registrationId} />,
// 			enrollmentContainer
// 		);
// 	} else {
// 		// This is the new registration page
// 		renderWithProvider(<StudentEnrollment />, enrollmentContainer);
// 	}
// }

// import React from "react";
// import { createRoot } from "react-dom/client";
// import { FrappeProvider } from "frappe-react-sdk";
// import CourseDetails from "./pages/CourseDetails";
// import StudentEnrollment from "./pages/StudentEnrollment";
// import RegistrationDetails from "./pages/StudentEnrollment/RegistrationDetails";
// import HomePage from "./pages/Home";
// import AppWrapper from "./components/AppWrapper";

// // Function to render with FrappeProvider wrapper
// const renderWithProvider = (component, container) => {
// 	const root = createRoot(container);
// 	root.render(
// 		<React.StrictMode>
// 			<FrappeProvider socketPort={window.socketPort}>
// 				<AppWrapper>{component}</AppWrapper>
// 			</FrappeProvider>
// 		</React.StrictMode>
// 	);
// };

// // Home Page
// const homeContainer = document.getElementById("home-root");
// if (homeContainer) {
// 	renderWithProvider(<HomePage />, homeContainer);
// }

// // Course Details Page
// const courseContainer = document.getElementById("react-root");
// if (courseContainer) {
// 	const courseCode =
// 		window.courseCode || new URLSearchParams(window.location.search).get("name");
// 	if (!courseCode) {
// 		const root = createRoot(courseContainer);
// 		root.render(<div className="text-red-500 p-4">Error: No course code provided</div>);
// 	} else {
// 		renderWithProvider(<CourseDetails courseCode={courseCode} />, courseContainer);
// 	}
// }

// // Student Enrollment Page (New Registration)
// const enrollmentContainer = document.getElementById("enrollment-root");
// if (enrollmentContainer) {
// 	// Check if this is a registration details page
// 	const registrationDataElement = document.getElementById("registration-data");
// 	if (registrationDataElement) {
// 		const registrationId = registrationDataElement.dataset.registration;
// 		renderWithProvider(
// 			<RegistrationDetails registrationId={registrationId} />,
// 			enrollmentContainer
// 		);
// 	} else {
// 		// This is the new registration page
// 		renderWithProvider(<StudentEnrollment />, enrollmentContainer);
// 	}
// }

// // src/index.js
// import React from "react";
// import { createRoot } from "react-dom/client";
// import { FrappeProvider } from "frappe-react-sdk";
// import CourseDetails from "./pages/CourseDetails";
// import StudentEnrollment from "./pages/StudentEnrollment";
// import RegistrationDetails from "./pages/StudentEnrollment/RegistrationDetails";
// import StudentDashboardPage from "./pages/StudentDashboard";
// import HomePage from "./pages/Home";
// import CourseCatalog from "./pages/CourseCatalog";
// import AppWrapper from "./components/AppWrapper";

// // Function to render with FrappeProvider wrapper
// const renderWithProvider = (component, container) => {
// 	const root = createRoot(container);
// 	root.render(
// 		<React.StrictMode>
// 			<FrappeProvider socketPort={window.socketPort}>
// 				<AppWrapper>{component}</AppWrapper>
// 			</FrappeProvider>
// 		</React.StrictMode>
// 	);
// };

// // Home Page
// const homeContainer = document.getElementById("home-root");
// if (homeContainer) {
// 	renderWithProvider(<HomePage />, homeContainer);
// }

// // Course Catalog Page
// const catalogContainer = document.getElementById("catalog-root");
// if (catalogContainer) {
// 	renderWithProvider(<CourseCatalog />, catalogContainer);
// }

// // Course Details Page
// const courseContainer = document.getElementById("react-root");
// if (courseContainer) {
// 	const courseCode =
// 		window.courseCode || new URLSearchParams(window.location.search).get("name");
// 	if (!courseCode) {
// 		const root = createRoot(courseContainer);
// 		root.render(<div className="text-red-500 p-4">Error: No course code provided</div>);
// 	} else {
// 		renderWithProvider(<CourseDetails courseCode={courseCode} />, courseContainer);
// 	}
// }

// // Student Enrollment Page (New Registration)
// const enrollmentContainer = document.getElementById("enrollment-root");
// if (enrollmentContainer) {
// 	// Check if this is a registration details page
// 	const registrationDataElement = document.getElementById("registration-data");
// 	if (registrationDataElement) {
// 		const registrationId = registrationDataElement.dataset.registration;
// 		renderWithProvider(
// 			<RegistrationDetails registrationId={registrationId} />,
// 			enrollmentContainer
// 		);
// 	} else {
// 		// This is the new registration page
// 		renderWithProvider(<StudentEnrollment />, enrollmentContainer);
// 	}
// }

// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import { FrappeProvider } from "frappe-react-sdk";
import CourseDetails from "./pages/CourseDetails";
import StudentEnrollment from "./pages/StudentEnrollment";
import RegistrationDetails from "./pages/StudentEnrollment/RegistrationDetails";
import StudentDashboardPage from "./pages/StudentDashboard";
import HomePage from "./pages/Home";
import CourseCatalog from "./pages/CourseCatalog";
import AcademicCalendarPage from "./pages/AcademicCalendar"; // Import the new page
import AppWrapper from "./components/AppWrapper";

// Function to render with FrappeProvider wrapper
const renderWithProvider = (component, container) => {
	const root = createRoot(container);
	root.render(
		<React.StrictMode>
			<FrappeProvider socketPort={window.socketPort}>
				<AppWrapper>{component}</AppWrapper>
			</FrappeProvider>
		</React.StrictMode>
	);
};

// Home Page
const homeContainer = document.getElementById("home-root");
if (homeContainer) {
	renderWithProvider(<HomePage />, homeContainer);
}

// Course Catalog Page
const catalogContainer = document.getElementById("catalog-root");
if (catalogContainer) {
	renderWithProvider(<CourseCatalog />, catalogContainer);
}

// Course Details Page
const courseContainer = document.getElementById("react-root");
if (courseContainer) {
	const courseCode =
		window.courseCode || new URLSearchParams(window.location.search).get("name");
	if (!courseCode) {
		const root = createRoot(courseContainer);
		root.render(<div className="text-red-500 p-4">Error: No course code provided</div>);
	} else {
		renderWithProvider(<CourseDetails courseCode={courseCode} />, courseContainer);
	}
}

// Academic Calendar Page
const academicCalendarContainer = document.getElementById("academic-calendar-root");
if (academicCalendarContainer) {
	renderWithProvider(<AcademicCalendarPage />, academicCalendarContainer);
}

// Student Enrollment Page (New Registration)
const enrollmentContainer = document.getElementById("enrollment-root");
if (enrollmentContainer) {
	// Check if this is a registration details page
	const registrationDataElement = document.getElementById("registration-data");
	if (registrationDataElement) {
		const registrationId = registrationDataElement.dataset.registration;
		renderWithProvider(
			<RegistrationDetails registrationId={registrationId} />,
			enrollmentContainer
		);
	} else {
		// This is the new registration page
		renderWithProvider(<StudentEnrollment />, enrollmentContainer);
	}
}

// Student Dashboard Page
const dashboardContainer = document.getElementById("student-dashboard-app");
if (dashboardContainer) {
	renderWithProvider(<StudentDashboardPage />, dashboardContainer);
}
