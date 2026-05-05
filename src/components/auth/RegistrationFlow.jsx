import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck,
  Globe,
  Settings
} from 'lucide-react';

import { useFarmerContext } from '../../context/FarmerContext';
import { useNavigate } from 'react-router-dom';

export const RegistrationFlow = () => {
  const navigate = useNavigate();
  const { register } = useFarmerContext();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    otp: '',
    farmName: '',
    location: '',
    scale: 'Small Scale',
    crops: [],
    organic: false,
    password: '',
    confirmPassword: ''
  });

  const steps = [
    { id: 1, label: 'Identify' },
    { id: 2, label: 'Verify' },
    { id: 3, label: 'Location' },
    { id: 4, label: 'Products' },
    { id: 5, label: 'Secure' }
  ];

  const isStepValid = () => {
    switch(step) {
      case 1: 
        return formData.name.trim() !== '' && 
               formData.phone.length === 10;
      case 2:
        return formData.otp.length === 4;
      case 3: 
        return formData.farmName.trim() !== '' && 
               formData.location.trim() !== '' && 
               formData.scale !== '';
      case 4: 
        return formData.crops.length > 0;
      case 5: 
        return formData.password.length >= 6 && 
               formData.confirmPassword === formData.password;
      default: return true;
    }
  };

  const handleNext = () => {
    if (isStepValid()) {
      setStep(s => Math.min(s + 1, 5));
    }
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleComplete = async () => {
    if (!isStepValid()) return;
    setLoading(true);
    const success = await register(formData);
    if (success) {
      navigate('/complete-profile');
    } else {
      setLoading(false);
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
        {/* Background Track */}
        <div className="absolute top-[18px] left-0 w-full h-[2px] bg-white/5 rounded-full" />
        
        {/* Active Progress Bar */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          className="absolute top-[18px] left-0 h-[2px] bg-gradient-to-r from-green-600 to-green-400 rounded-full z-10 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />

        {/* Steps Container */}
        <div className="relative flex justify-between z-20">
          {steps.map((s) => {
            const isActive = step === s.id;
            const isCompleted = step > s.id;
            
            return (
              <div key={s.id} className="flex flex-col items-center group">
                {/* Step Dot */}
                <motion.div 
                  animate={{ 
                    scale: isActive ? 1.2 : 1,
                    backgroundColor: isCompleted || isActive ? '#22c55e' : 'rgba(255,255,255,0.1)'
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${
                    isActive || isCompleted 
                    ? 'border-green-500/20 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]' 
                    : 'border-transparent bg-white/10'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <span className={`text-xs font-black ${isActive ? 'text-white' : 'text-white/20'}`}>
                      {s.id}
                    </span>
                  )}
                </motion.div>

                {/* Step Label */}
                <motion.span 
                  animate={{ 
                    opacity: isActive ? 1 : 0.4,
                    y: isActive ? 1 : 0
                  }}
                  className={`mt-1.5 text-[8px] lg:text-[10px] font-black uppercase tracking-wider lg:tracking-[0.2em] transition-all ${
                    isActive ? 'text-green-400 block' : 'text-white hidden lg:block'
                  }`}
                >
                  {s.label}
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="min-h-[160px] lg:min-h-[220px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-end mb-2">
                <h3 className="text-white font-bold text-xl">Identity</h3>
                <span className="text-white/20 text-[9px] uppercase font-bold tracking-widest">All fields mandatory</span>
              </div>
              <AuthInput 
                icon={<User />} 
                placeholder="Full Name *" 
                value={formData.name}
                onChange={(v) => handleChange('name', v)}
              />
              <AuthInput 
                icon={<ShieldCheck />} 
                placeholder="Mobile Number (10 digits) *" 
                type="tel" 
                maxLength={10}
                value={formData.phone}
                onChange={(v) => handleChange('phone', v.replace(/\D/g, ''))}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-end mb-2">
                <div className="space-y-1">
                  <h3 className="text-white font-bold text-xl">Verification</h3>
                  <p className="text-white/40 text-[10px] font-medium leading-relaxed">
                    Enter the 4-digit code sent to <span className="text-green-400">+91 {formData.phone}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center gap-4 py-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-14 h-16 bg-white/[0.08] border border-white/10 rounded-2xl flex items-center justify-center">
                    <input
                      type="text"
                      maxLength={1}
                      value={formData.otp[i] || ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val) {
                          const newOtp = formData.otp.split('');
                          newOtp[i] = val;
                          handleChange('otp', newOtp.join('').slice(0, 4));
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !formData.otp[i] && i > 0) {
                          handleChange('otp', formData.otp.slice(0, -1));
                        }
                      }}
                      className="w-full h-full bg-transparent text-center text-2xl font-black text-green-400 focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-green-400 transition-colors">
                  Resend OTP in 0:29
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-end mb-2">
                <h3 className="text-white font-bold text-xl">Region</h3>
                <span className="text-white/20 text-[9px] uppercase font-bold tracking-widest">All fields mandatory</span>
              </div>
              <AuthInput 
                icon={<Globe />} 
                placeholder="Farm Name *" 
                value={formData.farmName}
                onChange={(v) => handleChange('farmName', v)}
              />
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-green-400 transition-colors" />
                <input 
                  placeholder="Farm Location / City *" 
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/[0.08] border border-white/10 rounded-2xl text-white focus:outline-none focus:border-green-500/50 transition-all backdrop-blur-md"
                />
              </div>
              <select 
                value={formData.scale}
                onChange={(e) => handleChange('scale', e.target.value)}
                className="w-full pl-4 pr-4 py-4 bg-white/[0.08] border border-white/10 rounded-2xl text-white focus:outline-none focus:border-green-500/50 backdrop-blur-md appearance-none font-medium"
              >
                <option value="Small Scale" className="bg-[#1E293B]">Small Scale</option>
                <option value="Medium Scale" className="bg-[#1E293B]">Medium Scale</option>
                <option value="Enterprise" className="bg-[#1E293B]">Enterprise</option>
              </select>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-end mb-2">
                <h3 className="text-white font-bold text-xl">Cultivation</h3>
                <span className="text-white/20 text-[9px] uppercase font-bold tracking-widest">Select at least one crop</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['Wheat', 'Rice', 'Potatoes', 'Tomatoes'].map(crop => (
                  <button
                    key={crop}
                    onClick={() => toggleCrop(crop)}
                    className={`py-3 px-4 rounded-xl border transition-all flex items-center justify-between text-xs font-bold ${
                      formData.crops.includes(crop)
                      ? 'bg-white/20 border-white text-white'
                      : 'bg-white/5 border-white/10 text-white/40'
                    }`}
                  >
                    {crop}
                    {formData.crops.includes(crop) && <CheckCircle2 className="w-3 h-3" />}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Organic Certified</span>
                <button 
                  onClick={() => setFormData(f => ({ ...f, organic: !f.organic }))}
                  className={`w-10 h-5 rounded-full transition-all duration-300 relative ${formData.organic ? 'bg-white' : 'bg-white/10'}`}
                >
                  <motion.div 
                    animate={{ x: formData.organic ? 22 : 4 }}
                    className={`absolute top-1 w-3 h-3 rounded-full ${formData.organic ? 'bg-black' : 'bg-white/40'}`}
                  />
                </button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-end mb-2">
                <h3 className="text-white font-bold text-xl">Security</h3>
                <span className="text-white/20 text-[9px] uppercase font-bold tracking-widest">Min. 6 characters</span>
              </div>
              <AuthInput 
                icon={<ShieldCheck />} 
                placeholder="Create Password *" 
                type="password" 
                value={formData.password}
                onChange={(v) => handleChange('password', v)}
              />
              <AuthInput 
                icon={<CheckCircle2 />} 
                placeholder="Confirm Password *" 
                type="password" 
                value={formData.confirmPassword}
                onChange={(v) => handleChange('confirmPassword', v)}
              />
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-400 text-[10px] font-bold text-center">Passwords do not match</p>
              )}
              <p className="text-white/20 text-[10px] text-center px-4 leading-relaxed">
                By clicking "Complete", you agree to our Terms of Service and Data Privacy Policy.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-3">
        {step > 1 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all"
          >
            <ChevronLeft />
          </motion.button>
        )}
        <motion.button
          whileHover={isStepValid() ? { y: -2, boxShadow: "0 0 30px rgba(34,197,94,0.6)" } : {}}
          whileTap={isStepValid() ? { scale: 0.98 } : {}}
          onClick={step === 5 ? handleComplete : handleNext}
          className={`flex-1 py-2.5 lg:py-3.5 rounded-xl lg:rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
            isStepValid() 
            ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]' 
            : 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
          }`}
          disabled={loading || !isStepValid()}
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span className="text-sm lg:text-base">{step === 5 ? 'Complete Registration' : 'Next Stage'}</span>
              <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
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
      className="w-full pl-12 lg:pl-12 pr-4 py-2.5 lg:py-3.5 bg-white/[0.08] border border-white/10 rounded-xl lg:rounded-2xl text-white text-sm lg:text-base placeholder-white/20 focus:outline-none focus:border-green-500/50 transition-all backdrop-blur-md font-medium"
    />
  </div>
);

