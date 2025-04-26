import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Clock, MapPin, User, Users, ExternalLink, Search, Filter, X, Calendar } from 'lucide-react';
import BackgroundPattern from '../../components/ui/BackgroundPattern';
import { Badge } from '../../components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/card';
import { useTheme } from '../../components/ui/ThemeContext';
import EventCard from './components/EventCard';
import EventFilter from './components/EventFilter';
import NewsletterSignup from './components/NewsletterSignup';
import AttendeesList from './components/AttendeesList';

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
  
  // Access theme context
  const { useLightTheme, themeStyles } = useTheme();
  
  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/method/labmanager.api.events.get_events');
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        
        // Check if we have events, if not use sample data
        if (data.message && data.message.events && data.message.events.length > 0) {
          setEvents(data.message.events);
          // Set the first event as featured or pick one marked as featured
          const featured = data.message.events.find(event => event.is_featured) || data.message.events[0];
          setFeaturedEvent(featured);
        } else {
          // Use sample data if no events are returned
          const sampleEvents = generateSampleEvents();
          setEvents(sampleEvents);
          setFeaturedEvent(sampleEvents[0]);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message);
        
        // Use sample data on error
        const sampleEvents = generateSampleEvents();
        setEvents(sampleEvents);
        setFeaturedEvent(sampleEvents[0]);
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
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = 
      activeFilter === 'all' || 
      event.category.toLowerCase() === activeFilter.toLowerCase();
      
    return matchesSearch && matchesFilter;
  });
  
  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  
  // Generate category list from events
  const categories = ['all', ...new Set(events.map(event => event.category.toLowerCase()))];
  
  // Format date function
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Sample data generator
  const generateSampleEvents = () => {
    return [
      {
        id: '1',
        title: 'Logo and Website Launch of TechEthica',
        date: '2025-04-26',
        time: '10:00 AM',
        location: 'Main Campus, Bidarahalli',
        category: 'Launch',
        is_featured: true,
        image: '/api/placeholder/800/400',
        description: 'A momentous occasion marking the official launch of the TechEthica Logo and Website — a pioneering initiative that fuses cutting-edge technology education with deep Islamic learning.',
        organizer: 'TechEthica Administration',
        attendees: [
          { name: 'Janab B. Zameer Ahmad Khan Sahib', title: 'Honourable Minister for Housing, Wakf, and Minority Welfare' },
          { name: 'Maulana N.K.M. Shafi Saadi', title: 'Chairman & Co-Founder, TechEthica' },
          { name: 'Janab Zulfikar Ali Tippu Sahib', title: 'Chairman, Karnataka State Haj Committee' },
          { name: 'Janab Iftikhar Ahmed Sahib', title: 'Former Chairman, Karnataka State Board of Auqaf' },
          { name: 'Janab Advocate Rahul Riyaz Khan Sahib', title: 'Former Chairman, Karnataka State Board of Auqaf' },
          { name: 'Janab Sarfaraz Ahmed Khan Sahib', title: 'Executive Officer, Karnataka State Haj Committee' },
          { name: 'Mr. Khalandar Sihan Saquafi', title: 'CEO & Co-Founder, TechEthica' }
        ]
      },
      {
        id: '2',
        title: 'Islamic Data Science Workshop',
        date: '2025-05-15',
        time: '9:00 AM',
        location: 'TechEthica Learning Center',
        category: 'Workshop',
        image: '/api/placeholder/800/400',
        description: 'Learn how data science can be applied to Islamic studies for research and analysis. This workshop will cover techniques for analyzing Hadith collections, Quranic text analysis, and more.',
        organizer: 'Dr. Ahmed Hassan',
        attendees: []
      },
      {
        id: '3',
        title: 'Tech & Taqwa: Balancing Digital Life',
        date: '2025-05-22',
        time: '5:30 PM',
        location: 'Virtual Event',
        category: 'Seminar',
        image: '/api/placeholder/800/400',
        description: 'This seminar explores the balance between technological advancement and Islamic spirituality in modern life. Learn practical tips for maintaining Taqwa while navigating the digital world.',
        organizer: 'Islamic Technology Forum',
        attendees: []
      },
      {
        id: '4',
        title: 'Hackathon: Ethical Tech Solutions',
        date: '2025-06-10',
        time: '10:00 AM',
        location: 'TechEthica Innovation Hub',
        category: 'Competition',
        image: '/api/placeholder/800/400',
        description: 'A 48-hour hackathon focused on developing technology solutions that align with Islamic ethical frameworks. Prizes for the most innovative projects addressing community needs.',
        organizer: 'TechEthica Development Team',
        attendees: []
      },
      {
        id: '5',
        title: 'Arabic Natural Language Processing Conference',
        date: '2025-07-05',
        time: '9:00 AM',
        location: 'International Convention Center',
        category: 'Conference',
        image: '/api/placeholder/800/400',
        description: 'An international conference on advancements in Arabic NLP, featuring speakers from leading research institutions and tech companies working on Arabic language technology.',
        organizer: 'Arabic Technology Association',
        attendees: []
      },
      {
        id: '6',
        title: 'Summer Coding Camp for Muslim Youth',
        date: '2025-07-15',
        time: '8:30 AM',
        location: 'TechEthica Campus',
        category: 'Education',
        image: '/api/placeholder/800/400',
        description: 'A two-week intensive coding boot camp designed for Muslim youth ages 13-18, teaching programming fundamentals while integrating Islamic principles of ethics and responsibility.',
        organizer: 'TechEthica Education Department',
        attendees: []
      },
      {
        id: '7',
        title: 'Blockchain & Islamic Finance Symposium',
        date: '2025-08-12',
        time: '10:00 AM',
        location: 'Financial District Conference Center',
        category: 'Symposium',
        image: '/api/placeholder/800/400',
        description: 'Experts discuss the intersection of blockchain technology and Islamic finance principles, including smart contracts for Sukuk, Zakat distribution systems, and Shariah-compliant cryptocurrencies.',
        organizer: 'Islamic Fintech Consortium',
        attendees: []
      },
      {
        id: '8',
        title: 'Tech Ethics from Islamic Perspective',
        date: '2025-09-05',
        time: '4:00 PM',
        location: 'Central Mosque Auditorium',
        category: 'Lecture',
        image: '/api/placeholder/800/400',
        description: 'A series of lectures exploring the ethical dimensions of emerging technologies from an Islamic perspective, addressing AI ethics, data privacy, and responsible innovation.',
        organizer: 'Islamic Scholars Council',
        attendees: []
      }
    ];
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

  if (error && events.length === 0) {
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
      {/* Using the BackgroundPattern component */}
      <BackgroundPattern />
      
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
              <Card className={`mt-12 bg-white/10 backdrop-blur-sm overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-white/20 ${useLightTheme ? 'bg-white/80 text-gray-800' : ''}`}>
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
                      <Badge className="bg-emerald-600 text-white mr-3">Featured Event</Badge>
                      <Badge variant="secondary">{featuredEvent.category}</Badge>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-3">{featuredEvent.title}</h2>
                    
                    <div className="flex items-center mb-3 text-green-100">
                      <Calendar size={18} className="mr-2" />
                      <span>{formatDate(featuredEvent.date)}</span>
                    </div>
                    
                    <div className="flex items-center mb-3 text-green-100">
                      <Clock size={18} className="mr-2" />
                      <span>{featuredEvent.time}</span>
                    </div>
                    
                    <div className="flex items-center mb-6 text-green-100">
                      <MapPin size={18} className="mr-2" />
                      <span>{featuredEvent.location}</span>
                    </div>
                    
                    <p className={`mb-6 ${useLightTheme ? 'text-gray-600' : 'text-green-50'} line-clamp-3`}>{featuredEvent.description}</p>
                    
                    <button 
                      onClick={() => window.location.href = `/event-details?id=${featuredEvent.id}`}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg flex items-center"
                    >
                      View Details
                      <ArrowRight size={18} className="ml-2" />
                    </button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
        
        {/* Search and Filter Section */}
        <EventFilter 
          searchTerm={searchTerm} 
          handleSearchChange={handleSearchChange}
          activeFilter={activeFilter}
          handleFilterChange={handleFilterChange}
          categories={categories}
          clearFilters={clearFilters}
          hasFilters={searchTerm || activeFilter !== 'all'}
        />
        
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
                  <EventCard 
                    key={event.id}
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
        
        {/* Event Details Display for Featured Event */}
        {featuredEvent && featuredEvent.attendees && featuredEvent.attendees.length > 0 && (
          <div className="bg-gray-50 border-t border-gray-200 py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Event Highlight</h2>
                
                <Card className={`overflow-hidden ${useLightTheme ? '' : 'bg-gray-800'}`}>
                  <CardContent className="p-6 md:p-8">
                    <h3 className={`text-2xl font-bold ${useLightTheme ? 'text-gray-800' : 'text-gray-100'} mb-4`}>{featuredEvent.title}</h3>
                    
                    <div className={`flex items-center mb-6 ${useLightTheme ? 'text-gray-600' : 'text-gray-300'}`}>
                      <User size={20} className="mr-2" />
                      <span>Organized by: <strong>{featuredEvent.organizer}</strong></span>
                    </div>
                    
                    <div className="mb-8">
                      <h4 className={`flex items-center text-xl font-semibold ${useLightTheme ? 'text-gray-700' : 'text-gray-200'} mb-4`}>
                        <Users size={22} className="mr-2" />
                        Distinguished Guests
                      </h4>
                      
                      <AttendeesList attendees={featuredEvent.attendees} />
                    </div>
                    
                    <div className="text-center">
                      <button 
                        onClick={() => window.location.href = `/event-details?id=${featuredEvent.id}`}
                        className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        View Complete Details
                        <ExternalLink size={18} className="ml-2" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
        
        {/* Newsletter Section */}
        <NewsletterSignup />
      </div>
    </div>
  );
};

export default EventsPage;