import React from 'react';
import { useTheme } from '../../../components/ui/ThemeContext';
import BackgroundPattern from '../../../components/ui/BackgroundPattern';
import './Welcome.css'; // Keep this for the animation styles

const Welcome = ({ content }) => {
  const { useLightTheme, themeStyles } = useTheme();
  
  if (!content) return null;
  
  return (
    <section className="relative py-24 overflow-hidden w-screen">
      {/* Use the imported BackgroundPattern component instead */}
      <div className="absolute inset-0">
        <BackgroundPattern />
      </div>
      
      <div className="w-screen max-w-none px-8 md:px-16 relative z-10">
        <div className={`${themeStyles.text.primary} text-lg md:text-xl leading-relaxed w-full max-w-none`}>
          <div dangerouslySetInnerHTML={{ __html: content?.content || '' }} />
        </div>
      </div>
    </section>
  );
};

export default Welcome;