import React from 'react';
import CourseCard from './CourseCard';
import CourseSkeleton from './CourseSkeleton';

const CourseGrid = ({ courses = [], viewMode, isLoading }) => {
    // Show skeletons only on initial load, not during search/filter
    if (isLoading && courses.length === 0) {
        return (
            <div className="max-w-7xl mx-auto p-4 sm:p-8">
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-300"></div>
                </div>
            </div>
        );
    }

    if (!courses || courses.length === 0) {
        return (
            <div className="max-w-7xl mx-auto p-4 sm:p-8 text-center">
                <p className="text-gray-400">No courses found</p>
            </div>
        );
    }

    // Detect mobile device width more precisely
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
    
    // Always force list view on mobile if that's what the user selected
    const effectiveViewMode = (isMobile && viewMode === 'list') ? 'list' : viewMode;

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-8">
            <div className={`${
                effectiveViewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-8'
                    : 'flex flex-col space-y-4 sm:space-y-8'
            }`}>
                {courses.map((course) => (
                    <CourseCard
                        key={course.course_code}
                        course={course}
                        isListView={effectiveViewMode === 'list'}
                    />
                ))}
            </div>
        </div>
    );
};

export default CourseGrid;