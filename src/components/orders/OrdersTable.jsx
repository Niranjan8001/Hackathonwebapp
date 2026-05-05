import React from 'react';
import { Eye, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OrdersTable = ({ orders }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl overflow-hidden flex flex-col">
      {/* Desktop & Tablet View (Table) */}
      <div className="hidden tablet:block overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-[#334155] bg-slate-50/50 dark:bg-[#0F172A]/50">
              <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">Order ID</th>
              <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">Customer</th>
              <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">Products</th>
              <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">Qty</th>
              <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">Amount</th>
              <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">Date</th>
              <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">Status</th>
              <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr 
                key={order.id} 
                className={`group hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-colors ${
                  index !== orders.length - 1 ? 'border-b border-slate-100 dark:border-[#334155]' : ''
                }`}
              >
                <td className="py-4 px-6">
                  <span className="font-bold text-sm text-slate-800 dark:text-[#F8FAFC]">{order.id}</span>
                </td>
                <td className="py-4 px-6">
                  <p className="font-bold text-sm text-slate-800 dark:text-[#F8FAFC]">{order.customer}</p>
                  <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">{order.location}</p>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img src={order.img} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-100 dark:border-[#334155]" />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-800 dark:text-[#F8FAFC] truncate">{order.product}</p>
                      <p className="text-xs text-slate-500 dark:text-[#94A3B8]">{order.weight}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm">{order.quantity}</td>
                <td className="py-4 px-6 font-bold text-sm">{order.amount}</td>
                <td className="py-4 px-6">
                  <p className="text-sm">{order.date}</p>
                  <p className="text-xs text-slate-500">{order.time}</p>
                </td>
                <td className="py-4 px-6">
                  <StatusBadge status={order.status} />
                </td>
                <td className="py-4 px-6 text-center">
                  <button 
                    onClick={() => navigate(`/orders/${order.id.replace('#', '')}`)}
                    className="p-2 rounded-lg border border-slate-200 dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-[#1E293B] transition-all"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View (Card Layout) */}
      <div className="tablet:hidden divide-y divide-slate-100 dark:divide-[#334155]">
        {orders.map((order) => (
          <div key={order.id} className="p-4 space-y-4 hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800 dark:text-[#F8FAFC]">{order.id}</span>
              <StatusBadge status={order.status} />
            </div>
            
            <div className="flex gap-4">
              <img src={order.img} alt="" className="w-16 h-16 rounded-xl object-cover border border-slate-100 dark:border-[#334155] shrink-0" />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-slate-800 dark:text-[#F8FAFC] truncate">{order.product}</h4>
                <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">{order.weight} • {order.quantity} units</p>
                <p className="font-bold text-green-600 dark:text-green-400 mt-1">{order.amount}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Customer</span>
                <span className="text-sm font-medium text-slate-700 dark:text-[#CBD5E1]">{order.customer}</span>
              </div>
              <button 
                onClick={() => navigate(`/orders/${order.id.replace('#', '')}`)}
                className="bg-slate-100 dark:bg-[#1E293B] text-slate-600 dark:text-[#94A3B8] px-4 py-2 rounded-lg text-sm font-bold active:scale-95 transition-transform"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500 dark:text-[#94A3B8]">
          Showing <span className="font-medium text-slate-800 dark:text-[#F8FAFC]">1</span> to <span className="font-medium text-slate-800 dark:text-[#F8FAFC]">8</span> of <span className="font-medium text-slate-800 dark:text-[#F8FAFC]">32</span> orders
        </p>
        
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-md border border-slate-200 dark:border-[#334155] text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1E293B] transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-green-600 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-transparent text-slate-600 dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-sm font-medium transition-colors">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-transparent text-slate-600 dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-sm font-medium transition-colors">
            3
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-transparent text-slate-600 dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-sm font-medium transition-colors">
            4
          </button>
          
          <button className="p-1.5 rounded-md border border-slate-200 dark:border-[#334155] text-slate-600 dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E293B] transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <button className="flex items-center gap-2 ml-4 p-1.5 px-3 rounded-md border border-slate-200 dark:border-[#334155] text-sm text-slate-600 dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E293B] transition-colors">
            <span>10 / page</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
    status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 
    status === 'Processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' :
    status === 'Shipped' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' :
    status === 'Confirmed' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
    status === 'Pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400' :
    'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
  }`}>
    {status}
  </span>
);
