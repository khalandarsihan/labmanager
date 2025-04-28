// import React from 'react';

// const ThemeSwitcher = ({ useLightTheme, toggleTheme }) => {
//   return (
//     <button
//       onClick={toggleTheme}
//       className={`fixed bottom-12 right-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
//         useLightTheme ? 'bg-purple-700 text-white' : 'bg-amber-300 text-gray-900'
//       }`}
//       aria-label={useLightTheme ? 'Switch to dark theme' : 'Switch to light theme'}
//     >
//       {useLightTheme ? (
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
//           />
//         </svg>
//       ) : (
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
//           />
//         </svg>
//       )}
//     </button>
//   );
// };

// export default ThemeSwitcher;

import React from 'react';

const ThemeSwitcher = ({ useLightTheme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className={`fixed bottom-12 right-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
        useLightTheme ? 'bg-purple-700 text-white' : 'bg-amber-400 text-gray-900'
      }`}
      aria-label={useLightTheme ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      {useLightTheme ? (
        // Icon for Light Mode (like half moon - dark side)
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M21.752 15.002A9.718 9.718 0 0112 21.75 9.75 9.75 0 1116.002 2.248a7.5 7.5 0 105.75 12.754z" />
        </svg>
      ) : (
        // Icon for Dark Mode (like sun)
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path
            fillRule="evenodd"
            d="M12 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zm6.364 3.136a.75.75 0 011.06 1.06l-1.06 1.061a.75.75 0 11-1.06-1.061l1.06-1.06zM21 11.25a.75.75 0 010 1.5h-1.5a.75.75 0 010-1.5H21zM17.425 17.425a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.061l-1.06-1.061a.75.75 0 010-1.06zM12 18.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zm-6.364-1.325a.75.75 0 011.06 0l1.06 1.061a.75.75 0 11-1.06 1.061l-1.06-1.061a.75.75 0 010-1.06zM3 12a.75.75 0 01.75-.75H5.25a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm1.136-6.364a.75.75 0 011.061-1.06l1.06 1.06a.75.75 0 01-1.06 1.061l-1.061-1.061z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M12 6.75a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeSwitcher;
