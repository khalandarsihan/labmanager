import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Share2,
  Download,
  MessageCircle,
  AlertTriangle
} from 'lucide-react';
import BackgroundPattern from '../../components/ui/BackgroundPattern';
import EventGallery from './components/EventGallery';
import AttendeesList from './components/AttendeesList';
import ThemeSwitcher from '../../components/ui/ThemeSwitcher'; // Import ThemeSwitcher
import { useTheme } from '../../components/ui/ThemeContext'; // Import useTheme


const EventDetails = () => {
  // Get theme from context
  const { useLightTheme, toggleTheme, themeStyles } = useTheme();
  
  // State management for gallery and data
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', comment: '' });
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  
  const galleryRef = useRef(null);
  
  // Get event ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  
  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) {
        setError('Event ID not provided in URL');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(`/api/method/labmanager.api.events.get_event_details?event_id=${eventId}`);
        const data = await response.json();
        
        if (data.message && data.message.status === 'success') {
          setEvent(data.message.event);
        } else {
          setError(data.message?.message || 'Failed to load event details');
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Error fetching event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCommentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle comment form submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentForm.name || !commentForm.email || !commentForm.comment) {
      setSubmitStatus({
        success: false,
        message: 'Please fill in all fields'
      });
      return;
    }
    
    try {
      const response = await fetch('/api/method/labmanager.api.events.add_event_comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: eventId,
          name: commentForm.name,
          email: commentForm.email,
          comment: commentForm.comment
        }),
      });
      
      const data = await response.json();
      
      if (data.message && data.message.status === 'success') {
        setSubmitStatus({
          success: true,
          message: 'Your comment has been submitted for review'
        });
        // Clear form
        setCommentForm({ name: '', email: '', comment: '' });
      } else {
        setSubmitStatus({
          success: false,
          message: data.message?.message || 'Failed to submit comment'
        });
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
      setSubmitStatus({
        success: false,
        message: 'Error submitting comment. Please try again later.'
      });
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'Date: Not Available';
    
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      return dateString;
    }
  };
  
  // Render HTML content safely
  const renderHTML = (html) => {
    return { __html: html };
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundPattern />
        <ThemeSwitcher useLightTheme={useLightTheme} toggleTheme={toggleTheme} />
        <div className="text-center relative z-10">
          <div className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 ${useLightTheme ? 'border-teal-600' : 'border-amber-500'} mx-auto mb-4`}></div>
          <h2 className={`text-xl ${useLightTheme ? 'text-gray-700' : 'text-gray-200'}`}>Loading event details...</h2>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundPattern />
        <ThemeSwitcher useLightTheme={useLightTheme} toggleTheme={toggleTheme} />
        <div className={`max-w-md w-full ${useLightTheme ? 'bg-white' : 'bg-gray-800'} rounded-lg shadow-md p-6 text-center relative z-10`}>
          <AlertTriangle size={48} className={`${useLightTheme ? 'text-red-500' : 'text-red-400'} mx-auto mb-4`} />
          <h2 className={`text-2xl font-bold ${useLightTheme ? 'text-gray-800' : 'text-white'} mb-2`}>Error Loading Event</h2>
          <p className={`${useLightTheme ? 'text-gray-600' : 'text-gray-300'} mb-4`}>{error}</p>
          <button 
            onClick={() => window.location.href = '/events'}
            className={`inline-flex items-center ${useLightTheme ? 'text-teal-600' : 'text-amber-400'} hover:underline`}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to All Events
          </button>
        </div>
      </div>
    );
  }

  // No event found
  if (!event) {
    return (
      <div className={`min-h-screen ${useLightTheme ? 'bg-gray-50' : 'bg-gray-900'} flex items-center justify-center`}>
        <BackgroundPattern />
        <ThemeSwitcher useLightTheme={useLightTheme} toggleTheme={toggleTheme} />
        <div className={`max-w-md w-full ${useLightTheme ? 'bg-white' : 'bg-gray-800'} rounded-lg shadow-md p-6 text-center relative z-10`}>
          <Calendar size={48} className={`${useLightTheme ? 'text-gray-400' : 'text-gray-500'} mx-auto mb-4`} />
          <h2 className={`text-2xl font-bold ${useLightTheme ? 'text-gray-800' : 'text-white'} mb-2`}>Event Not Found</h2>
          <p className={`${useLightTheme ? 'text-gray-600' : 'text-gray-300'} mb-4`}>The event you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => window.location.href = '/events'}
            className={`inline-flex items-center ${useLightTheme ? 'text-teal-600' : 'text-amber-400'} hover:underline`}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to All Events
          </button>
        </div>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen">
      <BackgroundPattern />
      
      {/* Theme Switcher */}
      <ThemeSwitcher useLightTheme={useLightTheme} toggleTheme={toggleTheme} />
      
      <div className="relative z-10">
        {/* Header with event title */}
        <div className="bg-gradient-to-r from-teal-800 to-green-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <button 
                onClick={() => window.location.href = '/events'}
                className="inline-flex items-center text-teal-100 mb-6 hover:underline"
              >
                <ArrowLeft size={18} className="mr-2" />
                Back to All Events
              </button>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm">
                  {event.category || 'Event'}
                </span>
                {event.is_featured && (
                  <span className="border border-amber-300 text-amber-100 px-3 py-1 rounded-full text-sm">
                    Featured Event
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                {event.title}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center text-teal-100">
                  <Calendar size={20} className="mr-3 text-teal-200" />
                  <div>
                    <h3 className="text-sm text-teal-200 mb-1">Date</h3>
                    <p>{formatDate(event.date)}</p>
                  </div>
                </div>
                
                {event.time && (
                  <div className="flex items-center text-teal-100">
                    <Clock size={20} className="mr-3 text-teal-200" />
                    <div>
                      <h3 className="text-sm text-teal-200 mb-1">Time</h3>
                      <p>{event.time}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center text-teal-100">
                  <MapPin size={20} className="mr-3 text-teal-200" />
                  <div>
                    <h3 className="text-sm text-teal-200 mb-1">Location</h3>
                    <p>{event.location || 'Location not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Gallery Section */}
            {event.gallery && event.gallery.length > 0 && (
              <div className={`${themeStyles.card.bg} rounded-lg shadow-md overflow-hidden mb-8 ${themeStyles.card.border} border`}>
                <EventGallery
                  gallery={event.gallery}
                  currentImageIndex={currentImageIndex}
                  setCurrentImageIndex={setCurrentImageIndex}
                  galleryRef={galleryRef}
                />
              </div>
            )}
            
            {/* Event Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Main content - event description */}
              <div className="lg:col-span-2">
                <div className={`${themeStyles.card.bg} rounded-lg shadow-md p-6 mb-6 ${themeStyles.card.border} border`}>
                  <h2 className={`text-2xl font-bold mb-4 ${themeStyles.subheading}`}>
                    About This Event
                  </h2>
                  
                  <div className={`prose max-w-none ${themeStyles.text.secondary}`}>
                    {event.detailed_description ? (
                      <div dangerouslySetInnerHTML={renderHTML(event.detailed_description)} />
                    ) : event.description ? (
                      <p>{event.description}</p>
                    ) : (
                      <p>No detailed description available for this event.</p>
                    )}
                  </div>
                </div>

                
                {/* Documents Section */}
                {event.documents && event.documents.length > 0 && (
                  <div className={`${themeStyles.card.bg} rounded-lg shadow-md p-6 mb-6 ${themeStyles.card.border} border`}>
                    <h2 className={`text-xl font-bold mb-4 ${themeStyles.subheading} flex items-center`}>
                      <Download size={20} className="mr-2 text-teal-600" />
                      Event Materials
                    </h2>
                    
                    <div className="space-y-3">
                      {event.documents.map((doc, index) => (
                        <div 
                          key={index} 
                          className={`p-4 rounded-lg ${useLightTheme ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-700 hover:bg-gray-600'} transition-colors flex justify-between items-center`}
                        >
                          <div>
                            <h3 className={`font-medium ${themeStyles.text.primary}`}>{doc.title}</h3>
                            <p className={`text-sm ${themeStyles.text.light}`}>{doc.description}</p>
                          </div>
                          <a 
                            href={doc.file} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`p-2 rounded-full ${useLightTheme ? 'hover:bg-gray-200' : 'hover:bg-gray-500'} transition-colors`}
                          >
                            <Download size={18} className={`${useLightTheme ? 'text-teal-600' : 'text-amber-400'}`} />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Social sharing */}
                <div className={`${themeStyles.card.bg} rounded-lg shadow-md p-6 ${themeStyles.card.border} border`}>
                  <h2 className={`text-xl font-bold mb-4 ${themeStyles.subheading} flex items-center`}>
                    <Share2 size={20} className={`mr-2 ${useLightTheme ? 'text-teal-600' : 'text-amber-400'}`} />
                    Share This Event
                  </h2>
                  
                  <div className="flex flex-wrap gap-3">
                    <button className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Facebook
                    </button>
                    <button className="inline-flex items-center justify-center px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600">
                      Twitter
                    </button>
                    <button className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                      WhatsApp
                    </button>
                    <button className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                      Email
                    </button>
                  </div>
                </div>
                {/* Theme-specific CSS classes for event description content */}
