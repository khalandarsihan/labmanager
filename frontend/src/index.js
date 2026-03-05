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
// import React from "react";
// import { createRoot } from "react-dom/client";
// import { FrappeProvider } from "frappe-react-sdk";
// import AboutUsPage from "./pages/AboutUs";
// import CourseDetails from "./pages/CourseDetails";
// import StudentEnrollment from "./pages/StudentEnrollment";
// import RegistrationDetails from "./pages/StudentEnrollment/RegistrationDetails";
// import StudentDashboardPage from "./pages/StudentDashboard";
// import HomePage from "./pages/Home";
// import CourseCatalog from "./pages/CourseCatalog";
// import AcademicCalendarPage from "./pages/AcademicCalendar";
// import ClassSchedulePage from "./pages/ClassSchedule";
// import ExamDatesPage from "./pages/ExamDates";
// import TrackApplication from "./pages/TrackApplication";
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

// // Track Application Page
// const trackApplicationContainer = document.getElementById("track-application-root");
// if (trackApplicationContainer) {
// 	// Extract registrationId from URL if present
// 	const urlParams = new URLSearchParams(window.location.search);
// 	const registrationId = urlParams.get("id");

// 	renderWithProvider(
// 		<TrackApplication initialRegistrationId={registrationId} />,
// 		trackApplicationContainer
// 	);
// }

// // Home Page
// const homeContainer = document.getElementById("home-root");
// if (homeContainer) {
// 	renderWithProvider(<HomePage />, homeContainer);
// }

// // About Us Page
// const aboutUsContainer = document.getElementById("about-us-root");
// if (aboutUsContainer) {
// 	renderWithProvider(<AboutUsPage />, aboutUsContainer);
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

// // Academic Calendar Page
// const academicCalendarContainer = document.getElementById("academic-calendar-root");
// if (academicCalendarContainer) {
// 	renderWithProvider(<AcademicCalendarPage />, academicCalendarContainer);
// }

// // Class Schedule Page
// const classScheduleContainer = document.getElementById("class-schedule-root");
// if (classScheduleContainer) {
// 	renderWithProvider(<ClassSchedulePage />, classScheduleContainer);
// }

// // Exam Dates Page
// const examDatesContainer = document.getElementById("exam-dates-root");
// console.log("Looking for exam-dates-root element:", examDatesContainer);
// if (examDatesContainer) {
// 	console.log("Mounting ExamDatesPage component");
// 	renderWithProvider(<ExamDatesPage />, examDatesContainer);
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

// // Student Dashboard Page
// const dashboardContainer = document.getElementById("student-dashboard-app");
// if (dashboardContainer) {
// 	renderWithProvider(<StudentDashboardPage />, dashboardContainer);
// }

// src/index.js
// import React from "react";
// import { createRoot } from "react-dom/client";
// import { FrappeProvider } from "frappe-react-sdk";
// import AboutUsPage from "./pages/AboutUs";
// import CourseDetails from "./pages/CourseDetails";
// import StudentEnrollment from "./pages/StudentEnrollment";
// import RegistrationDetails from "./pages/StudentEnrollment/RegistrationDetails";
// import StudentDashboardPage from "./pages/StudentDashboard";
// import HomePage from "./pages/Home";
// import CourseCatalog from "./pages/CourseCatalog";
// import AcademicCalendarPage from "./pages/AcademicCalendar";
// import ClassSchedulePage from "./pages/ClassSchedule";
// import ExamDatesPage from "./pages/ExamDates";
// import TrackApplication from "./pages/TrackApplication";
// import StudentLifePage from "./pages/StudentLife";
// import ContactPage from "./pages/ContactPage";
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

// // Track Application Page
// const trackApplicationContainer = document.getElementById("track-application-root");
// if (trackApplicationContainer) {
// 	// Extract registrationId from URL if present
// 	const urlParams = new URLSearchParams(window.location.search);
// 	const registrationId = urlParams.get("id");

// 	renderWithProvider(
// 		<TrackApplication initialRegistrationId={registrationId} />,
// 		trackApplicationContainer
// 	);
// }

// // Home Page
// const homeContainer = document.getElementById("home-root");
// if (homeContainer) {
// 	renderWithProvider(<HomePage />, homeContainer);
// }

// // About Us Page
// const aboutUsContainer = document.getElementById("about-us-root");
// if (aboutUsContainer) {
// 	renderWithProvider(<AboutUsPage />, aboutUsContainer);
// }

// // Student Life Page
// const studentLifeContainer = document.getElementById("student-life-root");
// if (studentLifeContainer) {
// 	renderWithProvider(<StudentLifePage />, studentLifeContainer);
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

// // Academic Calendar Page
// const academicCalendarContainer = document.getElementById("academic-calendar-root");
// if (academicCalendarContainer) {
// 	renderWithProvider(<AcademicCalendarPage />, academicCalendarContainer);
// }

