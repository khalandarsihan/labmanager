// import React, { useState } from 'react';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <nav className="bg-gradient-to-r from-[#222] to-[#444] py-[15px] px-5 w-full relative top-[1px] z-[1000] -mt-[1px]">
//       <div className="flex justify-between items-center max-w-[1300px] mx-auto">
//         {/* Logo */}
//         <a href="#" className="flex items-center text-2xl font-bold text-amber-300 no-underline hover:text-amber-200 transform hover:scale-110 transition-all duration-300">
//           <i className="fa fa-graduation-cap mr-2 text-[28px]"></i>
//           TechEthica
//         </a>

//         {/* Navbar Menu */}
//         <ul className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center list-none md:ml-8 gap-5 ${
//           isMenuOpen ? 'absolute top-[60px] left-0 w-full bg-[#333] text-center p-[10px]' : ''
//         }`}>
//           <li>
//             <a href="/home_react" className="flex items-center no-underline text-white text-base hover:text-amber-300 hover:scale-110 transition-all duration-300 px-3 py-2">
//               <i className="fa fa-home mr-[5px] text-[18px]"></i> Home
//             </a>
//           </li>
          
//           {/* Add About Us link here */}
//           <li>
//             <a href="/about-us" className="flex items-center no-underline text-white text-base hover:text-amber-300 hover:scale-110 transition-all duration-300 px-3 py-2">
//               <i className="fa fa-university mr-[5px] text-[18px]"></i> About
//             </a>
//           </li>

//           <li className="relative group whitespace-nowrap">
//             <a href="#" className="flex items-center no-underline text-white text-base hover:text-amber-300 hover:scale-110 transition-all duration-300 px-3 py-2">
//               <i className="fa fa-book mr-[5px] text-[18px]"></i> Courses
//             </a>
//             <ul className="hidden group-hover:block absolute bg-[#333] p-[10px] rounded min-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//               <li className="py-[5px]">
//                 <a href="/courses/catalog" className="flex items-center no-underline text-white text-sm hover:text-amber-300">
//                   <i className="fa fa-list mr-[5px]"></i> Course Catalog
//                 </a>
//               </li>
//               <li className="py-[5px]">
//                 <a href="#" className="flex items-center no-underline text-white text-sm hover:text-amber-300">
//                   <i className="fa fa-graduation-cap mr-[5px]"></i> My Courses
//                 </a>
//               </li>
//               <li className="py-[5px]">
//                 <a href="#" className="flex items-center no-underline text-white text-sm hover:text-amber-300">
//                   <i className="fa fa-tasks mr-[5px]"></i> Assignments
//                 </a>
//               </li>
//               <li className="py-[5px]">
//                 <a href="#" className="flex items-center no-underline text-white text-sm hover:text-amber-300">
//                   <i className="fa fa-check-circle mr-[5px]"></i> Grades
//                 </a>
//               </li>
//             </ul>
//           </li>

//           <li className="relative group whitespace-nowrap">
//             <a href="#" className="flex items-center no-underline text-white text-base hover:text-amber-300 hover:scale-110 transition-all duration-300 px-3 py-2">
//               <i className="fa fa-calendar-alt mr-[5px] text-[18px]"></i> Schedule
//             </a>
//             <ul className="hidden group-hover:block absolute bg-[#333] p-[10px] rounded min-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//               <li className="py-[5px]">
//                 <a href="/academic-calendar" className="flex items-center no-underline text-white text-sm hover:text-amber-300">
//                   <i className="fa fa-calendar mr-[5px]"></i> Academic Calendar
//                 </a>
//               </li>
//               <li className="py-[5px]">
//                 <a href="/class-schedule" className="flex items-center no-underline text-white text-sm hover:text-amber-300">
//                   <i className="fa fa-clock mr-[5px]"></i> Class Schedule
//                 </a>
//               </li>
//               <li className="py-[5px]">
//                 <a href="/exam-dates" className="flex items-center no-underline text-white text-sm hover:text-amber-300">
//                   <i className="fa fa-file-alt mr-[5px]"></i> Exam Dates
//                 </a>
//               </li>
//               <li className="py-[5px]">
//                 <a href="#" className="flex items-center no-underline text-white text-sm hover:text-amber-300">
//                   <i className="fa fa-bullhorn mr-[5px]"></i> Events
//                 </a>
//               </li>
//             </ul>
//           </li>

