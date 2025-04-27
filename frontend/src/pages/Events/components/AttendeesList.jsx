import React from 'react';
import { Users } from 'lucide-react';
import { useTheme } from '../../../components/ui/ThemeContext';

const AttendeesList = ({ attendees }) => {
  const { useLightTheme, themeStyles } = useTheme();
  
  if (!attendees || attendees.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="space-y-3">
        {attendees.map((attendee, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg ${
              useLightTheme 
                ? 'bg-gray-50 border border-gray-100 hover:border-purple-200' 
                : 'bg-gray-800 border border-gray-700 hover:border-amber-400/30'
              } transition-colors`}
          >
            <h5 className={`font-semibold ${useLightTheme ? 'text-gray-800' : 'text-gray-200'}`}>
              {attendee.name1 || attendee.name}
            </h5>
            <p className={`text-sm ${useLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>
              {attendee.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendeesList;