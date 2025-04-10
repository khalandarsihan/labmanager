import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { useLightTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile screen size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Reset active dropdown when toggling menu
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdownName) => {
    if (isMobile) {
      setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    }
  };

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

  return (
    <nav className={`${navBgStyle} py-3 px-4 md:py-[15px] md:px-5 w-full relative top-[1px] z-[1000] -mt-[1px]`}>
      <div className="flex justify-between items-center max-w-[1300px] mx-auto">
        {/* Logo */}
        <a href="/" className={`flex items-center text-xl md:text-2xl font-bold ${logoTextStyle} no-underline transform hover:scale-110 transition-all duration-300`}>
          <i className="fa fa-graduation-cap mr-2 text-[24px] md:text-[28px]"></i>
          TechEthica
        </a>

        {/* Mobile Menu Icon */}
        <div className={`md:hidden cursor-pointer ${mobileMenuStyle} text-2xl`} onClick={toggleMenu}>
          <i className={`fa ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </div>

        {/* Navbar Menu - Desktop shows horizontally, Mobile shows vertically when open */}
        <ul className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-start md:items-center list-none md:ml-8 gap-2 md:gap-5 ${
          isMenuOpen ? `absolute top-[60px] left-0 w-full ${dropdownBgStyle} text-left p-4 z-50` : ''
        }`}>
          <li className="w-full md:w-auto">
            <a href="/" className={`flex items-center no-underline ${linkTextStyle} text-base hover:scale-110 transition-all duration-300 px-3 py-2`}>
              <i className="fa fa-home mr-[5px] text-[18px]"></i> Home
            </a>
          </li>
          
          {/* About Us link */}
          <li className="w-full md:w-auto">
            <a href="/about-us" className={`flex items-center no-underline ${linkTextStyle} text-base hover:scale-110 transition-all duration-300 px-3 py-2`}>
              <i className="fa fa-university mr-[5px] text-[18px]"></i> About
            </a>
          </li>

          {/* Courses dropdown */}
          <li className="w-full md:w-auto relative whitespace-nowrap">
            <div 
              className={`flex items-center justify-between w-full no-underline ${linkTextStyle} text-base md:hover:scale-110 transition-all duration-300 px-3 py-2 cursor-pointer`}
              onClick={() => toggleDropdown('courses')}
            >
              <div className="flex items-center">
                <i className="fa fa-book mr-[5px] text-[18px]"></i> Courses
              </div>
              {isMobile && <i className={`fa fa-chevron-${activeDropdown === 'courses' ? 'up' : 'down'} ml-2`}></i>}
            </div>
            <ul className={`${isMobile ? (activeDropdown === 'courses' ? 'block pl-6' : 'hidden') : 'hidden md:group-hover:block absolute'} ${!isMobile ? dropdownBgStyle : ''} ${!isMobile ? 'p-[10px] rounded min-w-[200px] opacity-0 md:group-hover:opacity-100 transition-opacity duration-300' : ''} ${!isMobile ? 'left-0 top-full' : ''}`}>
              <li className="py-[5px]">
                <a href="/courses/catalog" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
                  <i className="fa fa-list mr-[5px]"></i> Course Catalog
                </a>
              </li>
              <li className="py-[5px]">
                <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
                  <i className="fa fa-graduation-cap mr-[5px]"></i> My Courses
                </a>
              </li>
              <li className="py-[5px]">
                <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
                  <i className="fa fa-tasks mr-[5px]"></i> Assignments
                </a>
              </li>
              <li className="py-[5px]">
                <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
                  <i className="fa fa-check-circle mr-[5px]"></i> Grades
                </a>
              </li>
            </ul>
          </li>

          {/* Live & Learn dropdown */}
          <li className="w-full md:w-auto relative whitespace-nowrap">
            <div 
              className={`flex items-center justify-between w-full no-underline ${linkTextStyle} text-base md:hover:scale-110 transition-all duration-300 px-3 py-2 cursor-pointer`}
              onClick={() => toggleDropdown('livelearn')}
            >
              <div className="flex items-center">
                <i className="fa fa-seedling mr-[5px] text-[18px]"></i> Live & Learn
              </div>
              {isMobile && <i className={`fa fa-chevron-${activeDropdown === 'livelearn' ? 'up' : 'down'} ml-2`}></i>}
            </div>
            <ul className={`${isMobile ? (activeDropdown === 'livelearn' ? 'block pl-6' : 'hidden') : 'hidden md:group-hover:block absolute'} ${!isMobile ? dropdownBgStyle : ''} ${!isMobile ? 'p-[10px] rounded min-w-[200px] opacity-0 md:group-hover:opacity-100 transition-opacity duration-300' : ''} ${!isMobile ? 'left-0 top-full' : ''}`}>
              <li className="py-[5px]">
                <a href="/student-life" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
                  <i className="fa fa-users mr-[5px]"></i> Student Life
                </a>
              </li>
              <li className="py-[5px]">
                <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
                  <i className="fa fa-user mr-[5px]"></i> Student Login
                </a>
              </li>
              <li className="py-[5px]">
                <a href="/track-application" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
                  <i className="fa fa-file-alt mr-[5px]"></i> Track Application
                </a>
              </li>
              <li className="py-[5px]">
                <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
                  <i className="fa fa-life-ring mr-[5px]"></i> Help Center
                </a>
              </li>
            </ul>
          </li>

          {/* Schedule dropdown */}
          <li className="w-full md:w-auto relative whitespace-nowrap">
            <div 
              className={`flex items-center justify-between w-full no-underline ${linkTextStyle} text-base md:hover:scale-110 transition-all duration-300 px-3 py-2 cursor-pointer`}
              onClick={() => toggleDropdown('schedule')}
            >
              <div className="flex items-center">
                <i className="fa fa-calendar-alt mr-[5px] text-[18px]"></i> Schedule
              </div>
              {isMobile && <i className={`fa fa-chevron-${activeDropdown === 'schedule' ? 'up' : 'down'} ml-2`}></i>}
            </div>
            <ul className={`${isMobile ? (activeDropdown === 'schedule' ? 'block pl-6' : 'hidden') : 'hidden md:group-hover:block absolute'} ${!isMobile ? dropdownBgStyle : ''} ${!isMobile ? 'p-[10px] rounded min-w-[200px] opacity-0 md:group-hover:opacity-100 transition-opacity duration-300' : ''} ${!isMobile ? 'left-0 top-full' : ''}`}>
              <li className="py-[5px]">
                <a href="/academic-calendar" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
                  <i className="fa fa-calendar mr-[5px]"></i> Academic Calendar
                </a>
              </li>
              <li className="py-[5px]">
                <a href="/class-schedule" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
                  <i className="fa fa-clock mr-[5px]"></i> Class Schedule
                </a>
              </li>
              <li className="py-[5px]">
                <a href="/exam-dates" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
                  <i className="fa fa-file-alt mr-[5px]"></i> Exam Dates
                </a>
              </li>
              <li className="py-[5px]">
                <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
                  <i className="fa fa-bullhorn mr-[5px]"></i> Events
                </a>
              </li>
            </ul>
          </li>

          {/* Parent Portal dropdown */}
          <li className="w-full md:w-auto relative whitespace-nowrap">
            <div 
              className={`flex items-center justify-between w-full no-underline ${linkTextStyle} text-base md:hover:scale-110 transition-all duration-300 px-3 py-2 cursor-pointer`}
              onClick={() => toggleDropdown('parent')}
            >
              <div className="flex items-center">
                <i className="fa fa-user-friends mr-[5px] text-[18px]"></i> Parent Portal
              </div>
              {isMobile && <i className={`fa fa-chevron-${activeDropdown === 'parent' ? 'up' : 'down'} ml-2`}></i>}
            </div>
            <ul className={`${isMobile ? (activeDropdown === 'parent' ? 'block pl-6' : 'hidden') : 'hidden md:group-hover:block absolute'} ${!isMobile ? dropdownBgStyle : ''} ${!isMobile ? 'p-[10px] rounded min-w-[160px] opacity-0 md:group-hover:opacity-100 transition-opacity duration-300' : ''} ${!isMobile ? 'left-0 top-full' : ''}`}>
              <li className="py-[5px]">
                <a href="/student/dashboard" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
                  <i className="fa fa-user-tie mr-[5px]"></i> Parent Dashboard
                </a>
              </li>
              <li className="py-[5px]">
                <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
                  <i className="fa fa-chart-bar mr-[5px]"></i> Progress Reports
                </a>
              </li>
              <li className="py-[5px]">
                <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
                  <i className="fa fa-calendar-check mr-[5px]"></i> Attendance
                </a>
              </li>
              <li className="py-[5px]">
                <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
                  <i className="fa fa-credit-card mr-[5px]"></i> Fee Payment
                </a>
              </li>
            </ul>
          </li>

          {/* Contact link */}
          <li className="w-full md:w-auto">
            <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-base hover:scale-110 transition-all duration-300 px-3 py-2`}>
              <i className="fa fa-envelope mr-[5px] text-[18px]"></i> Contact
            </a>
          </li>
        </ul>

        {/* CTA Button - Only visible on desktop, mobile gets version in menu */}
        <a
          href="/student-registration/new"
          className={`hidden md:flex items-center justify-center ${ctaBgStyle} px-4 py-2 md:px-6 md:py-3 no-underline rounded font-bold transform hover:scale-110 transition-all duration-300 min-w-[150px] md:min-w-[200px] whitespace-nowrap md:ml-8`}
        >
          <i className="fa fa-rocket mr-2 transform group-hover:scale-110 transition-transform duration-300"></i>
          Start Learning Today
        </a>
        
        {/* Mobile-only CTA button - only shown when menu is open */}
        {isMenuOpen && (
          <a
            href="/student-registration/new"
            className={`md:hidden absolute bottom-4 left-4 right-4 flex items-center justify-center ${ctaBgStyle} px-4 py-3 no-underline rounded font-bold transition-all duration-300 whitespace-nowrap`}
            style={{ display: isMenuOpen ? 'flex' : 'none' }}
          >
            <i className="fa fa-rocket mr-2"></i>
            Start Learning Today
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;