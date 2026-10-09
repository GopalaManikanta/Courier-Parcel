import React from 'react';

/**
 * Reusable SkeletonLoader component for smooth loading states
 * Supports type: 'card' | 'table' | 'stat' | 'list'
 */
const SkeletonLoader = ({ type = 'card', count = 3 }) => {
  const items = Array.from({ length: count });

  if (type === 'stat') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {items.map((_, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-3 bg-slate-200 rounded-md w-24"></div>
                <div className="h-7 bg-slate-300 rounded-md w-16"></div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-200"></div>
            </div>
            <div className="h-3 bg-slate-100 rounded-md w-36 mt-2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 animate-pulse">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="h-5 bg-slate-200 rounded-md w-48"></div>
          <div className="h-4 bg-slate-100 rounded-md w-20"></div>
        </div>
        <div className="space-y-3">
          {items.map((_, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100 gap-4">
              <div className="h-4 bg-slate-200 rounded w-28"></div>
              <div className="h-4 bg-slate-100 rounded w-36"></div>
              <div className="h-4 bg-slate-200 rounded w-44"></div>
              <div className="h-6 bg-slate-200 rounded-full w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3 animate-pulse">
        {items.map((_, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-3.5 bg-slate-300 rounded w-1/3"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              </div>
            </div>
            <div className="h-6 bg-slate-200 rounded-full w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  // Default 'card' skeleton
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
      {items.map((_, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-20 bg-slate-100 rounded-xl"></div>
          <div className="flex justify-between items-center">
            <div className="h-3 bg-slate-200 rounded w-1/3"></div>
            <div className="h-3 bg-slate-300 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
