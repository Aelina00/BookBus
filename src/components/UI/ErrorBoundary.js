import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Логирование ошибки
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Что-то пошло не так
              </h1>
              
              <p className="text-gray-600 mb-6">
                Произошла неожиданная ошибка. Попробуйте обновить приложение.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg py-3 font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center"
                >
                  <RefreshCw size={20} className="mr-2" />
                  Обновить приложение
                </button>
                
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: null, errorInfo: null });
                    window.location.href = '/';
                  }}
                  className="w-full bg-gray-300 text-gray-700 rounded-lg py-3 font-semibold hover:bg-gray-400 transition-colors flex items-center justify-center"
                >
                  <Home size={20} className="mr-2" />
                  На главную
                </button>
              </div>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Детали ошибки (только для разработки)
                  </summary>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 overflow-auto max-h-32">
                    <div className="font-semibold mb-2">Error:</div>
                    <div className="mb-2">{this.state.error && this.state.error.toString()}</div>
                    <div className="font-semibold mb-2">Component Stack:</div>
                    <div>{this.state.errorInfo.componentStack}</div>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;