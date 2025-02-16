import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchAndFilters from './components/SearchAndFilters';
import CourseGrid from './components/CourseGrid';
import useCourseCatalog from '../../hooks/useCourseCatalog';

const CourseCatalog = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [activeFilters, setActiveFilters] = useState({});
    const { courses, isLoading, error } = useCourseCatalog(activeFilters);

    // Debug logging
    useEffect(() => {
        console.log("CourseCatalog Component State:", {
            courses: courses?.length || 0,
            isLoading,
            hasError: !!error,
            viewMode
        });
    }, [courses, isLoading, error, viewMode]);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 py-12 px-4">
                <div className="text-red-500 text-center">
                    Error loading courses: {error.message || String(error)}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <Header />
            
            <div className="py-12">
                <SearchAndFilters 
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    onFilterChange={setActiveFilters}
                />

                <CourseGrid 
                    courses={courses} 
                    viewMode={viewMode}
                    isLoading={isLoading} 
                />
            </div>
        </div>
    );
};

export default CourseCatalog;