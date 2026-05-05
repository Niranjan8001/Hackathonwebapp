import React from 'react';
import { ShoppingBag } from 'lucide-react';

export const ItemsOrdered = ({ items }) => {
  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl overflow-hidden">
      {/* Section Title */}
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800 dark:text-[#F8FAFC] flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-green-600 dark:text-green-400" />
          Items Ordered
          <span className="text-xs font-medium text-slate-500 dark:text-[#94A3B8] ml-1">
            ({items.length})
          </span>
        </h2>
      </div>

      {/* ── Desktop Table (hidden on small screens) ────────────── */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-y border-slate-100 dark:border-[#334155] bg-slate-50/50 dark:bg-[#0F172A]/50">
              <th className="py-3 px-6 text-xs font-medium text-slate-500 dark:text-[#94A3B8]">Product</th>
              <th className="py-3 px-6 text-xs font-medium text-slate-500 dark:text-[#94A3B8] text-center">Quantity</th>
              <th className="py-3 px-6 text-xs font-medium text-slate-500 dark:text-[#94A3B8] text-right">Price/Unit</th>
              <th className="py-3 px-6 text-xs font-medium text-slate-500 dark:text-[#94A3B8] text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={index}
                className={`hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-colors ${
                  index !== items.length - 1 ? 'border-b border-slate-100 dark:border-[#334155]' : ''
                }`}
              >
                <td className="py-3 px-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-[#334155]"
                    />
                    <span className="font-semibold text-sm text-slate-800 dark:text-[#F8FAFC]">
                      {item.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-6 text-center">
                  <span className="text-sm text-slate-600 dark:text-[#CBD5E1]">
                    {item.qty} {item.unit}
                  </span>
                </td>
                <td className="py-3 px-6 text-right">
                  <span className="text-sm text-slate-600 dark:text-[#CBD5E1]">
                    ₹{item.pricePerUnit}/{item.unit}
                  </span>
                </td>
                <td className="py-3 px-6 text-right">
                  <span className="font-semibold text-sm text-slate-800 dark:text-[#F8FAFC]">
                    ₹{item.total}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Stacked Cards (visible on small screens) ────── */}
      <div className="sm:hidden px-4 pb-4 space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-[#0F172A]/50 border border-slate-100 dark:border-[#334155]"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-[#334155] flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-slate-800 dark:text-[#F8FAFC] truncate">
                {item.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
                {item.qty} {item.unit} × ₹{item.pricePerUnit}
              </p>
            </div>
            <p className="font-bold text-sm text-slate-800 dark:text-[#F8FAFC] flex-shrink-0">
              ₹{item.total}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
