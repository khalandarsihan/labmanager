import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../components/ui/ThemeContext';
import BackgroundPattern from '../../../components/ui/BackgroundPattern';
import './Hero.css';

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
  
  // // Video overlay gradient - consistent with the theme
  const overlayGradient = useLightTheme
  //   // ? "bg-gradient-to-r from-purple-50/80 via-purple-100/50 to-purple-50/80"
  //   // : "bg-gradient-to-r from-gray-900/80 via-gray-800/60 to-gray-700/80";
    ? "border-purple-200/50 bg-gradient-to-r from-purple-50/80 via-purple-100/90 to-purple-50/80"
    : "border-gray-700/50 bg-gradient-to-r from-gray-900/80 via-gray-800/90 to-[#444444]/80";

  // Video overlay gradient - consistent with the theme
// const overlayGradient = useLightTheme
// ? "bg-gradient-to-r from-purple-50/80 via-purple-100/50 to-purple-50/80"
// : "bg-gradient-to-r from-gray-900/80 via-gray-800/60 to-gray-700/80";

  // Use the themeStyles directly from context
  const titleColor = themeStyles.heading;
  const descriptionColor = themeStyles.subheading;
  
  const buttonStyle = useLightTheme
    ? "bg-purple-500 text-white hover:bg-purple-600"
    : "bg-amber-300 text-gray-900 hover:bg-amber-200";

  // Choose the appropriate object-fit style based on orientation
  const videoFitStyle = isPortrait 
    ? "object-contain"
    : "object-cover";

  return (
    <section className="relative w-full h-[85vh] md:h-screen min-h-[500px] overflow-hidden z-10">
      {/* Use the same BackgroundPattern component as other sections */}
      <div className="absolute inset-0 -z-10">
        <BackgroundPattern />
      </div>
      
      {/* VIDEO CONTAINER */}
      <div className="absolute inset-0 w-full h-full z-5">
      <video 
  ref={videoRef}
  className={`w-full h-full ${videoFitStyle} ${
    videoLoaded 
      ? 'opacity-50 md:opacity-50 sm:opacity-40 max-sm:opacity-30' 
      : 'opacity-0'
  } transition-opacity duration-500`}
  autoPlay 
  loop 
  muted 
  playsInline
>
          <source src="/assets/labmanager/videos/background-video.mp4" type="video/mp4" />
          {/* Extra overlay for mobile */}
<div className={`absolute inset-0 bg-black/30 sm:bg-black/20 md:bg-transparent z-6 sm:hidden`} />
        </video>
      </div>

      {/* Video overlay - with consistent styling */}
      <div className={`absolute inset-0 ${overlayGradient} z-6`} />

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center h-full text-center px-4">
        <div className="max-w-4xl">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${titleColor} mb-4 md:mb-6 drop-shadow-xl`}>
            Why Choose TechEthica?
          </h1>
          <p className={`text-base sm:text-lg md:text-xl ${descriptionColor} mb-6 md:mb-8 drop-shadow-lg max-w-md mx-auto`}>
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

      {/* Improved transition to welcome section - taller and more solid */}
      <div className={`absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t ${
        useLightTheme 
          ? "from-purple-50 via-purple-50 to-transparent" 
          : "from-gray-900 via-gray-900 to-transparent"
      } z-10`} />
    </section>
  );
};

export default Hero;