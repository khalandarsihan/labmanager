// src/pages/StudentDashboard/components/TeacherFeedback.jsx
import React from 'react';

export const TeacherFeedback = () => {
  const feedback = [
    {
      id: 1,
      teacher: 'Ms. Sarah Johnson',
      subject: 'Mathematics',
      date: 'Feb 15, 2025',
      comment: "Aisha shows excellent progress in algebra. Her problem-solving approach is methodical and she's developing strong analytical skills. Keep up the great work!",
      rating: 5
    },
    {
      id: 2,
      teacher: 'Mr. Khalid Hassan',
      subject: 'Islamic Studies',
      date: 'Feb 10, 2025',
      comment: 'Excellent Quran memorization progress. Tajweed is improving steadily. I recommend practicing the rules of idgham more frequently.',
      rating: 4
    },
    {
      id: 3,
      teacher: 'Ms. Garcia',
      subject: 'Science',
      date: 'Feb 7, 2025',
      comment: 'Aisha participates actively in lab experiments and asks thoughtful questions. Her last project showed creativity, but could use more attention to detail in the documentation.',
      rating: 4
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>★</span>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Teacher Feedback</h3>
      
      <div className="space-y-4">
        {feedback.map(item => (
          <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-800">{item.teacher}</h4>
                <p className="text-sm text-gray-600">{item.subject}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">{item.date}</div>
                <div className="text-sm">{renderStars(item.rating)}</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-700 italic">"{item.comment}"</p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-between">
        <button className="text-sm text-gray-600 hover:text-gray-800">View All Feedback</button>
        <button className="text-sm text-blue-600 hover:text-blue-800">Request Feedback</button>
      </div>
    </div>
  );
};