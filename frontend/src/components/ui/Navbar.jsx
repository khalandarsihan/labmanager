import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [viewportInfo, setViewportInfo] = useState({
    isMobile: false,
    isLandscape: false,
    width: 0,
    height: 0
  });
  const { useLightTheme } = useTheme();
  
  // Use refs to store current state values for event handlers
  const menuOpenRef = useRef(isMenuOpen);
  const viewportInfoRef = useRef(viewportInfo);
  
  // Update refs when state changes
  useEffect(() => {
    menuOpenRef.current = isMenuOpen;
  }, [isMenuOpen]);
  
  useEffect(() => {
    viewportInfoRef.current = viewportInfo;
  }, [viewportInfo]);

  // Completely rewritten viewport detection
  const detectViewport = () => {
    // Get accurate dimensions
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    
    // Check for mobile and landscape
    const isMobile = width < 768;
    const isLandscape = width > height;
    
    // Only update state if something changed
    if (
      viewportInfoRef.current.width !== width ||
      viewportInfoRef.current.height !== height ||
      viewportInfoRef.current.isMobile !== isMobile ||
      viewportInfoRef.current.isLandscape !== isLandscape
    ) {
      setViewportInfo({
        isMobile,
        isLandscape,
        width,
        height
      });
    }
  };

  // Set up event listeners with improved handling
  useEffect(() => {
    // Initial detection
    detectViewport();
    
    // Define handler functions that can be removed
    const handleResize = () => {
      detectViewport();
    };
    
    const handleOrientationChange = () => {
      // For orientation changes, use a multi-step approach
      // First immediate check
      detectViewport();
      
      // Delayed checks to catch all browsers/devices
      setTimeout(detectViewport, 100);
      setTimeout(detectViewport, 300);
      setTimeout(detectViewport, 500);
    };
    
    // DOMContentLoaded might be too late, use load instead
    const handleLoad = () => {
      detectViewport();
    };
    
    // Attach all event listeners
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true });
    window.addEventListener('load', handleLoad, { passive: true });
    
    // On mount, check multiple times to catch any delayed rendering
    setTimeout(detectViewport, 100);
    setTimeout(detectViewport, 300);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('load', handleLoad);
    };
  }, []);
  
  // Also check viewport when menu is toggled
  const toggleMenu = () => {
    detectViewport(); // Force viewport check
    setIsMenuOpen(!isMenuOpen);
    setActiveDropdown(null);
    
    // Additional checks after toggle
    setTimeout(detectViewport, 100);
  };

  const toggleDropdown = (dropdownName) => {
    if (viewportInfo.isMobile) {
      setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    }
  };

  // Theme-based styling
  const navBgStyle = useLightTheme 
    ? "bg-gradient-to-r from-purple-50 via-purple-200 to-purple-50"
    : "bg-gradient-to-r from-[#222] to-[#444]";
  
  const logoTextStyle = useLightTheme
    ? "text-purple-700 hover:text-purple-800"
    : "text-amber-300 hover:text-amber-200";
    
  const linkTextStyle = useLightTheme
    ? "text-gray-700 hover:text-purple-700"
    : "text-white hover:text-amber-300";
    
  const dropdownBgStyle = useLightTheme
    ? "bg-purple-50"
    : "bg-[#333]";
    
  const ctaBgStyle = useLightTheme
    ? "bg-purple-500 text-white hover:bg-purple-600"
    : "bg-amber-300 text-[#333] hover:bg-amber-200";
    
  const mobileMenuStyle = useLightTheme
    ? "text-gray-700"
    : "text-white";

  // Extract variables for cleaner JSX
  const { isMobile, isLandscape, width } = viewportInfo;
  const isLargePhone = isMobile && width >= 400;
  
  // IMPORTANT: Set menu height directly with fixed values rather than relying on conditional classes
  const getMenuHeight = () => {
    if (isLandscape) {
      return isLargePhone ? '85vh' : '75vh';
    }
    return 'auto';
  };
  
  // UPDATED: Text and icon sizes with more straightforward calculations
  const textSizeClass = isMobile && isLandscape 
    ? 'text-xs'
    : 'text-sm md:text-base lg:text-lg';
  
  const iconSize = isMobile && isLandscape 
    ? 'text-[14px]'
    : 'text-[18px] md:text-[20px] lg:text-[22px]';
  
  // Create a fixed inline style for menu to ensure it works in all view modes
  const menuStyle = isMenuOpen && isLandscape ? {
    maxHeight: getMenuHeight(),
    overflowY: 'auto',
  } : {};
  
  return (
    <nav className={`${navBgStyle} py-2 px-2 md:py-3 md:px-4 w-full relative top-[1px] z-[1000] -mt-[1px]`}>
      <div className="flex justify-between items-center max-w-[1300px] mx-auto">
        {/* Logo */}
        <a href="/" className={`flex items-center ${isMobile && isLandscape ? 'text-base' : 'text-xl md:text-2xl'} font-bold ${logoTextStyle} no-underline transform hover:scale-105 transition-all duration-300`}>
          <i className={`fa fa-graduation-cap mr-1 ${isMobile && isLandscape ? 'text-[16px]' : 'text-[24px] md:text-[28px]'}`}></i>
          TechEthica
        </a>

        {/* Navbar Menu - Using inline style for more control */}
        <ul 
          className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-start md:items-center list-none md:ml-4 lg:ml-6 gap-1 md:gap-1 lg:gap-2 xl:gap-3 ${
            isMenuOpen ? `absolute top-[50px] left-0 w-full ${dropdownBgStyle} text-left p-2 z-50` : ''
          }`}
          style={menuStyle}
        >
          {/* Home link */}
          <li className="w-full md:w-auto">
            <a href="/" className={`flex items-center no-underline ${linkTextStyle} ${textSizeClass} hover:scale-105 transition-all duration-300 px-2 py-1 md:px-2 md:py-2`}>
              <i className={`fa fa-home mr-1 ${iconSize}`}></i> Home
            </a>
          </li>
          
          {/* About Us link */}
          <li className="w-full md:w-auto">
            <a href="/about-us" className={`flex items-center no-underline ${linkTextStyle} ${textSizeClass} hover:scale-105 transition-all duration-300 px-2 py-1 md:px-2 md:py-2`}>
              <i className={`fa fa-university mr-1 ${iconSize}`}></i> About
            </a>
          </li>

          {/* Courses dropdown */}
          <li className="w-full md:w-auto relative group">
            <div 
              className={`flex items-center justify-between w-full no-underline ${linkTextStyle} ${textSizeClass} md:hover:scale-105 transition-all duration-300 px-2 py-1 md:px-2 md:py-2 cursor-pointer`}
              onClick={() => toggleDropdown('courses')}
            >
              <div className="flex items-center">
                <i className={`fa fa-book mr-1 ${iconSize}`}></i> Courses
              </div>
              {isMobile && <i className={`fa fa-chevron-${activeDropdown === 'courses' ? 'up' : 'down'} ml-1`}></i>}
            </div>
            <ul className={`${isMobile ? (activeDropdown === 'courses' ? 'block pl-4' : 'hidden') : 'hidden md:group-hover:block absolute'} ${!isMobile ? dropdownBgStyle : ''} ${!isMobile ? 'p-2 rounded min-w-[180px] opacity-0 md:group-hover:opacity-100 transition-opacity duration-300' : ''} ${!isMobile ? 'left-0 top-full' : ''}`}>
              <li className="py-1">
                <a href="/courses/catalog" className={`flex items-center no-underline ${linkTextStyle} text-xs md:text-sm lg:text-base`}>
                  <i className="fa fa-list mr-1"></i> Course Catalog
                </a>
              </li>
              <li className="py-1">
                <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-xs md:text-sm lg:text-base`}>
                  <i className="fa fa-graduation-cap mr-1"></i> My Courses
                </a>
              </li>
              <li className="py-1">
                <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-xs md:text-sm lg:text-base`}>
                  <i className="fa fa-tasks mr-1"></i> Assignments
                </a>
              </li>
              <li className="py-1">
                <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-xs md:text-sm lg:text-base`}>
                  <i className="fa fa-check-circle mr-1"></i> Grades
                </a>
              </li>
            </ul>
          </li>

          {/* Live & Learn dropdown */}
          <li className="w-full md:w-auto relative group">
            <div 
              className={`flex items-center justify-between w-full no-underline ${linkTextStyle} ${textSizeClass} md:hover:scale-105 transition-all duration-300 px-2 py-1 md:px-2 md:py-2 cursor-pointer nowrap`}
              onClick={() => toggleDropdown('livelearn')}
            >
              <div className="flex items-center whitespace-nowrap">
                <i className={`fa fa-seedling mr-1 ${iconSize}`}></i> Live&nbsp;&&nbsp;Learn
              </div>
              {isMobile && <i className={`fa fa-chevron-${activeDropdown === 'livelearn' ? 'up' : 'down'} ml-1`}></i>}
            </div>
            <ul className={`${isMobile ? (activeDropdown === 'livelearn' ? 'block pl-4' : 'hidden') : 'hidden md:group-hover:block absolute'} ${!isMobile ? dropdownBgStyle : ''} ${!isMobile ? 'p-2 rounded min-w-[180px] opacity-0 md:group-hover:opacity-100 transition-opacity duration-300' : ''} ${!isMobile ? 'left-0 top-full' : ''}`}>
              <li className="py-1">
                <a href="/student-life" className={`flex items-center no-underline ${linkTextStyle} text-xs md:text-sm lg:text-base`}>
                  <i className="fa fa-users mr-1"></i> Student Life
                </a>
              </li>
              <li className="py-1">
                <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-xs md:text-sm lg:text-base`}>
                  <i className="fa fa-user mr-1"></i> Student Login
                </a>
              </li>
              <li className="py-1">
                <a href="/track-application" className={`flex items-center no-underline ${linkTextStyle} text-xs md:text-sm lg:text-base`}>
                  <i className="fa fa-file-alt mr-1"></i> Track Application
                </a>
              </li>
              <li className="py-1">
                <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-xs md:text-sm lg:text-base`}>
                  <i className="fa fa-life-ring mr-1"></i> Help Center
                </a>
              </li>
            </ul>
          </li>

          {/* Schedule dropdown */}
          <li className="w-full md:w-auto relative group">
            <div 
              className={`flex items-center justify-between w-full no-underline ${linkTextStyle} ${textSizeClass} md:hover:scale-105 transition-all duration-300 px-2 py-1 md:px-2 md:py-2 cursor-pointer`}
              onClick={() => toggleDropdown('schedule')}
            >
              <div className="flex items-center">
                <i className={`fa fa-calendar-alt mr-1 ${iconSize}`}></i> Schedule
              </div>
              {isMobile && <i className={`fa fa-chevron-${activeDropdown === 'schedule' ? 'up' : 'down'} ml-1`}></i>}
            </div>
            <ul className={`${isMobile ? (activeDropdown === 'schedule' ? 'block pl-4' : 'hidden') : 'hidden md:group-hover:block absolute'} ${!isMobile ? dropdownBgStyle : ''} ${!isMobile ? 'p-2 rounded min-w-[180px] opacity-0 md:group-hover:opacity-100 transition-opacity duration-300' : ''} ${!isMobile ? 'left-0 top-full' : ''}`}>
              <li className="py-1">
                <a href="/academic-calendar" className={`flex items-center no-underline ${linkTextStyle} text-xs md:text-sm lg:text-base`}>
                  <i className="fa fa-calendar mr-1"></i> Academic Calendar
                </a>
              </li>
              <li className="py-1">
                <a href="/class-schedule" className={`flex items-center no-underline ${linkTextStyle} text-xs md:text-sm lg:text-base`}>
                  <i className="fa fa-clock mr-1"></i> Class Schedule
                </a>
              </li>
              <li className="py-1">
                <a href="/exam-dates" className={`flex items-center no-underline ${linkTextStyle} text-xs md:text-sm lg:text-base`}>
                  <i className="fa fa-file-alt mr-1"></i> Exam Dates
                </a>
              </li>
              <li className="py-1">
                <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-xs md:text-sm lg:text-base`}>
                  <i className="fa fa-bullhorn mr-1"></i> Events
                </a>
              </li>
            </ul>
          </li>

          {/* Parent Portal dropdown */}
          <li className="w-full md:w-auto relative group">
            <div 
              className={`flex items-center justify-between w-full no-underline ${linkTextStyle} ${textSizeClass} md:hover:scale-105 transition-all duration-300 px-2 py-1 md:px-2 md:py-2 cursor-pointer`}
              onClick={() => toggleDropdown('parent')}
            >
              <div className="flex items-center whitespace-nowrap">
                <i className={`fa fa-user-friends mr-1 ${iconSize}`}></i> Parent&nbsp;Portal
              </div>
              {isMobile && <i className={`fa fa-chevron-${activeDropdown === 'parent' ? 'up' : 'down'} ml-1`}></i>}
            </div>
            <ul className={`${isMobile ? (activeDropdown === 'parent' ? 'block pl-4' : 'hidden') : 'hidden md:group-hover:block absolute'} ${!isMobile ? dropdownBgStyle : ''} ${!isMobile ? 'p-2 rounded min-w-[160px] opacity-0 md:group-hover:opacity-100 transition-opacity duration-300' : ''} ${!isMobile ? 'left-0 top-full' : ''}`}>
              <li className="py-1">
                <a href="/student/dashboard" className={`flex items-center no-underline ${linkTextStyle} text-xs md:text-sm lg:text-base whitespace-nowrap`}>
                  <i className="fa fa-user-tie mr-1"></i> Parent Dashboard
                </a>
              </li>
              <li className="py-1">
                <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-xs md:text-sm lg:text-base whitespace-nowrap`}>
                  <i className="fa fa-chart-bar mr-1"></i> Progress Reports
                </a>
              </li>
              <li className="py-1">
                <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-xs md:text-sm lg:text-base`}>
                  <i className="fa fa-calendar-check mr-1"></i> Attendance
                </a>
              </li>
              <li className="py-1">
                <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-xs md:text-sm lg:text-base`}>
                  <i className="fa fa-credit-card mr-1"></i> Fee Payment
                </a>
              </li>
            </ul>
          </li>

          {/* Contact link */}
          <li className="w-full md:w-auto">
            <a href="/contact-us" className={`flex items-center no-underline ${linkTextStyle} ${textSizeClass} hover:scale-105 transition-all duration-300 px-2 py-1 md:px-2 md:py-2`}>
              <i className={`fa fa-envelope mr-1 ${iconSize}`}></i> Contact
            </a>
          </li>
        </ul>

        <div className="flex items-center ml-auto md:ml-8 lg:ml-12"> 
          {/* CTA Button - Desktop version */}
          <a
            href="/student-registration/new"
            className={`hidden md:flex items-center justify-center ${ctaBgStyle} px-4 py-2 md:px-5 md:py-2 no-underline rounded font-bold transform hover:scale-105 transition-all duration-300 min-w-[150px] md:min-w-[180px] lg:min-w-[200px] whitespace-nowrap text-sm md:text-base lg:text-lg`}
          >
            <i className="fa fa-rocket mr-2 transform transition-transform duration-300"></i>
            Start Learning Today
          </a>
          
          {/* CTA Button for Landscape - Conditional rendering with shared styles */}
          {isMobile && isLandscape && !isMenuOpen && (
            <a
              href="/student-registration/new"
              className={`flex items-center justify-center ${ctaBgStyle} px-2 py-1 text-xs no-underline rounded font-bold transition-all duration-300 whitespace-nowrap mr-3`}
            >
              <i className="fa fa-rocket mr-1"></i>
              {isLargePhone ? 'Start Learning' : 'Enroll'}
            </a>
          )}
          
          {/* Mobile Menu Icon */}
          <div className={`md:hidden cursor-pointer ${mobileMenuStyle} text-xl`} onClick={toggleMenu}>
            <i className={`fa ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </div>
        </div>
      </div>
      
      {/* Mobile-only CTA button - only shown when menu is open */}
      {isMenuOpen && (
        <a
          href="/student-registration/new"
          className={`md:hidden fixed ${isLandscape ? 'bottom-2 right-2 z-[1001]' : 'bottom-4 left-4 right-4'} flex items-center justify-center ${ctaBgStyle} ${isLandscape ? 'px-2 py-1 text-xs' : 'px-3 py-2'} no-underline rounded font-bold transition-all duration-300 whitespace-nowrap ${isLandscape ? 'w-auto' : ''}`}
        >
          <i className="fa fa-rocket mr-1"></i>
          {isLandscape ? (isLargePhone ? "Start Learning" : "Enroll Now") : "Start Learning Today"}
        </a>
      )}
    </nav>
  );
};

export default Navbar;