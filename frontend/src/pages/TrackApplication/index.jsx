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

const TrackApplication = ({ initialRegistrationId }) => {
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
  
  const handleDocumentUpload = async (documentType) => {
    // Reload the data after document upload
    await fetchData(registrationId);
    
    toast({
      title: "Document Uploaded",
      description: `${documentType} was uploaded successfully`,
    });
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
      'Under Review',
      'Documents Requested',
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
    
    return (
      <div className="w-full mb-6">
        <div className="flex justify-between mb-2">
          {statuses.slice(0, 5).map((status, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${index <= currentStatusIndex ? 'bg-amber-300 text-gray-900' : 'bg-gray-700 text-gray-400'}`}>
                {index + 1}
              </div>
              <div className="text-xs mt-1 text-center max-w-[70px]">
                {status}
              </div>
            </div>
          ))}
        </div>
        <div className="relative h-1 bg-gray-700 mt-2">
          <div 
            className="absolute h-1 bg-amber-300" 
            style={{ width: `${Math.min(100, (currentStatusIndex / 4) * 100)}%` }}
          ></div>
        </div>
      </div>
    );
  };
  
  // Render content based on application status
  const renderStatusSpecificContent = () => {
    if (!statusData) return null;
    
    switch(statusData.current_status) {
      case 'Documents Requested':
        return (
          <div className="bg-purple-900/30 border border-purple-700/50 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="text-purple-300 font-medium mb-1">Document Request</h3>
                <p className="text-purple-200 text-sm">
                  Please upload the requested documents as soon as possible to proceed with your application.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'Interview Scheduled':
        return (
          <div className="bg-indigo-900/30 border border-indigo-700/50 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-indigo-400 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="text-indigo-300 font-medium mb-1">Interview Scheduled</h3>
                <p className="text-indigo-200 text-sm">
                  You have an upcoming interview scheduled. Please check the Interviews tab for details.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'Accepted':
        return (
          <div className="bg-emerald-900/30 border border-emerald-700/50 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="text-emerald-300 font-medium mb-1">Congratulations!</h3>
                <p className="text-emerald-200 text-sm">
                  Your application has been accepted. Please complete the enrollment process as outlined in the Next Steps tab.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'Waitlisted':
        return (
          <div className="bg-orange-900/30 border border-orange-700/50 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-orange-400 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="text-orange-300 font-medium mb-1">Application Waitlisted</h3>
                <p className="text-orange-200 text-sm">
                  Your application has been waitlisted. We will notify you if a spot becomes available.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'Rejected':
        return (
          <div className="bg-red-900/30 border border-red-700/50 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="text-red-300 font-medium mb-1">Application Not Approved</h3>
                <p className="text-red-200 text-sm">
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
        <Card className="border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-amber-300">
              Track Your Application
            </CardTitle>
            <CardDescription className="text-center text-amber-100/70">
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
                    className="pl-10 bg-gray-800/50 border-gray-700/50 text-amber-100 focus:border-amber-300/50 placeholder-gray-400"
                    placeholder="Enter your registration ID (e.g., 2025-BCA-0303)"
                  />
                  <Search className="w-5 h-5 absolute left-3 top-2.5 text-amber-300/70" />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-amber-300 text-gray-900 hover:bg-amber-400 transition-all duration-200"
                >
                  {isSearching ? 'Searching...' : 'Track'}
                </Button>
              </div>
            </div>
            
            {/* Application Status Display */}
            {statusData && (
              <div className="space-y-6">
                {/* Application Summary */}
                <div className="bg-gray-700/30 rounded-lg p-6 backdrop-blur-sm border border-gray-700/50">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <h3 className="text-lg font-semibold text-amber-300">Application Summary</h3>
                    {renderStatusBadge(statusData.current_status)}
                  </div>
                  
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
                    <div>
                      <dt className="text-gray-400 text-sm">Application ID</dt>
                      <dd className="flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-amber-300" />
                        {statusData.registration_id}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-400 text-sm">Submission Date</dt>
                      <dd className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-amber-300" />
                        {formatDate(statusData.submission_date)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-400 text-sm">Applicant Name</dt>
                      <dd className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-amber-300" />
                        {statusData.student_name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-400 text-sm">Program</dt>
                      <dd className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-2 text-amber-300" />
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
                  <TabsList className="w-full bg-gray-800 border-gray-700">
                    <TabsTrigger value="timeline" className="text-amber-100 data-[state=active]:bg-amber-300 data-[state=active]:text-gray-900">
                      Timeline
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="text-amber-100 data-[state=active]:bg-amber-300 data-[state=active]:text-gray-900">
                      Documents
                    </TabsTrigger>
                    <TabsTrigger value="interviews" className="text-amber-100 data-[state=active]:bg-amber-300 data-[state=active]:text-gray-900">
                      Interviews
                    </TabsTrigger>
                    <TabsTrigger value="next-steps" className="text-amber-100 data-[state=active]:bg-amber-300 data-[state=active]:text-gray-900">
                      Next Steps
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Timeline Tab */}
                  <TabsContent value="timeline" className="border-none p-0 mt-4">
                    <Card className="bg-gray-700/30 border-gray-700/50">
                      <CardContent className="p-6">
                        {statusData.timeline && statusData.timeline.length > 0 ? (
                          <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gray-700"></div>
                            
                            <div className="space-y-6">
                              {statusData.timeline.map((event, index) => (
                                <div key={index} className="relative pl-10">
                                  {/* Timeline dot */}
                                  <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-gray-800 border-2 border-amber-300 flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-amber-300" />
                                  </div>
                                  
                                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
                                      <h4 className="font-medium text-amber-300">{event.status}</h4>
                                      <span className="text-sm text-gray-400">{formatDate(event.date)}</span>
                                    </div>
                                    <p className="text-gray-300 text-sm">{event.description}</p>
                                    <div className="text-xs text-gray-500 mt-2">Updated by: {event.created_by}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                            <p>No timeline events yet. Check back later for updates.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Documents Tab */}
                  <TabsContent value="documents" className="border-none p-0 mt-4">
                    <Card className="bg-gray-700/30 border-gray-700/50">
                      <CardContent className="p-6">
                        {statusData.documents && statusData.documents.length > 0 ? (
                          <div className="space-y-4">
                            {statusData.documents.map((doc, index) => (
                              <DocumentUpload 
                                key={index}
                                document={doc}
                                registrationId={statusData.registration_id}
                                onUploadSuccess={handleDocumentUpload}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                            <p>No required documents at this time.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Interviews Tab */}
                  <TabsContent value="interviews" className="border-none p-0 mt-4">
                    <Card className="bg-gray-700/30 border-gray-700/50">
                      <CardContent className="p-6">
                        {statusData.interviews && statusData.interviews.length > 0 ? (
                          <div className="space-y-4">
                            {statusData.interviews.map((interview, index) => (
                              <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                                <div className="flex justify-between items-start mb-3">
                                  <h4 className="font-medium text-amber-300">Interview {index + 1}</h4>
                                  <Badge className={
                                    interview.status === 'Scheduled' ? 'bg-blue-600' :
                                    interview.status === 'Completed' ? 'bg-emerald-600' :
                                    interview.status === 'Missed' ? 'bg-red-600' :
                                    'bg-gray-600'
                                  }>
                                    {interview.status}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-amber-300" />
                                    <span>Date: {formatDate(interview.date)}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2 text-amber-300" />
                                    <span>Time: {formatTime(interview.time)}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <User className="w-4 h-4 mr-2 text-amber-300" />
                                    <span>Interviewer: {interview.interviewer}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-amber-300" />
                                    <span>Location: {interview.location}</span>
                                  </div>
                                </div>
                                
                                {interview.notes && (
                                  <div className="mt-3 text-sm text-gray-300 bg-gray-700/50 p-3 rounded-md">
                                    <MessageSquare className="w-4 h-4 inline-block mr-2 text-amber-300" />
                                    {interview.notes}
                                  </div>
                                )}
                                
                                {/* Join interview button (only shown if online and within 15 minutes of start time) */}
                                {interview.status === 'Scheduled' && 
                                 interview.location && interview.location.toLowerCase().includes('online') && (
                                  <div className="mt-4">
                                    <Button className="bg-amber-300 text-gray-900 hover:bg-amber-400">
                                      <Video className="w-4 h-4 mr-2" />
                                      Join Interview
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                            <p>No interviews have been scheduled yet.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Next Steps Tab */}
                  <TabsContent value="next-steps" className="border-none p-0 mt-4">
                    <Card className="bg-gray-700/30 border-gray-700/50">
                      <CardContent className="p-6">
                        {statusData.next_steps ? (
                          <div>
                            <h3 className="text-lg font-semibold text-amber-300 mb-4">Your Next Steps</h3>
                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 text-gray-300 whitespace-pre-line">
                              {statusData.next_steps}
                            </div>
                            
                            {statusData.feedback && (
                              <div className="mt-6">
                                <h4 className="text-md font-semibold text-amber-300 mb-2">Feedback from Admissions Team</h4>
                                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 text-gray-300 whitespace-pre-line">
                                  {statusData.feedback}
                                </div>
                              </div>
                            )}
                            
                            {/* Show enrollment button for accepted applications */}
                            {statusData.current_status === 'Accepted' && (
                              <div className="mt-6 text-center">
                                <Button 
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                  onClick={() => window.location.href = '/enroll?id=' + statusData.registration_id}
                                >
                                  Complete Enrollment
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                            <p>No specific next steps have been provided yet.</p>
                            <p className="mt-2 text-sm">General next steps:</p>
                            <ul className="text-sm mt-2 list-disc list-inside">
                              <li>Keep an eye on your email for updates from our admissions team</li>
                              <li>Ensure your contact information is up to date</li>
                              <li>Check back here regularly for status updates</li>
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            {/* Error Display */}
            {error && !statusData && (
              <div className="bg-red-900/30 text-red-300 rounded-lg p-4 mt-4 border border-red-700/50">
                <AlertCircle className="w-5 h-5 inline-block mr-2" />
                {error}
              </div>
            )}
          </CardContent>
          
          {!statusData && !error && (
            <CardFooter className="flex-col space-y-4 text-center text-amber-100/70 pt-0">
              <div className="bg-gray-700/30 rounded-lg p-6 backdrop-blur-sm border border-gray-700/50 w-full">
                <FileText className="w-12 h-12 mx-auto mb-4 text-amber-300/50" />
                <h3 className="text-lg font-semibold text-amber-300 mb-2">Track Your Progress</h3>
                <p>Enter your registration ID to check your application status. Your registration ID was provided to you when you submitted your application.</p>
                <p className="mt-2 text-sm">If you've lost your registration ID, please contact our admissions office at admissions@techethica.edu</p>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TrackApplication;