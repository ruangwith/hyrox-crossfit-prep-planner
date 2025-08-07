
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-200 dark:border-gray-600 border-t-accent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300 font-orbitron">Generating Your Regimen...</p>
      <p className="text-gray-500 dark:text-gray-400">The AI is crafting your personalized plan.</p>
    </div>
  );
};

export default LoadingSpinner;
