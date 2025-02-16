import { useState, useEffect } from "react";

export const useHomepageData = () => {
	const [homepageContent, setHomepageContent] = useState({
		welcome_content: "",
		announcements: [],
	});
	const [featuredCourses, setFeaturedCourses] = useState([]);
	const [features, setFeatures] = useState([]); // Added features state
	const [faqs, setFaqs] = useState({ categories: [], faqs: [] });
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
					featuresResponse, // Added features request
				] = await Promise.all([
					fetch("/api/method/labmanager.api.api.get_featured_courses"),
					fetch("/api/method/labmanager.api.api.get_homepage_content"),
					fetch("/api/method/labmanager.api.api.get_homepage_faqs"),
					fetch("/api/method/labmanager.api.api.get_features"), // New endpoint
				]);

				if (
					!coursesResponse.ok ||
					!contentResponse.ok ||
					!faqsResponse.ok ||
					!featuresResponse.ok
				) {
					throw new Error("Failed to fetch data");
				}

				const coursesData = await coursesResponse.json();
				const contentData = await contentResponse.json();
				const faqsData = await faqsResponse.json();
				const featuresData = await featuresResponse.json();

				setFeaturedCourses(coursesData.message?.courses || []);
				setHomepageContent(contentData.message || {});
				setFaqs({
					categories: faqsData.message?.categories || [],
					faqs: faqsData.message?.faqs || [],
				});
				setFeatures(featuresData.message?.features || []); // Set features data
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
			const [contentResponse, featuresResponse] = await Promise.all([
				fetch("/api/method/labmanager.api.api.get_homepage_content"),
				fetch("/api/method/labmanager.api.api.get_features"),
			]);

			if (!contentResponse.ok || !featuresResponse.ok) {
				throw new Error("Failed to refresh data");
			}

			const contentData = await contentResponse.json();
			const featuresData = await featuresResponse.json();

			setHomepageContent(contentData.message || {});
			setFeatures(featuresData.message?.features || []);
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		homepageContent,
		featuredCourses,
		features, // Added features to return object
		faqs,
		isLoading,
		error,
		refetch,
	};
};

export default useHomepageData;
