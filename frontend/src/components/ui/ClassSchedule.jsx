import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Printer } from 'lucide-react';
import BackgroundPattern from './BackgroundPattern';

// Each entry: bg class used for cells, text class used for modal accents
const SUBJECT_COLORS = [
  { bg: 'bg-emerald-500/90', text: 'text-emerald-400' },
  { bg: 'bg-amber-500/90',   text: 'text-amber-400'   },
  { bg: 'bg-fuchsia-400/90', text: 'text-fuchsia-400' },
  { bg: 'bg-blue-500/90',    text: 'text-blue-400'    },
  { bg: 'bg-yellow-500/90',  text: 'text-yellow-400'  },
  { bg: 'bg-pink-500/90',    text: 'text-pink-400'    },
  { bg: 'bg-purple-500/90',  text: 'text-purple-400'  },
  { bg: 'bg-green-500/90',   text: 'text-green-400'   },
  { bg: 'bg-cyan-500/90',    text: 'text-cyan-400'    },
  { bg: 'bg-lime-500/90',    text: 'text-lime-400'    },
  { bg: 'bg-rose-500/90',    text: 'text-rose-400'    },
  { bg: 'bg-orange-500/90',  text: 'text-orange-400'  },
  { bg: 'bg-teal-500/90',    text: 'text-teal-400'    },
  { bg: 'bg-red-500/90',     text: 'text-red-400'     },
  { bg: 'bg-sky-500/90',     text: 'text-sky-400'     },
  { bg: 'bg-violet-500/90',  text: 'text-violet-400'  },
  { bg: 'bg-indigo-500/90',  text: 'text-indigo-400'  },
  { bg: 'bg-pink-400/90',    text: 'text-pink-300'    },
  { bg: 'bg-sky-400/90',     text: 'text-sky-300'     },
  { bg: 'bg-fuchsia-600/90', text: 'text-fuchsia-400' },
];

const getTimeBlock = (timeStr) => {
  if (!timeStr) return 'other';
  const h = parseInt(timeStr.split(':')[0], 10);
  if (h >= 6 && h < 9) return 'morning';
  if (h >= 10 && h < 13) return 'noon';
  if (h >= 14 && h < 17) return 'afternoon';
  if (h >= 18 && h < 20) return 'evening';
  if (h >= 21) return 'night';
  return 'other';
};

