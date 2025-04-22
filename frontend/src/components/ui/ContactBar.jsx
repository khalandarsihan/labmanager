import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';

const ContactBar = () => {
  const { useLightTheme } = useTheme();
  const [isLandscape, setIsLandscape] = useState(false);

  // Check viewport orientation
  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    // Initial check
    checkOrientation();
    
    // Add event listener
    window.addEventListener('resize', checkOrientation);
    
    // Clean up
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);
  
  const bgStyle = useLightTheme 
    ? "bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50 text-gray-800 hover:from-purple-100 hover:via-purple-200 hover:to-purple-100" 
    : "bg-gradient-to-r from-gray-900 via-gray-800 to-[#444444] text-gray-200 hover:from-[#222222] hover:via-[#333333] hover:to-amber-100";

  const titleStyle = useLightTheme
    ? "text-purple-700"
    : "text-amber-300";
    
  const linkStyle = useLightTheme 
    ? "text-gray-700 hover:text-purple-600" 
    : "text-gray-200 hover:text-amber-300";

  return (
    <div className={`relative ${bgStyle} text-center py-2 sm:py-4 px-3 sm:px-6 transition-all duration-700 ease-in-out shadow-lg z-50`}>
      {/* For regular layout */}
      <div className={`${isLandscape ? 'hidden' : 'block'}`}>
        <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide ${titleStyle} drop-shadow-lg`}>
          Let's Connect
        </h1>
        <div className="contact-info mt-2 sm:mt-4 text-sm sm:text-lg flex flex-col sm:flex-row justify-center sm:gap-6 items-center">
          <a
            href="tel:+91 90745 91600"
            className={`inline-flex items-center ${linkStyle} font-semibold transition duration-300 ease-in-out hover:scale-110 focus:ring-0 focus:outline-none`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            +91 90745 91600
          </a>
          <span className={`hidden sm:block ${useLightTheme ? "text-gray-500" : "text-gray-400"}`}>|</span>
          <a
            href="mailto:info@techethica.in"
            className={`inline-flex items-center ${linkStyle} font-semibold transition duration-300 ease-in-out hover:scale-110 focus:ring-0 focus:outline-none mt-1 sm:mt-0`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            info@techethica.in
          </a>
        </div>
      </div>

      {/* For landscape mobile layout - compact version */}
      <div className={`${!isLandscape ? 'hidden' : 'block'} flex justify-center items-center`}>
        <h1 className={`text-xl font-bold ${titleStyle} drop-shadow-lg mr-4`}>
          Let's Connect:
        </h1>
        <div className="flex items-center space-x-6">
          <a
            href="tel:+91 90745 91600"
            className={`inline-flex items-center ${linkStyle} font-semibold transition duration-300 ease-in-out hover:scale-110 focus:ring-0 focus:outline-none text-sm`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            +91 90745 91600
          </a>
          <span className={useLightTheme ? "text-gray-500" : "text-gray-400"}>|</span>
          <a
            href="mailto:info@techethica.in"
            className={`inline-flex items-center ${linkStyle} font-semibold transition duration-300 ease-in-out hover:scale-110 focus:ring-0 focus:outline-none text-sm`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            info@techethica.in
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactBar;