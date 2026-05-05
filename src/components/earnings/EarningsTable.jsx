import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const transactions = [
  { id: '#ORD1256', date: 'May 22, 2024', description: 'Payment for Order #ORD1256', amount: '₹125', type: 'Product Sale', status: 'Completed' },
  { id: '#ORD1255', date: 'May 22, 2024', description: 'Payment for Order #ORD1255', amount: '₹60', type: 'Product Sale', status: 'Completed' },
  { id: '#ORD1254', date: 'May 21, 2024', description: 'Payment for Order #ORD1254', amount: '₹180', type: 'Product Sale', status: 'Completed' },
  { id: '#ORD1253', date: 'May 21, 2024', description: 'Payment for Order #ORD1253', amount: '₹110', type: 'Product Sale', status: 'Completed' },
  { id: 'PAYOUT-021', date: 'May 20, 2024', description: 'Payout to Bank Account', amount: '- ₹8,750', type: 'Payout', status: 'Completed', isNegative: true },
  { id: '#ORD1252', date: 'May 19, 2024', description: 'Payment for Order #ORD1252', amount: '₹120', type: 'Product Sale', status: 'Completed' },
];

export const EarningsTable = () => {
  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl overflow-hidden mt-6 hover-card opacity-0 animate-fade-in-up" style={{ animationDelay: '1.0s' }}>
      <div className="p-5 border-b border-slate-100 dark:border-[#334155]">
        <h3 className="font-bold text-slate-800 dark:text-[#F8FAFC]">Earnings Transactions</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-[#0F172A]/50 border-b border-slate-100 dark:border-[#334155]">
              <th className="py-3 px-6 text-xs font-medium text-slate-500 dark:text-[#94A3B8]">Date</th>
              <th className="py-3 px-6 text-xs font-medium text-slate-500 dark:text-[#94A3B8]">Order ID</th>
              <th className="py-3 px-6 text-xs font-medium text-slate-500 dark:text-[#94A3B8]">Description</th>
              <th className="py-3 px-6 text-xs font-medium text-slate-500 dark:text-[#94A3B8]">Amount</th>
              <th className="py-3 px-6 text-xs font-medium text-slate-500 dark:text-[#94A3B8]">Type</th>
              <th className="py-3 px-6 text-xs font-medium text-slate-500 dark:text-[#94A3B8]">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={tx.id} className={`group hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-colors ${index !== transactions.length - 1 ? 'border-b border-slate-100 dark:border-[#334155]' : ''}`}>
                <td className="py-4 px-6 text-sm text-slate-600 dark:text-[#CBD5E1]">{tx.date}</td>
                <td className="py-4 px-6 text-sm font-medium text-slate-800 dark:text-[#F8FAFC]">{tx.id}</td>
                <td className="py-4 px-6 text-sm text-slate-600 dark:text-[#CBD5E1]">{tx.description}</td>
                <td className={`py-4 px-6 text-sm font-bold ${tx.isNegative ? 'text-red-500' : 'text-slate-800 dark:text-[#F8FAFC]'}`}>
                  {tx.amount}
                </td>
                <td className="py-4 px-6 text-sm text-slate-600 dark:text-[#CBD5E1]">{tx.type}</td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-slate-100 dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500 dark:text-[#94A3B8]">
          Showing <span className="font-medium text-slate-800 dark:text-[#F8FAFC]">1</span> to <span className="font-medium text-slate-800 dark:text-[#F8FAFC]">6</span> of <span className="font-medium text-slate-800 dark:text-[#F8FAFC]">22</span> transactions
        </p>
        
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-md border border-slate-200 dark:border-[#334155] text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1E293B] transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-green-600 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-transparent text-slate-600 dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-sm font-medium transition-colors">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-transparent text-slate-600 dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-sm font-medium transition-colors">3</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-transparent text-slate-600 dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-sm font-medium transition-colors">4</button>
          <button className="p-1.5 rounded-md border border-slate-200 dark:border-[#334155] text-slate-600 dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E293B] transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <button className="ml-4 text-sm font-medium text-green-600 dark:text-green-400 hover:underline">View All Transactions</button>
        </div>
      </div>
    </div>
  );
};
