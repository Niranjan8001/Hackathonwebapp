import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

export const OrderRejectionModal = ({ isOpen, onClose, onConfirm, orderId, loading }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#0F172A]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 blur-[100px] rounded-full" />
          
          <div className="relative space-y-6">
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">Reject Order?</h3>
              <p className="text-white/40 text-sm leading-relaxed font-medium">
                Are you sure you want to reject order <span className="text-white font-bold">#{orderId}</span>? This action cannot be undone and the customer will be notified immediately.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={onConfirm}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Confirm Rejection</span>
              </button>
              
              <button
                onClick={onClose}
                disabled={loading}
                className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm rounded-2xl transition-all"
              >
                Go Back
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
