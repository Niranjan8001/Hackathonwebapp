import React from 'react';

export const ReviewsTabs = ({ activeTab, setActiveTab, reviews }) => {
  const getCount = (status) => {
    if (status === 'all') return reviews.length;
    return reviews.filter(r => r.status.toLowerCase() === status.toLowerCase()).length;
  };

  const tabs = [
    { id: 'all', label: 'All Reviews', count: getCount('all') },
    { id: 'pending', label: 'Pending', count: getCount('pending') },
    { id: 'published', label: 'Published', count: getCount('published') },
    { id: 'hidden', label: 'Hidden', count: getCount('hidden') },
  ];

  return (
    <div className="border-b border-slate-200 dark:border-[#334155] mb-6 overflow-x-auto hide-scrollbar">
      <div className="flex gap-8 min-w-max px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-green-600 text-green-700 dark:border-green-500 dark:text-green-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-[#94A3B8] dark:hover:text-[#F8FAFC]'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
              activeTab === tab.id
                ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                : 'bg-slate-100 text-slate-600 dark:bg-[#1E293B] dark:text-[#94A3B8]'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