//           <li className="relative group whitespace-nowrap">
//             <a href="#" className="flex items-center no-underline text-white text-base hover:text-amber-300 hover:scale-110 transition-all duration-300 px-3 py-2">
//               <i className="fa fa-user-graduate mr-[5px] text-[18px]"></i> Student Access
//             </a>
//             <ul className="hidden group-hover:block absolute bg-[#333] p-[10px] rounded min-w-[160px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//               <li className="py-[5px]">
//                 <a href="#" className="flex items-center no-underline text-white text-sm hover:text-amber-300">
//                   <i className="fa fa-user mr-[5px]"></i> Student Login
//                 </a>
//               </li>
//               <li className="py-[5px]">
//                 <a href="#" className="flex items-center no-underline text-white text-sm hover:text-amber-300">
//                   <i className="fa fa-life-ring mr-[5px]"></i> Help Center
//                 </a>
//               </li>
//             </ul>
//           </li>

//           <li className="relative group whitespace-nowrap">
//             <a href="#" className="flex items-center no-underline text-white text-base hover:text-amber-300 hover:scale-110 transition-all duration-300 px-3 py-2">
//               <i className="fa fa-users mr-[5px] text-[18px]"></i> Parent Portal
//             </a>
//             <ul className="hidden group-hover:block absolute bg-[#333] p-[10px] rounded min-w-[160px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//               <li className="py-[5px]">
//                 <a href="/student/dashboard" className="flex items-center no-underline text-white text-sm hover:text-amber-300">
//                   <i className="fa fa-user-tie mr-[5px]"></i> Parent Dashboard
//                 </a>
//               </li>
//               <li className="py-[5px]">
//                 <a href="#" className="flex items-center no-underline text-white text-sm hover:text-amber-300">
//                   <i className="fa fa-chart-bar mr-[5px]"></i> Progress Reports
//                 </a>
//               </li>
//               <li className="py-[5px]">
//                 <a href="#" className="flex items-center no-underline text-white text-sm hover:text-amber-300">
//                   <i className="fa fa-calendar-check mr-[5px]"></i> Attendance Records
//                 </a>
//               </li>
//               <li className="py-[5px]">
//                 <a href="#" className="flex items-center no-underline text-white text-sm hover:text-amber-300">
//                   <i className="fa fa-credit-card mr-[5px]"></i> Fee Payment
//                 </a>
//               </li>
//             </ul>
//           </li>

//           <li>
//             <a href="#" className="flex items-center no-underline text-white text-base hover:text-amber-300 hover:scale-110 transition-all duration-300 px-3 py-2">
//               <i className="fa fa-envelope mr-[5px] text-[18px]"></i> Contact
//             </a>
//           </li>
//         </ul>

//         {/* CTA Button */}
//         <a
//           href="/student-registration/new"
//           className="hidden md:flex items-center justify-center bg-amber-300 text-[#333] px-6 py-3 no-underline rounded font-bold hover:bg-amber-200 transform hover:scale-110 transition-all duration-300 min-w-[200px] whitespace-nowrap ml-8"
//         >
//           <i className="fa fa-rocket mr-2 transform group-hover:scale-110 transition-transform duration-300"></i>
//           Start Learning Today
//         </a>

//         {/* Mobile Menu Icon */}
//         <div className="md:hidden cursor-pointer text-white text-2xl" onClick={toggleMenu}>
//           <i className="fa fa-bars"></i>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// import React, { useState } from 'react';
// import { useTheme } from './ThemeContext';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const { useLightTheme } = useTheme();

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   // Conditional styles based on theme
//   // const navBgStyle = useLightTheme 
//   //   ? "bg-gradient-to-r from-purple-50 via-purple-200 to-purple-50"
//   //   : "bg-gradient-to-r from-[#222] to-[#444]";
    
//   // const logoTextStyle = useLightTheme
//   //   ? "text-amber-700 hover:text-amber-800"
//   //   : "text-amber-300 hover:text-amber-200";
    
