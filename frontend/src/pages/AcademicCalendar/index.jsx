import React from 'react';
import AcademicCalendar from '@/components/ui/AcademicCalendar';
import { useTheme } from '../../components/ui/ThemeContext';


const AcademicCalendarPage = () => {
  const { useLightTheme, toggleTheme, themeStyles } = useTheme();
  return (
    // <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 py-12 px-4">
    <div className={`min-h-screen ${themeStyles.background} py-12 px-4`}>
      <div className="max-w-7xl mx-auto">
        <AcademicCalendar />
      </div>
    </div>
  );
};

export default AcademicCalendarPage;