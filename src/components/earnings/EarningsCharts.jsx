import React from 'react';
import { ChevronDown } from 'lucide-react';

const EarningsLineChart = () => (
  <div className="w-full h-[250px] relative mt-4">
    <svg viewBox="0 0 800 250" className="w-full h-full preserve-aspect-ratio-none">
      {/* Grid Lines */}
      <line x1="40" y1="20" x2="800" y2="20" stroke="currentColor" strokeDasharray="4 4" className="text-slate-100 dark:text-[#334155] opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }} strokeWidth="1" />
      <line x1="40" y1="90" x2="800" y2="90" stroke="currentColor" strokeDasharray="4 4" className="text-slate-100 dark:text-[#334155] opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }} strokeWidth="1" />
      <line x1="40" y1="160" x2="800" y2="160" stroke="currentColor" strokeDasharray="4 4" className="text-slate-100 dark:text-[#334155] opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }} strokeWidth="1" />
      <line x1="40" y1="230" x2="800" y2="230" stroke="currentColor" className="text-slate-200 dark:text-[#334155] opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }} strokeWidth="1" />
      
      {/* Y Axis Labels */}
      <text x="30" y="25" fill="currentColor" className="text-[10px] text-slate-400 dark:text-[#94A3B8] opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }} textAnchor="end">₹30K</text>
      <text x="30" y="95" fill="currentColor" className="text-[10px] text-slate-400 dark:text-[#94A3B8] opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }} textAnchor="end">₹20K</text>
      <text x="30" y="165" fill="currentColor" className="text-[10px] text-slate-400 dark:text-[#94A3B8] opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }} textAnchor="end">₹10K</text>
      <text x="30" y="235" fill="currentColor" className="text-[10px] text-slate-400 dark:text-[#94A3B8] opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }} textAnchor="end">₹0</text>

      {/* X Axis Labels */}
      <text x="60" y="250" fill="currentColor" className="text-[10px] text-slate-400 dark:text-[#94A3B8] opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>May 1</text>
      <text x="180" y="250" fill="currentColor" className="text-[10px] text-slate-400 dark:text-[#94A3B8] opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>May 6</text>
      <text x="300" y="250" fill="currentColor" className="text-[10px] text-slate-400 dark:text-[#94A3B8] opacity-0 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>May 11</text>
      <text x="420" y="250" fill="currentColor" className="text-[10px] text-slate-400 dark:text-[#94A3B8] opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>May 16</text>
      <text x="540" y="250" fill="currentColor" className="text-[10px] text-slate-400 dark:text-[#94A3B8] opacity-0 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>May 21</text>
      <text x="660" y="250" fill="currentColor" className="text-[10px] text-slate-400 dark:text-[#94A3B8] opacity-0 animate-fade-in-up" style={{ animationDelay: '1.0s' }}>May 26</text>
      <text x="760" y="250" fill="currentColor" className="text-[10px] text-slate-400 dark:text-[#94A3B8] opacity-0 animate-fade-in-up" style={{ animationDelay: '1.1s' }}>May 31</text>

      {/* Line Chart Area */}
      <path 
        d="M40,210 L100,160 L140,165 L200,100 L260,180 L300,160 L350,100 L400,170 L460,180 L520,130 L580,180 L640,140 L700,145 L780,150 L800,150 L800,230 L40,230 Z" 
        fill="url(#chartGradient)" 
        opacity="0"
        className="animate-fade-in-up"
        style={{ animationDelay: '1.2s' }}
      />
      <path 
        d="M40,210 L100,160 L140,165 L200,100 L260,180 L300,160 L350,100 L400,170 L460,180 L520,130 L580,180 L640,140 L700,145 L780,150 L800,150" 
        fill="none" 
        stroke="#16a34a" 
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="2000"
        strokeDashoffset="2000"
        className="animate-draw"
        style={{ animationDelay: '0.5s' }}
      />
      
      {/* Data Points (Dots on peaks) */}
      <circle cx="200" cy="100" r="4" fill="#ffffff" stroke="#16a34a" strokeWidth="2" className="opacity-0 animate-scale-in" style={{ animationDelay: '0.8s' }} />
      <circle cx="350" cy="100" r="4" fill="#ffffff" stroke="#16a34a" strokeWidth="2" className="opacity-0 animate-scale-in" style={{ animationDelay: '1.1s' }} />
      <circle cx="520" cy="130" r="4" fill="#ffffff" stroke="#16a34a" strokeWidth="2" className="opacity-0 animate-scale-in" style={{ animationDelay: '1.4s' }} />
      <circle cx="640" cy="140" r="4" fill="#ffffff" stroke="#16a34a" strokeWidth="2" className="opacity-0 animate-scale-in" style={{ animationDelay: '1.7s' }} />

      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16a34a" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const DonutChart = () => (
  <div className="relative w-40 h-40">
    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 animate-fade-in-up">
      {/* Background ring */}
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-slate-100 dark:text-[#334155]" strokeWidth="20" />
      
      {/* 95% Product Sales (Green) */}
      <circle 
        cx="50" cy="50" r="40" fill="none" stroke="#16a34a" strokeWidth="20" 
        strokeDasharray="251.2" strokeDashoffset="12.56"
        className="animate-sweep"
        style={{ animationDelay: '0.5s' }}
      />
      
      {/* 4% Delivery Charges (Light Green) */}
      <circle 
        cx="50" cy="50" r="40" fill="none" stroke="#86efac" strokeWidth="20" 
        strokeDasharray="251.2" strokeDashoffset="241.152" 
        className="origin-center rotate-[342deg] animate-sweep"
        style={{ animationDelay: '0.8s' }}
      />
      
      {/* 1% Other (Amber) */}
      <circle 
        cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="20" 
        strokeDasharray="251.2" strokeDashoffset="248.688" 
        className="origin-center rotate-[356.4deg] animate-sweep"
        style={{ animationDelay: '1.1s' }}
      />
    </svg>
  </div>
);

export const EarningsCharts = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-6">
      
      {/* Earnings Overview Line Chart */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl p-5 flex-grow hover-card opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-slate-800 dark:text-[#F8FAFC]">Earnings Overview</h3>
          <button className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-[#94A3B8] border border-slate-200 dark:border-[#334155] rounded-md px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-colors">
            Daily <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
        <EarningsLineChart />
      </div>

      {/* Earnings Breakdown Donut Chart */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl p-5 lg:w-[350px] flex-shrink-0 flex flex-col hover-card opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
        <h3 className="font-bold text-slate-800 dark:text-[#F8FAFC] mb-6">Earnings Breakdown</h3>
        
        <div className="flex items-center justify-center gap-6 flex-grow">
          <DonutChart />
          
          <div className="space-y-4">
            <div className="flex items-start gap-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '1.0s' }}>
              <div className="w-3 h-3 rounded-full bg-green-600 mt-1 shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-[#F8FAFC]">Product Sales</p>
                <p className="text-xs text-slate-500 dark:text-[#94A3B8]">₹24,560 (95%)</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
              <div className="w-3 h-3 rounded-full bg-green-300 mt-1 shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-[#F8FAFC]">Delivery Charges</p>
                <p className="text-xs text-slate-500 dark:text-[#94A3B8]">₹980 (4%)</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
              <div className="w-3 h-3 rounded-full bg-amber-500 mt-1 shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-[#F8FAFC]">Other Income</p>
                <p className="text-xs text-slate-500 dark:text-[#94A3B8]">₹130 (1%)</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#334155] flex justify-between items-center opacity-0 animate-fade-in-up" style={{ animationDelay: '1.3s' }}>
          <span className="font-medium text-slate-600 dark:text-[#94A3B8]">Total</span>
          <span className="font-bold text-lg text-slate-800 dark:text-[#F8FAFC]">₹25,670</span>
        </div>
      </div>

    </div>
  );
};
