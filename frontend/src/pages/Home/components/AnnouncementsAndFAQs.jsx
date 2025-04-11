import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import './AnnouncementsAndFAQs.css';
import { useTheme } from '../../../components/ui/ThemeContext';

const AnnouncementsAndFAQs = ({ categories = [], faqs = [], announcements = [] }) => {
  const [openFaq, setOpenFaq] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const { useLightTheme, themeStyles } = useTheme();

  // Check viewport dimensions and orientation
  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsMobile(width < 768);
      setIsLandscape(width > height);
    };
    
    // Initial check
    checkViewport();
    
    // Add event listener
    window.addEventListener('resize', checkViewport);
    
    // Clean up
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Process announcements to ensure they have the expected properties
  const processedAnnouncements = announcements.map(announcement => ({
    ...announcement,
    // Set default values for CTA-related properties if not provided
    showCta: announcement.showCta !== undefined ? announcement.showCta : false,
    ctaText: announcement.ctaText || 'Apply Now'
  }));

  const faqsByCategory = faqs.reduce((acc, faq) => {
    const category = faq.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {});

  return (
    <section className="relative py-12 sm:py-24 overflow-hidden">
      <BackgroundPattern useLightTheme={useLightTheme} />
      
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row relative gap-6 sm:gap-8">
          {/* Left Column - Announcements */}
          <div className="lg:w-1/2 relative group">
            <div className={`absolute inset-0 ${useLightTheme ? 'bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-[#444444]'} backdrop-blur-sm transform skew-x-12 origin-top-left transition-all duration-300 ${useLightTheme ? 'group-hover:bg-amber-100/30' : 'group-hover:bg-gray-700/30'}`} />
            <div className="relative z-10 rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02]">
              <div className="p-5 sm:p-8 h-full">
                <h2 className={`text-3xl sm:text-4xl font-bold ${useLightTheme ? 'text-purple-700' : 'text-amber-300'} mb-4 sm:mb-8 text-center sm:text-left`}>
                  ANNOUNCEMENTS
                </h2>
                
                {/* Reduced height for better content visibility on mobile */}
                <div className="space-y-3 sm:space-y-4 overflow-auto max-h-[400px] md:max-h-[calc(100vh-16rem)] scrollbar-hide">
                  {processedAnnouncements.map((announcement, index) => (
                    <AnnouncementItem 
                      key={index} 
                      announcement={announcement} 
                      useLightTheme={useLightTheme} 
                      themeStyles={themeStyles}
                      isMobile={isMobile}
                    />
                  ))}
                  {processedAnnouncements.length === 0 && (
                    <div className={`${useLightTheme ? 'text-gray-500' : 'text-gray-400'} text-center py-4`}>
                      No announcements at this time
                    </div>
                  )}
                </div>
                
                {/* Main CTA button at the bottom of announcements section */}
                <div className="mt-6 text-center">
                  <a
                    href="/student-registration/new"
                    className={`inline-flex items-center justify-center px-6 py-3 rounded-md text-base sm:text-lg font-bold transform hover:scale-110 transition-all duration-300 ${
                      useLightTheme 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-amber-300 text-gray-900 hover:bg-amber-400'
                    }`}
                  >
                    <i className="fa fa-graduation-cap mr-2"></i>
                    Apply Now
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - FAQs */}
          <div className="lg:w-1/2 relative group">
            <div className={`absolute inset-0 ${useLightTheme ? 'bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-[#444444]'} backdrop-blur-sm transform -skew-x-12 origin-top-right transition-all duration-300 ${useLightTheme ? 'group-hover:bg-purple-100/30' : 'group-hover:bg-gray-700/30'}`} />
            <div className="relative z-10 rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02]">
              <div className="p-5 sm:p-8 h-full">
                <h2 className={`text-3xl sm:text-4xl font-bold ${useLightTheme ? 'text-purple-700' : 'text-amber-300'} mb-4 sm:mb-8 text-center sm:text-left`}>
                  {isMobile ? "FAQs" : "FREQUENTLY\nASKED QUESTIONS"}
                </h2>
                
                {/* Reduced height for better content visibility on mobile */}
                <div className="space-y-4 overflow-auto max-h-[400px] md:max-h-[calc(100vh-16rem)] scrollbar-hide">
                  {categories
                    .sort((a, b) => a.sequence - b.sequence)
                    .map((category) => (
                      <CategorySection
                        key={category.name}
                        category={category}
                        faqs={faqsByCategory[category.name] || []}
                        openFaq={openFaq}
                        setOpenFaq={setOpenFaq}
                        useLightTheme={useLightTheme}
                        themeStyles={themeStyles}
                        isMobile={isMobile}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Theme-specific CSS classes for announcements content */}
      <style jsx>{`
        .theme-heading {
          color: ${useLightTheme ? '#6b21a8' : '#fcd34d'} !important;
          transition: color 0.3s ease;
        }
        .theme-subheading {
          color: ${useLightTheme ? '#7e22ce' : '#fcd34d'} !important;
          transition: color 0.3s ease;
        }
        .theme-text-primary {
          color: ${useLightTheme ? '#1f2937' : '#ffffff'};
          transition: color 0.3s ease;
        }
        .theme-card {
          background-color: ${useLightTheme ? 'rgba(255, 255, 255, 0.4)' : 'rgba(31, 41, 55, 0.3)'};
          backdrop-filter: blur(4px);
          color: ${useLightTheme ? '#374151' : '#e5e7eb'};
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .theme-link:hover {
          color: ${useLightTheme ? '#7e22ce' : '#fcd34d'};
        }
        
        /* Extra specificity for announcement headings */
        .announcement-content h2.theme-heading,
        .announcement-content h3.theme-heading {
          color: ${useLightTheme ? '#6b21a8' : '#fcd34d'} !important;
        }
      `}</style>
    </section>
  );
};

const AnnouncementItem = ({ announcement, useLightTheme, themeStyles, isMobile }) => (
  <div className={`${useLightTheme ? 'bg-white/40 hover:bg-white/60' : 'bg-gray-800/40 hover:bg-gray-800/60'} rounded-lg p-4 sm:p-5 transition-all duration-300`}>
    <div className="flex items-start gap-3">
      <AlertCircle className={`w-5 h-5 ${useLightTheme ? 'text-purple-600' : 'text-amber-300'} flex-shrink-0 mt-1`} />
      <div className="w-full">
        <h3 className={`${useLightTheme ? 'text-purple-700' : 'text-amber-200'} font-semibold text-base sm:text-lg mb-2`}>
          {announcement.title}
        </h3>
        <div 
          className={`${useLightTheme ? 'text-gray-700' : 'text-gray-300'} text-sm sm:text-base announcement-content`}
          dangerouslySetInnerHTML={{ __html: announcement.content }}
        />
        <div className="flex flex-wrap justify-between items-center mt-3">
          <div className={`${useLightTheme ? 'text-gray-500' : 'text-gray-400'} text-xs sm:text-sm`}>
            {announcement.date ? new Date(announcement.date).toLocaleDateString() : ''}
          </div>
          {announcement.showCta && (
            <a 
              href="/student-registration/new" 
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-110 ${
                useLightTheme 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-amber-300 text-gray-900 hover:bg-amber-400'
              }`}
            >
              <i className="fa fa-graduation-cap mr-2"></i>
              {isMobile ? 'Apply' : announcement.ctaText}
            </a>
          )}
        </div>
      </div>
    </div>
  </div>
);

const CategorySection = ({ category, faqs, openFaq, setOpenFaq, useLightTheme, themeStyles, isMobile }) => (
  <div className="category-section mb-6">
    <h3 className={`text-xl sm:text-2xl font-bold ${useLightTheme ? 'text-purple-600' : 'text-amber-300'} mb-4`}>
      {category.category_name}
    </h3>
    <div className="space-y-3">
      {faqs
        .sort((a, b) => a.sequence - b.sequence)
        .map((faq, index) => (
          <FAQItem
            key={`${category.name}-${index}`}
            faq={faq}
            isOpen={openFaq === `${category.name}-${index}`}
            onClick={() => setOpenFaq(
              openFaq === `${category.name}-${index}` ? null : `${category.name}-${index}`
            )}
            useLightTheme={useLightTheme}
            themeStyles={themeStyles}
            isMobile={isMobile}
          />
        ))}
    </div>
  </div>
);

const FAQItem = ({ faq, isOpen, onClick, useLightTheme, themeStyles, isMobile }) => (
  <div className={`${useLightTheme ? 'bg-white/30 hover:bg-white/40' : 'bg-gray-800/30 hover:bg-gray-800/40'} rounded-lg overflow-hidden transition-all duration-300`}>
    <button
      className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
      aria-expanded={isOpen}
      onClick={onClick}
    >
      <span className={`${useLightTheme ? 'text-gray-800' : 'text-white'} font-semibold text-base sm:text-lg pr-4`}>
        {faq.question}
      </span>
      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${useLightTheme ? 'bg-purple-500 text-white' : 'bg-amber-300 text-gray-900'} transition-transform duration-300`}>
        {isOpen ? '−' : '+'}
      </span>
    </button>
    <div
      className={`px-4 pb-4 transition-all duration-300 ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <div 
        className={`${useLightTheme ? 'text-gray-700' : 'text-gray-200'} text-sm sm:text-base`} 
        dangerouslySetInnerHTML={{ __html: faq.answer }}
      />
    </div>
  </div>
);

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
  
      {/* Floating Elements - Reduced and simplified for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top Elements - Fewer on mobile */}
        <div className={`absolute top-20 left-1/3 w-10 h-10 sm:w-14 sm:h-14 border-2 ${borderColor}/20 rounded-lg backdrop-blur transform rotate-45 animate-float-diagonal delay-300`} />
        <div className={`hidden sm:block absolute top-24 right-1/3 w-10 h-10 border-2 ${borderColor}/30 transform -rotate-12 backdrop-blur animate-float-up delay-700`} />
  
        {/* Side Elements - Fewer on mobile */}
        <div className={`hidden sm:block absolute top-1/2 left-1/5 w-16 h-16 border-2 ${borderColor}/20 rounded-full backdrop-blur animate-float-circle delay-1000`} />
        <div className={`absolute bottom-1/3 left-1/4 w-8 h-8 sm:w-12 sm:h-12 border-2 ${borderColor}/30 transform rotate-12 backdrop-blur animate-float-diagonal-reverse delay-500`} />
  
        {/* Bottom Elements - Fewer on mobile */}
        <div className={`hidden sm:block absolute top-2/3 right-1/6 w-10 h-10 border-2 ${borderColor}/25 transform rotate-30 backdrop-blur animate-float-diagonal delay-600`} />
        <div className={`absolute bottom-1/4 right-1/5 w-6 h-6 sm:w-8 sm:h-8 border-2 ${borderColor}/30 rounded-lg backdrop-blur animate-float-circle delay-800`} />
      </div>
    </div>
  );
};

export default AnnouncementsAndFAQs;