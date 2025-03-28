import React from 'react';
import ClassSchedule from '@/components/ui/ClassSchedule';

const ClassSchedulePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <ClassSchedule />
      </div>
    </div>
  );
};

export default ClassSchedulePage;