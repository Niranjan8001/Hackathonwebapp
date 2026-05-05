import React from 'react';
import { DollarSign, ClipboardList, Package, Eye } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, change, isPositive }) => {
  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl max-xs:p-3 p-5 flex flex-col justify-between max-xs:h-[90px] h-[120px]">
      <div className="flex items-center gap-2 text-slate-500 dark:text-[#94A3B8]">
        <div className="text-green-500">
          <Icon className="w-4 h-4 max-xs:w-3.5 max-xs:h-3.5" />
        </div>
        <span className="max-xs:text-xs text-sm font-medium truncate">{title}</span>
      </div>
      
      <div className="mt-2 flex items-end justify-between">
        <div className="min-w-0">
          <h3 className="max-xs:text-lg text-2xl font-bold text-slate-800 dark:text-[#F8FAFC]">{value}</h3>
          <div className="flex items-center gap-1 mt-1 max-xs:text-[10px] text-xs">
            <span className={isPositive ? "text-green-500 font-medium" : "text-slate-500 dark:text-slate-400"}>
              {isPositive ? `+${change}` : change}
            </span>
            {title !== "Products Listed" && <span className="text-slate-400 dark:text-slate-500 max-xs:hidden">vs last 7 days</span>}
            {title !== "Products Listed" && <span className="text-slate-400 dark:text-slate-500 hidden max-xs:inline">7d</span>}
          </div>
        </div>
        
        {/* Hide mini graphs on small screens */}
        {title === "Products Listed" ? (
          <div className="w-16 h-8 flex flex-col justify-end pb-1 max-xs:hidden">
            <div className="w-full bg-slate-100 dark:bg-[#0F172A] rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        ) : (
          <div className="w-16 h-8 flex items-end max-xs:hidden">
            <svg viewBox="0 0 100 30" className="w-full h-full preserve-3d" preserveAspectRatio="none">
               <path 
                 d="M0,25 C20,20 40,30 60,10 C80,20 90,10 100,5" 
                 fill="none" 
                 stroke="currentColor" 
                 strokeWidth="3"
                 className="text-green-400 opacity-80"
               />
               <path 
                 d="M0,25 C20,20 40,30 60,10 C80,20 90,10 100,5 L100,30 L0,30 Z" 
                 fill="currentColor" 
                 className="text-green-100 dark:text-green-900/20"
               />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export const StatCards = () => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 tablet:gap-6">
      <StatCard 
        icon={DollarSign} 
        title="Total Sales" 
        value="₹24,560" 
        change="18%" 
        isPositive={true} 
      />
      <StatCard 
        icon={ClipboardList} 
        title="Orders" 
        value="32" 
        change="10%" 
        isPositive={true} 
      />
      <StatCard 
        icon={Package} 
        title="Products Listed" 
        value="12" 
        change="Active products" 
        isPositive={false} 
      />
      <StatCard 
        icon={Eye} 
        title="Store Views" 
        value="1,248" 
        change="22%" 
        isPositive={true} 
      />
    </div>
  );
};
