import React, { useState } from 'react';
import { Calendar, MapPin, Search, Filter, X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import BackgroundPattern from '../../components/ui/BackgroundPattern';

const EventsPage = () => {
  // State for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;
  
  // Sample events data - would come from your API
  const events = [
    {
      id: "logo-and-website-launch",
      title: "Logo and Website Launch of TechEthica",
      category: "Launch",
      date: "2025-04-25",
      location: "Main Campus, Bidarahalli",
      description: "TechEthica successfully launched its new logo and website. The event was attended by distinguished guests and key stakeholders from the educational community.",
      image: "/api/placeholder/600/400",
      is_featured: true
    },
    {
      id: "annual-science-exhibition",
      title: "Annual Science Exhibition 2025",
      category: "Exhibition",
      date: "2025-03-15",
      location: "Science Block, Main Campus",
      description: "Students showcased innovative projects and experiments at our annual science exhibition, demonstrating their understanding of scientific concepts through practical applications.",
      image: "/api/placeholder/600/400"
    },
    {
      id: "graduation-ceremony",
      title: "Graduation Ceremony 2025",
      category: "Ceremony",
      date: "2025-03-03",
      location: "Auditorium, Main Campus",
      description: "TechEthica celebrated the achievements of graduating students in a grand ceremony attended by faculty, parents, and distinguished guests.",
      image: "/api/placeholder/600/400"
    },
    {
      id: "faculty-development-program",
      title: "Faculty Development Program",
      category: "Workshop",
      date: "2025-02-20",
      location: "Conference Hall, Admin Block",
      description: "A week-long training program focused on enhancing teaching methodologies and implementing modern educational technologies in classrooms.",
      image: "/api/placeholder/600/400"
    },
    {
      id: "national-mathematics-day",
      title: "National Mathematics Day Celebration",
      category: "Academic",
      date: "2024-12-22",
      location: "Mathematics Department",
      description: "Celebration of National Mathematics Day with competitions, exhibitions, and guest lectures highlighting the importance of mathematics in everyday life.",
      image: "/api/placeholder/600/400"
    },
    {
      id: "annual-sports-day",
      title: "Annual Sports Day 2024",
      category: "Sports",
      date: "2024-12-10",
      location: "Sports Complex",
      description: "Students participated in various athletic events and team sports, showcasing their sporting talents and team spirit.",
      image: "/api/placeholder/600/400"
    },
    {
      id: "founders-day",
      title: "Founders Day Celebration",
      category: "Ceremony",
      date: "2024-11-15",
      location: "Main Campus",
      description: "TechEthica celebrated its founding anniversary with cultural performances, awards ceremony, and special addresses from the founders and trustees.",
      image: "/api/placeholder/600/400"
    },
    {
      id: "international-conference",
      title: "International Conference on Educational Innovation",
      category: "Conference",
      date: "2024-10-25",
      location: "Conference Center",
      description: "Global educators and researchers gathered to discuss latest trends and innovations in educational methodologies and technologies.",
      image: "/api/placeholder/600/400"
    }
  ];
  
  // Featured event
  const featuredEvent = events.find(event => event.is_featured) || events[0];
  
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
  
  // Generate unique categories from events
  const categories = ['all', ...new Set(events
    .filter(event => event.category)
    .map(event => event.category.toLowerCase()))
  ];
  
  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      return dateString;
    }
  };
  
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

  // EventCard Component
  const EventCard = ({ event }) => {
    return (
      <div className="overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-100 bg-white flex flex-col h-full transform hover:-translate-y-1 duration-300 rounded-lg">
        <div className="relative h-48">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-teal-600 text-white text-xs font-medium rounded">
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
            <span className="text-sm">{event.location || 'Location not specified'}</span>
          </div>
          
          <button
            onClick={() => window.location.href = `/event-details?id=${event.id}`}
            className="mt-auto inline-flex items-center justify-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
          >
            View Details
            <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background Pattern */}
      <BackgroundPattern />
      
      <div className="relative z-10">
        {/* Hero Section with Institutional Branding */}
        <div className="relative bg-gradient-to-r from-green-900 to-teal-800 text-white overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-green-500 opacity-10 animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-32 h-32 rounded-full bg-teal-500 opacity-10 animate-pulse delay-1000"></div>
          
          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Events & Highlights</h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto">
                Celebrating the achievements and milestones that shape TechEthica's journey in educational excellence
              </p>
            </div>
            
            {/* Featured Event Showcase */}
            {featuredEvent && (
              <div className="mt-8 bg-white/10 backdrop-blur-sm overflow-hidden shadow-lg rounded-lg border border-white/20 max-w-5xl mx-auto">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img 
                      src={featuredEvent.image} 
                      alt={featuredEvent.title}
                      className="h-64 md:h-full w-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-6 md:p-8">
                    <div className="flex items-center mb-4">
                      <span className="bg-teal-700 text-white px-3 py-1 rounded-full text-sm mr-3">
                        Featured Event
                      </span>
                      <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm">
                        {featuredEvent.category || 'Event'}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                      {featuredEvent.title}
                    </h2>
                    
                    <div className="flex items-center mb-3 text-teal-100">
                      <Calendar size={18} className="mr-2" />
                      <span>{formatDate(featuredEvent.date)}</span>
                    </div>
                    
                    <div className="flex items-center mb-6 text-teal-100">
                      <MapPin size={18} className="mr-2" />
                      <span>{featuredEvent.location || 'Location not specified'}</span>
                    </div>
                    
                    <p className="mb-6 text-teal-50">
                      {featuredEvent.description || 'No description available for this event.'}
                    </p>
                    
                    <button 
                      onClick={() => window.location.href = `/event-details?id=${featuredEvent.id}`}
                      className="px-6 py-3 bg-amber-500 text-gray-900 font-semibold rounded-lg hover:bg-amber-400 transition-all shadow-md hover:shadow-lg flex items-center"
                    >
                      View Event Details
                      <ArrowRight size={18} className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Search and Filter Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              
              <div className="flex items-center overflow-x-auto gap-2 py-2">
                <span className="flex items-center text-sm text-gray-500 mr-2">
                  <Filter size={16} className="mr-1" /> Filter by:
                </span>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleFilterChange(category)}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                      activeFilter === category
                        ? 'bg-teal-600 text-white' 
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
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
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
                      <ChevronLeft size={18} />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === index + 1
                            ? 'bg-teal-600 text-white'
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
                      <ChevronRight size={18} />
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

export default EventsPage;