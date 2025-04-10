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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 md:mb-24">
            {/* Vision for the Future */}
            <div className={`${themeStyles.card.bg} rounded-lg p-5 sm:p-8 col-span-1 relative overflow-hidden border ${themeStyles.card.border} ${themeStyles.card.hoverBorder} transition-all duration-300 group hover:shadow-lg`}>
              <div className={`absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 ${themeStyles.accent.light} rounded-bl-full`}></div>
              <h2 className={`text-2xl sm:text-3xl font-serif font-bold ${themeStyles.heading} mb-4 sm:mb-6 relative z-10`}>Vision for the Future</h2>
              <div className="flex justify-end mb-3 sm:mb-4">
                <div className="font-arabic text-base sm:text-lg text-amber-600/70">رؤيتنا للمستقبل</div>
              </div>
              
              <div className="relative mb-4 sm:mb-6">
                <HexagonPattern className={`absolute -right-20 top-0 ${themeStyles.pattern}`} />
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
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className={`text-2xl sm:text-3xl font-serif font-bold ${themeStyles.heading}`}>Student Life at TechEthica</h2>
                  <div className="font-arabic text-base sm:text-lg text-amber-600/70">الحياة الطلابية</div>
                </div>
                
                <p className={`${themeStyles.text.primary} mb-4 sm:mb-6 relative z-10 text-sm sm:text-base`}>
                  Our learners are part of a growing, vibrant, and spiritually conscious community. 
                  Student life includes:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 relative z-10">
                  <div className={`${useLightTheme ? 'bg-amber-100/50' : 'bg-gray-900/30'} p-3 sm:p-4 rounded-lg border ${themeStyles.card.border} hover:transform hover:scale-105 transition-all duration-300`}>
                    <div className="flex justify-between items-center mb-1 sm:mb-2">
                      <h3 className={`${themeStyles.subheading} font-semibold text-base sm:text-lg`}>Mentorship Circles</h3>
                      <span className="font-arabic text-xs sm:text-sm text-amber-600/70">حلقات التوجيه</span>
                    </div>
                    <p className={`${themeStyles.text.secondary} text-xs sm:text-sm`}>Regular sessions with scholars and senior technologists</p>
                  </div>
                  
                  <div className={`${useLightTheme ? 'bg-amber-100/50' : 'bg-gray-900/30'} p-3 sm:p-4 rounded-lg border ${themeStyles.card.border} hover:transform hover:scale-105 transition-all duration-300`}>
                    <div className="flex justify-between items-center mb-1 sm:mb-2">
                      <h3 className={`${themeStyles.subheading} font-semibold text-base sm:text-lg`}>Workshops & Hackathons</h3>
                      <span className="font-arabic text-xs sm:text-sm text-amber-600/70">ورش العمل</span>
                    </div>
                    <p className={`${themeStyles.text.secondary} text-xs sm:text-sm`}>Hands-on events with an ethical lens</p>
                  </div>
                  
                  <div className={`${useLightTheme ? 'bg-amber-100/50' : 'bg-gray-900/30'} p-3 sm:p-4 rounded-lg border ${themeStyles.card.border} hover:transform hover:scale-105 transition-all duration-300`}>
                    <div className="flex justify-between items-center mb-1 sm:mb-2">
                      <h3 className={`${themeStyles.subheading} font-semibold text-base sm:text-lg`}>Community Service</h3>
                      <span className="font-arabic text-xs sm:text-sm text-amber-600/70">خدمة المجتمع</span>
                    </div>
                    <p className={`${themeStyles.text.secondary} text-xs sm:text-sm`}>Projects grounded in Islamic social responsibility</p>
                  </div>
                  
                  <div className={`${useLightTheme ? 'bg-amber-100/50' : 'bg-gray-900/30'} p-3 sm:p-4 rounded-lg border ${themeStyles.card.border} hover:transform hover:scale-105 transition-all duration-300`}>
                    <div className="flex justify-between items-center mb-1 sm:mb-2">
                      <h3 className={`${themeStyles.subheading} font-semibold text-base sm:text-lg`}>Tazkiyah Sessions</h3>
                      <span className="font-arabic text-xs sm:text-sm text-amber-600/70">جلسات التزكية</span>
                    </div>
                    <p className={`${themeStyles.text.secondary} text-xs sm:text-sm`}>Focused on personal development and growth</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-24">
            {/* Career Support Column */}
            <div className={`${themeStyles.card.bg} backdrop-blur-sm rounded-lg p-5 sm:p-8 border ${themeStyles.card.border} ${themeStyles.card.hoverBorder} transition-all duration-300 hover:shadow-lg`}>
              <h2 className={`text-2xl sm:text-3xl font-serif font-bold ${themeStyles.heading} mb-4 sm:mb-6`}>Career Support & Certification</h2>
              <div className="flex justify-end mb-3 sm:mb-4">
                <div className="font-arabic text-base sm:text-lg text-amber-600/70">الدعم المهني والشهادات</div>
              </div>
              
              <p className={`${themeStyles.text.primary} mb-3 sm:mb-4 text-sm sm:text-base`}>
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
              
              <div className="mt-4 sm:mt-6 flex justify-center">
                <a 
                  href="/careers" 
                  className={`inline-flex items-center ${themeStyles.text.primary} hover:text-amber-600 transition-colors duration-300 text-sm sm:text-base`}
                >
                  <span>Learn more about career paths</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Testimonials Column */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className={`text-2xl sm:text-3xl font-serif font-bold ${themeStyles.heading}`}>What Our Students Say</h2>
                <div className="font-arabic text-base sm:text-lg text-amber-600/70">شهادات الطلاب</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className={`${themeStyles.quote} p-4 sm:p-6 rounded-lg border ${themeStyles.card.border} relative group hover:shadow-lg transition-all duration-300`}>
                  {/* Quote mark */}
                  <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 text-3xl sm:text-5xl text-amber-500/20 group-hover:text-amber-500/40 transition-colors duration-300">"</div>
                  <p className={`italic ${themeStyles.text.secondary} mb-3 sm:mb-4 relative z-10 text-xs sm:text-sm`}>
                    "At TechEthica, I didn't just learn code—I learned character. The community and mentorship has transformed my approach to technology."
                  </p>
                  <div className="flex items-center">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${themeStyles.accent.medium} flex items-center justify-center ${useLightTheme ? 'text-amber-800' : 'text-amber-200'} font-bold mr-2 sm:mr-3`}>
                      <span className="text-sm">AS</span>
                    </div>
                    <div>
                      <p className={`${themeStyles.subheading} font-semibold text-sm sm:text-base`}>Aisha S.</p>
                      <p className={`text-xs ${themeStyles.text.light}`}>Full-Stack Developer & Hafidha</p>
                    </div>
                  </div>
                </div>
                
                <div className={`${themeStyles.quote} p-4 sm:p-6 rounded-lg border ${themeStyles.card.border} relative group hover:shadow-lg transition-all duration-300`}>
                  {/* Quote mark */}
                  <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 text-3xl sm:text-5xl text-amber-500/20 group-hover:text-amber-500/40 transition-colors duration-300">"</div>
                  <p className={`italic ${themeStyles.text.secondary} mb-3 sm:mb-4 relative z-10 text-xs sm:text-sm`}>
                    "The blend of Fiqh and DevOps gave me a new perspective on responsibility and trust in the digital age. I now approach every project with both technical excellence and ethical considerations."
                  </p>
                  <div className="flex items-center">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${themeStyles.accent.medium} flex items-center justify-center ${useLightTheme ? 'text-amber-800' : 'text-amber-200'} font-bold mr-2 sm:mr-3`}>
                      <span className="text-sm">YR</span>
                    </div>
                    <div>
                      <p className={`${themeStyles.subheading} font-semibold text-sm sm:text-base`}>Yusuf R.</p>
                      <p className={`text-xs ${themeStyles.text.light}`}>Cloud Engineer</p>
                    </div>
                  </div>
                </div>
                
                <div className={`${themeStyles.quote} p-4 sm:p-6 rounded-lg border ${themeStyles.card.border} relative group hover:shadow-lg transition-all duration-300`}>
                  {/* Quote mark */}
                  <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 text-3xl sm:text-5xl text-amber-500/20 group-hover:text-amber-500/40 transition-colors duration-300">"</div>
                  <p className={`italic ${themeStyles.text.secondary} mb-3 sm:mb-4 relative z-10 text-xs sm:text-sm`}>
                    "Coming from a traditional Islamic background, I was hesitant about tech education. TechEthica provided the perfect bridge, allowing me to excel in AI while strengthening my Islamic identity."
                  </p>
                  <div className="flex items-center">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${themeStyles.accent.medium} flex items-center justify-center ${useLightTheme ? 'text-amber-800' : 'text-amber-200'} font-bold mr-2 sm:mr-3`}>
                      <span className="text-sm">OK</span>
                    </div>
                    <div>
                      <p className={`${themeStyles.subheading} font-semibold text-sm sm:text-base`}>Omar K.</p>
                      <p className={`text-xs ${themeStyles.text.light}`}>AI Research Assistant</p>
                    </div>
                  </div>
                </div>
                
                <div className={`${themeStyles.quote} p-4 sm:p-6 rounded-lg border ${themeStyles.card.border} relative group hover:shadow-lg transition-all duration-300`}>
                  {/* Quote mark */}
                  <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 text-3xl sm:text-5xl text-amber-500/20 group-hover:text-amber-500/40 transition-colors duration-300">"</div>
                  <p className={`italic ${themeStyles.text.secondary} mb-3 sm:mb-4 relative z-10 text-xs sm:text-sm`}>
                    "The global community at TechEthica connected me with Muslims in tech across the world. I now lead an international open-source project with team members from four continents."
                  </p>
                  <div className="flex items-center">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${themeStyles.accent.medium} flex items-center justify-center ${useLightTheme ? 'text-amber-800' : 'text-amber-200'} font-bold mr-2 sm:mr-3`}>
                      <span className="text-sm">ZM</span>
                    </div>
                    <div>
                      <p className={`${themeStyles.subheading} font-semibold text-sm sm:text-base`}>Zahra M.</p>
                      <p className={`text-xs ${themeStyles.text.light}`}>Open Source Contributor & Data Scientist</p>
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