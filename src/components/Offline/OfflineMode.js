import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

const OfflineMode = ({ isOnline, onRetry }) => {
  if (isOnline) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <WifiOff size={32} className="text-red-600" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">Нет подключения</h3>
        <p className="text-gray-600 mb-6">
          Проверьте подключение к интернету и попробуйте снова
        </p>
        
        <button
          onClick={onRetry}
          className="w-full bg-blue-600 text-white rounded-lg py-3 px-4 font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <RefreshCw size={20} className="mr-2" />
          Повторить
        </button>
        
        <div className="mt-4 text-sm text-gray-500">
          Некоторые функции доступны в офлайн режиме
        </div>
      </div>
    </div>
  );
};

export default OfflineMode;