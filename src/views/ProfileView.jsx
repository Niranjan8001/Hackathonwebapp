import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Globe, 
  Camera, 
  Edit, 
  CheckCircle, 
  ChevronRight, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  FileText,
  Eye,
  MoreVertical,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFarmerContext } from '../context/FarmerContext';
import { GlassLayout } from '../components/layout/GlassLayout';

// --- Components ---

const CircularProgress = ({ percentage }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="6"
          fill="transparent"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="#22c55e"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-white">{percentage}%</span>
        <span className="text-[8px] text-white/40 uppercase font-bold">Complete</span>
      </div>
    </div>
  );
};

const ProfileSummaryCard = ({ user, isProfileComplete }) => {
  const navigate = useNavigate();
  const profileInputRef = useRef(null);
  const { updateProfileImages } = useFarmerContext();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfileImages(null, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const steps = [
    { label: 'Personal Information', completed: true },
    { label: 'Farm Details', completed: true },
    { label: 'Verification', completed: true },
    { label: 'Bank Details', completed: false, status: 'Pending' },
  ];

  return (
    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col lg:flex-row items-center gap-10">
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-white/10 overflow-hidden bg-white/5 relative z-10">
            <img 
              src={user?.photoURL || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"} 
              alt={user?.displayName} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 rounded-full">
            <button 
              onClick={() => profileInputRef.current.click()}
              className="bg-white/90 p-2 rounded-full shadow-lg"
            >
              <Camera className="w-5 h-5 text-green-600" />
            </button>
          </div>
          <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
        </div>
        <button 
          onClick={() => profileInputRef.current.click()}
          className="bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2 rounded-xl text-xs font-bold text-white/60 transition-all flex items-center gap-2"
        >
          <Camera className="w-3.5 h-3.5" />
          Change Photo
        </button>
      </div>

      {/* Info Section */}
      <div className="flex-1 text-center lg:text-left">
        <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-white flex items-center justify-center lg:justify-start gap-2">
            {user?.displayName || 'Farmer'}
            <CheckCircle className="w-5 h-5 text-green-400 fill-green-400/20" />
          </h2>
          <span className="text-white/40 text-sm font-medium">Farmer</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-center lg:justify-start gap-3 text-white/60">
            <Phone className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">{user?.phone || '+91 98765 43210'}</span>
          </div>
          <div className="flex items-center justify-center lg:justify-start gap-3 text-white/60">
            <Mail className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">{user?.email || 'farmer@example.com'}</span>
          </div>
          <div className="flex items-center justify-center lg:justify-start gap-3 text-white/60">
            <MapPin className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">{user?.location || 'Chaoyang, Uttar Pradesh, India'}</span>
          </div>
        </div>
      </div>

      {/* Completion Section */}
      <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-8 lg:pl-10 lg:border-l lg:border-white/5">
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Profile Completion</p>
          <CircularProgress percentage={85} />
        </div>
        
        <div className="flex flex-col gap-3">
          {steps.map((step) => (
            <div key={step.label} className="flex items-center justify-between gap-6 min-w-[180px]">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${step.completed ? 'bg-green-500 border-green-500' : 'border-white/20'}`}>
                  {step.completed && <CheckCircle className="w-3 h-3 text-black" />}
                </div>
                <span className="text-xs font-bold text-white/60">{step.label}</span>
              </div>
              <span className={`text-[10px] font-black uppercase ${step.completed ? 'text-green-400/60' : 'text-amber-400'}`}>
                {step.completed ? 'Completed' : 'Pending'}
              </span>
            </div>
          ))}
          <button 
            onClick={() => navigate('/complete-profile')}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white text-xs font-black uppercase tracking-widest py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-600/20"
          >
            Complete Profile
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`relative flex items-center gap-3 px-6 py-4 transition-all duration-300 ${isActive ? 'text-green-400' : 'text-white/40 hover:text-white/60'}`}
  >
    <Icon className={`w-4 h-4 ${isActive ? 'text-green-400' : 'text-white/40'}`} />
    <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    {isActive && (
      <motion.div 
        layoutId="activeTab"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
      />
    )}
  </button>
);

const InfoField = ({ label, value, icon: Icon, isEditing }) => (
  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-1 transition-all hover:bg-white/[0.08]">
    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{label}</span>
    <div className="flex items-center justify-between">
      <span className="text-sm font-bold text-white/80">{value}</span>
      {Icon && <Icon className="w-4 h-4 text-white/10" />}
    </div>
  </div>
);

const DocumentItem = ({ label, isVerified }) => (
  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.08] transition-all group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 border border-green-500/10">
        <FileText className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-white">{label}</h4>
        <div className="flex items-center gap-1.5 mt-0.5">
          <CheckCircle className="w-3 h-3 text-green-500" />
          <span className="text-[10px] font-bold text-green-500/60 uppercase tracking-widest">Verified</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest text-white/60">
        <Eye className="w-3.5 h-3.5" />
        View
      </button>
      <button className="p-2 text-white/20 hover:text-white/60 transition-colors">
        <MoreVertical className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// --- Main View ---

export const ProfileView = () => {
  const { currentUser, updateBio } = useFarmerContext();
  const [activeTab, setActiveTab] = useState('Personal Information');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState(currentUser?.bio || '');

  useEffect(() => {
    if (currentUser?.bio) setEditedBio(currentUser.bio);
  }, [currentUser?.bio]);

  const handleSaveBio = () => {
    updateBio(editedBio);
    setIsEditingBio(false);
  };

  const tabs = [
    { label: 'Personal Information', icon: User },
    { label: 'Farm Details', icon: ShieldCheck },
    { label: 'Verification', icon: ShieldCheck },
    { label: 'Bank Details', icon: Building2 },
  ];

  return (
    <GlassLayout>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Top Card */}
        <ProfileSummaryCard user={currentUser} />

        {/* Bottom Content Area */}
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden">
          {/* Tabs Navigation */}
          <div className="flex items-center px-4 border-b border-white/5">
            {tabs.map((tab) => (
              <TabButton 
                key={tab.label}
                icon={tab.icon}
                label={tab.label}
                isActive={activeTab === tab.label}
                onClick={() => setActiveTab(tab.label)}
              />
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'Personal Information' && (
                <motion.div 
                  key="personal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Info Grid */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white">Personal Information</h3>
                        <p className="text-xs text-white/40 font-medium">Update your personal details and contact information</p>
                      </div>
                      <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-xs font-bold text-white/60">
                        <Edit className="w-4 h-4 text-green-500" />
                        Edit
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InfoField label="Full Name" value={currentUser?.displayName || 'Arjun Singh'} />
                      <InfoField label="Email Address" value={currentUser?.email || 'arjunsingh@example.com'} />
                      <InfoField label="Phone Number" value={currentUser?.phone || '+91 98765 43210'} />
                      <InfoField label="Date of Birth" value="15 March 1990" icon={Calendar} />
                      <InfoField label="Gender" value="Male" />
                      <InfoField label="Language" value="English" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                    {/* About Me Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white">About Me</h3>
                        {!isEditingBio && (
                          <button 
                            onClick={() => setIsEditingBio(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-xs font-bold text-white/60"
                          >
                            <Edit className="w-3.5 h-3.5 text-green-500" />
                            Edit
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Briefly describe yourself and your farming experience</p>
                      
                      {isEditingBio ? (
                        <div className="space-y-4">
                          <textarea 
                            value={editedBio}
                            onChange={(e) => setEditedBio(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] p-5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 min-h-[150px] resize-none transition-all font-medium"
                          />
                          <div className="flex justify-end gap-3">
                            <button onClick={() => setIsEditingBio(false)} className="px-4 py-2 text-xs font-bold text-white/40 hover:text-white transition-colors">Cancel</button>
                            <button onClick={handleSaveBio} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all">Save Changes</button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6">
                          <p className="text-white/60 text-sm leading-relaxed font-medium">
                            {currentUser?.bio || 'I am a passionate farmer with over 8 years of experience in organic farming. I specialize in growing wheat, rice, and vegetables using sustainable practices.'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Documents Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white">Documents</h3>
                      <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Your verified documents</p>
                      
                      <div className="space-y-3">
                        <DocumentItem label="Aadhaar Card" isVerified />
                        <DocumentItem label="Farmer ID" isVerified />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab !== 'Personal Information' && (
                <motion.div 
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center"
                >
                  <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                    <User className="w-8 h-8 text-white/20" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{activeTab}</h3>
                  <p className="text-sm text-white/40 mt-2">Section content coming soon...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </GlassLayout>
  );
};
