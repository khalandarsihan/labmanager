import React from 'react';
import { useTheme } from '../../../components/ui/ThemeContext';

const Hero = () => {
  const { useLightTheme } = useTheme();
  
  // Define theme-dependent styles
  const overlayGradient = useLightTheme
    ? "bg-gradient-to-r from-purple-100/55 to-purple-50/50"
    : "bg-gradient-to-r from-gray-800/50 to-gray-700/45";
    
  const topGradient = useLightTheme
    ? "bg-gradient-to-b from-purple-50/50 to-transparent"
    : "bg-gradient-to-b from-black/45 to-transparent";
    
  const bottomGradient = useLightTheme
    ? "bg-gradient-to-t from-purple-100/60 to-transparent"
    : "bg-gradient-to-t from-black/60 to-transparent";
    
  const bottomShadowGradient = useLightTheme
    ? "bg-gradient-to-t from-purple-50/70 to-transparent"
    : "bg-gradient-to-t from-gray-900/90 to-transparent";
    
  const titleColor = useLightTheme
    ? "text-purple-700"
    : "text-amber-300";
    
  const descriptionColor = useLightTheme
    ? "text-purple-700"
    : "text-amber-200";
    
  const buttonStyle = useLightTheme
    ? "bg-purple-500 text-white hover:bg-purple-600"
    : "bg-amber-300 text-gray-900 hover:bg-amber-200";
    
  const bgColor = useLightTheme
    ? "bg-purple-50"
    : "bg-gray-900";

  return (
    <section className={`relative w-full h-[85vh] md:h-screen min-h-[500px] overflow-hidden ${bgColor} z-10`}>
      {/* Create a barrier element to prevent background pattern bleed-through */}
      <div className="absolute inset-0 z-0 bg-black"></div>
      
      {/* Video Container - hidden on very small screens to improve performance */}
      <div className="absolute inset-0 w-full h-full z-1">
        <video 
          className="hidden sm:block w-full h-full object-cover" 
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="/assets/labmanager/videos/background-video.mp4" type="video/mp4" />
        </video>
        
        {/* Fallback background for very small screens */}
        <div className="sm:hidden absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
      </div>

      {/* Layered Overlays for Depth with theme-aware colors */}
      <div className={`absolute inset-0 ${overlayGradient} z-2`} />
      <div className="absolute inset-0 z-3">
        <div className={`absolute inset-0 ${topGradient}`} />
        <div className={`absolute inset-0 ${bottomGradient}`} />
      </div>

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center h-full text-center px-4">
        <div className="max-w-4xl">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${titleColor} mb-4 md:mb-6 drop-shadow-lg`}>
            Why Choose TechEthica?
          </h1>
          <p className={`text-base sm:text-lg md:text-xl ${descriptionColor} mb-6 md:mb-8 drop-shadow max-w-md mx-auto`}>
            Discover a world of knowledge through our innovative online learning platform
          </p>
          <a
            href="/courses/catalog"
            className={`inline-block ${buttonStyle} px-6 py-3 md:px-8 md:py-4 rounded-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm md:text-base`}
          >
            Explore Courses
          </a>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className={`absolute bottom-0 left-0 right-0 h-24 md:h-32 ${bottomShadowGradient} z-4`} />
    </section>
  );
};

export default Hero;