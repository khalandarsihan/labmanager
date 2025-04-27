import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Clock, Calendar, MapPin, Search, Filter, X } from 'lucide-react';

const EventsPage = () => {
  // State for events data
  const [events, setEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;
  
  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Use the Frappe API endpoint for events
        const response = await fetch('/api/method/labmanager.api.events.get_events');
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        console.log("API Response:", data); // Debugging

        // Check if we have events from the API
        if (data.message && data.message.status === 'success' && data.message.events) {
          setEvents(data.message.events);
          // Set the first event as featured or pick one marked as featured
          const featured = data.message.events.find(event => event.is_featured) || 
                           (data.message.events.length > 0 ? data.message.events[0] : null);
          setFeaturedEvent(featured);
        } else {
          // Show error if no events found
          setError('No events found or API returned an unexpected response');
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  // Filter events based on search and category filter
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesFilter = 
      activeFilter === 'all' || 
      (event.category && event.category.toLowerCase() === activeFilter.toLowerCase());
      
    return matchesSearch && matchesFilter;
  });
  
  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  
  // Generate category list from events
  const categories = ['all', ...new Set(events
    .filter(event => event.category) // Filter out events without category
    .map(event => event.category.toLowerCase()))
  ];
  
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
  
  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page on new filter
  };
  
  // Handle clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setActiveFilter('all');
    setCurrentPage(1);
  };

  // Event Card Component
//   const EventCard = ({ event }) => {
//     return (
//       <div className="overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-100 bg-white flex flex-col h-full transform hover:-translate-y-1 duration-300 rounded-lg">
//         <div className="relative h-48">
//           <img
//             src={event.image || '/api/placeholder/600/400'}
//             alt={event.title}
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute top-3 right-3">
//             <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded">
//               {event.category || 'Event'}
//             </span>
//           </div>
//         </div>
        
//         <div className="p-5 flex-grow flex flex-col">
//           <div className="flex items-center mb-3 text-gray-500">
//             <Calendar size={16} className="mr-2" />
//             <span className="text-sm">{formatDate(event.date)}</span>
//           </div>
          
//           <h3 className="text-xl font-bold mb-3 text-gray-800">
//             {event.title}
//           </h3>
          
//           <p className="mb-4 flex-grow line-clamp-3 text-gray-600">
//             {event.description || 'No description available for this event.'}
//           </p>
          
//           <div className="flex items-center mb-4 text-gray-500">
//             <MapPin size={16} className="mr-2" />
//             <span className="text-sm">{event.location || 'Location TBD'}</span>
//           </div>
          
//           <button
//             onClick={() => window.location.href = `/event-details?id=${event.id || event.name}`}
//             className="mt-auto inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//           >
//             View Details
//             <ArrowRight size={16} className="ml-2" />
//           </button>
//         </div>
//       </div>
//     );
//   };

// Update the EventCard component in EventPage.jsx to use card_image

// EventCard Component
const EventCard = ({ event }) => {
    return (
      <div className="overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-100 bg-white flex flex-col h-full transform hover:-translate-y-1 duration-300 rounded-lg">
        <div className="relative h-48">
          <img
            src={event.card_image || event.image || '/api/placeholder/600/400'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded">
              {event.category || 'Event'}
            </span>
          </div>
        </div>
        
        <div className="p-5 flex-grow flex flex-col">
          <div className="flex items-center mb-3 text-gray-500">
            <Calendar size={16} className="mr-2" />
            <span className="text-sm">{formatDate(event.date)}</span>
          </div>
          
          <h3 className="text-xl font-bold mb-3 text-gray-800">
            {event.title}
          </h3>
          
          <p className="mb-4 flex-grow line-clamp-3 text-gray-600">
            {event.description || 'No description available for this event.'}
          </p>
          
          <div className="flex items-center mb-4 text-gray-500">
            <MapPin size={16} className="mr-2" />
            <span className="text-sm">{event.location || 'Location TBD'}</span>
          </div>
          
          <button
            onClick={() => window.location.href = `/event-details?id=${event.id || event.name}`}
            className="mt-auto inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            View Details
            <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    );
  };

  // Event Filter Component
  const EventFilter = () => {
    return (
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-green-500 focus:border-green-500"
                placeholder="Search events..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="flex items-center overflow-x-auto gap-2 py-2">
              <span className="flex items-center text-sm text-gray-500 mr-2">
                <Filter size={16} className="mr-1" /> Filter:
              </span>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleFilterChange(category)}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    activeFilter === category
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
              
              {(searchTerm || activeFilter !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 hover:bg-red-200 whitespace-nowrap flex items-center"
                >
                  <X size={14} className="mr-1" /> Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-green-600 border-b-green-600 border-l-gray-200 border-r-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">
            <X size={48} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Events</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Try Again
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
        {/* Hero Section with Featured Event */}
        <div className="relative bg-gradient-to-r from-green-900 to-teal-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-green-500 opacity-10 animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-32 h-32 rounded-full bg-teal-500 opacity-10 animate-pulse delay-1000"></div>
          <div className="absolute top-40 right-40 w-16 h-16 rounded-full bg-emerald-500 opacity-10 animate-pulse delay-500"></div>
          
          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="text-center mb-6">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">News & Events</h1>
              <p className="text-xl text-green-100">Stay updated with the latest happenings at TechEthica</p>
            </div>
            

{featuredEvent && (
  <div className="mt-12 bg-white/10 backdrop-blur-sm overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-white/20 rounded-lg">
    <div className="md:flex">
      <div className="md:w-1/2">
        <img 
          src={featuredEvent.image || '/api/placeholder/800/400'} 
          alt={featuredEvent.title}
          className="h-64 md:h-full w-full object-cover"
        />
      </div>
      <div className="md:w-1/2 p-6 md:p-8">
        <div className="flex items-center mb-4">
          <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm mr-3">Featured Event</span>
          <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">{featuredEvent.category || 'Event'}</span>
        </div>
        
        <h2 className="text-2xl font-bold mb-3">{featuredEvent.title}</h2>
        
        <div className="flex items-center mb-3 text-green-100">
          <Calendar size={18} className="mr-2" />
          <span>{formatDate(featuredEvent.date)}</span>
        </div>
        
        {featuredEvent.time && (
          <div className="flex items-center mb-3 text-green-100">
            <Clock size={18} className="mr-2" />
            <span>{featuredEvent.time}</span>
          </div>
        )}
        
        <div className="flex items-center mb-6 text-green-100">
          <MapPin size={18} className="mr-2" />
          <span>{featuredEvent.location || 'Location TBD'}</span>
        </div>
        
        <p className="mb-6 text-green-50 line-clamp-3">
          {featuredEvent.description || 'No description available for this featured event.'}
        </p>
        
        <button 
          onClick={() => window.location.href = `/event-details?id=${featuredEvent.id || featuredEvent.name}`}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg flex items-center"
        >
          View Details
          <ArrowRight size={18} className="ml-2" />
        </button>
      </div>
    </div>
  </div>
)}
          </div>
        </div>
        
        {/* Search and Filter Section */}
        <EventFilter />
        
        {/* Events Grid */}
        <div className="container mx-auto px-4 py-12">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-gray-100 mb-6">
                <Calendar size={48} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No events found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentEvents.map((event) => (
                  <EventCard key={event.id || event.name} event={event} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      <ArrowLeft size={18} />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === index + 1
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === totalPages 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
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
    </div>
  );
};

export default EventsPage;