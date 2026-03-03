import React, { useEffect, useState } from "react";  
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";  
import { useTheme } from "../../components/ui/ThemeContext";  
import BackgroundPattern from "../../components/ui/BackgroundPattern";  
import SectionCard from "./components/SectionCard";  
import ScrollToTop from "../../components/ui/ScrollToTop";


const studentLifeSections = [  
  {  
    title: "Sacred Knowledge & Islamic Learning",  
    text: `TechEthica's foundation is built upon authentic Islamic knowledge. Students engage with traditional texts in a structured environment, learning from qualified scholars and teachers. Our library houses extensive collections of classical works while our classrooms provide a conducive atmosphere for deep learning and discussion. The preservation and transmission of sacred knowledge forms the core of our curriculum, preparing students to uphold and apply Islamic principles in contemporary contexts.`,  
    images: [  
       "/assets/labmanager/images/islamic_001.jpg",
      //  "/assets/labmanager/images/islamic_002.jpg",
      // "/assets/labmanager/images/islamic_002.jpg",
      "/assets/labmanager/images/group.jpeg",
      "/assets/labmanager/images/focus_zone.jpg",
      // "/assets/labmanager/images/arabic_grammar_class.jpg",
     
        ]  
  },  
  // {  
  //   title: "Islamic Scholarship in the Digital Age",  
  //   text: `At TechEthica, we bridge the gap between traditional Islamic scholarship and modern technology. Our students maintain the etiquette and appearance of traditional scholars while mastering contemporary digital skills. This unique blend allows them to preserve Islamic knowledge while making it accessible through modern platforms. Students learn to balance adherence to tradition with technological innovation, preparing them to serve as effective scholars in today's interconnected world.`,  
  //   images: [  
  //     "/assets/labmanager/images/islamic_003.jpg",
  //     "/assets/labmanager/images/group.jpeg",
  //     // "/assets/labmanager/images/sahlv.svg",  
  //   ]  
  // },  
    {  
    title: "Interactive, Modern Learning Spaces",  
    text: `In our classrooms, tradition meets innovation. Students learn in smart classrooms equipped with projectors and laptops, balancing handwritten notes with digital collaboration. Group learning, real-time coding, and tech-aided discussions make the experience dynamic and effective.`,  
    images: [  
      "/assets/labmanager/images/islamic_003.jpg",
      "/assets/labmanager/images/islamic_002.jpg",
        
      "/assets/labmanager/images/digital_classroom.jpg"  
    ]  
  },  
  // NEW SECTION 1: Physics Laboratory
  {  
    title: "Physics Laboratory & Experiments",  
    text: `Our Physics laboratory provides students with hands-on experience in understanding fundamental principles of nature. Equipped with modern apparatus and measurement tools, students conduct experiments in mechanics, optics, electricity, and more. This practical approach reinforces theoretical knowledge while developing analytical and observational skills grounded in scientific methodology.`,  
    images: [  
      // "/assets/labmanager/images/physics_lab1.jpg",  
      "/assets/labmanager/images/physics_lab2.jpg",  
      "/assets/labmanager/images/physics_lab3.jpg",
      // "/assets/labmanager/images/physics_lab4.jpg",
      // "/assets/labmanager/images/physics_lab5.jpg",
      // "/assets/labmanager/images/physics_lab6.jpg",
      "/assets/labmanager/images/physics_lab7.jpg"  
    ]  
  },
   // NEW SECTION 2: Chemistry Laboratory
  {  
    title: "Chemistry Laboratory & Research",  
    text: `The Chemistry laboratory offers a safe and well-equipped environment for students to explore chemical reactions, compounds, and analytical techniques. From basic qualitative analysis to advanced organic chemistry experiments, students develop precision, safety awareness, and a deeper understanding of the molecular world through guided practical sessions.`,  
    images: [  
      "/assets/labmanager/images/chemistry_lab1.jpg",  
      "/assets/labmanager/images/chemistry_lab2.jpg",  
      "/assets/labmanager/images/chemistry_lab3.jpg"  
    ]  
  },
    // NEW SECTION 3: Computer Science Lab
  {  
    title: "Computer Science & IT Infrastructure",  
    text: `Our Computer Science lab features modern workstations and high-speed connectivity, enabling students to master programming, web development, database management, and software engineering. Students work on real-world projects, collaborate on coding challenges, and develop the technical expertise needed for careers in technology—all within an ethically guided framework.`,  
    images: [  
      // "/assets/labmanager/images/computer_lab1.jpg", 
      "/assets/labmanager/images/computer_lab4.jpg", 
      "/assets/labmanager/images/computer_lab2.jpg",
      "/assets/labmanager/images/anas_code.jpeg",  
      // "/assets/labmanager/images/computer_lab3.jpg",
      // "/assets/labmanager/images/computer_lab4.jpg"  
    ]  
  },
  // {  
  //   title: "Technology & Digital Fluency",  
  //   text: `TechEthica blends modern education with Islamic values. Students learn web development, ERP systems, data science, and coding in environments that mimic real-world scenarios. Whether it's programming in Python, working with terminals, or collaborating on live projects, our students develop skills that are current, practical, and grounded in ethics.`,  
  //   images: [  
  //     "/assets/labmanager/images/spiritual_routine2.jpeg",  
  //     "/assets/labmanager/images/group_code.jpeg",  
  //     "/assets/labmanager/images/anas_code.jpeg"  
  //   ]  
  // },  

    {  
    title: "Focus, Self-Study & Growth Spaces",  
    text: `Students at TechEthica develop strong habits of personal study. Quiet focus zones, organized study desks, and structured review routines allow them to take charge of their learning journey. They prepare, revise, reflect, and plan with clarity and motivation, knowing that personal excellence is part of worship.`,  
    images: [  
      "/assets/labmanager/images/group_code.jpeg",
      // "/assets/labmanager/images/cheelath1.jpeg",  
      "/assets/labmanager/images/night_study.jpeg",  
      "/assets/labmanager/images/sinank.png"  
    ]  
  },  
  {  
    title: "Outdoor & Field-Based Learning",  
    text: `Learning at TechEthica extends into nature. Students use tablets and laptops to document, code, and reflect while surrounded by greenery. Discussions, journaling, and even technical collaboration happen outside the classroom — breathing life into ideas and grounding students in balance.`,  
    images: [  
      "/assets/labmanager/images/outdoor_study.jpg",  
      "/assets/labmanager/images/collaborative_learning_outdoors.jpeg",  
      "/assets/labmanager/images/collaborative_learning_outdoors2.jpeg"  
    ]  
  },  
  {  
    title: "Mentorship, Brotherhood & Belonging",  
    text: `Brotherhood at TechEthica is rooted in sincerity, service, and shared purpose. Students grow through mentorship from teachers and peer learning with classmates. Whether in serious academic discussions or shared smiles outdoors, a sense of family and ummah spirit defines their experience.`,  
    images: [
      "/assets/labmanager/images/islamic_006.jpg",
      "/assets/labmanager/images/islamic_007.jpg", 
      "/assets/labmanager/images/islamic_004.jpg",

       
      // "/assets/labmanager/images/mentorship.jpg",  
      // "/assets/labmanager/images/student_brotherhood_cheer-2.jpg",  
      // "/assets/labmanager/images/student_brotherhood_cheer.jpg"  
    ]  
  },
  {  
    title: "Physical Wellbeing & Sunnah Living",  
    text: `Physical movement is part of the student routine — from indoor cycling and treadmill walking to light fitness sessions. These moments support discipline, mental focus, and a Prophetic lifestyle. TechEthica believes in a holistic education: healthy bodies supporting healthy minds and hearts.`,  
    images: [  
      "/assets/labmanager/images/fitness_walk.svg",  
      "/assets/labmanager/images/fitness_cycle.png",
      // "/assets/labmanager/images/anas.jpeg"  
    ]  
  },  
  {  
    title: "Healthcare & Wellbeing Services",  
    text: `At TechEthica, we prioritize the complete wellbeing of our students through comprehensive healthcare services. Regular dental and medical checkups are integrated into campus life to ensure students maintain optimal health throughout their educational journey. Our resident healthcare professionals provide personalized care in a comfortable environment, following the Islamic principles of preventative health maintenance. We believe that maintaining good health is essential for academic excellence and spiritual growth.`,  
    images: [  
      "/assets/labmanager/images/dental_checkup2.jpeg",  
      "/assets/labmanager/images/dental_checkup1.jpeg"  
    ]  
  }
];

