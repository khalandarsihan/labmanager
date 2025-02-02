class HomepageManager {
	constructor() {
		this.init();
	}

	async init() {
		this.announcementsContainer = document.getElementById("announcements-section");
		this.welcomeContainer = document.getElementById("welcome-section");
		this.faqsContainer = document.getElementById("faqs-section");

		if (!this.announcementsContainer || !this.welcomeContainer || !this.faqsContainer) {
			console.error("Could not find required containers");
			return;
		}

		// Ensure welcome section takes full width
		if (this.welcomeContainer) {
			// Remove width constraints from all parent elements of welcome section
			let currentElement = this.welcomeContainer;
			while (currentElement && currentElement !== document.body) {
				currentElement.classList.remove(
					"container",
					"mx-auto",
					"max-w-7xl",
					"max-w-6xl",
					"max-w-5xl",
					"max-w-4xl",
					"max-w-3xl",
					"max-w-2xl",
					"max-w-xl",
					"max-w-lg",
					"max-w-md",
					"max-w-sm"
				);
				currentElement.classList.add("w-screen", "max-w-none");
				currentElement = currentElement.parentElement;
			}
		}

		// Add full-width container classes for features section
		const mainContainer = this.announcementsContainer.closest(".container");
		if (mainContainer) {
			mainContainer.classList.remove("container", "mx-auto");
			mainContainer.classList.add("px-16", "w-full");
		}

		// Adjust flex container
		const flexContainer = this.announcementsContainer.closest(".flex");
		if (flexContainer) {
			flexContainer.classList.add("w-full", "gap-16");
		}

		try {
			await Promise.all([this.loadHomepageContent(), this.loadFAQs()]);
		} catch (error) {
			console.error("Error initializing homepage:", error);
		}
	}

	async loadHomepageContent() {
		try {
			const response = await fetch("/api/method/labmanager.api.api.get_homepage_content");
			const data = await response.json();

			if (data.message) {
				if (data.message.welcome_content) {
					this.renderWelcomeContent(data.message.welcome_content);
				}
				if (data.message.announcements?.length) {
					this.renderAnnouncements(data.message.announcements);
				}
			}
		} catch (error) {
			console.error("Error loading homepage content:", error);
		}
	}

	async loadFAQs() {
		try {
			const response = await fetch("/api/method/labmanager.api.api.get_homepage_faqs");
			const data = await response.json();

			const categories = data.message ? data.message.categories : data.categories;
			const faqs = data.message ? data.message.faqs : data.faqs;

			if (categories && faqs) {
				this.renderFAQs(faqs, categories);
			}
		} catch (error) {
			console.error("Error loading FAQs:", error);
		}
	}

	// In the HomepageManager class, update the renderWelcomeContent method:

	renderWelcomeContent(welcomeContent) {
		if (!this.welcomeContainer) return;

		// Render welcome content with consistent margins
		const html = `
        <div class="space-y-6">
            ${welcomeContent.content}
        </div>
    `;

		this.welcomeContainer.innerHTML = html;

		// Ensure parent containers maintain padding
		const parentContainer = this.welcomeContainer.closest(".mx-auto");
		if (parentContainer) {
			parentContainer.classList.add("px-16");
		}
	}

	renderAnnouncements(announcements) {
		if (!this.announcementsContainer || !announcements?.length) {
			return;
		}

		const admissionAnnouncement = announcements
			.sort((a, b) => (b.priority || 0) - (a.priority || 0))
			.find((a) => a.title.toLowerCase().includes("admission"));

		if (!admissionAnnouncement) return;

		const html = `
            <div class="p-8 h-full relative z-10">
                ${
					admissionAnnouncement?.content
						? `
                    <div class="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 text-gray-200">
                        ${admissionAnnouncement.content}
                    </div>
                    `
						: ""
				}
            </div>
        `;

		this.announcementsContainer.innerHTML = html;
	}

	renderFAQs(faqs, categories) {
		if (!this.faqsContainer || !categories?.length || !faqs?.length) {
			return;
		}

		const faqsByCategory = this.groupFAQsByCategory(faqs);

		const html = `
            <div class="p-8 h-full relative z-10">
                <h2 class="text-4xl font-bold text-white mb-8">FREQUENTLY<br/>ASKED QUESTIONS</h2>
                <div class="space-y-4 overflow-auto max-h-[calc(100vh-16rem)] scrollbar-hide">
                    ${categories
						.sort((a, b) => a.sequence - b.sequence)
						.map(
							(category) => `
                            <div class="category-section">
                                <h3 class="text-xl font-semibold text-amber-300 mb-4">${
									category.category_name
								}</h3>
                                <div class="space-y-2">
                                    ${(faqsByCategory[category.name] || [])
										.sort((a, b) => a.sequence - b.sequence)
										.map(
											(faq, index) => `
                                            <div class="bg-gray-800/30 rounded-lg overflow-hidden">
                                                <button
                                                    class="faq-question w-full flex justify-between items-center p-4 text-left focus:outline-none"
                                                    aria-expanded="false"
                                                    aria-controls="faq-answer-${category.name}-${index}"
                                                    data-faq-id="${category.name}-${index}"
                                                >
                                                    <span class="text-white font-medium pr-4">${faq.question}</span>
                                                    <span class="faq-icon flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-amber-300 text-gray-900">+</span>
                                                </button>
                                                <div
                                                    id="faq-answer-${category.name}-${index}"
                                                    class="faq-answer hidden px-4 pb-4"
                                                >
                                                    <div class="text-gray-200">
                                                        ${faq.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        `
										)
										.join("")}
                                </div>
                            </div>
                        `
						)
						.join("")}
                </div>
            </div>
        `;

		this.faqsContainer.innerHTML = html;
		this.attachFAQHandlers();
	}

	groupFAQsByCategory(faqs) {
		return faqs.reduce((acc, faq) => {
			const category = faq.category || "General";
			if (!acc[category]) {
				acc[category] = [];
			}
			acc[category].push(faq);
			return acc;
		}, {});
	}

	attachFAQHandlers() {
		this.faqsContainer.querySelectorAll(".faq-question").forEach((button) => {
			button.addEventListener("click", () => {
				const faqId = button.getAttribute("data-faq-id");
				const answer = document.getElementById(`faq-answer-${faqId}`);
				const icon = button.querySelector(".faq-icon");
				const isExpanded = button.getAttribute("aria-expanded") === "true";

				// Close all other FAQs
				this.faqsContainer.querySelectorAll(".faq-answer").forEach((el) => {
					if (el !== answer && !el.classList.contains("hidden")) {
						el.classList.add("hidden");
						el.previousElementSibling.setAttribute("aria-expanded", "false");
						el.previousElementSibling.querySelector(".faq-icon").textContent = "+";
					}
				});

				// Toggle current FAQ
				button.setAttribute("aria-expanded", !isExpanded);
				answer.classList.toggle("hidden");
				icon.textContent = isExpanded ? "+" : "−";
			});
		});
	}
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
	new HomepageManager();
});
