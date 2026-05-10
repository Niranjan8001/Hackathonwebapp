import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Lock, 
  Smartphone, 
  SmartphoneNfc, 
  Globe, 
  Activity, 
  Trash2, 
  Mail, 
  MessageSquare, 
  Monitor,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  LogOut,
  Save,
  ShieldCheck,
  Smartphone as PhoneIcon,
  Fingerprint
} from 'lucide-react';
import { useFarmerContext } from '../context/FarmerContext';
import { useNavigate } from 'react-router-dom';
import { GlassLayout } from '../components/layout/GlassLayout';
import { apiService } from '../services/apiService';

// --- UI Components ---

const SettingsSection = ({ icon: Icon, title, subtitle, children, isDestructive = false }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`bg-white/[0.02] backdrop-blur-3xl border ${isDestructive ? 'border-red-500/20' : 'border-white/10'} rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl transition-all hover:bg-white/[0.03]`}
  >
    <div className={`p-8 lg:p-10 border-b ${isDestructive ? 'border-red-500/10 bg-red-500/5' : 'border-white/5 bg-white/[0.02]'} flex items-center justify-between`}>
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg ${isDestructive ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
          <Icon className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white tracking-tight">{title}</h3>
          <p className="text-[11px] text-white/30 font-bold uppercase tracking-[0.2em] mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
    <div className="p-8 lg:p-10">
      {children}
    </div>
  </motion.div>
);

const PremiumInput = ({ label, icon: Icon, type = "text", value, onChange, placeholder, rightElement, error, strength, maxLength }) => (
  <div className="space-y-2 group">
    <div className="flex items-center justify-between">
      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">{label}</label>
      {strength !== undefined && (
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((step) => (
            <div 
              key={step} 
              className={`h-1 w-6 rounded-full transition-all duration-500 ${strength >= step ? (strength <= 2 ? 'bg-red-500' : strength === 3 ? 'bg-amber-500' : 'bg-green-500') : 'bg-white/10'}`} 
            />
          ))}
        </div>
      )}
    </div>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
        {Icon && <Icon className="w-4 h-4 text-white/20 group-focus-within:text-green-400 transition-colors" />}
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl py-4 pl-14 pr-12 text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/50 transition-all placeholder:text-white/10`}
      />
      {rightElement && (
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
    {error && <p className="text-[10px] text-red-400 font-bold ml-1 flex items-center gap-1.5"><AlertCircle className="w-3 h-3" /> {error}</p>}
  </div>
);

const PremiumToggle = ({ label, description, enabled, onChange, icon: Icon }) => (
  <div className="flex items-center justify-between py-6 first:pt-0 last:pb-0 border-b border-white/5 last:border-0 group">
    <div className="flex items-center gap-5">
      {Icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500 ${enabled ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-white/5 border-white/5 text-white/20'}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="space-y-0.5">
        <h4 className={`text-sm font-black tracking-tight transition-colors ${enabled ? 'text-white' : 'text-white/60'}`}>{label}</h4>
        <p className="text-xs text-white/20 font-medium">{description}</p>
      </div>
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-14 h-8 rounded-full transition-all duration-500 focus:outline-none ${enabled ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-white/10'}`}
    >
      <motion.div
        animate={{ x: enabled ? 26 : 4 }}
        className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-xl flex items-center justify-center"
      >
        {enabled && <div className="w-1 h-3 bg-green-500 rounded-full" />}
      </motion.div>
    </button>
  </div>
);

