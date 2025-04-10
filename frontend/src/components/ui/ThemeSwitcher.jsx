// import React from 'react';

// const ThemeSwitcher = ({ useLightTheme, toggleTheme }) => {
//   return (
//     <div className="fixed top-52 right-6 z-50 flex flex-col gap-3">
//       <button
//         onClick={toggleTheme}
//         className={`p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
//           useLightTheme 
//             ? 'bg-purple-600 text-white hover:bg-purple-700' 
//             : 'bg-gray-800 text-amber-300 hover:bg-gray-700'
//         }`}
//         aria-label={useLightTheme ? 'Switch to dark theme' : 'Switch to light theme'}
//         title={useLightTheme ? 'Switch to dark theme' : 'Switch to light theme'}
//       >
//         {useLightTheme ? (
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
//           </svg>
//         ) : (
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
//           </svg>
//         )}
//       </button>
//     </div>
//   );
// };

// export default ThemeSwitcher;

import React from 'react';

const ThemeSwitcher = ({ useLightTheme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
        useLightTheme ? 'bg-purple-700 text-white' : 'bg-amber-300 text-gray-900'
      }`}
      aria-label={useLightTheme ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      {useLightTheme ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeSwitcher;