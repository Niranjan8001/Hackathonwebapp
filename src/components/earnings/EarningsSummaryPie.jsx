import React from 'react';
import { useFarmerContext } from '../../context/FarmerContext';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
);

export const EarningsSummaryPie = () => {
  const { realEarnings, earningsLoading } = useFarmerContext();
  const total = realEarnings?.total || 0;
  
  if (earningsLoading) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 h-full min-h-[500px]">
        <Skeleton className="w-48 h-8 mb-12" />
        <div className="flex flex-col items-center gap-12">
           <Skeleton className="w-48 h-48 rounded-full" />
           <div className="w-full space-y-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="w-full h-8" />)}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 h-full shadow-2xl flex flex-col opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
      <h3 className="text-xl font-bold text-white mb-10 tracking-tight">Earnings Summary</h3>
      
      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        <div className="relative w-48 h-48 group">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="12" strokeOpacity="0.05" />
            <circle 
              cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="12" 
              strokeDasharray="251.2" strokeDashoffset={total > 0 ? 251.2 * 0.17 : 251.2} 
              className="transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(34,197,94,0.3)]"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:scale-110 transition-transform">
            <p className="text-xl font-black text-white">₹{total.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">Total</p>
          </div>
        </div>

        <div className="w-full space-y-4">
          <SummaryRow label="Completed Orders" value={`₹${total.toLocaleString()}`} percent={total > 0 ? "100%" : "0%"} color="bg-green-500" />
          <SummaryRow label="Cancelled Orders" value="₹0" percent="0%" color="bg-blue-500/20" />
          <SummaryRow label="Refunds" value="₹0" percent="0%" color="bg-amber-500/20" />
          <SummaryRow label="Others" value="₹0" percent="0%" color="bg-purple-500/20" />
        </div>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value, percent, color }) => (
  <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-xl transition-all">
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_10px_currentColor]`} />
      <span className="text-[11px] font-bold text-white/40 group-hover:text-white/80 transition-colors">{label}</span>
    </div>
    <div className="text-right">
      <span className="text-[11px] font-black text-white">{value}</span>
      <span className="text-[9px] font-medium text-white/20 ml-2">({percent})</span>
    </div>
  </div>
);
