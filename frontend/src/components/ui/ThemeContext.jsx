// import React, { createContext, useState, useContext, useEffect } from 'react';

// // Create the theme context
// const ThemeContext = createContext();

// // Theme provider component
// export const ThemeProvider = ({ children }) => {
//   // Initialize theme from localStorage or default to light theme
//   const [useLightTheme, setUseLightTheme] = useState(() => {
//     const savedTheme = localStorage.getItem('theme');
//     return savedTheme ? savedTheme === 'light' : true;
//   });

//   // Theme-based styles
//   const themeStyles = useLightTheme ? {
//     // background: "bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50",
//     background: "bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50",
//     // background: "bg-gradient-to-r from-emerald-50 via-green-100 to-emerald-50",
//     // background: "bg-gradient-to-r from-teal-50 via-cyan-100 to-teal-50",
//     // background: "bg-gradient-to-r from-rose-50 via-pink-100 to-rose-50",
//     // background: "bg-gradient-to-r from-slate-100 via-blue-50 to-slate-100",

//     // background: "bg-gradient-to-r from-violet-100 via-purple-50 to-violet-100",
//     backgroundPattern: "bg-[url('/assets/labmanager/images/light-pattern.png')]",
//     text: {
//       primary: "text-gray-800",
//       secondary: "text-gray-700", 
//       light: "text-gray-600"
//     },
//     heading: "text-amber-800",
//     subheading: "text-amber-700",
//     card: {
//       bg: "bg-white/80",
//       border: "border-amber-200/50",
//       hoverBorder: "hover:border-amber-400/70"
//     },
//     quote: "bg-amber-100/50",
//     cta: {
//       bg: "bg-amber-600",
//       hover: "hover:bg-amber-500"
//     },
//     accent: {
//       light: "bg-amber-500/10",
//       medium: "bg-amber-500/20",
//       strong: "bg-amber-500/30"
//     },
//     pattern: "text-amber-700/5"
//   } : {
//     // background: "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700",
//     background: "bg-gradient-to-r from-gray-900 via-gray-800 to-[#444444]",
//     backgroundPattern: "bg-[url('/assets/labmanager/images/dark-pattern.png')]",
//     text: {
//       primary: "text-gray-200",
//       secondary: "text-gray-300", 
//       light: "text-gray-400"
//     },
//     heading: "text-amber-300",
//     subheading: "text-amber-200",
//     card: {
//       bg: "bg-gray-800/50",
//       border: "border-gray-700/50",
//       hoverBorder: "hover:border-amber-300/30"
//     },
//     quote: "bg-gray-900/50",
//     cta: {
//       bg: "bg-amber-600",
//       hover: "hover:bg-amber-500"
//     },
//     accent: {
//       light: "bg-amber-500/10",
//       medium: "bg-amber-500/20",
//       strong: "bg-amber-500/30"
//     },
//     pattern: "text-amber-500/5"
//   };

//   // Toggle theme function
//   const toggleTheme = () => {
//     setUseLightTheme(!useLightTheme);
//   };

//   // Save theme preference to localStorage when it changes
//   useEffect(() => {
//     localStorage.setItem('theme', useLightTheme ? 'light' : 'dark');
//   }, [useLightTheme]);

//   // Provider value
//   const value = {
//     useLightTheme,
//     toggleTheme,
//     themeStyles
//   };

//   return (
//     <ThemeContext.Provider value={value}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// // Custom hook to use the theme context
// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (context === undefined) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// };

import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the theme context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to light theme
  const [useLightTheme, setUseLightTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'light' : true;
  });

  // Theme-based styles
  const themeStyles = useLightTheme ? {
    // background: "bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50",
    background: "bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50",
    // background: "bg-gradient-to-r from-emerald-50 via-green-100 to-emerald-50",
    // background: "bg-gradient-to-r from-teal-50 via-cyan-100 to-teal-50",
    // background: "bg-gradient-to-r from-rose-50 via-pink-100 to-rose-50",
    // background: "bg-gradient-to-r from-slate-100 via-blue-50 to-slate-100",

    // background: "bg-gradient-to-r from-violet-100 via-purple-50 to-violet-100",
    backgroundPattern: "bg-[url('/assets/labmanager/images/light-pattern.png')]",
    text: {
      primary: "text-gray-800",
      secondary: "text-gray-700", 
      light: "text-gray-600"
    },
    heading: "text-purple-800",
    subheading: "text-purple-700",
    card: {
      bg: "bg-white/80",
      border: "border-purple-200/50",
      hoverBorder: "hover:border-purple-400/70"
    },
    quote: "bg-purple-100/50",
    cta: {
      bg: "bg-purple-600",
      hover: "hover:bg-purple-500"
    },
    accent: {
      light: "bg-purple-500/10",
      medium: "bg-purple-500/20",
      strong: "bg-purple-500/30"
    },
    pattern: "text-purple-700/5"
  } : {
    // background: "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700",
    background: "bg-gradient-to-r from-gray-900 via-gray-800 to-[#444444]",
    backgroundPattern: "bg-[url('/assets/labmanager/images/dark-pattern.png')]",
    text: {
      primary: "text-gray-200",
      secondary: "text-gray-300", 
      light: "text-gray-400"
    },
    heading: "text-amber-300",
    subheading: "text-amber-200",
    card: {
      bg: "bg-gray-800/50",
      border: "border-gray-700/50",
      hoverBorder: "hover:border-amber-300/30"
    },
    quote: "bg-gray-900/50",
    cta: {
      bg: "bg-amber-600",
      hover: "hover:bg-amber-500"
    },
    accent: {
      light: "bg-amber-500/10",
      medium: "bg-amber-500/20",
      strong: "bg-amber-500/30"
    },
    pattern: "text-amber-500/5"
  };

  // Toggle theme function
  const toggleTheme = () => {
    setUseLightTheme(!useLightTheme);
  };

  // Save theme preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', useLightTheme ? 'light' : 'dark');
  }, [useLightTheme]);

  // Provider value
  const value = {
    useLightTheme,
    toggleTheme,
    themeStyles
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};