const ClassSchedule = () => {
  const [currentBatch, setCurrentBatch] = useState('');
  const [batchList, setBatchList] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTimeBlock, setSelectedTimeBlock] = useState('all');
  const [scheduleData, setScheduleData] = useState({ days: [], periods: [], classes: {} });
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [viewMode, setViewMode] = useState('daily');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const timeBlocks = [
    { id: 'all', name: 'All Blocks' },
    { id: 'morning', name: 'Morning (6:30 - 9:00 AM)' },
    { id: 'noon', name: 'Noon (10:00 - 12:30 PM)' },
    { id: 'afternoon', name: 'Afternoon (2:00 - 4:30 PM)' },
    { id: 'evening', name: 'Evening (6:30 - 8:00 PM)' },
    { id: 'night', name: 'Night (9:00 - 10:00 PM)' },
  ];

  // Build subject → color pair map (stable, index-based)
  const subjectColorMap = {};
  subjects.forEach((s, i) => {
    subjectColorMap[s.name] = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
  });
  const getSubjectBg   = (name) => (subjectColorMap[name] || { bg: 'bg-gray-700/90' }).bg;
  const getSubjectText = (name) => (subjectColorMap[name] || { text: 'text-gray-300' }).text;

  // Fetch all batches on mount
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/method/labmanager.api.api.get_all_batches');
        const data = await res.json();
        const list = data.message || [];
        setBatchList(list);
        if (list.length > 0) {
          setCurrentBatch(list[0].id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching batches:', err);
        setError('Failed to load batches.');
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  // Set default selected day when schedule loads
  useEffect(() => {
    if (scheduleData.days.length === 0) return;
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = daysOfWeek[new Date().getDay()];
    if (scheduleData.days.includes(today)) {
      setSelectedDay(today);
    } else {
      // Next available day
      const todayIdx = new Date().getDay();
      for (let i = 1; i <= 7; i++) {
        const candidate = daysOfWeek[(todayIdx + i) % 7];
        if (scheduleData.days.includes(candidate)) {
          setSelectedDay(candidate);
          return;
        }
      }
      setSelectedDay(scheduleData.days[0]);
    }
  }, [scheduleData.days]);

  // Fetch timetable whenever batch changes
  useEffect(() => {
    if (!currentBatch) return;
    const loadSchedule = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/method/labmanager.api.api.get_timetable_schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ batch: currentBatch }),
        });
        const data = await res.json();
        const msg = data.message || {};
        setScheduleData({
          days: msg.days || [],
          periods: msg.periods || [],
          classes: msg.classes || {},
        });
        setSubjects(msg.subjects || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching timetable:', err);
        setError('Failed to load class schedule.');
        setLoading(false);
      }
    };
    loadSchedule();
  }, [currentBatch]);

  const getClassDetails = (periodNumber, day) => {
    const dayClasses = scheduleData.classes[day] || [];
    return dayClasses.find((c) => c.period_number === periodNumber) || null;
  };

  const getFilteredPeriods = () => {
    const periods = scheduleData.periods || [];
    return selectedTimeBlock === 'all'
      ? periods
      : periods.filter((p) => getTimeBlock(p.start) === selectedTimeBlock);
  };

  const handlePrint = () => window.print();

  // ─── Daily view ────────────────────────────────────────────────────────────
  const renderDailySchedule = () => {
    const periods = getFilteredPeriods();

    if (isMobile) {
      return (
        <div className="bg-white/95 rounded-lg p-2 shadow-inner">
          <div className="space-y-2">
            {periods.map((period) => {
              const cls = getClassDetails(period.period_number, selectedDay);
              return (
                <div
                  key={period.id}
                  className={`border rounded-lg overflow-hidden ${cls ? 'shadow-sm' : 'border-dashed'}`}
                  onClick={() => cls && setSelectedClass(cls)}
                >
                  <div className="bg-gray-100 py-1.5 px-3 flex justify-between items-center">
                    <span className="text-xs font-medium">{period.start} - {period.end}</span>
                    <span className="text-xs text-gray-500">Period {period.period_number}</span>
                  </div>
                  <div className="p-2">
                    {cls ? (
                      <div>
                        <div className={`inline-flex mb-1.5 items-center px-2 py-1 rounded-md ${getSubjectBg(cls.subject)} text-white`}>
                          <span className="font-medium text-sm">{cls.subject}</span>
                        </div>
                        <div className="flex flex-col text-xs space-y-1">
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1 text-gray-500" />
                            <span className="text-gray-800">{cls.teacher_name || 'TBA'}</span>
                          </div>
                          {cls.room && (
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1 text-gray-500" />
                              <span className="text-gray-800">{cls.room}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-16 text-sm text-gray-400">
                        No class scheduled
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
                <th className="p-3 text-left font-medium text-gray-500">Time</th>
                <th className="p-3 text-left font-medium text-gray-500">Subject</th>
                <th className="p-3 text-left font-medium text-gray-500">Teacher</th>
                <th className="p-3 text-left font-medium text-gray-500">Room</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((period) => {
                const cls = getClassDetails(period.period_number, selectedDay);
                return (
                  <tr
                    key={period.id}
                    className={`border-t hover:bg-gray-50 cursor-pointer ${cls ? 'hover:scale-[1.005] transition-transform' : ''}`}
                    onClick={() => cls && setSelectedClass(cls)}
                  >
                    <td className="p-3 text-sm font-medium whitespace-nowrap">
                      {period.start} - {period.end}
                    </td>
                    <td className="p-3">
                      {cls ? (
                        <div className={`inline-flex items-center px-2 py-1 rounded-md ${getSubjectBg(cls.subject)} text-white`}>
                          <span className="font-medium">{cls.subject}</span>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">-</div>
                      )}
                    </td>
                    <td className="p-3">
                      {cls ? (
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{cls.teacher_name || 'TBA'}</span>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">-</div>
                      )}
                    </td>
                    <td className="p-3">
                      {cls && cls.room ? (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{cls.room}</span>
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

  // ─── Weekly view ───────────────────────────────────────────────────────────
  const renderWeeklySchedule = () => {
    const periods = getFilteredPeriods();
    const days = scheduleData.days || [];

    if (isMobile) {
      return (
        <div className="bg-white/95 rounded-lg p-2 shadow-inner">
          <div className="space-y-2">
            {days.map((day) => (
              <div
                key={day}
                className={`border rounded-lg overflow-hidden ${selectedDay === day ? 'ring-2 ring-amber-400' : ''}`}
              >
                <div
                  className={`py-2 px-3 flex justify-between items-center cursor-pointer ${selectedDay === day ? 'bg-amber-100' : 'bg-gray-100'}`}
                  onClick={() => setSelectedDay(day)}
                >
                  <span className={`font-medium ${selectedDay === day ? 'text-amber-900' : 'text-gray-700'}`}>{day}</span>
                  <span className="text-xs bg-white rounded-full px-2 py-0.5 text-gray-700">
                    {periods.length} periods
                  </span>
                </div>
                {selectedDay === day && (
                  <div className="p-2 space-y-2">
                    {periods.map((period) => {
                      const cls = getClassDetails(period.period_number, day);
                      return (
                        <div
                          key={`${day}-${period.id}`}
                          className={`border rounded-lg overflow-hidden ${cls ? 'shadow-sm' : 'border-dashed'}`}
                          onClick={() => cls && setSelectedClass(cls)}
                        >
                          <div className="bg-gray-50 py-1 px-2 text-xs font-medium">
                            {period.start} - {period.end}
                          </div>
                          <div className="p-2">
                            {cls ? (
                              <div className={`p-2 rounded-md ${getSubjectBg(cls.subject)} text-white`}>
                                <div className="font-medium text-sm">{cls.subject}</div>
                                <div className="text-xs text-white/90 mt-1 flex items-center">
                                  <Users className="w-3 h-3 mr-1" />
                                  {cls.teacher_name || 'TBD'}
                                </div>
                                {cls.room && (
                                  <div className="text-xs text-white/80 flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {cls.room}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-xs text-gray-400 h-12 flex items-center justify-center">
                                No class scheduled
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white/95 rounded-lg p-4 shadow-inner">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left font-medium text-gray-500">Time</th>
                {days.map((day) => (
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
              {periods.map((period) => (
                <tr key={period.id} className="border-t">
                  <td className="p-3 text-sm font-medium whitespace-nowrap">
                    {period.start} - {period.end}
                  </td>
                  {days.map((day) => {
                    const cls = getClassDetails(period.period_number, day);
                    return (
                      <td
                        key={`${day}-${period.id}`}
                        className="p-3 border-l"
                        onClick={() => cls && setSelectedClass(cls)}
                      >
                        {cls ? (
                          <div className={`p-2 rounded-md ${getSubjectBg(cls.subject)} text-white cursor-pointer hover:shadow-md transition-shadow`}>
                            <div className="font-medium text-sm">{cls.subject}</div>
                            <div className="text-xs text-white/90 mt-1 flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {cls.teacher_name || 'TBD'}
                            </div>
                            {cls.room && (
                              <div className="text-xs text-white/80 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {cls.room}
                              </div>
                            )}
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

  if (loading) {
    return (
      <div className="relative">
        <BackgroundPattern />
        <div className="relative z-10 min-h-[300px] md:min-h-[500px] bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg flex items-center justify-center">
          <div className="text-amber-200">Loading schedule...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative">
        <BackgroundPattern />
        <div className="relative z-10 min-h-[300px] md:min-h-[500px] bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg flex items-center justify-center">
          <div className="text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  const noSchedule = scheduleData.days.length === 0;

  return (
    <div className="relative">
      <BackgroundPattern />

      <div className="relative z-10 bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg p-4 md:p-6 shadow-xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-amber-200 flex items-center">
            <Calendar className="w-5 h-5 md:w-6 md:h-6 mr-1 md:mr-2" />
            Class Schedule
          </h2>

          <div className="flex gap-2 w-full md:w-auto">
            <select
              className="bg-gray-700 text-gray-200 rounded-md border border-gray-600 text-sm p-1 outline-none focus:ring-2 focus:ring-amber-300"
              value={currentBatch}
              onChange={(e) => setCurrentBatch(e.target.value)}
            >
              {batchList.length === 0 && <option value="">No batches found</option>}
              {batchList.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
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

        {/* Print styles */}
        <style jsx global>{`
          @media print {
            body * { visibility: hidden; }
            .bg-gray-800\\/80, .bg-gray-800\\/80 * {
              visibility: visible;
              background-color: white !important;
              color: black !important;
              border-color: #ddd !important;
            }
            .bg-gray-800\\/80 { position: absolute; left: 0; top: 0; width: 100%; }
            button, .backdrop-blur-sm { display: none !important; }
            .text-amber-200, .text-amber-300 { color: black !important; }
            th, td { border: 1px solid #ddd !important; padding: 8px !important; }
            [class*="bg-"] { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}</style>

        {/* Class Details Modal */}
        {selectedClass && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedClass(null)}
          >
            <div
              className="bg-gray-800 p-4 md:p-6 rounded-lg max-w-md w-full border border-gray-600 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`w-full h-1 ${getSubjectBg(selectedClass.subject)} rounded-full mb-3 md:mb-4`}></div>
              <h3 className={`text-lg md:text-xl font-semibold mb-4 ${getSubjectText(selectedClass.subject)}`}>{selectedClass.subject}</h3>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Users className={`w-4 h-4 ${getSubjectText(selectedClass.subject)}`} />
                  <span className="text-gray-200">Teacher: {selectedClass.teacher_name || 'To be assigned'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${getSubjectText(selectedClass.subject)}`} />
                  <span className="text-gray-200">Time: {selectedClass.start} – {selectedClass.end}</span>
                </div>
                {selectedClass.room && (
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${getSubjectText(selectedClass.subject)}`} />
                    <span className="text-gray-200">Room: {selectedClass.room}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors text-sm"
                  onClick={() => setSelectedClass(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No data message */}
        {noSchedule ? (
          <div className="bg-white/95 rounded-lg p-8 shadow-inner flex items-center justify-center">
            <div className="text-gray-500 text-center">
              {batchList.length === 0
                ? 'No batches configured yet. Please add Batch TE records.'
                : 'No timetable slots found for this batch.'}
            </div>
          </div>
        ) : (
          <>
            {/* Day + time block selectors */}
            <div className="mb-4 md:mb-6">
              <div className="hidden md:flex md:flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
                <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                  {scheduleData.days.map((day) => (
                    <button
                      key={day}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${selectedDay === day ? 'bg-amber-300 text-gray-900' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                      onClick={() => setSelectedDay(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-2 lg:mt-0">
                  {timeBlocks.map((block) => (
                    <button
                      key={block.id}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${selectedTimeBlock === block.id ? 'bg-amber-300 text-gray-900' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                      onClick={() => setSelectedTimeBlock(block.id)}
                    >
                      {block.id === 'all' ? block.name : <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{block.name}</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:hidden space-y-3">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 -mx-4 px-4">
                  {scheduleData.days.map((day) => (
                    <button
                      key={day}
                      className={`px-3 py-2 text-xs rounded-md transition-colors whitespace-nowrap flex-shrink-0 ${selectedDay === day ? 'bg-amber-300 text-gray-900' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                      onClick={() => setSelectedDay(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <select
                  className="bg-gray-700 text-gray-200 rounded-md border border-gray-600 p-2 text-sm outline-none focus:ring-2 focus:ring-amber-300 w-full"
                  value={selectedTimeBlock}
                  onChange={(e) => setSelectedTimeBlock(e.target.value)}
                >
                  {timeBlocks.map((block) => (
                    <option key={block.id} value={block.id}>{block.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* View mode switcher */}
            <div className="transition-all duration-300 ease-in-out">
              <div className="flex justify-end mb-3 md:mb-4">
                <div className="flex border border-gray-700 rounded-md overflow-hidden">
                  <button
                    className={`px-2 md:px-3 py-1 text-xs md:text-sm ${viewMode === 'daily' ? 'bg-amber-300 text-gray-900' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                    onClick={() => setViewMode('daily')}
                  >
                    {isMobile ? 'Daily' : 'Daily View'}
                  </button>
                  <button
                    className={`px-2 md:px-3 py-1 text-xs md:text-sm ${viewMode === 'weekly' ? 'bg-amber-300 text-gray-900' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                    onClick={() => setViewMode('weekly')}
                  >
                    {isMobile ? 'Weekly' : 'Weekly View'}
                  </button>
                </div>
              </div>

              {viewMode === 'daily' ? renderDailySchedule() : renderWeeklySchedule()}

              {/* Subject legend */}
              {subjects.length > 0 && (
                <div className="bg-white/95 rounded-lg p-3 md:p-4 mt-3 md:mt-4 shadow-inner">
                  <h3 className="text-base md:text-lg font-medium text-gray-800 mb-2 md:mb-3">Subject Legend</h3>
                  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-1 md:gap-2">
                    {subjects.map((subject) => (
                      <div key={subject.name} className="flex items-center p-1 rounded hover:bg-gray-100">
                        <div className={`w-3 h-3 md:w-4 md:h-4 rounded ${getSubjectBg(subject.name)} mr-1 md:mr-2`}></div>
                        <span className="text-xs md:text-sm">{subject.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClassSchedule;
