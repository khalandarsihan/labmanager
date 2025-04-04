import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import BackgroundPattern from '../../components/ui/BackgroundPattern';
import ContactBar from '../../components/ui/ContactBar';
import ThemeSwitcher from '../../components/ui/ThemeSwitcher';
import { useTheme } from '../../components/ui/ThemeContext';

// Import any additional components you might need
// import { motion } from 'framer-motion'; // If you want to add animations

const AboutUs = () => {
    
  // Use theme context instead of local state
  const { useLightTheme, toggleTheme, themeStyles } = useTheme();
  const [language, setLanguage] = useState('en'); // 'en' for English, 'ar' for Arabic

  // Theme-based styles
//   const themeStyles = useLightTheme ? {
//     background: "bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50",
//     backgroundPattern: "bg-[url('/assets/labmanager/images/light-pattern.png')]",
//     text: {
//       primary: "text-gray-800",
//       secondary: "text-gray-700", 
//       light: "text-gray-600"
//     },
//     heading: "text-amber-800",
//     subheading: "text-amber-700",
//     card: {
//       bg: "bg-white/80",
//       border: "border-amber-200/50",
//       hoverBorder: "hover:border-amber-400/70"
//     },
//     quote: "bg-amber-100/50",
//     cta: {
//       bg: "bg-amber-600",
//       hover: "hover:bg-amber-500"
//     },
//     accent: {
//       light: "bg-amber-500/10",
//       medium: "bg-amber-500/20",
//       strong: "bg-amber-500/30"
//     },
//     pattern: "text-amber-700/5"
//   } : {
//     background: "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700",
//     backgroundPattern: "bg-[url('/assets/labmanager/images/dark-pattern.png')]",
//     text: {
//       primary: "text-gray-200",
//       secondary: "text-gray-300", 
//       light: "text-gray-400"
//     },
//     heading: "text-amber-300",
//     subheading: "text-amber-200",
//     card: {
//       bg: "bg-gray-800/50",
//       border: "border-gray-700/50",
//       hoverBorder: "hover:border-amber-300/30"
//     },
//     quote: "bg-gray-900/50",
//     cta: {
//       bg: "bg-amber-600",
//       hover: "hover:bg-amber-500"
//     },
//     accent: {
//       light: "bg-amber-500/10",
//       medium: "bg-amber-500/20",
//       strong: "bg-amber-500/30"
//     },
//     pattern: "text-amber-500/5"
//   };

  // Get Hijri date
//   const [hijriDate, setHijriDate] = useState("");
  
//   useEffect(() => {
//     // Simple calculation of Hijri date (this is approximate)
//     const today = new Date();
//     const gregorianYear = today.getFullYear();
//     const gregorianMonth = today.getMonth() + 1;
//     const gregorianDay = today.getDate();
    
//     // Very approximate conversion - in production, use a proper Hijri calendar library
//     const hijriYear = Math.floor((gregorianYear - 622) * (33/32));
    
//     // Simplistic representation - replace with actual Hijri calendar calculation in production
//     setHijriDate(`${hijriYear} H`);
    
//     // You can use a proper Hijri date library in production
//     // Example with moment-hijri: setHijriDate(momentHijri().format('iD iMMMM iYYYY'));
//   }, []);



  // Toggle theme function
//   const toggleTheme = () => {
//     setUseLightTheme(!useLightTheme);
//   };

  // SVG patterns for section dividers and decorations
  const GeometricPattern = ({ className }) => (
    <svg className={`${className} w-full h-8`} viewBox="0 0 800 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,30 L50,10 L100,30 L150,50 L200,30 L250,10 L300,30 L350,50 L400,30 L450,10 L500,30 L550,50 L600,30 L650,10 L700,30 L750,50 L800,30" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      />
      <path d="M0,30 L50,50 L100,30 L150,10 L200,30 L250,50 L300,30 L350,10 L400,30 L450,50 L500,30 L550,10 L600,30 L650,50 L700,30 L750,10 L800,30" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      />
    </svg>
  );

  const StarPattern = ({ className }) => (
    <svg className={`${className} w-8 h-8`} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50,0 L61,35 L97,35 L68,57 L79,91 L50,70 L21,91 L32,57 L3,35 L39,35 Z" fill="currentColor" />
    </svg>
  );

  const HexagonPattern = ({ className }) => (
    <svg className={`${className} w-32 h-32 opacity-20`} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50,0 L93.3,25 L93.3,75 L50,100 L6.7,75 L6.7,25 Z" fill="currentColor" />
    </svg>
  );

  return (
    <div className={`min-h-screen ${themeStyles.background} relative overflow-hidden`}>
      {/* Theme Toggles */}
      <div className="fixed top-52 right-6 z-50 flex flex-col gap-3">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
            useLightTheme ? 'bg-amber-600 text-white' : 'bg-gray-800 text-amber-300'
          }`}
          aria-label={useLightTheme ? 'Switch to dark theme' : 'Switch to light theme'}
        >
          {useLightTheme ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        {/* <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
            useLightTheme ? 'bg-amber-600 text-white' : 'bg-gray-800 text-amber-300'
          }`}
          aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
        >
          <span className="font-bold">{language === 'en' ? 'ع' : 'En'}</span>
        </button> */}
      </div>
      
      {/* ContactBar Component at the top */}
      {/* <ContactBar /> */}
      
      {/* Background Pattern */}
      <BackgroundPattern />
      
      {/* Islamic Geometric Patterns Background */}
      <div className="absolute inset-0 bg-repeat opacity-5 pointer-events-none" 
        style={{ backgroundImage: `url('/assets/labmanager/images/geometric-pattern.png')`, backgroundSize: '200px' }}></div>
      
      {/* Arabic Decorative Elements */}
      <div className="absolute top-1/3 right-10 opacity-10 text-9xl transform rotate-12 z-0 hidden lg:block">
        <span className="font-arabic">العلم نور</span>
      </div>
      
      <div className="absolute bottom-1/3 left-10 opacity-10 text-9xl transform -rotate-12 z-0 hidden lg:block">
        <span className="font-arabic">الأخلاق</span>
      </div>
      
      {/* Bismillah Calligraphy at the top */}
      <div className="relative z-10 py-6 text-center">
        <div className="inline-block">
          <div className="font-arabic text-3xl sm:text-4xl text-amber-600/80">
            بسم الله الرحمن الرحيم
          </div>
          <div className="text-sm mt-1 text-amber-600/60">
            In the name of Allah, the Most Gracious, the Most Merciful
          </div>
        </div>
      </div>
      
      {/* Hero Section with Diagonal Design and Arabic Calligraphy */}
      <section className="relative py-12 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          {/* Diagonal Banner */}
          <div className={`absolute top-0 -left-20 right-0 h-full bg-amber-600/20 transform -skew-x-12 -z-1`}></div>
          
          <div className="flex flex-col md:flex-row items-center mb-16 relative">
            <div className="md:w-2/3 text-center md:text-left px-4">
              <h1 className={`text-5xl md:text-6xl font-serif font-bold ${themeStyles.heading} mb-6`}>
                About TechEthica
              </h1>
              <p className={`text-xl ${themeStyles.text.secondary} max-w-3xl mx-auto md:mx-0`}>
                Where Knowledge Meets Ethics — Bridging the gap between cutting-edge technology and timeless Islamic values.
              </p>
              <div className="mt-8">
                <div className="font-arabic text-3xl text-amber-600/80">العلم والأخلاق</div>
                <p className="text-sm mt-1 text-amber-600/60">Knowledge and Ethics</p>
              </div>
            </div>
            
            <div className="md:w-1/3 mt-8 md:mt-0 flex justify-center">
              <div className={`w-64 h-64 relative rounded-full ${themeStyles.accent.medium} flex items-center justify-center overflow-hidden border border-amber-500/30`}>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-transparent"></div>
                <svg className="w-40 h-40 text-amber-600/40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Stylized tech-meets-islamic logo - simplified representation */}
                  <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" />
                  <path d="M30,50 L70,50" stroke="currentColor" strokeWidth="2" />
                  <path d="M50,30 L50,70" stroke="currentColor" strokeWidth="2" />
                  <path d="M35,35 L65,65" stroke="currentColor" strokeWidth="2" />
                  <path d="M35,65 L65,35" stroke="currentColor" strokeWidth="2" />
                  <path d="M50,20 C60,30 70,40 70,50 C70,60 60,70 50,80 C40,70 30,60 30,50 C30,40 40,30 50,20 Z" fill="currentColor" fillOpacity="0.2" />
                </svg>
              </div>
            </div>
          </div>
          
            {/* Hijri Date Display */}
            {/* <div className="flex justify-center mb-12">
            <div className={`inline-flex items-center gap-2 ${themeStyles.accent.light} px-4 py-2 rounded-full`}>
                <span className={`${themeStyles.text.secondary}`}>Current Hijri Year:</span>
                <span className="font-arabic text-xl text-amber-600">{hijriDate}</span>
            </div>
            </div> */}
        </div>
      </section>
      
      {/* Our Values Section */}
      <section className="relative py-12 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-serif font-bold ${themeStyles.heading} mb-4`}>Our Core Values</h2>
            <div className="flex justify-center">
              <div className="font-arabic text-2xl text-amber-600/80 mb-6">قيمنا الأساسية</div>
            </div>
            <GeometricPattern className={themeStyles.pattern} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Value 1: Excellence */}
            <div className={`${themeStyles.card.bg} rounded-lg p-6 border ${themeStyles.card.border} transition-all duration-300 text-center group hover:transform hover:scale-105`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${themeStyles.accent.medium} flex items-center justify-center text-2xl`}>
                <span className="group-hover:scale-110 transition-transform duration-300">✨</span>
              </div>
              <h3 className={`text-xl font-bold ${themeStyles.subheading} mb-2`}>Excellence</h3>
              <div className="font-arabic text-amber-600/70 mb-3">الإحسان</div>
              <p className={`${themeStyles.text.secondary}`}>
                Striving for perfection in everything we do, from academics to character development.
              </p>
            </div>
            
            {/* Value 2: Integrity */}
            <div className={`${themeStyles.card.bg} rounded-lg p-6 border ${themeStyles.card.border} transition-all duration-300 text-center group hover:transform hover:scale-105`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${themeStyles.accent.medium} flex items-center justify-center text-2xl`}>
                <span className="group-hover:scale-110 transition-transform duration-300">⚖️</span>
              </div>
              <h3 className={`text-xl font-bold ${themeStyles.subheading} mb-2`}>Integrity</h3>
              <div className="font-arabic text-amber-600/70 mb-3">الأمانة</div>
              <p className={`${themeStyles.text.secondary}`}>
                Upholding honesty, transparency, and ethical conduct in all our interactions.
              </p>
            </div>
            
            {/* Value 3: Innovation */}
            <div className={`${themeStyles.card.bg} rounded-lg p-6 border ${themeStyles.card.border} transition-all duration-300 text-center group hover:transform hover:scale-105`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${themeStyles.accent.medium} flex items-center justify-center text-2xl`}>
                <span className="group-hover:scale-110 transition-transform duration-300">💡</span>
              </div>
              <h3 className={`text-xl font-bold ${themeStyles.subheading} mb-2`}>Innovation</h3>
              <div className="font-arabic text-amber-600/70 mb-3">الإبداع</div>
              <p className={`${themeStyles.text.secondary}`}>
                Embracing creative solutions while respecting our Islamic principles and heritage.
              </p>
            </div>
            
            {/* Value 4: Community */}
            <div className={`${themeStyles.card.bg} rounded-lg p-6 border ${themeStyles.card.border} transition-all duration-300 text-center group hover:transform hover:scale-105`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${themeStyles.accent.medium} flex items-center justify-center text-2xl`}>
                <span className="group-hover:scale-110 transition-transform duration-300">🤝</span>
              </div>
              <h3 className={`text-xl font-bold ${themeStyles.subheading} mb-2`}>Community</h3>
              <div className="font-arabic text-amber-600/70 mb-3">الأمة</div>
              <p className={`${themeStyles.text.secondary}`}>
                Fostering a supportive environment that celebrates diversity and shared purpose.
              </p>
            </div>
          </div>
          
          {/* Quranic Inspiration */}
          <div className="mb-20">
            <div className={`${themeStyles.card.bg} rounded-lg p-8 border ${themeStyles.card.border} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-40 h-40 text-amber-600/5 font-arabic text-9xl">
                اقرأ
              </div>
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <h3 className={`text-2xl font-serif font-bold ${themeStyles.subheading}`}>Quranic Inspiration</h3>
                  <div className="font-arabic text-lg text-amber-600/70 mb-2">من وحي القرآن</div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/2">
                    <blockquote className="text-center">
                      <p className="font-arabic text-2xl leading-relaxed text-amber-600/80 mb-4">
                        يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ
                      </p>
                      <p className={`italic ${themeStyles.text.secondary} mb-2`}>
                        "Allah will raise those who have believed among you and those who were given knowledge, by degrees."
                      </p>
                      <cite className={`block text-sm ${themeStyles.text.light}`}>— Surah Al-Mujadila 58:11</cite>
                    </blockquote>
                  </div>
                  
                  <div className="md:w-1/2">
                    <blockquote className="text-center">
                      <p className="font-arabic text-2xl leading-relaxed text-amber-600/80 mb-4">
                        إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ
                      </p>
                      <p className={`italic ${themeStyles.text.secondary} mb-2`}>
                        "It is only those who have knowledge among His servants that fear Allah."
                      </p>
                      <cite className={`block text-sm ${themeStyles.text.light}`}>— Surah Fatir 35:28</cite>
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Philosophy Section */}
      <section className="relative py-12 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center mb-24 gap-12">
            {/* Decorative Element */}
            <div className={`hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 w-64 h-64 ${themeStyles.accent.light} rounded-full blur-3xl`}></div>
            
            {/* Content Side */}
            <div className="md:w-2/3 relative z-10">
              <h2 className={`text-3xl font-serif font-bold ${themeStyles.heading} mb-6`}>Our Philosophy</h2>
              <p className={`${themeStyles.text.primary} mb-6 text-lg`}>
                At TechEthica, we believe that true education cultivates the whole person—intellectually, spiritually, and ethically. 
                We draw inspiration from the rich Islamic intellectual tradition while keeping pace with the ever-evolving world of technology.
              </p>
              <blockquote className={`border-l-4 border-amber-500 pl-4 italic ${themeStyles.text.secondary} my-6`}>
                "Indeed, the scholars are the inheritors of the Prophets." – Prophet Muhammad ﷺ
              </blockquote>
              <p className={`${themeStyles.text.primary} mb-4 text-lg`}>Our students are trained to:</p>
              <ul className={`list-disc pl-6 ${themeStyles.text.primary} space-y-2 text-lg`}>
                <li>Think critically and solve real-world problems</li>
                <li>Uphold honesty, humility, and accountability in their work</li>
                <li>Strive for excellence in both Deen and Dunya</li>
              </ul>
              
              <div className="mt-6 text-right">
                <p className="font-arabic text-xl text-amber-600/80">طلب العلم فريضة على كل مسلم</p>
                <p className="text-sm italic text-amber-600/60">Seeking knowledge is obligatory upon every Muslim</p>
              </div>
            </div>
            
            {/* Visual Element */}
            <div className="md:w-1/3 relative">
              <div className={`w-full h-80 ${themeStyles.accent.medium} rounded-lg relative overflow-hidden border border-amber-500/30`}>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-transparent"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl text-amber-600/40">
                  <span className="font-arabic">العلم</span>
                </div>
                <div className="absolute bottom-4 left-0 right-0 text-center text-amber-600/80 text-sm">
                  Knowledge
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Historical Timeline Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-serif font-bold ${themeStyles.heading} mb-4`}>Islamic Legacy in Knowledge</h2>
            <div className="font-arabic text-2xl text-amber-600/80 mb-6">ميراث العلم الإسلامي</div>
            <p className={`${themeStyles.text.secondary} max-w-3xl mx-auto mb-8`}>
              We draw inspiration from the rich history of Islamic scholarship that has contributed significantly to human knowledge.
            </p>
            <GeometricPattern className={themeStyles.pattern} />
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-amber-500/20"></div>
            
            {/* Timeline Items */}
            <div className="grid grid-cols-1 gap-12 relative z-10">
              {/* Timeline Item 1 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                  <div className={`${themeStyles.card.bg} rounded-lg p-6 border ${themeStyles.card.border} transition-all duration-300`}>
                    <div className="font-arabic text-lg text-amber-600/70 mb-2">الخوارزمي</div>
                    <h3 className={`text-xl font-bold ${themeStyles.subheading} mb-2`}>Al-Khwarizmi (780-850 CE)</h3>
                    <p className={`${themeStyles.text.secondary}`}>
                      The father of algebra whose name gave us the word "algorithm." His work laid the foundation for modern computing.
                    </p>
                  </div>
                </div>
                
                <div className="md:hidden w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center z-10">
                  <div className="w-4 h-4 rounded-full bg-white"></div>
                </div>
                
                <div className="hidden md:block absolute left-1/2 top-12 transform -translate-x-1/2 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center z-10">
                  <div className="w-4 h-4 rounded-full bg-white"></div>
                </div>
                
                <div className="md:w-1/2 md:pl-12">
                  <img
                    src="/assets/labmanager/images/algebraic_manuscript_300x200.png"
                    alt="Historical manuscript of algebraic principles"
                    className="w-full h-48 object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
              
              {/* Timeline Item 2 */}
              <div className="flex flex-col md:flex-row-reverse items-center">
                <div className="md:w-1/2 md:pl-12 md:text-left mb-6 md:mb-0">
                  <div className={`${themeStyles.card.bg} rounded-lg p-6 border ${themeStyles.card.border} transition-all duration-300`}>
                    <div className="font-arabic text-lg text-amber-600/70 mb-2">ابن سينا</div>
                    <h3 className={`text-xl font-bold ${themeStyles.subheading} mb-2`}>Ibn Sina (980-1037 CE)</h3>
                    <p className={`${themeStyles.text.secondary}`}>
                      Known as Avicenna in the West, his "Canon of Medicine" was a standard medical text in Europe for centuries.
                    </p>
                  </div>
                </div>
                
                <div className="md:hidden w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center z-10">
                  <div className="w-4 h-4 rounded-full bg-white"></div>
                </div>
                
                <div className="hidden md:block absolute left-1/2 top-96 transform -translate-x-1/2 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center z-10">
                  <div className="w-4 h-4 rounded-full bg-white"></div>
                </div>
                
                <div className="md:w-1/2 md:pr-12">
                  <img
                    src="/assets/labmanager/images/medical_manuscript_300x200.png"
                    alt="Historical medical manuscript"
                    className="w-full h-48 object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
              
              {/* Timeline Item 3 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                  <div className={`${themeStyles.card.bg} rounded-lg p-6 border ${themeStyles.card.border} transition-all duration-300`}>
                    <div className="font-arabic text-lg text-amber-600/70 mb-2">الجزري</div>
                    <h3 className={`text-xl font-bold ${themeStyles.subheading} mb-2`}>Al-Jazari (1136-1206 CE)</h3>
                    <p className={`${themeStyles.text.secondary}`}>
                      An engineering genius who created the first programmable humanoid robot and numerous automated machines.
                    </p>
                  </div>
                </div>
                
                <div className="md:hidden w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center z-10">
                  <div className="w-4 h-4 rounded-full bg-white"></div>
                </div>
                
                <div className="hidden md:block absolute left-1/2 top-[500px] transform -translate-x-1/2 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center z-10">
                  <div className="w-4 h-4 rounded-full bg-white"></div>
                </div>
                
                <div className="md:w-1/2 md:pl-12">
                  <img
                    src="/assets/labmanager/images/engineering_manuscript_300x200.png"
                    alt="Historical engineering manuscript"
                    className="w-full h-48 object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <p className={`${themeStyles.text.secondary} italic mb-4`}>
              At TechEthica, we strive to continue this legacy of innovation and ethical knowledge pursuit.
            </p>
            <div className="font-arabic text-xl text-amber-600/70">نسعى لمواصلة هذا الإرث من الابتكار والمعرفة الأخلاقية</div>
          </div>
        </div>
      </section>
      
      {/* Core Domains Section with Horizontal Cards */}
      <section className="relative py-16 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          {/* Decorative Element */}
          <div className={`hidden md:block absolute right-0 top-1/3 transform w-96 h-96 ${themeStyles.accent.light} rounded-full blur-3xl`}></div>
          
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-serif font-bold ${themeStyles.heading} mb-4`}>Core Domains of Study</h2>
            <div className="font-arabic text-2xl text-amber-600/80 mb-6">مجالات الدراسة الأساسية</div>
            <GeometricPattern className={themeStyles.pattern} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tech Domain Card */}
            <div className={`${themeStyles.card.bg} backdrop-blur-sm border ${themeStyles.card.border} ${themeStyles.card.hoverBorder} transition-all duration-300 p-6 rounded-lg overflow-hidden relative group hover:shadow-lg`}>
              <div className={`absolute top-0 right-0 w-20 h-20 ${themeStyles.accent.medium} rounded-bl-full`}></div>
              <div className="absolute top-6 right-6 font-arabic text-xl text-amber-600/40">تكنولوجيا</div>
              <h3 className={`text-2xl font-semibold ${themeStyles.subheading} mb-4 flex items-center`}>
                <span className="text-3xl mr-3 group-hover:rotate-12 transition-transform duration-300">🧠</span> Modern Technologies
              </h3>
              <ul className={`list-disc pl-6 ${themeStyles.text.primary} space-y-2 mb-4`}>
                <li>Artificial Intelligence & Machine Learning</li>
                <li>Data Science & Analytics</li>
                <li>Cloud Computing (AWS, GCP, Azure)</li>
                <li>DevOps & CI/CD</li>
                <li>Full-Stack Development (React, Node.js, Python)</li>
                <li>Frappe/ERPNext & Open-Source ERP</li>
              </ul>
              <div className="mt-4 flex justify-end">
                <div className="text-amber-600/80 text-sm italic">
                  Embracing innovation with responsibility
                </div>
              </div>
            </div>
            
            {/* Islamic Studies Card */}
            <div className={`${themeStyles.card.bg} backdrop-blur-sm border ${themeStyles.card.border} ${themeStyles.card.hoverBorder} transition-all duration-300 p-6 rounded-lg overflow-hidden relative group hover:shadow-lg`}>
              <div className={`absolute top-0 right-0 w-20 h-20 ${themeStyles.accent.medium} rounded-bl-full`}></div>
              <div className="absolute top-6 right-6 font-arabic text-xl text-amber-600/40">شرعية</div>
              <h3 className={`text-2xl font-semibold ${themeStyles.subheading} mb-4 flex items-center`}>
                <span className="text-3xl mr-3 group-hover:rotate-12 transition-transform duration-300">📖</span> Islamic Studies
              </h3>
              <ul className={`list-disc pl-6 ${themeStyles.text.primary} space-y-2`}>
                <li>Quran with Tajweed & Tafsir</li>
                <li>Hadith Sciences (with focus on Sahih traditions)</li>
                <li>Usul al-Fiqh (Principles of Islamic Jurisprudence)</li>
                <li>Seerah of the Prophet ﷺ</li>
                <li>Islamic History (Tariqh) & Contributions to Science</li>
                <li>Tasawwuf: Ethics, Ihsan & Tazkiyah</li>
                <li>Arabic Language & Grammar</li>
              </ul>
              <div className="mt-4 flex justify-end">
                <div className="text-amber-600/80 text-sm italic">
                  Anchoring technology in timeless values
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Learning Model Section with Visual Elements */}
      <section className="relative py-16 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="relative mb-12">
            <h2 className={`text-3xl font-serif font-bold ${themeStyles.heading} text-center mb-4`}>Our Unique Learning Model</h2>
            <div className="flex justify-center">
              <div className="font-arabic text-2xl text-amber-600/80 mb-6">نموذج التعليم الفريد</div>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 w-24 h-1 bg-amber-400/60 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
            {/* Decorative Elements */}
            <div className="hidden md:block absolute left-1/2 top-0 transform -translate-x-1/2 w-1 h-full bg-amber-500/20"></div>
            
            {/* Integrated Curriculum */}
            <div className={`${themeStyles.card.bg} backdrop-blur-sm rounded-lg p-8 border-l-4 border-amber-500/50 hover:shadow-amber-500/10 hover:shadow-lg transition-all duration-300 group`}>
              <div className="flex items-center mb-4">
                <div className={`w-16 h-16 rounded-full ${themeStyles.accent.medium} flex items-center justify-center text-3xl mr-4 transition-all duration-300 group-hover:scale-110`}>
                  💡
                </div>
                <div>
                  <h3 className={`text-2xl font-semibold ${themeStyles.subheading}`}>Integrated Curriculum</h3>
                  <div className="font-arabic text-lg text-amber-600/70">منهج متكامل</div>
                </div>
              </div>
              <p className={`${themeStyles.text.primary} mb-4`}>
                Each course in tech is complemented with Islamic ethics. For example:
              </p>
              <ul className={`list-disc pl-6 ${themeStyles.text.primary} space-y-3`}>
                <li>
                  <span className="font-medium">AI Ethics</span> studied alongside Islamic views on accountability and knowledge
                  <div className="text-sm text-amber-600/70 mt-1">
                    <span className="font-arabic">المسؤولية في الذكاء الاصطناعي</span>
                  </div>
                </li>
                <li>
                  <span className="font-medium">Project Management</span> coupled with lessons in Amanah (trust) and Adl (justice)
                  <div className="text-sm text-amber-600/70 mt-1">
                    <span className="font-arabic">الأمانة والعدل في إدارة المشاريع</span>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Blended Delivery Modes */}
            <div className={`${themeStyles.card.bg} backdrop-blur-sm rounded-lg p-8 border-l-4 border-amber-500/50 hover:shadow-amber-500/10 hover:shadow-lg transition-all duration-300 group`}>
              <div className="flex items-center mb-4">
                <div className={`w-16 h-16 rounded-full ${themeStyles.accent.medium} flex items-center justify-center text-3xl mr-4 transition-all duration-300 group-hover:scale-110`}>
                  🏫
                </div>
                <div>
                  <h3 className={`text-2xl font-semibold ${themeStyles.subheading}`}>Blended Delivery Modes</h3>
                  <div className="font-arabic text-lg text-amber-600/70">نظام تعليم مختلط</div>
                </div>
              </div>
              <ul className={`list-disc pl-6 ${themeStyles.text.primary} space-y-3`}>
                <li>
                  <span className="font-medium">Online + Onsite Learning</span> (Hybrid model)
                  <div className="text-sm text-amber-600/70 mt-1">
                    <span className="font-arabic">التعلم عبر الإنترنت والحضوري</span>
                  </div>
                </li>
                <li>
                  <span className="font-medium">LMS</span> for structured content & assessments
                  <div className="text-sm text-amber-600/70 mt-1">
                    <span className="font-arabic">نظام إدارة التعلم</span>
                  </div>
                </li>
                <li>
                  <span className="font-medium">Weekly Q&A</span> with instructors, live coding labs, and spiritual sessions
                  <div className="text-sm text-amber-600/70 mt-1">
                    <span className="font-arabic">جلسات أسبوعية للأسئلة والإجابة والبرمجة المباشرة</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Global Perspective Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-serif font-bold ${themeStyles.heading} mb-4`}>Our Global Perspective</h2>
            <div className="font-arabic text-2xl text-amber-600/80 mb-6">نظرتنا العالمية</div>
            <p className={`${themeStyles.text.secondary} max-w-3xl mx-auto`}>
              TechEthica connects with the global Ummah and technology ecosystem to provide students with world-class education.
            </p>
          </div>
          
          <div className={`${themeStyles.card.bg} rounded-lg p-8 border ${themeStyles.card.border} relative overflow-hidden mb-16`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Global Network */}
              <div className="text-center p-4">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${themeStyles.accent.medium} flex items-center justify-center text-3xl`}>
                  🌐
                </div>
                <h3 className={`text-xl font-bold ${themeStyles.subheading} mb-2`}>Global Network</h3>
                <div className="font-arabic text-amber-600/70 mb-3">شبكة عالمية</div>
                <p className={`${themeStyles.text.secondary}`}>
                  Partnerships with Islamic institutions across 15+ countries and major tech companies
                </p>
              </div>
              
              {/* Virtual Exchange */}
              <div className="text-center p-4">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${themeStyles.accent.medium} flex items-center justify-center text-3xl`}>
                  🔄
                </div>
                <h3 className={`text-xl font-bold ${themeStyles.subheading} mb-2`}>Virtual Exchange</h3>
                <div className="font-arabic text-amber-600/70 mb-3">التبادل الافتراضي</div>
                <p className={`${themeStyles.text.secondary}`}>
                  Collaborative projects with students from Malaysia to Morocco, enhancing global perspective
                </p>
              </div>
              
              {/* Industry Connections */}
              <div className="text-center p-4">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${themeStyles.accent.medium} flex items-center justify-center text-3xl`}>
                  🔗
                </div>
                <h3 className={`text-xl font-bold ${themeStyles.subheading} mb-2`}>Industry Connections</h3>
                <div className="font-arabic text-amber-600/70 mb-3">روابط صناعية</div>
                <p className={`${themeStyles.text.secondary}`}>
                  Direct connections to both Islamic finance firms and leading technology companies
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Vision and Student Life Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {/* Vision for the Future */}
            <div className={`${themeStyles.card.bg} rounded-lg p-8 col-span-1 relative overflow-hidden border ${themeStyles.card.border} ${themeStyles.card.hoverBorder} transition-all duration-300 group hover:shadow-lg`}>
              <div className={`absolute top-0 right-0 w-32 h-32 ${themeStyles.accent.light} rounded-bl-full`}></div>
              <h2 className={`text-3xl font-serif font-bold ${themeStyles.heading} mb-6 relative z-10`}>Vision for the Future</h2>
              <div className="flex justify-end mb-4">
                <div className="font-arabic text-lg text-amber-600/70">رؤيتنا للمستقبل</div>
              </div>
              
              <div className="relative mb-6">
                <HexagonPattern className={`absolute -right-20 top-0 ${themeStyles.pattern}`} />
                <p className={`${themeStyles.text.primary} mb-4 relative z-10`}>TechEthica aims to become:</p>
                <ul className={`list-disc pl-6 ${themeStyles.text.primary} space-y-3 relative z-10`}>
                  <li className="group-hover:translate-x-1 transition-transform duration-300">
                    <span className="font-medium">A leading Techno-Islamic University</span>
                    <div className="text-sm text-amber-600/70 mt-1">
                      <span className="font-arabic">جامعة تقنية إسلامية رائدة</span>
                    </div>
                  </li>
                  <li className="group-hover:translate-x-1 transition-transform duration-300">
                    <span className="font-medium">A global hub for Islamic AI Ethics Research</span>
                    <div className="text-sm text-amber-600/70 mt-1">
                      <span className="font-arabic">مركز عالمي لأبحاث أخلاقيات الذكاء الاصطناعي الإسلامية</span>
                    </div>
                  </li>
                  <li className="group-hover:translate-x-1 transition-transform duration-300">
                    <span className="font-medium">A publisher of Islamic-Tech Curriculum</span>
                    <div className="text-sm text-amber-600/70 mt-1">
                      <span className="font-arabic">ناشر للمناهج التقنية الإسلامية</span>
                    </div>
                  </li>
                  <li className="group-hover:translate-x-1 transition-transform duration-300">
                    <span className="font-medium">A contributor to open-source projects rooted in values</span>
                    <div className="text-sm text-amber-600/70 mt-1">
                      <span className="font-arabic">مساهم في مشاريع مفتوحة المصدر ذات قيم</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Student Life at TechEthica */}
            <div className={`${themeStyles.card.bg} rounded-lg p-8 md:col-span-2 relative overflow-hidden border ${themeStyles.card.border} ${themeStyles.card.hoverBorder} transition-all duration-300 hover:shadow-lg`}>
              <div className={`absolute top-0 right-0 w-40 h-40 ${themeStyles.accent.light} rounded-bl-full`}></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-3xl font-serif font-bold ${themeStyles.heading}`}>Student Life at TechEthica</h2>
                  <div className="font-arabic text-lg text-amber-600/70">الحياة الطلابية</div>
                </div>
                
                <p className={`${themeStyles.text.primary} mb-6 relative z-10`}>
                  Our learners are part of a growing, vibrant, and spiritually conscious community. 
                  Student life includes:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                  <div className={`${useLightTheme ? 'bg-amber-100/50' : 'bg-gray-900/30'} p-4 rounded-lg border ${themeStyles.card.border} hover:transform hover:scale-105 transition-all duration-300`}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className={`${themeStyles.subheading} font-semibold`}>Mentorship Circles</h3>
                      <span className="font-arabic text-sm text-amber-600/70">حلقات التوجيه</span>
                    </div>
                    <p className={themeStyles.text.secondary}>Regular sessions with scholars and senior technologists</p>
                  </div>
                  
                  <div className={`${useLightTheme ? 'bg-amber-100/50' : 'bg-gray-900/30'} p-4 rounded-lg border ${themeStyles.card.border} hover:transform hover:scale-105 transition-all duration-300`}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className={`${themeStyles.subheading} font-semibold`}>Workshops & Hackathons</h3>
                      <span className="font-arabic text-sm text-amber-600/70">ورش العمل</span>
                    </div>
                    <p className={themeStyles.text.secondary}>Hands-on events with an ethical lens</p>
                  </div>
                  
                  <div className={`${useLightTheme ? 'bg-amber-100/50' : 'bg-gray-900/30'} p-4 rounded-lg border ${themeStyles.card.border} hover:transform hover:scale-105 transition-all duration-300`}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className={`${themeStyles.subheading} font-semibold`}>Community Service</h3>
                      <span className="font-arabic text-sm text-amber-600/70">خدمة المجتمع</span>
                    </div>
                    <p className={themeStyles.text.secondary}>Projects grounded in Islamic social responsibility</p>
                  </div>
                  
                  <div className={`${useLightTheme ? 'bg-amber-100/50' : 'bg-gray-900/30'} p-4 rounded-lg border ${themeStyles.card.border} hover:transform hover:scale-105 transition-all duration-300`}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className={`${themeStyles.subheading} font-semibold`}>Tazkiyah Sessions</h3>
                      <span className="font-arabic text-sm text-amber-600/70">جلسات التزكية</span>
                    </div>
                    <p className={themeStyles.text.secondary}>Focused on personal development and growth</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <a 
                    href="/student-life" 
                    className={`inline-flex items-center ${themeStyles.text.primary} hover:text-amber-600 transition-colors duration-300`}
                  >
                    <span>Explore student life</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
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
      <section className="relative py-16 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
            {/* Career Support Column */}
            <div className={`${themeStyles.card.bg} backdrop-blur-sm rounded-lg p-8 border ${themeStyles.card.border} ${themeStyles.card.hoverBorder} transition-all duration-300 hover:shadow-lg`}>
              <h2 className={`text-3xl font-serif font-bold ${themeStyles.heading} mb-6`}>Career Support & Certification</h2>
              <div className="flex justify-end mb-4">
                <div className="font-arabic text-lg text-amber-600/70">الدعم المهني والشهادات</div>
              </div>
              
              <p className={`${themeStyles.text.primary} mb-4`}>
                We offer career-oriented certifications and preparation for:
              </p>
              
              <ul className={`list-disc pl-6 ${themeStyles.text.primary} space-y-3`}>
                <li>
                  <span className="font-medium">Industry roles</span> in Data, DevOps, Software, and AI
                  <div className="text-sm text-amber-600/70 mt-1">
                    <span className="font-arabic">وظائف في مجال البيانات والبرمجيات والذكاء الاصطناعي</span>
                  </div>
                </li>
                <li>
                  <span className="font-medium">Entrepreneurship</span> with Islamic business ethics
                  <div className="text-sm text-amber-600/70 mt-1">
                    <span className="font-arabic">ريادة الأعمال بأخلاقيات العمل الإسلامية</span>
                  </div>
                </li>
                <li>
                  <span className="font-medium">Internships</span> & remote project collaborations
                  <div className="text-sm text-amber-600/70 mt-1">
                    <span className="font-arabic">التدريب العملي والمشاريع التعاونية عن بعد</span>
                  </div>
                </li>
                <li>
                  <span className="font-medium">Islamic teaching certifications</span> (future program)
                  <div className="text-sm text-amber-600/70 mt-1">
                    <span className="font-arabic">شهادات التدريس الإسلامية (برنامج مستقبلي)</span>
                  </div>
                </li>
              </ul>
              
              <div className="mt-6 flex justify-center">
                <a 
                  href="/careers" 
                  className={`inline-flex items-center ${themeStyles.text.primary} hover:text-amber-600 transition-colors duration-300`}
                >
                  <span>Learn more about career paths</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Testimonials Column */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-3xl font-serif font-bold ${themeStyles.heading}`}>What Our Students Say</h2>
                <div className="font-arabic text-lg text-amber-600/70">شهادات الطلاب</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`${themeStyles.quote} p-6 rounded-lg border ${themeStyles.card.border} relative group hover:shadow-lg transition-all duration-300`}>
                  {/* Quote mark */}
                  <div className="absolute -top-4 -left-4 text-5xl text-amber-500/20 group-hover:text-amber-500/40 transition-colors duration-300">"</div>
                  <p className={`italic ${themeStyles.text.secondary} mb-4 relative z-10`}>
                    "At TechEthica, I didn't just learn code—I learned character. The community and mentorship has transformed my approach to technology."
                  </p>
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full ${themeStyles.accent.medium} flex items-center justify-center ${useLightTheme ? 'text-amber-800' : 'text-amber-200'} font-bold mr-3`}>
                      <img 
                        src="/assets/labmanager/images/student-aisha.jpg" 
                        alt="Aisha S." 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <p className={`${themeStyles.subheading} font-semibold`}>Aisha S.</p>
                      <p className={`text-sm ${themeStyles.text.light}`}>Full-Stack Developer & Hafidha</p>
                    </div>
                  </div>
                </div>
                
                <div className={`${themeStyles.quote} p-6 rounded-lg border ${themeStyles.card.border} relative group hover:shadow-lg transition-all duration-300`}>
                  {/* Quote mark */}
                  <div className="absolute -top-4 -left-4 text-5xl text-amber-500/20 group-hover:text-amber-500/40 transition-colors duration-300">"</div>
                  <p className={`italic ${themeStyles.text.secondary} mb-4 relative z-10`}>
                    "The blend of Fiqh and DevOps gave me a new perspective on responsibility and trust in the digital age. I now approach every project with both technical excellence and ethical considerations."
                  </p>
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full ${themeStyles.accent.medium} flex items-center justify-center ${useLightTheme ? 'text-amber-800' : 'text-amber-200'} font-bold mr-3`}>
                      <img 
                        src="/assets/labmanager/images/student-yusuf.jpg" 
                        alt="Yusuf R." 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <p className={`${themeStyles.subheading} font-semibold`}>Yusuf R.</p>
                      <p className={`text-sm ${themeStyles.text.light}`}>Cloud Engineer</p>
                    </div>
                  </div>
                </div>
                
                <div className={`${themeStyles.quote} p-6 rounded-lg border ${themeStyles.card.border} relative group hover:shadow-lg transition-all duration-300`}>
                  {/* Quote mark */}
                  <div className="absolute -top-4 -left-4 text-5xl text-amber-500/20 group-hover:text-amber-500/40 transition-colors duration-300">"</div>
                  <p className={`italic ${themeStyles.text.secondary} mb-4 relative z-10`}>
                    "Coming from a traditional Islamic background, I was hesitant about tech education. TechEthica provided the perfect bridge, allowing me to excel in AI while strengthening my Islamic identity."
                  </p>
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full ${themeStyles.accent.medium} flex items-center justify-center ${useLightTheme ? 'text-amber-800' : 'text-amber-200'} font-bold mr-3`}>
                      <img 
                        src="/assets/labmanager/images/student-omar.jpg" 
                        alt="Omar K." 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <p className={`${themeStyles.subheading} font-semibold`}>Omar K.</p>
                      <p className={`text-sm ${themeStyles.text.light}`}>AI Research Assistant</p>
                    </div>
                  </div>
                </div>
                
                <div className={`${themeStyles.quote} p-6 rounded-lg border ${themeStyles.card.border} relative group hover:shadow-lg transition-all duration-300`}>
                  {/* Quote mark */}
                  <div className="absolute -top-4 -left-4 text-5xl text-amber-500/20 group-hover:text-amber-500/40 transition-colors duration-300">"</div>
                  <p className={`italic ${themeStyles.text.secondary} mb-4 relative z-10`}>
                    "The global community at TechEthica connected me with Muslims in tech across the world. I now lead an international open-source project with team members from four continents."
                  </p>
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full ${themeStyles.accent.medium} flex items-center justify-center ${useLightTheme ? 'text-amber-800' : 'text-amber-200'} font-bold mr-3`}>
                      <img 
                        src="/assets/labmanager/images/student-zahra.jpg" 
                        alt="Zahra M." 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <p className={`${themeStyles.subheading} font-semibold`}>Zahra M.</p>
                      <p className={`text-sm ${themeStyles.text.light}`}>Open Source Contributor & Data Scientist</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact & Admissions Call-to-Action */}
      <section className="relative py-16 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="relative overflow-hidden rounded-xl">
            {/* <div className="absolute inset-0 bg-gradient-to-r from-amber-700/70 to-amber-600/50"></div>
            <div className="absolute inset-0 bg-[url('/assets/labmanager/images/pattern-bg.png')] opacity-10 bg-repeat"></div> */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/80"></div>
            <div className="absolute inset-0 bg-[url('/assets/labmanager/images/pattern-bg.png')] opacity-10 bg-repeat"></div>
            {/* <div className="absolute inset-0 bg-gradient-to-r from-emerald-800/80 to-emerald-600/70"></div>
            <div className="absolute inset-0 bg-[url('/assets/labmanager/images/pattern-bg.png')] opacity-10 bg-repeat"></div> */}
            {/* <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-red-800/70"></div>
            <div className="absolute inset-0 bg-[url('/assets/labmanager/images/pattern-bg.png')] opacity-10 bg-repeat"></div> */}
            
            {/* Islamic Pattern Overlay */}
            <div className="absolute inset-0 opacity-5">
              <svg className="h-full w-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <pattern id="islamic-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M10,0 L20,10 L10,20 L0,10 Z" fill="none" stroke="white" strokeWidth="0.5" />
                  <path d="M10,0 L0,10 L10,20 L20,10 Z" fill="none" stroke="white" strokeWidth="0.5" />
                  <circle cx="10" cy="10" r="3" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
                <rect x="0" y="0" width="100" height="100" fill="url(#islamic-pattern)" />
              </svg>
            </div>
            
            <div className="relative z-10 p-10 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-serif font-bold text-white mb-0">Contact & Admissions</h2>
                    <span className="font-arabic text-lg text-amber-200/90">التواصل والقبول</span>
                  </div>
                  <div className="text-amber-100 space-y-4 mb-6">
                    <p className="font-bold text-lg">🗓️ Admissions 2025-26 Now Open</p>
                    <p>🚀 Start your journey in tech and Deen today.</p>
                    <p>📞 <strong>Call Us:</strong> +91 9074591600</p>
                    <p>🌐 <strong>Visit Us:</strong> techethica.edu.in</p>
                    <p>✉️ <strong>Email:</strong> info@techethica.edu.in</p>
                  </div>
                  
                  {/* Admissions Timeline */}
                  <div className={`mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm`}>
                    <h3 className="text-xl font-bold text-amber-200 mb-3">Admissions Timeline</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-amber-100">Application Deadline</span>
                        <span className="text-white">June 30, 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-100">Interviews</span>
                        <span className="text-white">July 10-25, 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-100">Results</span>
                        <span className="text-white">August 5, 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-100">Classes Begin</span>
                        <span className="text-white">September 1, 2025</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                  <div className={`p-6 bg-white/10 rounded-lg backdrop-blur-sm mb-6 w-full`}>
                    <p className="text-amber-100 mb-6 text-center text-lg">
                      Ready to embark on a transformative educational journey that combines technical excellence with ethical foundation?
                    </p>
                    <div className="text-center mb-6">
                      <StarPattern className="inline-block text-amber-300/30 mx-1" />
                      <StarPattern className="inline-block text-amber-300/30 mx-1" />
                      <StarPattern className="inline-block text-amber-300/30 mx-1" />
                    </div>
                    <div className="text-center font-arabic text-amber-200/90 text-xl mb-6">
                      انضم إلينا في رحلة التعلم المتميزة
                    </div>
                  </div>
                  
                  <a 
                    href="/student-registration/new" 
                    className={`block w-full md:w-2/3 ${themeStyles.cta.bg} ${themeStyles.cta.hover} text-white text-center py-4 px-6 rounded-lg font-bold transition duration-300 text-lg shadow-lg hover:shadow-amber-600/20 group`}
                  >
                    <div className="flex justify-center items-center">
                      <span className="mr-2 group-hover:translate-x-1 transition-transform duration-300">Apply Now</span>
                      <span className="font-arabic group-hover:translate-x-1 transition-transform duration-300">سجل الآن</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer Section with Additional Links */}
      {/* <section className="relative py-16 overflow-hidden border-t border-amber-500/20">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className={`text-xl font-bold ${themeStyles.subheading} mb-4`}>TechEthica</h3>
              <ul className={`space-y-2 ${themeStyles.text.secondary}`}>
                <li><a href="/" className="hover:text-amber-600 transition-colors duration-300">Home</a></li>
                <li><a href="/about-us" className="hover:text-amber-600 transition-colors duration-300">About Us</a></li>
                <li><a href="/courses/catalog" className="hover:text-amber-600 transition-colors duration-300">Courses</a></li>
                <li><a href="/faculty" className="hover:text-amber-600 transition-colors duration-300">Faculty</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className={`text-xl font-bold ${themeStyles.subheading} mb-4`}>Admissions</h3>
              <ul className={`space-y-2 ${themeStyles.text.secondary}`}>
                <li><a href="/admissions" className="hover:text-amber-600 transition-colors duration-300">How to Apply</a></li>
                <li><a href="/tuition" className="hover:text-amber-600 transition-colors duration-300">Tuition & Fees</a></li>
                <li><a href="/scholarships" className="hover:text-amber-600 transition-colors duration-300">Scholarships</a></li>
                <li><a href="/faq" className="hover:text-amber-600 transition-colors duration-300">FAQs</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className={`text-xl font-bold ${themeStyles.subheading} mb-4`}>Resources</h3>
              <ul className={`space-y-2 ${themeStyles.text.secondary}`}>
                <li><a href="/blog" className="hover:text-amber-600 transition-colors duration-300">Blog</a></li>
                <li><a href="/events" className="hover:text-amber-600 transition-colors duration-300">Events</a></li>
                <li><a href="/library" className="hover:text-amber-600 transition-colors duration-300">Digital Library</a></li>
                <li><a href="/research" className="hover:text-amber-600 transition-colors duration-300">Research</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className={`text-xl font-bold ${themeStyles.subheading} mb-4`}>Connect</h3>
              <ul className={`space-y-2 ${themeStyles.text.secondary}`}>
                <li><a href="/contact" className="hover:text-amber-600 transition-colors duration-300">Contact Us</a></li>
                <li>
                  <div className="flex space-x-4 mt-4">
                    <a href="#" className={`${themeStyles.text.secondary} hover:text-amber-600 transition-colors duration-300`}>
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className={`${themeStyles.text.secondary} hover:text-amber-600 transition-colors duration-300`}>
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className={`${themeStyles.text.secondary} hover:text-amber-600 transition-colors duration-300`}>
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className={`${themeStyles.text.secondary} hover:text-amber-600 transition-colors duration-300`}>
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="mb-4 font-arabic text-2xl text-amber-600/60">
              بسم الله الرحمن الرحيم
            </div>
            <p className={`${themeStyles.text.light} text-sm`}>
              © 2025 TechEthica. All rights reserved. | Powered by TechEthica
            </p>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default AboutUs;