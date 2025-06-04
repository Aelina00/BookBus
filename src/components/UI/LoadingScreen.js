import React from 'react';
import logo from '../../logo/logo.png';

const LoadingScreen = ({ message = 'Загрузка...' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <img 
            src={logo} 
            alt="Karakol Bus" 
            className="h-24 w-auto mx-auto animate-pulse"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'block';
            }}
          />
          <div 
            className="h-24 w-24 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center animate-pulse"
            style={{display: 'none'}}
          >
            <span className="text-white text-2xl font-bold">KB</span>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
        
        <p className="text-gray-600 font-medium">{message}</p>
        
        <div className="mt-8 text-xs text-gray-500">
          Karakol Bus v1.0.0
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;