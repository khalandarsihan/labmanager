import React from 'react';
import { Card } from '@/components/ui/card';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: 'fas fa-graduation-cap',
      title: 'Expert Instructors',
      description: 'Learn from industry professionals and experienced educators'
    },
    {
      icon: 'fas fa-clock',
      title: 'Flexible Learning',
      description: 'Study at your own pace with 24/7 course access'
    },
    {
      icon: 'fas fa-certificate',
      title: 'Certified Courses',
      description: 'Earn recognized certificates upon completion'
    }
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      <BackgroundPattern />
      <div className="relative container mx-auto px-4 z-10">
        <h2 className="text-4xl font-bold text-center text-amber-200 mb-12">
          Why Choose TechEthica?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-item group">
    <Card className="relative p-8 bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:border-amber-300/50 transition-all duration-300 hover:scale-105">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl" />
      <div className="relative z-10">
        <div className="w-16 h-16 mb-8 mx-auto bg-amber-300/10 rounded-lg flex items-center justify-center group-hover:bg-amber-300/20 transition-all duration-300">
          <i className={`${icon} text-4xl text-amber-300`}></i>
        </div>
        <h3 className="text-xl font-bold text-amber-200 mb-4 text-center">
          {title}
        </h3>
        <p className="text-gray-300 text-center">{description}</p>
      </div>
    </Card>
  </div>
);

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
      <div className="absolute top-20 left-16 w-12 h-12 border-2 border-amber-300/20 rounded-lg backdrop-blur transform rotate-45 animate-float-diagonal delay-300" />
      <div className="absolute top-40 left-32 w-8 h-8 border-2 border-amber-300/30 transform rotate-12 backdrop-blur animate-float-up delay-700" />

      {/* Top Right Group */}
      <div className="absolute top-24 right-20 w-16 h-16 border-2 border-amber-300/20 rounded-full backdrop-blur animate-float-circle delay-1000" />
      <div className="absolute top-48 right-36 w-10 h-10 border-2 border-amber-300/30 rounded-lg transform -rotate-12 backdrop-blur animate-float-diagonal-reverse delay-500" />

      {/* Center Scattered */}
      <div className="absolute top-1/3 left-1/4 w-14 h-14 border-2 border-amber-300/25 transform rotate-45 backdrop-blur animate-float-up-slow delay-200" />
      <div className="absolute top-1/3 right-1/4 w-20 h-20 border-2 border-amber-300/20 rounded-full backdrop-blur animate-float-side delay-900" />

      {/* Bottom Areas */}
      <div className="absolute bottom-96 left-1/3 w-12 h-12 border-2 border-amber-300/30 rounded-lg transform rotate-45 backdrop-blur animate-float-diagonal delay-400" />
      <div className="absolute bottom-80 right-1/4 w-16 h-16 border-2 border-amber-300/25 transform -rotate-12 backdrop-blur animate-float-up delay-1200" />

      {/* Small Decorative Elements */}
      <div className="absolute top-1/2 left-20 w-6 h-6 border-2 border-amber-300/40 rounded-full backdrop-blur animate-float-circle delay-600" />
      <div className="absolute bottom-96 right-32 w-8 h-8 border-2 border-amber-300/30 transform rotate-45 backdrop-blur animate-float-diagonal-reverse delay-800" />
      <div className="absolute top-60 left-1/2 w-10 h-10 border-2 border-amber-300/35 rounded-lg backdrop-blur animate-float-side delay-100" />
      <div className="absolute top-80 right-80 w-12 h-12 border-2 border-amber-300/25 transform rotate-30 backdrop-blur animate-float-up-slow delay-1100" />
    </div>
  </div>
);

export default Features;