// src/pages/StudentDashboard/components/StudyTimeTracker.jsx
import React, { useState } from 'react';

export const StudyTimeTracker = () => {
  const [studyData, setStudyData] = useState({
    weeklyTarget: 20,
    thisWeek: 14.5,
    subjects: [
      { name: 'Mathematics', time: 4.5, color: 'bg-blue-500' },
      { name: 'Science', time: 3.0, color: 'bg-orange-500' },
      { name: 'Islamic Studies', time: 2.5, color: 'bg-green-500' },
      { name: 'English', time: 2.0, color: 'bg-purple-500' },
      { name: 'History', time: 1.5, color: 'bg-red-500' },
      { name: 'Other', time: 1.0, color: 'bg-gray-500' }
    ]
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Study Time Tracker</h3>
      
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <h4 className="font-medium text-gray-700">Weekly Progress</h4>
          <span className="text-sm text-gray-500">
            {studyData.thisWeek} of {studyData.weeklyTarget} hours
          </span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600" 
            style={{ width: `${(studyData.thisWeek / studyData.weeklyTarget) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">0h</span>
          <span className="text-xs text-gray-500">{studyData.weeklyTarget}h</span>
        </div>
      </div>
      
      <h4 className="font-medium text-gray-700 mb-3">By Subject</h4>
      <div className="space-y-3">
        {studyData.subjects.map((subject, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">{subject.name}</span>
              <span className="text-sm">{subject.time}h</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${subject.color}`} 
                style={{ width: `${(subject.time / studyData.weeklyTarget) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-6 w-full text-center py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-800 transition">
        Log Study Time +
      </button>
    </div>
  );
};