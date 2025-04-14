import React from 'react';
import { useTheme } from '../../../components/ui/ThemeContext';
import BackgroundPattern from '../../../components/ui/BackgroundPattern';
import './Welcome.css';

const Welcome = ({ content }) => {
  const { useLightTheme, themeStyles } = useTheme();
  
  if (!content) return null;
  
  return (
    <section className="relative py-16 md:py-24 overflow-hidden w-screen mt-0">
      {/* Background Pattern - positioned absolutely with lower z-index */}
      <div className="absolute inset-0 z-0">
        <BackgroundPattern />
      </div>
      
      {/* Content with higher z-index */}
      <div className="w-screen max-w-none px-8 md:px-16 relative z-10">
        <div className={`${themeStyles.text.primary} text-lg md:text-xl leading-relaxed w-full max-w-none welcome-content`}>
          <div dangerouslySetInnerHTML={{ __html: content?.content || '' }} />
        </div>
      </div>
      
      {/* Top transition gradient to blend with Hero section */}
      <div className={`absolute top-0 left-0 right-0 h-16 bg-gradient-to-b ${
        useLightTheme 
          ? "from-purple-50 to-transparent" 
          : "from-gray-900 to-transparent"
      } z-1`} />
      
      {/* Theme-specific CSS classes for welcome content */}
      <style jsx>{`
        .theme-heading {
          color: ${useLightTheme ? '#6b21a8' : '#fcd34d'};
        }
        .theme-subheading {
          color: ${useLightTheme ? '#7e22ce' : '#fcd34d'};
        }
        .theme-text-primary {
          color: ${useLightTheme ? '#1f2937' : '#ffffff'};
        }
        .theme-highlight {
          color: ${useLightTheme ? '#7e22ce' : '#fcd34d'};
          font-weight: 600;
        }
        .theme-card {
          background-color: ${useLightTheme ? 'rgba(255, 255, 255, 0.4)' : 'rgba(31, 41, 55, 0.3)'};
          backdrop-filter: blur(4px);
          color: ${useLightTheme ? '#374151' : '#e5e7eb'};
        }
        .theme-link:hover {
          color: ${useLightTheme ? '#7e22ce' : '#fcd34d'};
        }
        
        /* Additional styles for the main heading */
        h1 {
          color: ${useLightTheme ? '#6b21a8' : '#fcd34d'} !important;
        }
        
        /* Add specificity for the main welcome heading */
        h1:first-child, 
        .welcome-content > div > h1:first-of-type {
          color: ${useLightTheme ? '#6b21a8' : '#fcd34d'} !important;
          font-weight: bold;
        }
      `}</style>
    </section>
  );
};

export default Welcome;