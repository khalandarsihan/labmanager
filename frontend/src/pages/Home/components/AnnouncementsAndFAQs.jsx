import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import './AnnouncementsAndFAQs.css';

const AnnouncementsAndFAQs = ({ categories = [], faqs = [], announcements = [] }) => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqsByCategory = faqs.reduce((acc, faq) => {
    const category = faq.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {});

  return (
    <section className="relative py-24 overflow-hidden">
    
        
      <BackgroundPattern />
      
      <div className="max-w-[1920px] mx-auto px-8 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row relative gap-8">
          {/* Left Column - Announcements */}
          
            <div className="lg:w-1/2 relative group">
            <div className="absolute inset-0 bg-gray-700/20 backdrop-blur-sm transform skew-x-12 origin-top-left transition-all duration-300 group-hover:bg-gray-700/30" />
            <div className="relative z-10 rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02]">
                <div className="p-8 h-full">
                <h2 className="text-4xl font-bold text-amber-300 mb-8">
                    ANNOUNCEMENTS
                </h2>
                <div className="space-y-4 overflow-auto max-h-[calc(100vh-16rem)] scrollbar-hide">
                    {announcements.map((announcement, index) => (
                    <AnnouncementItem key={index} announcement={announcement} />
                    ))}
                    {announcements.length === 0 && (
                    <div className="text-gray-400 text-center py-4">
                        No announcements at this time
                    </div>
                    )}
                </div>
                </div>
            </div>
            </div>


          {/* Right Column - FAQs */}
          <div className="lg:w-1/2 relative group">
            <div className="absolute inset-0 bg-gray-700/20 backdrop-blur-sm transform -skew-x-12 origin-top-right transition-all duration-300 group-hover:bg-gray-700/30" />
            <div className="relative z-10 rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02]">
              <div className="p-8 h-full">
                <h2 className="text-4xl font-bold text-amber-300 mb-8">
                  FREQUENTLY<br/>ASKED QUESTIONS
                </h2>
                <div className="space-y-4 overflow-auto max-h-[calc(100vh-16rem)] scrollbar-hide">
                  {categories
                    .sort((a, b) => a.sequence - b.sequence)
                    .map((category) => (
                      <CategorySection
                        key={category.name}
                        category={category}
                        faqs={faqsByCategory[category.name] || []}
                        openFaq={openFaq}
                        setOpenFaq={setOpenFaq}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AnnouncementItem = ({ announcement }) => (
  <div className="bg-gray-800/40 rounded-lg p-4 hover:bg-gray-800/60 transition-all duration-300">
    <div className="flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-amber-300 flex-shrink-0 mt-1" />
      <div>
        <h3 className="text-amber-200 font-semibold mb-2">{announcement.title}</h3>
        <div 
          className="text-gray-300 text-sm"
          dangerouslySetInnerHTML={{ __html: announcement.content }}
        />
        {announcement.date && (
          <div className="text-gray-400 text-xs mt-2">
            {new Date(announcement.date).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  </div>
);

const CategorySection = ({ category, faqs, openFaq, setOpenFaq }) => (
  <div className="category-section">
    <h3 className="text-xl font-semibold text-amber-300 mb-4">
      {category.category_name}
    </h3>
    <div className="space-y-2">
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
          />
        ))}
    </div>
  </div>
);

const FAQItem = ({ faq, isOpen, onClick }) => (
  <div className="bg-gray-800/30 rounded-lg overflow-hidden transition-all duration-300 hover:bg-gray-800/40">
    <button
      className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
      aria-expanded={isOpen}
      onClick={onClick}
    >
      <span className="text-white font-medium pr-4">{faq.question}</span>
      <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-amber-300 text-gray-900 transition-transform duration-300">
        {isOpen ? '−' : '+'}
      </span>
    </button>
    <div
      className={`px-4 pb-4 transition-all duration-300 ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <div className="text-gray-200" dangerouslySetInnerHTML={{ __html: faq.answer }} />
    </div>
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
        {/* Top Group */}
        <div className="absolute top-20 left-1/3 w-14 h-14 border-2 border-amber-300/20 rounded-lg backdrop-blur transform rotate-45 animate-float-diagonal delay-300" />
        <div className="absolute top-24 right-1/3 w-10 h-10 border-2 border-amber-300/30 transform -rotate-12 backdrop-blur animate-float-up delay-700" />
  
        {/* Left Side Elements */}
        <div className="absolute top-1/2 left-1/5 w-16 h-16 border-2 border-amber-300/20 rounded-full backdrop-blur animate-float-circle delay-1000" />
        <div className="absolute bottom-1/3 left-1/4 w-12 h-12 border-2 border-amber-300/30 transform rotate-12 backdrop-blur animate-float-diagonal-reverse delay-500" />
  
        {/* Right Side Elements */}
        <div className="absolute top-1/2 right-1/5 w-12 h-12 border-2 border-amber-300/25 rounded-lg transform rotate-45 backdrop-blur animate-float-up-slow delay-200" />
        <div className="absolute bottom-1/3 right-1/4 w-14 h-14 border-2 border-amber-300/20 rounded-full backdrop-blur animate-float-side delay-900" />
  
        {/* Additional Elements */}
        <div className="absolute top-2/3 right-1/6 w-10 h-10 border-2 border-amber-300/25 transform rotate-30 backdrop-blur animate-float-diagonal delay-600" />
        <div className="absolute bottom-1/4 right-1/5 w-8 h-8 border-2 border-amber-300/30 rounded-lg backdrop-blur animate-float-circle delay-800" />
      </div>
    </div>
  );

export default AnnouncementsAndFAQs;