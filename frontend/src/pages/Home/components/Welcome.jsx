import React from 'react';
import { useTheme } from '../../../components/ui/ThemeContext';

const Welcome = ({ content }) => {
  const { useLightTheme, themeStyles } = useTheme();
  
  if (!content) return null;
  
  return (
    <section className="relative py-24 overflow-hidden w-screen">
      <BackgroundPattern useLightTheme={useLightTheme} />
      
      <div className="w-screen max-w-none px-8 md:px-16 relative z-10">
        <div className={`${themeStyles.text.primary} text-lg md:text-xl leading-relaxed w-full max-w-none`}>
          <div dangerouslySetInnerHTML={{ __html: content?.content || '' }} />
        </div>
      </div>
    </section>
  );
};

const BackgroundPattern = ({ useLightTheme }) => {
  const bgGradient = useLightTheme
    ? "bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50"
    : "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700";
    
  const borderColor = useLightTheme 
    ? "border-amber-700" 
    : "border-amber-300";
    
  const opacity = useLightTheme ? "opacity-5" : "opacity-10";

  return (
    <div className={`absolute inset-0 ${bgGradient}`}>
      {/* Abstract Lines */}
      <div className={`absolute inset-0 ${opacity}`}>
        <div className={`absolute h-full w-px ${borderColor}/60 left-1/4 transform -skew-x-12`} />
        <div className={`absolute h-full w-px ${borderColor}/50 left-1/2 transform skew-x-12`} />
        <div className={`absolute h-full w-px ${borderColor}/60 left-3/4 transform -skew-x-12`} />
        <div className={`absolute w-full h-px ${borderColor}/50 top-1/4 transform -skew-y-12`} />
        <div className={`absolute w-full h-px ${borderColor}/60 top-1/2 transform skew-y-12`} />
        <div className={`absolute w-full h-px ${borderColor}/50 top-3/4 transform -skew-y-12`} />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top Left Group */}
        <div className={`absolute top-20 left-1/4 w-12 h-12 border-2 ${borderColor}/20 rounded-lg backdrop-blur transform rotate-45 animate-float-diagonal delay-300`} />
        <div className={`absolute top-32 left-1/3 w-8 h-8 border-2 ${borderColor}/30 transform rotate-12 backdrop-blur animate-float-up delay-700`} />

        {/* Top Right Group */}
        <div className={`absolute top-24 right-1/4 w-16 h-16 border-2 ${borderColor}/20 rounded-full backdrop-blur animate-float-circle delay-1000`} />
        <div className={`absolute top-36 right-1/3 w-10 h-10 border-2 ${borderColor}/30 rounded-lg transform -rotate-12 backdrop-blur animate-float-diagonal-reverse delay-500`} />

        {/* Additional Elements */}
        <div className={`absolute top-1/2 left-16 w-14 h-14 border-2 ${borderColor}/25 transform rotate-45 backdrop-blur animate-float-up-slow delay-200`} />
        <div className={`absolute top-1/2 right-16 w-16 h-16 border-2 ${borderColor}/20 rounded-full backdrop-blur animate-float-side delay-900`} />
        <div className={`absolute bottom-12 left-20 w-12 h-12 border-2 ${borderColor}/30 rounded-lg transform rotate-45 backdrop-blur animate-float-diagonal delay-400`} />
        <div className={`absolute bottom-16 right-24 w-14 h-14 border-2 ${borderColor}/25 transform -rotate-12 backdrop-blur animate-float-up delay-800`} />
      </div>
    </div>
  );
};

export default Welcome;