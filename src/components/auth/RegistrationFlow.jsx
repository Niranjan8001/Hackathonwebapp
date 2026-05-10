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
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    farmName: '',
    locationText: '',
    scale: 'Small Scale',
    crops: [],

  });

  const steps = [
    { id: 1, label: 'Identity' },
    { id: 2, label: 'Farm Details' },
    { id: 3, label: 'Cultivation' }
  ];

  const isStepValid = () => {
    switch(step) {
      case 1: 
        return formData.name.trim() !== '' && 
               formData.email.includes('@') &&
               formData.password.length >= 6;
      case 2: 
        return formData.farmName.trim() !== '' && 
               formData.locationText.trim() !== '';
      case 3: 
        return formData.crops.length > 0;
      default: return true;
    }
  };

  const handleNext = () => {
    if (isStepValid()) {
      setStep(s => Math.min(s + 1, 3));
    }
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleComplete = async () => {
    if (!isStepValid()) return;
    const success = await register(formData);
    if (success) {
      navigate('/dashboard');
    }
  };

  const toggleCrop = (crop) => {
    setFormData(prev => ({
      ...prev,
      crops: prev.crops.includes(crop) 
        ? prev.crops.filter(c => c !== crop) 
        : [...prev.crops, crop]
    }));
  };

  return (
    <div className="space-y-3 lg:space-y-4">
      {/* 🚀 MODERN PROGRESS TIMELINE */}
      <div className="relative mb-4 lg:mb-6 px-2">
        <div className="absolute top-[18px] left-0 w-full h-[2px] bg-white/5 rounded-full" />
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          className="absolute top-[18px] left-0 h-[2px] bg-gradient-to-r from-green-600 to-green-400 rounded-full z-10 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
        />
        <div className="relative flex justify-between z-20">
          {steps.map((s) => {
            const isActive = step === s.id;
            const isCompleted = step > s.id;
            return (
              <div key={s.id} className="flex flex-col items-center">
                <motion.div 
                  animate={{ 
                    scale: isActive ? 1.2 : 1,
                    backgroundColor: isCompleted || isActive ? '#22c55e' : 'rgba(255,255,255,0.1)'
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-4 ${
                    isActive || isCompleted 
                    ? 'border-green-500/20 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]' 
                    : 'border-transparent bg-white/10'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5 text-white" /> : <span className="text-xs font-black text-white">{s.id}</span>}
                </motion.div>
                <span className={`mt-1.5 text-[8px] lg:text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-green-400' : 'text-white/20'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="min-h-[160px] lg:min-h-[220px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <AuthInput icon={<User />} placeholder="Full Name *" value={formData.name} onChange={(v) => handleChange('name', v)} />
              <AuthInput icon={<Mail />} placeholder="Email Address *" type="email" value={formData.email} onChange={(v) => handleChange('email', v)} />
              <AuthInput icon={<ShieldCheck />} placeholder="Create Password (min. 6) *" type="password" value={formData.password} onChange={(v) => handleChange('password', v)} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <AuthInput icon={<Globe />} placeholder="Farm Name *" value={formData.farmName} onChange={(v) => handleChange('farmName', v)} />
              <AuthInput 
                icon={<MapPin />} 
                placeholder="Farm Pincode *" 
                value={formData.locationText} 
                onChange={(v) => {
                  // Only allow digits
                  if (/^\d*$/.test(v)) {
                    handleChange('locationText', v);
                  }
                }} 
              />
              <select value={formData.scale} onChange={(e) => handleChange('scale', e.target.value)} className="w-full pl-4 pr-4 py-4 bg-white/[0.08] border border-white/10 rounded-2xl text-white focus:outline-none focus:border-green-500/50 backdrop-blur-md appearance-none font-medium">
                <option value="Small Scale" className="bg-[#1E293B]">Small Scale</option>
                <option value="Medium Scale" className="bg-[#1E293B]">Medium Scale</option>
                <option value="Enterprise" className="bg-[#1E293B]">Enterprise</option>
              </select>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {['Commercial crops', 'Vegetables', 'Fruits', 'Grains and Pulses'].map(crop => (
                  <button key={crop} onClick={() => toggleCrop(crop)} className={`py-3 px-4 rounded-xl border transition-all flex items-center justify-between text-xs font-bold ${formData.crops.includes(crop) ? 'bg-white/20 border-white text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>
                    {crop}
                    {formData.crops.includes(crop) && <CheckCircle2 className="w-3 h-3" />}
                  </button>
                ))}
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && <div className="text-red-400 text-[10px] font-bold text-center">{error.message}</div>}

      <div className="flex gap-3">
        {step > 1 && (
          <motion.button whileTap={{ scale: 0.95 }} onClick={handleBack} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all">
            <ChevronLeft />
          </motion.button>
        )}
        <motion.button
          whileHover={isStepValid() ? { y: -2, boxShadow: "0 0 30px rgba(34,197,94,0.6)" } : {}}
          whileTap={isStepValid() ? { scale: 0.98 } : {}}
          onClick={step === 3 ? handleComplete : handleNext}
          className={`flex-1 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${isStepValid() ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'}`}
          disabled={loading || !isStepValid()}
        >
          {loading ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <><span className="text-sm lg:text-base">{step === 3 ? 'Complete Registration' : 'Next Stage'}</span><ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" /></>}
        </motion.button>
      </div>
    </div>
  );
};

const AuthInput = ({ icon, placeholder, type = "text", value, onChange }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-green-400 transition-colors">
      {icon}
    </div>
    <input 
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-12 pr-4 py-3 lg:py-4 bg-white/[0.08] border border-white/10 rounded-xl lg:rounded-2xl text-white text-sm lg:text-base placeholder-white/20 focus:outline-none focus:border-green-500/50 transition-all backdrop-blur-md font-medium"
      required
    />
  </div>
);

