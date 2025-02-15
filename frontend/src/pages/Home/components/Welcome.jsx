import React from 'react';

const Welcome = ({ content }) => {
  if (!content) return null;
  
  return (
    <section className="relative py-24 overflow-hidden w-screen">
      <BackgroundPattern />
      
      <div className="w-screen max-w-none px-8 md:px-16 relative z-10">
        <div className="text-gray-200 text-lg md:text-xl leading-relaxed w-full max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content?.content || '' }} />
        </div>
      </div>
    </section>
  );
};

const BackgroundPattern = () => (
  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
    {/* Abstract Lines */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute h-full w-px bg-amber-300/60 left-1/4 transform -skew-x-12" />
      <div className="absolute h-full w-px bg-amber-300/50 left-1/2 transform skew-x-12" />
      <div className="absolute h-full w-px bg-amber-300/60 left-3/4 transform -skew-x-12" />
      <div className="absolute w-full h-px bg-amber-300/50 top-1/4 transform -skew-y-12" />
      <div className="absolute w-full h-px bg-amber-300/60 top-1/2 transform skew-y-12" />
      <div className="absolute w-full h-px bg-amber-300/50 top-3/4 transform -skew-y-12" />
    </div>

    {/* Floating Elements */}
    <div className="absolute inset-0 overflow-hidden">
      {/* Top Left Group */}
      <div className="absolute top-20 left-1/4 w-12 h-12 border-2 border-amber-300/20 rounded-lg backdrop-blur transform rotate-45 animate-float-diagonal delay-300" />
      <div className="absolute top-32 left-1/3 w-8 h-8 border-2 border-amber-300/30 transform rotate-12 backdrop-blur animate-float-up delay-700" />

      {/* Top Right Group */}
      <div className="absolute top-24 right-1/4 w-16 h-16 border-2 border-amber-300/20 rounded-full backdrop-blur animate-float-circle delay-1000" />
      <div className="absolute top-36 right-1/3 w-10 h-10 border-2 border-amber-300/30 rounded-lg transform -rotate-12 backdrop-blur animate-float-diagonal-reverse delay-500" />

      {/* Side Elements */}
      <div className="absolute top-1/2 left-16 w-14 h-14 border-2 border-amber-300/25 transform rotate-45 backdrop-blur animate-float-up-slow delay-200" />
      <div className="absolute top-1/2 right-16 w-16 h-16 border-2 border-amber-300/20 rounded-full backdrop-blur animate-float-side delay-900" />

      {/* Bottom Elements */}
      <div className="absolute bottom-12 left-20 w-12 h-12 border-2 border-amber-300/30 rounded-lg transform rotate-45 backdrop-blur animate-float-diagonal delay-400" />
      <div className="absolute bottom-16 right-24 w-14 h-14 border-2 border-amber-300/25 transform -rotate-12 backdrop-blur animate-float-up delay-800" />

      {/* Additional Corner Elements */}
      <div className="absolute top-20 left-20 w-6 h-6 border-2 border-amber-300/40 rounded-full backdrop-blur animate-float-circle delay-600" />
      <div className="absolute bottom-24 right-32 w-8 h-8 border-2 border-amber-300/30 transform rotate-45 backdrop-blur animate-float-diagonal-reverse delay-800" />
      <div className="absolute top-60 left-1/2 w-10 h-10 border-2 border-amber-300/35 rounded-lg backdrop-blur animate-float-side delay-100" />
      <div className="absolute top-80 right-80 w-12 h-12 border-2 border-amber-300/25 transform rotate-30 backdrop-blur animate-float-up-slow delay-1100" />
    </div>
  </div>
);

export default Welcome;