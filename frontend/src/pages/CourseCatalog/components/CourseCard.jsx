
import React from 'react';
import { Clock, Users, Star, Bookmark, Database } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatPrice } from '../../../utils/priceFormat';
import { useTheme } from '../../../components/ui/ThemeContext';

const CourseCard = ({ course, isListView }) => {
    const { useLightTheme, themeStyles } = useTheme();
    
    if (!course) return null;

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "/api/placeholder/400/200";
        return `/files/${imagePath.split('/files/')[1]}`;
    };

    const cardBg = useLightTheme ? "bg-white" : "bg-gray-900";
    const textColor = useLightTheme ? "text-gray-900" : "text-gray-100";
    const textSecondary = useLightTheme ? "text-gray-600" : "text-gray-300";
    const borderColor = useLightTheme ? "border-transparent" : "border-gray-700";
    const hoverBorder = useLightTheme ? "hover:border-purple-500" : "hover:border-amber-400";

    const GridView = () => (
        <div className="p-3 relative z-10">
            <Card className={`${cardBg} border ${borderColor} overflow-hidden ${hoverBorder} transition-all duration-300 hover:transform hover:scale-[1.02]`}>
                <div className="relative">
                    {/* Price and Featured Badge */}
                    <div className="absolute top-3 left-3 z-10">
                        <span className="bg-gray-900/80 text-white px-3 py-1 rounded-full text-sm">
                        {formatPrice(course.price)}
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

                        {/*  LMS Enabled badge */}
                        <div className="flex items-center gap-2 mb-4">
                            <Database className="w-4 h-4 text-amber-500" />
                            <span className={`text-sm ${textSecondary} truncate`}>
                            Learning Management System Access
                            </span>
                        </div>

                        {/* COMPLETELY REDESIGNED INSTRUCTOR SECTION FOR GRID */}
                        {course.instructor && (
                            <div className="flex flex-wrap items-center">
                                {/* Left side - avatar and name with exactly 70% width */}
                                <div className="w-3/4 pr-2 flex items-center">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden mr-2 flex-shrink-0">
                                        {course.instructor.image ? (
                                            <img
                                                src={getImageUrl(course.instructor.image)}
                                                alt={course.instructor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : null}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className={`text-sm ${textSecondary} truncate`}>
                                            {course.instructor.name}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Right side - rating fixed at 30% width */}
                                <div className="w-1/4 flex items-center justify-end">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current flex-shrink-0" />
                                    <span className={`text-sm ${textSecondary} mx-1 flex-shrink-0`}>4.8</span>
                                    <button>
                                        <Bookmark className="w-4 h-4 text-gray-400 hover:text-amber-500 flex-shrink-0" />
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
        <div className="p-3 relative z-10">
            <Card className={`${cardBg} border ${borderColor} overflow-hidden ${hoverBorder} transition-all duration-300 hover:transform hover:scale-[1.02]`}>
                {/* Always use horizontal layout for list view, even on mobile */}
                <div className="flex flex-row h-auto">
                    {/* Left side - Image (fixed width on all screens) */}
                    <div className="relative w-1/3 sm:w-72 h-auto min-h-[120px]">
                        <img
                            src={getImageUrl(course.featured_image_catalog)}
                            alt={course.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                            <span className="bg-gray-900/80 text-white px-2 py-1 rounded-full text-xs sm:text-sm">
                            {formatPrice(course.price)}
                            </span>
                        </div>
                        {course.show_in_featured_section && (
                            <div className="absolute top-2 right-2">
                                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs sm:text-sm">
                                    Featured
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Right side - Content */}
                    <div className="flex-1 p-2 sm:p-6">
                        <a 
                            href={`/courses/${course.course_code}`}
                            className="block group"
                        >
                            <h3 className={`text-sm sm:text-xl font-bold ${textColor} mb-1 sm:mb-2 group-hover:text-amber-500 transition-colors duration-200 line-clamp-2`}>
                                {course.title}
                            </h3>
                        </a>
                        <p className={`${textSecondary} text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2`}>
                            {course.short_description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-6 mb-2 sm:mb-4">
                            <div className="flex items-center gap-1 sm:gap-2">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
                                <span className={`text-xs sm:text-sm ${textSecondary}`}>
                                    {course.duration} {course.unit}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
                                <span className={`text-xs sm:text-sm ${textSecondary}`}>
                                    {course.total_lessons} students
                                </span>
                            </div>
                        </div>

                        {/* LMS Enabled badge - only show on larger screens */}
                        <div className="hidden sm:flex items-center gap-2 mb-4">
                            <Database className="w-4 h-4 text-amber-500" />
                            <span className={`text-sm ${textSecondary}`}>
                            Learning Management System Access
                            </span>
                        </div>

                        {course.instructor && (
                            <div className="flex items-center">
                                <div className="flex items-center mr-auto">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full overflow-hidden mr-2 flex-shrink-0">
                                        {course.instructor.image ? (
                                            <img
                                                src={getImageUrl(course.instructor.image)}
                                                alt={course.instructor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : null}
                                    </div>
                                    <span className={`text-xs sm:text-sm ${textSecondary} truncate`}>
                                        {course.instructor.name}
                                    </span>
                                </div>
                                <div className="flex items-center ml-4 flex-shrink-0">
                                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                                    <span className={`text-xs sm:text-sm ${textSecondary} mx-1`}>4.8</span>
                                    <button>
                                        <Bookmark className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-amber-500" />
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
