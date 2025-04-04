import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { useTheme } from '../../../components/ui/ThemeContext';

const Hero = () => {
  const { useLightTheme, themeStyles } = useTheme();
  
  // Define theme-dependent styles
  const overlayGradient = useLightTheme
    ? "bg-gradient-to-r from-amber-100/60 to-amber-50/55"
    : "bg-gradient-to-r from-gray-800/60 to-gray-700/55";
    
  const topGradient = useLightTheme
    ? "bg-gradient-to-b from-amber-50/50 to-transparent"
    : "bg-gradient-to-b from-black/50 to-transparent";
    
  const bottomGradient = useLightTheme
    ? "bg-gradient-to-t from-amber-100/70 to-transparent"
    : "bg-gradient-to-t from-black/70 to-transparent";
    
  const bottomShadowGradient = useLightTheme
    ? "bg-gradient-to-t from-amber-50/90 to-transparent"
    : "bg-gradient-to-t from-gray-900/90 to-transparent";
    
  const titleColor = useLightTheme
    ? "text-amber-700"
    : "text-amber-300";
    
  const descriptionColor = useLightTheme
    ? "text-gray-700"
    : "text-gray-200";
    
  const buttonStyle = useLightTheme
    ? "bg-amber-500 text-white hover:bg-amber-600"
    : "bg-amber-300 text-gray-900 hover:bg-amber-200";

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
        {/* Video Container */}
        <div className="absolute inset-0 w-full h-full">
          <video 
            className="w-full h-full object-cover" 
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src="/assets/labmanager/videos/background-video.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Layered Overlays for Depth with theme-aware colors */}
        <div className={`absolute inset-0 ${overlayGradient}`} />
        <div className="absolute inset-0">
          <div className={`absolute inset-0 ${topGradient}`} />
          <div className={`absolute inset-0 ${bottomGradient}`} />
        </div>

        {/* Content */}
        <div className="relative z-20 flex items-center justify-center h-full text-center px-4">
          <div className="max-w-4xl">
            <h1 className={`text-4xl md:text-5xl font-bold ${titleColor} mb-6 drop-shadow-lg`}>
              Why Choose TechEthica?
            </h1>
            <p className={`text-lg md:text-xl ${descriptionColor} mb-8 drop-shadow`}>
              Discover a world of knowledge through our innovative online learning platform
            </p>
            <a
              href="/courses/catalog"
              className={`inline-block ${buttonStyle} px-8 py-4 rounded-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg`}
            >
              Explore Courses
            </a>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className={`absolute bottom-0 left-0 right-0 h-32 ${bottomShadowGradient}`} />
      </section>
    </>
  );
};

export default Hero;