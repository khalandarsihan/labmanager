import React, { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import FilterPanel from './FilterPanel';

const SearchAndFilters = ({
    viewMode = 'grid',
    setViewMode = () => {},
    onFilterChange = () => {},
}) => {
    const [showFilters, setShowFilters] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        onFilterChange({ search: value });
    };

    return (
        <div className="max-w-7xl mx-auto mb-8 px-4">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={handleSearchChange}
                            placeholder="Search courses..."
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-900/50 border-gray-700 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-amber-300 focus:border-amber-300"
                        />
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center space-x-2 px-4 py-3 border border-gray-700 rounded-lg hover:bg-gray-700/50 text-gray-200"
                        >
                            <Filter className="w-5 h-5" />
                            <span>Filters</span>
                        </button>

                        <div className="flex items-center space-x-2 border border-gray-700 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded text-gray-200 ${viewMode === 'grid' ? 'bg-gray-700' : ''}`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded text-gray-200 ${viewMode === 'list' ? 'bg-gray-700' : ''}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {showFilters && <FilterPanel onFilterChange={onFilterChange} />}
            </div>
        </div>
    );
};

export default SearchAndFilters;