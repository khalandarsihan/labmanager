// import React from 'react';
// import Navbar from './ui/Navbar';
// import ContactBar from './ui/ContactBar';
// import Footer from './ui/Footer';

// const AppWrapper = ({ children }) => {
//   return (
//     <>
//       <ContactBar />
//       <Navbar />
//       <main>{children}</main>
//       <Footer />
//     </>
//   );
// };

// export default AppWrapper;

// import React from 'react';
// import Navbar from './ui/Navbar';
// import ContactBar from './ui/ContactBar';
// import Footer from './ui/Footer';
// import ThemeSwitcher from './ui/ThemeSwitcher';
// import { ThemeProvider, useTheme } from './ui/ThemeContext';

// // Inner component that uses the theme context
// const ThemedContent = ({ children }) => {
//   const { useLightTheme, toggleTheme } = useTheme();
  
//   return (
//     <>
//       {/* Add the theme switcher */}
//       <ThemeSwitcher useLightTheme={useLightTheme} toggleTheme={toggleTheme} />
      
//       {/* Keep existing layout structure */}
//       <ContactBar />
//       <Navbar />
//       <main>{children}</main>
//       <Footer />
//     </>
//   );
// };

// // Outer wrapper that provides the theme context
// const AppWrapper = ({ children }) => {
//   return (
//     <ThemeProvider>
//       <ThemedContent>{children}</ThemedContent>
//     </ThemeProvider>
//   );
// };

// export default AppWrapper;

import React, { useEffect } from 'react';
import Navbar from './ui/Navbar';
import ContactBar from './ui/ContactBar';
import Footer from './ui/Footer';
import ThemeSwitcher from './ui/ThemeSwitcher';
import { ThemeProvider, useTheme } from './ui/ThemeContext';

// Inner component that uses the theme context
const ThemedContent = ({ children }) => {
  const { useLightTheme, toggleTheme } = useTheme();
  
  // Add meta viewport tag programmatically for mobile responsiveness
  useEffect(() => {
    // Check if viewport meta exists
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    
    // If it doesn't exist, create it
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    
    // Set the content regardless
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    
    return () => {
      // No cleanup needed as we don't want to remove the viewport meta
    };
  }, []);
  
  return (
    <>
      {/* Add the theme switcher */}
      <ThemeSwitcher useLightTheme={useLightTheme} toggleTheme={toggleTheme} />
      
      {/* Keep existing layout structure */}
      <ContactBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

// Outer wrapper that provides the theme context
const AppWrapper = ({ children }) => {
  return (
    <ThemeProvider>
      <ThemedContent>{children}</ThemedContent>
    </ThemeProvider>
  );
};

export default AppWrapper;