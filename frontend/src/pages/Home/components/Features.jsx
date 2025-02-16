
import React from 'react';
import { Card } from '@/components/ui/card';
import './Features.css';

const Features = ({ features }) => {
  if (!features) return null;

  // Calculate total width needed for all cards
  const cardWidth = 320; // w-80 = 320px
  const cardGap = 24;  // gap-6 = 24px
  const totalWidth = features.length * (cardWidth + cardGap);

  return (
    <section className="relative py-20 overflow-hidden">
      <BackgroundPattern />
      <div className="relative w-full z-10">
        <h2 className="text-4xl font-bold text-center text-amber-200 mb-12">
          Our Features
        </h2>
        
        {/* Outer container with hidden overflow */}
        <div className="relative w-full overflow-hidden">
          {/* Scrolling container */}
          <div 
            className="flex whitespace-nowrap animate-scroll"
            style={{
              width: `${totalWidth * 2}px`, // Double width for two sets
              gap: `${cardGap}px`
            }}
          >
            {/* First set of cards */}
            {features.map((feature, index) => (
              <FeatureCard
                key={`set1-${index}`}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
            {/* Second set of cards for seamless loop */}
            {features.map((feature, index) => (
              <FeatureCard
                key={`set2-${index}`}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="inline-block w-80 px-3 my-4">
      <Card className="h-48 p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-amber-300/50 transition-all duration-300 hover:scale-105 rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl" />
        <div className="relative z-10 flex flex-col items-center h-full">
          <div className="w-12 h-12 mb-2 bg-gray-800/50 rounded-lg flex items-center justify-center">
            <span className="text-2xl">{icon}</span>
          </div>
          <h3 className="text-lg font-bold text-amber-200 mb-1 text-center w-full">
            {title}
          </h3>
          <p className="text-gray-300 text-center text-sm w-full whitespace-normal overflow-hidden line-clamp-2">
            {description}
          </p>
        </div>
      </Card>
    </div>
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
      <div className="absolute top-20 left-1/4 w-12 h-12 border-2 border-amber-300/20 rounded-lg backdrop-blur transform rotate-45 animate-float-diagonal delay-300" />
      <div className="absolute top-32 left-1/3 w-8 h-8 border-2 border-amber-300/30 transform rotate-12 backdrop-blur animate-float-up delay-700" />
      <div className="absolute top-24 right-1/4 w-16 h-16 border-2 border-amber-300/20 rounded-full backdrop-blur animate-float-circle delay-1000" />
      <div className="absolute bottom-12 left-20 w-12 h-12 border-2 border-amber-300/30 rounded-lg transform rotate-45 backdrop-blur animate-float-diagonal delay-400" />
      <div className="absolute bottom-16 right-24 w-14 h-14 border-2 border-amber-300/25 transform -rotate-12 backdrop-blur animate-float-up delay-800" />
    </div>
  </div>
);

export default Features;