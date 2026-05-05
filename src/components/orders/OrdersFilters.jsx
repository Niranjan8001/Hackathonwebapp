import React from 'react';
import { Search, ChevronDown, Filter, Calendar } from 'lucide-react';

export const OrdersFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter, 
  paymentFilter, 
  setPaymentFilter 
}) => {
  return (
    <div className="flex flex-col xl:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <input 
          type="text" 
          placeholder="Search by order ID or customer..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-green-500 dark:focus:border-green-500 text-slate-800 dark:text-[#F8FAFC]"
        />
        <Search className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-3">
        <div className="relative">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] pl-4 pr-10 py-2.5 rounded-lg text-sm text-slate-700 dark:text-[#F8FAFC] min-w-[130px] focus:outline-none focus:border-green-500"
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
          <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select 
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="appearance-none bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] pl-4 pr-10 py-2.5 rounded-lg text-sm text-slate-700 dark:text-[#F8FAFC] min-w-[160px] focus:outline-none focus:border-green-500"
          >
            <option>All Payment Status</option>
            <option>Paid</option>
            <option>COD</option>
            <option>Refunded</option>
          </select>
          <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        <button className="flex items-center justify-between gap-3 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] px-4 py-2.5 rounded-lg text-sm text-slate-700 dark:text-[#F8FAFC] min-w-[200px]">
          <span>May 1 - May 31, 2024</span>
          <Calendar className="w-4 h-4 text-slate-400" />
        </button>
        <button className="flex items-center justify-center gap-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] px-4 py-2.5 rounded-lg text-sm text-slate-700 dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-colors">
          <Filter className="w-4 h-4" />
          <span>More</span>
        </button>
      </div>
    </div>
  );
};
