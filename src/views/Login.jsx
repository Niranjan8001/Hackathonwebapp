import React from 'react';
import { ModernAuthCard } from '../components/auth/ModernAuthCard';
import { motion } from 'framer-motion';

export const Login = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans selection:bg-green-500/30">
      
      {/* 🎬 CINEMATIC VIDEO BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="/farm-bg.webm" type="video/webm" />
          <source src="/farm-bg.mp4" type="video/mp4" />
          {/* Fallback image if video fails or is loading */}
          <img 
            src="/farm-poster.jpg" 
            alt="Farm background" 
            className="w-full h-full object-cover"
          />
        </video>
      </div>

      {/* 🌫️ OVERLAY - Enhanced Gradient for Text Balance */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />

      {/* 🔥 CONTENT LAYER - Split Hero Layout */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-2 h-full">
        
        {/* LEFT SIDE — TEXT (Staggered Animation) */}
        <div className="hidden lg:flex flex-col justify-center px-10 lg:px-24 text-white order-2 lg:order-1 pb-12 lg:pb-0">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.3
                }
              }
            }}
          >
            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl lg:text-7xl font-bold leading-tight"
            >
              The Future of <br />
              <span className="text-green-400">Agriculture</span> is Here.
            </motion.h1>

            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mt-8 text-lg lg:text-xl text-gray-300 max-w-xl leading-relaxed"
            >
              Connect directly with buyers, manage your farm digitally, 
              and grow your income with FarmDirect.
            </motion.p>
            
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.8 }}
              className="mt-12 flex items-center gap-6"
            >
              <div className="flex flex-col">
                <span className="text-green-400 font-bold text-2xl">50k+</span>
                <span className="text-white/40 text-xs uppercase tracking-widest">Active Farmers</span>
              </div>
              <div className="h-10 w-[1px] bg-white/10" />
              <div className="flex flex-col">
                <span className="text-green-400 font-bold text-2xl">100%</span>
                <span className="text-white/40 text-xs uppercase tracking-widest">Secure Payments</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT SIDE — AUTH CARD */}
        <div className="flex items-center justify-center px-6 order-1 lg:order-2 pt-12 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="w-full flex justify-center"
          >
            <ModernAuthCard />
          </motion.div>
        </div>

      </div>
    </div>
  );
};

