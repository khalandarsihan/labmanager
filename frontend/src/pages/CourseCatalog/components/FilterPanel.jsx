import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const FilterPanel = ({ onFilterChange }) => {
    const priceRanges = [
        { label: 'All Prices', value: 'all' },
        { label: 'Free', value: 'free' },
        { label: 'Under ₹5000', value: 'under-5000' },
        { label: '₹5000 - ₹10000', value: '5000-10000' },
        { label: '₹10000+', value: 'over-10000' }
    ];

    const durations = [
        { label: 'Any Duration', value: 'all' },
        { label: '0-5 Hours', value: 'short' },
        { label: '5-10 Hours', value: 'medium' },
        { label: '10-20 Hours', value: 'long' },
        { label: '20+ Hours', value: 'extended' }
    ];

    const levels = [
        { label: 'All Levels', value: 'all' },
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Intermediate', value: 'Intermediate' },
        { label: 'Advanced', value: 'Advanced' }
    ];

    const handlePriceChange = (value) => {
        let priceFilter = {};
        switch (value) {
            case 'free':
                priceFilter = { price: 0 };
                break;
            case 'under-5000':
                priceFilter = { price: ['<', 5000] };
                break;
            case '5000-10000':
                priceFilter = { price: ['between', 5000, 10000] };
                break;
            case 'over-10000':
                priceFilter = { price: ['>', 10000] };
                break;
            default:
                priceFilter = {};
        }
        onFilterChange({ price: priceFilter });
    };

    const handleDurationChange = (value) => {
        let durationFilter = {};
        switch (value) {
            case 'short':
                durationFilter = { duration: ['<=', 5] };
                break;
            case 'medium':
                durationFilter = { duration: ['between', 5, 10] };
                break;
            case 'long':
                durationFilter = { duration: ['between', 10, 20] };
                break;
            case 'extended':
                durationFilter = { duration: ['>', 20] };
                break;
            default:
                durationFilter = {};
        }
        onFilterChange({ duration: durationFilter });
    };

    const handleLevelChange = (value) => {
        onFilterChange({
            level: value === 'all' ? {} : { level: value }
        });
    };

    return (
        <div className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
                <Select onValueChange={handlePriceChange} defaultValue="all">
                    <SelectTrigger className="bg-gray-900/50 border-gray-700 text-gray-200">
                        <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                        {priceRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                                {range.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                <Select onValueChange={handleDurationChange} defaultValue="all">
                    <SelectTrigger className="bg-gray-900/50 border-gray-700 text-gray-200">
                        <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                        {durations.map((duration) => (
                            <SelectItem key={duration.value} value={duration.value}>
                                {duration.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skill Level</label>
                <Select onValueChange={handleLevelChange} defaultValue="all">
                    <SelectTrigger className="bg-gray-900/50 border-gray-700 text-gray-200">
                        <SelectValue placeholder="Select skill level" />
                    </SelectTrigger>
                    <SelectContent>
                        {levels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                                {level.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default FilterPanel;