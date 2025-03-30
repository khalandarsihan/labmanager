// frontend/src/pages/TrackApplication/index.jsx
import React, { useState, useEffect } from 'react';
import { useFrappeGetCall } from 'frappe-react-sdk';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, FileText, Calendar, MessageSquare, 
  Clock, CheckCircle, AlertCircle, User, BookOpen, MapPin 
} from 'lucide-react';
import BackgroundPattern from '@/components/ui/BackgroundPattern';

const TrackApplication = ({ initialRegistrationId }) => {
  const [registrationId, setRegistrationId] = useState(initialRegistrationId || '');
  const [statusData, setStatusData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  
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
      
      if (data.message && data.message.status === 'success') {
        setStatusData(data.message.data);
      } else {
        setError(data.message?.message || 'Failed to retrieve application status');
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
  
  // Function to render status badge with appropriate color
  const renderStatusBadge = (status) => {
    let variant = 
      status === 'Submitted' ? 'info' : 
      status === 'Under Review' ? 'warning' :
      status === 'Documents Requested' ? 'secondary' :
      status === 'Interview Scheduled' ? 'info' :
      status === 'Accepted' ? 'success' :
      status === 'Waitlisted' ? 'warning' :
      status === 'Rejected' ? 'destructive' :
      'default';
      
    return <Badge variant={variant}>{status}</Badge>;
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
  
  // Render document status with icon
  const renderDocumentStatus = (status) => {
    switch(status) {
      case 'Submitted':
        return <div className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />Submitted</div>;
      case 'Requested':
        return <div className="flex items-center"><AlertCircle className="w-4 h-4 text-amber-500 mr-2" />Requested</div>;
      case 'Rejected':
        return <div className="flex items-center"><AlertCircle className="w-4 h-4 text-red-500 mr-2" />Rejected</div>;
      default:
        return <div className="flex items-center"><Clock className="w-4 h-4 text-gray-500 mr-2" />Pending</div>;
    }
  };
  
  return (
    <div className="relative">
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
                
                {/* Detailed Information Tabs */}
                <Tabs defaultValue="timeline" className="w-full">
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
                          <div className="divide-y divide-gray-700">
                            {statusData.documents.map((doc, index) => (
                              <div key={index} className="py-4 first:pt-0 last:pb-0">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-medium text-amber-100">{doc.document_type}</h4>
                                  {renderDocumentStatus(doc.status)}
                                </div>
                                {doc.status === 'Submitted' && (
                                  <div className="text-sm text-gray-400">Submitted on: {formatDate(doc.submitted_date)}</div>
                                )}
                                {doc.notes && (
                                  <div className="mt-2 text-sm text-gray-300 bg-gray-800/50 p-3 rounded-md border border-gray-700/50">
                                    <MessageSquare className="w-4 h-4 inline-block mr-2 text-amber-300" />
                                    {doc.notes}
                                  </div>
                                )}
                              </div>
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
                                  <Badge variant={
                                    interview.status === 'Scheduled' ? 'info' :
                                    interview.status === 'Completed' ? 'success' :
                                    interview.status === 'Missed' ? 'destructive' :
                                    'default'
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