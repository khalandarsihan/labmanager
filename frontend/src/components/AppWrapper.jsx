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

import React from 'react';
import Navbar from './ui/Navbar';
import ContactBar from './ui/ContactBar';
import Footer from './ui/Footer';
import ThemeSwitcher from './ui/ThemeSwitcher';
import { ThemeProvider, useTheme } from './ui/ThemeContext';

// Inner component that uses the theme context
const ThemedContent = ({ children }) => {
  const { useLightTheme, toggleTheme } = useTheme();
  
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