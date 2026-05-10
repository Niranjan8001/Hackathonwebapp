import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFarmerContext } from '../../context/FarmerContext';

export const DateRangePicker = () => {
  const { dateRange, setDateRange } = useFarmerContext();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const presets = [
    { label: 'Today', getValue: () => ({ startDate: new Date(), endDate: new Date(), label: 'Today' }) },
    { label: 'Yesterday', getValue: () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return { startDate: d, endDate: d, label: 'Yesterday' };
    }},
    { label: 'Last 7 Days', getValue: () => {
      const start = new Date();
      start.setDate(start.getDate() - 7);
      return { startDate: start, endDate: new Date(), label: 'Last 7 Days' };
    }},
    { label: 'This Month', getValue: () => ({
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(),
      label: 'This Month'
    })},
    { label: 'Last Month', getValue: () => {
      const start = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
      const end = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
      return { startDate: start, endDate: end, label: 'Last Month' };
    }},
    { label: 'All Time', getValue: () => ({
      startDate: new Date(2020, 0, 1),
      endDate: new Date(),
      label: 'All Time'
    })},
  ];

  const handlePresetClick = (preset) => {
    setDateRange(preset.getValue());
    setIsOpen(false);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="relative z-50" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl text-xs font-bold hover:bg-white/10 transition-all text-white/60 group whitespace-nowrap"
      >
        <CalendarIcon className="w-4 h-4 text-white/20 group-hover:text-green-400 transition-colors" />
        <span className="hidden sm:inline">{dateRange.label}: {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}</span>
        <span className="sm:hidden">{dateRange.label}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile/tablet to emphasize it's a dialog */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-[280px] sm:w-72 bg-[#020617]/98 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 z-[1000] overflow-hidden origin-top-right"
            >
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-3 px-2">Select Range</p>
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePresetClick(preset)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                      dateRange.label === preset.label 
                      ? 'bg-green-500 text-black shadow-[0_10px_20px_rgba(34,197,94,0.2)]' 
                      : 'text-white/40 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {preset.label}
                    {dateRange.label === preset.label && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/5">
                 <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 rounded-2xl transition-all border border-white/5">
                   Custom Date Range
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
