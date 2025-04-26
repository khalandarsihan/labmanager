import React from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { useTheme } from '../../../components/ui/ThemeContext';

const EventCard = ({ event, formatDate }) => {
  const { useLightTheme } = useTheme();
  
  return (
    <Card 
      className={`overflow-hidden shadow-md hover:shadow-lg transition-all border ${
        useLightTheme 
          ? 'border-gray-100 bg-white' 
          : 'border-gray-700 bg-gray-800/50'
      } flex flex-col h-full transform hover:-translate-y-1 duration-300`}
    >
      <div className="relative h-48">
        <img
          src={event.image || '/api/placeholder/600/400'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary">{event.category}</Badge>
        </div>
      </div>
      
      <CardContent className="p-5 flex-grow flex flex-col">
        <div className="flex items-center mb-3 text-gray-500">
          <Calendar size={16} className="mr-2" />
          <span className="text-sm">{formatDate(event.date)}</span>
        </div>
        
        <h3 className={`text-xl font-bold mb-3 ${useLightTheme ? 'text-gray-800' : 'text-gray-100'}`}>
          {event.title}
        </h3>
        
        <p className={`mb-4 flex-grow line-clamp-3 ${useLightTheme ? 'text-gray-600' : 'text-gray-300'}`}>
          {event.description}
        </p>
        
        <div className="flex items-center mb-4 text-gray-500">
          <MapPin size={16} className="mr-2" />
          <span className="text-sm">{event.location}</span>
        </div>
        
        <button
          onClick={() => window.location.href = `/event-details?id=${event.id}`}
          className="mt-auto inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          View Details
          <ArrowRight size={16} className="ml-2" />
        </button>
      </CardContent>
    </Card>
  );
};

export default EventCard;