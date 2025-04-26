import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, ArrowLeft, Users, Share2, Download, ExternalLink } from 'lucide-react';
import BackgroundPattern from '../../components/ui/BackgroundPattern';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { useTheme } from '../../components/ui/ThemeContext';
import AttendeesList from './components/AttendeesList';
import EventGallery from './components/EventGallery';
import NewsletterSignup from './components/NewsletterSignup';


const EventDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const eventId = searchParams.get('id');
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { useLightTheme } = useTheme();
  
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) {
        setError('Event ID is missing');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/method/labmanager.api.events.get_event_details?event_id=${eventId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        
        const data = await response.json();
        
        if (data.message && data.message.status === 'success' && data.message.event) {
          setEvent(data.message.event);
        } else {
          // Use sample data if no event is returned
          setEvent(generateSampleEvent(eventId));
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError(err.message);
        
        // Use sample data on error
        setEvent(generateSampleEvent(eventId));
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventDetails();
  }, [eventId]);
  
  // Format date function
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Function to generate sample event data (for development/testing)
  const generateSampleEvent = (id) => {
    const sampleEvents = {
      '1': {
        id: '1',
        title: 'Logo and Website Launch of TechEthica',
        date: '2025-04-26',
        time: '10:00 AM',
        location: 'Main Campus, Bidarahalli',
        category: 'Launch',
        is_featured: true,
        image: '/api/placeholder/1200/600',
        description: 'A momentous occasion marking the official launch of the TechEthica Logo and Website — a pioneering initiative that fuses cutting-edge technology education with deep Islamic learning.\n\nThe event will feature distinguished guests from the government, technology sector, and Islamic scholars who will share their vision for the integration of technology education with Islamic ethics and principles.\n\nThis launch represents a significant milestone in our mission to empower Muslim youth with technological skills while staying true to Islamic values.',
        organizer: 'TechEthica Administration',
        attendees: [
          { name: 'Janab B. Zameer Ahmad Khan Sahib', title: 'Honourable Minister for Housing, Wakf, and Minority Welfare' },
          { name: 'Maulana N.K.M. Shafi Saadi', title: 'Chairman & Co-Founder, TechEthica' },
          { name: 'Janab Zulfikar Ali Tippu Sahib', title: 'Chairman, Karnataka State Haj Committee' },
          { name: 'Janab Iftikhar Ahmed Sahib', title: 'Former Chairman, Karnataka State Board of Auqaf' },
          { name: 'Janab Advocate Rahul Riyaz Khan Sahib', title: 'Former Chairman, Karnataka State Board of Auqaf' },
          { name: 'Janab Sarfaraz Ahmed Khan Sahib', title: 'Executive Officer, Karnataka State Haj Committee' },
          { name: 'Mr. Khalandar Sihan Saquafi', title: 'CEO & Co-Founder, TechEthica' }
        ],
        gallery: [
          { image: '/api/placeholder/800/600', caption: 'TechEthica Campus Entrance' },
          { image: '/api/placeholder/800/600', caption: 'Technology Lab' },
          { image: '/api/placeholder/800/600', caption: 'Student Learning Center' },
          { image: '/api/placeholder/800/600', caption: 'Prayer Hall' }
        ],
        documents: [
          { title: 'Event Agenda', file: '#', description: 'Detailed schedule of the launch event' },
          { title: 'Press Release', file: '#', description: 'Official press release for the media' }
        ]
      },
      '2': {
        id: '2',
        title: 'Islamic Data Science Workshop',
        date: '2025-05-15',
        time: '9:00 AM',
        location: 'TechEthica Learning Center',
        category: 'Workshop',
        image: '/api/placeholder/1200/600',
        description: 'Learn how data science can be applied to Islamic studies for research and analysis. This workshop will cover techniques for analyzing Hadith collections, Quranic text analysis, and more.\n\nParticipants will gain hands-on experience with modern data science tools while exploring their application in Islamic scholarship. The workshop is suitable for individuals with basic programming knowledge who are interested in the intersection of technology and Islamic studies.',
        organizer: 'Dr. Ahmed Hassan',
        attendees: [
          { name: 'Dr. Ahmed Hassan', title: 'Lead Data Scientist & Workshop Facilitator' },
          { name: 'Imam Yusuf Ali', title: 'Islamic Studies Scholar' },
          { name: 'Prof. Aisha Rahman', title: 'Computer Science Department Head' }
        ],
        gallery: [
          { image: '/api/placeholder/800/600', caption: 'Previous Workshop Session' },
          { image: '/api/placeholder/800/600', caption: 'Data Visualization Example' }
        ],
        documents: [
          { title: 'Workshop Materials', file: '#', description: 'Slides and code samples for the workshop' },
          { title: 'Pre-requisites', file: '#', description: 'Recommended knowledge and setup instructions' }
        ]
      }
    };
    
    return sampleEvents[id] || sampleEvents['1'];
  };

  // Function to handle sharing
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: window.location.href,
      })
      .catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Error copying to clipboard:', err));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-green-600 border-b-green-600 border-l-gray-200 border-r-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">
            <span className="mx-auto">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Event</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate('/events')}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/events')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            View All Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${useLightTheme ? 'bg-gray-50' : 'bg-gray-900'}`}>
      <BackgroundPattern />
      
      <div className="relative z-10">
        {/* Header Section with Hero Image */}
        <div className="relative">
          <div className="h-96 overflow-hidden relative">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img 
              src={event.image || '/api/placeholder/1200/600'} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="container mx-auto px-4">
            <div className="relative -mt-24 mb-8 z-20">
              <Card className={`${useLightTheme ? 'bg-white' : 'bg-gray-800'} shadow-xl mx-auto max-w-4xl`}>
                <CardContent className="p-8">
                  <button 
                    onClick={() => navigate('/events')}
                    className={`inline-flex items-center text-sm ${useLightTheme ? 'text-green-600' : 'text-green-400'} mb-4 hover:underline`}
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to All Events
                  </button>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-green-600 text-white">{event.category}</Badge>
                    {event.is_featured && (
                      <Badge variant="outline" className="border-amber-400 text-amber-600">Featured Event</Badge>
                    )}
                  </div>
                  
                  <h1 className={`text-3xl md:text-4xl font-bold mb-6 ${useLightTheme ? 'text-gray-800' : 'text-white'}`}>
                    {event.title}
                  </h1>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className={`flex items-center ${useLightTheme ? 'text-gray-700' : 'text-gray-200'}`}>
                      <Calendar size={20} className="mr-3 text-green-600" />
                      <div>
                        <h3 className="text-sm text-gray-500 mb-1">Date</h3>
                        <p>{formatDate(event.date)}</p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center ${useLightTheme ? 'text-gray-700' : 'text-gray-200'}`}>
                      <Clock size={20} className="mr-3 text-green-600" />
                      <div>
                        <h3 className="text-sm text-gray-500 mb-1">Time</h3>
                        <p>{event.time}</p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center ${useLightTheme ? 'text-gray-700' : 'text-gray-200'}`}>
                      <MapPin size={20} className="mr-3 text-green-600" />
                      <div>
                        <h3 className="text-sm text-gray-500 mb-1">Location</h3>
                        <p>{event.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mb-8">
                    <button 
                      onClick={handleShare}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors flex items-center"
                    >
                      <Share2 size={18} className="mr-2" />
                      Share Event
                    </button>
                    
                    {event.documents && event.documents.length > 0 && (
                      <button 
                        onClick={() => window.open(event.documents[0].file, '_blank')}
                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors flex items-center"
                      >
                        <Download size={18} className="mr-2" />
                        Download Agenda
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Event Details Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className={`${useLightTheme ? 'bg-white' : 'bg-gray-800'} mb-8`}>
                <CardContent className="p-6 md:p-8">
                  <h2 className={`text-2xl font-bold mb-4 ${useLightTheme ? 'text-gray-800' : 'text-white'}`}>
                    About This Event
                  </h2>
                  
                  <div className={`prose max-w-none ${useLightTheme ? 'text-gray-700' : 'text-gray-200'}`}>
                    {event.description.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Gallery Section */}
              {event.gallery && event.gallery.length > 0 && (
                <Card className={`${useLightTheme ? 'bg-white' : 'bg-gray-800'} mb-8`}>
                  <CardContent className="p-6 md:p-8">
                    <h2 className={`text-2xl font-bold mb-6 ${useLightTheme ? 'text-gray-800' : 'text-white'}`}>
                      Event Gallery
                    </h2>
                    
                    <EventGallery gallery={event.gallery} />
                  </CardContent>
                </Card>
              )}
              
              {/* Documents Section */}
              {event.documents && event.documents.length > 0 && (
                <Card className={`${useLightTheme ? 'bg-white' : 'bg-gray-800'} mb-8`}>
                  <CardContent className="p-6 md:p-8">
                    <h2 className={`text-2xl font-bold mb-6 ${useLightTheme ? 'text-gray-800' : 'text-white'}`}>
                      Related Documents
                    </h2>
                    
                    <div className="space-y-4">
                      {event.documents.map((doc, index) => (
                        <div 
                          key={index} 
                          className={`p-4 rounded-lg ${useLightTheme ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-700 hover:bg-gray-600'} transition-colors flex justify-between items-center`}
                        >
                          <div>
                            <h3 className={`font-medium ${useLightTheme ? 'text-gray-800' : 'text-white'}`}>{doc.title}</h3>
                            <p className="text-sm text-gray-500">{doc.description}</p>
                          </div>
                          <a 
                            href={doc.file} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`p-2 rounded-full ${useLightTheme ? 'hover:bg-gray-200' : 'hover:bg-gray-500'} transition-colors`}
                          >
                            <Download size={18} className={`${useLightTheme ? 'text-green-600' : 'text-green-400'}`} />
                          </a>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Sidebar */}
            <div>
              {/* Organizer Card */}
              <Card className={`${useLightTheme ? 'bg-white' : 'bg-gray-800'} mb-8`}>
                <CardContent className="p-6">
                  <h2 className={`text-xl font-bold mb-4 ${useLightTheme ? 'text-gray-800' : 'text-white'} flex items-center`}>
                    <User size={20} className="mr-2 text-green-600" />
                    Organizer
                  </h2>
                  
                  <p className={`mb-4 ${useLightTheme ? 'text-gray-700' : 'text-gray-200'}`}>{event.organizer}</p>
                  
                  <a
                    href="/contact-us"
                    className="inline-flex items-center text-sm text-green-600 hover:underline"
                  >
                    <ExternalLink size={16} className="mr-1" />
                    Contact Organizer
                  </a>
                </CardContent>
              </Card>
              
              {/* Attendees Card */}
              {event.attendees && event.attendees.length > 0 && (
                <Card className={`${useLightTheme ? 'bg-white' : 'bg-gray-800'} mb-8`}>
                  <CardContent className="p-6">
                    <h2 className={`text-xl font-bold mb-4 ${useLightTheme ? 'text-gray-800' : 'text-white'} flex items-center`}>
                      <Users size={20} className="mr-2 text-green-600" />
                      Distinguished Guests
                    </h2>
                    
                    <AttendeesList attendees={event.attendees} />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
        
        {/* Newsletter Section */}
        <NewsletterSignup />
      </div>
    </div>
  );
};

export default EventDetails;