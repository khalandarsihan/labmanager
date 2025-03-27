// import React from 'react';
// import Hero from './components/Hero';
// import Welcome from './components/Welcome';
// import Features from './components/Features';
// import Carousel from './components/Carousel';
// import FeaturedCourses from './components/FeaturedCourses';
// import Stats from './components/Stats';
// // import FAQSection from './components/FAQSection';
// import AnnouncementsAndFAQs from './components/AnnouncementsAndFAQs';
// import { useHomepageData } from '@/hooks/useHomepageData';

// const HomePage = () => {
//   const { homepageContent, featuredCourses, faqs, isLoading, error } = useHomepageData();

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error loading content</div>;

//   return (
//     <div className="min-h-screen bg-gray-900">
//       <Hero />
//       <Welcome content={homepageContent?.welcome_content} />
//       <FAQSection categories={faqs.categories} faqs={faqs.faqs} />
//       <Features />
//       <Carousel />
//       <FeaturedCourses courses={featuredCourses} />
//       <Stats />
      
//     </div>
//   );
// };

// export default HomePage;

// import React from 'react';
// import Hero from './components/Hero';
// import Welcome from './components/Welcome';
// import Features from './components/Features';
// import Carousel from './components/Carousel';
// import FeaturedCourses from './components/FeaturedCourses';
// import Stats from './components/Stats';
// import AnnouncementsAndFAQs from './components/AnnouncementsAndFAQs';
// import { useHomepageData } from '@/hooks/useHomepageData';

// const HomePage = () => {
//   const { homepageContent, featuredCourses, faqs, isLoading, error } = useHomepageData();

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error loading content</div>;

//   return (
//     <div className="min-h-screen bg-gray-900">
//       <Hero />
//       <Welcome content={homepageContent?.welcome_content} />
//       <AnnouncementsAndFAQs 
//         categories={faqs.categories} 
//         faqs={faqs.faqs} 
//         announcements={homepageContent?.announcements || []}
//       />
//       <Features />
//       <Carousel />
//       <FeaturedCourses courses={featuredCourses} />
//       <Stats />
//     </div>
//   );
// };

// export default HomePage;

// import React from 'react';
// import Hero from './components/Hero';
// import Welcome from './components/Welcome';
// import Features from './components/Features';
// import Carousel from './components/Carousel';
// import FeaturedCourses from './components/FeaturedCourses';
// import Stats from './components/Stats';
// import AnnouncementsAndFAQs from './components/AnnouncementsAndFAQs';
// import { useHomepageData } from '@/hooks/useHomepageData';

// const HomePage = () => {
//   const { 
//     homepageContent, 
//     featuredCourses, 
//     features,  // Added features from the hook
//     faqs, 
//     isLoading, 
//     error 
//   } = useHomepageData();

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error loading content</div>;

//   return (
//     <div className="min-h-screen bg-gray-900">
//       <Hero />
//       <Welcome content={homepageContent?.welcome_content} />
//       <AnnouncementsAndFAQs 
//         categories={faqs.categories} 
//         faqs={faqs.faqs} 
//         announcements={homepageContent?.announcements || []}
//       />
//       <Features features={features} /> {/* Using features from the hook */}
//       <Carousel />
//       <FeaturedCourses courses={featuredCourses} />
//       <Stats />
//     </div>
//   );
// };

// export default HomePage;

import React from 'react';
import Hero from './components/Hero';
import Welcome from './components/Welcome';
import Features from './components/Features';
import Carousel from './components/Carousel';
import FeaturedCourses from './components/FeaturedCourses';
import Stats from './components/Stats';
import AnnouncementsAndFAQs from './components/AnnouncementsAndFAQs';
import { useHomepageData } from '@/hooks/useHomepageData';
import BackgroundPattern from '@/components/ui/BackgroundPattern'; 

const HomePage = () => {
  const { 
    homepageContent, 
    featuredCourses, 
    features,
    faqs, 
    carouselSlides, // Added carousel slides from the hook
    isLoading, 
    error 
  } = useHomepageData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading content</div>;

  return (
            <div className="relative">
            {/* BackgroundPattern is positioned behind everything */}
            <BackgroundPattern />
    <div className="min-h-screen bg-gray-900">
      <Hero />
      <Welcome content={homepageContent?.welcome_content} />
      <AnnouncementsAndFAQs 
        categories={faqs.categories} 
        faqs={faqs.faqs} 
        announcements={homepageContent?.announcements || []}
      />
      <Features features={features} />
      <Carousel slides={carouselSlides} /> {/* Pass carousel slides as props */}
      <FeaturedCourses courses={featuredCourses} />
      <Stats />
    </div>
    </div>
  );
};

export default HomePage;