import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginFlow } from './LoginFlow';
import { RegistrationFlow } from './RegistrationFlow';
import { Leaf, UserPlus, LogIn } from 'lucide-react';

export const ModernAuthCard = () => {
  const [mode, setMode] = useState('login');
  
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-md z-20 group px-4 lg:px-0"
    >
      {/* Premium Green Glass Container */}
      <div className="relative z-10 backdrop-blur-xl bg-green-900/20 border border-green-400/20 rounded-3xl lg:rounded-[2.5rem] shadow-[0_25px_80px_rgba(0,0,0,0.6)] overflow-hidden p-5 lg:p-8 text-white">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-4 lg:mb-6">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="bg-green-500/20 p-3 lg:p-4 rounded-xl lg:rounded-2xl mb-3 lg:mb-4 border border-green-400/30"
          >
            <Leaf className="w-6 h-6 lg:w-8 lg:h-8 text-green-400" />
          </motion.div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">FarmDirect</h1>
          <p className="text-green-400/60 text-[10px] lg:text-sm mt-1 font-medium uppercase tracking-widest lg:normal-case lg:tracking-normal">Sustainable Agriculture Portal</p>
        </div>

        {/* Clean Toggle Switch */}
        <div className="flex bg-white/5 p-1 rounded-xl lg:p-1.5 lg:rounded-2xl mb-4 lg:mb-5 border border-white/10">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 lg:py-3 px-4 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold transition-all duration-300 ${
              mode === 'login' 
              ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
              : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 lg:py-3 px-4 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold transition-all duration-300 ${
              mode === 'register' 
              ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
              : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            Join
          </button>
        </div>


        {/* Auth Forms */}
        <div className="relative z-20">
          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <LoginFlow />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <RegistrationFlow />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <div className="mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-white/5 flex items-center justify-center gap-3 text-white/20 text-[9px] lg:text-[10px] uppercase tracking-[0.2em] font-bold">
          <div className="w-1 h-1 rounded-full bg-green-500/50" />
          <span>Secure Connection Verified</span>
          <div className="w-1 h-1 rounded-full bg-green-500/50" />
        </div>
      </div>
    </motion.div>
  );
};
