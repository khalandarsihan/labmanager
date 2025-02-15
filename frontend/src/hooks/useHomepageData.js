import { useState, useEffect } from "react";

export const useHomepageData = () => {
	const [homepageContent, setHomepageContent] = useState({
		welcome_content: "",
		announcements: [],
	});
	const [featuredCourses, setFeaturedCourses] = useState([]);
	const [faqs, setFaqs] = useState({ categories: [], faqs: [] });
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const [coursesResponse, contentResponse, faqsResponse] = await Promise.all([
					fetch("/api/method/labmanager.api.api.get_featured_courses"),
					fetch("/api/method/labmanager.api.api.get_homepage_content"),
					fetch("/api/method/labmanager.api.api.get_homepage_faqs"),
				]);

				if (!coursesResponse.ok || !contentResponse.ok || !faqsResponse.ok) {
					throw new Error("Failed to fetch data");
				}

				const coursesData = await coursesResponse.json();
				const contentData = await contentResponse.json();
				const faqsData = await faqsResponse.json();

				setFeaturedCourses(coursesData.message?.courses || []);
				setHomepageContent(contentData.message || {});
				setFaqs({
					categories: faqsData.message?.categories || [],
					faqs: faqsData.message?.faqs || [],
				});
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
			const response = await fetch("/api/method/labmanager.api.api.get_homepage_content");
			if (!response.ok) {
				throw new Error("Failed to refresh data");
			}
			const data = await response.json();
			setHomepageContent(data.message || {});
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		homepageContent,
		featuredCourses,
		faqs,
		isLoading,
		error,
		refetch,
	};
};

export default useHomepageData;
