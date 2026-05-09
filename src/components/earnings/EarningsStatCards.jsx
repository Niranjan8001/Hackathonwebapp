import React, { useState, useEffect } from 'react';
import { Wallet, Clock, Landmark, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useFarmerContext } from '../../context/FarmerContext';

const CountUp = ({ end, prefix = "₹" }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return <span>{prefix}{count.toLocaleString()}</span>;
};

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
);

export const EarningsStatCards = () => {
  const { 
    realOrders = [], 
    earningsLoading,
    totalEarnings,
    thisMonthEarnings,
    pendingEarnings,
    earningsPercentageChange 
  } = useFarmerContext();
  
  if (earningsLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 min-h-[180px]">
             <div className="flex items-center gap-4 mb-6">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <Skeleton className="w-24 h-4" />
             </div>
             <Skeleton className="w-32 h-10 mb-4" />
             <Skeleton className="w-20 h-3" />
          </div>
        ))}
      </div>
    );
  }

  const total = totalEarnings || 0;
  const pendingOrders = realOrders.filter(o => o.status === 'Pending' || o.status === 'pending' || o.status === 'Processing');
  const pendingAmount = pendingEarnings || 0;
  
  const stats = [
    { label: 'Total Earnings', value: total, icon: <Wallet />, trend: total > 0 ? 'Lifetime' : 'No Data', color: 'text-green-400' },
    { label: 'Pending Amount', value: pendingAmount, icon: <Clock />, trend: `${pendingOrders.length} orders`, color: 'text-amber-400' },
    { label: 'Withdrawn Amount', value: 0, icon: <Landmark />, trend: '0 withdrawals', color: 'text-white/20' },
    { label: 'This Month', value: thisMonthEarnings || 0, icon: <TrendingUp />, trend: `${earningsPercentageChange > 0 ? '+' : ''}${earningsPercentageChange}%`, color: earningsPercentageChange >= 0 ? 'text-green-400' : 'text-red-400' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
      {stats.map((stat, i) => (
        <div key={i} className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 hover:bg-white/[0.04] transition-all group relative overflow-hidden flex flex-col justify-between min-h-[180px] shadow-2xl">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500 text-white/60">
              {React.cloneElement(stat.icon, { className: 'w-6 h-6' })}
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/20">{stat.label}</p>
          </div>
          
          <div className="space-y-2 relative z-10">
            <p className="text-3xl font-black text-white tracking-tight">
              <CountUp end={stat.value} />
            </p>
            <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${stat.color}`}>
              {stat.trend.includes('%') && <ArrowUpRight className="w-3 h-3" />}
              {stat.trend}
            </div>
          </div>
          
          {/* Subtle Glow */}
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 blur-3xl rounded-full group-hover:bg-white/10 transition-colors" />
        </div>
      ))}
    </div>
  );
};
