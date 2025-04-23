import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Info, BookOpen, Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';
import BackgroundPattern from './BackgroundPattern';

const AcademicCalendar = () => {
  // State for calendar data and UI
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('month'); // 'month', 'week', or 'list'
  // Make events clickable with details overlay
  const [selectedEvent, setSelectedEvent] = useState(null);
  // Track screen size
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Track screen width changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    // Handle keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevMonth();
      if (e.key === 'ArrowRight') nextMonth();
      if (e.key === 'Home') goToToday();
    };
    
    // Add event listener for keyboard navigation
    window.addEventListener('keydown', handleKeyDown);
    
    // Fetch events from API
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Call the Frappe API endpoint
        const response = await fetch('/api/method/labmanager.api.api.get_academic_calendar');
        const data = await response.json();
        
        if (data.message && data.message.events) {
          // Process the events to ensure dates are Date objects
          const processedEvents = data.message.events.map(event => ({
            ...event,
            // Convert date strings to Date objects
            start: new Date(event.start),
            end: new Date(event.end)
          }));
          
          setEvents(processedEvents);
        } else if (data.message && data.message.error) {
          setError(data.message.error);
        } else {
          setError('Failed to load calendar events. Please try again later.');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching calendar events:', err);
        setError('Failed to load calendar events. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchEvents();
    
    // Cleanup function
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Empty dependency array means this runs once on mount

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };
  
  // Get days for current month view with padding
  const getDaysForMonthView = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Get first day of month and determine padding needed
    const firstDayOfMonth = new Date(year, month, 1);
    const dayOfWeek = firstDayOfMonth.getDay();
    
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const prevMonthPadding = Array.from({ length: dayOfWeek }, (_, i) => {
      return new Date(year, month - 1, daysInPrevMonth - dayOfWeek + i + 1);
    });
    
    // Get days in current month
    const daysInMonth = getDaysInMonth(date);
    
    // Calculate remaining days needed to complete the grid
    const totalDaysDisplayed = Math.ceil((dayOfWeek + daysInMonth.length) / 7) * 7;
    const nextMonthPadding = Array.from(
      { length: totalDaysDisplayed - (prevMonthPadding.length + daysInMonth.length) },
      (_, i) => new Date(year, month + 1, i + 1)
    );
    
    return [...prevMonthPadding, ...daysInMonth, ...nextMonthPadding];
  };
  
  // Navigation handlers
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };
  
  // Filter events for a specific date
  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const dateToCheck = new Date(date);
      
      // Normalize dates to compare only year, month, and day
      const normalizeDate = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
      };
      
      const normalizedEventStart = normalizeDate(eventStart);
      const normalizedEventEnd = normalizeDate(eventEnd);
      const normalizedDateToCheck = normalizeDate(dateToCheck);
      
      // Check if date is between start and end dates (inclusive)
      return normalizedDateToCheck >= normalizedEventStart && normalizedDateToCheck <= normalizedEventEnd;
    });
  };
  
  // Format date
  const formatDate = (date, format = 'short') => {
    if (format === 'full') {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } else if (format === 'medium') {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'numeric', 
        day: 'numeric' 
      });
    }
  };
  
  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  // Check if a date is the selected date
  const isSelected = (date) => {
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };
  
  // Check if a date is in the current month
  const isCurrentMonth = (date) => {
    return date.getMonth() === currentMonth.getMonth();
  };
  
  // Get the month and year string for the header
  const getMonthYearString = () => {
    return currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  // More balanced color options for event types
  const getEventColor = (type) => {
    switch(type) {
      case 'academic-term': return 'bg-blue-500/90';
      case 'exam': return 'bg-rose-500/90';
      case 'event': return 'bg-emerald-500/90';
      case 'deadline': return 'bg-amber-500/90';
      case 'holiday': return 'bg-purple-600';
      case 'faculty': return 'bg-indigo-600';
      default: return 'bg-gray-500/90';
    }
  };

  // Get icon for event type
  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'academic-term':
        return <BookOpen className="w-4 h-4" />;
      case 'exam':
        return <Clock className="w-4 h-4" />;
      case 'event':
        return <Users className="w-4 h-4" />;
      case 'deadline':
        return <Info className="w-4 h-4" />;
      case 'holiday':
        return <Calendar className="w-4 h-4" />;
      case 'faculty':
        return <Users className="w-4 h-4" />;
      default:
        return <CalendarIcon className="w-4 h-4" />;
    }
  };
  
  // Render days of the week header - mobile optimized
  const renderDaysOfWeek = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <div className="grid grid-cols-7 mb-1">
        {days.map(day => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs md:text-sm font-medium text-gray-400"
          >
            {isMobile ? day.charAt(0) : day}
          </div>
        ))}
      </div>
    );
  };
  
  // Render calendar month view - mobile optimized
  const renderMonthView = () => {
    const calendarDays = getDaysForMonthView(currentMonth);
    
    return (
      <div className="grid grid-cols-7 gap-px">
        {calendarDays.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          const isCurrentMonthDay = isCurrentMonth(date);
          const isTodayDate = isToday(date);
          const isSelectedDate = isSelected(date);
          
          // Determine the height based on screen size
          const cellHeight = isMobile ? 'min-h-[60px]' : 'min-h-[100px]';
          
          return (
            <div
              key={index}
              className={`${cellHeight} p-1 md:p-2 border rounded-md hover:border-blue-300 transition-colors duration-200 cursor-pointer ${
                isCurrentMonthDay 
                  ? 'bg-white border-gray-200' 
                  : 'bg-gray-100 border-gray-200 text-gray-400'
              } ${isTodayDate ? 'border-amber-500' : ''} 
              ${isSelectedDate ? 'ring-2 ring-blue-400' : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs md:text-sm font-medium ${
                  isTodayDate ? 'bg-amber-400 text-white rounded-full w-5 h-5 flex items-center justify-center' : 'text-gray-700'
                }`}>
                  {date.getDate()}
                </span>
                {dayEvents.length > 0 && !isMobile && (
                  <span className="text-xs bg-gray-200 text-gray-700 rounded-full px-1.5 py-0.5">
                    {dayEvents.length}
                  </span>
                )}
              </div>
              
              <div className="space-y-0.5 overflow-hidden">
                {/* Show dots for mobile, truncated text for desktop */}
                {isMobile ? (
                  <div className="flex gap-1 flex-wrap">
                    {dayEvents.slice(0, 3).map((event, idx) => (
                      <div 
                        key={idx} 
                        className={`w-2 h-2 rounded-full ${event.color || getEventColor(event.type)}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                        }}
                      ></div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    )}
                  </div>
                ) : (
                  // Desktop view
                  dayEvents.slice(0, 3).map(event => (
                    <div 
                      key={event.id} 
                      className={`text-xs p-1 rounded truncate ${event.color || getEventColor(event.type)} text-white cursor-pointer hover:opacity-90 active:opacity-75 shadow-sm`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                      }}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))
                )}
                
                {!isMobile && dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Render list view - mobile optimized
  const renderListView = () => {
    // Sort events by start date
    const sortedEvents = [...events].sort((a, b) => new Date(a.start) - new Date(b.start));
    
    return (
      <div className="space-y-2">
        {sortedEvents.map(event => (
          <div 
            key={event.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedEvent(event)}
          >
            <div className="flex items-center">
              <div className={`${event.color || getEventColor(event.type)} w-2 self-stretch`}></div>
              <div className="p-2 md:p-4 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-sm md:text-base text-gray-800">{event.title}</h3>
                  {!isMobile && (
                    <span className="text-xs bg-gray-100 text-gray-700 rounded px-2 py-1 flex items-center gap-1">
                      {getEventTypeIcon(event.type)}
                      <span className="capitalize">{event.type.replace('-', ' ')}</span>
                    </span>
                  )}
                </div>
                
                {(!isMobile || event.description.length < 60) && (
                  <p className="text-xs md:text-sm text-gray-600 mt-1">{event.description}</p>
                )}
                
                <div className="flex flex-wrap gap-2 md:gap-6 mt-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(event.start).toLocaleDateString() === new Date(event.end).toLocaleDateString()
                      ? formatDate(new Date(event.start), isMobile ? 'short' : 'medium')
                      : `${formatDate(new Date(event.start), isMobile ? 'short' : 'medium')} - ${formatDate(new Date(event.end), isMobile ? 'short' : 'medium')}`
                    }
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {isMobile ? event.location.substring(0, 10) + (event.location.length > 10 ? '...' : '') : event.location}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Render week view - mobile optimized
  const renderWeekView = () => {
    // Calculate the start of the week (Sunday) for the current selected date
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    
    // Generate an array of dates for the week
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
    
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((date, index) => {
            const isTodayDate = isToday(date);
            
            return (
              <div 
                key={index} 
                className="text-center"
                onClick={() => setSelectedDate(date)}
              >
                <div className="text-xs md:text-sm text-gray-600">
                  {isMobile ? date.toLocaleDateString('en-US', { weekday: 'narrow' }) : date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`mx-auto mt-1 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center cursor-pointer ${
                  isTodayDate 
                    ? 'bg-amber-400 text-white' 
                    : isSelected(date) 
                      ? 'border-2 border-blue-400 text-gray-800' 
                      : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}>
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="border-t border-gray-200 pt-3">
          {weekDays.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            
            return dayEvents.length > 0 && (
              <div key={index} className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${
                    isToday(date) ? 'bg-amber-400' : 'bg-gray-400'
                  }`}></div>
                  <h3 className="font-medium text-xs md:text-sm text-gray-800">
                    {date.toLocaleDateString('en-US', isMobile ? { weekday: 'short', month: 'numeric', day: 'numeric' } : { weekday: 'long', month: 'short', day: 'numeric' })}
                  </h3>
                </div>
                
                <div className="ml-4 space-y-1">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id}
                      className="bg-white border border-gray-200 rounded p-1.5 md:p-2 flex items-center gap-2 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className={`${event.color || getEventColor(event.type)} w-1 self-stretch rounded-full`}></div>
                      <div>
                        <div className="font-medium text-xs md:text-sm text-gray-800">{isMobile && event.title.length > 20 ? event.title.substring(0, 20) + '...' : event.title}</div>
                        {!isMobile && <div className="text-xs text-gray-500">{event.location}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Render event details for selected date - mobile optimized
  const renderSelectedDateDetails = () => {
    const selectedDateEvents = getEventsForDate(selectedDate);
    
    if (selectedDateEvents.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500 text-sm">
          No events scheduled for this date
        </div>
      );
    }
    
    return (
      <div className="space-y-2 max-h-[200px] md:max-h-[300px] overflow-y-auto">
        {selectedDateEvents.map(event => (
          <div 
            key={event.id}
            className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
            onClick={() => setSelectedEvent(event)}
          >
            <div className="flex">
              <div className={`${event.color || getEventColor(event.type)} w-1 self-stretch`}></div>
              <div className="p-2 md:p-3 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-sm md:text-base text-gray-800">{event.title}</h3>
                  {!isMobile && (
                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-700 flex items-center gap-1">
                      {getEventTypeIcon(event.type)}
                      <span>{event.type.replace('-', ' ')}</span>
                    </span>
                  )}
                </div>
                
                {(!isMobile || event.description.length < 60) && (
                  <p className="text-xs md:text-sm text-gray-600 mt-1">{event.description}</p>
                )}
                
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(event.start).toLocaleDateString() === new Date(event.end).toLocaleDateString()
                      ? formatDate(new Date(event.start), isMobile ? 'short' : 'medium')
                      : `${formatDate(new Date(event.start), isMobile ? 'short' : 'medium')} - ${formatDate(new Date(event.end), isMobile ? 'short' : 'medium')}`
                    }
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {isMobile ? event.location.substring(0, 15) + (event.location.length > 15 ? '...' : '') : event.location}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // For loading state
  if (loading) {
    return (
      <div className="relative">
        {/* Background pattern stays behind the loading overlay */}
        <BackgroundPattern />
        <div className="relative z-10 min-h-[300px] md:min-h-[500px] bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg flex items-center justify-center">
          <div className="text-amber-200">Loading calendar...</div>
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
        <div className="relative z-10 min-h-[300px] md:min-h-[500px] bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg flex items-center justify-center">
          <div className="text-red-400">{error}</div>
        </div>
      </div>
    );
  }
  
  // Main return statement - mobile optimized
  return (
    <div className="relative">
      {/* BackgroundPattern is positioned behind everything */}
      <BackgroundPattern />
      
      {/* Main calendar content with proper z-index */}
      <div className="relative z-10 bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg p-2 md:p-6 shadow-xl">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 md:mb-6 gap-2 md:gap-4">
          <h2 className="text-lg md:text-2xl font-bold text-amber-200 flex items-center">
            <Calendar className="w-5 h-5 md:w-6 md:h-6 mr-1 md:mr-2" />
            Academic Calendar
          </h2>
          
          {/* Controls */}
          <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
            {/* View Toggle */}
            <div className="flex border border-gray-700 rounded-md overflow-hidden">
              <button
                className={`px-2 md:px-3 py-1 text-xs md:text-sm ${
                  view === 'month'
                    ? 'bg-amber-300 text-gray-900'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
                onClick={() => setView('month')}
              >
                {isMobile ? 'Month' : 'Month'}
              </button>
              <button
                className={`px-2 md:px-3 py-1 text-xs md:text-sm ${
                  view === 'week'
                    ? 'bg-amber-300 text-gray-900'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
                onClick={() => setView('week')}
              >
                {isMobile ? 'Week' : 'Week'}
              </button>
              <button
                className={`px-2 md:px-3 py-1 text-xs md:text-sm ${
                  view === 'list'
                    ? 'bg-amber-300 text-gray-900'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
                onClick={() => setView('list')}
              >
                {isMobile ? 'List' : 'List'}
              </button>
            </div>
            
            {/* Navigation Controls */}
            <div className="flex items-center border border-gray-700 rounded-md overflow-hidden ml-auto md:ml-0">
              <button
                className="p-1 md:p-2 bg-gray-700 text-gray-200 hover:bg-amber-300 hover:text-gray-900 transition-colors duration-200"
                onClick={prevMonth}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                className="px-2 py-1 text-xs md:text-sm bg-gray-700 text-gray-200 hover:bg-gray-600 border-l border-r border-gray-600"
                onClick={goToToday}
              >
                Today
              </button>
              <button
                className="p-1 md:p-2 bg-gray-700 text-gray-200 hover:bg-amber-300 hover:text-gray-900 transition-colors duration-200"
                onClick={nextMonth}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Calendar period header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-3 md:mb-6">
          <h3 className="text-base md:text-xl font-medium text-amber-100 mb-2 md:mb-0">
            {view === 'week'
              ? `Week of ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
              : view === 'list'
                ? 'All Events'
                : getMonthYearString()
            }
          </h3>
          
          {/* Legend - mobile optimized */}
          {!isMobile ? (
            <div className="bg-white/95 rounded-lg px-3 py-1.5 shadow-sm flex flex-wrap gap-2 md:gap-3">
              <span className="inline-flex items-center text-xs text-gray-700">
                <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-600 mr-1"></span> Academic Term
              </span>
              <span className="inline-flex items-center text-xs text-gray-700">
                <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-600 mr-1"></span> Exam
              </span>
              <span className="inline-flex items-center text-xs text-gray-700">
                <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-600 mr-1"></span> Event
              </span>
              <span className="inline-flex items-center text-xs text-gray-700">
                <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-amber-600 mr-1"></span> Deadline
              </span>
              <span className="inline-flex items-center text-xs text-gray-700">
                <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-purple-600 mr-1"></span> Holiday
              </span>
              <span className="inline-flex items-center text-xs text-gray-700">
                <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-indigo-600 mr-1"></span> Faculty
              </span>
            </div>
          ) : (
            <div className="bg-white/95 rounded-lg px-1.5 py-1 shadow-sm grid grid-cols-3 gap-x-2 gap-y-1 w-full text-[10px]">
              <span className="inline-flex items-center text-gray-700">
                <span className="w-2 h-2 rounded-full bg-blue-600 mr-1"></span> Academic
              </span>
              <span className="inline-flex items-center text-gray-700">
                <span className="w-2 h-2 rounded-full bg-red-600 mr-1"></span> Exam
              </span>
              <span className="inline-flex items-center text-gray-700">
                <span className="w-2 h-2 rounded-full bg-green-600 mr-1"></span> Event
              </span>
              <span className="inline-flex items-center text-gray-700">
                <span className="w-2 h-2 rounded-full bg-amber-600 mr-1"></span> Deadline
              </span>
              <span className="inline-flex items-center text-gray-700">
                <span className="w-2 h-2 rounded-full bg-purple-600 mr-1"></span> Holiday
              </span>
              <span className="inline-flex items-center text-gray-700">
                <span className="w-2 h-2 rounded-full bg-indigo-600 mr-1"></span> Faculty
              </span>
            </div>
          )}
        </div>
        
        {/* Calendar View Container */}
        <div className="bg-white/95 rounded-lg p-2 md:p-4 shadow-inner">
          {/* Days of Week Header */}
          {view === 'month' && renderDaysOfWeek()}
          
          {/* Calendar View with Transition */}
          <div className="transition-all duration-300 ease-in-out">
            {view === 'month' && renderMonthView()}
            {view === 'week' && renderWeekView()}
            {view === 'list' && renderListView()}
          </div>
        </div>
        
        {/* Selected Date Details */}
        {view !== 'list' && (
          <div className="bg-white/95 rounded-lg p-2 md:p-4 mt-2 md:mt-4 shadow-inner">
            <h3 className="text-sm md:text-lg font-medium text-gray-800 mb-2 md:mb-3">
              Events for {formatDate(selectedDate, isMobile ? 'medium' : 'full')}
            </h3>
            {renderSelectedDateDetails()}
          </div>
        )}
        
        {/* Event Details Modal - mobile optimized */}
        {selectedEvent && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <div
              className="bg-gray-800 p-4 md:p-6 rounded-lg max-w-md w-full border border-gray-600 shadow-xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className={`w-full h-1 ${selectedEvent.color || getEventColor(selectedEvent.type)} rounded-full mb-3 md:mb-4`}></div>
              
              <h3 className="text-lg md:text-xl font-semibold text-amber-300 mb-2">{selectedEvent.title}</h3>
              <p className="text-sm md:text-base text-gray-200 mb-3 md:mb-4">{selectedEvent.description}</p>
              
              <div className="flex flex-col gap-2 md:gap-3 text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-300" />
                  <span className="text-gray-200">
                    {new Date(selectedEvent.start).toLocaleDateString() === new Date(selectedEvent.end).toLocaleDateString()
                      ? formatDate(new Date(selectedEvent.start), 'full')
                      : `${formatDate(new Date(selectedEvent.start), 'medium')} - ${formatDate(new Date(selectedEvent.end), 'medium')}`
                    }
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-300" />
                  <span className="text-gray-200">{selectedEvent.location}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-amber-300">
                    {getEventTypeIcon(selectedEvent.type)}
                  </div>
                  <span className="capitalize text-gray-200">{selectedEvent.type.replace('-', ' ')}</span>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4 md:mt-6">
                <button
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors text-sm"
                  onClick={() => setSelectedEvent(null)}
                >
                  Close
                </button>
                
                <button
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-amber-300 text-gray-900 rounded-md font-medium hover:bg-amber-400 transition-colors text-sm"
                  onClick={() => {
                    // Here you could add event to calendar, set reminder, etc.
                    setSelectedEvent(null);
                  }}
                >
                  Add to My Calendar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicCalendar;