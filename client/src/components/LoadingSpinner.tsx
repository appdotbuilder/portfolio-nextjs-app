import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-slate-900 z-50">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 rounded-full animate-spin border-t-indigo-600 dark:border-t-indigo-400"></div>
        
        {/* Inner pulsing dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="ml-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Loading Portfolio
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Preparing the experience...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;