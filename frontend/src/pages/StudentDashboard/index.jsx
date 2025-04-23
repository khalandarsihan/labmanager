import React from 'react';
import StudentDashboard from './components/StudentDashboard';
import { useTheme } from '../../components/ui/ThemeContext';
import BackgroundPattern from '../../components/ui/BackgroundPattern';
import ThemeSwitcher from '../../components/ui/ThemeSwitcher';

const StudentDashboardPage = () => {
  const { useLightTheme, toggleTheme, themeStyles } = useTheme();
  
  return (
    <div className={`min-h-screen ${themeStyles.background} py-12 px-4 relative`}>
      <BackgroundPattern />
      <ThemeSwitcher useLightTheme={useLightTheme} toggleTheme={toggleTheme} />
      {/* Added z-10 to position the content above the background patterns */}
      <div className="max-w-7xl mx-auto relative z-10">
        <StudentDashboard />
      </div>
    </div>
  );
};

export default StudentDashboardPage;