import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Carousel.css';
import { useTheme } from '../../../components/ui/ThemeContext';

const Carousel = ({ slides = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { useLightTheme, themeStyles } = useTheme();

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 2000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  if (!slides || slides.length === 0) return null;

  return (
    <section className="relative py-10 md:py-20 overflow-hidden">
      <BackgroundPattern useLightTheme={useLightTheme} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Replaced fixed height with responsive classes */}
        <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[40rem] overflow-hidden rounded-xl">
          <div 
            className="absolute w-full h-full flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide) => (
              <div
                key={slide.name || slide.id}
                className="w-full h-full flex-shrink-0"
              >
                <div className="relative h-full">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-x-0 bottom-0 ${useLightTheme ? 'bg-gradient-to-t from-purple-100/80 to-transparent' : 'bg-gradient-to-t from-gray-900/80 to-transparent'} p-4 md:p-6`}>
                    <h3 className={`text-xl md:text-2xl font-bold ${useLightTheme ? 'text-purple-700' : 'text-amber-200'} mb-1 md:mb-2`}>
                      {slide.title}
                    </h3>
                    <p className={`text-sm md:text-base ${useLightTheme ? 'text-gray-700' : 'text-gray-200'}`}>
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {slides.length > 1 && (
            <>
              {/* Made navigation buttons size responsive */}
              <button
                onClick={prevSlide}
                className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 ${
                  useLightTheme 
                    ? 'bg-purple-100/80 hover:bg-purple-200 border border-purple-300/20 hover:border-purple-300/50' 
                    : 'bg-gray-800/80 hover:bg-gray-700 border border-amber-300/20 hover:border-amber-300/50'
                } p-1 md:p-2 rounded-full transition-all`}
                aria-label="Previous slide"
              >
                <ChevronLeft className={`h-4 w-4 md:h-6 md:w-6 ${useLightTheme ? 'text-purple-700' : 'text-amber-200'}`} />
              </button>
              <button
                onClick={nextSlide}
                className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 ${
                  useLightTheme 
                    ? 'bg-purple-100/80 hover:bg-purple-200 border border-purple-300/20 hover:border-purple-300/50' 
                    : 'bg-gray-800/80 hover:bg-gray-700 border border-amber-300/20 hover:border-amber-300/50'
                } p-1 md:p-2 rounded-full transition-all`}
                aria-label="Next slide"
              >
                <ChevronRight className={`h-4 w-4 md:h-6 md:w-6 ${useLightTheme ? 'text-purple-700' : 'text-amber-200'}`} />
              </button>

              <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 md:space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? useLightTheme ? 'bg-purple-600 w-3 md:w-4' : 'bg-amber-300 w-3 md:w-4'
                        : useLightTheme ? 'bg-gray-400 hover:bg-purple-500' : 'bg-gray-400 hover:bg-amber-200'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

const BackgroundPattern = ({ useLightTheme }) => {
  const bgGradient = useLightTheme
    ? "bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50"
    : "bg-gradient-to-r from-gray-900 via-gray-800 to-[#444444]";
    
  const borderColor = useLightTheme 
    ? "border-purple-700" 
    : "border-amber-300";
    
  return (
    <div className={`absolute inset-0 ${bgGradient}`}>
      {/* Abstract Lines */}
      <div className="absolute inset-0 opacity-10">
        <div className={`absolute h-full w-px ${borderColor}/60 left-1/4 transform -skew-x-12`} />
        <div className={`absolute h-full w-px ${borderColor}/50 left-1/2 transform skew-x-12`} />
        <div className={`absolute h-full w-px ${borderColor}/60 left-3/4 transform -skew-x-12`} />
        <div className={`absolute w-full h-px ${borderColor}/50 top-1/4 transform -skew-y-12`} />
        <div className={`absolute w-full h-px ${borderColor}/60 top-1/2 transform skew-y-12`} />
        <div className={`absolute w-full h-px ${borderColor}/50 top-3/4 transform -skew-y-12`} />
      </div>

      {/* Floating Elements - Adjusted for responsiveness */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Reduced number of elements on smaller screens */}
        <div className={`absolute top-20 left-1/4 w-8 md:w-12 h-8 md:h-12 border-2 ${borderColor}/20 rounded-lg backdrop-blur transform rotate-45 animate-float-diagonal delay-300`} />
        <div className={`hidden sm:block absolute top-32 left-1/3 w-6 md:w-8 h-6 md:h-8 border-2 ${borderColor}/30 transform rotate-12 backdrop-blur animate-float-up delay-700`} />

        <div className={`absolute top-24 right-1/4 w-10 md:w-16 h-10 md:h-16 border-2 ${borderColor}/20 rounded-full backdrop-blur animate-float-circle delay-1000`} />
        <div className={`hidden sm:block absolute top-36 right-1/3 w-8 md:w-10 h-8 md:h-10 border-2 ${borderColor}/30 rounded-lg transform -rotate-12 backdrop-blur animate-float-diagonal-reverse delay-500`} />

        <div className={`absolute top-1/2 left-16 w-10 md:w-14 h-10 md:h-14 border-2 ${borderColor}/25 transform rotate-45 backdrop-blur animate-float-up-slow delay-200`} />
        <div className={`hidden sm:block absolute top-1/2 right-16 w-12 md:w-16 h-12 md:h-16 border-2 ${borderColor}/20 rounded-full backdrop-blur animate-float-side delay-900`} />

        <div className={`absolute bottom-12 left-20 w-8 md:w-12 h-8 md:h-12 border-2 ${borderColor}/30 rounded-lg transform rotate-45 backdrop-blur animate-float-diagonal delay-400`} />
        <div className={`hidden sm:block absolute bottom-16 right-24 w-10 md:w-14 h-10 md:h-14 border-2 ${borderColor}/25 transform -rotate-12 backdrop-blur animate-float-up delay-800`} />

        <div className={`hidden md:block absolute top-20 left-20 w-6 h-6 border-2 ${borderColor}/40 rounded-full backdrop-blur animate-float-circle delay-600`} />
        <div className={`hidden md:block absolute bottom-24 right-32 w-8 h-8 border-2 ${borderColor}/30 transform rotate-45 backdrop-blur animate-float-diagonal-reverse delay-800`} />
        <div className={`hidden md:block absolute top-60 left-1/2 w-10 h-10 border-2 ${borderColor}/35 rounded-lg backdrop-blur animate-float-side delay-100`} />
        <div className={`hidden lg:block absolute top-80 right-80 w-12 h-12 border-2 ${borderColor}/25 transform rotate-30 backdrop-blur animate-float-up-slow delay-1100`} />
      </div>
    </div>
  );
};

export default Carousel;