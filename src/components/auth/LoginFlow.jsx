import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useFarmerContext } from '../../context/FarmerContext';
import { useNavigate } from 'react-router-dom';

export const LoginFlow = () => {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  
  const { login } = useFarmerContext();
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length === 10) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(2);
      }, 1200);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    const success = await login('phone', { phone, otp: otp.join('') });
    if (success) {
      navigate('/dashboard');
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 lg:space-y-5">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form 
            key="phone-step"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSendOtp}
            className="space-y-4 lg:space-y-5"
          >
            <div className="space-y-2">
              <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 lg:h-5 lg:w-5 text-white/20 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="block w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-4 bg-white/[0.08] border border-white/10 rounded-xl lg:rounded-2xl text-white text-sm lg:text-base placeholder-white/20 focus:outline-none focus:border-green-500/50 transition-all backdrop-blur-md"
                  maxLength={10}
                />
              </div>
            </div>

            <motion.button
              whileHover={phone.length === 10 ? { y: -2, boxShadow: "0 0 30px rgba(34,197,94,0.6)" } : {}}
              whileTap={phone.length === 10 ? { scale: 0.98 } : {}}
              className={`w-full py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold flex items-center justify-center gap-2 group transition-all ${
                phone.length === 10 
                ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]' 
                : 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
              }`}
              disabled={loading || phone.length !== 10}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-sm lg:text-base">Secure Sign In</span>
                  <ArrowRight className={`w-4 h-4 lg:w-5 lg:h-5 transition-transform ${phone.length === 10 ? 'group-hover:translate-x-1' : ''}`} />
                </>
              )}
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            key="otp-step"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 lg:space-y-6"
          >
            <div className="text-center space-y-1 lg:space-y-2">
              <h3 className="text-white font-bold text-sm lg:text-base">Verification</h3>
              <p className="text-white/40 text-[10px] lg:text-xs">Code sent to +91 {phone}</p>
            </div>

            <div className="flex justify-center gap-2 lg:gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-10 h-12 lg:w-14 lg:h-16 text-center text-xl lg:text-2xl font-bold bg-white/[0.08] border border-white/10 rounded-xl lg:rounded-2xl text-white focus:outline-none focus:border-green-500/50 transition-all"
                />
              ))}
            </div>

            <motion.button
              whileHover={otp.every(d => d !== '') ? { y: -2, boxShadow: "0 0 30px rgba(34,197,94,0.6)" } : {}}
              whileTap={otp.every(d => d !== '') ? { scale: 0.98 } : {}}
              onClick={handleVerify}
              className={`w-full py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold transition-all text-sm lg:text-base ${
                otp.every(d => d !== '')
                ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                : 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
              }`}
              disabled={loading || !otp.every(d => d !== '')}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </motion.button>

            <button 
              onClick={() => setStep(1)}
              className="w-full text-white/30 text-[9px] lg:text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors"
            >
              Back to entry
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


