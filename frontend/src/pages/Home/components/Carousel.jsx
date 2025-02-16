import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Carousel.css';

const Carousel = ({ slides = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

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
    <section className="relative py-20 overflow-hidden">
      <BackgroundPattern />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="relative h-[40rem] overflow-hidden rounded-xl">
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
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900/80 to-transparent p-6">
                    <h3 className="text-2xl font-bold text-amber-200 mb-2">
                      {slide.title}
                    </h3>
                    <p className="text-gray-200">{slide.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700 p-2 rounded-full border border-amber-300/20 hover:border-amber-300/50 transition-all"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6 text-amber-200" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700 p-2 rounded-full border border-amber-300/20 hover:border-amber-300/50 transition-all"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6 text-amber-200" />
              </button>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? 'bg-amber-300 w-4'
                        : 'bg-gray-400 hover:bg-amber-200'
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

export default Carousel;