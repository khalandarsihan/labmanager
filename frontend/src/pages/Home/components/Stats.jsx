// import React from 'react';
// import './Stats.css';
// import { useTheme } from '../../../components/ui/ThemeContext';

// const Stats = () => {
//   const { useLightTheme, themeStyles } = useTheme();
  
//   const stats = [
//     {
//       icon: 'fas fa-user-graduate',
//       value: '10,000+',
//       label: 'Students'
//     },
//     {
//       icon: 'fas fa-book-open',
//       value: '200+',
//       label: 'Courses'
//     },
//     {
//       icon: 'fas fa-chalkboard-teacher',
//       value: '50+',
//       label: 'Expert Instructors'
//     },
//     {
//       icon: 'fas fa-star',
//       value: '95%',
//       label: 'Satisfaction Rate'
//     }
//   ];

//   // Theme-dependent styles
//   const sectionBg = useLightTheme ? 'bg-amber-50' : 'bg-[#1a1f2e]';
//   const gradientFrom = useLightTheme ? 'from-amber-50' : 'from-[#1a1f2e]';
//   const gradientTo = useLightTheme ? 'to-amber-100' : 'to-[#131720]';

//   return (
//     <>
//       <section className={`py-20 ${sectionBg}`}>
//         <div className="container mx-auto px-6">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {stats.map((stat, index) => (
//               <StatCard key={index} {...stat} useLightTheme={useLightTheme} />
//             ))}
//           </div>
//         </div>
//       </section>
//       {/* Spacer with gradient */}
//       <div className={`h-20 bg-gradient-to-b ${gradientFrom} ${gradientTo}`}></div>
//     </>
//   );
// };

// const StatCard = ({ icon, value, label, useLightTheme }) => {
//   const cardBg = useLightTheme ? 'bg-white/70' : 'bg-[#232836]';
//   const borderColor = useLightTheme ? 'border-amber-200 hover:border-amber-500' : 'border-gray-700 hover:border-amber-300';
//   const iconColor = useLightTheme ? 'text-amber-600' : 'text-amber-300';
//   const valueColor = useLightTheme ? 'text-amber-700' : 'text-amber-300';
//   const labelColor = useLightTheme ? 'text-gray-700' : 'text-gray-300';

//   return (
//     <div className={`stat-card counter ${cardBg} rounded-lg p-6 text-center border ${borderColor} transition-all duration-300 group`}>
//       <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">
//         <i className={`${icon} ${iconColor} text-3xl`}></i>
//       </div>
//       <div className={`text-3xl font-bold ${valueColor} mb-2`}>{value}</div>
//       <div className={labelColor}>{label}</div>
//     </div>
//   );
// };

// export default Stats;

// import React from 'react';
// import './Stats.css';
// import { useTheme } from '../../../components/ui/ThemeContext';

// const Stats = () => {
//   const { useLightTheme, themeStyles } = useTheme();
  
//   const stats = [
//     {
//       icon: 'fas fa-user-graduate',
//       value: '10,00+',
//       label: 'Students'
//     },
//     {
//       icon: 'fas fa-book-open',
//       value: '200+',
//       label: 'Courses'
//     },
//     {
//       icon: 'fas fa-chalkboard-teacher',
//       value: '50+',
//       label: 'Expert Instructors'
//     },
//     {
//       icon: 'fas fa-star',
//       value: '95%',
//       label: 'Satisfaction Rate'
//     }
//   ];

//   // Theme-dependent styles with updated dark theme background
//   const sectionBg = useLightTheme ? 'bg-purple-50' : 'bg-gray-900';
  
//   return (
//     <>
//       <section className={`py-20 ${useLightTheme ? 'bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-[#444444]'}`}>
//         <div className="container mx-auto px-6">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {stats.map((stat, index) => (
//               <StatCard key={index} {...stat} useLightTheme={useLightTheme} />
//             ))}
//           </div>
//         </div>
//       </section>
//       {/* Spacer with gradient */}
//       <div className={`h-20 ${useLightTheme ? 'bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-[#444444]'}`}></div>
//     </>
//   );
// };

// const StatCard = ({ icon, value, label, useLightTheme }) => {
//   const cardBg = useLightTheme ? 'bg-white/70' : 'bg-[#232836]';
//   const borderColor = useLightTheme ? 'border-purple-200 hover:border-purple-500' : 'border-gray-700 hover:border-amber-300';
//   const iconColor = useLightTheme ? 'text-purple-600' : 'text-amber-300';
//   const valueColor = useLightTheme ? 'text-purple-700' : 'text-amber-300';
//   const labelColor = useLightTheme ? 'text-gray-700' : 'text-gray-300';

//   return (
//     <div className={`stat-card counter ${cardBg} rounded-lg p-6 text-center border ${borderColor} transition-all duration-300 group`}>
//       <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">
//         <i className={`${icon} ${iconColor} text-3xl`}></i>
//       </div>
//       <div className={`text-3xl font-bold ${valueColor} mb-2`}>{value}</div>
//       <div className={labelColor}>{label}</div>
//     </div>
//   );
// };

// export default Stats;

import React from 'react';
import './Stats.css';
import { useTheme } from '../../../components/ui/ThemeContext';

