import React from 'react';
import Hero from './components/Hero';
import Welcome from './components/Welcome';
import Features from './components/Features';
import Carousel from './components/Carousel';
import FeaturedCourses from './components/FeaturedCourses';
import Stats from './components/Stats';
import AnnouncementsAndFAQs from './components/AnnouncementsAndFAQs';
// import AdmissionAnnouncement from './components/AdmissionAnnouncement';
import { useHomepageData } from '@/hooks/useHomepageData';
import { useTheme } from '../../components/ui/ThemeContext';

const HomePage = () => {
  const { 
    homepageContent, 
    featuredCourses, 
    features,
    faqs, 
    carouselSlides,
    isLoading, 
    error 
  } = useHomepageData();
  
  const { useLightTheme, themeStyles } = useTheme();

  if (isLoading) return (
    <div className={`min-h-screen flex items-center justify-center ${themeStyles.background}`}>
      <div className={`${themeStyles.text.primary} text-xl`}>Loading...</div>
    </div>
  );
  
  if (error) return (
    <div className={`min-h-screen flex items-center justify-center ${themeStyles.background}`}>
      <div className="text-red-500 text-xl">Error loading content</div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* IMPORTANT: No background pattern wrapper around the entire page */}
      
      {/* Hero section without any background pattern */}
      <Hero />
      {/* <AdmissionAnnouncement /> */}
      
      {/* Each component below has its own internal BackgroundPattern */}
      <Welcome content={homepageContent?.welcome_content} />
      <AnnouncementsAndFAQs 
        categories={faqs.categories} 
        faqs={faqs.faqs} 
        announcements={homepageContent?.announcements || []}
      />
      <Features features={features} />
      <Carousel slides={carouselSlides} />
      <FeaturedCourses courses={featuredCourses} />
      <Stats />
    </div>
  );
};

export default HomePage;