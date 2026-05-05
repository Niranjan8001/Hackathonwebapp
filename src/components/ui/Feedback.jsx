import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading products...' }) => (
  <div className="flex flex-col items-center justify-center p-12 w-full text-center">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      <RefreshCw className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-green-600 animate-pulse" />
    </div>
    <p className="mt-4 text-slate-500 font-medium animate-pulse">{message}</p>
  </div>
);

export const ErrorState = ({ message, onRetry, status }) => (
  <div className="flex flex-col items-center justify-center p-8 m-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl text-center">
    <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full text-red-600 dark:text-red-400 mb-4">
      <AlertCircle className="w-8 h-8" />
    </div>
    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
      {status === 0 ? 'Connection Error' : 'Something went wrong'}
    </h3>
    <p className="text-slate-600 dark:text-slate-400 max-w-xs mb-6 text-sm">
      {message || 'We encountered an error while trying to load your data.'}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-6 py-2.5 rounded-xl font-bold shadow-sm hover:shadow-md active:scale-95 transition-all border border-slate-200 dark:border-slate-700"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    )}
  </div>
);
