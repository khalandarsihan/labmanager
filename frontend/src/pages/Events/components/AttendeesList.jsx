import React from 'react';
import { Users } from 'lucide-react';

const AttendeesList = ({ attendees }) => {
  if (!attendees || attendees.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="space-y-3">
        {attendees.map((attendee, index) => (
          <div key={index} className="p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-green-200 transition-colors">
            <h5 className="font-semibold text-gray-800">{attendee.name}</h5>
            <p className="text-gray-600 text-sm">{attendee.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendeesList;