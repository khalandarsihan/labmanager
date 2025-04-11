import React from 'react';
import { useTheme } from '../../../components/ui/ThemeContext';

const AdmissionAnnouncement = () => {
  const { useLightTheme } = useTheme();
  
  const bgColor = useLightTheme 
    ? "bg-white/90" 
    : "bg-gray-800/70";
    
  const textColor = useLightTheme
    ? "text-purple-700"
    : "text-amber-300";
    
  const subTextColor = useLightTheme
    ? "text-purple-600"
    : "text-white";
    
  const buttonBg = useLightTheme
    ? "bg-purple-600 text-white hover:bg-purple-700"
    : "bg-amber-300 text-gray-900 hover:bg-amber-400";

  return (
    <div className={`rounded-xl ${bgColor} p-5 sm:p-8 w-full max-w-md mx-auto text-center shadow-lg backdrop-blur-sm`}>
      {/* New Tag */}
      <div className="flex justify-center mb-2">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/50 text-purple-600">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">New Admission 2025</span>
        </div>
      </div>
      
      {/* Main Content - Centered with proper spacing */}
      <div className="mb-6">
        <h2 className={`${textColor} text-4xl sm:text-5xl font-bold mb-1`}>
          2025-26
        </h2>
        <h3 className={`${textColor} text-3xl sm:text-4xl font-bold mb-1`}>
          TECHETHICA
        </h3>
        <h3 className={`${textColor} text-3xl sm:text-4xl font-bold mb-4`}>
          ADMISSION
        </h3>
        <p className={`${textColor} text-xl font-bold mb-8`}>
          OPEN NOW
        </p>
      </div>
      
      {/* Feature List */}
      <div className="space-y-4 mb-8 text-left">
        <div className="flex items-center gap-3">
          <span className="text-xl">🚀</span>
          <span className={`${subTextColor} font-medium text-base`}>Learn Cutting-Edge Technologies</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xl">🌍</span>
          <span className={`${subTextColor} font-medium text-base`}>Integrate Tech with Ethical & Spiritual Growth</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xl">💻</span>
          <span className={`${subTextColor} font-medium text-base`}>Explore Computer Science and AI Ethics</span>
        </div>
      </div>
      
      {/* Apply Now Button */}
      <div className="mt-6">
        <a
          href="/student-registration/new"
          className={`inline-flex items-center justify-center px-6 py-3 rounded-md text-base font-bold transform hover:scale-110 transition-all duration-300 ${buttonBg}`}
        >
          <i className="fa fa-graduation-cap mr-2"></i>
          Apply Now
        </a>
      </div>
    </div>
  );
};

export default AdmissionAnnouncement;