import React from 'react';
import { Landmark } from 'lucide-react';
import { useFarmerContext } from '../../context/FarmerContext';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
);

export const WithdrawNowCard = () => {
  const { realEarnings, earningsLoading } = useFarmerContext();
  const availableBalance = realEarnings?.total || 0;

  if (earningsLoading) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 min-h-[300px]">
        <Skeleton className="w-40 h-8 mb-8" />
        <Skeleton className="w-full h-20 mb-8" />
        <Skeleton className="w-full h-14 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-8 tracking-tight">Withdraw Now</h3>
        
        <div className="space-y-2 mb-10">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Available Balance</p>
          <p className="text-4xl font-black text-white tracking-tighter">₹{availableBalance.toLocaleString()}</p>
          <p className="text-[10px] text-white/40 font-bold tracking-wide italic">Min. withdrawal amount is ₹500</p>
        </div>

        <button className="w-full py-4.5 bg-green-500 hover:bg-green-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 shadow-[0_10px_30px_rgba(34,197,94,0.3)] transition-all active:scale-95 group/btn overflow-hidden relative">
           <Landmark className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
           <span>Withdraw Earnings</span>
           <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out" />
        </button>
      </div>

      <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700 rotate-12 group-hover:rotate-0">
        <Landmark className="w-48 h-48 text-green-500" />
      </div>
    </div>
  );
};
