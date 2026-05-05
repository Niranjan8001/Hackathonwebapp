import React from 'react';
import { Landmark } from 'lucide-react';
import { useFarmerContext } from '../../context/FarmerContext';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
);

export const PayoutHistory = () => {
  const { earningsLoading } = useFarmerContext();
  const history = []; // Fetch from backend if endpoint is added

  if (earningsLoading) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 min-h-[300px]">
        <div className="flex justify-between mb-8">
           <Skeleton className="w-32 h-8" />
           <Skeleton className="w-16 h-4" />
        </div>
        <div className="space-y-4">
           {[1, 2, 3].map(i => <Skeleton key={i} className="w-full h-20" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl flex flex-col opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-white tracking-tight">Payout History</h3>
        <button className="text-[10px] font-black uppercase tracking-widest text-green-400 hover:text-green-300 transition-colors">View All</button>
      </div>

      <div className="space-y-4">
        {history.length > 0 ? history.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group cursor-pointer hover:translate-x-1 transition-transform">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 text-white/20 group-hover:text-green-400 transition-colors">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black text-white group-hover:text-green-400 transition-colors">{item.bank}</p>
                  <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">{item.date}</p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-sm font-black text-white">{item.amount}</p>
                <span className="text-[9px] font-black uppercase tracking-widest text-green-400 bg-green-500/10 px-2 py-0.5 rounded-md mt-1 inline-block">Completed</span>
             </div>
          </div>
        )) : (
          <div className="py-16 flex flex-col items-center justify-center opacity-10 text-center grayscale group hover:grayscale-0 transition-all">
             <Landmark className="w-12 h-12 mb-4" />
             <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">No payout history<br/>detected</p>
          </div>
        )}
      </div>
    </div>
  );
};
