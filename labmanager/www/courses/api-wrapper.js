// // In labmanager/www/courses/api-wrapper.js
// import { useEffect, useState } from "react";

// export const useCourseData = (courseCode) => {
// 	const [data, setData] = useState(null);
// 	const [error, setError] = useState(null);
// 	const [isLoading, setIsLoading] = useState(true);

// 	useEffect(() => {
// 		const fetchData = async () => {
// 			try {
// 				const response = await fetch(
// 					`/api/method/labmanager.api.get_course_details?course_code=${encodeURIComponent(
// 						courseCode
// 					)}`
// 				);
// 				const result = await response.json();
// 				setData(result.message);
// 				setIsLoading(false);
// 			} catch (err) {
// 				setError(err);
// 				setIsLoading(false);
// 			}
// 		};

// 		if (courseCode) {
// 			fetchData();
// 		}
// 	}, [courseCode]);

// 	return { data, error, isLoading };
// };
