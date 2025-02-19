// src/pages/StudentDashboard/components/LearningResources.jsx
import React, { useState } from 'react';

export const LearningResources = () => {
  const [activeCategory, setActiveCategory] = useState('recommended');
  
  const resources = {
    recommended: [
      { id: 1, title: 'Algebra Fundamentals', type: 'video', subject: 'Mathematics', duration: '45 min', isNew: true },
      { id: 2, title: 'The Cell Structure Interactive', type: 'interactive', subject: 'Science', duration: '30 min', isNew: true },
      { id: 3, title: 'Tajweed Rules Practice', type: 'practice', subject: 'Islamic Studies', duration: '20 min', isNew: false }
    ],
    recent: [
      { id: 4, title: 'Essay Writing Guide', type: 'document', subject: 'English', duration: '15 min', isNew: false },
      { id: 5, title: 'World History Timeline', type: 'interactive', subject: 'History', duration: '25 min', isNew: false },
      { id: 6, title: 'Math Problem Solving', type: 'practice', subject: 'Mathematics', duration: '40 min', isNew: false }
    ],
    popular: [
      { id: 7, title: 'Science Lab Safety', type: 'video', subject: 'Science', duration: '15 min', isNew: false },
      { id: 8, title: 'Quran Recitation Guide', type: 'audio', subject: 'Islamic Studies', duration: '35 min', isNew: true },
      { id: 9, title: 'Creative Writing Workshop', type: 'interactive', subject: 'English', duration: '60 min', isNew: false }
    ]
  };

  const getIconForType = (type) => {
    switch(type) {
      case 'video': return '🎬';
      case 'document': return '📄';
      case 'interactive': return '🔄';
      case 'practice': return '✏️';
      case 'audio': return '🎧';
      default: return '📚';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Learning Resources</h3>
      
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {['recommended', 'recent', 'popular'].map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              activeCategory === category
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="space-y-3">
        {resources[activeCategory].map(resource => (
          <div key={resource.id} className="flex p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
              {getIconForType(resource.type)}
            </div>
            <div className="ml-3 flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium text-gray-800">
                  {resource.title}
                  {resource.isNew && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                </h4>
                <span className="text-xs text-gray-500">{resource.duration}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-sm text-gray-600">{resource.subject}</span>
                <span className="text-xs text-blue-600 capitalize">{resource.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
        <span className="text-sm text-gray-600">Access all learning materials</span>
        <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
          View Library
          <span className="ml-1">→</span>
        </button>
      </div>
    </div>
  );
};