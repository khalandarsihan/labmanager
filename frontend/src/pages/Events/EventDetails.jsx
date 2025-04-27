import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ArrowLeft, 
  ArrowRight,
  Users, 
  Share2, 
  Download, 
  ExternalLink, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  MapIcon,
  MessageCircle
} from 'lucide-react';
import { useTheme } from '../../components/ui/ThemeContext';
import BackgroundPattern from '../../components/ui/BackgroundPattern';

const EventDetails = ({ eventId: propEventId }) => {
  // Get theme context
  const { useLightTheme, themeStyles } = useTheme();

  // State management
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [showRsvpForm, setShowRsvpForm] = useState(false);
  const [rsvpData, setRsvpData] = useState({ name: '', email: '', attending: 'yes' });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const galleryRef = useRef(null);
  
  // Get event ID from props or URL
  const searchParams = new URLSearchParams(window.location.search);
  const eventId = propEventId || searchParams.get('id') || window.eventId;
  
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) {
        setError('Event ID is missing');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Call the API endpoint to get event details
        const response = await fetch(`/api/method/labmanager.api.events.get_event_details?event_id=${eventId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        
        const data = await response.json();
        console.log("API Response:", data); // For debugging
        
        if (data.message && data.message.status === 'success' && data.message.event) {
          setEvent(data.message.event);
          
          // Fetch related events
          fetchRelatedEvents(data.message.event.category);
        } else {
          // If API returned no event, set error
          setError('Event not found or API returned an unexpected response');
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchRelatedEvents = async (category) => {
      if (!category) return;
      
      try {
        const response = await fetch('/api/method/labmanager.api.events.get_events');
        if (!response.ok) throw new Error('Failed to fetch related events');
        
        const data = await response.json();
        if (data.message && data.message.status === 'success' && data.message.events) {
          // Filter events by same category and exclude current event
          const related = data.message.events
            .filter(item => 
              item.category === category && 
              (item.id !== eventId && item.name !== eventId)
            )
            .slice(0, 3); // Limit to 3 related events
          
          setRelatedEvents(related);
        }
      } catch (err) {
        console.error("Error fetching related events:", err);
      }
    };
    
    fetchEventDetails();
  }, [eventId]);
  
  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      console.error("Date formatting error:", e);
      return dateString; // Return the original string if formatting fails
    }
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
  
  // Social media sharing
  const socialShareUrls = event ? {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this event: ${event.title}`)}&url=${encodeURIComponent(window.location.href)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
    email: `mailto:?subject=${encodeURIComponent(`Check out this event: ${event.title}`)}&body=${encodeURIComponent(`I thought you might be interested in this event: ${window.location.href}`)}`
  } : {};
  
  // Add to calendar functions
  const generateIcsFile = () => {
    if (!event) return;
    
    const eventDate = new Date(event.date);
    const endDate = new Date(eventDate);
    endDate.setHours(endDate.getHours() + 2); // Assume 2 hour event if no end time
    
    const startTime = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endTime = endDate.toISOString().replace(/-|:|\.\d+/g, '');
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'CALSCALE:GREGORIAN',
      'PRODID:-//TechEthica//Events Calendar//EN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@techethica.edu`,
      `DTSTAMP:${startTime}`,
      `DTSTART:${startTime}`,
      `DTEND:${endTime}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description?.replace(/\n/g, '\\n') || ''}`,
      `LOCATION:${event.location || 'TBA'}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
    link.click();
  };
  
  const addToGoogleCalendar = () => {
    if (!event) return;
    
    const eventDate = new Date(event.date);
    const endDate = new Date(eventDate);
    endDate.setHours(endDate.getHours() + 2); // Assume 2 hour event if no end time
    
    const startTime = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endTime = endDate.toISOString().replace(/-|:|\.\d+/g, '');
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.location || '')}`;
    
    window.open(url, '_blank');
  };
  
  // RSVP form handling
  const handleRsvpChange = (e) => {
    const { name, value } = e.target;
    setRsvpData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    // Here you would typically submit this to your API
    console.log("RSVP Data:", rsvpData);
    setRsvpSubmitted(true);
    setTimeout(() => {
      setShowRsvpForm(false);
      setTimeout(() => setRsvpSubmitted(false), 500);
    }, 2000);
  };
  
  // Gallery navigation functions
  const handlePrevImage = () => {
    if (!event?.gallery || event.gallery.length === 0) return;
    setCurrentImageIndex(prev => (prev === 0 ? event.gallery.length - 1 : prev - 1));
  };
  
  const handleNextImage = () => {
    if (!event?.gallery || event.gallery.length === 0) return;
    setCurrentImageIndex(prev => (prev === event.gallery.length - 1 ? 0 : prev + 1));
  };
  
  // Open image modal
  const openModal = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  // Close image modal
  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };
  
  // Scroll gallery to thumbnail
  const scrollToThumbnail = (index) => {
    if (galleryRef.current) {
      const thumbnailWidth = 100; // Approximate width + margins
      galleryRef.current.scrollLeft = index * thumbnailWidth - (galleryRef.current.clientWidth / 2) + (thumbnailWidth / 2);
    }
  };
  
  // Render HTML content safely
  const renderHTML = (html) => {
    return { __html: html };
  };
  
  // Attendees List Component
  const AttendeesList = ({ attendees }) => {
    if (!attendees || attendees.length === 0) {
      return null;
    }

    return (
      <div className="mb-8">
        <div className="space-y-3">
          {attendees.map((attendee, index) => (
            <div key={index} className={`p-4 rounded-lg ${
              useLightTheme 
                ? 'bg-gray-50 border border-gray-100 hover:border-purple-200' 
                : 'bg-gray-800 border border-gray-700 hover:border-amber-400/30'
              } transition-colors`}>
              <h5 className={`font-semibold ${useLightTheme ? 'text-gray-800' : 'text-gray-200'}`}>
                {attendee.name1 || attendee.name}
              </h5>
              <p className={`text-sm ${useLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>
                {attendee.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Image Gallery Component
  const EventGallery = ({ gallery }) => {
    if (!gallery || gallery.length === 0) {
      return null;
    }

    useEffect(() => {
      if (gallery && gallery.length > 0) {
        scrollToThumbnail(currentImageIndex);
      }
    }, [currentImageIndex, gallery]);

    return (
      <div>
        {/* Main image display with navigation */}
        <div className="relative rounded-lg overflow-hidden mb-4">
          <img 
            src={gallery[currentImageIndex]?.image || '/api/placeholder/800/500'} 
            alt={gallery[currentImageIndex]?.caption || `Gallery image`}
            className="w-full h-96 object-cover"
          />
          
          {gallery.length > 1 && (
            <>
              <button 
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
          
          {gallery[currentImageIndex]?.caption && (
            <div className="absolute inset-x-0 bottom-0 bg-gray-900/70 text-white p-3">
              {gallery[currentImageIndex].caption}
            </div>
          )}
        </div>
        
        {/* Thumbnails */}
        {gallery.length > 1 && (
          <div 
            ref={galleryRef}
            className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            {gallery.map((item, index) => (
              <div 
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 cursor-pointer relative ${
                  currentImageIndex === index 
                    ? useLightTheme ? 'ring-2 ring-purple-500' : 'ring-2 ring-amber-500'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img 
                  src={item.image || '/api/placeholder/100/100'} 
                  alt={item.caption || `Thumbnail ${index + 1}`}
                  className="w-24 h-16 object-cover rounded"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // RelatedEventCard Component
  const RelatedEventCard = ({ event }) => {
    if (!event) return null;
    
    // Use card_image if available, fall back to main image
    const imageUrl = event.card_image || event.image || '/api/placeholder/100/100';
    
    return (
      <div className={`flex items-center p-3 rounded-lg ${
        useLightTheme 
          ? 'hover:bg-gray-50 border border-gray-100' 
          : 'hover:bg-gray-800 border border-gray-700'
        } transition-colors`}>
        <img 
          src={imageUrl} 
          alt={event.title}
          className="w-16 h-16 object-cover rounded mr-3 flex-shrink-0"
        />
        <div className="flex-grow">
          <h5 className={`font-medium ${useLightTheme ? 'text-gray-800' : 'text-gray-200'} line-clamp-1`}>
            {event.title}
          </h5>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={14} className="mr-1" />
            {formatDate(event.date)}
          </div>
          <a 
            href={`/event-details?id=${encodeURIComponent(event.id || event.name)}`}
            className={`text-sm font-medium hover:underline ${
              useLightTheme ? 'text-purple-600' : 'text-amber-400'
            }`}
          >
            View details
          </a>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
    //   <div className={`min-h-screen flex justify-center items-center ${useLightTheme ? 'bg-purple-50' : 'bg-gray-900'}`}>
    <div className={`min-h-screen relative ${useLightTheme ? '' : ''}`}>
        <BackgroundPattern />
        {/* <div className="text-center relative z-10"> */}
        <div className="relative z-10">
          <div className={`w-16 h-16 border-4 ${
            useLightTheme 
              ? 'border-t-purple-600 border-b-purple-600 border-l-gray-200 border-r-gray-200' 
              : 'border-t-amber-600 border-b-amber-600 border-l-gray-600 border-r-gray-600'
          } rounded-full animate-spin mx-auto mb-4`}></div>
          <p className={`text-lg ${useLightTheme ? 'text-gray-700' : 'text-gray-300'}`}>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${useLightTheme ? 'bg-gray-50' : 'bg-gray-900'}`}>
        <BackgroundPattern />
        <div className={`text-center max-w-md p-6 ${useLightTheme ? 'bg-white' : 'bg-gray-800'} rounded-lg shadow-md relative z-10`}>
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className={`text-2xl font-bold ${useLightTheme ? 'text-gray-800' : 'text-gray-100'} mb-2`}>Error Loading Event</h2>
          <p className={`${useLightTheme ? 'text-gray-600' : 'text-gray-300'} mb-4`}>{error}</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className={`px-4 py-2 ${
                useLightTheme 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-amber-600 hover:bg-amber-500'
              } text-white rounded-md transition-colors`}
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.href = '/events'}
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
      <div className={`min-h-screen flex justify-center items-center ${useLightTheme ? 'bg-gray-50' : 'bg-gray-900'}`}>
        <BackgroundPattern />
        <div className={`text-center max-w-md p-6 ${useLightTheme ? 'bg-white' : 'bg-gray-800'} rounded-lg shadow-md relative z-10`}>
          <h2 className={`text-2xl font-bold ${useLightTheme ? 'text-gray-800' : 'text-gray-100'} mb-4`}>Event Not Found</h2>
          <p className={`${useLightTheme ? 'text-gray-600' : 'text-gray-300'} mb-6`}>The event you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => window.location.href = '/events'}
            className={`px-4 py-2 ${
              useLightTheme 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-amber-600 hover:bg-amber-500'
            } text-white rounded-md transition-colors`}
          >
            View All Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${useLightTheme ? 'bg-gray-50' : 'bg-gray-900'}`}>
      {/* Background Pattern */}
      <BackgroundPattern />
      
      <div className="relative z-10">
        {/* Header Section with Hero Image */}
        <div className="relative">
          <div className="h-96 overflow-hidden relative">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img 
              src={event.detail_hero_image || event.image || '/api/placeholder/1200/600'} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="container mx-auto px-4">
            <div className="relative -mt-24 mb-8 z-20">
              <div className={`${useLightTheme ? 'bg-white' : 'bg-gray-800'} shadow-xl mx-auto max-w-4xl rounded-lg`}>
                <div className="p-8">
                  <button 
                    onClick={() => window.location.href = '/events'}
                    className={`inline-flex items-center text-sm ${
                      useLightTheme ? 'text-purple-600' : 'text-amber-400'
                    } mb-4 hover:underline`}
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to All Events
                  </button>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`${
                      useLightTheme ? 'bg-purple-600' : 'bg-amber-600'
                    } text-white px-3 py-1 rounded-full text-sm`}>
                      {event.category || 'Event'}
                    </span>
                    {event.is_featured && (
                      <span className="border border-amber-400 text-amber-600 px-3 py-1 rounded-full text-sm">
                        Featured Event
                      </span>
                    )}
                  </div>
                  
                  <h1 className={`text-3xl md:text-4xl font-bold mb-6 ${
                    useLightTheme ? 'text-gray-800' : 'text-gray-100'
                  }`}>
                    {event.title}
                  </h1>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className={`flex items-center ${useLightTheme ? 'text-gray-700' : 'text-gray-300'}`}>
                      <Calendar size={20} className={`mr-3 ${useLightTheme ? 'text-purple-600' : 'text-amber-400'}`} />
                      <div>
                        <h3 className={`text-sm ${useLightTheme ? 'text-gray-500' : 'text-gray-400'} mb-1`}>Date</h3>
                        <p>{formatDate(event.date)}</p>
                      </div>
                    </div>
                    
                    {event.time && (
                      <div className={`flex items-center ${useLightTheme ? 'text-gray-700' : 'text-gray-300'}`}>
                        <Clock size={20} className={`mr-3 ${useLightTheme ? 'text-purple-600' : 'text-amber-400'}`} />
                        <div>
                          <h3 className={`text-sm ${useLightTheme ? 'text-gray-500' : 'text-gray-400'} mb-1`}>Time</h3>
                          <p>{event.time}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className={`flex items-center ${useLightTheme ? 'text-gray-700' : 'text-gray-300'}`}>
                      <MapPin size={20} className={`mr-3 ${useLightTheme ? 'text-purple-600' : 'text-amber-400'}`} />
                      <div>
                        <h3 className={`text-sm ${useLightTheme ? 'text-gray-500' : 'text-gray-400'} mb-1`}>Location</h3>
                        <p>{event.location || 'Location TBD'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Action Buttons */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    <button 
                      onClick={() => setShowRsvpForm(true)}
                      className={`px-4 py-2 ${
                        useLightTheme 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'bg-amber-600 hover:bg-amber-500'
                      } text-white rounded-md transition-colors flex items-center`}
                    >
                      <Users size={18} className="mr-2" />
                      RSVP Now
                    </button>
                    
                    <div className="relative group">
                      <button 
                        className={`px-4 py-2 ${
                          useLightTheme 
                            ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                            : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        } rounded-md transition-colors flex items-center`}
                      >
                        <CalendarIcon size={18} className="mr-2" />
                        Add to Calendar
                        <ChevronRight size={16} className="ml-1 group-hover:rotate-90 transition-transform" />
                      </button>
                      
                      <div className={`absolute left-0 mt-1 w-48 rounded-md shadow-lg ${
                        useLightTheme ? 'bg-white' : 'bg-gray-800'
                      } ring-1 ring-black ring-opacity-5 z-10 invisible group-hover:visible transition-all opacity-0 group-hover:opacity-100`}>
                        <div className="py-1">
                          <button 
                            onClick={addToGoogleCalendar}
                            className={`px-4 py-2 text-sm ${
                              useLightTheme 
                                ? 'text-gray-700 hover:bg-gray-100' 
                                : 'text-gray-200 hover:bg-gray-700'
                            } flex items-center w-full text-left`}
                          >
                            Google Calendar
                          </button>
                          <button 
                            onClick={generateIcsFile}
                            className={`px-4 py-2 text-sm ${
                              useLightTheme 
                                ? 'text-gray-700 hover:bg-gray-100' 
                                : 'text-gray-200 hover:bg-gray-700'
                            } flex items-center w-full text-left`}
                          >
                            iCal / Outlook
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <button 
                        className={`px-4 py-2 ${
                          useLightTheme 
                            ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                            : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        } rounded-md transition-colors flex items-center`}
                      >
                        <Share2 size={18} className="mr-2" />
                        Share
                        <ChevronRight size={16} className="ml-1 group-hover:rotate-90 transition-transform" />
                      </button>
                      
                      <div className={`absolute left-0 mt-1 w-48 rounded-md shadow-lg ${
                        useLightTheme ? 'bg-white' : 'bg-gray-800'
                      } ring-1 ring-black ring-opacity-5 z-10 invisible group-hover:visible transition-all opacity-0 group-hover:opacity-100`}>
                        <div className="py-1">
                          <a 
                            href={socialShareUrls.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-4 py-2 text-sm ${
                              useLightTheme 
                                ? 'text-gray-700 hover:bg-gray-100' 
                                : 'text-gray-200 hover:bg-gray-700'
                            } flex items-center`}
                          >
                            <Facebook size={16} className="mr-2" /> Facebook
                          </a>
                          <a 
                            href={socialShareUrls.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-4 py-2 text-sm ${
                              useLightTheme 
                                ? 'text-gray-700 hover:bg-gray-100' 
                                : 'text-gray-200 hover:bg-gray-700'
                            } flex items-center`}
                          >
                            <Twitter size={16} className="mr-2" /> Twitter
                          </a>
                          <a 
                            href={socialShareUrls.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-4 py-2 text-sm ${
                              useLightTheme 
                                ? 'text-gray-700 hover:bg-gray-100' 
                                : 'text-gray-200 hover:bg-gray-700'
                            } flex items-center`}
                          >
                            <Linkedin size={16} className="mr-2" /> LinkedIn
                          </a>
                          <a 
                            href={socialShareUrls.email}
                            className={`px-4 py-2 text-sm ${
                              useLightTheme 
                                ? 'text-gray-700 hover:bg-gray-100' 
                                : 'text-gray-200 hover:bg-gray-700'
                            } flex items-center`}
                          >
                            <Mail size={16} className="mr-2" /> Email
                            
                            
                            
                            </a>
                        </div>
                      </div>
                    </div>
                    
                    {event.documents && event.documents.length > 0 && (
                      <button 
                        onClick={() => window.open(event.documents[0].file, '_blank')}
                        className={`px-4 py-2 ${
                          useLightTheme 
                            ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                            : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        } rounded-md transition-colors flex items-center`}
                      >
                        <Download size={18} className="mr-2" />
                        Download Agenda
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Event Details Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className={`${useLightTheme ? 'bg-white' : 'bg-gray-800'} mb-8 rounded-lg shadow`}>
                <div className="p-6 md:p-8">
                  <h2 className={`text-2xl font-bold mb-4 ${useLightTheme ? 'text-gray-800' : 'text-gray-100'}`}>
                    About This Event
                  </h2>
                  
                  <div className={`prose max-w-none ${useLightTheme ? 'text-gray-700' : 'text-gray-300'}`}>
                    {event.detailed_description ? (
                      // If a detailed description is available, render it directly as HTML
                      <div dangerouslySetInnerHTML={renderHTML(event.detailed_description)} />
                    ) : event.description ? (
                      // Fall back to regular description if detailed description is not available
                      <div 
                        dangerouslySetInnerHTML={renderHTML(
                          event.description
                            .split('\n\n')
                            .map(paragraph => `<p>${paragraph}</p>`)
                            .join('')
                        )} 
                      />
                    ) : (
                      <p>No detailed description available for this event.</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Location Map */}
              {event.location && (
                <div className={`${useLightTheme ? 'bg-white' : 'bg-gray-800'} mb-8 rounded-lg shadow`}>
                  <div className="p-6 md:p-8">
                    <h2 className={`text-2xl font-bold mb-4 ${useLightTheme ? 'text-gray-800' : 'text-gray-100'} flex items-center`}>
                      <MapIcon size={24} className={`mr-2 ${useLightTheme ? 'text-purple-600' : 'text-amber-400'}`} />
                      Event Location
                    </h2>
                    
                    <div className="mb-4">
                      <p className="mb-4">{event.location}</p>
                      
                      {/* Interactive Map Placeholder - In a real app, implement Google Maps or similar */}
                      <div className={`${
                        useLightTheme 
                          ? 'bg-gray-100 border-gray-200' 
                          : 'bg-gray-700 border-gray-600'
                        } border h-64 rounded-lg flex items-center justify-center`}>
                        <MapPin size={48} className={`${useLightTheme ? 'text-gray-400' : 'text-gray-500'}`} />
                        <p className={`ml-2 ${useLightTheme ? 'text-gray-500' : 'text-gray-400'}`}>Map view would be displayed here</p>
                      </div>
                      
                      <div className="mt-4">
                        <a 
                          href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${
                            useLightTheme ? 'text-purple-600' : 'text-amber-400'
                          } hover:underline flex items-center`}
                        >
                          <ExternalLink size={16} className="mr-2" />
                          View on Google Maps
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Gallery Section - Enhanced with carousel */}
              {event.gallery && event.gallery.length > 0 && (
                <div className={`${useLightTheme ? 'bg-white' : 'bg-gray-800'} mb-8 rounded-lg shadow`}>
                  <div className="p-6 md:p-8">
                    <h2 className={`text-2xl font-bold mb-6 ${useLightTheme ? 'text-gray-800' : 'text-gray-100'}`}>
                      Event Gallery
                    </h2>
                    
                    <EventGallery gallery={event.gallery} />
                  </div>
                </div>
              )}
              
              {/* Documents Section */}
              {event.documents && event.documents.length > 0 && (
                <div className={`${useLightTheme ? 'bg-white' : 'bg-gray-800'} mb-8 rounded-lg shadow`}>
                  <div className="p-6 md:p-8">
                    <h2 className={`text-2xl font-bold mb-6 ${useLightTheme ? 'text-gray-800' : 'text-gray-100'}`}>
                      Related Documents
                    </h2>
                    
                    <div className="space-y-4">
                      {event.documents.map((doc, index) => (
                        <div 
                          key={index} 
                          className={`p-4 rounded-lg ${
                            useLightTheme 
                              ? 'bg-gray-50 hover:bg-gray-100' 
                              : 'bg-gray-700 hover:bg-gray-600'
                            } transition-colors flex justify-between items-center`}
                        >
                          <div>
                            <h3 className={`font-medium ${useLightTheme ? 'text-gray-800' : 'text-gray-200'}`}>{doc.title}</h3>
                            <p className={`text-sm ${useLightTheme ? 'text-gray-500' : 'text-gray-400'}`}>{doc.description}</p>
                          </div>
                          <a 
                            href={doc.file} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`p-2 rounded-full ${
                              useLightTheme ? 'hover:bg-gray-200' : 'hover:bg-gray-500'
                            } transition-colors`}
                          >
                            <Download size={18} className={`${useLightTheme ? 'text-purple-600' : 'text-amber-400'}`} />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Comments Section - New */}
              <div className={`${useLightTheme ? 'bg-white' : 'bg-gray-800'} mb-8 rounded-lg shadow`}>
                <div className="p-6 md:p-8">
                  <h2 className={`text-2xl font-bold mb-6 ${useLightTheme ? 'text-gray-800' : 'text-gray-100'} flex items-center`}>
                    <MessageCircle size={24} className={`mr-2 ${useLightTheme ? 'text-purple-600' : 'text-amber-400'}`} />
                    Discussion
                  </h2>
                  
                  <div className="mb-6">
                    <textarea
                      className={`w-full border ${
                        useLightTheme 
                          ? 'border-gray-300 text-gray-700 focus:ring-purple-500 focus:border-purple-500' 
                          : 'border-gray-600 bg-gray-700 text-gray-200 focus:ring-amber-500 focus:border-amber-500'
                        } rounded-lg p-3 focus:ring-2`}
                      rows="3"
                      placeholder="Share your thoughts about this event..."
                    ></textarea>
                    <div className="mt-2 flex justify-end">
                      <button className={`px-4 py-2 ${
                        useLightTheme 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'bg-amber-600 hover:bg-amber-500'
                        } text-white rounded-md transition-colors`}>
                        Post Comment
                      </button>
                    </div>
                  </div>
                  
                  <div className={`space-y-4 border-t ${
                    useLightTheme ? 'border-gray-100' : 'border-gray-700'
                  } pt-4`}>
                    <p className={`${
                      useLightTheme ? 'text-gray-500' : 'text-gray-400'
                    } text-center py-4`}>Be the first to comment on this event!</p>
                    {/* Comments would be displayed here */}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              {/* RSVP Card - New */}
              <div className={`${useLightTheme ? 'bg-white' : 'bg-gray-800'} mb-8 rounded-lg shadow`}>
                <div className="p-6">
                  <h2 className={`text-xl font-bold mb-4 ${useLightTheme ? 'text-gray-800' : 'text-gray-100'} flex items-center`}>
                    <Users size={20} className={`mr-2 ${useLightTheme ? 'text-purple-600' : 'text-amber-400'}`} />
                    Join This Event
                  </h2>
                  
                  <p className={`mb-4 ${useLightTheme ? 'text-gray-700' : 'text-gray-300'}`}>
                    Register your interest in attending this event. We'll send you updates and reminders.
                  </p>
                  
                  <button 
                    onClick={() => setShowRsvpForm(true)}
                    className={`w-full py-2 ${
                      useLightTheme 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-amber-600 hover:bg-amber-500'
                      } text-white rounded-md transition-colors`}
                  >
                    RSVP Now
                  </button>
                </div>
              </div>
              
              {/* Organizer Card */}
              <div className={`${useLightTheme ? 'bg-white' : 'bg-gray-800'} mb-8 rounded-lg shadow`}>
                <div className="p-6">
                  <h2 className={`text-xl font-bold mb-4 ${useLightTheme ? 'text-gray-800' : 'text-gray-100'} flex items-center`}>
                    <User size={20} className={`mr-2 ${useLightTheme ? 'text-purple-600' : 'text-amber-400'}`} />
                    Organizer
                  </h2>
                  
                  <p className={`mb-4 ${useLightTheme ? 'text-gray-700' : 'text-gray-300'}`}>{event.organizer || 'TechEthica'}</p>
                  
                  <a
                    href="/contact-us"
                    className={`inline-flex items-center text-sm ${
                      useLightTheme ? 'text-purple-600' : 'text-amber-400'
                    } hover:underline`}
                  >
                    <ExternalLink size={16} className="mr-1" />
                    Contact Organizer
                  </a>
                </div>
              </div>
              
              {/* Attendees Card */}
              {event.attendees && event.attendees.length > 0 && (
                <div className={`${useLightTheme ? 'bg-white' : 'bg-gray-800'} mb-8 rounded-lg shadow`}>
                  <div className="p-6">
                    <h2 className={`text-xl font-bold mb-4 ${useLightTheme ? 'text-gray-800' : 'text-gray-100'} flex items-center`}>
                      <Users size={20} className={`mr-2 ${useLightTheme ? 'text-purple-600' : 'text-amber-400'}`} />
                      Distinguished Guests
                    </h2>
                    
                    <AttendeesList attendees={event.attendees} />
                  </div>
                </div>
              )}
              
              {/* Related Events - New */}
              {relatedEvents && relatedEvents.length > 0 && (
                <div className={`${useLightTheme ? 'bg-white' : 'bg-gray-800'} mb-8 rounded-lg shadow`}>
                  <div className="p-6">
                    <h2 className={`text-xl font-bold mb-4 ${useLightTheme ? 'text-gray-800' : 'text-gray-100'}`}>
                      Related Events
                    </h2>
                    
                    <div className="space-y-3">
                      {relatedEvents.map((event, index) => (
                        <RelatedEventCard key={index} event={event} />
                      ))}
                    </div>
                    
                    <a
                      href="/events"
                      className={`mt-4 inline-flex items-center text-sm ${
                        useLightTheme ? 'text-purple-600' : 'text-amber-400'
                      } hover:underline`}
                    >
                      <ArrowRight size={16} className="mr-1" />
                      View All Events
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-teal-800 to-green-900 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-teal-100 mb-8">Subscribe to our newsletter to receive notifications about upcoming events and latest news</p>
              
              <form>
                <div className="flex flex-col sm:flex-row sm:items-center max-w-md mx-auto gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-800"
                  />
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-amber-500 text-gray-900 font-semibold rounded-lg hover:bg-amber-400 transition-colors"
                  >
                    Subscribe
                  </button>
                </div>
                
                <p className="text-teal-200 text-sm mt-4">We respect your privacy. Unsubscribe at any time.</p>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* RSVP Modal */}
      {showRsvpForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowRsvpForm(false)}></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className={`inline-block align-bottom ${
              useLightTheme ? 'bg-white' : 'bg-gray-800'
            } rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}>
              <div className={`${
                useLightTheme ? 'bg-white' : 'bg-gray-800'
              } px-4 pt-5 pb-4 sm:p-6 sm:pb-4`}>
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className={`${
                      useLightTheme ? 'bg-white text-gray-400 hover:text-gray-500' : 'bg-gray-800 text-gray-400 hover:text-gray-300'
                    } rounded-md focus:outline-none`}
                    onClick={() => setShowRsvpForm(false)}
                  >
                    <span className="sr-only">Close</span>
                    <X size={24} />
                  </button>
                </div>
                
                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
                    useLightTheme ? 'bg-purple-100' : 'bg-amber-900/30'
                  } sm:mx-0 sm:h-10 sm:w-10`}>
                    <Users size={24} className={`${useLightTheme ? 'text-purple-600' : 'text-amber-400'}`} />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className={`text-lg leading-6 font-medium ${
                      useLightTheme ? 'text-gray-900' : 'text-gray-100'
                    }`} id="modal-title">
                      RSVP for Event
                    </h3>
                    <div className="mt-2">
                      <p className={`text-sm ${useLightTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                        Please fill out this form to register your interest in attending "{event.title}".
                      </p>
                    </div>
                  </div>
                </div>
                
                {rsvpSubmitted ? (
                  <div className="mt-6 text-center">
                    <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                      useLightTheme ? 'bg-green-100' : 'bg-green-900/30'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${useLightTheme ? 'text-green-600' : 'text-green-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className={`mt-3 text-lg font-medium ${useLightTheme ? 'text-gray-900' : 'text-gray-100'}`}>Registration Successful!</h3>
                    <p className={`mt-2 text-sm ${useLightTheme ? 'text-gray-500' : 'text-gray-400'}`}>Thank you for your interest. We'll send you an email with further details.</p>
                  </div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className="mt-6">
                    <div className="mb-4">
                      <label htmlFor="name" className={`block text-sm font-medium ${useLightTheme ? 'text-gray-700' : 'text-gray-300'}`}>Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={rsvpData.name}
                        onChange={handleRsvpChange}
                        className={`mt-1 block w-full border ${
                          useLightTheme 
                            ? 'border-gray-300 focus:ring-purple-500 focus:border-purple-500' 
                            : 'border-gray-600 bg-gray-700 text-white focus:ring-amber-500 focus:border-amber-500'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 sm:text-sm`}
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="email" className={`block text-sm font-medium ${useLightTheme ? 'text-gray-700' : 'text-gray-300'}`}>Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={rsvpData.email}
                        onChange={handleRsvpChange}
                        className={`mt-1 block w-full border ${
                          useLightTheme 
                            ? 'border-gray-300 focus:ring-purple-500 focus:border-purple-500' 
                            : 'border-gray-600 bg-gray-700 text-white focus:ring-amber-500 focus:border-amber-500'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 sm:text-sm`}
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className={`block text-sm font-medium ${useLightTheme ? 'text-gray-700' : 'text-gray-300'}`}>Will you be attending?</label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center">
                          <input
                            id="attending-yes"
                            name="attending"
                            type="radio"
                            value="yes"
                            checked={rsvpData.attending === 'yes'}
                            onChange={handleRsvpChange}
                            className={`focus:ring-2 h-4 w-4 ${
                              useLightTheme 
                                ? 'text-purple-600 focus:ring-purple-500 border-gray-300' 
                                : 'text-amber-600 focus:ring-amber-500 border-gray-600'
                            }`}
                          />
                          <label htmlFor="attending-yes" className={`ml-3 block text-sm ${useLightTheme ? 'text-gray-700' : 'text-gray-300'}`}>Yes, I'll be there</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="attending-maybe"
                            name="attending"
                            type="radio"
                            value="maybe"
                            checked={rsvpData.attending === 'maybe'}
                            onChange={handleRsvpChange}
                            className={`focus:ring-2 h-4 w-4 ${
                              useLightTheme 
                                ? 'text-purple-600 focus:ring-purple-500 border-gray-300' 
                                : 'text-amber-600 focus:ring-amber-500 border-gray-600'
                            }`}
                          />
                          <label htmlFor="attending-maybe" className={`ml-3 block text-sm ${useLightTheme ? 'text-gray-700' : 'text-gray-300'}`}>I'm not sure yet</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`${
                      useLightTheme ? 'bg-gray-50' : 'bg-gray-700'
                    } px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse`}>
                      <button
                        type="submit"
                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                          useLightTheme 
                            ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500' 
                            : 'bg-amber-600 hover:bg-amber-500 focus:ring-amber-500'
                          } text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                      >
                        Submit RSVP
                      </button>
                      <button
                        type="button"
                        className={`mt-3 w-full inline-flex justify-center rounded-md border ${
                          useLightTheme 
                            ? 'border-gray-300 shadow-sm bg-white text-gray-700 hover:bg-gray-50' 
                            : 'border-gray-600 shadow-sm bg-gray-800 text-gray-300 hover:bg-gray-700'
                          } px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                        onClick={() => setShowRsvpForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={closeModal}>
          <div className="relative max-w-4xl max-h-full p-4">
            <button 
              className="absolute -top-2 -right-2 p-2 bg-white rounded-full text-gray-800 hover:bg-gray-200 transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
            >
              <X size={20} />
            </button>
            
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/40 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              
              <img 
                src={selectedImage.image} 
                alt={selectedImage.caption || "Gallery image"} 
                className="max-w-full max-h-[80vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/40 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            
            {selectedImage.caption && (
              <div className="bg-white/80 backdrop-blur-sm p-3 text-center mt-2 text-gray-800 rounded">
                {selectedImage.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;