//   // const linkTextStyle = useLightTheme
//   //   ? "text-gray-700 hover:text-amber-700"
//   //   : "text-white hover:text-amber-300";
    
//   // const dropdownBgStyle = useLightTheme
//   //   ? "bg-amber-50"
//   //   : "bg-[#333]";
    
//   // const ctaBgStyle = useLightTheme
//   //   ? "bg-amber-500 text-white hover:bg-amber-600"
//   //   : "bg-amber-300 text-[#333] hover:bg-amber-200";
    
//   // const mobileMenuStyle = useLightTheme
//   //   ? "text-gray-700"
//   //   : "text-white";

//   const navBgStyle = useLightTheme 
//   ? "bg-gradient-to-r from-purple-50 via-purple-200 to-purple-50"
//   : "bg-gradient-to-r from-[#222] to-[#444]";
  
// const logoTextStyle = useLightTheme
//   ? "text-purple-700 hover:text-purple-800"
//   : "text-amber-300 hover:text-amber-200";
  
// const linkTextStyle = useLightTheme
//   ? "text-gray-700 hover:text-purple-700"
//   : "text-white hover:text-amber-300";
  
// const dropdownBgStyle = useLightTheme
//   ? "bg-purple-50"
//   : "bg-[#333]";
  
// const ctaBgStyle = useLightTheme
//   ? "bg-purple-500 text-white hover:bg-purple-600"
//   : "bg-amber-300 text-[#333] hover:bg-amber-200";
  
// const mobileMenuStyle = useLightTheme
//   ? "text-gray-700"
//   : "text-white";

//   return (
//     <nav className={`${navBgStyle} py-[15px] px-5 w-full relative top-[1px] z-[1000] -mt-[1px]`}>
//       <div className="flex justify-between items-center max-w-[1300px] mx-auto">
//         {/* Logo */}
//         <a href="#" className={`flex items-center text-2xl font-bold ${logoTextStyle} no-underline transform hover:scale-110 transition-all duration-300`}>
//           <i className="fa fa-graduation-cap mr-2 text-[28px]"></i>
//           TechEthica
//         </a>

//         {/* Navbar Menu */}
//         <ul className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center list-none md:ml-8 gap-5 ${
//           isMenuOpen ? `absolute top-[60px] left-0 w-full ${dropdownBgStyle} text-center p-[10px]` : ''
//         }`}>
//           <li>
//             <a href="/home_react" className={`flex items-center no-underline ${linkTextStyle} text-base hover:scale-110 transition-all duration-300 px-3 py-2`}>
//               <i className="fa fa-home mr-[5px] text-[18px]"></i> Home
//             </a>
//           </li>
          
//           {/* About Us link */}
//           <li>
//             <a href="/about-us" className={`flex items-center no-underline ${linkTextStyle} text-base hover:scale-110 transition-all duration-300 px-3 py-2`}>
//               <i className="fa fa-university mr-[5px] text-[18px]"></i> About
//             </a>
//           </li>

//           {/* Courses dropdown */}
//           <li className="relative group whitespace-nowrap">
//             <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-base hover:scale-110 transition-all duration-300 px-3 py-2`}>
//               <i className="fa fa-book mr-[5px] text-[18px]"></i> Courses
//             </a>
//             <ul className={`hidden group-hover:block absolute ${dropdownBgStyle} p-[10px] rounded min-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
//               <li className="py-[5px]">
//                 <a href="/courses/catalog" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
//                   <i className="fa fa-list mr-[5px]"></i> Course Catalog
//                 </a>
//               </li>
//               <li className="py-[5px]">
//                 <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
//                   <i className="fa fa-graduation-cap mr-[5px]"></i> My Courses
//                 </a>
//               </li>
//               <li className="py-[5px]">
//                 <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
//                   <i className="fa fa-tasks mr-[5px]"></i> Assignments
//                 </a>
//               </li>
//               <li className="py-[5px]">
//                 <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
//                   <i className="fa fa-check-circle mr-[5px]"></i> Grades
//                 </a>
//               </li>
//             </ul>
//           </li>

