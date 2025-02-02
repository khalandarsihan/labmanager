// Carousel initialization
class Carousel {
	// constructor(element) {
	// 	this.carousel = element;
	// 	this.slides = element.querySelector(".carousel-slides");
	// 	this.slideElements = Array.from(this.slides.children);
	// 	this.nextButton = element.querySelector(".next");
	// 	this.prevButton = element.querySelector(".prev");
	// 	this.dotsContainer = element.querySelector(".absolute.bottom-4");
	// 	this.currentIndex = 0;
	// 	this.autoplayInterval = null;

	// 	this.init();
	// }

	constructor(element) {
		this.carousel = element;
		this.slides = element.querySelector(".carousel-slides");
		// Only count direct children that are slides
		this.slideElements = Array.from(this.slides.children).filter((child) =>
			child.matches('[id^="slide"]')
		);
		this.nextButton = element.querySelector(".next");
		this.prevButton = element.querySelector(".prev");
		this.dotsContainer = element.querySelector(".absolute.bottom-4");
		this.currentIndex = 0;
		this.autoplayInterval = null;

		this.init();
	}

	init() {
		// Create dots
		// this.createDots();

		// Add event listeners
		this.addEventListeners();

		// Start autoplay
		this.startAutoplay();
	}

	createDots() {
		this.slideElements.forEach((_, index) => {
			const dot = document.createElement("button");
			dot.classList.add("carousel-dot");
			if (index === 0) dot.classList.add("active");
			this.dotsContainer.appendChild(dot);
		});
	}

	updateDots() {
		const dots = this.dotsContainer.querySelectorAll(".carousel-dot");
		dots.forEach((dot, index) => {
			dot.classList.toggle("active", index === this.currentIndex);
		});
	}

	moveToSlide(index) {
		// Ensure index is within bounds
		this.currentIndex = Math.min(Math.max(0, index), this.slideElements.length - 1);
		const translateX = -(this.currentIndex * 100);
		this.slides.style.transform = `translateX(${translateX}%)`;
		// this.updateDots();
	}

	nextSlide() {
		let nextIndex = this.currentIndex + 1;
		if (nextIndex >= this.slideElements.length) {
			nextIndex = 0; // Loop back to first slide
		}
		this.moveToSlide(nextIndex);
	}

	prevSlide() {
		let prevIndex = this.currentIndex - 1;
		if (prevIndex < 0) {
			prevIndex = this.slideElements.length - 1; // Loop to last slide
		}
		this.moveToSlide(prevIndex);
	}

	addEventListeners() {
		// Next button click
		this.nextButton.addEventListener("click", () => {
			this.nextSlide();
			this.resetAutoplay();
		});

		// Previous button click
		this.prevButton.addEventListener("click", () => {
			this.prevSlide();
			this.resetAutoplay();
		});

		// Dot navigation
		this.dotsContainer.addEventListener("click", (e) => {
			if (e.target.classList.contains("carousel-dot")) {
				const dotIndex = Array.from(this.dotsContainer.children).indexOf(e.target);
				this.moveToSlide(dotIndex);
				this.resetAutoplay();
			}
		});

		// Pause on hover
		this.carousel.addEventListener("mouseenter", () => this.stopAutoplay());
		this.carousel.addEventListener("mouseleave", () => this.startAutoplay());
	}

	startAutoplay() {
		this.stopAutoplay();
		this.autoplayInterval = setInterval(() => {
			this.nextSlide();
		}, 1000); // Change slide every 5 seconds
	}

	stopAutoplay() {
		if (this.autoplayInterval) {
			clearInterval(this.autoplayInterval);
			this.autoplayInterval = null;
		}
	}

	resetAutoplay() {
		this.stopAutoplay();
		this.startAutoplay();
	}
}

// window.Carousel = Carousel;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
	const carousels = document.querySelectorAll(".carousel-wrapper");
	carousels.forEach((carousel) => {
		if (carousel) new Carousel(carousel);
	});
});
