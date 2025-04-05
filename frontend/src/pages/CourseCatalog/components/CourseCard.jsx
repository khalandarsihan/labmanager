import React from 'react';
import { Clock, Users, Star, Bookmark } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTheme } from '../../../components/ui/ThemeContext';

const CourseCard = ({ course, isListView }) => {
    const { useLightTheme, themeStyles } = useTheme();
    
    if (!course) return null;

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "/api/placeholder/400/200";
        return `/files/${imagePath.split('/files/')[1]}`;
    };

    // const cardBg = useLightTheme ? "bg-white" : "bg-gray-800";
    // const textColor = useLightTheme ? "text-gray-900" : "text-gray-100";
    // const textSecondary = useLightTheme ? "text-gray-600" : "text-gray-300";
    // const hoverBorder = useLightTheme ? "hover:border-amber-500" : "hover:border-amber-400";

// const cardBg = useLightTheme ? "bg-white" : "bg-gray-800";
// const textColor = useLightTheme ? "text-gray-900" : "text-gray-100";
// const textSecondary = useLightTheme ? "text-gray-600" : "text-gray-300";
// const hoverBorder = useLightTheme ? "hover:border-purple-500" : "hover:border-amber-400";

const cardBg = useLightTheme ? "bg-white" : "bg-gray-800";
const textColor = useLightTheme ? "text-gray-900" : "text-gray-100";
const textSecondary = useLightTheme ? "text-gray-600" : "text-gray-300";
const borderColor = useLightTheme ? "border-transparent" : "border-gray-700";
const hoverBorder = useLightTheme ? "hover:border-purple-500" : "hover:border-amber-400";

    const GridView = () => (
        <div className="p-3">
            {/* <Card className={`${cardBg} border overflow-hidden ${hoverBorder} transition-all duration-300 hover:transform hover:scale-[1.02]`}> */}
            <Card className={`${cardBg} border ${borderColor} overflow-hidden ${hoverBorder} transition-all duration-300 hover:transform hover:scale-[1.02]`}>
                <div className="relative">
                    {/* Price and Featured Badge */}
                    <div className="absolute top-3 left-3 z-10">
                        <span className="bg-gray-900/80 text-white px-3 py-1 rounded-full text-sm">
                            ₹{course.price}
                        </span>
                    </div>
                    {course.show_in_featured_section && (
                        <div className="absolute top-3 right-3 z-10">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                                Featured
                            </span>
                        </div>
                    )}

                    {/* Course Image */}
                    <div className="relative h-52">
                        <img
                            src={getImageUrl(course.featured_image_catalog)}
                            alt={course.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                    </div>

                    {/* Course Content */}
                    <div className="p-6">
                        <a 
                            href={`/courses/${course.course_code}`}
                            className="block group"
                        >
                            <h3 className={`text-xl font-bold ${textColor} mb-2 group-hover:text-amber-500 transition-colors duration-200`}>
                                {course.title}
                            </h3>
                        </a>
                        <p className={`${textSecondary} text-sm line-clamp-2 mb-4`}>
                            {course.short_description}
                        </p>

                        {/* Course Meta */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-500" />
                                <span className={`text-sm ${textSecondary}`}>
                                    {course.duration} {course.unit}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-amber-500" />
                                <span className={`text-sm ${textSecondary}`}>
                                    {course.total_lessons} students
                                </span>
                            </div>
                        </div>

                        {/* Instructor Info */}
                        {course.instructor && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden">
                                        {course.instructor.image ? (
                                            <img
                                                src={getImageUrl(course.instructor.image)}
                                                alt={course.instructor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : null}
                                    </div>
                                    <span className={`text-sm ${textSecondary}`}>
                                        {course.instructor.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className={`text-sm ${textSecondary}`}>4.8</span>
                                    <button className="ml-2">
                                        <Bookmark className="w-4 h-4 text-gray-400 hover:text-amber-500" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );

    const ListView = () => (
        <div className="p-3">
            {/* <Card className={`${cardBg} border overflow-hidden ${hoverBorder} transition-all duration-300 hover:transform hover:scale-[1.02]`}> */}
            <Card className={`${cardBg} border ${borderColor} overflow-hidden ${hoverBorder} transition-all duration-300 hover:transform hover:scale-[1.02]`}>
                <div className="flex">
                    {/* Left side - Image */}
                    <div className="relative w-72">
                        <img
                            src={getImageUrl(course.featured_image_catalog)}
                            alt={course.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                            <span className="bg-gray-900/80 text-white px-3 py-1 rounded-full text-sm">
                                ₹{course.price}
                            </span>
                        </div>
                        {course.show_in_featured_section && (
                            <div className="absolute top-3 right-3">
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                                    Featured
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Right side - Content */}
                    <div className="flex-1 p-6">
                        <a 
                            href={`/courses/${course.course_code}`}
                            className="block group"
                        >
                            <h3 className={`text-xl font-bold ${textColor} mb-2 group-hover:text-amber-500 transition-colors duration-200`}>
                                {course.title}
                            </h3>
                        </a>
                        <p className={`${textSecondary} text-sm mb-4`}>
                            {course.short_description}
                        </p>

                        <div className="flex items-center gap-6 mb-4">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-500" />
                                <span className={`text-sm ${textSecondary}`}>
                                    {course.duration} {course.unit}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-amber-500" />
                                <span className={`text-sm ${textSecondary}`}>
                                    {course.total_lessons} students
                                </span>
                            </div>
                        </div>

                        {course.instructor && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden">
                                        {course.instructor.image ? (
                                            <img
                                                src={getImageUrl(course.instructor.image)}
                                                alt={course.instructor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : null}
                                    </div>
                                    <span className={`text-sm ${textSecondary}`}>
                                        {course.instructor.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className={`text-sm ${textSecondary}`}>4.8</span>
                                    <button className="ml-2">
                                        <Bookmark className="w-4 h-4 text-gray-400 hover:text-amber-500" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );

    return isListView ? <ListView /> : <GridView />;
};

export default CourseCard;