//           {/* Schedule dropdown */}
//           <li className="relative group whitespace-nowrap">
//             <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-base hover:scale-110 transition-all duration-300 px-3 py-2`}>
//               <i className="fa fa-calendar-alt mr-[5px] text-[18px]"></i> Schedule
//             </a>
//             <ul className={`hidden group-hover:block absolute ${dropdownBgStyle} p-[10px] rounded min-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
//               <li className="py-[5px]">
//                 <a href="/academic-calendar" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
//                   <i className="fa fa-calendar mr-[5px]"></i> Academic Calendar
//                 </a>
//               </li>
//               <li className="py-[5px]">
//                 <a href="/class-schedule" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
//                   <i className="fa fa-clock mr-[5px]"></i> Class Schedule
//                 </a>
//               </li>
//               <li className="py-[5px]">
//                 <a href="/exam-dates" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
//                   <i className="fa fa-file-alt mr-[5px]"></i> Exam Dates
//                 </a>
//               </li>
//               <li className="py-[5px]">
//                 <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
//                   <i className="fa fa-bullhorn mr-[5px]"></i> Events
//                 </a>
//               </li>
//             </ul>
//           </li>

//           {/* Student Access dropdown */}
//           <li className="relative group whitespace-nowrap">
//             <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-base hover:scale-110 transition-all duration-300 px-3 py-2`}>
//               <i className="fa fa-user-graduate mr-[5px] text-[18px]"></i> Student Access
//             </a>
//             <ul className={`hidden group-hover:block absolute ${dropdownBgStyle} p-[10px] rounded min-w-[160px] opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
//               <li className="py-[5px]">
//                 <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
//                   <i className="fa fa-user mr-[5px]"></i> Student Login
//                 </a>
//               </li>
//               <li className="py-[5px]">
//                 <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
//                   <i className="fa fa-life-ring mr-[5px]"></i> Help Center
//                 </a>
//               </li>
//             </ul>
//           </li>

//           {/* Parent Portal dropdown */}
//           <li className="relative group whitespace-nowrap">
//             <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-base hover:scale-110 transition-all duration-300 px-3 py-2`}>
//               <i className="fa fa-users mr-[5px] text-[18px]"></i> Parent Portal
//             </a>
//             <ul className={`hidden group-hover:block absolute ${dropdownBgStyle} p-[10px] rounded min-w-[160px] opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
//               <li className="py-[5px]">
//                 <a href="/student/dashboard" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
//                   <i className="fa fa-user-tie mr-[5px]"></i> Parent Dashboard
//                 </a>
//               </li>
//               <li className="py-[5px]">
//                 <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
//                   <i className="fa fa-chart-bar mr-[5px]"></i> Progress Reports
//                 </a>
//               </li>
//               <li className="py-[5px]">
//                 <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
//                   <i className="fa fa-calendar-check mr-[5px]"></i> Attendance Records
//                 </a>
//               </li>
//               <li className="py-[5px]">
//                 <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
//                   <i className="fa fa-credit-card mr-[5px]"></i> Fee Payment
//                 </a>
//               </li>
//             </ul>
//           </li>

//           {/* Contact link */}
//           <li>
//             <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-base hover:scale-110 transition-all duration-300 px-3 py-2`}>
//               <i className="fa fa-envelope mr-[5px] text-[18px]"></i> Contact
//             </a>
//           </li>
//         </ul>

//         {/* CTA Button */}
//         <a
//           href="/student-registration/new"
//           className={`hidden md:flex items-center justify-center ${ctaBgStyle} px-6 py-3 no-underline rounded font-bold transform hover:scale-110 transition-all duration-300 min-w-[200px] whitespace-nowrap ml-8`}
//         >
//           <i className="fa fa-rocket mr-2 transform group-hover:scale-110 transition-transform duration-300"></i>
//           Start Learning Today
//         </a>

