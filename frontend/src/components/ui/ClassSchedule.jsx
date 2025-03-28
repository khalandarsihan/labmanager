import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Info, BookOpen, Clock, MapPin, Users, Filter, Printer } from 'lucide-react';
import BackgroundPattern from './BackgroundPattern';

const ClassSchedule = () => {
  // State for UI and data
  const [currentGrade, setCurrentGrade] = useState('Grade 8');
  const [currentSection, setCurrentSection] = useState('B');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedTimeBlock, setSelectedTimeBlock] = useState('all');
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [viewMode, setViewMode] = useState('daily'); // Added state for view toggle

  // Mock data - This would come from your API later
  const mockData = {
    grades: ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    sections: ['A', 'B', 'C'],
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    // Time slots as specified in your document
    timeSlots: [
      // Morning block
      { id: 1, start: '06:30', end: '07:20', block: 'morning' },
      { id: 2, start: '07:20', end: '08:10', block: 'morning' },
      { id: 3, start: '08:10', end: '09:00', block: 'morning' },
      // Noon block
      { id: 4, start: '10:00', end: '10:50', block: 'noon' },
      { id: 5, start: '10:50', end: '11:40', block: 'noon' },
      { id: 6, start: '11:40', end: '12:30', block: 'noon' },
      // Afternoon block
      { id: 7, start: '14:00', end: '14:50', block: 'afternoon' },
      { id: 8, start: '14:50', end: '15:40', block: 'afternoon' },
      { id: 9, start: '15:40', end: '16:30', block: 'afternoon' },
      // Evening block
      { id: 10, start: '18:30', end: '19:20', block: 'evening' },
      { id: 11, start: '19:20', end: '20:00', block: 'evening' },
      // Night block - Physical Education/Gym
      { id: 12, start: '21:00', end: '22:00', block: 'night' },
    ],
    subjects: [
      // Core Academic Subjects
      { id: 1, name: 'Physics', code: 'PHY', color: 'bg-blue-500/90', category: 'Core' },
      { id: 2, name: 'Chemistry', code: 'CHM', color: 'bg-green-500/90', category: 'Core' },
      { id: 3, name: 'Mathematics', code: 'MTH', color: 'bg-yellow-500/90', category: 'Core' },
      { id: 4, name: 'Computer Science', code: 'CS', color: 'bg-purple-500/90', category: 'Core' },
      { id: 5, name: 'English Language', code: 'ENG', color: 'bg-pink-500/90', category: 'Core' },
      { id: 6, name: 'Second Language', code: 'SL', color: 'bg-indigo-500/90', category: 'Core' },
      { id: 7, name: 'American English Essentials', code: 'AEE', color: 'bg-cyan-500/90', category: 'Core' },
      { id: 8, name: 'Physical Education', code: 'PE', color: 'bg-orange-500/90', category: 'Core' },
      // Islamic Studies
      { id: 9, name: 'Qirā\'ah', code: 'QIR', color: 'bg-emerald-500/90', category: 'Islamic' },
      { id: 10, name: 'Adhkār', code: 'ADK', color: 'bg-amber-500/90', category: 'Islamic' },
      { id: 11, name: 'Fiqh Shafi', code: 'FQS', color: 'bg-lime-500/90', category: 'Islamic' },
      { id: 12, name: 'Fiqh Hanafi', code: 'FQH', color: 'bg-teal-500/90', category: 'Islamic' },
      { id: 13, name: 'Sīrah', code: 'SRH', color: 'bg-red-500/90', category: 'Islamic' },
      { id: 14, name: 'Tārīkh', code: 'TRK', color: 'bg-sky-500/90', category: 'Islamic' },
      { id: 15, name: 'Adab', code: 'ADB', color: 'bg-violet-500/90', category: 'Islamic' },
      { id: 16, name: 'Conversational Arabic (MSA)', code: 'CAR', color: 'bg-fuchsia-500/90', category: 'Islamic' },
      { id: 17, name: 'ʿAqīdah', code: 'AQD', color: 'bg-rose-500/90', category: 'Islamic' },
    ],
    teachers: [
      { id: 1, name: 'Dr. Ahmed' },
      { id: 2, name: 'Ms. Fatima' },
      { id: 3, name: 'Mr. Abdullah' },
      { id: 4, name: 'Dr. Mustafa' },
      { id: 5, name: 'Mrs. Khadija' },
      { id: 6, name: 'Mr. Ibrahim' },
      { id: 7, name: 'Dr. Zaynab' },
      { id: 8, name: 'Sheikh Omar' },
      { id: 9, name: 'Sheikh Yusuf' },
      { id: 10, name: 'Ustadh Bilal' },
      { id: 11, name: 'Ustadha Aisha' },
      { id: 12, name: 'Coach Ahmad' },
    ],
    rooms: [
      { id: 1, name: '101' },
      { id: 2, name: '102' },
      { id: 3, name: '103' },
      { id: 4, name: '201' },
      { id: 5, name: '202' },
      { id: 6, name: 'Science Lab' },
      { id: 7, name: 'Computer Lab' },
      { id: 8, name: 'Language Lab' },
      { id: 9, name: 'Prayer Hall' },
      { id: 10, name: 'Gymnasium' },
      { id: 11, name: 'Library' },
    ],
    // Sample schedule for demonstration purposes
    schedule: {
      'Monday': [
        // Morning block
        { timeSlotId: 1, subjectId: 9, teacherId: 8, roomId: 9 }, // Qirā'ah
        { timeSlotId: 2, subjectId: 10, teacherId: 9, roomId: 9 }, // Adhkār
        { timeSlotId: 3, subjectId: 16, teacherId: 10, roomId: 8 }, // Conversational Arabic
        // Noon block
        { timeSlotId: 4, subjectId: 1, teacherId: 1, roomId: 6 }, // Physics
        { timeSlotId: 5, subjectId: 3, teacherId: 3, roomId: 1 }, // Mathematics
        { timeSlotId: 6, subjectId: 5, teacherId: 5, roomId: 2 }, // English Language
        // Afternoon block
        { timeSlotId: 7, subjectId: 4, teacherId: 4, roomId: 7 }, // Computer Science
        { timeSlotId: 8, subjectId: 2, teacherId: 2, roomId: 6 }, // Chemistry
        { timeSlotId: 9, subjectId: 7, teacherId: 7, roomId: 8 }, // American English Essentials
        // Evening block
        { timeSlotId: 10, subjectId: 11, teacherId: 10, roomId: 9 }, // Fiqh Shafi
        { timeSlotId: 11, subjectId: 17, teacherId: 8, roomId: 9 }, // ʿAqīdah
        // Night block - Physical Education/Gym
        { timeSlotId: 12, subjectId: 8, teacherId: 12, roomId: 10 }, // Physical Education
      ],
      'Tuesday': [
        // Morning block
        { timeSlotId: 1, subjectId: 9, teacherId: 8, roomId: 9 },
        { timeSlotId: 2, subjectId: 10, teacherId: 9, roomId: 9 },
        { timeSlotId: 3, subjectId: 13, teacherId: 11, roomId: 9 }, // Sīrah
        // Noon block
        { timeSlotId: 4, subjectId: 3, teacherId: 3, roomId: 1 },
        { timeSlotId: 5, subjectId: 5, teacherId: 5, roomId: 2 },
        { timeSlotId: 6, subjectId: 1, teacherId: 1, roomId: 6 },
        // Afternoon block
        { timeSlotId: 7, subjectId: 6, teacherId: 6, roomId: 8 }, // Second Language
        { timeSlotId: 8, subjectId: 4, teacherId: 4, roomId: 7 },
        { timeSlotId: 9, subjectId: 2, teacherId: 2, roomId: 6 },
        // Evening block
        { timeSlotId: 10, subjectId: 14, teacherId: 9, roomId: 9 }, // Tārīkh
        { timeSlotId: 11, subjectId: 15, teacherId: 10, roomId: 9 }, // Adab
        // Night block - Physical Education/Gym
        { timeSlotId: 12, subjectId: 8, teacherId: 12, roomId: 10 },
      ],
      'Wednesday': [
        // Morning block
        { timeSlotId: 1, subjectId: 9, teacherId: 8, roomId: 9 },
        { timeSlotId: 2, subjectId: 10, teacherId: 9, roomId: 9 },
        { timeSlotId: 3, subjectId: 12, teacherId: 10, roomId: 9 }, // Fiqh Hanafi
        // Noon block
        { timeSlotId: 4, subjectId: 1, teacherId: 1, roomId: 6 },
        { timeSlotId: 5, subjectId: 2, teacherId: 2, roomId: 6 },
        { timeSlotId: 6, subjectId: 3, teacherId: 3, roomId: 1 },
        // Afternoon block
        { timeSlotId: 7, subjectId: 5, teacherId: 5, roomId: 2 },
        { timeSlotId: 8, subjectId: 6, teacherId: 6, roomId: 8 },
        { timeSlotId: 9, subjectId: 4, teacherId: 4, roomId: 7 },
        // Evening block
        { timeSlotId: 10, subjectId: 16, teacherId: 11, roomId: 8 }, // Conversational Arabic
        { timeSlotId: 11, subjectId: 17, teacherId: 8, roomId: 9 }, // ʿAqīdah
        // Night block - Physical Education/Gym
        { timeSlotId: 12, subjectId: 8, teacherId: 12, roomId: 10 },
      ],
      'Thursday': [
        // Morning block
        { timeSlotId: 1, subjectId: 9, teacherId: 8, roomId: 9 },
        { timeSlotId: 2, subjectId: 10, teacherId: 9, roomId: 9 },
        { timeSlotId: 3, subjectId: 16, teacherId: 11, roomId: 8 },
        // Noon block
        { timeSlotId: 4, subjectId: 7, teacherId: 7, roomId: 8 },
        { timeSlotId: 5, subjectId: 1, teacherId: 1, roomId: 6 },
        { timeSlotId: 6, subjectId: 3, teacherId: 3, roomId: 1 },
        // Afternoon block
        { timeSlotId: 7, subjectId: 2, teacherId: 2, roomId: 6 },
        { timeSlotId: 8, subjectId: 5, teacherId: 5, roomId: 2 },
        { timeSlotId: 9, subjectId: 6, teacherId: 6, roomId: 8 },
        // Evening block
        { timeSlotId: 10, subjectId: 13, teacherId: 9, roomId: 9 }, // Sīrah
        { timeSlotId: 11, subjectId: 14, teacherId: 10, roomId: 11 }, // Tārīkh
        // Night block - Physical Education/Gym
        { timeSlotId: 12, subjectId: 8, teacherId: 12, roomId: 10 },
      ],
      'Friday': [
        // Morning block
        { timeSlotId: 1, subjectId: 9, teacherId: 8, roomId: 9 },
        { timeSlotId: 2, subjectId: 10, teacherId: 9, roomId: 9 },
        { timeSlotId: 3, subjectId: 17, teacherId: 8, roomId: 9 }, // ʿAqīdah
        // Noon block
        { timeSlotId: 4, subjectId: 4, teacherId: 4, roomId: 7 },
        { timeSlotId: 5, subjectId: 7, teacherId: 7, roomId: 8 },
        { timeSlotId: 6, subjectId: 5, teacherId: 5, roomId: 2 },
        // Afternoon block
        { timeSlotId: 7, subjectId: 1, teacherId: 1, roomId: 6 },
        { timeSlotId: 8, subjectId: 3, teacherId: 3, roomId: 1 },
        { timeSlotId: 9, subjectId: 2, teacherId: 2, roomId: 6 },
        // Evening block
        { timeSlotId: 10, subjectId: 15, teacherId: 11, roomId: 9 }, // Adab
        { timeSlotId: 11, subjectId: 11, teacherId: 10, roomId: 9 }, // Fiqh Shafi
        // Night block - Physical Education/Gym
        { timeSlotId: 12, subjectId: 8, teacherId: 12, roomId: 10 },
      ],
    },
  };

  // Time blocks for filtering
  const timeBlocks = [
    { id: 'all', name: 'All Blocks' },
    { id: 'morning', name: 'Morning (6:30 - 9:00 AM)' },
    { id: 'noon', name: 'Noon (10:00 - 12:30 PM)' },
    { id: 'afternoon', name: 'Afternoon (2:00 - 4:30 PM)' },
    { id: 'evening', name: 'Evening (6:30 - 8:00 PM)' },
    { id: 'night', name: 'Night (9:00 - 10:00 PM)' },
  ];

  // Simulate API call with useEffect
  useEffect(() => {
    const loadScheduleData = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real implementation, you would fetch data from your API here
        // const response = await fetch('/api/method/labmanager.api.api.get_class_schedule');
        // const data = await response.json();
        
        // For now, use the mock data
        setSchedule(mockData.schedule);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching schedule data:', err);
        setError('Failed to load class schedule. Please try again later.');
        setLoading(false);
      }
    };
    
    loadScheduleData();
  }, [currentGrade, currentSection]); // Re-fetch when grade or section changes

  // Helper function to find class details for a specific time slot
  const getClassDetails = (timeSlotId, day) => {
    if (!schedule[day]) return null;
    
    const classInfo = schedule[day].find(slot => slot.timeSlotId === timeSlotId);
    if (!classInfo) return null;

    const subject = mockData.subjects.find(subj => subj.id === classInfo.subjectId);
    const teacher = mockData.teachers.find(teach => teach.id === classInfo.teacherId);
    const room = mockData.rooms.find(rm => rm.id === classInfo.roomId);

    return {
      subject,
      teacher,
      room,
    };
  };

  // Get filtered time slots based on selected block
  const getFilteredTimeSlots = () => {
    return selectedTimeBlock === 'all'
      ? mockData.timeSlots
      : mockData.timeSlots.filter(slot => slot.block === selectedTimeBlock);
  };

  // Handle print functionality
  const handlePrint = () => {
    window.print();
  };

  // Render the daily schedule view
  const renderDailySchedule = () => {
    const filteredTimeSlots = getFilteredTimeSlots();
    
    return (
      <div className="bg-white/95 rounded-lg p-4 shadow-inner">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left font-medium text-gray-500">Time</th>
                <th className="p-3 text-left font-medium text-gray-500">Subject</th>
                <th className="p-3 text-left font-medium text-gray-500">Teacher</th>
                <th className="p-3 text-left font-medium text-gray-500">Room</th>
              </tr>
            </thead>
            <tbody>
              {filteredTimeSlots.map((timeSlot) => {
                const classDetails = getClassDetails(timeSlot.id, selectedDay);
                
                return (
                  <tr 
                    key={timeSlot.id} 
                    className={`border-t hover:bg-gray-50 cursor-pointer ${classDetails ? 'hover:scale-[1.005] transition-transform' : ''}`}
                    onClick={() => classDetails && setSelectedClass(classDetails)}
                  >
                    <td className="p-3 text-sm font-medium">
                      {timeSlot.start} - {timeSlot.end}
                    </td>
                    <td className="p-3">
                      {classDetails ? (
                        <div className={`inline-flex items-center px-2 py-1 rounded-md ${classDetails.subject.color} text-white`}>
                          <span className="font-medium">{classDetails.subject.name}</span>
                          <span className="ml-2 text-xs bg-white/20 px-1.5 py-0.5 rounded">
                            {classDetails.subject.code}
                          </span>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">-</div>
                      )}
                    </td>
                    <td className="p-3">
                      {classDetails ? (
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{classDetails.teacher.name}</span>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">-</div>
                      )}
                    </td>
                    <td className="p-3">
                      {classDetails ? (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{classDetails.room.name}</span>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">-</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render the weekly schedule view
  const renderWeeklySchedule = () => {
    const filteredTimeSlots = getFilteredTimeSlots();
    
    return (
      <div className="bg-white/95 rounded-lg p-4 shadow-inner">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left font-medium text-gray-500">Time</th>
                {mockData.days.map(day => (
                  <th 
                    key={day} 
                    className={`p-3 text-left font-medium ${selectedDay === day ? 'text-amber-600' : 'text-gray-500'}`}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTimeSlots.map((timeSlot) => (
                <tr key={timeSlot.id} className="border-t">
                  <td className="p-3 text-sm font-medium whitespace-nowrap">
                    {timeSlot.start} - {timeSlot.end}
                  </td>
                  {mockData.days.map(day => {
                    const classDetails = getClassDetails(timeSlot.id, day);
                    return (
                      <td 
                        key={`${day}-${timeSlot.id}`} 
                        className="p-3 border-l"
                        onClick={() => classDetails && setSelectedClass(classDetails)}
                      >
                        {classDetails ? (
                          <div className={`p-2 rounded-md ${classDetails.subject.color} text-white cursor-pointer hover:shadow-md transition-shadow`}>
                            <div className="font-medium text-sm flex items-center justify-between">
                              <span>{classDetails.subject.name}</span>
                              <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded ml-1">
                                {classDetails.subject.code}
                              </span>
                            </div>
                            <div className="text-xs text-white/90 mt-1 flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {classDetails.teacher.name}
                            </div>
                            <div className="text-xs text-white/80 flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {classDetails.room.name}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 h-16 flex items-center justify-center border border-dashed border-gray-200 rounded-md">-</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // For loading state
  if (loading) {
    return (
      <div className="relative">
        {/* Background pattern stays behind the loading overlay */}
        <BackgroundPattern />
        <div className="relative z-10 min-h-[500px] bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg flex items-center justify-center">
          <div className="text-amber-200">Loading schedule...</div>
        </div>
      </div>
    );
  }
  
  // For error state
  if (error) {
    return (
      <div className="relative">
        {/* Background pattern stays behind the error overlay */}
        <BackgroundPattern />
        <div className="relative z-10 min-h-[500px] bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg flex items-center justify-center">
          <div className="text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* BackgroundPattern is positioned behind everything */}
      <BackgroundPattern />
      
      {/* Main content with proper z-index */}
      <div className="relative z-10 bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg p-6 shadow-xl">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-amber-200 flex items-center">
            <Calendar className="w-6 h-6 mr-2" />
            Class Schedule
          </h2>
          
          {/* Controls */}
          <div className="flex flex-wrap gap-3">
            {/* Grade and Section Selection */}
            <div className="flex space-x-2">
              <select 
                className="bg-gray-700 text-gray-200 rounded-md border border-gray-600 p-1 outline-none focus:ring-2 focus:ring-amber-300"
                value={currentGrade}
                onChange={(e) => setCurrentGrade(e.target.value)}
              >
                {mockData.grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
              
              <select 
                className="bg-gray-700 text-gray-200 rounded-md border border-gray-600 p-1 outline-none focus:ring-2 focus:ring-amber-300"
                value={currentSection}
                onChange={(e) => setCurrentSection(e.target.value)}
              >
                {mockData.sections.map(section => (
                  <option key={section} value={section}>Section {section}</option>
                ))}
              </select>
              
              <button
                className="bg-gray-700 text-gray-200 p-1 rounded-md border border-gray-600 hover:bg-amber-300 hover:text-gray-900 transition-colors duration-200 flex items-center"
                onClick={handlePrint}
              >
                <Printer className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Add print styles */}
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .bg-gray-800\\/80, .bg-gray-800\\/80 * {
              visibility: visible;
              background-color: white !important;
              color: black !important;
              border-color: #ddd !important;
            }
            .bg-gray-800\\/80 {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .print-hide, button, .backdrop-blur-sm {
              display: none !important;
            }
            .text-amber-200, .text-amber-300 {
              color: black !important;
            }
            th, td {
              border: 1px solid #ddd !important;
              padding: 8px !important;
            }
            /* Ensure colored cells are visible in print */
            [class*="bg-"] {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}</style>
        
        {/* Class Details Modal */}
        {selectedClass && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedClass(null)}
          >
            <div
              className="bg-gray-800 p-6 rounded-lg max-w-md w-full border border-gray-600 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className={`w-full h-1 ${selectedClass.subject.color} rounded-full mb-4`}></div>
              
              <h3 className="text-xl font-semibold text-amber-300 mb-2">{selectedClass.subject.name}</h3>
              <p className="text-gray-200 mb-4">
                Course Code: <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded">{selectedClass.subject.code}</span>
              </p>
              
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-300" />
                  <span className="text-gray-200">
                    Teacher: {selectedClass.teacher.name}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-300" />
                  <span className="text-gray-200">Location: {selectedClass.room.name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  <span className="capitalize text-gray-200">Category: {selectedClass.subject.category}</span>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
                  onClick={() => setSelectedClass(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Day and Time Block Selection */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex flex-wrap gap-2">
            {mockData.days.map(day => (
              <button
                key={day}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  selectedDay === day
                    ? 'bg-amber-300 text-gray-900'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </button>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {timeBlocks.map(block => (
              <button
                key={block.id}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  selectedTimeBlock === block.id
                    ? 'bg-amber-300 text-gray-900'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedTimeBlock(block.id)}
              >
                {block.id === 'all' ? block.name : <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{block.name}</span>}
              </button>
            ))}
          </div>
        </div>
        
        {/* Schedule View Container */}
        <div className="transition-all duration-300 ease-in-out">
          {/* View mode switcher */}
          <div className="flex justify-end mb-4">
            <div className="flex border border-gray-700 rounded-md overflow-hidden">
              <button
                className={`px-3 py-1 text-sm ${viewMode === 'daily' ? 'bg-amber-300 text-gray-900' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                onClick={() => setViewMode('daily')}
              >
                Daily View
              </button>
              <button
                className={`px-3 py-1 text-sm ${viewMode === 'weekly' ? 'bg-amber-300 text-gray-900' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                onClick={() => setViewMode('weekly')}
              >
                Weekly View
              </button>
            </div>
          </div>
          
          {/* Schedule Content */}
          {viewMode === 'daily' ? renderDailySchedule() : renderWeeklySchedule()}
          
          {/* Subject Legend */}
          <div className="bg-white/95 rounded-lg p-4 mt-4 shadow-inner">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Subject Legend
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {mockData.subjects.map(subject => (
                <div 
                  key={subject.id} 
                  className="flex items-center p-1 rounded hover:bg-gray-100"
                >
                  <div className={`w-4 h-4 rounded ${subject.color} mr-2`}></div>
                  <span className="text-sm">{subject.name}</span>
                  <span className="text-xs bg-gray-200 rounded px-1 ml-1">{subject.code}</span>
                </div>
              ))}
            </div>
          </div>
        </div> {/* Subject Legend */}
      </div> {/* Main content with proper z-index */}
      
  </div> // Relative container
  );
};

export default ClassSchedule;