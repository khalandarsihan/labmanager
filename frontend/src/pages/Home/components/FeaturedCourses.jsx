import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './FeaturedCourses.css';
import { formatPrice } from '../../../utils/priceFormat';
import { useTheme } from '../../../components/ui/ThemeContext';

const FeaturedCourses = ({ courses = [] }) => {
  const scrollContainerRef = useRef(null);
  const { useLightTheme, themeStyles } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  
  // Touch handling states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  // Update viewport info
  useEffect(() => {
    const updateViewportInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const mobile = width < 768;
      const landscape = width > height;
      
      setIsMobile(mobile);
      setIsLandscape(landscape);
      
      // Determine how many cards are visible at once
      let visible = 4; // Default desktop view
      
      if (mobile) {
        if (landscape) {
          // Mobile in landscape orientation - show 2 cards
          visible = 2;
        } else {
          // Mobile in portrait orientation - show 1 card
          visible = 1;
        }
      } else if (width < 1200) {
        // For tablet sized screens
        visible = 2;
      }
      
      setVisibleCards(visible);
      
      // If current index would cause empty space at the end, adjust it
      const maxValidIndex = Math.max(0, courses.length - visible);
      if (currentIndex > maxValidIndex) {
        setCurrentIndex(maxValidIndex);
      }
    };
    
    updateViewportInfo();
    window.addEventListener('resize', updateViewportInfo);
    window.addEventListener('orientationchange', updateViewportInfo);
    return () => {
      window.removeEventListener('resize', updateViewportInfo);
      window.removeEventListener('orientationchange', updateViewportInfo);
    };
  }, [courses.length, currentIndex]);

  // Navigation moves one card at a time
  const nextSlide = () => {
    // Ensure we don't go past the end of the list
    const maxIndex = Math.max(0, courses.length - visibleCards);
    setCurrentIndex(prevIndex => Math.min(prevIndex + 1, maxIndex));
  };

  const prevSlide = () => {
    // Ensure we don't go before the beginning of the list
    setCurrentIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

  // Simple touch handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const dx = e.pageX - startX;
    if (Math.abs(dx) > 50) {
      if (dx > 0 && currentIndex > 0) {
        prevSlide();
      } else if (dx < 0 && currentIndex < courses.length - visibleCards) {
        nextSlide();
      }
      setIsDragging(false);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const dx = e.touches[0].pageX - startX;
    if (Math.abs(dx) > 50) {
      if (dx > 0 && currentIndex > 0) {
        prevSlide();
      } else if (dx < 0 && currentIndex < courses.length - visibleCards) {
        nextSlide();
      }
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (!courses.length) {
    return null;
  }

  // Determine button states
  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex >= courses.length - visibleCards;

  return (
    <section className="relative py-12 sm:py-20 overflow-hidden">
      <BackgroundPattern useLightTheme={useLightTheme} />
      <div id="featuredCoursesContainer" className="relative z-10">
        <div className="featured-courses-container">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className={`text-2xl font-bold ${useLightTheme ? 'text-purple-700' : 'text-amber-200'}`}>Featured Courses</h2>
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                disabled={isAtStart}
                className={`p-2 rounded-full transition-all duration-300 ${
                  useLightTheme
                    ? isAtStart
                      ? 'bg-gray-100 border border-gray-200 cursor-not-allowed'
                      : 'bg-purple-100/80 hover:bg-purple-200 border border-purple-300/20 hover:border-purple-300/50'
                    : isAtStart
                      ? 'bg-gray-900 border border-gray-700 cursor-not-allowed'
                      : 'bg-gray-800/80 hover:bg-gray-700 border border-amber-300/20 hover:border-amber-300/50'
                }`}
                aria-label="Previous course"
              >
                <ChevronLeft className={`w-6 h-6 ${
                  useLightTheme
                    ? isAtStart ? 'text-gray-400' : 'text-purple-700'
                    : isAtStart ? 'text-gray-600' : 'text-amber-200'
                }`} />
              </button>
              <button
                onClick={nextSlide}
                disabled={isAtEnd}
                className={`p-2 rounded-full transition-all duration-300 ${
                  useLightTheme
                    ? isAtEnd
                      ? 'bg-gray-100 border border-gray-200 cursor-not-allowed'
                      : 'bg-purple-100/80 hover:bg-purple-200 border border-purple-300/20 hover:border-purple-300/50'
                    : isAtEnd
                      ? 'bg-gray-900 border border-gray-700 cursor-not-allowed'
                      : 'bg-gray-800/80 hover:bg-gray-700 border border-amber-300/20 hover:border-amber-300/50'
                }`}
                aria-label="Next course"
              >
                <ChevronRight className={`w-6 h-6 ${
                  useLightTheme
                    ? isAtEnd ? 'text-gray-400' : 'text-purple-700'
                    : isAtEnd ? 'text-gray-600' : 'text-amber-200'
                }`} />
              </button>
            </div>
          </div>
          
          <div 
            className="carousel-container overflow-hidden"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchEnd={handleTouchEnd}
          >
            <div
              ref={scrollContainerRef}
              className="carousel-track flex transition-transform duration-500 ease-out"
              style={{
                width: `${courses.length * (100 / visibleCards)}%`,
                transform: `translateX(-${currentIndex * (100 / courses.length)}%)`
              }}
            >
              {courses.map((course, index) => (
                <div
                  key={course.course_code}
                  className="carousel-slide"
                  style={{ width: `${100 / courses.length}%` }}
                >
                  <CourseCard
                    course={course}
                    useLightTheme={useLightTheme}
                    themeStyles={themeStyles}
                    isMobile={isMobile}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-30">
        <div className={`absolute bottom-8 right-8 w-16 h-16 border-2 ${useLightTheme ? 'border-purple-600/20' : 'border-amber-300/20'} rounded-full backdrop-blur animate-float-circle delay-700`} />
        <div className={`absolute bottom-16 right-16 w-8 h-8 border-2 ${useLightTheme ? 'border-purple-600/20' : 'border-amber-300/20'} transform rotate-45 backdrop-blur animate-float-diagonal delay-500`} />
      </div>
    </section>
  );
};

// const CourseCard = ({ course, useLightTheme, themeStyles, isMobile }) => (
//   <div className="course-card px-2 sm:px-4">
//     <Card className={`${useLightTheme ? 'bg-white/50 border-purple-200 hover:border-purple-400 hover:border-2' : 'bg-gray-800/50 border-gray-700/50 hover:border-amber-300 hover:border-2'} backdrop-blur-sm h-full transition-all duration-300 hover:shadow-lg relative`}>
//       <div className="course-card-image">
//         <img
//           src={course.featured_image_small || "/assets/labmanager/images/course-placeholder.jpg"}
//           alt={course.title}
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
//       </div>
//       <div className="p-4 sm:p-6">
//         <h3 className={`text-lg font-bold ${useLightTheme ? 'text-purple-700' : 'text-amber-200'} mb-2`}>{course.title}</h3>
//         <p className={`${useLightTheme ? 'text-gray-700' : 'text-gray-300'} text-sm line-clamp-2 mb-4`}>
//           {course.short_description}
//         </p>
//         <div className="flex justify-between items-center">
//           <span className={`${useLightTheme ? 'text-purple-600' : 'text-amber-300'} font-bold`}>₹{course.price}</span>
//           <a
//             href={`/courses/${course.course_code}`}
//             className={`${useLightTheme ? 'bg-purple-500/90 hover:bg-purple-500 text-white' : 'bg-amber-300/90 hover:bg-amber-300 text-gray-900'} px-3 py-2 rounded font-semibold transition-all duration-300 hover:shadow-lg text-sm sm:text-base`}
//           >
//             Learn More
//           </a>
//         </div>
//       </div>
//     </Card>
//   </div>
// );

const CourseCard = ({ course, useLightTheme, themeStyles, isMobile }) => (
  <div className="course-card px-2 sm:px-4">
    <Card className={`${useLightTheme ? 'bg-white/50 border-purple-200 hover:border-purple-400 hover:border-2' : 'bg-gray-800/50 border-gray-700/50 hover:border-amber-300 hover:border-2'} backdrop-blur-sm h-full transition-all duration-300 hover:shadow-lg relative`}>
      <div className="course-card-image">
        <img
          src={course.featured_image_small || "/assets/labmanager/images/course-placeholder.jpg"}
          alt={course.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
      </div>
      <div className="p-4 sm:p-6">
        <h3 className={`text-lg font-bold ${useLightTheme ? 'text-purple-700' : 'text-amber-200'} mb-2`}>{course.title}</h3>
        <p className={`${useLightTheme ? 'text-gray-700' : 'text-gray-300'} text-sm line-clamp-2 mb-4`}>
          {course.short_description}
        </p>
        <div className="flex justify-between items-center">
          <span className={`${useLightTheme ? 'text-purple-600' : 'text-amber-300'} font-bold`}>
            {formatPrice(course.price)}
          </span>
          <a
            href={`/courses/${course.course_code}`}
            className={`${useLightTheme ? 'bg-purple-500/90 hover:bg-purple-500 text-white' : 'bg-amber-300/90 hover:bg-amber-300 text-gray-900'} px-3 py-2 rounded font-semibold transition-all duration-300 hover:shadow-lg text-sm sm:text-base`}
          >
            Learn More
          </a>
        </div>
      </div>
    </Card>
  </div>
);


const BackgroundPattern = ({ useLightTheme }) => {
  const bgGradient = useLightTheme
    ? "bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50"
    : "bg-gradient-to-r from-gray-900 via-gray-800 to-[#444444]";
    
  const borderColor = useLightTheme 
    ? "border-purple-700" 
    : "border-amber-300";
    
  const opacity = useLightTheme ? "opacity-5" : "opacity-10";

  return (
    <div className={`absolute inset-0 ${bgGradient}`}>
      <div className={`absolute inset-0 ${opacity}`}>
        <div className={`absolute h-full w-px ${borderColor}/60 left-1/4 transform -skew-x-12`} />
        <div className={`absolute h-full w-px ${borderColor}/50 left-1/2 transform skew-x-12`} />
        <div className={`absolute h-full w-px ${borderColor}/60 left-3/4 transform -skew-x-12`} />
        <div className={`absolute w-full h-px ${borderColor}/50 top-1/4 transform -skew-y-12`} />
        <div className={`absolute w-full h-px ${borderColor}/60 top-1/2 transform skew-y-12`} />
        <div className={`absolute w-full h-px ${borderColor}/50 top-3/4 transform -skew-y-12`} />
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-20 left-1/4 w-12 h-12 border-2 ${borderColor}/20 rounded-lg backdrop-blur transform rotate-45 animate-float-diagonal delay-300`} />
        <div className={`absolute top-32 left-1/3 w-8 h-8 border-2 ${borderColor}/30 transform rotate-12 backdrop-blur animate-float-up delay-700`} />
        <div className={`absolute top-24 right-1/4 w-16 h-16 border-2 ${borderColor}/20 rounded-full backdrop-blur animate-float-circle delay-1000`} />
        <div className={`absolute top-36 right-1/3 w-10 h-10 border-2 ${borderColor}/30 rounded-lg transform -rotate-12 backdrop-blur animate-float-diagonal-reverse delay-500`} />
        <div className={`absolute top-1/2 left-16 w-14 h-14 border-2 ${borderColor}/25 transform rotate-45 backdrop-blur animate-float-up-slow delay-200`} />
        <div className={`absolute top-1/2 right-16 w-16 h-16 border-2 ${borderColor}/20 rounded-full backdrop-blur animate-float-side delay-900`} />
        <div className={`absolute bottom-12 left-20 w-12 h-12 border-2 ${borderColor}/30 rounded-lg transform rotate-45 backdrop-blur animate-float-diagonal delay-400`} />
        <div className={`absolute bottom-16 right-24 w-14 h-14 border-2 ${borderColor}/25 transform -rotate-12 backdrop-blur animate-float-up delay-800`} />
        <div className={`absolute top-20 left-20 w-6 h-6 border-2 ${borderColor}/40 rounded-full backdrop-blur animate-float-circle delay-600`} />
        <div className={`absolute bottom-24 right-32 w-8 h-8 border-2 ${borderColor}/30 transform rotate-45 backdrop-blur animate-float-diagonal-reverse delay-800`} />
        <div className={`absolute top-60 left-1/2 w-10 h-10 border-2 ${borderColor}/35 rounded-lg backdrop-blur animate-float-side delay-100`} />
        <div className={`absolute top-80 right-80 w-12 h-12 border-2 ${borderColor}/25 transform rotate-30 backdrop-blur animate-float-up-slow delay-1100`} />
      </div>
    </div>
  );
};

export default FeaturedCourses;