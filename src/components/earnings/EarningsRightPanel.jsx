import React, { useState, useEffect } from 'react';
import { Landmark, ArrowRight, CheckCircle2, Loader2, Check } from 'lucide-react';

const CountUp = ({ end, duration = 1000, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const endValue = typeof end === 'string' ? parseFloat(end.replace(/[₹,]/g, '')) : end;
    
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = Math.floor(progress * endValue);
      setCount(currentCount);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  const formatValue = (val) => {
    return prefix + val.toLocaleString() + suffix;
  };

  return <span>{formatValue(count)}</span>;
};

const SummaryItem = ({ label, value, isGreen, isRed }) => (
  <div className="flex justify-between py-2.5">
    <span className="text-sm text-slate-600 dark:text-[#94A3B8]">{label}</span>
    <span className={`text-sm font-semibold ${isGreen ? 'text-green-600 dark:text-green-400' : isRed ? 'text-red-500' : 'text-slate-800 dark:text-[#F8FAFC]'}`}>
      {isGreen && '+ '}{value}
    </span>
  </div>
);

const PayoutButton = () => {
  const [status, setStatus] = useState('idle'); // idle | processing | success

  const handleClick = () => {
    if (status !== 'idle') return;
    
    setStatus('processing');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      
      // Reset back to idle after 3 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }, 2000);
  };

  return (
    <button 
      onClick={handleClick}
      disabled={status !== 'idle'}
      className={`w-full py-3 rounded-lg font-bold text-sm mt-5 transition-all duration-500 shadow-sm flex items-center justify-center gap-2 overflow-hidden relative
        ${status === 'idle' ? 'bg-green-600 hover:bg-green-700 text-white hover:scale-[1.02] active:scale-[0.98]' : ''}
        ${status === 'processing' ? 'bg-green-700 text-white/70 cursor-not-allowed' : ''}
        ${status === 'success' ? 'bg-emerald-500 text-white cursor-default' : ''}
      `}
    >
      <div className="flex items-center justify-center gap-2 transition-all duration-300">
        {status === 'idle' && (
          <span className="animate-fade-in">Request Payout</span>
        )}
        
        {status === 'processing' && (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="animate-pulse">Processing...</span>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="bg-white/20 rounded-full p-0.5">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path className="animate-checkmark" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="animate-fade-in">Sent Successfully</span>
          </>
        )}
      </div>
    </button>
  );
};

export const EarningsRightPanel = () => {
  return (
    <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
      
      {/* Payouts */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl p-5 hover-card opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 dark:text-[#F8FAFC]">Payouts</h3>
          <button className="text-xs font-medium text-green-600 dark:text-green-400 hover:underline">View All</button>
        </div>
        
        <p className="text-xs text-slate-500 dark:text-[#94A3B8]">Available for Payout</p>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-[#F8FAFC] mt-1">
          <CountUp end="₹22,150" prefix="₹" />
        </h2>
        <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-1 uppercase tracking-wider">Transferred to your bank</p>
        
        <div className="mt-5 p-3 rounded-lg border border-slate-100 dark:border-[#334155] flex items-center gap-3 group">
          <div className="bg-slate-50 dark:bg-[#0F172A] p-2 rounded-md transition-transform duration-300 group-hover:scale-110">
            <Landmark className="w-5 h-5 text-slate-600 dark:text-[#94A3B8]" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-[#F8FAFC]">Bank Account</p>
            <p className="text-[10px] text-slate-500 dark:text-[#94A3B8]">**** **** 1234 • State Bank of India</p>
          </div>
        </div>
        
        <PayoutButton />
        
        <div className="mt-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <p className="text-[10px] text-slate-500 dark:text-[#94A3B8]">Payouts are transferred within 2-3 business days.</p>
        </div>
      </div>

      {/* Earnings Summary */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl p-5 hover-card opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 dark:text-[#F8FAFC]">Earnings Summary</h3>
          <button className="text-xs font-medium text-slate-600 dark:text-[#94A3B8] flex items-center gap-1">
            This Month <ArrowRight className="w-3 h-3 rotate-90" />
          </button>
        </div>
        
        <div className="space-y-1">
          <SummaryItem label="Total Earnings" value="₹24,560" />
          <SummaryItem label="Delivery Charges" value="₹980" isGreen />
          <SummaryItem label="Other Income" value="₹130" isGreen />
          <SummaryItem label="Refunds & Returns" value="₹1,500" isRed />
          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-[#334155]">
            <SummaryItem label="Net Earnings" value="₹22,150" isGreen />
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl p-5 hover-card opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 dark:text-[#F8FAFC]">Top Selling Products</h3>
          <button className="text-xs font-medium text-green-600 dark:text-green-400 hover:underline">View Report</button>
        </div>
        
        <div className="space-y-4">
          {[
            { name: 'Fresh Tomatoes', orders: '75 orders', value: '₹7,560', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&h=100&fit=crop', delay: '0.7s' },
            { name: 'Potatoes', orders: '40 orders', value: '₹4,320', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=100&h=100&fit=crop', delay: '0.8s' },
            { name: 'Cucumbers', orders: '35 orders', value: '₹3,280', img: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=100&h=100&fit=crop', delay: '0.9s' },
            { name: 'Red Onions', orders: '28 orders', value: '₹2,850', img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=100&h=100&fit=crop', delay: '1.0s' },
            { name: 'Whole Wheat', orders: '20 orders', value: '₹2,150', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&h=100&fit=crop', delay: '1.1s' },
          ].map((prod) => (
            <div key={prod.name} className="flex items-center gap-3 opacity-0 animate-fade-in-up" style={{ animationDelay: prod.delay }}>
              <img src={prod.img} alt={prod.name} className="w-10 h-10 rounded-lg object-cover border border-slate-100 dark:border-[#334155] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC] truncate">{prod.name}</p>
                <p className="text-xs text-slate-500 dark:text-[#94A3B8]">{prod.orders}</p>
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-[#F8FAFC]">{prod.value}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
