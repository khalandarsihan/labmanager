import React, { useState, useCallback, useMemo } from 'react';
import useCourseCatalog from '../../hooks/useCourseCatalog';
import Header from './components/Header';
import SearchAndFilters from './components/SearchAndFilters';
import CourseGrid from './components/CourseGrid';
import BackgroundPattern from '@/components/ui/BackgroundPattern';
import { useTheme } from '../../components/ui/ThemeContext';

// Additional patterns specific to the course catalog that add center elements
const CourseCatalogPatterns = () => {
  const { useLightTheme } = useTheme();
  
  // Fix the colors to be purple in light theme and amber in dark theme
  const borderColor = useLightTheme 
    ? "border-purple-500" // Purple in light theme
    : "border-amber-300"; // Amber in dark theme
    
  const elementsOpacity = useLightTheme ? "/60" : "/40"; // Increased opacity for better visibility
  
  return (
    <div className="fixed inset-0 -z-4 overflow-visible pointer-events-none">
      {/* Center Elements */}
      {/* <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-20 h-20 border-2 ${borderColor}${elementsOpacity} rounded-full backdrop-blur-sm animate-float-up delay-400`} />
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 ${borderColor}${elementsOpacity} rounded-lg transform rotate-45 backdrop-blur-sm animate-float-side delay-600`} />
      <div className={`absolute bottom-1/3 left-1/2 -translate-x-1/2 w-12 h-12 border-2 ${borderColor}${elementsOpacity} rounded-full backdrop-blur-sm animate-float-diagonal delay-800`} /> */}
      
      {/* Center Vicinity Elements */}
      <div className={`absolute top-2/5 left-[40%] w-10 h-10 border-2 ${borderColor}${elementsOpacity} rounded-lg transform rotate-30 backdrop-blur-sm animate-float-circle delay-550`} />
      <div className={`absolute top-2/5 right-[40%] w-8 h-8 border-2 ${borderColor}${elementsOpacity} rounded-full backdrop-blur-sm animate-float-up delay-650`} />
      <div className={`absolute bottom-2/5 left-[40%] w-12 h-12 border-2 ${borderColor}${elementsOpacity} rounded-lg transform -rotate-15 backdrop-blur-sm animate-float-diagonal-reverse delay-750`} />
      <div className={`absolute bottom-2/5 right-[40%] w-10 h-10 border-2 ${borderColor}${elementsOpacity} rounded-full backdrop-blur-sm animate-float-side delay-850`} />
      
      {/* Additional Center Patterns */}
      {/* <div className={`absolute top-[45%] left-[55%] w-14 h-14 border-2 ${borderColor}${elementsOpacity} rounded-lg transform rotate-60 backdrop-blur-sm animate-float-up-slow delay-950`} />
      <div className={`absolute top-[55%] left-[45%] w-14 h-14 border-2 ${borderColor}${elementsOpacity} rounded-full backdrop-blur-sm animate-float-diagonal delay-1050`} /> */}
    </div>
  );
};

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
            {/* Additional center patterns */}
            <CourseCatalogPatterns />
            {/* Main content with higher z-index to ensure it's above the background */}
            <div className={`relative z-10 min-h-screen pb-20`}>
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