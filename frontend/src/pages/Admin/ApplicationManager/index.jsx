// Updated ApplicationManager with Status Controls

import React, { useState, useEffect } from 'react';
import { useFrappeGetCall, useFrappePostCall } from 'frappe-react-sdk';
import { 
  Card, CardContent, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, FileText, Calendar, MessageSquare, Clock, 
  CheckCircle, AlertCircle, User, BookOpen, Plus, 
  Download, UploadCloud, Trash2, Video, MapPin
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ApplicationManager = () => {
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [programFilter, setProgramFilter] = useState('All');
  const [availablePrograms, setAvailablePrograms] = useState([]);
  const { toast, Toaster } = useToast();

  // Status update form state
  const [statusUpdateData, setStatusUpdateData] = useState({
    status: '',
    description: '',
    next_steps: '',
    feedback: ''
  });

  // Document request form state
  const [documentRequestData, setDocumentRequestData] = useState({
    document_type: '',
    notes: ''
  });

  // Interview schedule form state
  const [interviewData, setInterviewData] = useState({
    date: '',
    time: '',
    interviewer: '',
    location: '',
    notes: ''
  });

  // API calls
  const { call: getApplications, loading: loadingApplications } = useFrappeGetCall('labmanager.api.api.get_student_applications');
  const { call: getApplicationDetails, loading: loadingDetails } = useFrappeGetCall('labmanager.api.api.get_application_status');
  const { call: updateApplicationStatus } = useFrappePostCall('labmanager.api.api.update_application_status');
  const { call: requestDocument } = useFrappePostCall('labmanager.api.api.request_document');
  const { call: scheduleInterview } = useFrappePostCall('labmanager.api.api.schedule_interview');
  
  // Load all applications on component mount
  useEffect(() => {
    loadApplications();
  }, []);

  // Extract unique programs for filter
  useEffect(() => {
    if (applications.length > 0) {
      const programs = [...new Set(applications.map(app => app.program))];
      setAvailablePrograms(programs);
    }
  }, [applications]);

  // Load applications from API
  const loadApplications = async () => {
    setLoading(true);
    try {
      const response = await getApplications();
      if (response && Array.isArray(response.applications)) {
        setApplications(response.applications);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load applications',
        variant: 'destructive'
      });
    } finally{
    // ApplicationManager component (continued)
      setLoading(false);
    }
  };

  // Load application details
  const loadApplicationDetails = async (registrationId) => {
    if (!registrationId) return;
    
    try {
      const response = await getApplicationDetails({registration_id: registrationId});
      if (response?.status === 'success') {
        setSelectedApplication(response.data);
        
        // Initialize the status update form with the current status
        setStatusUpdateData({
          status: response.data.current_status,
          description: '',
          next_steps: response.data.next_steps || '',
          feedback: response.data.feedback || ''
        });
      } else {
        toast({
          title: 'Error',
          description: response?.message || 'Failed to load application details',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error loading application details:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while loading application details',
        variant: 'destructive'
      });
    }
  };

  // Filter applications based on search, status, and program
  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchQuery === '' || 
      app.registration_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesProgram = programFilter === 'All' || app.program === programFilter;
    
    return matchesSearch && matchesStatus && matchesProgram;
  });

  // Update application status
  const handleStatusUpdate = async () => {
    if (!selectedApplication || !statusUpdateData.status) {
      toast({
        title: 'Missing Information',
        description: 'Please select a status',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const response = await updateApplicationStatus({
        registration_id: selectedApplication.registration_id,
        status: statusUpdateData.status,
        description: statusUpdateData.description,
        next_steps: statusUpdateData.next_steps,
        feedback: statusUpdateData.feedback
      });
      
      if (response?.status === 'success') {
        toast({
          title: 'Success',
          description: 'Application status updated successfully'
        });
        
        // Refresh application details
        loadApplicationDetails(selectedApplication.registration_id);
        
        // Update the application in the list
        setApplications(apps => apps.map(app => 
          app.registration_id === selectedApplication.registration_id 
            ? {...app, status: statusUpdateData.status} 
            : app
        ));
        
        // Reset form
        setStatusUpdateData({
          status: selectedApplication.current_status,
          description: '',
          next_steps: '',
          feedback: ''
        });
      } else {
        toast({
          title: 'Error',
          description: response?.message || 'Failed to update application status',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while updating application status',
        variant: 'destructive'
      });
    }
  };

  // Request document
  const handleDocumentRequest = async () => {
    if (!selectedApplication || !documentRequestData.document_type) {
      toast({
        title: 'Missing Information',
        description: 'Please specify the document type',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const response = await requestDocument({
        registration_id: selectedApplication.registration_id,
        document_type: documentRequestData.document_type,
        notes: documentRequestData.notes
      });
      
      if (response?.status === 'success') {
        toast({
          title: 'Success',
          description: 'Document request sent successfully'
        });
        
        // Refresh application details
        loadApplicationDetails(selectedApplication.registration_id);
        
        // Update the application status in the list if it was changed
        if (selectedApplication.current_status !== 'Documents Requested') {
          setApplications(apps => apps.map(app => 
            app.registration_id === selectedApplication.registration_id 
              ? {...app, status: 'Documents Requested'} 
              : app
          ));
        }
        
        // Reset form
        setDocumentRequestData({
          document_type: '',
          notes: ''
        });
      } else {
        toast({
          title: 'Error',
          description: response?.message || 'Failed to send document request',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error requesting document:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while sending document request',
        variant: 'destructive'
      });
    }
  };

  // Schedule interview
  const handleScheduleInterview = async () => {
    if (!selectedApplication || !interviewData.date || !interviewData.time) {
      toast({
        title: 'Missing Information',
        description: 'Please provide interview date and time',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const response = await scheduleInterview({
        registration_id: selectedApplication.registration_id,
        ...interviewData
      });
      
      if (response?.status === 'success') {
        toast({
          title: 'Success',
          description: 'Interview scheduled successfully'
        });
        
        // Refresh application details
        loadApplicationDetails(selectedApplication.registration_id);
        
        // Update the application status in the list
        setApplications(apps => apps.map(app => 
          app.registration_id === selectedApplication.registration_id 
            ? {...app, status: 'Interview Scheduled'} 
            : app
        ));
        
        // Reset form
        setInterviewData({
          date: '',
          time: '',
          interviewer: '',
          location: '',
          notes: ''
        });
      } else {
        toast({
          title: 'Error',
          description: response?.message || 'Failed to schedule interview',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while scheduling interview',
        variant: 'destructive'
      });
    }
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

  // Render status badge with appropriate color
  const renderStatusBadge = (status) => {
    let color = '';
    
    switch(status) {
      case 'Submitted':
        color = 'bg-blue-600';
        break;
      case 'Under Review':
        color = 'bg-amber-600';
        break;
      case 'Documents Requested':
        color = 'bg-purple-600';
        break;
      case 'Interview Scheduled':
        color = 'bg-indigo-600';
        break;
      case 'Accepted':
        color = 'bg-emerald-600';
        break;
      case 'Waitlisted':
        color = 'bg-orange-600';
        break;
      case 'Rejected':
        color = 'bg-red-600';
        break;
      default:
        color = 'bg-gray-600';
    }
    
    return (
      <Badge className={`${color} text-white`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <Toaster />
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Applications List Panel */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-amber-300">
                Applications
              </CardTitle>
              
              {/* Search box */}
              <div className="relative mt-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-gray-100"
                  placeholder="Search applications..."
                />
                <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
              
              {/* Filters */}
              <div className="grid grid-cols-1 gap-2 mt-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Documents Requested">Documents Requested</SelectItem>
                    <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                    <SelectItem value="Accepted">Accepted</SelectItem>
                    <SelectItem value="Waitlisted">Waitlisted</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={programFilter} onValueChange={setProgramFilter}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                    <SelectValue placeholder="Filter by program" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="All">All Programs</SelectItem>
                    {availablePrograms.map(program => (
                      <SelectItem key={program} value={program}>
                        {program}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent>
              {loading ? (
                <div className="text-center py-12 text-gray-400">
                  <Clock className="w-8 h-8 mx-auto mb-2 animate-spin" />
                  <p>Loading applications...</p>
                </div>
              ) : filteredApplications.length > 0 ? (
                <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                  {filteredApplications.map(app => (
                    <div
                      key={app.registration_id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedApplication?.registration_id === app.registration_id
                          ? 'bg-amber-300/20 border border-amber-300/30'
                          : 'bg-gray-700/50 border border-gray-700 hover:bg-gray-700'
                      }`}
                      onClick={() => loadApplicationDetails(app.registration_id)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-amber-300 text-sm">
                          {app.student_name}
                        </h3>
                        {renderStatusBadge(app.status)}
                      </div>
                      <div className="text-xs text-gray-400">
                        ID: {app.registration_id}
                      </div>
                      <div className="text-xs text-gray-400">
                        Program: {app.program}
                      </div>
                      <div className="text-xs text-gray-400">
                        Applied: {formatDate(app.submission_date)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="w-8 h-8 mx-auto mb-2" />
                  <p>No applications found</p>
                </div>
              )}
              
              <div className="mt-4 text-xs text-gray-500 text-center">
                Showing {filteredApplications.length} of {applications.length} applications
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Application Details Panel */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          {selectedApplication ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <CardTitle className="text-xl font-bold text-amber-300">
                    {selectedApplication.student_name}
                  </CardTitle>
                  {renderStatusBadge(selectedApplication.current_status)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 text-sm">
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="text-gray-400">Registration ID</div>
                    <div className="text-gray-100 font-mono">{selectedApplication.registration_id}</div>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="text-gray-400">Email</div>
                    <div className="text-gray-100 truncate">{selectedApplication.email}</div>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="text-gray-400">Program</div>
                    <div className="text-gray-100">{selectedApplication.program}</div>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="text-gray-400">Submitted On</div>
                    <div className="text-gray-100">{formatDate(selectedApplication.submission_date)}</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="manage" className="w-full">
                  <TabsList className="w-full bg-gray-700 border-gray-600">
                    <TabsTrigger value="manage" className="text-gray-100 data-[state=active]:bg-amber-300 data-[state=active]:text-gray-900">
                      Manage Application
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="text-gray-100 data-[state=active]:bg-amber-300 data-[state=active]:text-gray-900">
                      Timeline
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="text-gray-100 data-[state=active]:bg-amber-300 data-[state=active]:text-gray-900">
                      Documents
                    </TabsTrigger>
                    <TabsTrigger value="interviews" className="text-gray-100 data-[state=active]:bg-amber-300 data-[state=active]:text-gray-900">
                      Interviews
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Manage Tab - Update Status, Add Documents, Schedule Interviews */}
                  <TabsContent value="manage" className="border-none p-0 mt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Update Status */}
                      <Card className="bg-gray-700/50 border-gray-600">
                        <CardHeader>
                          <CardTitle className="text-lg font-medium text-amber-300">
                            Update Application Status
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-gray-300">New Status</Label>
                              <Select 
                                value={statusUpdateData.status} 
                                onValueChange={(value) => setStatusUpdateData({...statusUpdateData, status: value})}
                              >
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100 mt-1">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                  <SelectItem value="Submitted">Submitted</SelectItem>
                                  <SelectItem value="Under Review">Under Review</SelectItem>
                                  <SelectItem value="Documents Requested">Documents Requested</SelectItem>
                                  <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                                  <SelectItem value="Accepted">Accepted</SelectItem>
                                  <SelectItem value="Waitlisted">Waitlisted</SelectItem>
                                  <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label className="text-gray-300">Description</Label>
                              <Textarea 
                                value={statusUpdateData.description}
                                onChange={(e) => setStatusUpdateData({...statusUpdateData, description: e.target.value})}
                                placeholder="Enter status update description"
                                className="bg-gray-700 border-gray-600 text-gray-100 mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label className="text-gray-300">Next Steps</Label>
                              <Textarea 
                                value={statusUpdateData.next_steps}
                                onChange={(e) => setStatusUpdateData({...statusUpdateData, next_steps: e.target.value})}
                                placeholder="What should the student do next?"
                                className="bg-gray-700 border-gray-600 text-gray-100 mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label className="text-gray-300">Feedback (Optional)</Label>
                              <Textarea 
                                value={statusUpdateData.feedback}
                                onChange={(e) => setStatusUpdateData({...statusUpdateData, feedback: e.target.value})}
                                placeholder="Provide feedback to the student"
                                className="bg-gray-700 border-gray-600 text-gray-100 mt-1"
                              />
                            </div>
                            
                            <Button
                              onClick={handleStatusUpdate}
                              className="w-full bg-amber-300 text-gray-900 hover:bg-amber-400"
                            >
                              Update Status
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Request Documents & Schedule Interview */}
                      <div className="space-y-6">
                        {/* Request Document */}
                        <Card className="bg-gray-700/50 border-gray-600">
                          <CardHeader>
                            <CardTitle className="text-lg font-medium text-amber-300">
                              Request Document
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-gray-300">Document Type</Label>
                                <Input 
                                  value={documentRequestData.document_type}
                                  onChange={(e) => setDocumentRequestData({...documentRequestData, document_type: e.target.value})}
                                  placeholder="e.g., Transcript, ID Proof, Recommendation Letter"
                                  className="bg-gray-700 border-gray-600 text-gray-100 mt-1"
                                />
                              </div>
                              
                              <div>
                                <Label className="text-gray-300">Notes</Label>
                                <Textarea 
                                  value={documentRequestData.notes}
                                  onChange={(e) => setDocumentRequestData({...documentRequestData, notes: e.target.value})}
                                  placeholder="Provide details about the requested document"
                                  className="bg-gray-700 border-gray-600 text-gray-100 mt-1"
                                />
                              </div>
                              
                              <Button
                                onClick={handleDocumentRequest}
                                className="w-full bg-amber-300 text-gray-900 hover:bg-amber-400"
                              >
                                Request Document
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Schedule Interview */}
                        <Card className="bg-gray-700/50 border-gray-600">
                          <CardHeader>
                            <CardTitle className="text-lg font-medium text-amber-300">
                              Schedule Interview
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-gray-300">Date</Label>
                                  <Input 
                                    type="date"
                                    value={interviewData.date}
                                    onChange={(e) => setInterviewData({...interviewData, date: e.target.value})}
                                    className="bg-gray-700 border-gray-600 text-gray-100 mt-1"
                                  />
                                </div>
                                
                                <div>
                                  <Label className="text-gray-300">Time</Label>
                                  <Input 
                                    type="time"
                                    value={interviewData.time}
                                    onChange={(e) => setInterviewData({...interviewData, time: e.target.value})}
                                    className="bg-gray-700 border-gray-600 text-gray-100 mt-1"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label className="text-gray-300">Interviewer</Label>
                                <Input 
                                  value={interviewData.interviewer}
                                  onChange={(e) => setInterviewData({...interviewData, interviewer: e.target.value})}
                                  placeholder="Name of the interviewer"
                                  className="bg-gray-700 border-gray-600 text-gray-100 mt-1"
                                />
                              </div>
                              
                              <div>
                                <Label className="text-gray-300">Location</Label>
                                <Input 
                                  value={interviewData.location}
                                  onChange={(e) => setInterviewData({...interviewData, location: e.target.value})}
                                  placeholder="Interview location or video call link"
                                  className="bg-gray-700 border-gray-600 text-gray-100 mt-1"
                                />
                              </div>
                              
                              <div>
                                <Label className="text-gray-300">Notes</Label>
                                <Textarea 
                                  value={interviewData.notes}
                                  onChange={(e) => setInterviewData({...interviewData, notes: e.target.value})}
                                  placeholder="Additional information for the student"
                                  className="bg-gray-700 border-gray-600 text-gray-100 mt-1"
                                />
                              </div>
                              
                              <Button
                                onClick={handleScheduleInterview}
                                className="w-full bg-amber-300 text-gray-900 hover:bg-amber-400"
                              >
                                Schedule Interview
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Timeline Tab */}
                  <TabsContent value="timeline" className="border-none p-0 mt-4">
                    <Card className="bg-gray-700/50 border-gray-600">
                      <CardContent className="p-6">
                        {selectedApplication.timeline && selectedApplication.timeline.length > 0 ? (
                          <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gray-600"></div>
                            
                            <div className="space-y-6">
                              {selectedApplication.timeline.map((event, index) => (
                                <div key={index} className="relative pl-10">
                                  {/* Timeline dot */}
                                  <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-gray-800 border-2 border-amber-300 flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-amber-300" />
                                  </div>
                                  
                                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
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
                            <p>No timeline events yet</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Documents Tab */}
                  <TabsContent value="documents" className="border-none p-0 mt-4">
                    <Card className="bg-gray-700/50 border-gray-600">
                      <CardContent className="p-6">
                        {selectedApplication.documents && selectedApplication.documents.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-gray-300">Document Type</TableHead>
                                <TableHead className="text-gray-300">Status</TableHead>
                                <TableHead className="text-gray-300">Submitted Date</TableHead>
                                <TableHead className="text-gray-300">Notes</TableHead>
                                <TableHead className="text-gray-300">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedApplication.documents.map((doc, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium text-amber-100">
                                    {doc.document_type}
                                  </TableCell>
                                  <TableCell>
                                    {doc.status === 'Submitted' ? (
                                      <Badge className="bg-emerald-600 text-white">Submitted</Badge>
                                    ) : doc.status === 'Requested' ? (
                                      <Badge className="bg-amber-600 text-white">Requested</Badge>
                                    ) : doc.status === 'Rejected' ? (
                                      <Badge className="bg-red-600 text-white">Rejected</Badge>
                                    ) : (
                                      <Badge className="bg-gray-600 text-white">Pending</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-gray-300">{formatDate(doc.submitted_date)}</TableCell>
                                  <TableCell className="text-gray-300">{doc.notes || 'N/A'}</TableCell>
                                  <TableCell>
                                    <div className="flex space-x-2">
                                      {doc.status === 'Submitted' && (
                                        <>
                                          <Button variant="outline" size="sm" className="h-8 text-emerald-400 border-emerald-400">
                                            Approve
                                          </Button>
                                          <Button variant="outline" size="sm" className="h-8 text-red-400 border-red-400">
                                            Reject
                                          </Button>
                                        </>
                                      )}
                                      {doc.status === 'Requested' && (
                                        <Button variant="outline" size="sm" className="h-8 text-amber-400 border-amber-400">
                                          Send Reminder
                                        </Button>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                            <p>No documents requested or submitted yet</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Interviews Tab */}
                  <TabsContent value="interviews" className="border-none p-0 mt-4">
                    <Card className="bg-gray-700/50 border-gray-600">
                      <CardContent className="p-6">
                        {selectedApplication.interviews && selectedApplication.interviews.length > 0 ? (
                          <div className="space-y-4">
                            {selectedApplication.interviews.map((interview, index) => (
                              <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-600">
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
                                    <span>Time: {interview.time}</span>
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
                            <p>No interviews have been scheduled yet</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-800 border-gray-700 flex items-center justify-center min-h-[400px]">
              <div className="text-center p-6">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-medium text-amber-300 mb-2">
                  No Application Selected
                </h3>
                <p className="text-gray-400">
                  Select an application from the list to view and manage details
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationManager;