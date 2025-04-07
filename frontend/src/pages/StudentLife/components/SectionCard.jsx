import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "../../../components/ui/ThemeContext";

// Component for each section of the student life page with improved image handling
const SectionCard = ({ section, index }) => {
  const { themeStyles, useLightTheme } = useTheme();
  
  return (
    <div className="mb-20 scroll-mt-24" id={`section-${index}`}>
      <Card className={`${themeStyles.card.bg} shadow-lg border ${themeStyles.card.border} hover:${themeStyles.card.hoverBorder} transition-all duration-300`}>
        <CardHeader>
          <CardTitle className={`text-2xl md:text-3xl font-semibold ${useLightTheme ? 'text-purple-800' : 'text-amber-300'} text-center`}>
            {section.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <p className={`text-lg ${themeStyles.text.secondary} leading-relaxed text-center max-w-4xl mx-auto mb-10`}>
            {section.text}
          </p>
          
          <div className={`grid grid-cols-1 ${section.images.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
            {section.images.map((img, i) => (
              <div key={i} className="group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                {/* Using padding-top for aspect ratio preservation */}
                <div className="relative w-full pb-[75%]">
                  <img
                    src={img}
                    alt={`${section.title} - Image ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="text-white text-lg font-medium">
                        {section.title}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SectionCard;