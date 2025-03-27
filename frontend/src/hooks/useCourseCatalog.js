import { useState, useEffect } from "react";
import { useFrappeGetCall } from "frappe-react-sdk";

const useCourseCatalog = (filters = {}) => {
	const [courses, setCourses] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [initialLoadDone, setInitialLoadDone] = useState(false);

	// Always convert filters to a string, even if empty
	// This ensures consistency in how we handle the API call
	const filterStr = JSON.stringify(filters);

	console.log("Filter string being sent:", filterStr);

	const {
		data,
		error: apiError,
		isValidating,
		mutate,
	} = useFrappeGetCall(
		"labmanager.api.api.get_course_catalog",
		{ filters: filterStr },
		{
			revalidateIfStale: true,
			revalidateOnFocus: false,
		}
	);

	// Handle data loading and course state updates
	useEffect(() => {
		if (data) {
			console.log("API Response:", data);

			let newCourses = [];

			if (data?.message?.message?.courses) {
				newCourses = data.message.message.courses || [];
			} else if (data?.message?.courses) {
				newCourses = data.message.courses || [];
			}

			// Only update courses if we got data back
			if (newCourses.length > 0 || Object.keys(filters).length > 0) {
				console.log(`Setting ${newCourses.length} courses`);
				setCourses(newCourses);
			}

			if (!initialLoadDone) {
				setInitialLoadDone(true);
			}

			setIsLoading(false);
		}
	}, [data, filters, initialLoadDone]);

	// Handle API errors
	useEffect(() => {
		if (apiError) {
			console.error("API Error:", apiError);
			setError(apiError);
			setIsLoading(false);
		}
	}, [apiError]);

	// Force refresh on filter changes
	useEffect(() => {
		// Only refresh if it's not the initial load
		if (initialLoadDone) {
			console.log("Refreshing data with filters:", filters);
			mutate();
		}
	}, [filterStr, mutate, initialLoadDone]);

	return {
		courses,
		isLoading: isLoading || isValidating,
		error,
		refresh: mutate,
	};
};

export default useCourseCatalog;
