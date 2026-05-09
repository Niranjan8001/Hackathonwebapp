import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, FileText, CheckCircle2, ShieldCheck, ChevronRight, Upload, PlusCircle } from 'lucide-react';
import { useFarmerContext } from '../context/FarmerContext';
import { useNavigate } from 'react-router-dom';

const Feature = ({ icon, title, desc }) => (
  <div className="flex items-center gap-4">
    <div className="bg-white/5 p-3 rounded-xl border border-white/10">{icon}</div>
    <div>
      <h4 className="font-bold text-white text-sm">{title}</h4>
      <p className="text-white/40 text-xs mt-0.5">{desc}</p>
    </div>
  </div>
);

export const CompleteProfile = () => {
  const { currentUser, updateProfileImages, updateBio, addCertification, setJustRegistered } = useFarmerContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState('');
  const [profilePreview, setProfilePreview] = useState(null);
  const [certPreview, setCertPreview] = useState(null);
  const [certName, setCertName] = useState('');
  
  const profileInputRef = useRef(null);
  const certInputRef = useRef(null);

  const [profileFile, setProfileFile] = useState(null);

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCertUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCertName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setCertPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!bio || !certPreview) return;
    
    setLoading(true);
    
    // In our robust context, updateProfileImages handles FormData/Cloudinary
    await updateProfileImages(null, profileFile);
    await updateBio(bio);
    addCertification({ title: 'Aadhaar Card Verification', issuer: certName, file: certPreview });
    
    // In a real app, we'd update bio and isProfileComplete in the context as well
    // For now, redirecting to dashboard
    setJustRegistered(false);
    navigate('/dashboard');
  };

  const isFormValid = bio.trim().length > 0 && certPreview;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans selection:bg-green-500/30">
      {/* 🎬 VIDEO BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/farm-bg.webm" type="video/webm" />
          <source src="/farm-bg.mp4" type="video/mp4" />
          <img src="/farm-poster.jpg" alt="Farm background" className="w-full h-full object-cover" />
        </video>
      </div>

      {/* 🌫️ OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />

      {/* 🔥 CONTENT LAYER */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-2 h-full overflow-y-auto lg:overflow-hidden pb-12 lg:pb-0">
        
        {/* LEFT SIDE — TEXT */}
        <div className="hidden lg:flex flex-col justify-center px-10 lg:px-24 text-white pt-12 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-7xl font-bold leading-tight">
              Let’s Complete <br />
              <span className="text-green-400">Your Profile</span>
            </h1>
            <p className="mt-8 text-lg lg:text-xl text-gray-300 max-w-xl leading-relaxed">
              Add a few details about yourself to help build trust in the community.
            </p>

            <div className="mt-12 space-y-8">
              <Feature 
                icon={<Camera className="text-green-400 w-6 h-6" />} 
                title="Profile Photo" 
                desc="Upload a clear picture of yourself or your farm." 
              />
              <Feature 
                icon={<FileText className="text-green-400 w-6 h-6" />} 
                title="About You" 
                desc="Write a short bio to introduce your farm to buyers." 
              />
              <Feature 
                icon={<ShieldCheck className="text-green-400 w-6 h-6" />} 
                title="Aadhaar Card" 
                desc="Upload your Aadhaar card for verified status." 
              />
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 flex items-center gap-3">
              <ShieldCheck className="text-white/20 w-5 h-5" />
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
                Your information is safe and used for verification only.
              </p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE — CARD */}
        <div className="flex items-center justify-center px-6 pt-12 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-lg bg-green-900/10 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 lg:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.7)]"
          >
            <div className="space-y-10">
              {/* 1️⃣ Profile Photo */}
              <div className="flex flex-col items-center">
                <div 
                  onClick={() => profileInputRef.current.click()}
                  className="relative group cursor-pointer"
                >
                  <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden bg-white/5 group-hover:border-green-500/50 transition-all shadow-inner">
                    {profilePreview ? (
                      <img src={profilePreview} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      <Camera className="w-10 h-10 text-white/20 group-hover:text-green-400 transition-colors" />
                    )}
                  </div>
                  <div className="absolute bottom-1 right-1 bg-green-500 p-2 rounded-full text-white shadow-xl ring-4 ring-black/20">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-4">Profile Photo (Optional)</span>
                <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={handleProfileUpload} />
              </div>

              {/* 2️⃣ About You (Bio) */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 block">About Your Farm (Bio)</label>
                <div className="relative">
                  <textarea 
                    placeholder="Tell buyers about your story, your farm, and your passion..."
                    maxLength={300}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 min-h-[120px] resize-none transition-all placeholder:text-white/10 font-medium"
                  />
                  <div className={`absolute bottom-4 right-4 text-[10px] font-black ${bio.length === 300 ? 'text-red-400' : 'text-white/20'}`}>
                    {bio.length}/300
                  </div>
                </div>
              </div>

              {/* 3️⃣ Certification Upload */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 block">Aadhaar Card (Mandatory)</label>
                <div 
                  onClick={() => certInputRef.current.click()}
                  className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-green-500/30 transition-all group"
                >
                  {certPreview ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle2 className="w-8 h-8 text-green-400" />
                      <span className="text-xs font-bold text-white truncate max-w-[250px]">{certName}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-white/20 group-hover:text-green-400 mb-3 transition-colors" />
                      <p className="text-[10px] text-white/40 text-center font-black uppercase tracking-widest leading-relaxed">
                        Drag & drop or click to upload<br />
                        <span className="text-[8px] opacity-50">PDF, JPG, PNG (Max 5MB)</span>
                      </p>
                    </>
                  )}
                </div>
                <input type="file" ref={certInputRef} className="hidden" accept=".pdf,image/*" onChange={handleCertUpload} />
              </div>

              {/* CTA BUTTON */}
              <motion.button
                whileHover={isFormValid ? { y: -2, boxShadow: "0 0 40px rgba(34,197,94,0.6)" } : {}}
                whileTap={isFormValid ? { scale: 0.98 } : {}}
                disabled={!isFormValid || loading}
                onClick={handleSave}
                className={`w-full py-5 rounded-[1.25rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                  isFormValid 
                  ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] cursor-pointer' 
                  : 'bg-white/5 text-white/10 border border-white/10 cursor-not-allowed opacity-50'
                }`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Save & Continue</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};
