// main.js
document.addEventListener("DOMContentLoaded", () => {
	// Initialize Featured Courses
	const coursesContainer = document.getElementById("featuredCoursesContainer");
	if (coursesContainer) {
		new FeaturedCourses(coursesContainer);
	}

	// Initialize Carousels
	const carousels = document.querySelectorAll(".carousel-wrapper");
	carousels.forEach((carousel) => new Carousel(carousel));

	// Initialize Homepage Manager
	new HomepageManager();
});
