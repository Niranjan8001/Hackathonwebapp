import React from 'react';
import { Download, Calendar } from 'lucide-react';

export const EarningsHeader = () => {
  return (
    <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-6 mb-4 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-white">Earnings</h1>
        <p className="text-sm text-white/30 font-medium tracking-wide">Track your income, transactions and withdrawals</p>
      </div>
      
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto pb-2">
        <button className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white/60 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all shadow-xl">
          <Download className="w-4 h-4" />
          <span>Download Report</span>
        </button>
        
        <button className="flex-1 md:flex-none flex items-center justify-between gap-6 bg-white/5 border border-white/10 text-white/40 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all min-w-[240px] shadow-xl">
          <span className="text-white/60">May 1 - May 29, 2025</span>
          <Calendar className="w-4 h-4 text-white/20" />
        </button>
      </div>
    </div>
  );
};
