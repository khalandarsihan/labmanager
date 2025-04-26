import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useTheme } from '../../../components/ui/ThemeContext';
import { Badge } from '../../../components/ui/badge';

const EventFilter = ({ 
  searchTerm, 
  handleSearchChange, 
  activeFilter, 
  handleFilterChange, 
  categories, 
  clearFilters,
  hasFilters
}) => {
  const { useLightTheme } = useTheme();
  
  return (
    <div className={`${useLightTheme ? 'bg-white' : 'bg-gray-800'} border-b ${useLightTheme ? 'border-gray-200' : 'border-gray-700'}`}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={20} className={`${useLightTheme ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <input
              type="text"
              className={`${
                useLightTheme 
                  ? 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500' 
                  : 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-green-500 focus:border-green-500'
              } border text-sm rounded-lg block w-full pl-10 p-2.5`}
              placeholder="Search events..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex items-center overflow-x-auto gap-2 py-2">
            <span className={`flex items-center text-sm ${useLightTheme ? 'text-gray-500' : 'text-gray-400'} mr-2`}>
              <Filter size={16} className="mr-1" /> Filter:
            </span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleFilterChange(category)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                  activeFilter === category
                    ? 'bg-green-600 text-white'
                    : useLightTheme
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
            
            {hasFilters && (
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

export default EventFilter;