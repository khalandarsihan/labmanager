// src/pages/StudentDashboard/components/UpcomingEvents.jsx
import React, { useState } from 'react';

export const UpcomingEvents = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const events = [
    { id: 1, title: 'Math Quiz', date: '02/21/2025', time: '10:30 AM', location: 'Room 203', type: 'exam' },
    { id: 2, title: 'Science Project Due', date: '02/22/2025', time: '3:00 PM', location: 'Submit Online', type: 'deadline' },
    { id: 3, title: 'Parent-Teacher Conference', date: '03/05/2025', time: '4:30 PM', location: 'Main Hall', type: 'meeting' },
    { id: 4, title: 'Quran Competition', date: '03/15/2025', time: '9:00 AM', location: 'Auditorium', type: 'competition' }
  ];

  const getTypeLabel = (type) => {
    switch(type) {
      case 'exam': return { label: 'Exam', color: 'bg-red-100 text-red-800' };
      case 'deadline': return { label: 'Deadline', color: 'bg-orange-100 text-orange-800' };
      case 'meeting': return { label: 'Meeting', color: 'bg-purple-100 text-purple-800' };
      case 'competition': return { label: 'Competition', color: 'bg-green-100 text-green-800' };
      default: return { label: 'Event', color: 'bg-blue-100 text-blue-800' };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Events</h3>
      
      <div className="grid grid-cols-7 gap-1 mb-6">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="text-center text-sm text-gray-500 font-medium">
            {day}
          </div>
        ))}
        
        {Array.from({ length: 35 }, (_, i) => {
          const day = i - 3; // Offset to start month on Wednesday
          return (
            <button
              key={i}
              disabled={day < 1 || day > 28}
              className={`h-8 text-sm rounded-full flex items-center justify-center ${
                day === 21 
                  ? 'bg-blue-600 text-white'
                  : day < 1 || day > 28
                    ? 'text-gray-300'
                    : [5, 12, 15].includes(day)
                      ? 'bg-blue-100 text-blue-800 font-medium'
                      : 'hover:bg-gray-100'
              }`}
            >
              {day > 0 && day <= 28 ? day : ''}
            </button>
          );
        })}
      </div>
      
      <h4 className="font-medium text-gray-700 mb-3">Upcoming</h4>
      <div className="space-y-3">
        {events.map(event => (
          <div key={event.id} className="flex p-3 bg-gray-50 rounded-lg">
            <div className="w-12 text-center">
              <div className="text-sm font-bold text-gray-800">
                {event.date.split('/')[1]}
              </div>
              <div className="text-xs text-gray-500">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May'][parseInt(event.date.split('/')[0])-1]}
              </div>
            </div>
            
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-800">{event.title}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${getTypeLabel(event.type).color}`}>
                  {getTypeLabel(event.type).label}
                </span>
              </div>
              <div className="mt-1 flex items-center text-sm text-gray-600">
                <span className="mr-3">{event.time}</span>
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-4 w-full text-center py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-800 transition">
        View Full Calendar
      </button>
    </div>
  );
};