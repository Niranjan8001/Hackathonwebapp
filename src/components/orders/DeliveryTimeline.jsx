import React from 'react';
import { CheckCircle2, Circle, Package, Truck, Box, XCircle } from 'lucide-react';

const steps = [
  { key: 'placed', label: 'Order Placed', icon: Package, description: 'Order confirmed & payment received' },
  { key: 'packed', label: 'Packed', icon: Box, description: 'Items packed and ready for pickup' },
  { key: 'shipped', label: 'Shipped', icon: Truck, description: 'On the way to delivery address' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2, description: 'Successfully delivered to customer' },
];

export const DeliveryTimeline = ({ timeline, status }) => {
  const isCancelled = status === 'Cancelled';

  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl p-5 sm:p-6">
      <h2 className="text-base font-bold text-slate-800 dark:text-[#F8FAFC] mb-6 flex items-center gap-2">
        <Truck className="w-4 h-4 text-green-600 dark:text-green-400" />
        Delivery Timeline
      </h2>

      {/* Cancelled Banner */}
      {isCancelled && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 mb-5">
          <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">Order Cancelled</p>
            <p className="text-xs text-red-500 dark:text-red-400/70">This order was cancelled. Refund initiated if applicable.</p>
          </div>
        </div>
      )}

      {/* ── Desktop: Horizontal Timeline (hidden on mobile) ──── */}
      <div className="hidden md:block">
        <div className="relative flex items-start justify-between">
          {/* Connecting Line */}
          <div className="absolute top-5 left-[5%] right-[5%] h-0.5 bg-slate-200 dark:bg-[#334155] z-0" />
          <div
            className="absolute top-5 left-[5%] h-0.5 bg-green-500 dark:bg-green-400 z-0 transition-all duration-500"
            style={{
              width: isCancelled
                ? '0%'
                : `${Math.max(0, (steps.filter(s => timeline[s.key]?.done).length - 1) / (steps.length - 1)) * 90}%`,
            }}
          />

          {steps.map((step, i) => {
            const stepData = timeline[step.key];
            const done = !isCancelled && stepData?.done;

            return (
              <div key={step.key} className="flex flex-col items-center text-center relative z-10" style={{ width: '25%' }}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCancelled
                      ? 'bg-red-100 dark:bg-red-500/10 text-red-400 dark:text-red-400/50'
                      : done
                      ? 'bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400 shadow-md shadow-green-500/10'
                      : 'bg-slate-100 dark:bg-[#0F172A] text-slate-400 dark:text-slate-500'
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <p className={`text-xs font-semibold mt-2 ${
                  done ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 max-w-[120px] leading-tight">
                  {done && stepData.date ? stepData.date : step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mobile: Vertical Timeline ────────────────────────── */}
      <div className="md:hidden space-y-0">
        {steps.map((step, i) => {
          const stepData = timeline[step.key];
          const done = !isCancelled && stepData?.done;
          const isLast = i === steps.length - 1;

          return (
            <div key={step.key} className="flex gap-3">
              {/* Icon + Connector Line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    isCancelled
                      ? 'bg-red-100 dark:bg-red-500/10 text-red-400 dark:text-red-400/50'
                      : done
                      ? 'bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400 shadow-sm shadow-green-500/10'
                      : 'bg-slate-100 dark:bg-[#0F172A] text-slate-400 dark:text-slate-500'
                  }`}
                >
                  <step.icon className="w-4 h-4" />
                </div>
                {!isLast && (
                  <div className={`w-0.5 flex-1 min-h-[24px] ${
                    isCancelled
                      ? 'bg-red-200 dark:bg-red-500/20'
                      : done
                      ? 'bg-green-400 dark:bg-green-500/40'
                      : 'bg-slate-200 dark:bg-[#334155]'
                  }`} />
                )}
              </div>

              {/* Content */}
              <div className={`pb-5 ${isLast ? 'pb-0' : ''}`}>
                <p className={`text-sm font-semibold ${
                  done ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {step.label}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {done && stepData.date ? stepData.date : step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