//         {/* Mobile Menu Icon */}
//         <div className={`md:hidden cursor-pointer ${mobileMenuStyle} text-2xl`} onClick={toggleMenu}>
//           <i className="fa fa-bars"></i>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState } from 'react';
import { useTheme } from './ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { useLightTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
    <nav className={`${navBgStyle} py-[15px] px-5 w-full relative top-[1px] z-[1000] -mt-[1px]`}>
      <div className="flex justify-between items-center max-w-[1300px] mx-auto">
        {/* Logo */}
        <a href="#" className={`flex items-center text-2xl font-bold ${logoTextStyle} no-underline transform hover:scale-110 transition-all duration-300`}>
          <i className="fa fa-graduation-cap mr-2 text-[28px]"></i>
          TechEthica
        </a>

        {/* Navbar Menu */}
        <ul className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center list-none md:ml-8 gap-5 ${
          isMenuOpen ? `absolute top-[60px] left-0 w-full ${dropdownBgStyle} text-center p-[10px]` : ''
        }`}>
          <li>
            <a href="/home_react" className={`flex items-center no-underline ${linkTextStyle} text-base hover:scale-110 transition-all duration-300 px-3 py-2`}>
              <i className="fa fa-home mr-[5px] text-[18px]"></i> Home
            </a>
          </li>
          
          {/* About Us link */}
          <li>
            <a href="/about-us" className={`flex items-center no-underline ${linkTextStyle} text-base hover:scale-110 transition-all duration-300 px-3 py-2`}>
              <i className="fa fa-university mr-[5px] text-[18px]"></i> About
            </a>
          </li>

          {/* Courses dropdown */}
          <li className="relative group whitespace-nowrap">
            <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-base hover:scale-110 transition-all duration-300 px-3 py-2`}>
              <i className="fa fa-book mr-[5px] text-[18px]"></i> Courses
            </a>
            <ul className={`hidden group-hover:block absolute ${dropdownBgStyle} p-[10px] rounded min-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
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

          {/* Student Resources dropdown (combines Student Life and Student Access) */}
          <li className="relative group whitespace-nowrap">
            <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-base hover:scale-110 transition-all duration-300 px-3 py-2`}>
              <i className="fa fa-seedling mr-[5px] text-[18px]"></i> Live & Learn
            </a>
            <ul className={`hidden group-hover:block absolute ${dropdownBgStyle} p-[10px] rounded min-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
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
              {/* <li className="py-[5px]">
                <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
                  <i className="fa fa-id-card mr-[5px]"></i> Student Portal
                </a>
              </li> */}
              <li className="py-[5px]">
                <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-sm`}>
                  <i className="fa fa-life-ring mr-[5px]"></i> Help Center
                </a>
              </li>
            </ul>
          </li>

          {/* Schedule dropdown */}
          <li className="relative group whitespace-nowrap">
            <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-base hover:scale-110 transition-all duration-300 px-3 py-2`}>
              <i className="fa fa-calendar-alt mr-[5px] text-[18px]"></i> Schedule
            </a>
            <ul className={`hidden group-hover:block absolute ${dropdownBgStyle} p-[10px] rounded min-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
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
          <li className="relative group whitespace-nowrap">
            <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-base hover:scale-110 transition-all duration-300 px-3 py-2`}>
              <i className="fa fa-user-friends mr-[5px] text-[18px]"></i> Parent Portal
            </a>
            <ul className={`hidden group-hover:block absolute ${dropdownBgStyle} p-[10px] rounded min-w-[160px] opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
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
                  <i className="fa fa-calendar-check mr-[5px]"></i> Attendance Records
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
          <li>
            <a href="#" className={`flex items-center no-underline ${linkTextStyle} text-base hover:scale-110 transition-all duration-300 px-3 py-2`}>
              <i className="fa fa-envelope mr-[5px] text-[18px]"></i> Contact
            </a>
          </li>
        </ul>

        {/* CTA Button */}
        <a
          href="/student-registration/new"
          className={`hidden md:flex items-center justify-center ${ctaBgStyle} px-6 py-3 no-underline rounded font-bold transform hover:scale-110 transition-all duration-300 min-w-[200px] whitespace-nowrap ml-8`}
        >
          <i className="fa fa-rocket mr-2 transform group-hover:scale-110 transition-transform duration-300"></i>
          Start Learning Today
        </a>

        {/* Mobile Menu Icon */}
        <div className={`md:hidden cursor-pointer ${mobileMenuStyle} text-2xl`} onClick={toggleMenu}>
          <i className="fa fa-bars"></i>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;