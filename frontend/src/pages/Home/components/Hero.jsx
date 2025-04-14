import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../components/ui/ThemeContext';
// Import removed - we'll define patterns locally
// import BackgroundPattern from '../../../components/ui/BackgroundPattern';

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
  
  // Simplified overlay for better background pattern visibility
  const overlayGradient = useLightTheme
    ? "bg-gradient-to-r from-purple-50/55 via-purple-100/25 to-purple-50/50"
    : "bg-gradient-to-r from-gray-900/55 via-gray-800/35 to-gray-700/50";

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

  // Define accent color for pattern elements based on theme
  const accentColor = useLightTheme ? 'border-purple-600/60' : 'border-amber-400/60';
  const lineColor = useLightTheme ? 'bg-purple-600/30' : 'bg-amber-400/30';

  return (
    <section className="relative w-full h-[85vh] md:h-screen min-h-[500px] overflow-hidden z-10">
      {/* BACKGROUND PATTERNS - Now positioned below video with lower z-index */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Background lines with reduced opacity */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className={`absolute h-full w-0.5 ${lineColor} left-1/4 transform -skew-x-12`} />
          <div className={`absolute h-full w-0.5 ${lineColor} left-1/2 transform skew-x-12`} />
          <div className={`absolute h-full w-0.5 ${lineColor} left-3/4 transform -skew-x-12`} />
          <div className={`absolute w-full h-0.5 ${lineColor} top-1/4 transform -skew-y-12`} />
          <div className={`absolute w-full h-0.5 ${lineColor} top-1/2 transform skew-y-12`} />
          <div className={`absolute w-full h-0.5 ${lineColor} top-3/4 transform -skew-y-12`} />
        </div>
        
        {/* Floating geometric elements with reduced opacity */}
        <div className="absolute inset-0 overflow-visible pointer-events-none">
          {/* Top Group */}
          <div className={`absolute top-20 left-1/3 w-14 h-14 border-2 ${accentColor} transform rotate-45 backdrop-blur-sm animate-float-diagonal delay-300`} />
          <div className={`absolute top-24 right-1/3 w-10 h-10 border-2 ${accentColor} transform -rotate-12 backdrop-blur-sm animate-float-up delay-700`} />
          
          {/* Left Side Elements */}
          <div className={`absolute top-1/2 left-20 w-16 h-16 border-2 ${accentColor} transform backdrop-blur-sm animate-float-circle delay-1000`} />
          <div className={`absolute bottom-1/3 left-1/4 w-12 h-12 border-2 ${accentColor} transform rotate-12 backdrop-blur-sm animate-float-diagonal-reverse delay-500`} />
          
          {/* Right Side Elements */}
          <div className={`absolute top-1/2 right-20 w-12 h-12 border-2 ${accentColor} transform rotate-45 backdrop-blur-sm animate-float-up-slow delay-200`} />
          <div className={`absolute bottom-1/3 right-1/4 w-14 h-14 border-2 ${accentColor} backdrop-blur-sm animate-float-side delay-900`} />
        </div>
      </div>
      
      {/* VIDEO CONTAINER - Now with higher z-index to appear above background */}
      <div className="absolute inset-0 w-full h-full z-5">
        <video 
          ref={videoRef}
          className={`w-full h-full ${videoFitStyle} ${videoLoaded ? 'block' : 'hidden'}`}
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="/assets/labmanager/videos/background-video.mp4" type="video/mp4" />
        </video>
        
        {/* Fallback when video isn't loaded */}
        <div 
          className={`absolute inset-0 bg-transparent ${videoLoaded ? 'hidden' : 'block'}`}
        ></div>
      </div>

      {/* Video overlay - applied with higher z-index than video */}
      <div className={`absolute inset-0 ${overlayGradient} z-6`} />

      {/* Content - with highest z-index */}
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

      {/* Transition gradient to welcome section - smoother transition for mobile */}
      <div className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t ${
        useLightTheme 
          ? "from-purple-50 to-transparent" 
          : "from-gray-900 to-transparent"
      } z-10`} />
    </section>
  );
};

export default Hero;