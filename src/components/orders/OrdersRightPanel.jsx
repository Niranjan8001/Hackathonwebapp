import React from 'react';
import { Package, Clock, CheckCircle2, CheckCircle, Settings, Truck, XCircle, RotateCcw, Copy, Download } from 'lucide-react';

const OverviewItem = ({ icon: Icon, label, value, iconColor, bgColor }) => (
  <div className="flex gap-3">
    <div className={`p-2 rounded-lg ${bgColor} ${iconColor} shrink-0 mt-0.5`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xs text-slate-500 dark:text-[#94A3B8]">{label}</p>
      <p className="font-semibold text-slate-800 dark:text-[#F8FAFC]">{value}</p>
    </div>
  </div>
);

const QuickActionItem = ({ icon: Icon, title, description }) => (
  <button className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-colors w-full text-left group">
    <div className="text-green-600 dark:text-green-400 mt-0.5">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="font-semibold text-sm text-slate-800 dark:text-[#F8FAFC]">{title}</p>
      <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">{description}</p>
    </div>
  </button>
);

export const OrdersRightPanel = () => {
  return (
    <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
      
      {/* Order Overview */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 dark:text-[#F8FAFC]">Order Overview</h3>
          <button className="text-xs font-medium text-slate-600 dark:text-[#94A3B8] flex items-center gap-1 hover:text-slate-800 dark:hover:text-[#F8FAFC]">
            This Month <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-y-6 gap-x-2 mb-5">
          <OverviewItem icon={Package} label="Total Orders" value="32" iconColor="text-green-600 dark:text-green-400" bgColor="bg-green-50 dark:bg-green-500/10" />
          <OverviewItem icon={Clock} label="Pending" value="5" iconColor="text-orange-500" bgColor="bg-orange-50 dark:bg-orange-500/10" />
          <OverviewItem icon={CheckCircle2} label="Delivered" value="10" iconColor="text-green-600 dark:text-green-400" bgColor="bg-green-50 dark:bg-green-500/10" />
          <OverviewItem icon={CheckCircle} label="Confirmed" value="8" iconColor="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-500/10" />
          <OverviewItem icon={Settings} label="Processing" value="6" iconColor="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-500/10" />
          <OverviewItem icon={Truck} label="Shipped" value="9" iconColor="text-indigo-500" bgColor="bg-indigo-50 dark:bg-indigo-500/10" />
          <OverviewItem icon={XCircle} label="Cancelled" value="2" iconColor="text-red-500" bgColor="bg-red-50 dark:bg-red-500/10" />
        </div>
        
        <button className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1 hover:text-green-700 dark:hover:text-green-300">
          View All Orders <span>→</span>
        </button>
      </div>

      {/* Top Selling in Orders */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl p-5">
        <h3 className="font-bold text-slate-800 dark:text-[#F8FAFC] mb-5">Top Selling in Orders</h3>
        
        <div className="space-y-4 mb-5">
          <div className="flex gap-3 items-center">
            <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&h=100&fit=crop" alt="Tomatoes" className="w-10 h-10 rounded-lg object-cover border border-slate-100 dark:border-[#334155] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">Fresh Tomatoes</p>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8]">75 kg ordered</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <img src="https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=100&h=100&fit=crop" alt="Potatoes" className="w-10 h-10 rounded-lg object-cover border border-slate-100 dark:border-[#334155] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">Potatoes</p>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8]">40 kg ordered</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <img src="https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=100&h=100&fit=crop" alt="Cucumbers" className="w-10 h-10 rounded-lg object-cover border border-slate-100 dark:border-[#334155] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">Cucumbers</p>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8]">35 kg ordered</p>
            </div>
          </div>
        </div>

        <button className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1 hover:text-green-700 dark:hover:text-green-300">
          View Sales Report <span>→</span>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl p-5">
        <h3 className="font-bold text-slate-800 dark:text-[#F8FAFC] mb-4">Quick Actions</h3>
        
        <div className="space-y-2">
          <QuickActionItem icon={RotateCcw} title="Manage Returns" description="View and manage return requests" />
          <QuickActionItem icon={Copy} title="Bulk Update Status" description="Update multiple orders status" />
          <QuickActionItem icon={Download} title="Download Invoices" description="Download invoices in bulk" />
        </div>
      </div>

    </div>
  );
};
