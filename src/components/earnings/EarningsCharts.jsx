import React from 'react';
import { useFarmerContext } from '../../context/FarmerContext';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
);

export const EarningsCharts = () => {
  const { 
    realOrders = [], 
    earningsLoading,
    totalEarnings,
    thisMonthEarnings,
    lastMonthEarnings,
    pendingEarnings 
  } = useFarmerContext();
  const hasData = realOrders.length > 0;

  if (earningsLoading) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 h-full min-h-[450px]">
        <div className="flex items-center justify-between mb-10">
          <Skeleton className="w-48 h-8" />
          <Skeleton className="w-32 h-10" />
        </div>
        <Skeleton className="w-full h-64" />
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 h-full flex flex-col min-h-[450px] shadow-2xl opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-xl font-bold text-white">Earnings Overview</h3>
          <p className="text-xs text-white/40 mt-1 tracking-wider uppercase font-black">Monthly performance tracking</p>
        </div>
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          {['Daily', 'Weekly', 'Monthly'].map(tab => (
            <button 
              key={tab}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                tab === 'Monthly' ? 'bg-white/10 text-white shadow-xl' : 'text-white/20 hover:text-white/40'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative mt-4">
        {!hasData ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-dashed border-white/10">
              <span className="text-3xl opacity-50">📊</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white/60">Insufficient Data</p>
              <p className="text-[10px] text-white/20 mt-1 max-w-[240px] leading-relaxed">Chart data will appear here once you complete your first orders.</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col group">
             <div className="flex-1 relative px-2 overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
                  <path 
                    d="M 50 350 L 200 300 L 350 320 L 500 250 L 650 280 L 800 220 L 950 180 L 950 400 L 50 400 Z" 
                    fill="url(#chartGradient)" 
                    className="transition-all duration-1000"
                  />
                  <path 
                    d="M 50 350 L 200 300 L 350 320 L 500 250 L 650 280 L 800 220 L 950 180" 
                    fill="none" 
                    stroke="#22c55e" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    strokeDasharray="2000"
                    strokeDashoffset="2000"
                    className="animate-draw-line"
                  />
                  {[
                    {x: 50, y: 350}, {x: 200, y: 300}, {x: 350, y: 320}, 
                    {x: 500, y: 250}, {x: 650, y: 280}, {x: 800, y: 220}, {x: 950, y: 180}
                  ].map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="6" fill="#22c55e" className="hover:r-8 transition-all cursor-pointer shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                  ))}
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
             </div>
             <div className="flex justify-between px-2 mt-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
               <span>Dec '24</span>
               <span>Jan '25</span>
               <span>Feb '25</span>
               <span>Mar '25</span>
               <span>Apr '25</span>
               <span>May '25</span>
             </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 mt-12 pt-8 border-t border-white/5">
        <ChartStat label="This Month" value={`₹${thisMonthEarnings.toLocaleString('en-IN')}`} color="text-green-400" />
        <ChartStat label="Total Earnings" value={`₹${totalEarnings.toLocaleString('en-IN')}`} color="text-white" />
        <ChartStat label="Total Withdrawn" value="₹0" color="text-white" />
        <ChartStat label="Pending Amount" value={`₹${pendingEarnings.toLocaleString('en-IN')}`} color="text-white" />
        <ChartStat label="Last Month" value={`₹${lastMonthEarnings.toLocaleString('en-IN')}`} color="text-white" />
      </div>
    </div>
  );
};

const ChartStat = ({ label, value, color }) => (
  <div className="space-y-1 group">
    <p className={`text-base lg:text-lg font-black tracking-tight ${color} group-hover:scale-105 transition-transform origin-left`}>{value}</p>
    <p className="text-[10px] font-bold text-white/10 group-hover:text-white/20 uppercase tracking-widest transition-colors whitespace-nowrap">{label}</p>
  </div>
);
