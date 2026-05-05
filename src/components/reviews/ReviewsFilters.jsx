import React from 'react';
import { Search, ChevronDown, Filter, ArrowUpDown } from 'lucide-react';

export const ReviewsFilters = ({
  searchQuery,
  setSearchQuery,
  productFilter,
  setProductFilter,
  ratingFilter,
  setRatingFilter
}) => {
  return (
    <div className="flex flex-col xl:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <input 
          type="text" 
          placeholder="Search reviews..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-green-500 text-slate-800 dark:text-[#F8FAFC]"
        />
        <Search className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
      </div>
      
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-3">
        <div className="relative">
          <select 
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="appearance-none bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] pl-4 pr-10 py-2.5 rounded-lg text-sm text-slate-700 dark:text-[#F8FAFC] min-w-[140px] focus:outline-none focus:border-green-500"
          >
            <option>All Products</option>
            <option>Farm Fresh Tomatoes</option>
            <option>Cucumbers</option>
            <option>Red Onions</option>
            <option>Whole Wheat</option>
            <option>Potatoes</option>
          </select>
          <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select 
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="appearance-none bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] pl-4 pr-10 py-2.5 rounded-lg text-sm text-slate-700 dark:text-[#F8FAFC] min-w-[130px] focus:outline-none focus:border-green-500"
          >
            <option>All Ratings</option>
            <option>5 Stars</option>
            <option>4 Stars</option>
            <option>3 Stars</option>
            <option>2 Stars</option>
            <option>1 Star</option>
          </select>
          <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        <button className="flex items-center gap-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] px-4 py-2.5 rounded-lg text-sm text-slate-700 dark:text-[#F8FAFC]">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <span>Newest First</span>
        </button>
        <button className="flex items-center justify-center gap-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] px-4 py-2.5 rounded-lg text-sm text-slate-700 dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-colors">
          <Filter className="w-4 h-4" />
          <span>More</span>
        </button>
      </div>
    </div>
  );
};
