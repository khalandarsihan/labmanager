// import React from 'react';

// const Header = () => {
//   return (
//     <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
//       <h1 className="text-4xl font-bold text-amber-200 mb-4 text-center">
//         Discover Your Next Course
//       </h1>
//       <p className="text-lg text-gray-400 text-center">
//         Explore our catalog of expert-led courses to advance your career
//       </p>
//     </div>
//   );
// };

// export default Header;

import React from 'react';
import { Sparkles } from 'lucide-react';
import { useTheme } from '../../../components/ui/ThemeContext';

const Header = () => {
  const { useLightTheme, themeStyles } = useTheme();

  const bgGradient = useLightTheme
    ? "bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50"
    : "bg-gradient-to-r from-gray-900 via-gray-800 to-[#444444]";

  const hoverBg = useLightTheme
  ? "hover:bg-purple-100/30"
  : "hover:bg-gray-800/30";

const textColor = useLightTheme
  ? "text-purple-800"
  : "text-gray-300";

  const titleGradient = useLightTheme
  ? "from-purple-700 via-purple-600 to-purple-700"
  : "from-amber-400 via-amber-300 to-amber-400";  // Keep amber for dark
  
const decorativeColor = useLightTheme
  ? "text-purple-500"
  : "text-amber-300";  // Keep amber for dark

  return (
    <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-8">
      <style>{`
        @keyframes pulseWithPause {
          0% { opacity: 0.8; }
          40% { opacity: 1; }
          60% { opacity: 1; }  /* Holds at full opacity */
          100% { opacity: 0.8; }
        }
        .animate-pulse-with-pause {
          animation: pulseWithPause 4s ease-in-out infinite;
        }
      `}</style>

      {/* Themed background with subtle gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${bgGradient} rounded-lg`} />
      
      {/* Content container with hover animation */}
      <div className={`relative p-6 rounded-lg transition-all duration-300 hover:transform hover:scale-[1.01] ${hoverBg}`}>
        {/* Title section with custom pause animation */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="animate-pulse-with-pause">
            <Sparkles className={`w-6 h-6 ${decorativeColor}`} />
          </div>
          <h1 className={`text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${titleGradient} animate-pulse-with-pause`}>
            Discover Your Next Course
          </h1>
          <div className="animate-pulse-with-pause">
            <Sparkles className={`w-6 h-6 ${decorativeColor}`} />
          </div>
        </div>

        {/* Description with gradient underline effect */}
        <div className="max-w-2xl mx-auto relative group">
          <p className={`text-lg ${textColor} text-center leading-relaxed mb-6`}>
            Explore our catalog of expert-led courses to advance your career
          </p>
          <div className={`absolute bottom-0 left-1/2 w-0 h-px bg-gradient-to-r ${titleGradient} group-hover:w-1/2 transition-all duration-300 -translate-x-1/2`} />
        </div>

        {/* Decorative elements */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className={`h-px w-16 bg-gradient-to-r from-transparent via-${decorativeColor}/30 to-transparent`} />
          <div className={`h-2 w-2 rounded-full bg-${decorativeColor}/30`} />
          <div className={`h-px w-16 bg-gradient-to-r from-transparent via-${decorativeColor}/30 to-transparent`} />
        </div>
      </div>
    </div>
  );
};

export default Header;