import React from 'react';
import { useFarmerContext } from '../../context/FarmerContext';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
);

export const EarningsTable = () => {
  const { realOrders = [], earningsLoading } = useFarmerContext();
  
  if (earningsLoading) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 h-full min-h-[400px]">
        <Skeleton className="w-48 h-8 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="w-full h-16" />)}
        </div>
      </div>
    );
  }

  const transactions = realOrders.map(o => ({
    id: `#ORD${o._id?.slice(-5).toUpperCase() || 'XXXXX'}`,
    date: new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    customer: o.buyer?.name || 'Customer',
    amount: `₹${o.totalAmount?.toLocaleString() || 0}`,
    status: o.status === 'Pending' ? 'Pending' : (o.status === 'Cancelled' ? 'Cancelled' : 'Completed')
  })).slice(0, 5);

  return (
    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 h-full shadow-2xl flex flex-col opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
          <p className="text-xs text-white/40 mt-1 tracking-widest uppercase font-black">Your latest income activities</p>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest text-green-400 hover:text-green-300 transition-colors">View All</button>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-widest text-white/20">
              <th className="pb-4 pl-6 font-black">Order ID</th>
              <th className="pb-4 font-black">Date</th>
              <th className="pb-4 font-black">Customer</th>
              <th className="pb-4 font-black">Amount</th>
              <th className="pb-4 font-black">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? transactions.map((t, i) => (
              <tr key={i} className="group bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                <td className="py-4 pl-6 rounded-l-2xl text-xs font-bold text-white/60 group-hover:text-green-400 transition-colors">{t.id}</td>
                <td className="py-4 text-xs font-medium text-white/40">{t.date}</td>
                <td className="py-4 text-xs font-bold text-white">{t.customer}</td>
                <td className="py-4 text-xs font-black text-white">{t.amount}</td>
                <td className="py-4 pr-6 rounded-r-2xl">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                    t.status === 'Completed' ? 'bg-green-500/10 text-green-400' :
                    t.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="py-20 text-center opacity-20">
                   <p className="text-xs font-black uppercase tracking-widest">No recent transactions found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
