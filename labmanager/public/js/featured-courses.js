class FeaturedCourses {
	constructor(container) {
		this.container = container;
		this.courses = [];
		this.scrollPosition = 0;
		this.init();
	}

	async init() {
		await this.fetchCourses();
		this.render();
		this.attachEventListeners();
	}

	async fetchCourses() {
		try {
			const response = await fetch("/api/method/labmanager.api.api.get_featured_courses");
			const data = await response.json();
			this.courses = data.message?.courses || data.courses || [];
		} catch (error) {
			console.error("Error fetching courses:", error);
		}
	}

	scroll(direction) {
		const scrollContainer = this.container.querySelector(".courses-scroll");
		if (scrollContainer) {
			// Set card width to exactly one-third of the container (minus gaps)
			const cardWidth = scrollContainer.clientWidth / 3;
			const scrollAmount = cardWidth * (direction === "left" ? -1 : 1);
			scrollContainer.scrollBy({
				left: scrollAmount,
				behavior: "smooth",
			});
		}
	}

	renderCourseCard(course) {
		return `  
            <div class="flex-none w-1/3 px-2">
                <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-amber-300/50 overflow-hidden">  
                    <div class="h-48">
                    <img
                        src="${
							course.featured_image_small ||
							"/assets/labmanager/images/course-placeholder.jpg"
						}"
                        alt="${course.title}"
                        class="h-full w-full object-cover"
                    />  
                    </div>           
                    <div class="p-4">  
                        <h3 class="text-lg text-amber-200 mb-2">${course.title}</h3>  
                        <p class="text-gray-300 text-sm line-clamp-2 mb-4">${
							course.short_description || ""
						}</p>  
                        <div class="flex justify-between items-center">  
                            <span class="text-amber-300 font-bold">$${course.price}</span>  
                            <a  
                                href="/courses/${course.course_code}"  
                                class="bg-amber-300/90 hover:bg-amber-300 text-gray-900 px-4 py-2 rounded"  
                            >  
                                Learn More  
                            </a>  
                        </div>  
                    </div>  
                </div>
            </div>  
        `;
	}

	render() {
		const html = `  
            <div class="w-full max-w-6xl mx-auto px-4">  
                <div class="flex items-center justify-between mb-8">  
                    <h2 class="text-2xl font-bold text-amber-200">Featured Courses</h2>  
                    <div class="flex gap-2">  
                        <button class="scroll-left p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 border border-amber-300/20 hover:border-amber-300/50">  
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-200">  
                                <path d="m15 18-6-6 6-6"/>  
                            </svg>  
                        </button>  
                        <button class="scroll-right p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 border border-amber-300/20 hover:border-amber-300/50">  
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-200">  
                                <path d="m9 18 6-6-6-6"/>  
                            </svg>  
                        </button>  
                    </div>  
                </div>  
                <div class="courses-scroll flex overflow-x-auto scrollbar-hide scroll-smooth">  
                    ${this.courses.map((course) => this.renderCourseCard(course)).join("")}  
                </div>  
            </div>  
        `;
		this.container.innerHTML = html;
	}

	attachEventListeners() {
		const leftBtn = this.container.querySelector(".scroll-left");
		const rightBtn = this.container.querySelector(".scroll-right");

		leftBtn?.addEventListener("click", () => this.scroll("left"));
		rightBtn?.addEventListener("click", () => this.scroll("right"));
	}
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
	const container = document.getElementById("featuredCoursesContainer");
	if (container) {
		new FeaturedCourses(container);
	}
});