const StudentLifePage = () => {  
  const { themeStyles, useLightTheme } = useTheme();  
  const [activeSection, setActiveSection] = useState(null);  
  
  // Track the active section during scrolling  
  useEffect(() => {  
    const handleScroll = () => {  
      const scrollPosition = window.scrollY + 100;  
      
      // Find the current section in view  
      const sections = studentLifeSections.map((_, index) =>  
        document.getElementById(`section-${index}`)  
      );  
      
      const currentSection = sections.findIndex(section => {  
        if (!section) return false;  
        const sectionTop = section.offsetTop;  
        const sectionBottom = sectionTop + section.offsetHeight;  
        return scrollPosition >= sectionTop && scrollPosition < sectionBottom;  
      });  
      
      if (currentSection !== -1) {  
        setActiveSection(currentSection);  
      }  
    };  
    
    window.addEventListener('scroll', handleScroll);  
    return () => window.removeEventListener('scroll', handleScroll);  
  }, []);  
  
  // Scroll to a specific section  
  const scrollToSection = (index) => {  
    const section = document.getElementById(`section-${index}`);  
    if (section) {  
      window.scrollTo({  
        top: section.offsetTop - 80,  
        behavior: 'smooth'  
      });  
    }  
  };  
  
  return (  
    <div className="relative min-h-screen overflow-x-hidden">  
      <BackgroundPattern />  
      <ScrollToTop />  
      
      <div className="container mx-auto px-4 py-12 relative z-10">  
        <h1 className={`text-4xl md:text-5xl font-bold mb-8 text-center ${useLightTheme ? 'text-purple-800' : 'text-amber-300'}`}>  
          Student Life at TechEthica  
        </h1>  
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">  
          {/* Table of Contents - Sticky sidebar on desktop */}  
          <div className="lg:w-1/4 mb-8 lg:mb-0">  
            <div className="lg:sticky lg:top-24">  
              <Card className={`${themeStyles.card.bg} shadow-lg border ${themeStyles.card.border}`}>  
                <CardHeader>  
                  <CardTitle className={`text-xl font-semibold ${useLightTheme ? 'text-purple-800' : 'text-amber-300'}`}>  
                    Explore Student Life  
                  </CardTitle>  
                </CardHeader>  
                <CardContent>  
                  <ul className="space-y-2">  
                    {studentLifeSections.map((section, index) => (  
                      <li key={index}>  
                        <button  
                          onClick={() => scrollToSection(index)}  
                          className={`w-full text-left py-2 px-3 rounded-md transition-colors duration-200 ${  
                            activeSection === index  
                              ? useLightTheme  
                                ? 'bg-purple-100 text-purple-800 font-medium'  
                                : 'bg-gray-700/50 text-amber-300 font-medium'  
                              : `${themeStyles.text.secondary} hover:${useLightTheme ? 'bg-purple-50' : 'bg-gray-700/30'}`  
                          }`}  
                        >  
                          {section.title}  
                        </button>  
                      </li>  
                    ))}  
                  </ul>  
                </CardContent>  
              </Card>  
              
              <div className="mt-6 hidden lg:block">  
                <Card className={`${themeStyles.card.bg} shadow-lg border ${themeStyles.card.border}`}>  
                  <CardContent className="p-6">  
                    <p className={`text-lg ${themeStyles.text.secondary} leading-relaxed text-center`}>  
                      At TechEthica, we foster an environment where Islamic values, academic excellence, and technological innovation come together.  
                      Our students experience a holistic educational journey that nurtures both spiritual growth and professional development.  
                    </p>  
                    
                    <div className="mt-6 flex justify-center">  
                      <a  
                        href="/student-registration/new"  
                        className={`px-6 py-3 rounded-lg font-semibold text-white ${useLightTheme ? 'bg-purple-600 hover:bg-purple-700' : 'bg-amber-600 hover:bg-amber-500'} transition-colors duration-300`}  
                      >  
                        Apply Now  
                      </a>  
                    </div>  
                  </CardContent>  
                </Card>  
              </div>  
            </div>  
          </div>  
          
          {/* Main content area */}  
          <div className="lg:w-3/4">  
            {/* Introduction card for mobile */}  
            <div className="lg:hidden mb-8">  
              <Card className={`${themeStyles.card.bg} shadow-lg border ${themeStyles.card.border}`}>  
                <CardContent className="p-6">  
                  <p className={`text-lg ${themeStyles.text.secondary} leading-relaxed text-center mb-4`}>  
                    At TechEthica, we foster an environment where Islamic values, academic excellence, and technological innovation come together.  
                  </p>  
                  <div className="flex justify-center">  
                    <a  
                      href="/student-registration/new"  
                      className={`px-6 py-3 rounded-lg font-semibold text-white ${useLightTheme ? 'bg-purple-600 hover:bg-purple-700' : 'bg-amber-600 hover:bg-amber-500'} transition-colors duration-300`}  
                    >  
                      Apply Now  
                    </a>  
                  </div>  
                </CardContent>  
              </Card>  
            </div>  
            
            {studentLifeSections.map((section, index) => (  
              <SectionCard key={index} section={section} index={index} />  
            ))}  
            
            <div className="mt-20">  
              <Card className={`${themeStyles.card.bg} shadow-lg border ${themeStyles.card.border}`}>  
                <CardContent className="p-8">  
                  <h2 className={`text-3xl font-bold mb-6 text-center ${useLightTheme ? 'text-purple-800' : 'text-amber-300'}`}>  
                    Join Our Community  
                  </h2>  
                  <p className={`text-lg ${themeStyles.text.secondary} leading-relaxed text-center max-w-4xl mx-auto mb-6`}>  
                    Experience a transformative educational journey that prepares you for both this world and the next. At TechEthica, we combine Islamic tradition with technological innovation to nurture scholars who excel in their faith and profession.  
                  </p>  
                  <div className="flex justify-center mt-8">  
                    <a  
                      href="/student-registration/new"  
                      className={`px-8 py-4 rounded-lg font-semibold text-white ${useLightTheme ? 'bg-purple-600 hover:bg-purple-700' : 'bg-amber-600 hover:bg-amber-500'} transition-colors duration-300`}  
                    >  
                      Apply Now  
                    </a>  
                  </div>  
                </CardContent>  
              </Card>  
            </div>  
          </div>  
        </div>  
      </div>  
    </div>  
  );  
};

export default StudentLifePage;