<style jsx>{`
  .theme-highlight {
    color: ${useLightTheme ? '#6b21a8' : '#fcd34d'} !important;
    transition: color 0.3s ease;
  }
  
  .section-title {
    color: ${useLightTheme ? '#7e22ce' : '#fcd34d'} !important;
    transition: color 0.3s ease;
    font-weight: bold;
  }
  
  .attendee-name {
    color: ${useLightTheme ? '#6b21a8' : '#fcd34d'} !important;
    transition: color 0.3s ease;
  }
  
  .attendee-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  @media (min-width: 640px) {
    .attendee-list {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  .attendee-item {
    background-color: ${useLightTheme ? 'rgba(255, 255, 255, 0.4)' : 'rgba(31, 41, 55, 0.3)'};
    backdrop-filter: blur(4px);
    color: ${useLightTheme ? '#374151' : '#e5e7eb'};
    padding: 1rem;
    border-radius: 0.375rem;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  .attendee-title {
    font-size: 0.875rem;
    color: ${useLightTheme ? '#4b5563' : '#9ca3af'};
  }
  
  .hashtags {
    font-size: 0.8rem;
    color: ${useLightTheme ? '#4b5563' : '#9ca3af'};
    word-wrap: break-word;
  }
  
  /* Extra styles for better mobile experience */
  .section {
    margin-bottom: 1.5rem;
  }
  
  /* Make sure the styles work well in the context of the card */
  .prose {
    max-width: none;
  }
  
  .prose strong {
    font-weight: 600;
  }
  
  /* Ensure hashtags break properly on mobile */
  .hashtags {
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
  }
`}</style>
              </div>
              
              {/* Sidebar */}
              <div>
                {/* Distinguished Guests/Attendees Section */}
                {event.attendees && event.attendees.length > 0 && (
                  <div className={`${themeStyles.card.bg} rounded-lg shadow-md p-6 mb-6 ${themeStyles.card.border} border`}>
                    <h2 className={`text-xl font-bold mb-4 ${themeStyles.subheading}`}>
                      Distinguished Guests
                    </h2>
                    
                    <AttendeesList attendees={event.attendees} />
                  </div>
                )}
                
                {/* Recent Events Section */}
                <div className={`${themeStyles.card.bg} rounded-lg shadow-md p-6 ${themeStyles.card.border} border`}>
                  <h2 className={`text-xl font-bold mb-4 ${themeStyles.subheading}`}>
                    More Recent Events
                  </h2>
                  
                  <div className="space-y-4">
                    <div className={`flex items-center p-3 rounded-lg hover:bg-gray-50 border ${useLightTheme ? 'border-gray-100 hover:bg-gray-50' : 'border-gray-700 hover:bg-gray-700'}`}>
                      <img 
                        src="/api/placeholder/100/100" 
                        alt="Event thumbnail"
                        className="w-16 h-16 object-cover rounded mr-3"
                      />
                      <div>
                        <h5 className={`font-medium ${themeStyles.text.primary} line-clamp-1`}>
                          Annual Science Exhibition
                        </h5>
                        <div className={`flex items-center text-sm ${themeStyles.text.light}`}>
                          <Calendar size={14} className="mr-1" />
                          March 15, 2025
                        </div>
                        <a 
                          href="/event-details?id=annual-science-exhibition"
                          className={`text-sm font-medium ${useLightTheme ? 'text-teal-600' : 'text-amber-400'} hover:underline`}
                        >
                          View details
                        </a>
                      </div>
                    </div>
                    
                    <div className={`flex items-center p-3 rounded-lg hover:bg-gray-50 border ${useLightTheme ? 'border-gray-100 hover:bg-gray-50' : 'border-gray-700 hover:bg-gray-700'}`}>
                      <img 
                        src="/api/placeholder/100/100" 
                        alt="Event thumbnail"
                        className="w-16 h-16 object-cover rounded mr-3"
                      />
                      <div>
                        <h5 className={`font-medium ${themeStyles.text.primary} line-clamp-1`}>
                          Graduation Ceremony 2025
                        </h5>
                        <div className={`flex items-center text-sm ${themeStyles.text.light}`}>
                          <Calendar size={14} className="mr-1" />
                          March 3, 2025
                        </div>
                        <a 
                          href="/event-details?id=graduation-ceremony"
                          className={`text-sm font-medium ${useLightTheme ? 'text-teal-600' : 'text-amber-400'} hover:underline`}
                        >
                          View details
                        </a>
                      </div>
                    </div>
                    
                    <div className={`flex items-center p-3 rounded-lg hover:bg-gray-50 border ${useLightTheme ? 'border-gray-100 hover:bg-gray-50' : 'border-gray-700 hover:bg-gray-700'}`}>
                      <img 
                        src="/api/placeholder/100/100" 
                        alt="Event thumbnail"
                        className="w-16 h-16 object-cover rounded mr-3"
                      />
                      <div>
                        <h5 className={`font-medium ${themeStyles.text.primary} line-clamp-1`}>
                          Faculty Development Program
                        </h5>
                        <div className={`flex items-center text-sm ${themeStyles.text.light}`}>
                          <Calendar size={14} className="mr-1" />
                          February 20, 2025
                        </div>
                        <a 
                          href="/event-details?id=faculty-development-program"
                          className={`text-sm font-medium ${useLightTheme ? 'text-teal-600' : 'text-amber-400'} hover:underline`}
                        >
                          View details
                        </a>
                      </div>
                    </div>
                    
                    <a
                      href="/events"
                      className={`inline-flex items-center ${useLightTheme ? 'text-teal-600' : 'text-amber-400'} hover:underline`}
                    >
                      View all events
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Comments Section */}
            <div className={`${themeStyles.card.bg} rounded-lg shadow-md p-6 mb-8 ${themeStyles.card.border} border`}>
              <h2 className={`text-xl font-bold mb-4 ${themeStyles.subheading} flex items-center`}>
                <MessageCircle size={20} className={`mr-2 ${useLightTheme ? 'text-teal-600' : 'text-amber-400'}`} />
                Comments & Feedback
              </h2>
              
              <div className="space-y-4">
                {/* Example comments - These would come from API in a full implementation */}
                <div className={`border-b ${useLightTheme ? 'border-gray-100' : 'border-gray-700'} pb-4`}>
                  <div className="flex justify-between mb-2">
                    <div>
                      <span className={`font-medium ${themeStyles.text.primary}`}>Ravi Sharma</span>
                      <span className={`text-sm ${themeStyles.text.light} ml-2`}>Student</span>
                    </div>
                    <span className={`text-sm ${themeStyles.text.light}`}>April 26, 2025</span>
                  </div>
                  <p className={themeStyles.text.secondary}>The new website looks amazing! It's much easier to navigate and find information about courses.</p>
                </div>
                
                <div className={`border-b ${useLightTheme ? 'border-gray-100' : 'border-gray-700'} pb-4`}>
                  <div className="flex justify-between mb-2">
                    <div>
                      <span className={`font-medium ${themeStyles.text.primary}`}>Dr. Meena Patel</span>
                      <span className={`text-sm ${themeStyles.text.light} ml-2`}>Faculty Member</span>
                    </div>
                    <span className={`text-sm ${themeStyles.text.light}`}>April 25, 2025</span>
                  </div>
                  <p className={themeStyles.text.secondary}>Congratulations on the successful launch! The new logo perfectly represents our institution's values.</p>
                </div>
                
                {/* Add comment form */}
                <div className="mt-6">
                  <h3 className={`text-lg font-medium ${themeStyles.text.primary} mb-3`}>Leave a Comment</h3>
                  
                  {submitStatus.message && (
                    <div className={`p-3 mb-4 rounded-lg ${
                      submitStatus.success ? 
                        useLightTheme ? 'bg-green-100 text-green-800' : 'bg-green-900/30 text-green-300'
                        : useLightTheme ? 'bg-red-100 text-red-800' : 'bg-red-900/30 text-red-300'
                    }`}>
                      {submitStatus.message}
                    </div>
                  )}
                  
                  <form onSubmit={handleCommentSubmit}>
                    <textarea
                      name="comment"
                      value={commentForm.comment}
                      onChange={handleInputChange}
                      className={`w-full border ${
                        useLightTheme 
                          ? 'border-gray-300 focus:ring-teal-500 focus:border-teal-500' 
                          : 'border-gray-600 bg-gray-700/50 text-white focus:ring-amber-400 focus:border-amber-400'
                      } rounded-lg p-3 focus:ring-2`}
                      rows="3"
                      placeholder="Share your thoughts about this event..."
                    ></textarea>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <input
                        type="text"
                        name="name"
                        value={commentForm.name}
                        onChange={handleInputChange}
                        className={`border ${
                          useLightTheme 
                            ? 'border-gray-300 focus:ring-teal-500 focus:border-teal-500' 
                            : 'border-gray-600 bg-gray-700/50 text-white focus:ring-amber-400 focus:border-amber-400'
                        } rounded-lg p-2 focus:ring-2`}
                        placeholder="Your Name"
                      />
                      <input
                        type="email"
                        name="email"
                        value={commentForm.email}
                        onChange={handleInputChange}
                        className={`border ${
                          useLightTheme 
                            ? 'border-gray-300 focus:ring-teal-500 focus:border-teal-500' 
                            : 'border-gray-600 bg-gray-700/50 text-white focus:ring-amber-400 focus:border-amber-400'
                        } rounded-lg p-2 focus:ring-2`}
                        placeholder="Your Email"
                      />
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button 
                        type="submit" 
                        className={`px-4 py-2 ${
                          useLightTheme 
                            ? 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500' 
                            : 'bg-amber-600 hover:bg-amber-500 focus:ring-amber-500'
                        } text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2`}
                      >
                        Post Comment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-teal-800 to-green-900 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-teal-100 mb-8">Subscribe to our newsletter to receive updates about TechEthica's events and news</p>
              
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
    </div>
    
  );

};


export default EventDetails;