import React from 'react';
import { Phone, Mail } from 'lucide-react';

const Hero = () => {
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

        {/* Layered Overlays for Depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/60 to-gray-700/55" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-20 flex items-center justify-center h-full text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-300 mb-6 drop-shadow-lg">
              Why Choose TechEthica?
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 drop-shadow">
              Discover a world of knowledge through our innovative online learning platform
            </p>
            <a
              href="/courses/catalog"
              className="inline-block bg-amber-300 text-gray-900 px-8 py-4 rounded-lg font-bold hover:bg-amber-200 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Explore Courses
            </a>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900/90 to-transparent" />
      </section>
    </>
  );
};

export default Hero;