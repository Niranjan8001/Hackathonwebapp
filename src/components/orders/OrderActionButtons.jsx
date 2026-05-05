import React from 'react';
import { Truck, CheckCircle2, XCircle, Download, MessageCircle } from 'lucide-react';

export const OrderActionButtons = ({ status, onMarkShipped, onMarkDelivered, onCancelOrder }) => {
  return (
    <>
      {/* ── Mobile Sticky Bottom Bar ──────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-[#334155] p-4 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-2">
          {/* Dynamic Buttons */}
          {status === 'Processing' && (
            <div className="flex gap-2">
              <button
                onClick={onCancelOrder}
                className="flex-1 flex items-center justify-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 px-4 py-3 rounded-xl font-semibold transition-colors text-sm border border-red-200 dark:border-red-500/20"
              >
                <XCircle className="w-4 h-4" />
                Cancel Order
              </button>
              <button
                onClick={onMarkShipped}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold transition-colors text-sm shadow-sm"
              >
                <Truck className="w-4 h-4" />
                Mark as Shipped
              </button>
            </div>
          )}

          {status === 'Shipped' && (
            <button
              onClick={onMarkDelivered}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold transition-colors text-sm shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark as Delivered
            </button>
          )}

          {/* Always-visible buttons */}
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-slate-700 dark:text-[#F8FAFC] px-4 py-2.5 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-colors text-sm">
              <Download className="w-4 h-4" />
              Invoice
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-slate-700 dark:text-[#F8FAFC] px-4 py-2.5 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-colors text-sm">
              <MessageCircle className="w-4 h-4" />
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* ── Desktop Inline Action Bar ─────────────────────────────── */}
      <div className="hidden md:flex items-center justify-end gap-3 px-8 py-4 sticky bottom-0 bg-[#F8FAFC]/80 dark:bg-[#020617]/80 backdrop-blur-md border-t border-slate-200/50 dark:border-[#334155]/50">
        {/* Download Invoice */}
        <button className="flex items-center gap-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-slate-700 dark:text-[#F8FAFC] px-5 py-2.5 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-colors text-sm shadow-sm">
          <Download className="w-4 h-4" />
          Download Invoice
        </button>

        {/* Contact Customer */}
        <button className="flex items-center gap-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-slate-700 dark:text-[#F8FAFC] px-5 py-2.5 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-colors text-sm shadow-sm">
          <MessageCircle className="w-4 h-4" />
          Contact Customer
        </button>

        {/* Dynamic Status Actions */}
        {status === 'Processing' && (
          <>
            <button
              onClick={onCancelOrder}
              className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 px-5 py-2.5 rounded-lg font-semibold transition-colors text-sm border border-red-200 dark:border-red-500/20"
            >
              <XCircle className="w-4 h-4" />
              Cancel Order
            </button>
            <button
              onClick={onMarkShipped}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors text-sm shadow-sm"
            >
              <Truck className="w-4 h-4" />
              Mark as Shipped
            </button>
          </>
        )}

        {status === 'Shipped' && (
          <button
            onClick={onMarkDelivered}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors text-sm shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark as Delivered
          </button>
        )}
      </div>
    </>
  );
};
