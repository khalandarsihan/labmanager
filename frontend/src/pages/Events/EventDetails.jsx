import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, ArrowLeft, Users, Share2, Download, ExternalLink, X } from 'lucide-react';

const EventDetails = ({ eventId: propEventId }) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  
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
  
  // Open image modal
  const openModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  // Close image modal
  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
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
            <div key={index} className="p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-green-200 transition-colors">
              <h5 className="font-semibold text-gray-800">{attendee.name1}</h5>
              <p className="text-gray-600 text-sm">{attendee.title}</p>
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

    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {gallery.map((item, index) => (
            <div 
              key={index} 
              className="relative rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => openModal(item)}
            >
              <img 
                src={item.image || '/api/placeholder/600/400'} 
                alt={item.caption || `Gallery image ${index + 1}`}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gray-900/70 text-white p-2 text-sm">
                  {item.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
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
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
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
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => window.location.href = '/events'}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            View All Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-5 pointer-events-none"></div>
      
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
              <div className="bg-white shadow-xl mx-auto max-w-4xl rounded-lg">
                <div className="p-8">
                  <button 
                    onClick={() => window.location.href = '/events'}
                    className="inline-flex items-center text-sm text-green-600 mb-4 hover:underline"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to All Events
                  </button>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">{event.category || 'Event'}</span>
                    {event.is_featured && (
                      <span className="border border-amber-400 text-amber-600 px-3 py-1 rounded-full text-sm">Featured Event</span>
                    )}
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                    {event.title}
                  </h1>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="flex items-center text-gray-700">
                      <Calendar size={20} className="mr-3 text-green-600" />
                      <div>
                        <h3 className="text-sm text-gray-500 mb-1">Date</h3>
                        <p>{formatDate(event.date)}</p>
                      </div>
                    </div>
                    
                    {event.time && (
                      <div className="flex items-center text-gray-700">
                        <Clock size={20} className="mr-3 text-green-600" />
                        <div>
                          <h3 className="text-sm text-gray-500 mb-1">Time</h3>
                          <p>{event.time}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center text-gray-700">
                      <MapPin size={20} className="mr-3 text-green-600" />
                      <div>
                        <h3 className="text-sm text-gray-500 mb-1">Location</h3>
                        <p>{event.location || 'Location TBD'}</p>
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
              <div className="bg-white mb-8 rounded-lg shadow">
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    About This Event
                  </h2>
                  
                  <div className="prose max-w-none text-gray-700">
                    {event.description ? (
                      event.description.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">{paragraph}</p>
                      ))
                    ) : (
                      <p>No detailed description available for this event.</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Gallery Section */}
              {event.gallery && event.gallery.length > 0 && (
                <div className="bg-white mb-8 rounded-lg shadow">
                  <div className="p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                      Event Gallery
                    </h2>
                    
                    <EventGallery gallery={event.gallery} />
                  </div>
                </div>
              )}
              
              {/* Documents Section */}
              {event.documents && event.documents.length > 0 && (
                <div className="bg-white mb-8 rounded-lg shadow">
                  <div className="p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                      Related Documents
                    </h2>
                    
                    <div className="space-y-4">
                      {event.documents.map((doc, index) => (
                        <div 
                          key={index} 
                          className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
                        >
                          <div>
                            <h3 className="font-medium text-gray-800">{doc.title}</h3>
                            <p className="text-sm text-gray-500">{doc.description}</p>
                          </div>
                          <a 
                            href={doc.file} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            <Download size={18} className="text-green-600" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div>
              {/* Organizer Card */}
              <div className="bg-white mb-8 rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                    <User size={20} className="mr-2 text-green-600" />
                    Organizer
                  </h2>
                  
                  <p className="mb-4 text-gray-700">{event.organizer || 'TechEthica'}</p>
                  
                  <a
                    href="/contact-us"
                    className="inline-flex items-center text-sm text-green-600 hover:underline"
                  >
                    <ExternalLink size={16} className="mr-1" />
                    Contact Organizer
                  </a>
                </div>
              </div>
              
              {/* Attendees Card */}
              {event.attendees && event.attendees.length > 0 && (
                <div className="bg-white mb-8 rounded-lg shadow">
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                      <Users size={20} className="mr-2 text-green-600" />
                      Distinguished Guests
                    </h2>
                    
                    <AttendeesList attendees={event.attendees} />
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
            <img 
              src={selectedImage.image} 
              alt={selectedImage.caption || "Gallery image"} 
              className="max-w-full max-h-[80vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
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