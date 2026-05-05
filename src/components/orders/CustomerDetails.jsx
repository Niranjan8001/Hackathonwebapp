import React from 'react';
import { Phone, Mail, MapPin, Star } from 'lucide-react';

export const CustomerDetails = ({ customer }) => {
  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl p-5 sm:p-6">
      <h2 className="text-base font-bold text-slate-800 dark:text-[#F8FAFC] mb-5">
        Customer Details
      </h2>

      {/* Profile Row */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-14 h-14 rounded-full border-2 border-green-200 dark:border-green-500/30 overflow-hidden flex-shrink-0 shadow-sm">
          <img
            src={customer.image}
            alt={customer.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-slate-800 dark:text-[#F8FAFC]">
              {customer.name}
            </h3>
            {customer.isRepeat && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                <Star className="w-3 h-3" />
                Repeat
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 dark:text-[#94A3B8]">
            <Phone className="w-3 h-3 text-green-600 dark:text-green-400" />
            <span>{customer.phone}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-[#94A3B8]">
            <Mail className="w-3 h-3 text-green-600 dark:text-green-400" />
            <span className="truncate">{customer.email}</span>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-slate-50 dark:bg-[#0F172A]/50 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-[#94A3B8] mb-1">
              Delivery Address
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {customer.address}
            </p>
          </div>
        </div>
      </div>

      {/* Call Customer Button */}
      <button className="w-full flex items-center justify-center gap-2 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm border border-green-200 dark:border-green-500/20">
        <Phone className="w-4 h-4" />
        Call Customer
      </button>
    </div>
  );
};