const SessionItem = ({ device, location, time, isCurrent }) => (
  <div className="flex items-center justify-between py-5 border-b border-white/5 last:border-0 group">
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 group-hover:scale-110 transition-transform">
        {device.toLowerCase().includes('iphone') || device.toLowerCase().includes('android') ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
      </div>
      <div className="space-y-0.5">
        <div className="flex items-center gap-3">
          <h4 className="text-sm font-black text-white">{device}</h4>
          {isCurrent && (
            <span className="px-2 py-0.5 rounded-md bg-green-500/20 text-green-400 text-[8px] font-black uppercase tracking-widest border border-green-500/20">Current</span>
          )}
        </div>
        <p className="text-xs text-white/20 font-medium">{location} • {time}</p>
      </div>
    </div>
    {!isCurrent && (
      <button className="p-2.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl text-red-400 text-[10px] font-black uppercase tracking-widest transition-all">
        Revoke
      </button>
    )}
  </div>
);

export const SettingsView = () => {
  const { currentUser, logout, updateProfile } = useFarmerContext();
  const navigate = useNavigate();

  // State for Password Change
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [passStrength, setPassStrength] = useState(0);

  // State for Email Change
  const [emailData, setEmailData] = useState({ current: currentUser?.email || '', new: '', otp: '' });
  const [showOtp, setShowOtp] = useState(false);

  // State for Toggles
  const [settings, setSettings] = useState({
    twoFactor: false,
    emailNotif: true,
    smsNotif: true,
    pushNotif: false,
    profileVisibility: true,
    dataSharing: true
  });

  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length > 6) score++;
    if (pass.length > 10) score++;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
    if (/[!@#$%^&*]/.test(pass)) score++;
    setPassStrength(score);
  };

  const handleUpdatePassword = async () => {
    // API logic here
    console.log("Updating password...");
  };

  const handleRequestOtp = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(emailData.new)) {
      setShowOtp(true);
    }
  };

  return (
    <GlassLayout>
      <div className="max-w-[1200px] mx-auto pb-20 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-green-500">
              <div className="w-1.5 h-6 bg-green-500 rounded-full" />
              <p className="text-[11px] font-black uppercase tracking-[0.5em]">Configuration</p>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter">Settings</h1>
            <p className="text-sm text-white/40 font-medium max-w-md">
              Manage your account preferences, security settings, and notification choices to personalize your FarmDirect experience.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest text-white/60">
              Discard Changes
            </button>
            <button className="flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-400 text-black rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest shadow-[0_20px_50px_rgba(34,197,94,0.2)] active:scale-95">
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-0">
          
          {/* 1. ACCOUNT SETTINGS */}
          <SettingsSection icon={User} title="Account Settings" subtitle="Personal Identification & Access">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* Email Change */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-4 bg-green-500/40 rounded-full" />
                  <h4 className="text-xs font-black text-white/60 uppercase tracking-widest">Email Verification</h4>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Current Email</p>
                        <p className="text-sm font-black text-white">{currentUser?.email || 'farmer@example.com'}</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg text-[9px] font-black text-green-400 uppercase tracking-widest">Verified</div>
                  </div>

                  <PremiumInput 
                    label="New Email Address" 
                    icon={Mail} 
                    placeholder="Enter your new email"
                    value={emailData.new}
                    onChange={(e) => setEmailData({...emailData, new: e.target.value})}
                    rightElement={
                      <button 
                        onClick={handleRequestOtp}
                        className="text-[10px] font-black text-green-400 uppercase tracking-widest px-4 py-2 hover:bg-green-400/10 rounded-xl transition-all"
                      >
                        Send OTP
                      </button>
                    }
                  />

                  <AnimatePresence>
                    {showOtp && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <PremiumInput 
                          label="Verification Code (OTP)" 
                          icon={Lock} 
                          placeholder="Enter 6-digit code"
                          value={emailData.otp}
                          maxLength={6}
                          onChange={(e) => setEmailData({...emailData, otp: e.target.value})}
                          rightElement={
                            <div className="flex items-center gap-3 pr-2">
                              <span className="text-[10px] font-bold text-white/20">01:59</span>
                              <button className="text-[9px] font-black text-white/40 uppercase hover:text-white transition-colors">Resend</button>
                            </div>
                          }
                        />
                        <button className="w-full mt-4 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white transition-all">
                          Verify & Update Email
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Password Change */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-4 bg-green-500/40 rounded-full" />
                  <h4 className="text-xs font-black text-white/60 uppercase tracking-widest">Security Credentials</h4>
                </div>

                <div className="space-y-5">
                  <PremiumInput 
                    label="Current Password" 
                    type={showPass.current ? "text" : "password"}
                    icon={ShieldCheck} 
                    placeholder="••••••••"
                    value={passwords.current}
                    maxLength={32}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                    rightElement={
                      <button onClick={() => setShowPass({...showPass, current: !showPass.current})} className="p-2 text-white/20 hover:text-white transition-colors">
                        {showPass.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />
                  
                  <div className="h-px bg-white/5 my-2" />

                  <PremiumInput 
                    label="New Password" 
                    type={showPass.new ? "text" : "password"}
                    icon={Lock} 
                    placeholder="Create a strong password"
                    value={passwords.new}
                    strength={passStrength}
                    maxLength={32}
                    onChange={(e) => {
                      setPasswords({...passwords, new: e.target.value});
                      calculateStrength(e.target.value);
                    }}
                    rightElement={
                      <button onClick={() => setShowPass({...showPass, new: !showPass.new})} className="p-2 text-white/20 hover:text-white transition-colors">
                        {showPass.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />

                  <PremiumInput 
                    label="Confirm New Password" 
                    type={showPass.confirm ? "text" : "password"}
                    icon={Lock} 
                    placeholder="Repeat new password"
                    value={passwords.confirm}
                    maxLength={32}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    error={passwords.confirm && passwords.confirm !== passwords.new ? "Passwords do not match" : null}
                    rightElement={
                      <button onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})} className="p-2 text-white/20 hover:text-white transition-colors">
                        {showPass.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />

                  <button 
                    onClick={handleUpdatePassword}
                    className="w-full mt-4 py-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-2xl text-[11px] font-black uppercase tracking-widest text-green-400 transition-all shadow-lg shadow-green-500/5"
                  >
                    Update Account Password
                  </button>
                </div>
              </div>

            </div>
          </SettingsSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 2. SECURITY */}
            <SettingsSection icon={Shield} title="Security" subtitle="Account Protection & Sessions">
              <div className="space-y-2">
                <PremiumToggle 
                  label="Two-Factor Authentication" 
                  description="Add an extra layer of security to your account."
                  icon={Fingerprint}
                  enabled={settings.twoFactor}
                  onChange={(val) => setSettings({...settings, twoFactor: val})}
                />
                
                <div className="pt-8 pb-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-4 bg-green-500/40 rounded-full" />
                      <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest">Active Sessions</h4>
                    </div>
                    <button className="text-[9px] font-black text-red-400 uppercase tracking-widest hover:underline">Revoke All</button>
                  </div>
                  
                  <div className="space-y-1">
                    <SessionItem device="Chrome on Windows Desktop" location="Mumbai, India" time="Online Now" isCurrent={true} />
                    <SessionItem device="FarmDirect App on iPhone 15" location="Pune, India" time="2 hours ago" isCurrent={false} />
                    <SessionItem device="Safari on MacBook Air" location="Mumbai, India" time="Yesterday" isCurrent={false} />
                  </div>
                </div>

                <button className="w-full mt-6 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-400 transition-all">
                  Logout from All Devices
                </button>
              </div>
            </SettingsSection>

            {/* 3. NOTIFICATIONS */}
            <SettingsSection icon={Bell} title="Notifications" subtitle="Alerts & Communication">
              <div className="space-y-2">
                <PremiumToggle 
                  label="Email Notifications" 
                  description="Receive order updates and reports via email."
                  icon={Mail}
                  enabled={settings.emailNotif}
                  onChange={(val) => setSettings({...settings, emailNotif: val})}
                />
                <PremiumToggle 
                  label="SMS Notifications" 
                  description="Get critical alerts and OTPs on your phone."
                  icon={MessageSquare}
                  enabled={settings.smsNotif}
                  onChange={(val) => setSettings({...settings, smsNotif: val})}
                />
                <PremiumToggle 
                  label="Push Notifications" 
                  description="Real-time alerts on your mobile and browser."
                  icon={Bell}
                  enabled={settings.pushNotif}
                  onChange={(val) => setSettings({...settings, pushNotif: val})}
                />
                
                <div className="mt-8 p-6 bg-green-500/5 border border-green-500/10 rounded-3xl relative overflow-hidden group">
                  <div className="relative z-10 space-y-2">
                    <p className="text-xs font-bold text-white">Smart Digest</p>
                    <p className="text-[10px] text-white/40 leading-relaxed font-medium">
                      You're currently receiving a weekly summary of your farm performance and earnings every Monday morning.
                    </p>
                  </div>
                  <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-green-500/10 blur-3xl rounded-full group-hover:scale-110 transition-transform duration-1000" />
                </div>
              </div>
            </SettingsSection>
          </div>

          {/* 4. PRIVACY */}
          <SettingsSection icon={ShieldCheck} title="Privacy & Data" subtitle="Control Your Personal Footprint">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-4">
                <PremiumToggle 
                  label="Profile Visibility" 
                  description="Allow buyers and other farmers to see your profile."
                  icon={Globe}
                  enabled={settings.profileVisibility}
                  onChange={(val) => setSettings({...settings, profileVisibility: val})}
                />
                <PremiumToggle 
                  label="Data Sharing Preferences" 
                  description="Share anonymous data to improve agricultural analytics."
                  icon={Activity}
                  enabled={settings.dataSharing}
                  onChange={(val) => setSettings({...settings, dataSharing: val})}
                />
              </div>

              <div className="bg-red-500/5 border border-red-500/10 rounded-[2rem] p-8 space-y-6 relative overflow-hidden group">
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center text-red-400">
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-black text-white tracking-tight">Danger Zone</h4>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed font-medium">
                    Permanently delete your account and all associated data. This action is irreversible and will remove all your products, orders, and earnings history.
                  </p>
                  <button className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/5 group-hover:shadow-red-500/20">
                    Delete Account Permanently
                  </button>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-red-500/10 blur-[80px] rounded-full group-hover:bg-red-500/20 transition-all duration-1000" />
              </div>
            </div>
          </SettingsSection>

        </div>

        {/* Global Footer Actions */}
        <div className="mt-12 flex items-center justify-center gap-10 pt-10 border-t border-white/5">
          <div className="flex items-center gap-3 text-white/20">
             <ShieldCheck className="w-4 h-4" />
             <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encrypted</span>
          </div>
          <div className="flex items-center gap-3 text-white/20">
             <CheckCircle2 className="w-4 h-4" />
             <span className="text-[10px] font-black uppercase tracking-widest">GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-3 text-white/20">
             <Activity className="w-4 h-4" />
             <span className="text-[10px] font-black uppercase tracking-widest">System Status: Optimal</span>
          </div>
        </div>

      </div>
    </GlassLayout>
  );
};

export default SettingsView;
