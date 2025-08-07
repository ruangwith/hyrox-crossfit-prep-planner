
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  const isMobileConnectionError = message.includes('timeout') || message.includes('Network') || message.includes('fetch');
  const isApiKeyError = message.includes('API key') || message.includes('API configuration');
  
  const getMobileTroubleshootingTips = () => {
    if (isApiKeyError) {
      return [
        'API configuration issue detected',
        'Please contact support if this persists'
      ];
    }
    
    if (isMobileConnectionError) {
      return [
        'Check your internet connection',
        'Try switching between WiFi and mobile data',
        'Move to an area with better signal strength',
        'Wait a moment and try again'
      ];
    }
    
    return [
      'Please try again in a moment',
      'If the issue persists, contact support'
    ];
  };

  const tips = getMobileTroubleshootingTips();

  return (
    <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-6 rounded-lg shadow-md my-8" role="alert">
      <div className="flex items-center mb-2">
        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <p className="font-bold">Unable to Generate Plan</p>
      </div>
      <p className="mb-3 text-sm">{message}</p>
      
      {isMobileConnectionError && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 rounded border border-red-200 dark:border-red-700">
          <p className="font-semibold text-sm mb-2">Mobile Troubleshooting:</p>
          <ul className="text-xs space-y-1">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-4 text-xs opacity-75">
        Connection: {navigator.onLine ? 'Online' : 'Offline'} | 
        Network: {(navigator as any).connection?.effectiveType || 'Unknown'}
      </div>
    </div>
  );
};

export default ErrorDisplay;
