import React from 'react';

export default function SlugLoading() {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center p-6 text-center">
      <div className="animate-pulse">
        {/* Hero section skeleton */}
        <div className="w-full h-48 bg-gray-200 rounded-lg mb-8"></div>
        
        {/* Content sections skeletons */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2.5"></div>
          <div className="h-4 bg-gray-200 rounded mb-2.5"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          
          <div className="h-8 bg-gray-200 rounded w-1/4 mt-8 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2.5"></div>
          <div className="h-4 bg-gray-200 rounded mb-2.5"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
} 