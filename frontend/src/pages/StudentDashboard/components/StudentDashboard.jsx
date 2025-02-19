// src/pages/StudentDashboard/components/StudentDashboard.jsx
import React, { useState } from 'react';
import { Notifications } from './Notifications';
import { GoalsTracker } from './GoalsTracker';
import { StudyTimeTracker } from './StudyTimeTracker';
import { LearningResources } from './LearningResources';
import { UpcomingEvents } from './UpcomingEvents';
import { TeacherFeedback } from './TeacherFeedback';
import {   
  LineChart, Line, BarChart, Bar, PieChart, Pie, RadarChart, Radar,  
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,  
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell, RadialBarChart, RadialBar  
} from 'recharts';  
import {   
  Calendar, Book, BookOpen, Award, Clock, Bell, FileText,   
  DollarSign, Activity, HelpCircle, User, MapPin, Mail, Phone,  
  CheckCircle, XCircle, MessageCircle, Clipboard, Heart  
} from 'lucide-react';

export const StudentDashboard = () => {  
  const [activeTab, setActiveTab] = useState('overview');  
    
  // Mock data  
  const studentInfo = {  
    name: "Ansir Nihal",  
    grade: "7th Grade",  
    section: "Section A",  
    teachers: ["Mr. Shafi Sa'adi (Faith Advisor)", "Mr. Khalandar Sihan Saquafi (Islamic Studies)"],  
    schoolYear: "2024-2025",  
    semester: "Spring Semester",  
    contactInfo: {  
      email: "aisha.ahmed@student.edu",  
      phone: "(555) 123-4567",  
      address: "123 Learning Lane, Education City"  
    }  
  };

  // Academic Progress Data  
  const gradeData = [  
    { subject: 'Mathematics', grade: 92, national: 78 },  
    { subject: 'Science', grade: 88, national: 75 },  
    { subject: 'English', grade: 95, national: 82 },  
    { subject: 'History', grade: 85, national: 76 },  
    { subject: 'Art', grade: 97, national: 85 },  
    { subject: 'Physical Education', grade: 90, national: 88 },  
  ];  
    
  const quranProgressData = [  
    { name: 'Memorized', value: 15 },  
    { name: 'In Progress', value: 5 },  
    { name: 'Not Started', value: 94 },  
  ];  
    
  const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];  
    
  const attendanceData = [  
    { month: 'Sep', present: 20, absent: 2, late: 1 },  
    { month: 'Oct', present: 22, absent: 1, late: 0 },  
    { month: 'Nov', present: 21, absent: 0, late: 1 },  
    { month: 'Dec', present: 15, absent: 1, late: 0 },  
    { month: 'Jan', present: 21, absent: 0, late: 2 },  
    { month: 'Feb', present: 20, absent: 1, late: 1 },  
  ];  
    
  const behaviorData = [  
    { category: 'Participation', score: 85 },  
    { category: 'Teamwork', score: 90 },  
    { category: 'Respect', score: 95 },  
    { category: 'Responsibility', score: 80 },  
    { category: 'Discipline', score: 85 },  
    { category: 'Leadership', score: 75 },  
  ];  
    
  const homeworkCompletionData = [  
    { subject: 'Math', completed: 15, total: 15 },  
    { subject: 'Science', completed: 12, total: 14 },  
    { subject: 'English', completed: 18, total: 18 },  
    { subject: 'History', completed: 10, total: 12 },  
    { subject: 'Islamic Studies', completed: 16, total: 16 },  
  ];  
    
  const homeworkData = [  
    { id: 1, subject: 'Mathematics', title: 'Algebra Equations', dueDate: '02/25/2025', status: 'completed' },  
    { id: 2, subject: 'Science', title: 'Plant Cell Diagram', dueDate: '02/21/2025', status: 'pending' },  
    { id: 3, subject: 'English', title: 'Book Report', dueDate: '02/28/2025', status: 'pending' },  
    { id: 4, subject: 'Islamic Studies', title: 'Surah Memorization', dueDate: '02/22/2025', status: 'completed' },  
  ];

  const feeData = [  
    { month: 'September', amount: 850, status: 'Paid' },  
    { month: 'October', amount: 850, status: 'Paid' },  
    { month: 'November', amount: 850, status: 'Paid' },  
    { month: 'December', amount: 850, status: 'Paid' },  
    { month: 'January', amount: 850, status: 'Paid' },  
    { month: 'February', amount: 850, status: 'Pending' },  
  ];  
    
  const activityData = [  
    { name: 'Chess Club', day: 'Monday', time: '3:30 PM - 4:30 PM', role: 'Member' },  
    { name: 'Quran Competition', day: 'One-time', date: 'Mar 15, 2025', role: 'Participant' },  
    { name: 'Science Fair', day: 'One-time', date: 'Apr 10, 2025', role: 'Presenter' },  
    { name: 'Basketball Team', day: 'Wed & Fri', time: '4:00 PM - 5:30 PM', role: 'Team Member' },  
  ];

  const announcements = [  
    { id: 1, title: 'Parent-Teacher Conference', date: 'Mar 5, 2025', content: 'Annual parent-teacher conferences will be held from 1-6 PM.' },  
    { id: 2, title: 'Spring Break', date: 'Mar 22-30, 2025', content: 'School will be closed for spring break.' },  
    { id: 3, title: 'Ramadan Schedule', date: 'Starting Mar 10, 2025', content: 'Modified school hours during Ramadan will be 8 AM - 2 PM.' },  
  ];

  // Achievement percentage calculations  
  const calculateCompletion = (data) => {  
    const completed = data.reduce((acc, curr) => acc + curr.completed, 0);  
    const total = data.reduce((acc, curr) => acc + curr.total, 0);  
    return Math.round((completed / total) * 100);  
  };

  const homeworkCompletion = calculateCompletion(homeworkCompletionData);  
  const quranMemorization = Math.round((quranProgressData[0].value / 114) * 100);  
  const averageAttendance = Math.round(  
    (attendanceData.reduce((acc, curr) => acc + curr.present, 0) /   
    (attendanceData.reduce((acc, curr) => acc + curr.present + curr.absent + curr.late, 0))) * 100  
  );  
  const averageGrade = Math.round(  
    gradeData.reduce((acc, curr) => acc + curr.grade, 0) / gradeData.length  
  );

  const achievementData = [  
    { name: 'Homework', value: homeworkCompletion },  
    { name: 'Attendance', value: averageAttendance },  
    { name: 'Grades', value: averageGrade },  
    { name: 'Quran', value: quranMemorization },  
  ];

  const renderResourcesAndPlanning = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GoalsTracker />
        <StudyTimeTracker />
      </div>
      
      <LearningResources />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpcomingEvents />
        <TeacherFeedback />
      </div>
    </div>
  );

  // Tab rendering functions  
  const renderOverview = () => (  
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">  
      <div className="bg-white rounded-lg shadow-md p-6">  
        <div className="flex items-center space-x-4 mb-6">  
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">  
            {studentInfo.name.charAt(0)}  
          </div>  
          <div>  
            <h3 className="text-2xl font-bold text-gray-800">{studentInfo.name}</h3>  
            <p className="text-gray-600">{studentInfo.grade} - {studentInfo.section}</p>  
            <p className="text-gray-500 text-sm">{studentInfo.schoolYear} • {studentInfo.semester}</p>  
          </div>  
        </div>  
          
        <div className="space-y-3">  
          <div className="flex items-center">  
            <Mail className="w-5 h-5 text-gray-500 mr-2" />  
            <span className="text-gray-700">{studentInfo.contactInfo.email}</span>  
          </div>  
          <div className="flex items-center">  
            <Phone className="w-5 h-5 text-gray-500 mr-2" />  
            <span className="text-gray-700">{studentInfo.contactInfo.phone}</span>  
          </div>  
          <div className="flex items-center">  
            <MapPin className="w-5 h-5 text-gray-500 mr-2" />  
            <span className="text-gray-700">{studentInfo.contactInfo.address}</span>  
          </div>  
        </div>  
          
        <div className="mt-6">  
          <h4 className="font-semibold text-gray-700 mb-2">Teachers & Mentors</h4>  
          <ul className="space-y-2">  
            {studentInfo.teachers.map((teacher, idx) => (  
              <li key={idx} className="flex items-center">  
                <User className="w-4 h-4 text-blue-500 mr-2" />  
                <span className="text-gray-700">{teacher}</span>  
              </li>  
            ))}  
          </ul>  
        </div>

     </div>  
        
      <div className="bg-white rounded-lg shadow-md p-6">  
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Performance Indicators</h3>  
        <div className="h-64">  
          <ResponsiveContainer width="100%" height="100%">  
            <RadialBarChart   
              cx="50%"   
              cy="50%"   
              innerRadius="20%"   
              outerRadius="80%"   
              data={achievementData}   
              startAngle={180}   
              endAngle={0}  
            >  
              <RadialBar  
                label={{ fill: '#666', position: 'insideStart' }}  
                background  
                dataKey="value"  
              >  
                {achievementData.map((entry, index) => (  
                  <Cell key={`cell-${index}`} fill={['#4299E1', '#48BB78', '#F6AD55', '#667EEA'][index % 4]} />  
                ))}  
              </RadialBar>  
              <Legend   
                iconSize={10}   
                layout="vertical"   
                verticalAlign="middle"   
                align="right"  
                wrapperStyle={{ fontSize: '12px' }}  
              />  
              <Tooltip />  
            </RadialBarChart>  
          </ResponsiveContainer>  
        </div>  
          
        <div className="grid grid-cols-2 gap-4 mt-4">  
          <div className="bg-blue-50 p-4 rounded-lg">  
            <div className="flex justify-between items-start">  
              <div>  
                <h4 className="font-medium text-gray-800">March Tuition</h4>  
                <p className="text-sm text-gray-600 mt-1">Due date: March 25, 2025</p>  
              </div>  
              <span className="text-lg font-bold text-gray-800">$850</span>  
            </div>  
          </div>  
            
          <div className="mt-8">  
            <h4 className="font-semibold text-gray-700 mb-3">Payment Methods</h4>  
            <div className="space-y-2">  
              <div className="flex items-center p-3 border rounded-lg">  
                <input type="radio" name="payment" id="card1" className="mr-3" defaultChecked />  
                <label htmlFor="card1" className="flex-1 text-sm">Visa ending in 4582</label>  
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Default</span>  
              </div>  
              <div className="flex items-center p-3 border rounded-lg">  
                <input type="radio" name="payment" id="card2" className="mr-3" />  
                <label htmlFor="card2" className="text-sm">Mastercard ending in 1237</label>  
              </div>  
              <button className="text-sm text-blue-600 mt-2 flex items-center">  
                + Add payment method  
              </button>  
            </div>  
          </div>  
        </div>  
        <div className="mt-6">
            <Notifications />
            </div>
      </div>  
    </div>  

    
  );

  const renderAcademic = () => (  
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">  
      <div className="bg-white rounded-lg shadow-md p-6">  
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Subject Performance</h3>  
        <div className="h-64">  
          <ResponsiveContainer width="100%" height="100%">  
            <LineChart  
              data={[  
                {month: 'Sep', Math: 88, Science: 82, English: 90, History: 78, Art: 92},  
                {month: 'Oct', Math: 85, Science: 86, English: 92, History: 80, Art: 94},  
                {month: 'Nov', Math: 90, Science: 84, English: 88, History: 82, Art: 90},  
                {month: 'Dec', Math: 92, Science: 90, English: 94, History: 85, Art: 96},  
                {month: 'Jan', Math: 90, Science: 88, English: 95, History: 84, Art: 95},  
                {month: 'Feb', Math: 92, Science: 88, English: 95, History: 85, Art: 97},  
              ]}  
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}  
            >  
              <CartesianGrid strokeDasharray="3 3" />  
              <XAxis dataKey="month" />  
              <YAxis domain={[70, 100]} />  
              <Tooltip />  
              <Legend />  
              <Line type="monotone" dataKey="Math" stroke="#3182CE" strokeWidth={2} dot={{ r: 4 }} />  
              <Line type="monotone" dataKey="Science" stroke="#DD6B20" strokeWidth={2} dot={{ r: 4 }} />  
              <Line type="monotone" dataKey="English" stroke="#805AD5" strokeWidth={2} dot={{ r: 4 }} />  
              <Line type="monotone" dataKey="History" stroke="#38A169" strokeWidth={2} dot={{ r: 4 }} />  
              <Line type="monotone" dataKey="Art" stroke="#E53E3E" strokeWidth={2} dot={{ r: 4 }} />  
            </LineChart>  
          </ResponsiveContainer>  
        </div>  
      </div>  
        
      <div className="bg-white rounded-lg shadow-md p-6">  
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Test Results Distribution</h3>  
        <div className="h-64 flex items-center justify-center">  
          <ResponsiveContainer width="100%" height="100%">  
            <PieChart>  
              <Pie  
                data={[  
                  { name: 'A (90-100%)', value: 8, fill: '#48BB78' },  
                  { name: 'B (80-89%)', value: 5, fill: '#4299E1' },  
                  { name: 'C (70-79%)', value: 2, fill: '#ECC94B' },  
                  { name: 'D (60-69%)', value: 0, fill: '#F6AD55' },  
                  { name: 'F (Below 60%)', value: 0, fill: '#F56565' },  
                ]}  
                cx="50%"  
                cy="50%"  
                outerRadius={80}  
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}  
                labelLine={false}  
                dataKey="value"  
              />  
              <Tooltip />  
            </PieChart>  
          </ResponsiveContainer>  
        </div>  
      </div>  
        
      <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">  
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Homework & Assignments</h3>  
        <div className="mb-6">  
          <div className="h-16">  
            <ResponsiveContainer width="100%" height="100%">  
              <BarChart  
                data={homeworkCompletionData}  
                layout="vertical"  
                margin={{ top: 5, right: 30, left: 70, bottom: 5 }}  
              >  
                <CartesianGrid strokeDasharray="3 3" />  
                <XAxis type="number" domain={[0, 20]} />  
                <YAxis type="category" dataKey="subject" />  
                <Tooltip />  
                <Legend />  
                <Bar dataKey="completed" fill="#4F46E5" name="Completed" />  
                <Bar dataKey="total" fill="#E5E7EB" name="Total Assigned" />  
              </BarChart>  
            </ResponsiveContainer>  
          </div>  
        </div>  
          
        <div className="mt-6">  
          <div className="flex justify-between items-center mb-4">  
            <h4 className="font-semibold text-gray-700">Current Assignments</h4>  
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">  
              {homeworkData.filter(h => h.status === 'pending').length} pending  
            </span>  
          </div>  
          <div className="overflow-x-auto">  
            <table className="min-w-full divide-y divide-gray-200">  
              <thead>  
                <tr>  
                  <th className="px-3 py-3 bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">Subject</th>  
                  <th className="px-3 py-3 bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">Assignment</th>  
                  <th className="px-3 py-3 bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">Due Date</th>  
                  <th className="px-3 py-3 bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>  
                </tr>  
              </thead>  
              <tbody className="bg-white divide-y divide-gray-200">  
                {homeworkData.map((homework) => (  
                  <tr key={homework.id}>  
                    <td className="px-3 py-2">  
                      <span className="text-sm font-medium text-gray-900">{homework.subject}</span>  
                    </td>  
                    <td className="px-3 py-2">  
                      <span className="text-sm text-gray-700">{homework.title}</span>  
                    </td>  
                    <td className="px-3 py-2">  
                      <span className="text-sm text-gray-700">{homework.dueDate}</span>  
                    </td>  
                    <td className="px-3 py-2">  
                      {homework.status === 'completed' ? (  
                        <span className="inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 px-2 py-1">  
                          <CheckCircle className="w-4 h-4 mr-1" /> Completed  
                        </span>  
                      ) : (  
                        <span className="inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800 px-2 py-1">  
                          <Clock className="w-4 h-4 mr-1" /> Pending  
                        </span>  
                      )}  
                    </td>  
                  </tr>  
                ))}  
              </tbody>  
            </table>  
          </div>  
        </div>  
      </div>  
    </div>  
  );

  const renderAttendance = () => (  
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">  
      <div className="bg-white rounded-lg shadow-md p-6">  
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Attendance Summary</h3>  
        <div className="h-64">  
          <ResponsiveContainer width="100%" height="100%">  
            <BarChart  
              data={attendanceData}  
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}  
            >  
              <CartesianGrid strokeDasharray="3 3" />  
              <XAxis dataKey="month" />  
              <YAxis />  
              <Tooltip />  
              <Legend />  
              <Bar dataKey="present" fill="#48BB78" name="Present" />  
              <Bar dataKey="absent" fill="#F56565" name="Absent" />  
              <Bar dataKey="late" fill="#ECC94B" name="Late" />  
            </BarChart>  
          </ResponsiveContainer>  
        </div>  
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Weekly Schedule</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-2 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Monday</th>
                <th className="px-2 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Tuesday</th>
                <th className="px-2 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Wednesday</th>
                <th className="px-2 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Thursday</th>
                <th className="px-2 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Friday</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-xs">
              <tr>
                <td className="px-2 py-2 font-medium">8:00 - 8:45</td>
                <td className="px-2 py-2 bg-blue-50">Mathematics</td>
                <td className="px-2 py-2 bg-purple-50">English</td>
                <td className="px-2 py-2 bg-blue-50">Mathematics</td>
                <td className="px-2 py-2 bg-purple-50">English</td>
                <td className="px-2 py-2 bg-green-50">Quran</td>
              </tr>
              <tr>
                <td className="px-2 py-2 font-medium">8:50 - 9:35</td>
                <td className="px-2 py-2 bg-purple-50">English</td>
                <td className="px-2 py-2 bg-orange-50">Science</td>
                <td className="px-2 py-2 bg-indigo-50">History</td>
                <td className="px-2 py-2 bg-orange-50">Science</td>
                <td className="px-2 py-2 bg-blue-50">Mathematics</td>
              </tr>
              <tr>
                <td className="px-2 py-2 font-medium">9:40 - 10:25</td>
                <td className="px-2 py-2 bg-orange-50">Science</td>
                <td className="px-2 py-2 bg-indigo-50">History</td>
                <td className="px-2 py-2 bg-teal-50">Islamic Studies</td>
                <td className="px-2 py-2 bg-indigo-50">Geography</td>
                <td className="px-2 py-2 bg-orange-50">Science</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>  
  );  

  const renderIslamic = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quran Memorization Progress</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={quranProgressData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {quranProgressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
          
        <div className="mt-6">
          <h4 className="font-semibold text-gray-700 mb-2">Recently Memorized Surahs</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <span className="text-sm">Surah Al-Mulk</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Excellent</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <span className="text-sm">Surah Al-Qalam</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Very Good</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <span className="text-sm">Surah Al-Haqqah</span>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Good</span>
            </div>
          </div>
        </div>
      </div>
        
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Islamic Studies Performance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[
                {month: 'Sep', Fiqh: 85, History: 82, Aqeedah: 88, Tajweed: 80},
                {month: 'Oct', Fiqh: 87, History: 84, Aqeedah: 86, Tajweed: 83},
                {month: 'Nov', Fiqh: 86, History: 88, Aqeedah: 90, Tajweed: 85},
                {month: 'Dec', Fiqh: 90, History: 85, Aqeedah: 92, Tajweed: 87},
                {month: 'Jan', Fiqh: 92, History: 90, Aqeedah: 91, Tajweed: 90},
                {month: 'Feb', Fiqh: 93, History: 92, Aqeedah: 94, Tajweed: 91},
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[70, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Fiqh" stroke="#805AD5" strokeWidth={2} />
              <Line type="monotone" dataKey="History" stroke="#DD6B20" strokeWidth={2} />
              <Line type="monotone" dataKey="Aqeedah" stroke="#3182CE" strokeWidth={2} />
              <Line type="monotone" dataKey="Tajweed" stroke="#38A169" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // Main render function with tabs
  return (
        <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's {studentInfo.name}'s latest progress.</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last updated</p>
                <p className="text-sm font-medium">February 19, 2025, 10:30 AM</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm transition">
                Download Report
              </button>
            </div>
          </div>
        </div>
          
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
          <div className="flex p-1 min-w-max">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                activeTab === 'overview' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('academic')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                activeTab === 'academic' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Academic Progress
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                activeTab === 'attendance' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Attendance
            </button>
            <button
              onClick={() => setActiveTab('islamic')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                activeTab === 'islamic' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Islamic Studies
            </button>
            <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                activeTab === 'resources' 
                ? 'bg-blue-100 text-blue-800' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            >
            Resources & Planning
            </button>
          </div>
        </div>
          
        {/* Content based on active tab */}
        <div className="mb-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'academic' && renderAcademic()}
          {activeTab === 'attendance' && renderAttendance()}
          {activeTab === 'islamic' && renderIslamic()}
          {activeTab === 'resources' && renderResourcesAndPlanning()}
        </div>
          
        {/* Footer */}
        {/* <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2025 TechEthica Education. All rights reserved.
            </p>
            <div className="mt-2 md:mt-0 flex space-x-4">
              <button className="text-sm text-gray-600 hover:text-gray-800">Privacy Policy</button>
              <button className="text-sm text-gray-600 hover:text-gray-800">Terms of Service</button>
              <button className="text-sm text-gray-600 hover:text-gray-800">Contact Us</button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default StudentDashboard;