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

import React from 'react';
import './Stats.css';
import { useTheme } from '../../../components/ui/ThemeContext';
import BackgroundPattern from '../../../components/ui/BackgroundPattern';

const Stats = () => {
  const { useLightTheme, themeStyles } = useTheme();
  
  const stats = [
    {
      icon: 'fas fa-user-graduate',
      value: '10,000+',
      label: 'Students'
    },
    {
      icon: 'fas fa-book-open',
      value: '200+',
      label: 'Courses'
    },
    {
      icon: 'fas fa-chalkboard-teacher',
      value: '50+',
      label: 'Expert Instructors'
    },
    {
      icon: 'fas fa-star',
      value: '95%',
      label: 'Satisfaction Rate'
    }
  ];

  return (
    <>
      <section className="py-20 relative">
        {/* Use the imported BackgroundPattern component */}
        <div className="absolute inset-0">
          <BackgroundPattern />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} useLightTheme={useLightTheme} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

const StatCard = ({ icon, value, label, useLightTheme }) => {
  const cardBg = useLightTheme ? 'bg-white/70' : 'bg-[#232836]';
  // Use transparent or very subtle border initially
  const borderClass = useLightTheme 
    ? 'border border-transparent hover:border-purple-500' 
    : 'border border-transparent hover:border-amber-300';
  const iconColor = useLightTheme ? 'text-purple-600' : 'text-amber-300';
  const valueColor = useLightTheme ? 'text-purple-700' : 'text-amber-300';
  const labelColor = useLightTheme ? 'text-gray-700' : 'text-gray-300';

  return (
    <div className={`stat-card counter ${cardBg} rounded-lg p-6 text-center ${borderClass} shadow-sm hover:shadow-md transition-all duration-300 group`}>
      <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">
        <i className={`${icon} ${iconColor} text-3xl`}></i>
      </div>
      <div className={`text-3xl font-bold ${valueColor} mb-2`}>{value}</div>
      <div className={labelColor}>{label}</div>
    </div>
  );
};

export default Stats;