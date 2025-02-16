import { useState, useEffect } from "react";

export const useHomepageData = () => {
	const [homepageContent, setHomepageContent] = useState({
		welcome_content: "",
		announcements: [],
	});
	const [featuredCourses, setFeaturedCourses] = useState([]);
	const [features, setFeatures] = useState([]);
	const [faqs, setFaqs] = useState({ categories: [], faqs: [] });
	const [carouselSlides, setCarouselSlides] = useState([]); // Added carousel state
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const [
					coursesResponse,
					contentResponse,
					faqsResponse,
					featuresResponse,
					carouselResponse, // Added carousel response
				] = await Promise.all([
					fetch("/api/method/labmanager.api.api.get_featured_courses"),
					fetch("/api/method/labmanager.api.api.get_homepage_content"),
					fetch("/api/method/labmanager.api.api.get_homepage_faqs"),
					fetch("/api/method/labmanager.api.api.get_features"),
					fetch("/api/method/labmanager.api.api.get_carousel_slides"), // New endpoint
				]);

				if (
					!coursesResponse.ok ||
					!contentResponse.ok ||
					!faqsResponse.ok ||
					!featuresResponse.ok ||
					!carouselResponse.ok // Added check for carousel
				) {
					throw new Error("Failed to fetch data");
				}

				const coursesData = await coursesResponse.json();
				const contentData = await contentResponse.json();
				const faqsData = await faqsResponse.json();
				const featuresData = await featuresResponse.json();
				const carouselData = await carouselResponse.json(); // Parse carousel data

				setFeaturedCourses(coursesData.message?.courses || []);
				setHomepageContent(contentData.message || {});
				setFaqs({
					categories: faqsData.message?.categories || [],
					faqs: faqsData.message?.faqs || [],
				});
				setFeatures(featuresData.message?.features || []);
				setCarouselSlides(carouselData.message?.slides || []); // Set carousel slides
			} catch (err) {
				console.error("Error fetching homepage data:", err);
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const refetch = async () => {
		setIsLoading(true);
		try {
			const [contentResponse, featuresResponse, carouselResponse] = await Promise.all([
				fetch("/api/method/labmanager.api.api.get_homepage_content"),
				fetch("/api/method/labmanager.api.api.get_features"),
				fetch("/api/method/labmanager.api.api.get_carousel_slides"),
			]);

			if (!contentResponse.ok || !featuresResponse.ok || !carouselResponse.ok) {
				throw new Error("Failed to refresh data");
			}

			const contentData = await contentResponse.json();
			const featuresData = await featuresResponse.json();
			const carouselData = await carouselResponse.json();

			setHomepageContent(contentData.message || {});
			setFeatures(featuresData.message?.features || []);
			setCarouselSlides(carouselData.message?.slides || []); // Update carousel slides
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		homepageContent,
		featuredCourses,
		features,
		faqs,
		carouselSlides, // Added to return object
		isLoading,
		error,
		refetch,
	};
};

export default useHomepageData;
