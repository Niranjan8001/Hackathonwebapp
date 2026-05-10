import React, { useState } from 'react';
import { Landmark, Loader2, CheckCircle2, History, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFarmerContext } from '../../context/FarmerContext';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
);

export const WithdrawNowCard = () => {
  const { realEarnings, earningsLoading } = useFarmerContext();
  const [withdrawState, setWithdrawState] = useState('idle'); // idle, processing, success
  const [timestamp, setTimestamp] = useState(null);
  
  const availableBalance = realEarnings?.total || 0;
  const canWithdraw = availableBalance >= 500;

  const handleWithdraw = async () => {
    if (!canWithdraw || withdrawState !== 'idle') return;
    
    setWithdrawState('processing');
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setTimestamp(new Date().toLocaleString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    }));
    setWithdrawState('success');
  };

  if (earningsLoading) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 min-h-[300px]">
        <Skeleton className="w-40 h-8 mb-8" />
        <Skeleton className="w-full h-20 mb-8" />
        <Skeleton className="w-full h-14 rounded-2xl" />
      </div>
    );
  }

  return (
    <motion.div 
      layout
      className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group min-h-[320px] flex flex-col"
    >
      <AnimatePresence mode="wait">
        {withdrawState === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center text-center py-4"
          >
            <div className="relative mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)]"
              >
                <CheckCircle2 className="w-10 h-10 text-black stroke-[3]" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 1, 0], scale: [1, 2, 2.5] }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="absolute inset-0 bg-green-500 rounded-full blur-xl"
              />
            </div>

            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Request Sent Successfully</h3>
            <p className="text-sm text-white/40 font-medium mb-8">Your withdrawal request is being reviewed.</p>
            
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between px-6 py-4 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Timestamp</span>
                <span className="text-xs font-bold text-white/60">{timestamp}</span>
              </div>
              
              <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/60 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all">
                <History className="w-4 h-4" />
                <span>View Withdrawal History</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex-1 flex flex-col"
          >
            <h3 className="text-xl font-bold text-white mb-8 tracking-tight">Withdraw Now</h3>
            
            <div className="space-y-2 mb-10">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Available Balance</p>
              <motion.p 
                layoutId="balance"
                className="text-4xl font-black text-white tracking-tighter"
              >
                ₹{availableBalance.toLocaleString()}
              </motion.p>
              <p className="text-[10px] text-white/40 font-bold tracking-wide italic">Min. withdrawal amount is ₹500</p>
            </div>

            <motion.button
              whileHover={canWithdraw && withdrawState === 'idle' ? { y: -4, scale: 1.02 } : {}}
              whileTap={canWithdraw && withdrawState === 'idle' ? { scale: 0.98 } : {}}
              onClick={handleWithdraw}
              disabled={!canWithdraw || withdrawState !== 'idle'}
              className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 transition-all relative overflow-hidden shadow-2xl ${
                canWithdraw 
                ? 'bg-green-500 text-black shadow-[0_20px_40px_rgba(34,197,94,0.3)]' 
                : 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
              }`}
            >
              {withdrawState === 'processing' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Withdrawal...</span>
                </>
              ) : (
                <>
                  <Landmark className={`w-5 h-5 ${canWithdraw ? 'animate-bounce' : ''}`} />
                  <span>Withdraw Earnings</span>
                </>
              )}
              
              {/* Premium Sweep Effect */}
              {canWithdraw && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                />
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Background Icon */}
      <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700 rotate-12 group-hover:rotate-0 pointer-events-none">
        <Landmark className="w-48 h-48 text-green-500" />
      </div>
    </motion.div>
  );
};
