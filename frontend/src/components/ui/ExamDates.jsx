import React, { useState, useEffect } from 'react';
import { Calendar, List, ChevronLeft, ChevronRight, Info, BookOpen, Clock, MapPin, Users, Filter, Printer, Search, X } from 'lucide-react';
import BackgroundPattern from './BackgroundPattern';

// Debug panel component to show state
const DebugPanel = ({ show, exams, selectedMonth, selectedYear }) => {
  if (!show) return null;
  
  return (
    <div className="bg-gray-900 text-gray-200 p-4 rounded-md mb-4 text-xs overflow-auto max-h-40">
      <h4 className="font-bold mb-2">Debug Info</h4>
      <div className="mb-2">
        <strong>Month/Year:</strong> {selectedMonth + 1}/{selectedYear}
      </div>
      <div className="mb-2">
        <strong>Exams Count:</strong> {exams.length}
      </div>
      {exams.length > 0 && (
        <div>
          <strong>First Exam:</strong>
          <pre className="text-xs mt-1 bg-gray-800 p-2 rounded">
            {JSON.stringify({
              name: exams[0].name,
              exam_date: exams[0].exam_date,
              date: exams[0].date?.toString(),
              date_obj: {
                month: exams[0].date?.getMonth(),
                day: exams[0].date?.getDate(),
                year: exams[0].date?.getFullYear()
              }
            }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

// Month/Year dropdown selector component
const MonthYearSelector = ({ selectedMonth, selectedYear, onSelect }) => {
  // Generate months for dropdown
  const monthOptions = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" }
  ];
  
  // Generate years (current year plus next 2 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 3 }, (_, i) => currentYear + i);
  
  return (
    <div className="flex ml-2 border border-gray-700 rounded-md overflow-hidden">
      <select
        className="bg-gray-700 text-gray-200 rounded-l-md border-r border-gray-600 py-1 px-2 outline-none focus:ring-2 focus:ring-amber-300"
        value={selectedMonth}
        onChange={(e) => onSelect(parseInt(e.target.value), selectedYear)}
      >
        {monthOptions.map(month => (
          <option key={month.value} value={month.value}>{month.label}</option>
        ))}
      </select>
      
      <select
        className="bg-gray-700 text-gray-200 rounded-r-md py-1 px-2 outline-none focus:ring-2 focus:ring-amber-300"
        value={selectedYear}
        onChange={(e) => onSelect(selectedMonth, parseInt(e.target.value))}
      >
        {yearOptions.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
};

const ExamDates = () => {
  const [loading, setLoading] = useState(false);
  // State management
  const [currentGrade, setCurrentGrade] = useState('');
  const [currentSection, setCurrentSection] = useState('Section A');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedExamType, setSelectedExamType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar', 'list'
  const [gradesList, setGradesList] = useState([]);
  const [sectionsList, setSectionsList] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [examDates, setExamDates] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [error, setError] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [isYearView, setIsYearView] = useState(false);
  const [yearViewExams, setYearViewExams] = useState([]);
  const [loadingYearData, setLoadingYearData] = useState(false);
  
  // Month names for display
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                     "July", "August", "September", "October", "November", "December"];
  
  // Exam type categories
  const examTypeCategories = [
    { id: 'all', name: 'All Exams', color: 'bg-blue-500' },
    { id: 'quiz', name: 'Quizzes', color: 'bg-green-500' },
    { id: 'midterm', name: 'Midterms', color: 'bg-amber-500' },
    { id: 'final', name: 'Finals', color: 'bg-rose-500' },
    { id: 'project', name: 'Projects', color: 'bg-purple-500' },
    { id: 'other', name: 'Other Assessments', color: 'bg-gray-500' }
  ];

  // Add a keyboard listener to toggle the debug panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Shift+D to toggle debug panel
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setShowDebug(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Process exams data to ensure dates are properly parsed
  const processExamDates = (exams) => {
    if (!exams || !Array.isArray(exams)) return [];
    
    return exams.map(exam => {
      // Create a new object to avoid mutating the original
      const processedExam = { ...exam };
      
      // Parse the exam_date string into a proper Date object
      if (typeof exam.exam_date === 'string') {
        console.log(`Processing exam date: ${exam.exam_date}`);
        
        try {
          // Handle yyyy-mm-dd format
          if (exam.exam_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            processedExam.date = new Date(exam.exam_date);
          } 
          // Handle dd-mm-yyyy format (common in India)
          else if (exam.exam_date.match(/^\d{2}-\d{2}-\d{4}$/)) {
            const [day, month, year] = exam.exam_date.split('-').map(Number);
            processedExam.date = new Date(year, month - 1, day);
          } else {
            // Fallback to whatever format is provided
            processedExam.date = new Date(exam.exam_date);
          }
          
          console.log(`Date parsed as: ${processedExam.date.toISOString()}`);
        } catch (error) {
          console.error(`Error parsing date ${exam.exam_date}:`, error);
          // Fallback to current date if parsing fails
          processedExam.date = new Date();
        }
      } else if (exam.date instanceof Date) {
        // Date is already processed, keep it as is
        processedExam.date = exam.date;
      } else {
        // No valid date information, fallback to current date
        console.warn('No valid date found in exam:', exam);
        processedExam.date = new Date();
      }
      
      // Add color based on exam type if not already present
      if (!processedExam.color) {
        processedExam.color = getExamTypeColor(exam.exam_type);
      }
      
      return processedExam;
    });
  };

  // Only trigger loading when actually fetching data
  useEffect(() => {
    if (currentGrade && currentSection) {
      loadExamData();
    } else {
      // Just fetch the available options without going into loading state
      fetchOptions();
    }
  }, [currentGrade, currentSection, selectedMonth, selectedYear, selectedExamType]);
  
  const fetchOptions = async () => {
    try {
      const response = await fetch('/api/method/labmanager.api.api.get_exam_dates');
      const responseData = await response.json();
      const data = responseData.message;
      
      if (data.grades) setGradesList(data.grades);
      if (data.sections) setSectionsList(data.sections);
      if (data.exam_types) setExamTypes(data.exam_types);
    } catch (err) {
      console.error("Error fetching options:", err);
    }
  };

  // Fetch grades list
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await fetch('/api/method/labmanager.api.api.get_all_grades', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const data = await response.json();
        
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
        }
      } catch (err) {
        console.error("Error fetching grades:", err);
        setError('Failed to load grades. Please try again later.');
      }
    };
    
    fetchGrades();
  }, []);

  // Fetch sections list
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

  // Fetch exam data when grade/section changes
  useEffect(() => {
    // Only load if both grade and section are selected
    if (currentGrade && currentSection) {
      loadExamData();
    }
  }, [currentGrade, currentSection, selectedMonth, selectedYear, selectedExamType]);

  // Load year view data
  const loadYearViewData = async () => {
    if (yearViewExams.length > 0) {
      // Already loaded, just show the data
      setIsYearView(true);
      return;
    }
    
    setLoadingYearData(true);
    
    try {
      // Calculate date range (current month to 12 months ahead)
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      const endDate = new Date(today.getFullYear() + 1, today.getMonth(), 0);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      // Call API for each month in the range
      const allExams = [];
      
      // Current year
      const currYear = today.getFullYear();
      for (let month = today.getMonth(); month < 12; month++) {
        const monthExams = await fetchExamsForMonth(month + 1, currYear);
        if (monthExams.length > 0) {
          allExams.push(...monthExams);
        }
      }
      
      // Next year
      for (let month = 0; month < today.getMonth(); month++) {
        const monthExams = await fetchExamsForMonth(month + 1, currYear + 1);
        if (monthExams.length > 0) {
          allExams.push(...monthExams);
        }
      }
      
      // Process all the exams
      const processedExams = processExamDates(allExams);
      setYearViewExams(processedExams);
      
    } catch (e) {
      console.error("Error in year view data load:", e);
      setError("Failed to load year data: " + e.message);
    } finally {
      setLoadingYearData(false);
      setIsYearView(true);
    }
  };
  
  // Helper function to fetch exams for a specific month
  const fetchExamsForMonth = async (month, year) => {
    try {
      const response = await fetch('/api/method/labmanager.api.api.get_exam_dates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grade: currentGrade,
          section: currentSection,
          month: month,
          year: year,
          exam_type: selectedExamType
        })
      });
      
      const data = await response.json();
      if (data.message && data.message.success) {
        return data.message.exams || [];
      }
      return [];
    } catch (err) {
      console.error(`Error fetching exams for ${month}/${year}:`, err);
      return [];
    }
  };

  // Load exam data from API
  const loadExamData = async () => {
    console.log('Loading exam data with params:', {
      grade: currentGrade,
      section: currentSection,
      month: selectedMonth + 1,
      year: selectedYear,
      exam_type: selectedExamType
    });

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/method/labmanager.api.api.get_exam_dates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grade: currentGrade,
          section: currentSection,
          month: selectedMonth + 1,
          year: selectedYear,
          exam_type: selectedExamType
        })
      });
      
      const responseData = await response.json();
      
      // Extract the data from the message wrapper
      const data = responseData.message;

      console.log('API response:', responseData);
      console.log('Extracted data:', data);
      
      if (data.success) {
        // Set grades and sections if provided in the response
        if (data.grades && data.grades.length > 0) {
          setGradesList(data.grades);
          // Set the first grade as default if none selected
          if (!currentGrade) {
            setCurrentGrade(data.grades[0].id);
          }
        }
        
        if (data.sections && data.sections.length > 0) {
          setSectionsList(data.sections);
          // Set the first section as default if none selected
          if (!currentSection) {
            setCurrentSection(data.sections[0].id);
          }
        }
        
        // Process and set exams with proper date parsing
        const processedExams = processExamDates(data.exams || []);
        setExamDates(processedExams);
        
        setExamTypes(data.exam_types || []);
        setLoading(false);
      } else {
        setError(data.error || 'Failed to load exam data');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching exam data:', err);
      setError('Failed to load exam data. Please try again later.');
      setLoading(false);
    }
  };

  // Handle grade change
  const handleGradeChange = (e) => {
    setCurrentGrade(e.target.value);
  };
  
  // Handle section change
  const handleSectionChange = (e) => {
    setCurrentSection(e.target.value);
  };

  // Navigate to previous month
  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };
  
  // Navigate to next month
  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };
  
  // Go to current month
  const goToCurrentMonth = () => {
    const today = new Date();
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
  };

  // Handle print functionality
  const handlePrint = () => {
    window.print();
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Filter exams by search query
  const filteredExams = examDates.filter(exam => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    
    return (
      (exam.subject?.name?.toLowerCase().includes(query) || false) ||
      (exam.subject?.code?.toLowerCase().includes(query) || false) ||
      (exam.location?.toLowerCase().includes(query) || false) ||
      (exam.exam_type?.toLowerCase().includes(query) || false)
    );
  });

  // Get days in current month for the calendar view
  const getDaysInMonth = (month, year) => {
    const date = new Date(year, month, 1);
    const days = [];
    
    // Get the day of week for the first day (0-6)
    const firstDayOfWeek = date.getDay();
    
    // Add padding days from previous month
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false
      });
    }
    
    // Add days for current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Add padding days for next month to complete the grid
    const totalCells = Math.ceil(days.length / 7) * 7;
    let nextMonthDay = 1;
    while (days.length < totalCells) {
      days.push({
        date: new Date(year, month + 1, nextMonthDay++),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  // Get exams for a specific date
  const getExamsForDate = (date) => {
    return filteredExams.filter(exam => {
      if (!exam.date || !(exam.date instanceof Date)) {
        console.warn('Exam has invalid date format:', exam);
        return false;
      }
      
      // Compare year, month, and day separately to avoid time issues
      const sameDay = 
        exam.date.getDate() === date.getDate() &&
        exam.date.getMonth() === date.getMonth() &&
        exam.date.getFullYear() === date.getFullYear();
        
      const matchesExamType = selectedExamType === 'all' || exam.exam_type === selectedExamType;
      
      return sameDay && matchesExamType;
    });
  };

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Get color for exam type
  const getExamTypeColor = (type) => {
    const examType = examTypeCategories.find(cat => cat.id === type) || examTypeCategories[5]; // Default to "Other"
    return examType.color;
  };

  // Format time (convert 24h to 12h format)
  const formatTime = (time) => {
    if (!time) return '';
    
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Year view rendering
  const renderYearView = () => {
    // Group exams by month
    const groupedExams = {};
    
    yearViewExams.forEach(exam => {
      if (!exam.date) return;
      
      const year = exam.date.getFullYear();
      const month = exam.date.getMonth();
      const key = `${year}-${month}`;
      
      if (!groupedExams[key]) {
        groupedExams[key] = {
          year,
          month,
          label: new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          exams: []
        };
      }
      
      groupedExams[key].exams.push(exam);
    });
    
    // Sort by date (chronologically)
    const sortedMonths = Object.values(groupedExams).sort((a, b) => {
      if (a.year === b.year) {
        return a.month - b.month;
      }
      return a.year - b.year;
    });
    
    return (
      <div className="bg-white/95 rounded-lg p-4 shadow-inner">
        {sortedMonths.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No exams found for the next 12 months
          </div>
        ) : (
          <div className="space-y-8">
            {sortedMonths.map(monthGroup => (
              <div key={`${monthGroup.year}-${monthGroup.month}`}>
                <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
                  {monthGroup.label}
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left font-medium text-gray-500">Date & Time</th>
                        <th className="p-3 text-left font-medium text-gray-500">Subject</th>
                        <th className="p-3 text-left font-medium text-gray-500">Exam Type</th>
                        <th className="p-3 text-left font-medium text-gray-500">Location</th>
                        <th className="p-3 text-left font-medium text-gray-500">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthGroup.exams.map((exam, index) => (
                        <tr
                          key={index}
                          className="border-t hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedExam(exam)}
                        >
                          <td className="p-3">
                            <div className="font-medium">{exam.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                            <div className="text-sm text-gray-500">{formatTime(exam.start_time)} - {formatTime(exam.end_time)}</div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center">
                              <div className={`w-2 h-8 ${exam.color} rounded-full mr-2`}></div>
                              <div>
                                <div className="font-medium">{exam.subject?.name || 'Unknown'}</div>
                                <div className="text-xs bg-gray-200 inline-block px-2 py-0.5 rounded">{exam.subject?.code || 'N/A'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-sm text-white ${exam.color}`}>
                              {exam.exam_type ? exam.exam_type.charAt(0).toUpperCase() + exam.exam_type.slice(1) : 'Unknown'}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                              <span>{exam.location || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-gray-500" />
                              <span>{exam.duration || '0'} mins</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Calendar view rendering
  const renderCalendarView = () => {
    const days = getDaysInMonth(selectedMonth, selectedYear);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <div className="bg-white/95 rounded-lg p-4 shadow-inner">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center p-2 font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayExams = getExamsForDate(day.date);
            const isCurrentDay = isToday(day.date);
            
            return (
              <div
                key={index}
                className={`min-h-[100px] p-2 rounded-md border ${
                  day.isCurrentMonth ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-200 text-gray-400'
                } ${isCurrentDay ? 'border-amber-500' : ''}`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium ${
                    isCurrentDay ? 'bg-amber-400 text-white rounded-full w-6 h-6 flex items-center justify-center' : 'text-gray-700'
                  }`}>
                    {day.date.getDate()}
                  </span>
                  {dayExams.length > 0 && (
                    <span className="text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-0.5">
                      {dayExams.length}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1 mt-1 overflow-hidden">
                  {dayExams.slice(0, 3).map((exam, idx) => (
                    <div
                      key={idx}
                      className={`text-xs p-1 rounded truncate ${exam.color} text-white cursor-pointer hover:opacity-90 shadow-sm`}
                      onClick={() => setSelectedExam(exam)}
                      title={`${exam.subject?.name || 'Unknown'} - ${formatTime(exam.start_time)}`}
                    >
                      {exam.subject?.code || 'Unknown'} - {formatTime(exam.start_time)}
                    </div>
                  ))}
                  {dayExams.length > 3 && (
                    <div
                      className="text-xs text-center text-blue-600 cursor-pointer hover:underline"
                      onClick={() => {
                        // Could show a modal with all exams for the day
                        const firstExam = dayExams[0];
                        setSelectedExam({
                          ...firstExam,
                          allExams: dayExams,
                          isMultipleExams: true
                        });
                      }}
                    >
                      +{dayExams.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // List view rendering
  const renderListView = () => {
    const sortedExams = [...filteredExams].sort((a, b) => {
      if (a.date instanceof Date && b.date instanceof Date) {
        return a.date - b.date;
      }
      return 0;
    });
    
    if (sortedExams.length === 0) {
      return (
        <div className="bg-white/95 rounded-lg p-8 shadow-inner flex items-center justify-center">
          <div className="text-lg text-gray-500 text-center">
            <p>No exams found for the selected criteria</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-white/95 rounded-lg p-4 shadow-inner">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left font-medium text-gray-500">Date & Time</th>
                <th className="p-3 text-left font-medium text-gray-500">Subject</th>
                <th className="p-3 text-left font-medium text-gray-500">Exam Type</th>
                <th className="p-3 text-left font-medium text-gray-500">Location</th>
                <th className="p-3 text-left font-medium text-gray-500">Duration</th>
              </tr>
            </thead>
            <tbody>
              {sortedExams.map((exam, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedExam(exam)}
                >
                  <td className="p-3">
                    <div className="font-medium">{exam.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                    <div className="text-sm text-gray-500">{formatTime(exam.start_time)} - {formatTime(exam.end_time)}</div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <div className={`w-2 h-8 ${exam.color} rounded-full mr-2`}></div>
                      <div>
                        <div className="font-medium">{exam.subject?.name || 'Unknown'}</div>
                        <div className="text-xs bg-gray-200 inline-block px-2 py-0.5 rounded">{exam.subject?.code || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-sm text-white ${exam.color}`}>
                      {exam.exam_type ? exam.exam_type.charAt(0).toUpperCase() + exam.exam_type.slice(1) : 'Unknown'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{exam.location || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{exam.duration || '0'} mins</span>
                    </div>
                  </td>
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
          <div className="text-amber-200">Loading exam schedule...</div>
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
      
      {/* Debug Panel - Press Ctrl+Shift+D to toggle */}
      <DebugPanel 
        show={showDebug} 
        exams={examDates} 
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
      
      <div className="relative z-10 bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg p-6 shadow-xl">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-amber-200 flex items-center">
            <Calendar className="w-6 h-6 mr-2" />
            Exam Dates
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
                <option value="">Select Grade</option>
                {gradesList.map(grade => (
                  <option key={grade.id} value={grade.id}>{grade.name}</option>
                ))}
              </select>
              
              <select
                className="bg-gray-700 text-gray-200 rounded-md border border-gray-600 p-1 outline-none focus:ring-2 focus:ring-amber-300"
                value={currentSection}
                onChange={handleSectionChange}
              >
                <option value="">Select Section</option>
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
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          {/* Month navigation */}
          <div className="flex items-center">
        <div className="flex border border-gray-700 rounded-md overflow-hidden">
          <select
            className="bg-gray-700 text-gray-200 rounded-l-md py-1 px-3 outline-none focus:ring-2 focus:ring-amber-300"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {monthNames.map((name, index) => (
              <option key={index} value={index}>{name}</option>
            ))}
          </select>
          
          <select
            className="bg-gray-700 text-gray-200 border-l border-gray-600 py-1 px-3 outline-none focus:ring-2 focus:ring-amber-300"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          <button
            className="px-3 py-1 bg-gray-700 text-gray-200 hover:bg-amber-300 hover:text-gray-900 border-l border-gray-600 transition-colors"
            onClick={goToCurrentMonth}
          >
            Today
          </button>
        </div>
                 
          </div>
          
          {/* Search bar */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-700 text-gray-200 w-full pl-10 pr-10 py-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-amber-300 focus:outline-none"
              placeholder="Search exams..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={clearSearch}
              >
                <X className="h-4 w-4 text-gray-400 hover:text-white" />
              </button>
            )}
          </div>
        </div>
        
        {/* Exam Type Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {examTypeCategories.map(type => (
            <button
              key={type.id}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedExamType === type.id
                  ? 'bg-amber-300 text-gray-900'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
              onClick={() => setSelectedExamType(type.id)}
            >
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${type.color} mr-2`}></div>
                {type.name}
              </div>
            </button>
          ))}
        </div>
        
        {/* View mode switcher */}
        {/* View mode switcher */}
<div className="flex justify-end mb-4">
  <div className="flex border border-gray-700 rounded-md overflow-hidden">
    <button
      className={`px-4 py-2 text-sm font-medium ${viewMode === 'calendar' && !isYearView ? 'bg-amber-300 text-gray-900' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
      onClick={() => {
        setViewMode('calendar');
        setIsYearView(false);
      }}
    >
      <Calendar className="w-4 h-4 inline-block mr-1" />
      Calendar
    </button>
    <button
      className={`px-4 py-2 text-sm font-medium ${viewMode === 'list' && !isYearView ? 'bg-amber-300 text-gray-900' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
      onClick={() => {
        setViewMode('list');
        setIsYearView(false);
      }}
    >
      <List className="w-4 h-4 inline-block mr-1" />
      List
    </button>
    <button
      className={`px-4 py-2 text-sm font-medium ${isYearView ? 'bg-amber-300 text-gray-900' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
      onClick={loadYearViewData}
    >
      <Calendar className="w-4 h-4 inline-block mr-1" />
      Year
    </button>
  </div>
</div>
        
        {/* Render appropriate view */}
        {currentGrade && currentSection ? (
          isYearView ? (
            loadingYearData ? (
              <div className="bg-white/95 rounded-lg p-8 shadow-inner flex items-center justify-center">
                <div className="text-lg text-gray-500 text-center">
                  <p>Loading year view data...</p>
                </div>
              </div>
            ) : (
              renderYearView()
            )
          ) : (
            viewMode === 'calendar' ? renderCalendarView() : renderListView()
          )
        ) : (
          <div className="bg-white/95 rounded-lg p-8 shadow-inner flex items-center justify-center">
            <div className="text-lg text-gray-500 text-center">
              <p>Please select both Grade and Section to view exam schedule</p>
            </div>
          </div>
        )}
        
        {/* Exam Legend */}
        {currentGrade && currentSection && (
          <div className="bg-white/95 rounded-lg p-4 mt-4 shadow-inner">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Exam Type Legend
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {examTypeCategories.map(type => (
                <div
                  key={type.id}
                  className="flex items-center p-2 rounded hover:bg-gray-100"
                >
                  <div className={`w-4 h-4 rounded-full ${type.color} mr-2`}></div>
                  <span className="text-sm">{type.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Exam Details Modal */}
        {selectedExam && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedExam(null)}
          >
            <div
              className="bg-gray-800 p-6 rounded-lg max-w-md w-full border border-gray-600 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className={`w-full h-1 ${selectedExam.color} rounded-full mb-4`}></div>
              
              {selectedExam.isMultipleExams ? (
                <>
                  <h3 className="text-xl font-semibold text-amber-300 mb-4">
                    Exams on {selectedExam.date.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'})}
                  </h3>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedExam.allExams.map((exam, idx) => (
                      <div key={idx} className="border-b border-gray-700 pb-3 mb-3 last:border-0">
                        <h4 className="text-lg font-medium text-white">{exam.subject?.name || 'Unknown'}</h4>
                        <p className="text-sm text-gray-300">{exam.subject?.code || 'N/A'}</p>
                        
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-300" />
                            <span className="text-gray-200">{formatTime(exam.start_time)} - {formatTime(exam.end_time)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-amber-300" />
                            <span className="text-gray-200">{exam.location || 'N/A'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-amber-300" />
                            <span className="text-gray-200">
                              {exam.exam_type ? exam.exam_type.charAt(0).toUpperCase() + exam.exam_type.slice(1) : 'Unknown'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-300" />
                            <span className="text-gray-200">{exam.duration || '0'} minutes</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-amber-300 mb-2">{selectedExam.subject?.name || 'Unknown'}</h3>
                  <p className="text-gray-200 mb-4">
                    Course Code: <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded">{selectedExam.subject?.code || 'N/A'}</span>
                    <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded">
                      Grade: {selectedExam.grade || 'N/A'}
                    </span>
                    <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded">
                      Section: {selectedExam.section || 'N/A'}
                    </span>
                  </p>
                  
                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-300" />
                      <span className="text-gray-200">
                        Date: {selectedExam.date.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'})}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-300" />
                      <span className="text-gray-200">
                        Time: {formatTime(selectedExam.start_time)} - {formatTime(selectedExam.end_time)} ({selectedExam.duration || '0'} minutes)
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-300" />
                      <span className="text-gray-200">Location: {selectedExam.location || 'N/A'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-amber-300" />
                      <span className="text-gray-200">
                        Exam Type: <span className={`px-2 py-0.5 rounded text-xs text-white ${selectedExam.color} ml-1`}>
                          {selectedExam.exam_type ? selectedExam.exam_type.charAt(0).toUpperCase() + selectedExam.exam_type.slice(1) : 'Unknown'}
                        </span>
                      </span>
                    </div>
                    
                    {selectedExam.teacher && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-300" />
                        <span className="text-gray-200">Proctor: {selectedExam.teacher.name}</span>
                      </div>
                    )}
                    
                    {selectedExam.notes && (
                      <div className="mt-2">
                        <p className="text-amber-300 font-medium">Notes:</p>
                        <p className="text-gray-300 mt-1 bg-gray-700/50 p-2 rounded text-sm">{selectedExam.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
                      onClick={() => setSelectedExam(null)}
                    >
                      Close
                    </button>
                    
                    <button
                      className="px-4 py-2 bg-amber-300 text-gray-900 rounded-md font-medium hover:bg-amber-400 transition-colors"
                      onClick={() => {
                        // Here you could add exam to personal calendar
                        // This is a placeholder for future functionality
                        alert('This feature is coming soon!');
                      }}
                    >
                      Add to My Calendar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
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
            .print-hide, button, .backdrop-blur-sm, select {
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
      </div>
    </div>
  );
};

export default ExamDates;