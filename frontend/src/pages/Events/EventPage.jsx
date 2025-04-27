import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Search, Filter, X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import BackgroundPattern from '../../components/ui/BackgroundPattern';
import EventCard from './components/EventCard'; // Import the EventCard component
import ThemeSwitcher from '../../components/ui/ThemeSwitcher'; // Import ThemeSwitcher
import { useTheme } from '../../components/ui/ThemeContext'; // Import useTheme

const EventsPage = () => {
  // State for filtering, searching and data loading
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState(['all']); // Initialize with 'all'
  const eventsPerPage = 6;
  
  // Get theme from context
  const { useLightTheme, toggleTheme } = useTheme();
  
  // Fetch events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Call the API endpoint to get events
        const response = await fetch('/api/method/labmanager.api.events.get_events');
        const data = await response.json();
        
        if (data.message && data.message.status === 'success') {
          setEvents(data.message.events || []);
          
          // Extract unique categories from events
          const eventCategories = [...new Set(data.message.events
            .filter(event => event.category)
            .map(event => event.category.toLowerCase()))];
          
          // Set categories with 'all' as the first option
          setCategories(['all', ...eventCategories]);
        } else {
          setError('Failed to load events');
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Error fetching events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Find featured event
  const featuredEvent = events.find(event => event.is_featured) || (events.length > 0 ? events[0] : null);
  
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

  return (
    <div className="min-h-screen">
      {/* Background Pattern */}
      <BackgroundPattern />
      
      {/* Theme Switcher */}
      <ThemeSwitcher useLightTheme={useLightTheme} toggleTheme={toggleTheme} />
      
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
            {loading ? (
              <div className="mt-8 bg-white/10 backdrop-blur-sm overflow-hidden shadow-lg rounded-lg border border-white/20 max-w-5xl mx-auto">
                <div className="p-8 text-center">
                  <div className="animate-pulse">
                    <div className="h-8 bg-white/20 rounded w-1/3 mx-auto mb-4"></div>
                    <div className="h-6 bg-white/20 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-6 bg-white/20 rounded w-1/2 mx-auto mb-4"></div>
                    <div className="h-32 bg-white/20 rounded w-full mx-auto"></div>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="mt-8 bg-white/10 backdrop-blur-sm overflow-hidden shadow-lg rounded-lg border border-white/20 max-w-5xl mx-auto">
                <div className="p-8 text-center">
                  <p className="text-xl text-white">Failed to load featured event. Please try again later.</p>
                </div>
              </div>
            ) : featuredEvent ? (
              <div className="mt-8 bg-white/10 backdrop-blur-sm overflow-hidden shadow-lg rounded-lg border border-white/20 max-w-5xl mx-auto">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img 
                      src={featuredEvent.image || "/api/placeholder/800/500"} 
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
                      onClick={() => window.location.href = `/event-details?id=${featuredEvent.id || featuredEvent.name}`}
                      className="px-6 py-3 bg-amber-500 text-gray-900 font-semibold rounded-lg hover:bg-amber-400 transition-all shadow-md hover:shadow-lg flex items-center"
                    >
                      View Event Details
                      <ArrowRight size={18} className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8 bg-white/10 backdrop-blur-sm overflow-hidden shadow-lg rounded-lg border border-white/20 max-w-5xl mx-auto">
                <div className="p-8 text-center">
                  <p className="text-xl text-white">No featured events available at the moment.</p>
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
                        ? useLightTheme ? 'bg-purple-600 text-white' : 'bg-amber-600 text-white'
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
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="border border-gray-100 bg-white shadow-md rounded-lg overflow-hidden h-96">
                  <div className="animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-5">
                      <div className="h-4 bg-gray-200 rounded mb-4 w-1/4"></div>
                      <div className="h-6 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4 w-1/3"></div>
                      <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-red-100 mb-6">
                <X size={48} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">Error loading events</h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
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
                  <EventCard 
                    key={event.id || event.name} 
                    event={event} 
                    formatDate={formatDate}
                  />
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
                            ? useLightTheme ? 'bg-purple-600 text-white' : 'bg-amber-600 text-white'
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