// // Class Schedule Page
// const classScheduleContainer = document.getElementById("class-schedule-root");
// if (classScheduleContainer) {
// 	renderWithProvider(<ClassSchedulePage />, classScheduleContainer);
// }

// // Exam Dates Page
// const examDatesContainer = document.getElementById("exam-dates-root");
// console.log("Looking for exam-dates-root element:", examDatesContainer);
// if (examDatesContainer) {
// 	console.log("Mounting ExamDatesPage component");
// 	renderWithProvider(<ExamDatesPage />, examDatesContainer);
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

// // Student Dashboard Page
// const dashboardContainer = document.getElementById("student-dashboard-app");
// if (dashboardContainer) {
// 	renderWithProvider(<StudentDashboardPage />, dashboardContainer);
// }

// // Contact Page
// const contactPageContainer = document.getElementById("contact-page-root");
// if (contactPageContainer) {
// 	renderWithProvider(<ContactPage />, contactPageContainer);
// }

// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import { FrappeProvider } from "frappe-react-sdk";
import AboutUsPage from "./pages/AboutUs";
import CourseDetails from "./pages/CourseDetails";
import StudentEnrollment from "./pages/StudentEnrollment";
import RegistrationDetails from "./pages/StudentEnrollment/RegistrationDetails";
import StudentDashboardPage from "./pages/StudentDashboard";
import HomePage from "./pages/Home";
import CourseCatalog from "./pages/CourseCatalog";
import AcademicCalendarPage from "./pages/AcademicCalendar";
import ClassSchedulePage from "./pages/ClassSchedule";
import ExamDatesPage from "./pages/ExamDates";
import TrackApplication from "./pages/TrackApplication";
import StudentLifePage from "./pages/StudentLife";
import ContactPage from "./pages/ContactPage";
import EventsPage from "./pages/Events/EventPage";
import EventDetails from "./pages/Events/EventDetails";
import AppWrapper from "./components/AppWrapper";
import TeacherAttendancePage from "./pages/TeacherAttendance";
import StudentIDCardPage from "./pages/StudentIDCard";

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

// Track Application Page
const trackApplicationContainer = document.getElementById("track-application-root");
if (trackApplicationContainer) {
	// Extract registrationId from URL if present
	const urlParams = new URLSearchParams(window.location.search);
	const registrationId = urlParams.get("id");

	renderWithProvider(
		<TrackApplication initialRegistrationId={registrationId} />,
		trackApplicationContainer
	);
}

// Home Page
const homeContainer = document.getElementById("home-root");
if (homeContainer) {
	renderWithProvider(<HomePage />, homeContainer);
}

// About Us Page
const aboutUsContainer = document.getElementById("about-us-root");
if (aboutUsContainer) {
	renderWithProvider(<AboutUsPage />, aboutUsContainer);
}

// Student Life Page
const studentLifeContainer = document.getElementById("student-life-root");
if (studentLifeContainer) {
	renderWithProvider(<StudentLifePage />, studentLifeContainer);
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

// Class Schedule Page
const classScheduleContainer = document.getElementById("class-schedule-root");
if (classScheduleContainer) {
	renderWithProvider(<ClassSchedulePage />, classScheduleContainer);
}

// Exam Dates Page
const examDatesContainer = document.getElementById("exam-dates-root");
console.log("Looking for exam-dates-root element:", examDatesContainer);
if (examDatesContainer) {
	console.log("Mounting ExamDatesPage component");
	renderWithProvider(<ExamDatesPage />, examDatesContainer);
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

// Contact Page
const contactPageContainer = document.getElementById("contact-page-root");
if (contactPageContainer) {
	renderWithProvider(<ContactPage />, contactPageContainer);
}

// Events Page
const eventsContainer = document.getElementById("events-root");
if (eventsContainer) {
	renderWithProvider(<EventsPage />, eventsContainer);
}

// Event Details Page
const eventDetailsContainer = document.getElementById("event-details-root");
if (eventDetailsContainer) {
	// Get event ID from URL parameters
	const urlParams = new URLSearchParams(window.location.search);
	const eventId = urlParams.get("id");
	renderWithProvider(<EventDetails eventId={eventId} />, eventDetailsContainer);
}

// // Events Page
// const eventsContainer = document.getElementById("events-root");
// if (eventsContainer) {
// 	renderWithProvider(<EventsPage />, eventsContainer);
// }

// // Event Details Page
// const eventDetailsContainer = document.getElementById("event-details-root");
// if (eventDetailsContainer) {
// 	renderWithProvider(<EventDetails />, eventDetailsContainer);
// }

// Teacher Attendance Page
const teacherAttendanceContainer = document.getElementById("teacher-attendance-root");
if (teacherAttendanceContainer) {
	renderWithProvider(<TeacherAttendancePage />, teacherAttendanceContainer);
}

// Student ID Card Page
const studentIDCardContainer = document.getElementById("student-id-card-root");
if (studentIDCardContainer) {
	renderWithProvider(<StudentIDCardPage />, studentIDCardContainer);
}
