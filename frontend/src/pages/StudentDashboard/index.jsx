// // src/pages/StudentDashboard/index.jsx
// import React from 'react';
// import StudentDashboard from './components/StudentDashboard';

// const StudentDashboardPage = () => {
//   return (
//     <div className="container mx-auto p-4">
//       <StudentDashboard />
//     </div>
//   );
// };

// export default StudentDashboardPage;


// src/pages/StudentDashboard/index.jsx
import React from 'react';
import StudentDashboard from './components/StudentDashboard';
import { useTheme } from '../../components/ui/ThemeContext';
import BackgroundPattern from '../../components/ui/BackgroundPattern';

const StudentDashboardPage = () => {
  const { themeStyles } = useTheme();
  
  // This exactly matches your AcademicCalendarPage structure
  return (
    <div className={`min-h-screen ${themeStyles.background} py-12 px-4`}>
      <BackgroundPattern />
      <div className="max-w-7xl mx-auto">
        <StudentDashboard />
      </div>
    </div>
  );
};

export default StudentDashboardPage;