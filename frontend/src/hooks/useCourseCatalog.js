import { useState, useEffect } from "react";
import { useFrappeGetCall } from "frappe-react-sdk";

const useCourseCatalog = (filters = {}) => {
	const [courses, setCourses] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const {
		data,
		error: apiError,
		isValidating,
	} = useFrappeGetCall(
		"labmanager.api.api.get_course_catalog",
		{},
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
		}
	);

	useEffect(() => {
		console.log("Raw API Response:", data);

		if (data?.message?.message?.courses) {
			// Fix: Handle nested message structure
			console.log("Setting courses:", data.message.message.courses);
			setCourses(data.message.message.courses);
			setIsLoading(false);
		} else if (data?.message?.courses) {
			// Alternative structure
			console.log("Setting courses from direct message:", data.message.courses);
			setCourses(data.message.courses);
			setIsLoading(false);
		} else if (data?.error) {
			console.error("API Error:", data.error);
			setError(data.error);
			setIsLoading(false);
		}
	}, [data]);

	useEffect(() => {
		if (apiError) {
			console.error("API Error:", apiError);
			setError(apiError);
			setIsLoading(false);
		}
	}, [apiError]);

	// Debug current state
	useEffect(() => {
		console.log("Current Hook State:", {
			coursesLength: courses.length,
			hasData: !!data,
			isLoading,
			hasError: !!error,
		});
	}, [courses, data, isLoading, error]);

	return {
		courses,
		isLoading: isLoading || isValidating,
		error,
	};
};

export default useCourseCatalog;
