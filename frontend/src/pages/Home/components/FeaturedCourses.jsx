import React, { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './FeaturedCourses.css';

const FeaturedCourses = ({ courses = [] }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 360;
      container.scrollBy({
        left: cardWidth * (direction === 'left' ? -1 : 1),
        behavior: 'smooth'
      });
    }
  };

  if (!courses.length) {
    return null;
  }

  return (
    <section className="relative py-20 overflow-hidden">
      <BackgroundPattern />
      <div id="featuredCoursesContainer" className="relative z-10">
        <div className="featured-courses-container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-amber-200">Featured Courses</h2>
            <div className="flex gap-2">
              <NavigationButton
                direction="left"
                onClick={() => scroll('left')}
              />
              <NavigationButton
                direction="right"
                onClick={() => scroll('right')}
              />
            </div>
          </div>
          <div
            ref={scrollContainerRef}
            className="courses-scroll flex overflow-x-auto scrollbar-hide scroll-smooth"
          >
            {courses.map((course) => (
              <CourseCard key={course.course_code} course={course} />
            ))}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-30">
        <div className="absolute bottom-8 right-8 w-16 h-16 border-2 border-amber-300/20 rounded-full backdrop-blur animate-float-circle delay-700" />
        <div className="absolute bottom-16 right-16 w-8 h-8 border-2 border-amber-300/20 transform rotate-45 backdrop-blur animate-float-diagonal delay-500" />
      </div>
    </section>
  );
};

const CourseCard = ({ course }) => (
  <div className="course-card">
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:border-amber-300/50 h-full transition-all duration-300 hover:transform hover:scale-[1.02] relative">
      <div className="course-card-image">
        <img
          src={course.featured_image_small || "/assets/labmanager/images/course-placeholder.jpg"}
          alt={course.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-amber-200 mb-2">{course.title}</h3>
        <p className="text-gray-300 text-sm line-clamp-2 mb-4">
          {course.short_description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-amber-300 font-bold">₹{course.price}</span>
          <a
            href={`/courses/${course.course_code}`}
            className="bg-amber-300/90 hover:bg-amber-300 text-gray-900 px-4 py-2 rounded font-semibold transition-all duration-300 hover:shadow-lg"
          >
            Learn More
          </a>
        </div>
      </div>
    </Card>
  </div>
);

const NavigationButton = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className="p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 border border-amber-300/20 hover:border-amber-300/50 transition-all duration-300"
  >
    {direction === 'left' ? (
      <ChevronLeft className="w-6 h-6 text-amber-200" />
    ) : (
      <ChevronRight className="w-6 h-6 text-amber-200" />
    )}
  </button>
);

const BackgroundPattern = () => (
  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute h-full w-px bg-amber-300/60 left-1/4 transform -skew-x-12" />
      <div className="absolute h-full w-px bg-amber-300/50 left-1/2 transform skew-x-12" />
      <div className="absolute h-full w-px bg-amber-300/60 left-3/4 transform -skew-x-12" />
      <div className="absolute w-full h-px bg-amber-300/50 top-1/4 transform -skew-y-12" />
      <div className="absolute w-full h-px bg-amber-300/60 top-1/2 transform skew-y-12" />
      <div className="absolute w-full h-px bg-amber-300/50 top-3/4 transform -skew-y-12" />
    </div>

    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 left-1/4 w-12 h-12 border-2 border-amber-300/20 rounded-lg backdrop-blur transform rotate-45 animate-float-diagonal delay-300" />
      <div className="absolute top-32 left-1/3 w-8 h-8 border-2 border-amber-300/30 transform rotate-12 backdrop-blur animate-float-up delay-700" />
      <div className="absolute top-24 right-1/4 w-16 h-16 border-2 border-amber-300/20 rounded-full backdrop-blur animate-float-circle delay-1000" />
      <div className="absolute top-36 right-1/3 w-10 h-10 border-2 border-amber-300/30 rounded-lg transform -rotate-12 backdrop-blur animate-float-diagonal-reverse delay-500" />
      <div className="absolute top-1/2 left-16 w-14 h-14 border-2 border-amber-300/25 transform rotate-45 backdrop-blur animate-float-up-slow delay-200" />
      <div className="absolute top-1/2 right-16 w-16 h-16 border-2 border-amber-300/20 rounded-full backdrop-blur animate-float-side delay-900" />
      <div className="absolute bottom-12 left-20 w-12 h-12 border-2 border-amber-300/30 rounded-lg transform rotate-45 backdrop-blur animate-float-diagonal delay-400" />
      <div className="absolute bottom-16 right-24 w-14 h-14 border-2 border-amber-300/25 transform -rotate-12 backdrop-blur animate-float-up delay-800" />
      <div className="absolute top-20 left-20 w-6 h-6 border-2 border-amber-300/40 rounded-full backdrop-blur animate-float-circle delay-600" />
      <div className="absolute bottom-24 right-32 w-8 h-8 border-2 border-amber-300/30 transform rotate-45 backdrop-blur animate-float-diagonal-reverse delay-800" />
      <div className="absolute top-60 left-1/2 w-10 h-10 border-2 border-amber-300/35 rounded-lg backdrop-blur animate-float-side delay-100" />
      <div className="absolute top-80 right-80 w-12 h-12 border-2 border-amber-300/25 transform rotate-30 backdrop-blur animate-float-up-slow delay-1100" />
    </div>
  </div>
);

export default FeaturedCourses;