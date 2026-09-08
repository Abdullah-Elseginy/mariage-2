import React from 'react';

export default function Loading({ message = 'Loading...', size = 'md' }) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-[3px]',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div
        className={`animate-spin rounded-full border-slate-200 border-t-gold dark:border-white/10 ${sizeClasses[size] || sizeClasses.md}`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {message && (
        <p className="mt-4 text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
