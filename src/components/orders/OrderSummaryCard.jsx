import React from 'react';
import { Calendar, CreditCard, IndianRupee, ShoppingBag, Package, Gift, Truck, CheckCircle2 } from 'lucide-react';

/* ── Payment Method Icon Map ────────────────────────────── */
const paymentIcons = {
  UPI: '📱',
  COD: '💵',
  Card: '💳',
};

/* ── Timeline Steps ─────────────────────────────────────── */
const timelineSteps = [
  { key: 'placed', label: 'Order Placed', icon: Calendar },
  { key: 'packed', label: 'Packed', icon: Gift },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

const getActiveIndex = (status) => {
  switch (status) {
    case 'Delivered': return 4;
    case 'Shipped': return 3;
    case 'Processing': return 2;
    case 'Confirmed': return 1;
    case 'Pending': return 1;
    case 'Cancelled': return -1;
    default: return 1;
  }
};

export const OrderSummaryCard = ({ order }) => {
  const activeIdx = getActiveIndex(order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl p-5 sm:p-6">
      <h2 className="text-base font-bold text-slate-800 dark:text-[#F8FAFC] mb-5">
        Order Summary
      </h2>

      {/* ── Summary Stats Row ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {/* Order Date */}
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-[18px] h-[18px] text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">Order Date</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">{order.date}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{order.time}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-[18px] h-[18px] text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">Payment Method</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC] flex items-center gap-1.5">
              <span>{paymentIcons[order.paymentMethod]}</span>
              {order.paymentMethod}
            </p>
          </div>
        </div>

        {/* Total Amount */}
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
            <IndianRupee className="w-[18px] h-[18px] text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">Total Amount</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              ₹{order.total}
            </p>
          </div>
        </div>

        {/* Items Count */}
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-[18px] h-[18px] text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">Items</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">
              {order.items.length} Product{order.items.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* ── Integrated Horizontal Timeline ─────────────────────── */}
      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-[#334155]">
        {/* Desktop: Horizontal */}
        <div className="hidden sm:block overflow-hidden px-2">
          <div className="relative">
            {/* ── Connecting Lines (behind the nodes) ────────────── */}
            <div className="absolute top-5 left-0 right-0 flex items-center z-0 px-[60px]">
              {[0, 1, 2].map((segIdx) => {
                const segDone = !isCancelled && order.timeline[timelineSteps[segIdx].key]?.done && order.timeline[timelineSteps[segIdx + 1].key]?.done;
                const segPartial = !isCancelled && order.timeline[timelineSteps[segIdx].key]?.done && !order.timeline[timelineSteps[segIdx + 1].key]?.done;
                return (
                  <div
                    key={segIdx}
                    className="timeline-connector flex-1 h-[2px] relative"
                    data-segment={segIdx}
                    data-done={segDone}
                  >
                    {/* Background track */}
                    <div className="absolute inset-0 bg-slate-200 dark:bg-[#334155] rounded-full" />
                    {/* Active fill */}
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${
                        isCancelled
                          ? 'bg-red-300 dark:bg-red-500/30'
                          : segDone
                          ? 'tl-active-fill'
                          : 'bg-green-500 dark:bg-green-400'
                      }`}
                      style={{ width: segDone ? '100%' : segPartial ? '50%' : '0%' }}
                    />
                    {/* Shimmer on in-progress segment */}
                    {segPartial && <div className="tl-shimmer-overlay" />}
                  </div>
                );
              })}
            </div>

            {/* ── Step Nodes ─────────────────────────────────────── */}
            <div className="relative z-10 grid grid-cols-4 gap-0">
              {timelineSteps.map((step, i) => {
                const stepData = order.timeline[step.key];
                const done = !isCancelled && stepData?.done;
                const nextStep = timelineSteps[i + 1];
                const isActive = done && nextStep && !order.timeline[nextStep.key]?.done;
                const StepIcon = step.icon;

                return (
                  <div
                    key={step.key}
                    className={`timeline-step flex flex-col items-center text-center${isActive ? ' is-active' : ''}`}
                    data-step={i}
                    data-done={done}
                  >
                    <div
                      className={`timeline-node w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                        isCancelled
                          ? 'bg-red-50 dark:bg-red-500/10 text-red-400 dark:text-red-400/50 border-red-200 dark:border-red-500/20'
                          : done
                          ? 'bg-green-50 dark:bg-green-500/15 text-green-600 dark:text-green-400 border-green-500 dark:border-green-400 shadow-md shadow-green-500/10'
                          : 'bg-white dark:bg-[#0F172A] text-slate-400 dark:text-slate-500 border-slate-200 dark:border-[#334155]'
                      }`}
                    >
                      <StepIcon className="w-[18px] h-[18px]" />
                    </div>
                    <p className={`timeline-label text-[11px] font-semibold mt-2.5 whitespace-nowrap ${
                      done ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {step.label}
                    </p>
                    <p className="timeline-date text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 whitespace-nowrap leading-tight">
                      {done && stepData.date ? stepData.date : '—'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical */}
        <div className="sm:hidden space-y-0">
          {timelineSteps.map((step, i) => {
            const stepData = order.timeline[step.key];
            const done = !isCancelled && stepData?.done;
            const nextStep = timelineSteps[i + 1];
            const isActive = done && nextStep && !order.timeline[nextStep.key]?.done;
            const isLast = i === timelineSteps.length - 1;
            const StepIcon = step.icon;

            return (
              <div key={step.key} className={`timeline-step flex gap-3${isActive ? ' is-active' : ''}`} data-step={i} data-done={done}>
                <div className="flex flex-col items-center">
                  <div
                    className={`timeline-node w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-500 ${
                      isCancelled
                        ? 'bg-red-50 dark:bg-red-500/10 text-red-400 dark:text-red-400/50 border-red-200 dark:border-red-500/20'
                        : done
                        ? 'bg-green-50 dark:bg-green-500/15 text-green-600 dark:text-green-400 border-green-500 dark:border-green-400 shadow-sm shadow-green-500/10'
                        : 'bg-white dark:bg-[#0F172A] text-slate-400 dark:text-slate-500 border-slate-200 dark:border-[#334155]'
                    }`}
                  >
                    <StepIcon className="w-4 h-4" />
                  </div>
                  {!isLast && (
                    <div className={`timeline-connector w-0.5 flex-1 min-h-[24px] transition-all duration-700 ${
                      isCancelled
                        ? 'bg-red-200 dark:bg-red-500/20'
                        : done
                        ? 'bg-green-400 dark:bg-green-500/40'
                        : 'bg-slate-200 dark:bg-[#334155]'
                    }`} data-segment={i} data-done={done} />
                  )}
                </div>
                <div className={`pb-5 ${isLast ? 'pb-0' : ''}`}>
                  <p className={`timeline-label text-sm font-semibold ${
                    done ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {step.label}
                  </p>
                  <p className="timeline-date text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {done && stepData.date ? stepData.date : '—'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
