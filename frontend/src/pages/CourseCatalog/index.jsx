import React, { useState, useCallback, useMemo } from 'react';
import useCourseCatalog from '../../hooks/useCourseCatalog';
import Header from './components/Header';
import SearchAndFilters from './components/SearchAndFilters';
import CourseGrid from './components/CourseGrid';
import BackgroundPattern from '@/components/ui/BackgroundPattern';
import { useTheme } from '../../components/ui/ThemeContext';


const CourseCatalog = () => {
    const { useLightTheme, toggleTheme, themeStyles } = useTheme();
    const [viewMode, setViewMode] = useState('grid');
    const [activeFilters, setActiveFilters] = useState({});
    
    const handleFilterChange = useCallback((newFilters) => {
        setActiveFilters(prev => {
            // Only update if there are actual changes
            const updated = { ...prev };
            let hasChanges = false;
            
            for (const [key, value] of Object.entries(newFilters)) {
                if (prev[key] !== value) {
                    updated[key] = value;
                    hasChanges = true;
                }
            }
            
            return hasChanges ? updated : prev;
        });
    }, []);
    
    
    // Use the hook with active filters
    const { courses, isLoading } = useCourseCatalog(activeFilters);
    
    // Memoize rendered components to reduce re-renders
    const headerComponent = useMemo(() => <Header />, []);
    const searchComponent = useMemo(() => (
        <SearchAndFilters 
            viewMode={viewMode} 
            setViewMode={setViewMode}
            onFilterChange={handleFilterChange}
            isSearching={isLoading}
        />
    ), [viewMode, handleFilterChange, isLoading]);

    return (
        <div className="relative">
        {/* BackgroundPattern is positioned behind everything */}
        <BackgroundPattern />
        {/* <div className="min-h-screen bg-gray-900 text-white pb-20"> */}
        <div className={`min-h-screen ${themeStyles.background} pb-20`}>

        
            {headerComponent}
            {searchComponent}
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