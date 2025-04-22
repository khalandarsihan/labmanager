// src/pages/AboutUs/AdditionalSections.jsx
import React from 'react';

/**
 * Additional sections for the About Us page
 * - Vision and Student Life Section
 * - Student Life at TechEthica
 * - Career and Testimonials Section
 * 
 * Import this component into your main AboutUs component
 */
const AboutUsAdditionalSections = ({ themeStyles, useLightTheme, StarPattern, HexagonPattern }) => {
  return (
    <>
      {/* Vision and Student Life Section */}
      <section className="relative py-10 sm:py-16 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Changed to flex-col on mobile */}
          <div className="flex flex-col md:grid md:grid-cols-3 gap-6 sm:gap-8 mb-12 md:mb-24">
            {/* Vision for the Future */}
            <div className={`${themeStyles.card.bg} rounded-lg p-5 sm:p-8 md:col-span-1 relative overflow-hidden border ${themeStyles.card.border} ${themeStyles.card.hoverBorder} transition-all duration-300 group hover:shadow-lg`}>
              <div className={`absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 ${themeStyles.accent.light} rounded-bl-full`}></div>
              <h2 className={`text-2xl sm:text-3xl font-serif font-bold ${themeStyles.heading} mb-4 sm:mb-6 relative z-10`}>Vision for the Future</h2>
              <div className="flex justify-end mb-3 sm:mb-4">
                <div className="font-arabic text-base sm:text-lg text-amber-600/70">رؤيتنا للمستقبل</div>
              </div>
              
              <div className="relative mb-4 sm:mb-6">
                <HexagonPattern className={`absolute -right-20 top-0 ${themeStyles.pattern} hidden sm:block`} />
                <p className={`${themeStyles.text.primary} mb-3 sm:mb-4 relative z-10 text-sm sm:text-base`}>TechEthica aims to become:</p>
                <ul className={`list-disc pl-4 sm:pl-6 ${themeStyles.text.primary} space-y-2 sm:space-y-3 relative z-10 text-sm sm:text-base`}>
                  <li className="group-hover:translate-x-1 transition-transform duration-300">
                    <span className="font-medium">A leading Techno-Islamic University</span>
                    <div className="text-xs sm:text-sm text-amber-600/70 mt-1">
                      <span className="font-arabic">جامعة تقنية إسلامية رائدة</span>
                    </div>
                  </li>
                  <li className="group-hover:translate-x-1 transition-transform duration-300">
                    <span className="font-medium">A global hub for Islamic AI Ethics Research</span>
                    <div className="text-xs sm:text-sm text-amber-600/70 mt-1">
                      <span className="font-arabic">مركز عالمي لأبحاث أخلاقيات الذكاء الاصطناعي الإسلامية</span>
                    </div>
                  </li>
                  <li className="group-hover:translate-x-1 transition-transform duration-300">
                    <span className="font-medium">A publisher of Islamic-Tech Curriculum</span>
                    <div className="text-xs sm:text-sm text-amber-600/70 mt-1">
                      <span className="font-arabic">ناشر للمناهج التقنية الإسلامية</span>
                    </div>
                  </li>
                  <li className="group-hover:translate-x-1 transition-transform duration-300">
                    <span className="font-medium">A contributor to open-source projects rooted in values</span>
                    <div className="text-xs sm:text-sm text-amber-600/70 mt-1">
                      <span className="font-arabic">مساهم في مشاريع مفتوحة المصدر ذات قيم</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Student Life at TechEthica */}
            <div className={`${themeStyles.card.bg} rounded-lg p-5 sm:p-8 md:col-span-2 relative overflow-hidden border ${themeStyles.card.border} ${themeStyles.card.hoverBorder} transition-all duration-300 hover:shadow-lg`}>
              <div className={`absolute top-0 right-0 w-24 h-24 sm:w-40 sm:h-40 ${themeStyles.accent.light} rounded-bl-full`}></div>
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
                  <h2 className={`text-2xl sm:text-3xl font-serif font-bold ${themeStyles.heading} text-center sm:text-left mb-2 sm:mb-0`}>Student Life at TechEthica</h2>
                  <div className="font-arabic text-base sm:text-lg text-amber-600/70 text-center sm:text-right">الحياة الطلابية</div>
                </div>
                
                <p className={`${themeStyles.text.primary} mb-4 sm:mb-6 relative z-10 text-sm sm:text-base`}>
                  Our learners are part of a growing, vibrant, and spiritually conscious community. 
                  Student life includes:
                </p>
                
                {/* Modified grid for better display on small screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 relative z-10">
                  <div className={`${useLightTheme ? 'bg-amber-100/50' : 'bg-gray-900/30'} p-3 sm:p-4 rounded-lg border ${themeStyles.card.border} hover:transform hover:scale-105 transition-all duration-300`}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 sm:mb-2">
                      <h3 className={`${themeStyles.subheading} font-semibold text-base sm:text-lg text-center sm:text-left`}>Mentorship Circles</h3>
                      <span className="font-arabic text-xs sm:text-sm text-amber-600/70 text-center sm:text-right">حلقات التوجيه</span>
                    </div>
                    <p className={`${themeStyles.text.secondary} text-xs sm:text-sm text-center sm:text-left`}>Regular sessions with scholars and senior technologists</p>
                  </div>
                  
                  <div className={`${useLightTheme ? 'bg-amber-100/50' : 'bg-gray-900/30'} p-3 sm:p-4 rounded-lg border ${themeStyles.card.border} hover:transform hover:scale-105 transition-all duration-300`}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 sm:mb-2">
                      <h3 className={`${themeStyles.subheading} font-semibold text-base sm:text-lg text-center sm:text-left`}>Workshops & Hackathons</h3>
                      <span className="font-arabic text-xs sm:text-sm text-amber-600/70 text-center sm:text-right">ورش العمل</span>
                    </div>
                    <p className={`${themeStyles.text.secondary} text-xs sm:text-sm text-center sm:text-left`}>Hands-on events with an ethical lens</p>
                  </div>
                  
                  <div className={`${useLightTheme ? 'bg-amber-100/50' : 'bg-gray-900/30'} p-3 sm:p-4 rounded-lg border ${themeStyles.card.border} hover:transform hover:scale-105 transition-all duration-300`}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 sm:mb-2">
                      <h3 className={`${themeStyles.subheading} font-semibold text-base sm:text-lg text-center sm:text-left`}>Community Service</h3>
                      <span className="font-arabic text-xs sm:text-sm text-amber-600/70 text-center sm:text-right">خدمة المجتمع</span>
                    </div>
                    <p className={`${themeStyles.text.secondary} text-xs sm:text-sm text-center sm:text-left`}>Projects grounded in Islamic social responsibility</p>
                  </div>
                  
                  <div className={`${useLightTheme ? 'bg-amber-100/50' : 'bg-gray-900/30'} p-3 sm:p-4 rounded-lg border ${themeStyles.card.border} hover:transform hover:scale-105 transition-all duration-300`}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 sm:mb-2">
                      <h3 className={`${themeStyles.subheading} font-semibold text-base sm:text-lg text-center sm:text-left`}>Tazkiyah Sessions</h3>
                      <span className="font-arabic text-xs sm:text-sm text-amber-600/70 text-center sm:text-right">جلسات التزكية</span>
                    </div>
                    <p className={`${themeStyles.text.secondary} text-xs sm:text-sm text-center sm:text-left`}>Focused on personal development and growth</p>
                  </div>
                </div>
                
                <div className="mt-5 sm:mt-6 flex justify-center">
                  <a 
                    href="/student-life" 
                    className={`inline-flex items-center ${themeStyles.text.primary} hover:text-amber-600 transition-colors duration-300 text-sm sm:text-base`}
                  >
                    <span>Explore student life</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Career and Testimonials Section */}
      <section className="relative py-10 sm:py-16 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Modified grid for better mobile layout */}
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-24">
            {/* Career Support Column */}
            <div className={`${themeStyles.card.bg} backdrop-blur-sm rounded-lg p-5 sm:p-8 border ${themeStyles.card.border} ${themeStyles.card.hoverBorder} transition-all duration-300 hover:shadow-lg`}>
              <h2 className={`text-2xl sm:text-3xl font-serif font-bold ${themeStyles.heading} mb-4 sm:mb-6 text-center lg:text-left`}>Career Support & Certification</h2>
              <div className="flex justify-center lg:justify-end mb-3 sm:mb-4">
                <div className="font-arabic text-base sm:text-lg text-amber-600/70">الدعم المهني والشهادات</div>
              </div>
              
              <p className={`${themeStyles.text.primary} mb-3 sm:mb-4 text-sm sm:text-base text-center lg:text-left`}>
                We offer career-oriented certifications and preparation for:
              </p>
              
              <ul className={`list-disc pl-4 sm:pl-6 ${themeStyles.text.primary} space-y-2 sm:space-y-3 text-sm sm:text-base`}>
                <li>
                  <span className="font-medium">Industry roles</span> in Data, DevOps, Software, and AI
                  <div className="text-xs sm:text-sm text-amber-600/70 mt-1">
                    <span className="font-arabic">وظائف في مجال البيانات والبرمجيات والذكاء الاصطناعي</span>
                  </div>
                </li>
                <li>
                  <span className="font-medium">Entrepreneurship</span> with Islamic business ethics
                  <div className="text-xs sm:text-sm text-amber-600/70 mt-1">
                    <span className="font-arabic">ريادة الأعمال بأخلاقيات العمل الإسلامية</span>
                  </div>
                </li>
                <li>
                  <span className="font-medium">Internships</span> & remote project collaborations
                  <div className="text-xs sm:text-sm text-amber-600/70 mt-1">
                    <span className="font-arabic">التدريب العملي والمشاريع التعاونية عن بعد</span>
                  </div>
                </li>
                <li>
                  <span className="font-medium">Islamic teaching certifications</span> (future program)
                  <div className="text-xs sm:text-sm text-amber-600/70 mt-1">
                    <span className="font-arabic">شهادات التدريس الإسلامية (برنامج مستقبلي)</span>
                  </div>
                </li>
              </ul>
              
              {/* <div className="mt-4 sm:mt-6 flex justify-center">
                <a 
                  href="/careers" 
                  className={`inline-flex items-center ${themeStyles.text.primary} hover:text-amber-600 transition-colors duration-300 text-sm sm:text-base`}
                >
                  <span>Learn more about career paths</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div> */}
            </div>
            
            {/* Testimonials Column */}
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
                <h2 className={`text-2xl sm:text-3xl font-serif font-bold ${themeStyles.heading} text-center sm:text-left mb-2 sm:mb-0`}>What Our Students Say</h2>
                <div className="font-arabic text-base sm:text-lg text-amber-600/70 text-center sm:text-right">شهادات الطلاب</div>
              </div>
              
              {/* Redesigned testimonials grid for better mobile display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className={`${themeStyles.quote} p-4 sm:p-6 rounded-lg border ${themeStyles.card.border} relative group hover:shadow-lg transition-all duration-300`}>
                  {/* Quote mark */}
                  <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 text-3xl sm:text-5xl text-amber-500/20 group-hover:text-amber-500/40 transition-colors duration-300">"</div>
                  <p className={`italic ${themeStyles.text.secondary} mb-3 sm:mb-4 relative z-10 text-xs sm:text-sm`}>
                    ""I came to TechEthica with a clear intention: to study nahw and draw closer to Allah through His words. What I found was more than grammar—it was a path of tazkiyah, discipline, and awe. The structure of language opened the structure of the soul."
                  </p>
                  <div className="flex items-center">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${themeStyles.accent.medium} flex items-center justify-center ${useLightTheme ? 'text-amber-800' : 'text-amber-200'} font-bold mr-2 sm:mr-3`}>
                      <span className="text-sm">SK</span>
                    </div>
                    {/* <div>
                      <p className={`${themeStyles.subheading} font-semibold text-sm sm:text-base`}>Shabeer KA</p>
                      <p className={`text-xs ${themeStyles.text.light}`}>Regional Director at LuLu Group International</p>
                    </div> */}
                      <div className="mb-4 sm:mb-0">
                        <p className={`${themeStyles.subheading} font-semibold text-sm sm:text-base`}>Shabeer KA</p>
                        <p className={`text-xs ${themeStyles.text.light}`}>Regional Director at LuLu Group International</p>
                        <p className={`text-xs ${themeStyles.text.light} mt-1 text-sm`}>Muscat, Oman</p>
                      </div>

                  </div>
                </div>
                
                <div className={`${themeStyles.quote} p-4 sm:p-6 rounded-lg border ${themeStyles.card.border} relative group hover:shadow-lg transition-all duration-300`}>
                  {/* Quote mark */}
                  <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 text-3xl sm:text-5xl text-amber-500/20 group-hover:text-amber-500/40 transition-colors duration-300">"</div>
                  <p className={`italic ${themeStyles.text.secondary} mb-3 sm:mb-4 relative z-10 text-xs sm:text-sm`}>
                    "As a Principal Software Architect, I’ve spent decades mastering the syntax of machines. But at TechEthica, nahw taught me the syntax of revelation. Studying advanced grammar and adab has been humbling. I now dedicate time to translating classical Arabic texts, hoping to bridge centuries of ilm for the English-speaking world."
                  </p>
                  <div className="flex items-center">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${themeStyles.accent.medium} flex items-center justify-center ${useLightTheme ? 'text-amber-800' : 'text-amber-200'} font-bold mr-2 sm:mr-3`}>
                      <span className="text-sm">AR</span>
                    </div>
                    <div className="mb-4 sm:mb-0">
                      <p className={`${themeStyles.subheading} font-semibold text-sm sm:text-base`}>Abdul Rasheed</p>
                      <p className={`text-xs ${themeStyles.text.light}`}>Principal Software Architect at Miami International Holdings</p>
                      <p className={`text-xs ${themeStyles.text.light} mt-1 text-sm`}>New Jersey, USA</p>
                    </div>
                  </div>
                </div>
                
                <div className={`${themeStyles.quote} p-4 sm:p-6 rounded-lg border ${themeStyles.card.border} relative group hover:shadow-lg transition-all duration-300`}>
                  {/* Quote mark */}
                  <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 text-3xl sm:text-5xl text-amber-500/20 group-hover:text-amber-500/40 transition-colors duration-300">"</div>
                  <p className={`italic ${themeStyles.text.secondary} mb-3 sm:mb-4 relative z-10 text-xs sm:text-sm`}>
                    "With a solid foundation in nahw, I came to TechEthica seeking refinement—not just in grammar, but in the understanding of revelation. The advanced studies opened doors I never knew existed. Paired with my love for fiqh, the journey has become one of discovering the harmony between language and law, form and meaning. Every session brings me closer to clarity—and to Allah."
                  </p>
                  <div className="flex items-center">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${themeStyles.accent.medium} flex items-center justify-center ${useLightTheme ? 'text-amber-800' : 'text-amber-200'} font-bold mr-2 sm:mr-3`}>
                      <span className="text-sm">SM</span>
                    </div>
                    <div>
                      <p className={`${themeStyles.subheading} font-semibold text-sm sm:text-base`}>Dr. Salahudheen Methukayil</p>
                      <p className={`text-xs ${themeStyles.text.light}`}>General Surgeon</p>
                      <p className={`text-xs ${themeStyles.text.light} mt-1 text-sm`}>Kerala, Inida</p>
                    </div>
                  </div>
                </div>
                
                <div className={`${themeStyles.quote} p-4 sm:p-6 rounded-lg border ${themeStyles.card.border} relative group hover:shadow-lg transition-all duration-300`}>
                  {/* Quote mark */}
                  <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 text-3xl sm:text-5xl text-amber-500/20 group-hover:text-amber-500/40 transition-colors duration-300">"</div>
                  <p className={`italic ${themeStyles.text.secondary} mb-3 sm:mb-4 relative z-10 text-xs sm:text-sm`}>
                    "As an engineer, I’ve always appreciated precision—but studying nahw and fiqh at TechEthica showed me the divine precision of our Deen. Grammar clarified the Qur’an; fiqh clarified life. What began as a quest for understanding turned into a journey of transformation."
                  </p>
                  <div className="flex items-center">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${themeStyles.accent.medium} flex items-center justify-center ${useLightTheme ? 'text-amber-800' : 'text-amber-200'} font-bold mr-2 sm:mr-3`}>
                      <span className="text-sm">AS</span>
                    </div>
                    <div>
                      <p className={`${themeStyles.subheading} font-semibold text-sm sm:text-base`}>AbuBakr Siddique</p>
                      <p className={`text-xs ${themeStyles.text.light}`}>Project Engineer at Kuwait Oil Company (KOC)</p>
                      <p className={`text-xs ${themeStyles.text.light} mt-1 text-sm`}>Kuwait</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUsAdditionalSections;