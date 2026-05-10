import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail,
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck,
  Globe
} from 'lucide-react';

import { useFarmerContext } from '../../context/FarmerContext';
import { useNavigate } from 'react-router-dom';

export const RegistrationFlow = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useFarmerContext();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const isFormValid = () => {
    return formData.name.trim() !== '' && 
           formData.email.includes('@') &&
           formData.password.length >= 6;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleComplete = async () => {
    if (!isFormValid()) return;
    const success = await register(formData);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* 🚀 SIMPLIFIED IDENTITY SECTION */}
      <div className="space-y-2 text-center">
        <h2 className="text-xl lg:text-2xl font-black text-white tracking-tight">Create Your Account</h2>
        <p className="text-[10px] lg:text-xs text-white/40 font-medium uppercase tracking-[0.2em]">Enter your personal details to get started</p>
      </div>

      <div className="space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <AuthInput icon={<User />} placeholder="Full Name *" value={formData.name} onChange={(v) => handleChange('name', v)} maxLength={50} />
          <AuthInput icon={<Mail />} placeholder="Email Address *" type="email" value={formData.email} onChange={(v) => handleChange('email', v)} maxLength={100} />
          <AuthInput icon={<ShieldCheck />} placeholder="Create Password (min. 6) *" type="password" value={formData.password} onChange={(v) => handleChange('password', v)} maxLength={32} />
        </motion.div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-xs font-bold flex items-center gap-3"
        >
          <CheckCircle2 className="w-4 h-4 text-red-400" />
          {error.message}
        </motion.div>
      )}

      <div className="pt-2">
        <motion.button
          whileHover={isFormValid() ? { y: -2, boxShadow: "0 0 30px rgba(34,197,94,0.6)" } : {}}
          whileTap={isFormValid() ? { scale: 0.98 } : {}}
          onClick={handleComplete}
          className={`w-full py-4 lg:py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isFormValid() ? 'bg-green-500 text-black shadow-[0_20px_40px_rgba(34,197,94,0.3)]' : 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'}`}
          disabled={loading || !isFormValid()}
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <span className="text-sm lg:text-base">Complete Registration</span>
              <CheckCircle2 className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

const AuthInput = ({ icon, placeholder, type = "text", value, onChange, maxLength }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-green-400 transition-colors">
      {icon}
    </div>
    <input 
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={maxLength}
      className="w-full pl-12 pr-4 py-3 lg:py-4 bg-white/[0.08] border border-white/10 rounded-xl lg:rounded-2xl text-white text-sm lg:text-base placeholder-white/20 focus:outline-none focus:border-green-500/50 transition-all backdrop-blur-md font-medium"
      required
    />
  </div>
);