const Stats = () => {
  const { useLightTheme, themeStyles } = useTheme();
  
  const stats = [
    {
      icon: 'fas fa-user-graduate',
      value: '500+',
      label: 'Students'
    },
    {
      icon: 'fas fa-book-open',
      value: '20+',
      label: 'Courses'
    },
    {
      icon: 'fas fa-chalkboard-teacher',
      value: '15+',
      label: 'Expert Instructors'
    },
    {
      icon: 'fas fa-star',
      value: '95%',
      label: 'Satisfaction Rate'
    }
  ];

  // Theme-dependent styles with updated dark theme background
  const sectionBg = useLightTheme ? 'bg-purple-50' : 'bg-gray-900';
  
  // Define colors based on theme for geo patterns
  const lineColor = useLightTheme 
    ? "bg-purple-500" // Darker purple for better visibility
    : "bg-amber-300";
    
  const borderColor = useLightTheme 
    ? "border-purple-600" // Darker purple for better visibility
    : "border-amber-300";
    
  // Different opacity for different themes
  const linesOpacity = useLightTheme ? "opacity-30" : "opacity-10";
  const elementsOpacity = useLightTheme ? "/60" : "/20"; // For the fractional opacities in tailwind

  return (
    <>
      <section className={`py-20 relative overflow-hidden ${useLightTheme ? 'bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-[#444444]'}`}>
        {/* Geometric Patterns - Abstract Lines */}
        <div className={`absolute inset-0 ${linesOpacity} pointer-events-none`}>
          <div className={`absolute h-full w-px ${lineColor}/70 left-1/4 transform -skew-x-12`} />
          <div className={`absolute h-full w-px ${lineColor}/60 left-1/2 transform skew-x-12`} />
          <div className={`absolute h-full w-px ${lineColor}/70 left-3/4 transform -skew-x-12`} />
          <div className={`absolute w-full h-px ${lineColor}/60 top-1/4 transform -skew-y-12`} />
          <div className={`absolute w-full h-px ${lineColor}/70 top-1/2 transform skew-y-12`} />
          <div className={`absolute w-full h-px ${lineColor}/60 top-3/4 transform -skew-y-12`} />
        </div>
        
        {/* Geo Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Diagonal lines */}
          <div className={`absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 ${borderColor}${elementsOpacity} transform -rotate-12`} />
          <div className={`absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 ${borderColor}${elementsOpacity} transform rotate-12`} />
          <div className={`absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 ${borderColor}${elementsOpacity} transform rotate-12`} />
          <div className={`absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 ${borderColor}${elementsOpacity} transform -rotate-12`} />
          
          {/* Floating geometric shapes */}
          <div className={`absolute top-20 left-20 w-16 h-16 border-2 ${borderColor}${elementsOpacity} rounded-lg backdrop-blur-sm transform rotate-45 animate-float-diagonal delay-300`} />
          <div className={`absolute bottom-20 right-20 w-12 h-12 border-2 ${borderColor}${elementsOpacity} rounded-full backdrop-blur-sm animate-float-circle delay-1000`} />
          <div className={`absolute top-1/3 right-1/4 w-10 h-10 border-2 ${borderColor}${elementsOpacity} transform -rotate-12 backdrop-blur-sm animate-float-up delay-700`} />
          <div className={`absolute bottom-1/3 left-1/5 w-14 h-14 border-2 ${borderColor}${elementsOpacity} rounded-full backdrop-blur-sm animate-float-side delay-900`} />
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} useLightTheme={useLightTheme} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Spacer with gradient and geo pattern */}
      <div className={`h-20 relative overflow-hidden ${useLightTheme ? 'bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900'}`}>
        {/* Horizontal zigzag pattern */}
        {/* <div className={`absolute inset-0 ${linesOpacity} pointer-events-none`}>
          <div className={`absolute left-0 right-0 h-px ${lineColor}/70 top-1/2 transform -translate-y-1/2 zigzag-pattern`} />
        </div> */}
        
        {/* Geo corner accents */}
        <div className={`absolute left-0 top-0 w-16 h-16 border-l-2 border-t-2 ${borderColor}${elementsOpacity}`} />
        <div className={`absolute right-0 top-0 w-16 h-16 border-r-2 border-t-2 ${borderColor}${elementsOpacity}`} />
        <div className={`absolute left-0 bottom-0 w-16 h-16 border-l-2 border-b-2 ${borderColor}${elementsOpacity}`} />
        <div className={`absolute right-0 bottom-0 w-16 h-16 border-r-2 border-b-2 ${borderColor}${elementsOpacity}`} />
      </div>
    </>
  );
};

const StatCard = ({ icon, value, label, useLightTheme }) => {
  const cardBg = useLightTheme ? 'bg-white/70' : 'bg-[#232836]';
  const borderColor = useLightTheme ? 'border-purple-200 hover:border-purple-500' : 'border-gray-700 hover:border-amber-300';
  const iconColor = useLightTheme ? 'text-purple-600' : 'text-amber-300';
  const valueColor = useLightTheme ? 'text-purple-700' : 'text-amber-300';
  const labelColor = useLightTheme ? 'text-gray-700' : 'text-gray-300';

  return (
    <div className={`stat-card counter ${cardBg} rounded-lg p-6 text-center border ${borderColor} transition-all duration-300 group relative overflow-hidden`}>
      {/* Card corner accents */}
      <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${useLightTheme ? 'border-purple-300' : 'border-amber-300/30'}`}></div>
      <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${useLightTheme ? 'border-purple-300' : 'border-amber-300/30'}`}></div>
      <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${useLightTheme ? 'border-purple-300' : 'border-amber-300/30'}`}></div>
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${useLightTheme ? 'border-purple-300' : 'border-amber-300/30'}`}></div>
      
      {/* Diagonal line accent */}
      <div className={`absolute -top-1 -right-1 w-8 h-8 transform rotate-45 ${useLightTheme ? 'bg-purple-200/20' : 'bg-amber-300/10'}`}></div>
      
      {/* Content */}
      <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110 relative z-10">
        <i className={`${icon} ${iconColor} text-3xl`}></i>
      </div>
      <div className={`text-3xl font-bold ${valueColor} mb-2 relative z-10`}>{value}</div>
      <div className={`${labelColor} relative z-10`}>{label}</div>
    </div>
  );
};

export default Stats;