import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../components/ui/ThemeContext';
import BackgroundPattern from '../../../components/ui/BackgroundPattern';

const Hero = () => {
  const { useLightTheme, themeStyles } = useTheme();
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPortrait, setIsPortrait] = useState(window.innerWidth < window.innerHeight);

  // Handle orientation changes
  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerWidth < window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle video loading
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', () => {
        setVideoLoaded(true);
        console.log("Video loaded successfully");
      });
      
      videoRef.current.addEventListener('error', (e) => {
        console.error("Video loading error:", e);
        setVideoLoaded(false);
      });
    }
  }, []);
  
  // Define theme-dependent styles
  const overlayGradient = useLightTheme
    ? "bg-gradient-to-r from-purple-100/40 to-purple-50/35"
    : "bg-gradient-to-r from-gray-800/50 to-gray-700/45";
    

  const topGradient = useLightTheme
  ? "bg-gradient-to-b from-purple-50/20 to-transparent"
  : "bg-gradient-to-b from-gray-900/20 to-transparent";

  const bottomGradient = useLightTheme
  ? "bg-gradient-to-t from-purple-100/25 to-transparent"
  : "bg-gradient-to-t from-[#444444]/25 to-transparent";

  const bottomShadowGradient = useLightTheme
  ? "bg-gradient-to-t from-purple-50/50 to-transparent"
  : "bg-gradient-to-t from-gray-900/60 to-transparent";

  // Use the themeStyles directly from context
  const titleColor = themeStyles.heading;
  const descriptionColor = themeStyles.subheading;
  
  // Use the cta style from themeStyles
  // const buttonStyle = `${themeStyles.cta.bg} ${useLightTheme ? 'text-white' : 'text-gray-900'} ${themeStyles.cta.hover}`;
  const buttonStyle = useLightTheme
  ? "bg-purple-500 text-white hover:bg-purple-600"
  : "bg-amber-300 text-gray-900 hover:bg-amber-200";

  // Choose the appropriate object-fit style based on orientation
  const videoFitStyle = isPortrait 
    ? "object-contain" // Ensures the entire video is visible, may have letterboxing
    : "object-cover";  // Fills the container, may crop

  return (
    <section className="relative w-full h-[85vh] md:h-screen min-h-[500px] overflow-hidden z-10">
      {/* Transparent container to establish stacking context */}
      <div className="absolute inset-0 z-0 bg-transparent"></div>
      
      {/* BackgroundPattern component - placed so it extends fully */}
      <div className="absolute inset-0 z-3   overflow-hidden">
        <BackgroundPattern />
      </div>
      
      {/* Video Container */}
      <div className="absolute inset-0 w-full h-full z-2">
        {/* Video with adaptive object-fit based on orientation */}
        <video 
          ref={videoRef}
          className={`w-full h-full ${videoFitStyle} opacity-95 ${videoLoaded ? 'block' : 'hidden'}`}
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="/assets/labmanager/videos/background-video.mp4" type="video/mp4" />
        </video>
        
        {/* Fallback when video isn't loaded - just display the BackgroundPattern */}
        <div 
          className={`absolute inset-0 bg-transparent ${videoLoaded ? 'hidden' : 'block'}`}
        ></div>
      </div>

      {/* Subtle overlays for depth with theme-aware colors */}
      <div className={`absolute inset-0 ${overlayGradient} z-3`} />
      <div className="absolute inset-0 z-4">
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
      <div className={`absolute bottom-0 left-0 right-0 h-24 md:h-32 ${bottomShadowGradient} z-5`} />
    </section>
  );
};

export default Hero;