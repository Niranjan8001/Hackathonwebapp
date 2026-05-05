import React from 'react';
import { IndianRupee } from 'lucide-react';

export const PaymentBreakdown = ({ order }) => {
  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl p-5 sm:p-6">
      <h2 className="text-base font-bold text-slate-800 dark:text-[#F8FAFC] mb-5 flex items-center gap-2">
        <IndianRupee className="w-4 h-4 text-green-600 dark:text-green-400" />
        Payment Summary
      </h2>

      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-[#CBD5E1]">Subtotal</span>
          <span className="text-sm font-medium text-slate-800 dark:text-[#F8FAFC]">₹{order.subtotal}</span>
        </div>

        {/* Delivery Charges */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-[#CBD5E1]">Delivery Charges</span>
          <span className="text-sm font-medium text-slate-800 dark:text-[#F8FAFC]">₹{order.deliveryCharge}</span>
        </div>

        {/* Platform Fee */}
        {order.platformFee > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-[#CBD5E1]">
              Platform Fee
              <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">(incl. GST)</span>
            </span>
            <span className="text-sm font-medium text-slate-800 dark:text-[#F8FAFC]">₹{order.platformFee}</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-dashed border-slate-200 dark:border-[#334155] my-1" />

        {/* Final Total */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800 dark:text-[#F8FAFC]">Total Amount</span>
          <span className="text-lg font-bold text-green-600 dark:text-green-400">₹{order.total}</span>
        </div>
      </div>

      {/* Payment Method Pill */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#334155]">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-[#94A3B8]">Payment Method</span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20">
            {order.paymentMethod === 'UPI' && '📱 '}
            {order.paymentMethod === 'COD' && '💵 '}
            {order.paymentMethod === 'Card' && '💳 '}
            {order.paymentMethod}
          </span>
        </div>
      </div>
    </div>
  );
};
