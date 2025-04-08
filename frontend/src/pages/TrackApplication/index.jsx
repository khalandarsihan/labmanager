// frontend/src/pages/TrackApplication/index.jsx
import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, FileText, Calendar, MessageSquare, 
  Clock, CheckCircle, AlertCircle, User, BookOpen, MapPin, Video
} from 'lucide-react';
import BackgroundPattern from '@/components/ui/BackgroundPattern';
import DocumentUpload from './DocumentUpload';
import { useToast } from '@/components/ui/toast';
import { useTheme } from '@/components/ui/ThemeContext';

const TrackApplication = ({ initialRegistrationId }) => {
  const { useLightTheme, themeStyles } = useTheme();
  const [registrationId, setRegistrationId] = useState(initialRegistrationId || '');
  const [statusData, setStatusData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');
  const { toast, Toaster } = useToast();
  
  // Check for registration ID in localStorage (for newly registered students)
  useEffect(() => {
    // If initialRegistrationId is provided, use it immediately
    if (initialRegistrationId) {
      setRegistrationId(initialRegistrationId);
      fetchData(initialRegistrationId);
    } 
    // Otherwise check localStorage (for newly registered students)
    else {
      const storedId = localStorage.getItem('registration_id');
      if (storedId) {
        setRegistrationId(storedId);
        fetchData(storedId);
      }
    }
  }, [initialRegistrationId]);
  
  // Apply theme-based styles
  const cardBg = useLightTheme 
    ? "border-purple-200/50 bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50"
    : "border-gray-700/50 bg-gradient-to-r from-gray-900 via-gray-800 to-[#444444]";
    
  const headerText = useLightTheme
    ? "text-purple-700"
    : "text-amber-300";
    
  const bodyText = useLightTheme
    ? "text-gray-700"
    : "text-gray-300";
    
  const inputBg = useLightTheme
    ? "bg-white border-purple-300 border-2 text-gray-800 focus:border-purple-400 placeholder-gray-500"
    : "bg-white border-amber-300 border-2 text-gray-800 focus:border-amber-300 placeholder-gray-500";
    
  const buttonPrimary = useLightTheme
    ? "bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200"
    : "bg-amber-300 text-gray-900 hover:bg-amber-400 transition-all duration-200";
    
  const sectionBg = useLightTheme
    ? "bg-purple-50/80 border-purple-200/50"
    : "bg-gray-700/30 border-gray-700/50";

  const iconColor = useLightTheme
    ? "text-purple-500"
    : "text-amber-300";
    
  const tabsStyle = useLightTheme
    ? "bg-gray-100 rounded-t-lg border border-gray-300"
    : "bg-gray-800 rounded-t-lg border border-gray-700";
    
  const tabTriggerStyle = useLightTheme
    ? "text-gray-700 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
    : "text-gray-400 data-[state=active]:bg-amber-300 data-[state=active]:text-gray-900";
  
  // Use a direct fetch instead of useFrappeGetCall to have more control
  // Modified fetchData function for TrackApplication
  const fetchData = async (id) => {
    if (!id) {
      setError('Please enter a registration ID');
      return;
    }
    
    setIsSearching(true);
    setError(null);
    
    try {
      console.log('Fetching data for ID:', id);
      
      // Use a direct fetch call
      const response = await fetch(`/api/method/labmanager.api.api.get_application_status?registration_id=${id}`);
      const data = await response.json();
      
      console.log('API response:', data);
      
      // Frappe wraps the response in a message property
      if (data && data.message) {
        // Check if the API returns an explicit error status
        if (data.message.status === "error") {
          setError(data.message.message || 'Failed to retrieve application status');
        } 
        // If response contains success status and data property (new format)
        else if (data.message.status === "success" && data.message.data) {
          // Set the data from the nested data property
          setStatusData(data.message.data);
          
          // Set active tab based on status
          if (data.message.data.current_status === 'Documents Requested') {
            setActiveTab('documents');
          } else if (data.message.data.current_status === 'Interview Scheduled') {
            setActiveTab('interviews');
          } else {
            setActiveTab('timeline');
          }
        }
        // Handle legacy format where all data is at the top level of message
        else if (data.message.registration_id) {
          // Set the data directly
          setStatusData(data.message);
          
          // Set active tab based on status
          if (data.message.current_status === 'Documents Requested') {
            setActiveTab('documents');
          } else if (data.message.current_status === 'Interview Scheduled') {
            setActiveTab('interviews');
          } else {
            setActiveTab('timeline');
          }
        }
        else {
          setError('Failed to retrieve application status. Invalid response format.');
        }
      } else {
        setError('Failed to retrieve application status. Invalid response format.');
      }
    } catch (err) {
      console.error('Error fetching application status:', err);
      setError('An error occurred while retrieving your application status');
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSearch = () => {
    fetchData(registrationId);
  };
  
  const handleDocumentUpload = async (documentType, preventTabSwitch = false) => {
    // Keep track of the current tab
    const currentTab = activeTab;
    
    // Reload the data after document upload
    await fetchData(registrationId);
    
    // Only switch tabs if not prevented (for replacements)
    if (!preventTabSwitch) {
      toast({
        title: "Document Uploaded",
        description: `${documentType} was uploaded successfully`,
      });
    } else {
      // For document replacement, keep the current tab
      setActiveTab(currentTab);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };
  
  // Function to render status badge with appropriate color
  const renderStatusBadge = (status) => {
    let className = '';
    
    switch(status) {
      case 'Submitted':
        className = 'bg-blue-600';
        break;
      case 'Under Review':
        className = 'bg-amber-600';
        break;
      case 'Documents Requested':
        className = 'bg-purple-600';
        break;
      case 'Interview Scheduled':
        className = 'bg-indigo-600';
        break;
      case 'Accepted':
        className = 'bg-emerald-600';
        break;
      case 'Waitlisted':
        className = 'bg-orange-600';
        break;
      case 'Rejected':
        className = 'bg-red-600';
        break;
      default:
        className = 'bg-gray-600';
    }
    
    return (
      <Badge className={`${className} text-white`}>
        {status}
      </Badge>
    );
  };
  
  // Render progress indicator based on status
  const renderProgressIndicator = () => {
    const statuses = [
      'Submitted',
      'Documents Requested',
      'Under Review',
      'Interview Scheduled',
      'Accepted',
      'Waitlisted',
      'Rejected'
    ];
    
    const currentStatusIndex = statusData ? 
      statuses.indexOf(statusData.current_status) : 0;
    
    // Don't render progress for rejected or waitlisted applications
    if (statusData && (statusData.current_status === 'Rejected' || statusData.current_status === 'Waitlisted')) {
      return null;
    }
    
    const progressColor = useLightTheme ? "bg-purple-600" : "bg-amber-300";
    const numberColor = useLightTheme 
      ? "bg-purple-600 text-white" 
      : "bg-amber-300 text-gray-900";
    const inactiveColor = useLightTheme
      ? "bg-gray-300 text-gray-600"
      : "bg-gray-700 text-gray-400";
    
    return (
      <div className="w-full mb-6">
        <div className="flex justify-between mb-2">
          {statuses.slice(0, 5).map((status, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${index <= currentStatusIndex ? numberColor : inactiveColor}`}>
                {index + 1}
              </div>
              <div className={`text-xs mt-1 text-center max-w-[70px] ${useLightTheme ? 'text-gray-700' : 'text-gray-400'}`}>
                {status}
              </div>
            </div>
          ))}
        </div>
        <div className={`relative h-1 ${useLightTheme ? 'bg-gray-300' : 'bg-gray-700'} mt-2`}>
          <div 
            className={`absolute h-1 ${progressColor}`} 
            style={{ width: `${Math.min(100, (currentStatusIndex / 4) * 100)}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Render content based on application status
  const renderStatusSpecificContent = () => {
    if (!statusData) return null;
    
    const alertBgColor = useLightTheme ? {
      documents: "bg-amber-100 border-amber-300",
      interview: "bg-indigo-100 border-indigo-300",
      accepted: "bg-emerald-100 border-emerald-300",
      waitlisted: "bg-orange-100 border-orange-300",
      rejected: "bg-red-100 border-red-300"
    } : {
      documents: "bg-purple-900/30 border-purple-700/50",
      interview: "bg-indigo-900/30 border-indigo-700/50",
      accepted: "bg-emerald-900/30 border-emerald-700/50",
      waitlisted: "bg-orange-900/30 border-orange-700/50",
      rejected: "bg-red-900/30 border-red-700/50"
    };
    
    const alertTextColor = useLightTheme ? {
      documents: "text-purple-700",
      interview: "text-indigo-700",
      accepted: "text-emerald-700",
      waitlisted: "text-orange-700",
      rejected: "text-red-700"
    } : {
      documents: "text-purple-300",
      interview: "text-indigo-300",
      accepted: "text-emerald-300",
      waitlisted: "text-orange-300",
      rejected: "text-red-300"
    };
    
    const alertIconColor = useLightTheme ? {
      documents: "text-purple-500",
      interview: "text-indigo-500",
      accepted: "text-emerald-500",
      waitlisted: "text-orange-500",
      rejected: "text-red-500"
    } : {
      documents: "text-purple-400",
      interview: "text-indigo-400",
      accepted: "text-emerald-400",
      waitlisted: "text-orange-400",
      rejected: "text-red-400"
    };
    
    switch(statusData.current_status) {
      case 'Documents Requested':
        return (
          <div className={`${alertBgColor.documents} p-4 rounded-lg mb-6`}>
            <div className="flex items-start">
              <AlertCircle className={`w-5 h-5 ${alertIconColor.documents} mt-0.5 mr-2 flex-shrink-0`} />
              <div>
                <h3 className={`${alertTextColor.documents} font-medium mb-1`}>Document Request</h3>
                <p className={`${alertTextColor.documents} text-sm`}>
                  Please upload the requested documents as soon as possible to proceed with your application.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'Interview Scheduled':
        return (
          <div className={`${alertBgColor.interview} p-4 rounded-lg mb-6`}>
            <div className="flex items-start">
              <Calendar className={`w-5 h-5 ${alertIconColor.interview} mt-0.5 mr-2 flex-shrink-0`} />
              <div>
                <h3 className={`${alertTextColor.interview} font-medium mb-1`}>Interview Scheduled</h3>
                <p className={`${alertTextColor.interview} text-sm`}>
                  You have an upcoming interview scheduled. Please check the Interviews tab for details.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'Accepted':
        return (
          <div className={`${alertBgColor.accepted} p-4 rounded-lg mb-6`}>
            <div className="flex items-start">
              <CheckCircle className={`w-5 h-5 ${alertIconColor.accepted} mt-0.5 mr-2 flex-shrink-0`} />
              <div>
                <h3 className={`${alertTextColor.accepted} font-medium mb-1`}>Congratulations!</h3>
                <p className={`${alertTextColor.accepted} text-sm`}>
                  Your application has been accepted. Please complete the enrollment process as outlined in the Next Steps tab.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'Waitlisted':
        return (
          <div className={`${alertBgColor.waitlisted} p-4 rounded-lg mb-6`}>
            <div className="flex items-start">
              <Clock className={`w-5 h-5 ${alertIconColor.waitlisted} mt-0.5 mr-2 flex-shrink-0`} />
              <div>
                <h3 className={`${alertTextColor.waitlisted} font-medium mb-1`}>Application Waitlisted</h3>
                <p className={`${alertTextColor.waitlisted} text-sm`}>
                  Your application has been waitlisted. We will notify you if a spot becomes available.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'Rejected':
        return (
          <div className={`${alertBgColor.rejected} p-4 rounded-lg mb-6`}>
            <div className="flex items-start">
              <AlertCircle className={`w-5 h-5 ${alertIconColor.rejected} mt-0.5 mr-2 flex-shrink-0`} />
              <div>
                <h3 className={`${alertTextColor.rejected} font-medium mb-1`}>Application Not Approved</h3>
                <p className={`${alertTextColor.rejected} text-sm`}>
                  We regret to inform you that your application was not successful at this time. Please check the feedback section for more details.
                </p>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
 
  return (
    <div className="relative">
      <Toaster />
      <BackgroundPattern />
      
      <div className="max-w-4xl mx-auto py-12 px-4 relative z-10">
        <Card className={`${cardBg} backdrop-blur-sm`}>
          <CardHeader>
            <CardTitle className={`text-2xl font-bold text-center ${headerText}`}>
              <Calendar className={`w-6 h-6 inline-block mr-2 ${iconColor}`} />
              Track Your Application
            </CardTitle>
            <CardDescription className={`text-center ${useLightTheme ? 'text-purple-600/70' : 'text-amber-100/70'}`}>
              Enter your application reference number to check your application status
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Search Form */}
            <div className="mb-8">
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <Input
                    value={registrationId}
                    onChange={(e) => setRegistrationId(e.target.value)}
                    className={`pl-10 ${inputBg}`}
                    placeholder="Enter your registration ID (e.g., 2025-BCA-0303)"
                  />
                  <Search className={`w-5 h-5 absolute left-3 top-2.5 ${iconColor}`} />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className={buttonPrimary}
                >
                  {isSearching ? 'Searching...' : 'Track'}
                </Button>
              </div>
            </div>
            
            {/* Application Status Display */}
            {statusData && (
              <div className="space-y-6">
                {/* Application Summary */}
                <div className={`${sectionBg} rounded-lg p-4 backdrop-blur-sm border shadow-md`}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <h3 className={`text-lg font-semibold ${headerText}`}>Application Summary</h3>
                    {renderStatusBadge(statusData.current_status)}
                  </div>
                  
                  <dl className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${bodyText}`}>
                    <div>
                      <dt className={`${useLightTheme ? 'text-purple-400' : 'text-gray-400'} text-sm`}>Application ID</dt>
                      <dd className="flex items-center">
                        <FileText className={`w-4 h-4 mr-2 ${iconColor}`} />
                        {statusData.registration_id}
                      </dd>
                    </div>
                    <div>
                      <dt className={`${useLightTheme ? 'text-purple-400' : 'text-gray-400'} text-sm`}>Submission Date</dt>
                      <dd className="flex items-center">
                        <Calendar className={`w-4 h-4 mr-2 ${iconColor}`} />
                        {formatDate(statusData.submission_date)}
                      </dd>
                    </div>
                    <div>
                      <dt className={`${useLightTheme ? 'text-purple-400' : 'text-gray-400'} text-sm`}>Applicant Name</dt>
                      <dd className="flex items-center">
                        <User className={`w-4 h-4 mr-2 ${iconColor}`} />
                        {statusData.student_name}
                      </dd>
                    </div>
                    <div>
                      <dt className={`${useLightTheme ? 'text-purple-400' : 'text-gray-400'} text-sm`}>Program</dt>
                      <dd className="flex items-center">
                        <BookOpen className={`w-4 h-4 mr-2 ${iconColor}`} />
                        {statusData.program}
                      </dd>
                    </div>
                  </dl>
                </div>
                
                {/* Progress Indicator */}
                {renderProgressIndicator()}
                
                {/* Status-specific content */}
                {renderStatusSpecificContent()}
                
                {/* Detailed Information Tabs */}
                <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className={`w-full ${tabsStyle}`}>
                    <TabsTrigger value="timeline" className={tabTriggerStyle}>
                      Timeline
                    </TabsTrigger>
                    <TabsTrigger value="documents" className={tabTriggerStyle}>
                      Documents
                    </TabsTrigger>
                    <TabsTrigger value="interviews" className={tabTriggerStyle}>
                      Interviews
                    </TabsTrigger>
                    <TabsTrigger value="next-steps" className={tabTriggerStyle}>
                      Next Steps
                    </TabsTrigger>
                  </TabsList>
                  
                      {/* Timeline Tab */}
                      <TabsContent value="timeline" className="border-none p-0 mt-4">
                      <div className={`${useLightTheme ? 'bg-white border-purple-200' : 'bg-gray-800 border-gray-700'} border rounded-lg`}>
                      <div className="p-6">
                        {statusData.timeline && statusData.timeline.length > 0 ? (
                          <div className="relative">
                            {/* Timeline line */}
                            <div className={`absolute left-3.5 top-0 bottom-0 w-px ${useLightTheme ? 'bg-purple-200' : 'bg-gray-600'}`}></div>
                            
                            <div className="space-y-6">
                              {statusData.timeline.map((event, index) => (
                                <div key={index} className="relative pl-10">
                                  {/* Timeline dot */}
                                  <div className={`absolute left-0 top-1.5 w-8 h-8 rounded-full ${useLightTheme ? 'bg-white border-2 border-purple-400' : 'bg-gray-800 border-2 border-amber-400'} flex items-center justify-center`}>
                                    <Clock className={iconColor} />
                                  </div>
                                  
                                  <div className={`${cardBg} rounded-lg p-4 border shadow-md backdrop-blur-sm`}>
                                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
                                      <h4 className={`font-medium ${headerText}`}>{event.status}</h4>
                                      <span className={`text-sm ${useLightTheme ? 'text-gray-500' : 'text-gray-400'}`}>{formatDate(event.date)}</span>
                                    </div>
                                    <p className={`${bodyText} text-sm`}>{event.description}</p>
                                    <div className={`text-xs ${useLightTheme ? 'text-gray-500' : 'text-gray-400'} mt-2`}>
                                      Updated by: {event.created_by}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className={`text-center py-8 ${useLightTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                            <Clock className={`w-12 h-12 mx-auto mb-4 ${useLightTheme ? 'text-gray-400' : 'text-gray-600'}`} />
                            <p>No timeline events yet. Check back later for updates.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Documents Tab */}
                  <TabsContent value="documents" className="border-none p-0 mt-4">
                    <div className={`${useLightTheme ? 'bg-white border-purple-200' : 'bg-gray-800 border-gray-700'} border rounded-lg`}>
                      <div className="p-6">
                        {statusData.documents && statusData.documents.length > 0 ? (
                          <div className="space-y-4">
                            {statusData.documents.map((doc, index) => (
                              <DocumentUpload
                                key={index}
                                document={doc}
                                registrationId={statusData.registration_id}
                                onUploadSuccess={handleDocumentUpload}
                                useLightTheme={useLightTheme}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className={`text-center py-8 ${useLightTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                            <FileText className={`w-12 h-12 mx-auto mb-4 ${useLightTheme ? 'text-gray-400' : 'text-gray-600'}`} />
                            <p>No required documents at this time.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Interviews Tab */}
                  <TabsContent value="interviews" className="border-none p-0 mt-4">
                    <div className={`${useLightTheme ? 'border-purple-200/50 bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50' : 'border-gray-700/50 bg-gradient-to-r from-gray-900 via-gray-800 to-[#444444]'} border rounded-lg`}>
                      <div className="p-6">
                        {statusData.interviews && statusData.interviews.length > 0 ? (
                          <div className="space-y-4">
                            {statusData.interviews.map((interview, index) => (
                              <div key={index} className={`${sectionBg} rounded-lg p-4 backdrop-blur-sm border`}>
                                <div className="flex justify-between items-start mb-3">
                                  <h4 className={`font-medium ${headerText}`}>Interview {index + 1}</h4>
                                  <Badge className={
                                    interview.status === 'Scheduled' ? 'bg-blue-600' :
                                    interview.status === 'Completed' ? 'bg-emerald-600' :
                                    interview.status === 'Missed' ? 'bg-red-600' :
                                    'bg-gray-600'
                                  }>
                                    {interview.status}
                                  </Badge>
                                </div>
                                
                                <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 text-sm ${bodyText}`}>
                                  <div className="flex items-center">
                                    <Calendar className={`w-4 h-4 mr-2 ${iconColor}`} />
                                    <span>Date: {formatDate(interview.date)}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className={`w-4 h-4 mr-2 ${iconColor}`} />
                                    <span>Time: {formatTime(interview.time)}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <User className={`w-4 h-4 mr-2 ${iconColor}`} />
                                    <span>Interviewer: {interview.interviewer}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className={`w-4 h-4 mr-2 ${iconColor}`} />
                                    <span>Location: {interview.location}</span>
                                  </div>
                                </div>
                                
                                {interview.notes && (
                                  <div className={`mt-3 text-sm ${bodyText} ${useLightTheme ? 'bg-purple-50' : 'bg-gray-700'} p-3 rounded-md`}>
                                    <MessageSquare className={`w-4 h-4 inline-block mr-2 ${iconColor}`} />
                                    {interview.notes}
                                  </div>
                                )}
                                
                                {/* Join interview button (only shown if online and within 15 minutes of start time) */}
                                {interview.status === 'Scheduled' &&
                                interview.location && interview.location.toLowerCase().includes('online') && (
                                  <div className="mt-4">
                                    <Button className={buttonPrimary}>
                                      <Video className="w-4 h-4 mr-2" />
                                      Join Interview
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className={`text-center py-8 ${useLightTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                            <Calendar className={`w-12 h-12 mx-auto mb-4 ${useLightTheme ? 'text-gray-400' : 'text-gray-600'}`} />
                            <p>No interviews have been scheduled yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                    </TabsContent>
                    {/* Next Steps Tab */}
                <TabsContent value="next-steps" className="border-none p-0 mt-4">
                  <div className={`${useLightTheme ? 'border-purple-200/50 bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50' : 'border-gray-700/50 bg-gradient-to-r from-gray-900 via-gray-800 to-[#444444]'} border rounded-lg`}>
                    <div className="p-6">
                      {statusData.next_steps ? (
                        <div>
                          <h3 className={`text-lg font-semibold ${headerText} mb-4`}>Your Next Steps</h3>
                          <div className={`${sectionBg} rounded-lg p-4 border shadow-md ${bodyText} whitespace-pre-line`}>
                            {statusData.next_steps}
                          </div>
                          
                          {statusData.feedback && (
                            <div className="mt-6">
                              <h4 className={`text-md font-semibold ${headerText} mb-2`}>Feedback from Admissions Team</h4>
                              <div className={`${sectionBg} rounded-lg p-4 border shadow-md ${bodyText} whitespace-pre-line`}>
                                {statusData.feedback}
                              </div>
                            </div>
                          )}
                          
                          {/* Show enrollment button for accepted applications */}
                          {statusData.current_status === 'Accepted' && (
                            <div className="mt-6 text-center">
                              <Button
                                className={useLightTheme ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"}
                                onClick={() => window.location.href = '/enroll?id=' + statusData.registration_id}
                              >
                                Complete Enrollment
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={`text-center py-8 ${useLightTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                          <MessageSquare className={`w-12 h-12 mx-auto mb-4 ${useLightTheme ? 'text-gray-400' : 'text-gray-600'}`} />
                          <p>No specific next steps have been provided yet.</p>
                          <p className="mt-2 text-sm">General next steps:</p>
                          <ul className="text-sm mt-2 list-disc list-inside">
                            <li>Keep an eye on your email for updates from our admissions team</li>
                            <li>Ensure your contact information is up to date</li>
                            <li>Check back here regularly for status updates</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {/* Error Display */}
          {error && !statusData && (
            <div className={`${useLightTheme ? 'bg-red-100 text-red-800 border-red-300' : 'bg-red-900/30 text-red-300 border-red-800/50'} rounded-lg p-4 mt-4 border`}>
              <AlertCircle className="w-5 h-5 inline-block mr-2" />
              {error}
            </div>
          )}
          
          {!statusData && !error && (
            <div className={`text-center py-8 ${useLightTheme ? 'text-gray-700' : 'text-gray-300'}`}>
              <FileText className={`w-12 h-12 mx-auto mb-4 ${useLightTheme ? 'text-gray-400' : 'text-gray-500'}`} />
              <h3 className={`text-lg font-semibold ${headerText} mb-2`}>Track Your Progress</h3>
              <p>Enter your registration ID to check your application status. Your registration ID was provided to you when you submitted your application.</p>
              <p className={`mt-2 text-sm ${useLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>If you've lost your registration ID, please contact our admissions office at admissions@techethica.edu</p>
            </div>
          )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackApplication;