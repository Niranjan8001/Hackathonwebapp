import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Phone, ChevronRight } from 'lucide-react';

const statusConfig = {
  Delivered: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',
  Processing: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  Shipped: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
  Cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  Confirmed: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  Pending: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
};

export const OrderDetailHeader = ({ order }) => {
  const navigate = useNavigate();

  return (
    <div className="pt-2">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-[#94A3B8] mb-2">
        <button
          onClick={() => navigate('/orders')}
          className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
        >
          Orders
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-[#F8FAFC] font-medium">
          {order.id}
        </span>
      </div>

      {/* Main Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate('/orders')}
            className="p-2 -ml-2 rounded-lg text-slate-600 dark:text-[#94A3B8] hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors flex-shrink-0"
            aria-label="Back to Orders"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-[#F8FAFC] truncate">
                Order {order.id}
              </h1>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${
                  statusConfig[order.status] || statusConfig.Pending
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-[#94A3B8] mt-0.5">
              Placed on {order.date} at {order.time}
            </p>
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-3 max-xs:w-full">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-slate-700 dark:text-[#F8FAFC] px-4 py-2.5 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-colors shadow-sm text-sm">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download Invoice</span>
            <span className="sm:hidden">Invoice</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm text-sm">
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Contact Customer</span>
            <span className="sm:hidden">Contact</span>
          </button>
        </div>
      </div>
    </div>
  );
};
