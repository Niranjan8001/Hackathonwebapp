import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useFarmerContext } from '../../context/FarmerContext';
import { useNavigate } from 'react-router-dom';

export const LoginFlow = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, loading, error } = useFarmerContext();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 lg:space-y-5">
      <div className="space-y-2">
        <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest ml-1">Email Address</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-4 w-4 lg:h-5 lg:w-5 text-white/20 group-focus-within:text-green-400 transition-colors" />
          </div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 lg:py-4 bg-white/[0.08] border border-white/10 rounded-xl lg:rounded-2xl text-white text-sm lg:text-base placeholder-white/20 focus:outline-none focus:border-green-500/50 transition-all backdrop-blur-md"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest ml-1">Password</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 lg:h-5 lg:w-5 text-white/20 group-focus-within:text-green-400 transition-colors" />
          </div>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 lg:py-4 bg-white/[0.08] border border-white/10 rounded-xl lg:rounded-2xl text-white text-sm lg:text-base placeholder-white/20 focus:outline-none focus:border-green-500/50 transition-all backdrop-blur-md"
            required
          />
        </div>
      </div>

      {error && (
        <div className="text-red-400 text-[10px] font-bold text-center animate-pulse">
          {error.message}
        </div>
      )}

      <motion.button
        whileHover={{ y: -2, boxShadow: "0 0 30px rgba(34,197,94,0.6)" }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold flex items-center justify-center gap-2 group transition-all bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]`}
        disabled={loading}
      >
        {loading ? (
          <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
        ) : (
          <>
            <span className="text-sm lg:text-base">Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </motion.button>
    </form>
  );
};


