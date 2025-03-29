import React from 'react';
import ExamDates from '@/components/ui/ExamDates';

const ExamDatesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <ExamDates />
      </div>
    </div>
  );
};

export default ExamDatesPage;