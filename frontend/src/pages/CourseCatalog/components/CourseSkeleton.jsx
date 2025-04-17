import React from 'react';

const CourseSkeleton = ({ isListView }) => {
    return (
        <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg overflow-hidden animate-pulse`}>
            <div className={`relative ${isListView ? 'flex flex-col sm:flex-row' : ''}`}>
                {/* Image skeleton */}
                <div className={`relative ${isListView ? 'w-full sm:w-64 sm:flex-shrink-0 h-48' : 'w-full h-48'}`}>
                    <div className="bg-gray-700/50 h-full w-full"></div>
                </div>
                
                <div className="p-6 flex-1">
                    {/* Featured badge skeleton */}
                    <div className="flex justify-end mb-3">
                        <div className="h-6 w-20 bg-gray-700/50 rounded-full"></div>
                    </div>

                    {/* Title skeleton */}
                    <div className="h-8 bg-gray-700/50 rounded mb-2"></div>
                    
                    {/* Description skeleton */}
                    <div className="space-y-2 mb-4">
                        <div className="h-4 bg-gray-700/50 rounded w-full"></div>
                        <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
                    </div>

                    {/* Stats skeleton */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-gray-700/50 rounded"></div>
                            <div className="h-4 bg-gray-700/50 rounded w-20"></div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-gray-700/50 rounded"></div>
                            <div className="h-4 bg-gray-700/50 rounded w-24"></div>
                        </div>
                    </div>

                    {/* Footer skeleton */}
                    <div className="flex items-center justify-between">
                        <div className="h-6 bg-gray-700/50 rounded w-24"></div>
                        <div className="h-10 bg-gray-700/50 rounded w-32"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseSkeleton;