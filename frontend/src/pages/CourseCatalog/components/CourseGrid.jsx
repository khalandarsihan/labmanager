import React from 'react';
import CourseCard from './CourseCard';

const CourseGrid = ({ courses = [], viewMode, isLoading }) => {
    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto p-8">
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-300"></div>
                </div>
            </div>
        );
    }

    if (!courses || courses.length === 0) {
        return (
            <div className="max-w-7xl mx-auto p-8 text-center">
                <p className="text-gray-400">No courses found</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-8">
            <div className={`${
                viewMode === 'grid'
                    ? 'grid grid-cols-1 lg:grid-cols-2 gap-8'
                    : 'flex flex-col space-y-8'
            }`}>
                {courses.map((course) => (
                    <CourseCard
                        key={course.course_code}
                        course={course}
                        isListView={viewMode === 'list'}
                    />
                ))}
            </div>
        </div>
    );
};

export default CourseGrid;