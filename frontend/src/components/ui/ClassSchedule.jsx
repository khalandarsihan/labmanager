import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Info, BookOpen, Clock, MapPin, Users, Filter, Printer } from 'lucide-react';
import BackgroundPattern from './BackgroundPattern';

const ClassSchedule = () => {
  // State for UI and data
  const [currentGrade, setCurrentGrade] = useState('Plus One');
  const [currentSection, setCurrentSection] = useState('Section A');  // Default to section A
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTimeBlock, setSelectedTimeBlock] = useState('all');
  const [scheduleData, setScheduleData] = useState({
    days: [],
    time_slots: [],
    classes: {}
  });
  const [hasValidSelection, setHasValidSelection] = useState(true);  
  const [gradesList, setGradesList] = useState([]);
  const [sectionsList, setSectionsList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [scheduleId, setScheduleId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [viewMode, setViewMode] = useState('daily');

  // Time blocks for filtering
  const timeBlocks = [
    { id: 'all', name: 'All Blocks' },
    { id: 'morning', name: 'Morning (6:30 - 9:00 AM)' },
    { id: 'noon', name: 'Noon (10:00 - 12:30 PM)' },
    { id: 'afternoon', name: 'Afternoon (2:00 - 4:30 PM)' },
    { id: 'evening', name: 'Evening (6:30 - 8:00 PM)' },
    { id: 'night', name: 'Night (9:00 - 10:00 PM)' },
  ];

 
useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch('/api/method/labmanager.api.api.get_all_sections', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const data = await response.json();
        
        if (data && data.message && Array.isArray(data.message)) {
            setSectionsList(data.message);
        }
      } catch (err) {
        console.error("Error fetching sections:", err);
      }
    };
    
    fetchSections();
  }, []);

  // Initialize grades and fetch data on component mount
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        
        // Fetch grades from API
        const response = await fetch('/api/method/labmanager.api.api.get_all_grades', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const data = await response.json();
        
        // Check for nested message structure
        if (data && data.message) {
          const grades = data.message.message || data.message;
          
          if (Array.isArray(grades) && grades.length > 0) {
            setGradesList(grades);
            
            if (!currentGrade) {
              setCurrentGrade(grades[0].id);
            }
          } else {
            console.error('Invalid grades data format:', data);
            setError('Failed to load grades. Please try again later.');
          }
        } else {
          console.error('Invalid API response format:', data);
          setError('Failed to load grades data. Please try again later.');
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching grades:", err);
        setError('Failed to load grades. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchGrades();
  }, []);

  // Find the current day of the week and set it as the default selected day
  useEffect(() => {
    if (scheduleData.days && scheduleData.days.length > 0) {
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDayIndex = new Date().getDay();
      const currentDay = daysOfWeek[currentDayIndex];
      
      // Check if the current day exists in the schedule days
      if (scheduleData.days.includes(currentDay)) {
        setSelectedDay(currentDay);
      } else {
        // Find the next available day
        const nextAvailableDay = findNextAvailableDay(scheduleData.days, currentDayIndex);
        setSelectedDay(nextAvailableDay);
      }
    } else if (scheduleData.days && scheduleData.days.length === 0) {
      // Default to Monday if no days are available
      setSelectedDay('Monday');
    }
  }, [scheduleData.days]);

  // Helper function to find the next available day in the schedule
  const findNextAvailableDay = (availableDays, currentDayIndex) => {
    if (!availableDays || availableDays.length === 0) return 'Monday';
    
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Try the next 7 days (full week) starting from current day
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (currentDayIndex + i) % 7;
      const nextDay = daysOfWeek[nextDayIndex];
      
      if (availableDays.includes(nextDay)) {
        return nextDay;
      }
    }
    
    // If no day is found, return the first available day in the schedule
    return availableDays[0];
  };

  // Load schedule when grade/section changes
  useEffect(() => {
    // Only load if both grade and section are selected (not on "Select" options)
    if (currentGrade && currentGrade !== 'Select Grade' && 
        currentSection && currentSection !== 'Select Section') {
      setHasValidSelection(true);
      loadScheduleData();
    } else {
      setHasValidSelection(false);
      // Clear schedule data when no valid selection
      setScheduleData({
        days: [],
        time_slots: [],
        classes: {}
      });
    }
  }, [currentGrade, currentSection]);

  const handleGradeChange = (e) => {
    const newGrade = e.target.value;
    setCurrentGrade(newGrade);
    
    // If selection is reset to "Select Grade", clear section too for consistency
    if (newGrade === 'Select Grade') {
      setCurrentSection('Select Section');
    }
  };
  
  const handleSectionChange = (e) => {
    setCurrentSection(e.target.value);
  };

  // Load schedule data from API
  const loadScheduleData = async () => {
    try {
      setLoading(true);
      setError(null);  // Clear any previous errors
      
      // Make sure we have string values, not undefined
      const gradeParam = currentGrade || "";
      const sectionParam = currentSection || "A";
      
      // Call the backend API with grade and section if available
      const response = await fetch('/api/method/labmanager.api.api.get_class_schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grade: gradeParam,
          section: sectionParam
        })
      });
        
      const responseData = await response.json();
      
      // The data is nested inside message
      if (responseData && responseData.message) {
        const data = responseData.message;
        
        if (data.error) {
          setError(data.error || 'Failed to load schedule data');
          setLoading(false);
          return;
        }
        
        // Extract schedule data
        if (data.schedule_data) {
          setScheduleData(data.schedule_data);
        } else {
          console.error('Missing schedule_data in response');
          setError('Incomplete data received from server');
        }
        
        // Set schedule ID for updates
        if (data.schedule_id) {
          setScheduleId(data.schedule_id);
        }
        
        // Set available grade if first load
        if (data.grade && !currentGrade) {
          setCurrentGrade(data.grade);
        }
        
        // Set available section if first load
        if (data.section && !currentSection) {
          setCurrentSection(data.section);
        }
        
        // Process rooms data to ensure we have name and id properties
        let processedRooms = [];
        if (data.rooms) {
          processedRooms = data.rooms.map(room => {
            return {
              ...room,
              // Ensure every room has a name property
              name: room.name || room.room_name || room.number || room.room_number || String(room.id),
              // Ensure every room has a number property if available
              number: room.number || room.room_number || room.id
            };
          });
          setRooms(processedRooms);
        }
        
        // Set subjects and teachers
        if (data.subjects) {
          // Ensure all subjects have color property
          const processedSubjects = data.subjects.map(subject => ({
            ...subject,
            color: subject.color || getDefaultSubjectColor(subject.category || 'Core')
          }));
          setSubjects(processedSubjects);
        }
        
        if (data.teachers) setTeachers(data.teachers);

        // Set sections from response
        if (data.sections && Array.isArray(data.sections)) {
          setSectionsList(data.sections);
        }
      } else if (responseData.error) {
        setError(responseData.error || 'Failed to load schedule data');
      } else {
        setError('Incomplete data received from server');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching schedule data:', err);
      setError('Failed to load class schedule. Please try again later.');
      setLoading(false);
    }
  };
  
  // Helper function to get default color based on subject category
  const getDefaultSubjectColor = (category) => {
    const colorMap = {
      'Core': 'bg-blue-500/90',
      'Islamic': 'bg-emerald-500/90',
      'Elective': 'bg-purple-600',
      'Specialization': 'bg-indigo-600'
    };
    return colorMap[category] || 'bg-gray-500/90';
  };

  // Helper function to find class details for a specific time slot and day
  const getClassDetails = (timeSlotId, day) => {
    try {
      const classes = scheduleData.classes || {};
      const dayClasses = classes[day] || [];
      
      // Convert timeSlotId to number for comparison
      const slotId = Number(timeSlotId);
      
      // Find the class session for this time slot
      const classInfo = dayClasses.find(item =>
        Number(item.timeSlotId) === slotId);
      
      if (!classInfo) return null;
      
      // Get the corresponding objects from subjects, teachers, and rooms arrays
      const subject = subjects.find(s => s.id === classInfo.subject);
      const teacher = teachers.find(t => t.id === classInfo.teacher);
      const room = rooms.find(r => r.id === classInfo.classroom);
      
      return {
        subject,
        teacher,
        room
      };
    } catch (error) {
      console.error("Error in getClassDetails:", error, {
        timeSlotId,
        day,
        scheduleData
      });
      return null;
    }
  };

  // Get filtered time slots based on selected block
  const getFilteredTimeSlots = () => {
    const timeSlots = scheduleData.time_slots || [];
    return selectedTimeBlock === 'all'
      ? timeSlots
      : timeSlots.filter(slot => slot.block === selectedTimeBlock);
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
                      {classDetails && classDetails.subject ? (
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
                      {classDetails && classDetails.teacher ? (
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{classDetails.teacher.name}</span>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">-</div>
                      )}
                    </td>
                    <td className="p-3">
                      {classDetails && classDetails.room ? (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{classDetails.room.name}</span>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">TBD</div>
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
    const days = scheduleData.days || [];
      
    return (
      <div className="bg-white/95 rounded-lg p-4 shadow-inner">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left font-medium text-gray-500">Time</th>
                {days.map(day => (
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
                  {days.map(day => {
                    const classDetails = getClassDetails(timeSlot.id, day);
                    return (
                      <td
                        key={`${day}-${timeSlot.id}`}
                        className="p-3 border-l"
                        onClick={() => classDetails && setSelectedClass(classDetails)}
                      >
                        {classDetails && classDetails.subject ? (
                          <div className={`p-2 rounded-md ${classDetails.subject.color} text-white cursor-pointer hover:shadow-md transition-shadow`}>
                            <div className="font-medium text-sm flex items-center justify-between">
                              <span>{classDetails.subject.name}</span>
                              <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded ml-1">
                                {classDetails.subject.code}
                              </span>
                            </div>
                            <div className="text-xs text-white/90 mt-1 flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {classDetails.teacher ? classDetails.teacher.name : 'TBD'}
                            </div>
                            <div className="text-xs text-white/80 flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {classDetails.room ? classDetails.room.name : 'TBD'}
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
        <BackgroundPattern />
        <div className="relative z-10 min-h-[500px] bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg flex items-center justify-center">
          <div className="text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <BackgroundPattern />
        
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
            onChange={handleGradeChange}
            >
            <option value="Select Grade">Select Grade</option>
            {gradesList.map(grade => (
                <option key={grade.id} value={grade.id}>{grade.name}</option>
            ))}
            </select>

            <select
            className="bg-gray-700 text-gray-200 rounded-md border border-gray-600 p-1 outline-none focus:ring-2 focus:ring-amber-300"
            value={currentSection}
            onChange={handleSectionChange}
            >
            <option value="Select Section">Select Section</option>
            {sectionsList.map(section => (
                <option key={section.id} value={section.id}>{section.name}</option>
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
              <div className={`w-full h-1 ${selectedClass.subject?.color || 'bg-gray-500'} rounded-full mb-4`}></div>
                
              <h3 className="text-xl font-semibold text-amber-300 mb-2">{selectedClass.subject?.name || 'Subject'}</h3>
              <p className="text-gray-200 mb-4">
                Course Code: <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded">{selectedClass.subject?.code || 'N/A'}</span>
              </p>
                
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-300" />
                  <span className="text-gray-200">
                    Teacher: {selectedClass.teacher?.name || 'To be assigned'}
                  </span>
                </div>
                  
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-300" />
                  <span className="text-gray-200">Location: {selectedClass.room?.name || 'To be assigned'}</span>
                </div>
                  
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  <span className="capitalize text-gray-200">Category: {selectedClass.subject?.category || 'N/A'}</span>
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
            {(scheduleData.days || []).map(day => (
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
            {hasValidSelection ? (
                viewMode === 'daily' ? renderDailySchedule() : renderWeeklySchedule()
            ) : (
                <div className="bg-white/95 rounded-lg p-8 shadow-inner flex items-center justify-center">
                <div className="text-lg text-gray-500 text-center">
                    <p>Please select both Grade and Section to view schedule</p>
                </div>
                </div>
            )}

          {/* Subject Legend */}
            {/* Subject Legend - only show when valid selection */}
  {hasValidSelection && (
    <div className="bg-white/95 rounded-lg p-4 mt-4 shadow-inner">

          <div className="bg-white/95 rounded-lg p-4 mt-4 shadow-inner">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Subject Legend
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {subjects.map(subject => (
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
        </div>
        
    )}
    </div>
      </div>
    </div>
  );
};

export default ClassSchedule;