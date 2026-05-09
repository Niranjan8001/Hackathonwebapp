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
  ArrowRight,
  Save,
  X,
  Type
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

const ProfileSummaryCard = ({ user }) => {
  const navigate = useNavigate();
  const profileInputRef = useRef(null);
  const { updateProfileImages } = useFarmerContext();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateProfileImages(null, file);
    }
  };

  // 📈 Real-time Progress Calculation
  const checkPersonal = !!(user?.name && user?.email && user?.phone && user?.dob);
  const checkFarm = !!(user?.farmName && user?.locationText && user?.bio);
  const checkVerification = !!(user?.isVerified || user?.certifications?.length > 0);
  const checkBank = !!(user?.bankName && user?.accountNumber);

  const steps = [
    { label: 'Personal Information', completed: checkPersonal },
    { label: 'Farm Details', completed: checkFarm },
    { label: 'Verification', completed: checkVerification },
    { label: 'Bank Details', completed: checkBank, status: 'Pending' },
  ];

  const completedCount = steps.filter(s => s.completed).length;
  const percentage = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col lg:flex-row items-center gap-10 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-white/10 overflow-hidden bg-white/5 relative z-10 shadow-2xl flex items-center justify-center">
            {user?.profilePhoto ? (
              <img 
                src={`${user.profilePhoto}${user.profilePhoto.includes('?') ? '&' : '?'}t=${Date.now()}`} 
                alt={user?.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-white/10" />
            )}
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 rounded-full cursor-pointer" onClick={() => profileInputRef.current.click()}>
            <Camera className="w-8 h-8 text-white/80" />
          </div>
          <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
        </div>
        <button 
          onClick={() => profileInputRef.current.click()}
          className="bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 transition-all flex items-center gap-2"
        >
          <Camera className="w-3.5 h-3.5" />
          Update Photo
        </button>
      </div>

      <div className="flex-1 text-center lg:text-left space-y-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-white flex items-center justify-center lg:justify-start gap-3">
            {user?.name || 'Farmer'}
            <div className={`w-6 h-6 ${checkVerification ? 'bg-green-500' : 'bg-white/10'} rounded-full flex items-center justify-center transition-colors`}>
               <CheckCircle className={`w-4 h-4 ${checkVerification ? 'text-black' : 'text-white/20'}`} />
            </div>
          </h2>
          <p className="text-sm font-bold text-white/20 uppercase tracking-[0.3em]">{checkVerification ? 'Verified Farmer' : 'Verification Pending'}</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-center lg:justify-start gap-3 text-white/60 bg-white/5 p-3 rounded-2xl border border-white/5">
            <Phone className="w-4 h-4 text-green-500" />
            <span className="text-xs font-bold">{user?.phone || 'Not provided'}</span>
          </div>
          <div className="flex items-center justify-center lg:justify-start gap-3 text-white/60 bg-white/5 p-3 rounded-2xl border border-white/5">
            <Mail className="w-4 h-4 text-green-500" />
            <span className="text-xs font-bold truncate">{user?.email || 'Not provided'}</span>
          </div>
          <div className="flex items-center justify-center lg:justify-start gap-3 text-white/60 bg-white/5 p-3 rounded-2xl border border-white/5 col-span-1 sm:col-span-2">
            <MapPin className="w-4 h-4 text-green-500" />
            <span className="text-xs font-bold">{user?.locationText || 'No location set'}</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-8 lg:pl-10 lg:border-l lg:border-white/5">
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Profile Strength</p>
          <CircularProgress percentage={percentage} />
        </div>
        
        <div className="flex flex-col gap-3">
          {steps.map((step) => (
            <div key={step.label} className="flex items-center justify-between gap-6 min-w-[180px]">
              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${step.completed ? 'bg-green-500 border-green-500' : 'border-white/10'}`}>
                  {step.completed && <CheckCircle className="w-2.5 h-2.5 text-black" />}
                </div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{step.label}</span>
              </div>
              <span className={`text-[9px] font-black uppercase ${step.completed ? 'text-green-400/40' : 'text-amber-400'}`}>
                {step.completed ? 'Done' : 'Pending'}
              </span>
            </div>
          ))}
          {percentage < 100 && (
            <button 
              onClick={() => navigate('/complete-profile')}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black uppercase tracking-[0.2em] py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-green-600/20 active:scale-95"
            >
              Complete Setup
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`relative flex items-center gap-3 px-8 py-5 transition-all duration-300 ${isActive ? 'text-green-400' : 'text-white/20 hover:text-white/40'}`}
  >
    <Icon className={`w-4 h-4 ${isActive ? 'text-green-400' : 'text-white/20'}`} />
    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    {isActive && (
      <motion.div 
        layoutId="activeTabProfile"
        className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]" 
      />
    )}
  </button>
);

const InfoField = ({ label, value, name, onChange, isEditing, type = "text", options = [] }) => {
  if (isEditing) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 ring-1 ring-white/5 focus-within:ring-green-500/30 transition-all">
        <label className="text-[9px] font-black uppercase tracking-widest text-white/20">{label}</label>
        {type === "select" ? (
          <select 
            name={name}
            value={value}
            onChange={onChange}
            className="bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer"
          >
            {options.map(opt => <option key={opt} value={opt} className="bg-[#0F172A]">{opt}</option>)}
          </select>
        ) : (
          <input 
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={`Enter ${label}`}
            className="bg-transparent text-sm font-bold text-white focus:outline-none w-full"
          />
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col gap-1.5 transition-all hover:bg-white/[0.08] group relative overflow-hidden">
      <span className="text-[9px] font-black uppercase tracking-widest text-white/20">{label}</span>
      <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{value || `Add ${label}`}</span>
      <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-10 transition-opacity">
         <Type className="w-10 h-10 -rotate-12" />
      </div>
    </div>
  );
};

const DocumentItem = ({ label, isVerified }) => (
  <div className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-[1.5rem] hover:bg-white/[0.08] transition-all group">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-green-500/5 rounded-xl flex items-center justify-center text-green-400 border border-green-500/10">
        <FileText className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-sm font-black text-white">{label}</h4>
        <div className="flex items-center gap-2 mt-1">
          <div className={`w-2 h-2 rounded-full ${isVerified ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-white/20'}`} />
          <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isVerified ? 'text-green-400' : 'text-white/20'}`}>
            {isVerified ? 'Verified' : 'Pending'}
          </span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white">
        <Eye className="w-3.5 h-3.5" />
        View
      </button>
      <button className="p-2 text-white/10 hover:text-white/40 transition-colors">
        <MoreVertical className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// --- Main View ---

export const ProfileView = () => {
  const { currentUser, updateProfile } = useFarmerContext();
  const [activeTab, setActiveTab] = useState('Personal Information');
  
  // Editing State for Personal Info
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalFormData, setPersonalFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    language: ''
  });

  // Editing State for Bio
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState('');

  // DigiLocker State
  const [digilockerLoading, setDigilockerLoading] = useState(false);

  const handleDigiLockerAuth = async () => {
    try {
      setDigilockerLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Your session has expired. Please log in again.');
        return;
      }

      const response = await apiService.initiateDigiLockerAuth(token);
      
      if (response.success && response.data.url) {
        // Securely redirect to DigiLocker authorization page
        console.log('DEBUG: Redirecting to DigiLocker:', response.data.url);
        window.location.href = response.data.url;
      } else {
        throw new Error(response.message || 'Failed to initiate DigiLocker verification');
      }
    } catch (err) {
      console.error('DigiLocker Initiation Error:', err);
      alert(err.message || 'Failed to connect to DigiLocker. Please try again later.');
    } finally {
      setDigilockerLoading(false);
    }
  };

  // Sync state with currentUser
  useEffect(() => {
    if (currentUser) {
      setPersonalFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        dob: currentUser.dob || '',
        gender: currentUser.gender || '',
        language: currentUser.language || 'English'
      });
      setEditedBio(currentUser.bio || '');
    }
  }, [currentUser]);

  const handlePersonalChange = (e) => {
    setPersonalFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSavePersonal = async () => {
    const success = await updateProfile(personalFormData);
    if (success) setIsEditingPersonal(false);
  };

  const handleSaveBio = async () => {
    const success = await updateProfile({ bio: editedBio });
    if (success) setIsEditingBio(false);
  };

  const tabs = [
    { label: 'Personal Information', icon: User },
    { label: 'Farm Details', icon: ShieldCheck },
    { label: 'Verification', icon: ShieldCheck },
    { label: 'Bank Details', icon: Building2 },
  ];

  return (
    <GlassLayout>
      <div className="max-w-[1600px] mx-auto space-y-8 pb-10 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
        
        {/* Top Card */}
        <ProfileSummaryCard user={currentUser} />

        {/* Bottom Content Area */}
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
          {/* Tabs Navigation */}
          <div className="flex items-center px-6 border-b border-white/5 bg-white/[0.02]">
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
          <div className="p-10">
            <AnimatePresence mode="wait">
              {activeTab === 'Personal Information' && (
                <motion.div 
                  key="personal"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-12"
                >
                  {/* Personal Information Header */}
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-white tracking-tight">Personal Information</h3>
                        <p className="text-xs text-white/20 font-bold uppercase tracking-widest">Update your personal details and contact information</p>
                      </div>
                      
                      {isEditingPersonal ? (
                        <div className="flex items-center gap-3">
                          <button onClick={() => setIsEditingPersonal(false)} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Cancel</button>
                          <button 
                            onClick={handleSavePersonal}
                            className="flex items-center gap-3 px-8 py-3 bg-green-500 hover:bg-green-600 text-black rounded-xl transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20 active:scale-95"
                          >
                            <Save className="w-4 h-4" />
                            Save Changes
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setIsEditingPersonal(true)}
                          className="flex items-center gap-3 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white"
                        >
                          <Edit className="w-4 h-4 text-green-500" />
                          Edit Profile
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <InfoField 
                        label="Full Name" 
                        name="name"
                        value={personalFormData.name} 
                        onChange={handlePersonalChange}
                        isEditing={isEditingPersonal}
                      />
                      <InfoField 
                        label="Email Address" 
                        name="email"
                        value={personalFormData.email} 
                        onChange={handlePersonalChange}
                        isEditing={isEditingPersonal}
                        type="email"
                      />
                      <InfoField 
                        label="Phone Number" 
                        name="phone"
                        value={personalFormData.phone} 
                        onChange={handlePersonalChange}
                        isEditing={isEditingPersonal}
                      />
                      <InfoField 
                        label="Date of Birth" 
                        name="dob"
                        value={personalFormData.dob} 
                        onChange={handlePersonalChange}
                        isEditing={isEditingPersonal}
                        type="date"
                      />
                      <InfoField 
                        label="Gender" 
                        name="gender"
                        value={personalFormData.gender} 
                        onChange={handlePersonalChange}
                        isEditing={isEditingPersonal}
                        type="select"
                        options={['Male', 'Female', 'Other', 'Prefer not to say']}
                      />
                      <InfoField 
                        label="Language" 
                        name="language"
                        value={personalFormData.language} 
                        onChange={handlePersonalChange}
                        isEditing={isEditingPersonal}
                        type="select"
                        options={['English', 'Hindi', 'Bengali', 'Marathi', 'Tamil', 'Telugu']}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 pt-8 border-t border-white/5">
                    {/* About Me Section */}
                    <div className="lg:col-span-3 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="text-xl font-black text-white">About Me</h3>
                          <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em]">Briefly describe yourself and your farming experience</p>
                        </div>
                        {!isEditingBio && (
                          <button 
                            onClick={() => setIsEditingBio(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white"
                          >
                            <Edit className="w-3.5 h-3.5 text-green-500" />
                            Edit
                          </button>
                        )}
                      </div>
                      
                      {isEditingBio ? (
                        <div className="space-y-4">
                          <textarea 
                            value={editedBio}
                            onChange={(e) => setEditedBio(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 min-h-[200px] resize-none transition-all font-medium leading-relaxed"
                            placeholder="Write something about yourself..."
                          />
                          <div className="flex justify-end gap-4">
                            <button onClick={() => setIsEditingBio(false)} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white">Cancel</button>
                            <button 
                              onClick={handleSaveBio} 
                              className="flex items-center gap-3 px-8 py-3 bg-green-500 hover:bg-green-600 text-black rounded-xl transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20 active:scale-95"
                            >
                              <Save className="w-4 h-4" />
                              Save Bio
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-10 group hover:bg-white/[0.08] transition-all cursor-pointer relative overflow-hidden" onClick={() => setIsEditingBio(true)}>
                          <p className="text-white/60 text-sm leading-relaxed font-medium italic relative z-10">
                            {currentUser?.bio || 'No bio provided. Click to add a bio about your farm.'}
                          </p>
                          <div className="absolute -right-4 -bottom-4 opacity-0 group-hover:opacity-5 transition-opacity">
                             <Type className="w-32 h-32" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Documents Section */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-white">Documents</h3>
                        <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em]">Your verified identification</p>
                      </div>
                      
                      <div className="space-y-4">
                        {currentUser?.certifications?.length > 0 ? (
                          currentUser.certifications.map((cert, index) => (
                            <DocumentItem 
                              key={cert.id || index} 
                              label={cert.title} 
                              isVerified={currentUser.isVerified} 
                            />
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center py-10 px-6 bg-white/5 border border-white/5 border-dashed rounded-[2rem] text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/10 mb-4">
                              <FileText className="w-8 h-8" />
                            </div>
                            <h4 className="text-sm font-black text-white/40 uppercase tracking-widest">No documents uploaded</h4>
                            <p className="text-[10px] text-white/20 mt-2 font-bold max-w-[200px] leading-relaxed uppercase tracking-widest">
                              Please upload your identification documents to get verified.
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <button className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-white/10 border-dashed py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white/40 transition-all flex items-center justify-center gap-3">
                         <Plus className="w-4 h-4" />
                         Upload New Document
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'Verification' && (
                <motion.div 
                  key="verification"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  <div className="flex flex-col lg:flex-row items-start gap-12">
                    <div className="flex-1 space-y-8">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-white tracking-tight">Identity Verification</h3>
                        <p className="text-xs text-white/20 font-bold uppercase tracking-widest">Connect your official government documents via DigiLocker</p>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden group">
                        {/* Background Decoration */}
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] group-hover:bg-purple-600/20 transition-all duration-700" />
                        
                        <div className="relative z-10 space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
                              <ShieldCheck className="w-8 h-8 text-purple-400" />
                            </div>
                            <div>
                              <h4 className="text-lg font-black text-white">Official Verification</h4>
                              <p className="text-sm text-white/40 font-medium italic">Powered by MeriPehchaan DigiLocker</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <p className="text-sm text-white/60 leading-relaxed max-w-xl">
                              Get the <span className="text-green-400 font-bold">Verified Farmer</span> badge by linking your DigiLocker account. This builds trust with buyers and unlocks premium features on the platform.
                            </p>
                            
                            <ul className="space-y-3">
                              {[
                                'Secure government-grade encryption',
                                'Instant identity validation',
                                'Verified Farmer badge on profile',
                                'Priority placement in search results'
                              ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/30">
                                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* DigiLocker Button */}
                          <button
                            onClick={handleDigiLockerAuth}
                            disabled={digilockerLoading}
                            className={`
                              relative group/btn w-full lg:w-auto px-10 py-5 rounded-2xl
                              bg-gradient-to-r from-purple-600 to-indigo-600
                              hover:from-purple-500 hover:to-indigo-500
                              transition-all duration-300 transform active:scale-[0.98]
                              shadow-[0_10px_30px_rgba(147,51,234,0.3)]
                              hover:shadow-[0_15px_40px_rgba(147,51,234,0.5)]
                              disabled:opacity-50 disabled:cursor-not-allowed
                              flex items-center justify-center gap-4
                            `}
                          >
                            {/* Neon Glow Effect */}
                            <div className="absolute inset-0 rounded-2xl bg-purple-500/20 blur-xl opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                            
                            {digilockerLoading ? (
                              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <img 
                                  src="https://upload.wikimedia.org/wikipedia/en/1/1e/DigiLocker_logo.png" 
                                  alt="DigiLocker" 
                                  className="w-8 h-8 object-contain brightness-0 invert" 
                                />
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-white">
                                  Verify with Digi Locker
                                </span>
                                <ArrowRight className="w-4 h-4 text-white/50 group-hover/btn:translate-x-1 transition-transform" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab !== 'Personal Information' && activeTab !== 'Verification' && (
                <motion.div 
                  key="placeholder"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-32 text-center"
                >
                  <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-transform">
                    <Building2 className="w-10 h-10 text-green-500/40" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{activeTab}</h3>
                  <p className="text-sm text-white/20 mt-4 font-bold max-w-sm mx-auto uppercase tracking-widest leading-relaxed">This section is currently under maintenance. Please check back later.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </GlassLayout>
  );
};

export default ProfileView;

const Plus = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
  </svg>
);
