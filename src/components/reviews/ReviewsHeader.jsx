import React from 'react';
import { Download, Calendar, Filter, ChevronDown } from 'lucide-react';
import { DateRangePicker } from '../ui/DateRangePicker';

export const ReviewsHeader = () => {
  return (
    <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-6 mb-8 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-white">Reviews</h1>
        <p className="text-sm text-white/30 font-medium tracking-wide">Manage and respond to customer reviews</p>
      </div>
      
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 text-white/60 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-all">
          <span>All Products</span>
          <ChevronDown className="w-3 h-3 opacity-40" />
        </div>

        <DateRangePicker />

        <button className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500/20 transition-all shadow-lg shadow-green-500/5">
          <Download className="w-4 h-4" />
          <span>Export Reviews</span>
        </button>
      </div>
    </div>
  );
};
