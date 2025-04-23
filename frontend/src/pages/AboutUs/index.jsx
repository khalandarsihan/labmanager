// frontend/src/pages/AboutUs/index.jsx
import React from 'react';
import { useTheme } from '../../components/ui/ThemeContext';
import BackgroundPattern from '../../components/ui/BackgroundPattern';
import ScrollToTop from "../../components/ui/ScrollToTop";
import AboutUsAdditionalSections from './AdditionalSections'; // Import the additional sections


const AboutUs = () => {
  // Use theme context
  const { useLightTheme, themeStyles } = useTheme();

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
    <div className={`min-h-screen ${themeStyles.background} relative overflow-x-hidden`}>
      {/* Background Pattern */}
      <BackgroundPattern />

            
    {/* Add ScrollToTop component here */}
    <ScrollToTop />
      
      {/* Islamic Geometric Patterns Background */}
      <div className="absolute inset-0 bg-repeat opacity-5 pointer-events-none" 
        style={{ backgroundImage: `url('/assets/labmanager/images/geometric-pattern.png')`, backgroundSize: '200px' }}></div>
      
      {/* Arabic Decorative Elements - Only on larger screens */}
      <div className="absolute top-1/3 right-10 opacity-10 text-6xl md:text-9xl transform rotate-12 z-0 hidden lg:block">
        <span className="font-arabic">العلم نور</span>
      </div>
      
      <div className="absolute bottom-1/3 left-10 opacity-10 text-6xl md:text-9xl transform -rotate-12 z-0 hidden lg:block">
        <span className="font-arabic">الأخلاق</span>
      </div>
      
      {/* Bismillah Calligraphy at the top */}
      <div className="relative z-10 py-4 sm:py-6 text-center">
        <div className="inline-block">
          <div className="font-arabic text-2xl sm:text-3xl md:text-4xl text-amber-600/80">
            بسم الله الرحمن الرحيم
          </div>
          <div className="text-xs sm:text-sm mt-1 text-amber-600/60">
            In the name of Allah, the Most Gracious, the Most Merciful
          </div>
        </div>
      </div>
      
      {/* Hero Section with Diagonal Design and Arabic Calligraphy */}
      <section className="relative py-8 sm:py-12 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Diagonal Banner */}
          <div className={`absolute top-0 -left-20 right-0 h-full bg-amber-600/20 transform -skew-x-12 -z-1`}></div>
          
          <div className="flex flex-col md:flex-row items-center mb-8 sm:mb-16 relative">
            <div className="md:w-2/3 text-center md:text-left px-2 sm:px-4">
              <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold ${themeStyles.heading} mb-4 sm:mb-6`}>
                About TechEthica
              </h1>
              <p className={`text-base sm:text-lg md:text-xl ${themeStyles.text.secondary} max-w-3xl mx-auto md:mx-0`}>
                Where Knowledge Meets Ethics — Bridging the gap between cutting-edge technology and timeless Islamic values.
              </p>
              <div className="mt-4 sm:mt-8">
                <div className="font-arabic text-xl sm:text-2xl md:text-3xl text-amber-600/80">العلم والأخلاق</div>
                <p className="text-xs sm:text-sm mt-1 text-amber-600/60">Knowledge and Ethics</p>
              </div>
            </div>
            
            <div className="md:w-1/3 mt-6 md:mt-0 flex justify-center">
              <div className={`w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 relative rounded-full ${themeStyles.accent.medium} flex items-center justify-center overflow-hidden border border-amber-500/30`}>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-transparent"></div>
                <svg className="w-20 h-20 sm:w-30 sm:h-30 md:w-40 md:h-40 text-amber-600/40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        </div>
      </section>
      
      {/* Our Values Section */}
      <section className="relative py-8 sm:py-12 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className={`text-2xl sm:text-3xl font-serif font-bold ${themeStyles.heading} mb-3 sm:mb-4`}>Our Core Values</h2>
            <div className="flex justify-center">
              <div className="font-arabic text-xl sm:text-2xl text-amber-600/80 mb-4 sm:mb-6">قيمنا الأساسية</div>
            </div>
            <GeometricPattern className={themeStyles.pattern} />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-16">
            {/* Value cards - Keeping these the same */}
            {/* Value 1: Excellence */}
            <div className={`${themeStyles.card.bg} rounded-lg p-4 sm:p-6 border ${themeStyles.card.border} transition-all duration-300 text-center group hover:transform hover:scale-105`}>
              <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full ${themeStyles.accent.medium} flex items-center justify-center text-xl sm:text-2xl`}>
                <span className="group-hover:scale-110 transition-transform duration-300">✨</span>
              </div>
              <h3 className={`text-lg sm:text-xl font-bold ${themeStyles.subheading} mb-2`}>Excellence</h3>
              <div className="font-arabic text-amber-600/70 mb-3">الإحسان</div>
              <p className={`${themeStyles.text.secondary} text-sm sm:text-base`}>
                Striving for perfection in everything we do, from academics to character development.
              </p>
            </div>
            
            {/* Value 2: Integrity */}
            <div className={`${themeStyles.card.bg} rounded-lg p-4 sm:p-6 border ${themeStyles.card.border} transition-all duration-300 text-center group hover:transform hover:scale-105`}>
              <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full ${themeStyles.accent.medium} flex items-center justify-center text-xl sm:text-2xl`}>
                <span className="group-hover:scale-110 transition-transform duration-300">⚖️</span>
              </div>
              <h3 className={`text-lg sm:text-xl font-bold ${themeStyles.subheading} mb-2`}>Integrity</h3>
              <div className="font-arabic text-amber-600/70 mb-3">الأمانة</div>
              <p className={`${themeStyles.text.secondary} text-sm sm:text-base`}>
                Upholding honesty, transparency, and ethical conduct in all our interactions.
              </p>
            </div>
            
            {/* Value 3: Innovation */}
            <div className={`${themeStyles.card.bg} rounded-lg p-4 sm:p-6 border ${themeStyles.card.border} transition-all duration-300 text-center group hover:transform hover:scale-105`}>
              <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full ${themeStyles.accent.medium} flex items-center justify-center text-xl sm:text-2xl`}>
                <span className="group-hover:scale-110 transition-transform duration-300">💡</span>
              </div>
              <h3 className={`text-lg sm:text-xl font-bold ${themeStyles.subheading} mb-2`}>Innovation</h3>
              <div className="font-arabic text-amber-600/70 mb-3">الإبداع</div>
              <p className={`${themeStyles.text.secondary} text-sm sm:text-base`}>
                Embracing creative solutions while respecting our Islamic principles and heritage.
              </p>
            </div>
            
            {/* Value 4: Community */}
            <div className={`${themeStyles.card.bg} rounded-lg p-4 sm:p-6 border ${themeStyles.card.border} transition-all duration-300 text-center group hover:transform hover:scale-105`}>
              <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full ${themeStyles.accent.medium} flex items-center justify-center text-xl sm:text-2xl`}>
                <span className="group-hover:scale-110 transition-transform duration-300">🤝</span>
              </div>
              <h3 className={`text-lg sm:text-xl font-bold ${themeStyles.subheading} mb-2`}>Community</h3>
              <div className="font-arabic text-amber-600/70 mb-3">الأمة</div>
              <p className={`${themeStyles.text.secondary} text-sm sm:text-base`}>
                Fostering a supportive environment that celebrates diversity and shared purpose.
              </p>
            </div>
          </div>
          
          {/* Quranic Inspiration */}
          <div className="mb-12 sm:mb-20">
            <div className={`${themeStyles.card.bg} rounded-lg p-5 sm:p-8 border ${themeStyles.card.border} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-40 sm:h-40 text-amber-600/5 font-arabic text-5xl sm:text-9xl">
                اقرأ
              </div>
              <div className="relative z-10">
                <div className="text-center mb-4 sm:mb-6">
                  <h3 className={`text-xl sm:text-2xl font-serif font-bold ${themeStyles.subheading}`}>Quranic Inspiration</h3>
                  <div className="font-arabic text-base sm:text-lg text-amber-600/70 mb-2">من وحي القرآن</div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-5 sm:gap-8">
                  <div className="md:w-1/2">
                    <blockquote className="text-center">
                      <p className="font-arabic text-xl sm:text-2xl leading-relaxed text-amber-600/80 mb-3 sm:mb-4">
                        يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ
                      </p>
                      <p className={`italic text-sm sm:text-base ${themeStyles.text.secondary} mb-1 sm:mb-2`}>
                        "Allah will raise those who have believed among you and those who were given knowledge, by degrees."
                      </p>
                      <cite className={`block text-xs sm:text-sm ${themeStyles.text.light}`}>— Surah Al-Mujadila 58:11</cite>
                    </blockquote>
                  </div>
                  
                  <div className="md:w-1/2">
                    <blockquote className="text-center">
                      <p className="font-arabic text-xl sm:text-2xl leading-relaxed text-amber-600/80 mb-3 sm:mb-4">
                        إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ
                      </p>
                      <p className={`italic text-sm sm:text-base ${themeStyles.text.secondary} mb-1 sm:mb-2`}>
                        "It is only those who have knowledge among His servants that fear Allah."
                      </p>
                      <cite className={`block text-xs sm:text-sm ${themeStyles.text.light}`}>— Surah Fatir 35:28</cite>
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Philosophy Section */}
      <section className="relative py-8 sm:py-12 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center mb-12 sm:mb-24 gap-8 sm:gap-12">
            {/* Decorative Element - Made sure it doesn't interfere on small screens */}
            <div className={`hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 w-32 h-32 lg:w-64 lg:h-64 ${themeStyles.accent.light} rounded-full blur-3xl opacity-70`}></div>
            
            {/* Content Side */}
            <div className="md:w-2/3 relative z-10">
              <h2 className={`text-2xl sm:text-3xl font-serif font-bold ${themeStyles.heading} mb-4 sm:mb-6`}>Our Philosophy</h2>
              <p className={`${themeStyles.text.primary} mb-4 sm:mb-6 text-base sm:text-lg`}>
                At TechEthica, we believe that true education cultivates the whole person—intellectually, spiritually, and ethically. 
                We draw inspiration from the rich Islamic intellectual tradition while keeping pace with the ever-evolving world of technology.
              </p>
              <blockquote className={`border-l-4 border-amber-500 pl-3 sm:pl-4 italic text-sm sm:text-base ${themeStyles.text.secondary} my-4 sm:my-6`}>
                "Indeed, the scholars are the inheritors of the Prophets." – Prophet Muhammad <span className="font-arabic not-italic">صلى الله عليه وسلم</span>
                              </blockquote>
              <p className={`${themeStyles.text.primary} mb-3 sm:mb-4 text-base sm:text-lg`}>Our students are trained to:</p>
              <ul className={`list-disc pl-4 sm:pl-6 ${themeStyles.text.primary} space-y-1 sm:space-y-2 text-base sm:text-lg`}>
                <li>Think critically and solve real-world problems</li>
                <li>Uphold honesty, humility, and accountability in their work</li>
                <li>Strive for excellence in both Deen and Dunya</li>
              </ul>
              
              <div className="mt-4 sm:mt-6 text-right">
                <p className="font-arabic text-lg sm:text-xl text-amber-600/80">طلب العلم فريضة على كل مسلم</p>
                <p className="text-xs sm:text-sm italic text-amber-600/60">Seeking knowledge is obligatory upon every Muslim</p>
              </div>
            </div>
            
            {/* Visual Element */}
            <div className="md:w-1/3 relative">
              <div className={`w-full h-60 sm:h-80 ${themeStyles.accent.medium} rounded-lg relative overflow-hidden border border-amber-500/30`}>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-transparent"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl sm:text-8xl text-amber-600/40">
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
<section className="relative py-10 sm:py-16 overflow-hidden">
  {/* Decorative background elements */}
  <div className="absolute inset-0 z-0 opacity-10">
    <div className="absolute top-0 left-0 w-64 h-64 bg-amber-600 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
    <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-600 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
  </div>

  <div className="container mx-auto px-4 sm:px-6 relative z-10">
    <div className="text-center mb-8 sm:mb-12">
      <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-serif font-bold ${themeStyles.heading} mb-3 sm:mb-4`}>
        Islamic Legacy in Knowledge
      </h2>
      <div className="font-arabic text-xl sm:text-2xl text-amber-600/80 mb-4 sm:mb-6">ميراث العلم الإسلامي</div>
      <p className={`${themeStyles.text.secondary} max-w-3xl mx-auto mb-4 sm:mb-8 text-sm sm:text-base`}>
        We draw inspiration from the rich history of Islamic scholarship that has contributed significantly to human knowledge and shaped modern science and technology.
      </p>
      <GeometricPattern className={themeStyles.pattern} />
    </div>
    
    {/* Timeline Section - Mobile scrollable, desktop beautiful timeline */}
    <div className="mb-12">
      {/* Mobile Card Layout */}
      <div className="md:hidden mb-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Scholar 1 */}
          <div 
            className={`${themeStyles.card.bg} rounded-xl p-5 border ${themeStyles.card.border} shadow-md flex flex-col w-full mx-auto max-w-sm`}
          >
            <div className="rounded-lg overflow-hidden mb-4 h-48">
              <img
                src="/assets/labmanager/images/algebraic_manuscript_300x200.png"
                alt="Historical manuscript of algebraic principles"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="font-arabic text-lg text-amber-600 mb-1">الخوارزمي</div>
              <h3 className={`text-xl font-bold ${themeStyles.subheading} mb-2 flex items-center`}>
                <span className="mr-2 text-amber-500">📊</span>
                Al-Khwarizmi
              </h3>
              <div className="text-sm text-amber-700/70 mb-3">780-850 CE</div>
              <p className={`${themeStyles.text.secondary} text-sm`}>
                The father of algebra whose name gave us the word "algorithm." His work laid the foundation for modern computing.
              </p>
            </div>
          </div>

          {/* Scholar 2 */}
          <div 
            className={`${themeStyles.card.bg} rounded-xl p-5 border ${themeStyles.card.border} shadow-md flex flex-col w-full mx-auto max-w-sm`}
          >
            <div className="rounded-lg overflow-hidden mb-4 h-48">
              <img
                src="/assets/labmanager/images/medical_manuscript_300x200.png"
                alt="Historical medical manuscript"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="font-arabic text-lg text-amber-600 mb-1">ابن سينا</div>
              <h3 className={`text-xl font-bold ${themeStyles.subheading} mb-2 flex items-center`}>
                <span className="mr-2 text-amber-500">🧬</span>
                Ibn Sina
              </h3>
              <div className="text-sm text-amber-700/70 mb-3">980-1037 CE</div>
              <p className={`${themeStyles.text.secondary} text-sm`}>
                Known as Avicenna in the West, his "Canon of Medicine" was a standard medical text in Europe for centuries.
              </p>
            </div>
          </div>

          {/* Scholar 3 */}
          <div 
            className={`${themeStyles.card.bg} rounded-xl p-5 border ${themeStyles.card.border} shadow-md flex flex-col w-full mx-auto max-w-sm`}
          >
            <div className="rounded-lg overflow-hidden mb-4 h-48">
              <img
                src="/assets/labmanager/images/engineering_manuscript_300x200.png"
                alt="Historical engineering manuscript"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="font-arabic text-lg text-amber-600 mb-1">الجزري</div>
              <h3 className={`text-xl font-bold ${themeStyles.subheading} mb-2 flex items-center`}>
                <span className="mr-2 text-amber-500">⚙️</span>
                Al-Jazari
              </h3>
              <div className="text-sm text-amber-700/70 mb-3">1136-1206 CE</div>
              <p className={`${themeStyles.text.secondary} text-sm`}>
                An engineering genius who created the first programmable humanoid robot and numerous automated machines.
              </p>
            </div>
          </div>

          {/* Scholar 4 */}
          <div 
            className={`${themeStyles.card.bg} rounded-xl p-5 border ${themeStyles.card.border} shadow-md flex flex-col w-full mx-auto max-w-sm`}
          >
            <div className="rounded-lg overflow-hidden mb-4 h-48">
              <img
                src="/assets/labmanager/images/optics_manuscript_300x200.png"
                alt="Historical optics manuscript"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="font-arabic text-lg text-amber-600 mb-1">ابن الهيثم</div>
              <h3 className={`text-xl font-bold ${themeStyles.subheading} mb-2 flex items-center`}>
                <span className="mr-2 text-amber-500">👁️</span>
                Ibn Al-Haytham
              </h3>
              <div className="text-sm text-amber-700/70 mb-3">965-1040 CE</div>
              <p className={`${themeStyles.text.secondary} text-sm`}>
                Pioneer in optics who developed the first accurate theory of vision and made significant contributions to astronomy and mathematics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Timeline */}
      <div className="hidden md:block relative">
        {/* Timeline line */}
        {/* <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700"></div> */}
        {/* Timeline line */}
<div className="timeline-line absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700"></div>
        
        
        <div className="space-y-24 relative z-10">
          {/* Timeline Item 1 */}
          <div className="flex items-center">
            {/* Left content */}
            <div className="w-1/2 pr-12 text-right">
              <div 
                className={`${themeStyles.card.bg} rounded-xl p-6 border ${themeStyles.card.border} shadow-lg transition-all duration-300 hover:shadow-xl`}
              >
                <div className="font-arabic text-xl text-amber-600 mb-2">الخوارزمي</div>
                <h3 className={`text-2xl font-bold ${themeStyles.subheading} mb-2 flex justify-end items-center`}>
                  Al-Khwarizmi
                  <span className="ml-2 text-amber-500">📊</span>
                </h3>
                <div className="text-sm text-amber-700/70 mb-3 text-right">780-850 CE</div>
                <p className={`${themeStyles.text.secondary} text-base`}>
                  The father of algebra whose name gave us the word "algorithm." His work laid the foundation for modern computing and mathematical thinking.
                </p>
              </div>
            </div>
            
            {/* Timeline node */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center z-20">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-amber-600 text-sm">📊</span>
                </div>
              </div>
            </div>
            
            {/* Right image */}
            <div className="w-1/2 pl-12">
              <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <img
                  src="/assets/labmanager/images/algebraic_manuscript_300x200.png"
                  alt="Historical manuscript of algebraic principles"
                  className="w-full h-56 object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Timeline Item 2 */}
          <div className="flex items-center">
            {/* Left image for even items */}
            <div className="w-1/2 pr-12 text-right">
              <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <img
                  src="/assets/labmanager/images/medical_manuscript_300x200.png"
                  alt="Historical medical manuscript"
                  className="w-full h-56 object-cover"
                />
              </div>
            </div>
            
            {/* Timeline node */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center z-20">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-amber-600 text-sm">🧬</span>
                </div>
              </div>
            </div>
            
            {/* Right content for even items */}
            <div className="w-1/2 pl-12">
              <div 
                className={`${themeStyles.card.bg} rounded-xl p-6 border ${themeStyles.card.border} shadow-lg transition-all duration-300 hover:shadow-xl`}
              >
                <div className="font-arabic text-xl text-amber-600 mb-2">ابن سينا</div>
                <h3 className={`text-2xl font-bold ${themeStyles.subheading} mb-2 flex items-center`}>
                  <span className="mr-2 text-amber-500">🧬</span>
                  Ibn Sina
                </h3>
                <div className="text-sm text-amber-700/70 mb-3">980-1037 CE</div>
                <p className={`${themeStyles.text.secondary} text-base`}>
                  Known as Avicenna in the West, his "Canon of Medicine" was a standard medical text in Europe for centuries. His contributions to medicine, philosophy, and astronomy continue to influence these fields today.
                </p>
              </div>
            </div>
          </div>
          
          {/* Timeline Item 3 */}
          <div className="flex items-center">
            {/* Left content */}
            <div className="w-1/2 pr-12 text-right">
              <div 
                className={`${themeStyles.card.bg} rounded-xl p-6 border ${themeStyles.card.border} shadow-lg transition-all duration-300 hover:shadow-xl`}
              >
                <div className="font-arabic text-xl text-amber-600 mb-2">الجزري</div>
                <h3 className={`text-2xl font-bold ${themeStyles.subheading} mb-2 flex justify-end items-center`}>
                  Al-Jazari
                  <span className="ml-2 text-amber-500">⚙️</span>
                </h3>
                <div className="text-sm text-amber-700/70 mb-3 text-right">1136-1206 CE</div>
                <p className={`${themeStyles.text.secondary} text-base`}>
                  An engineering genius who created the first programmable humanoid robot and numerous automated machines. His mechanical innovations were centuries ahead of their time.
                </p>
              </div>
            </div>
            
            {/* Timeline node */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center z-20">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-amber-600 text-sm">⚙️</span>
                </div>
              </div>
            </div>
            
            {/* Right image */}
            <div className="w-1/2 pl-12">
              <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <img
                  src="/assets/labmanager/images/engineering_manuscript_300x200.png"
                  alt="Historical engineering manuscript"
                  className="w-full h-56 object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Timeline Item 4 - New scholar */}
          <div className="flex items-center">
            {/* Left image for even items */}
            <div className="w-1/2 pr-12 text-right">
              <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <img
                  src="/assets/labmanager/images/optics_manuscript_300x200.png"
                  alt="Historical optics manuscript"
                  className="w-full h-56 object-cover"
                />
              </div>
            </div>
            
            {/* Timeline node */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center z-20">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-amber-600 text-sm">👁️</span>
                </div>
              </div>
            </div>
            
            {/* Right content for even items */}
            <div className="w-1/2 pl-12">
              <div 
                className={`${themeStyles.card.bg} rounded-xl p-6 border ${themeStyles.card.border} shadow-lg transition-all duration-300 hover:shadow-xl`}
              >
                <div className="font-arabic text-xl text-amber-600 mb-2">ابن الهيثم</div>
                <h3 className={`text-2xl font-bold ${themeStyles.subheading} mb-2 flex items-center`}>
                  <span className="mr-2 text-amber-500">👁️</span>
                  Ibn Al-Haytham
                </h3>
                <div className="text-sm text-amber-700/70 mb-3">965-1040 CE</div>
                <p className={`${themeStyles.text.secondary} text-base`}>
                  Pioneer in optics who developed the first accurate theory of vision. His Book of Optics revolutionized our understanding of light and perception. He's also considered the father of the scientific method.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Call to Action */}
    {/* <div className="mt-8 sm:mt-16 text-center">
      <p className={`${themeStyles.text.secondary} italic mb-4 text-base max-w-2xl mx-auto`}>
        At TechEthica, we strive to continue this legacy of innovation and ethical knowledge pursuit, 
        blending ancient wisdom with modern technological advancements.
      </p>
      <div className="font-arabic text-xl text-amber-600/70 mb-8">نسعى لمواصلة هذا الإرث من الابتكار والمعرفة الأخلاقية</div>
      
      <a 
        href="/islamic-knowledge" 
        className={`inline-flex items-center px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-md transition-all duration-300`}
      >
        <span>Explore Our Research</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </a>
    </div> */}
  </div>
</section>
      
      {/* Core Domains Section with Horizontal Cards */}
      <section className="relative py-10 sm:py-16 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Decorative Element - Modified for better mobile display */}
          <div className={`hidden md:block absolute right-0 top-1/3 transform w-48 h-48 lg:w-96 lg:h-96 ${themeStyles.accent.light} rounded-full blur-3xl opacity-70`}></div>
          
          <div className="text-center mb-8 sm:mb-12">
            <h2 className={`text-2xl sm:text-3xl font-serif font-bold ${themeStyles.heading} mb-3 sm:mb-4`}>Core Domains of Study</h2>
            <div className="font-arabic text-xl sm:text-2xl text-amber-600/80 mb-4 sm:mb-6">مجالات الدراسة الأساسية</div>
            <GeometricPattern className={themeStyles.pattern} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Tech Domain Card - Improved padding and spacing for mobile */}
            <div className={`${themeStyles.card.bg} backdrop-blur-sm border ${themeStyles.card.border} ${themeStyles.card.hoverBorder} transition-all duration-300 p-4 sm:p-6 rounded-lg overflow-hidden relative group hover:shadow-lg`}>
              <div className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 ${themeStyles.accent.medium} rounded-bl-full`}></div>
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 font-arabic text-lg sm:text-xl text-amber-600/40">تكنولوجيا</div>
              <h3 className={`text-xl sm:text-2xl font-semibold ${themeStyles.subheading} mb-3 sm:mb-4 flex items-center`}>
                <span className="text-2xl sm:text-3xl mr-2 sm:mr-3 group-hover:rotate-12 transition-transform duration-300">🧠</span> Modern Technologies
              </h3>
              <ul className={`list-disc pl-4 sm:pl-6 ${themeStyles.text.primary} space-y-1 sm:space-y-2 mb-3 sm:mb-4 text-sm sm:text-base`}>
                
              <li>Artificial Intelligence & Machine Learning</li>
              <li>Generative AI, Agentic AI & Internet of Things (IoT)</li>
              <li>Data Science & Big Data Analytics</li>
              <li>Cybersecurity & Information Assurance</li>
              <li>Cloud Computing & Infrastructure</li>
              <li>DevOps & Continuous Integration/Deployment (CI/CD)</li>
              <li>Full-Stack Web Development</li>
              <li>Enterprise Systems & Business Process Automation</li>

              </ul>
              <div className="mt-3 sm:mt-4 flex justify-end">
                <div className="text-amber-600/80 text-xs sm:text-sm italic">
                  Embracing innovation with responsibility
                </div>
              </div>
            </div>
            
            {/* Islamic Studies Card - Improved padding and spacing for mobile */}
            <div className={`${themeStyles.card.bg} backdrop-blur-sm border ${themeStyles.card.border} ${themeStyles.card.hoverBorder} transition-all duration-300 p-4 sm:p-6 rounded-lg overflow-hidden relative group hover:shadow-lg`}>
              <div className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 ${themeStyles.accent.medium} rounded-bl-full`}></div>
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 font-arabic text-lg sm:text-xl text-amber-600/40">شرعية</div>
              <h3 className={`text-xl sm:text-2xl font-semibold ${themeStyles.subheading} mb-3 sm:mb-4 flex items-center`}>
                <span className="text-2xl sm:text-3xl mr-2 sm:mr-3 group-hover:rotate-12 transition-transform duration-300">📖</span> Islamic Studies
              </h3>
              <ul className={`list-disc pl-4 sm:pl-6 ${themeStyles.text.primary} space-y-1 sm:space-y-2 text-sm sm:text-base`}>
                <li>Quran with Tajweed & Tafsir</li>
                <li>Hadith Sciences (with focus on Sahih traditions)</li>
                <li>Usul al-Fiqh (Principles of Islamic Jurisprudence)</li>
                <li>Seerah of the Prophet <span className="font-arabic">صلى الله عليه وسلم</span></li>

                {/* <li>Seerah of the Prophet <span className="font-arabic">صلى الله عليه وسلم</span></li> */}

                <li>Islamic History (Tariqh) & Contributions to Science</li>
                <li>Tasawwuf: Ethics, Ihsan & Tazkiyah</li>
                <li>Adab & Islamic Literature</li>
                <li>Arabic Language & Grammar</li>
              </ul>
              <div className="mt-3 sm:mt-4 flex justify-end">
                <div className="text-amber-600/80 text-xs sm:text-sm italic">
                  Anchoring technology in timeless values
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Learning Model Section with Visual Elements - Improved for mobile */}
      <section className="relative py-10 sm:py-16 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="relative mb-8 sm:mb-12">
            <h2 className={`text-2xl sm:text-3xl font-serif font-bold ${themeStyles.heading} text-center mb-3 sm:mb-4`}>Our Unique Learning Model</h2>
            <div className="flex justify-center">
              <div className="font-arabic text-xl sm:text-2xl text-amber-600/80 mb-4 sm:mb-6">نموذج التعليم الفريد</div>
            </div>
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -bottom-4 w-16 sm:w-24 h-1 bg-amber-400/60 rounded-full"></div>
          </div>
          
          {/* Replaced the grid with a flex column layout for better mobile display */}
          <div className="flex flex-col gap-6 sm:gap-8 md:gap-12 relative">
            {/* Decorative Element - Only visible on larger screens */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 w-1 bg-amber-500/20"></div>
            
            {/* Integrated Curriculum */}
            <div className={`${themeStyles.card.bg} backdrop-blur-sm rounded-lg p-4 sm:p-8 border-l-4 border-amber-500/50 hover:shadow-amber-500/10 hover:shadow-lg transition-all duration-300 group relative`}>
              {/* Circle marker for desktop */}
              <div className="hidden md:block absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-amber-500/80 z-10"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${themeStyles.accent.medium} flex items-center justify-center text-2xl sm:text-3xl mx-auto sm:mx-0 sm:mr-4 mb-2 sm:mb-0 transition-all duration-300 group-hover:scale-110`}>
                  💡
                </div>
                <div>
                  <h3 className={`text-xl sm:text-2xl font-semibold ${themeStyles.subheading} text-center sm:text-left`}>Integrated Curriculum</h3>
                  <div className="font-arabic text-base sm:text-lg text-amber-600/70 text-center sm:text-left">منهج متكامل</div>
                </div>
              </div>
              <p className={`${themeStyles.text.primary} mb-3 sm:mb-4 text-sm sm:text-base`}>
                Each course in tech is complemented with Islamic ethics. For example:
              </p>
              <ul className={`list-disc pl-4 sm:pl-6 ${themeStyles.text.primary} space-y-2 sm:space-y-3 text-sm sm:text-base`}>
                <li>
                  <span className="font-medium">AI Ethics</span> studied alongside Islamic views on accountability and knowledge
                  <div className="text-xs sm:text-sm text-amber-600/70 mt-1">
                    <span className="font-arabic">المسؤولية في الذكاء الاصطناعي</span>
                  </div>
                </li>
                <li>
                  <span className="font-medium">Project Management</span> coupled with lessons in Amanah (trust) and Adl (justice)
                  <div className="text-xs sm:text-sm text-amber-600/70 mt-1">
                    <span className="font-arabic">الأمانة والعدل في إدارة المشاريع</span>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Blended Delivery Modes */}
            <div className={`${themeStyles.card.bg} backdrop-blur-sm rounded-lg p-4 sm:p-8 border-l-4 border-amber-500/50 hover:shadow-amber-500/10 hover:shadow-lg transition-all duration-300 group relative`}>
              {/* Circle marker for desktop */}
              <div className="hidden md:block absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-amber-500/80 z-10"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${themeStyles.accent.medium} flex items-center justify-center text-2xl sm:text-3xl mx-auto sm:mx-0 sm:mr-4 mb-2 sm:mb-0 transition-all duration-300 group-hover:scale-110`}>
                  🏫
                </div>
                <div>
                  <h3 className={`text-xl sm:text-2xl font-semibold ${themeStyles.subheading} text-center sm:text-left`}>Blended Delivery Modes</h3>
                  <div className="font-arabic text-base sm:text-lg text-amber-600/70 text-center sm:text-left">نظام تعليم مختلط</div>
                </div>
              </div>
              <ul className={`list-disc pl-4 sm:pl-6 ${themeStyles.text.primary} space-y-2 sm:space-y-3 text-sm sm:text-base`}>
                <li>
                  <span className="font-medium">Online + Onsite Learning</span> (Hybrid model)
                  <div className="text-xs sm:text-sm text-amber-600/70 mt-1">
                    <span className="font-arabic">التعلم عبر الإنترنت والحضوري</span>
                  </div>
                </li>
                <li>
                  <span className="font-medium">LMS</span> for structured content & assessments
                  <div className="text-xs sm:text-sm text-amber-600/70 mt-1">
                    <span className="font-arabic">نظام إدارة التعلم</span>
                  </div>
                </li>
                <li>
                  <span className="font-medium">Weekly Q&A</span> with instructors, live coding labs, and spiritual sessions
                  <div className="text-xs sm:text-sm text-amber-600/70 mt-1">
                    <span className="font-arabic">جلسات أسبوعية للأسئلة والإجابة والبرمجة المباشرة</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Global Perspective Section */}
      
      
      {/* Now let's add in the AdditionalSections component integration */}
      <AboutUsAdditionalSections 
        themeStyles={themeStyles} 
        useLightTheme={useLightTheme} 
        StarPattern={StarPattern} 
        HexagonPattern={HexagonPattern} 
      />
      
      {/* Contact & Admissions Call-to-Action - Enhanced for mobile */}
      <section className="relative py-10 sm:py-16 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="relative overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/80"></div>
            <div className="absolute inset-0 bg-[url('/assets/labmanager/images/pattern-bg.png')] opacity-10 bg-repeat"></div>
            
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
            
            <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-12">
              {/* Changed from grid to flex-col on mobile for better alignment */}
              <div className="flex flex-col md:grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white mb-2 sm:mb-0 text-center sm:text-left">Contact & Admissions</h2>
                    <span className="font-arabic text-base sm:text-lg text-amber-200/90 text-center sm:text-right">التواصل والقبول</span>
                  </div>
                  <div className="text-amber-100 space-y-2 sm:space-y-4 mb-4 sm:mb-6 text-sm sm:text-base">
                    <p className="font-bold text-base sm:text-lg">🗓️ Admissions 2025-26 Now Open</p>
                    <p>🚀 Start your journey in tech and Deen today.</p>
                    <p>📞 <strong>Call Us:</strong> +91 95913 82400</p>
                    <p>🌐 <strong>Visit Us:</strong> www.techethica.in</p>
                    <p>✉️ <strong>Email:</strong> info@techethica.in</p>
                  </div>
                  
                  {/* Admissions Timeline - Improved for mobile */}
                  <div className={`mt-6 sm:mt-8 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm`}>
                    <h3 className="text-lg sm:text-xl font-bold text-amber-200 mb-2 sm:mb-3">Admissions Timeline</h3>
                    <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-amber-100 font-medium">Application Deadline</span>
                        <span className="text-white">May 30, 2025</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-amber-100 font-medium">Interviews</span>
                        <span className="text-white">June 1-10, 2025</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-amber-100 font-medium">Results & Offer Letters</span>
                        <span className="text-white">June 12, 2025</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-amber-100 font-medium">Classes Begin</span>
                        <span className="text-white">June 15, 2025</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center mt-6 md:mt-0">
                  <div className={`p-4 sm:p-6 bg-white/10 rounded-lg backdrop-blur-sm mb-4 sm:mb-6 w-full`}>
                    <p className="text-amber-100 mb-4 sm:mb-6 text-center text-base sm:text-lg">
                      Ready to embark on a transformative educational journey that combines technical excellence with ethical foundation?
                    </p>
                    <div className="text-center mb-4 sm:mb-6">
                      <StarPattern className="inline-block text-amber-300/30 mx-1" />
                      <StarPattern className="inline-block text-amber-300/30 mx-1" />
                      <StarPattern className="inline-block text-amber-300/30 mx-1" />
                    </div>
                    <div className="text-center font-arabic text-amber-200/90 text-lg sm:text-xl mb-4 sm:mb-6">
                      انضم إلينا في رحلة التعلم المتميزة
                    </div>
                  </div>
                  
                  <a 
                    href="/student-registration/new" 
                    className={`block w-full sm:w-2/3 ${themeStyles.cta.bg} ${themeStyles.cta.hover} text-white text-center py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-bold transition duration-300 text-base sm:text-lg shadow-lg hover:shadow-amber-600/20 group`}
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
    </div>
  );
};

export default AboutUs;