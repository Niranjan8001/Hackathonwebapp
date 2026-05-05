import React from 'react';
import { Search, ChevronDown, Filter } from 'lucide-react';

export const ProductsFilters = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter
}) => {
  return (
    <div className="flex flex-col xl:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <input 
          type="text" 
          placeholder="Search products..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-green-500 dark:focus:border-green-500 text-slate-800 dark:text-[#F8FAFC]"
        />
        <Search className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
        <div className="relative">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] pl-4 pr-10 py-2.5 rounded-lg text-sm text-slate-700 dark:text-[#F8FAFC] min-w-[140px] focus:outline-none focus:border-green-500"
          >
            <option>All Categories</option>
            <option>Vegetables</option>
            <option>Fruits</option>
            <option>Grains</option>
            <option>Oil</option>
          </select>
          <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] pl-4 pr-10 py-2.5 rounded-lg text-sm text-slate-700 dark:text-[#F8FAFC] min-w-[120px] focus:outline-none focus:border-green-500"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
          <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        <button className="flex items-center justify-between gap-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] px-4 py-2.5 rounded-lg text-sm text-slate-700 dark:text-[#F8FAFC] min-w-[150px]">
          <span>Sort: Newest First</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
        <button className="flex items-center justify-center gap-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] px-4 py-2.5 rounded-lg text-sm text-slate-700 dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-colors">
          <Filter className="w-4 h-4" />
          <span>More</span>
        </button>
      </div>
    </div>
  );
};
