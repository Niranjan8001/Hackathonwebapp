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
  Type,
  List,
  Home,
  Sprout,
  Droplets,
  Map,
  Image as ImageIcon,
  UploadCloud,
  Leaf,
  Plus,
  Upload,
  Languages,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFarmerContext } from '../context/FarmerContext';
import { GlassLayout } from '../components/layout/GlassLayout';
import { apiService } from '../services/apiService';


// --- Components ---

const CROP_OPTIONS = [
  "Wheat", "Rice", "Maize", "Soybean", "Cotton", "Sugarcane",
  "Potato", "Tomato", "Onion", "Pulses", "Mustard", "Millet",
  "Barley", "Groundnut", "Others"
];

const SearchableMultiSelect = ({ label, options, selectedValues = [], onToggle, placeholder, required = false, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-2" ref={containerRef}>
      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
        {label} {required && '*'}
      </label>
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`
            min-h-[50px] w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 
            cursor-pointer transition-all flex flex-wrap gap-2 items-center
            ${isOpen ? 'border-green-500/50 ring-1 ring-green-500/50' : 'hover:border-white/20'}
          `}
        >
          {Icon && <Icon className="w-4 h-4 text-green-400/50 mr-2 flex-shrink-0" />}

          {selectedValues.length > 0 ? (
            selectedValues.map(val => (
              <span
                key={val}
                className="bg-green-500/20 text-green-400 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 border border-green-500/30 group/chip hover:bg-green-500/30 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(val);
                }}
              >
                {val}
                <X className="w-3 h-3 cursor-pointer text-green-400/50 group-hover/chip:text-green-400" />
              </span>
            ))
          ) : (
            <span className="text-white/20 font-medium">{placeholder}</span>
          )}

          <div className="ml-auto">
            <ChevronRight className={`w-4 h-4 text-white/20 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute z-[100] top-full mt-2 w-full bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-2 backdrop-blur-2xl"
            >
              <div className="relative mb-2">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Type className="w-3 h-3 text-white/20" />
                </div>
                <input
                  type="text"
                  placeholder="Search crops..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-white/5 border border-white/5 text-white text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-green-500/30 transition-all placeholder:text-white/10"
                />
              </div>

              <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map(opt => (
                    <div
                      key={opt}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggle(opt);
                      }}
                      className={`
                        flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all
                        ${selectedValues.includes(opt)
                          ? 'bg-green-500/20 text-green-400'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'}
                      `}
                    >
                      <span className="text-xs font-bold tracking-wide">{opt}</span>
                      {selectedValues.includes(opt) && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">No crops found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const CircularProgress = ({ percentage, size = 100, strokeWidth = 8, color = "#22c55e" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.03)"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="transition-all duration-500"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          style={{ 
            strokeDashoffset: offset,
            filter: `drop-shadow(0 0 10px ${color}60)` 
          }}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
      
      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="flex items-baseline justify-center gap-0.5">
           <span className="text-3xl font-black text-white tracking-tighter leading-none">
            {Math.round(percentage)}
          </span>
          <span className="text-[10px] font-black text-white/30 uppercase tracking-tighter leading-none">%</span>
        </div>
        <span className="text-[7px] text-white/20 font-black uppercase tracking-[0.25em] leading-none mt-2">
          Complete
        </span>
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
  const steps = [
    { label: 'Personal Info', completed: !!(user?.name && user?.email && user?.dob) },
    { label: 'Farm Details', completed: !!(user?.farmName && (user?.primaryCrops?.length > 0) && user?.villageLocality) },
    { label: 'Uploaded Docs', completed: !!(user?.farmImages?.length > 0) },
    { label: 'Bank Details', completed: !!(user?.bankName && user?.accountNumber) },
  ];

  const percentage = user?.profileCompletion || 0;


  // Motivational Messages
  const getMotivation = () => {
    if (percentage === 100) return { title: "Profile Perfect!", sub: "You're all set to trade with trust.", color: "text-green-400" };
    if (percentage >= 75) return { title: "Almost There!", sub: "Complete one last step to get verified.", color: "text-blue-400" };
    if (percentage >= 50) return { title: "Great Progress!", sub: "Add your farm details to reach more buyers.", color: "text-amber-400" };
    return { title: "Get Started!", sub: "Complete your profile to build buyer trust.", color: "text-white/40" };
  };

  const motivation = getMotivation();

  return (
    <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-8 lg:p-12 relative overflow-hidden group opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
      {/* Background Glow */}
      <div className="absolute -left-20 -top-20 w-80 h-80 bg-green-500/5 rounded-full blur-[120px] group-hover:bg-green-500/10 transition-all duration-1000" />

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 z-10 relative">
        {/* Left: Avatar Section */}
        <div className="flex flex-col items-center gap-5 flex-shrink-0">
          <div className="relative group/avatar">
            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-[6px] border-white/5 overflow-hidden bg-white/5 relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-all duration-700 group-hover/avatar:scale-105 group-hover/avatar:border-green-500/20">
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
            <div
              className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 flex flex-col items-center justify-center z-20 rounded-full cursor-pointer backdrop-blur-sm"
              onClick={() => profileInputRef.current.click()}
            >
              <Camera className="w-6 h-6 text-white mb-1" />
              <span className="text-[8px] font-black text-white uppercase tracking-widest">Change</span>
            </div>
            <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>

          <div className={`px-4 py-1.5 rounded-full border flex items-center gap-2 transition-all duration-500 ${user?.isVerified ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-white/5 border-white/10 text-white/20'}`}>
            <ShieldCheck className={`w-3.5 h-3.5 ${user?.isVerified ? 'text-green-400' : 'text-white/10'}`} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">{user?.verification?.verificationStatus || (user?.isVerified ? 'Verified' : 'Unverified')}</span>
          </div>

        </div>

        {/* Middle: Identity & Motivation */}
        <div className="flex-1 flex flex-col items-center lg:items-start gap-4 text-center lg:text-left lg:px-10">
          <div className="space-y-2">
            <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter leading-none">
              {user?.name || 'Farmer'}
            </h2>
            <div className="flex items-center justify-center lg:justify-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse" />
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Official Farm Profile</span>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 w-full lg:max-w-xs">
            <p className={`text-xs font-black uppercase tracking-[0.2em] mb-1.5 ${motivation.color}`}>{motivation.title}</p>
            <p className="text-sm text-white/50 font-medium italic leading-relaxed">"{motivation.sub}"</p>
          </div>
        </div>

        {/* Right: Progress & Stats Combined */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-10 lg:gap-14 lg:pl-12 lg:border-l lg:border-white/10">
          <div className="flex flex-col items-center gap-7 group/strength">
            <div className="relative transition-all duration-700 group-hover/strength:scale-105">
              {/* Soft Background Glow */}
              <div className="absolute inset-0 bg-green-500/10 blur-3xl rounded-full opacity-0 group-hover/strength:opacity-100 transition-opacity duration-1000" />
              <CircularProgress percentage={percentage} size={120} strokeWidth={10} />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 group-hover/strength:text-white/40 transition-colors">Strength</p>
            </div>
          </div>


          <div className="grid grid-cols-1 gap-3.5 min-w-[200px]">
            {steps.map((step) => (
              <div key={step.label} className="flex items-center justify-between gap-6 group/item">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all duration-500 ${step.completed ? 'bg-green-500 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'border-white/10 group-hover/item:border-white/20'}`}>
                    {step.completed ? <CheckCircle className="w-3 h-3 text-black" /> : <div className="w-1 h-1 rounded-full bg-white/10" />}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${step.completed ? 'text-white' : 'text-white/20 group-hover/item:text-white/40'}`}>{step.label}</span>
                </div>
                <div className={`h-px flex-1 mx-2 transition-all duration-700 ${step.completed ? 'bg-green-500/20' : 'bg-white/5'}`} />
                <span className={`text-[9px] font-black uppercase tracking-[0.1em] ${step.completed ? 'text-green-400' : 'text-amber-400/30'}`}>
                  {step.completed ? 'Done' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
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

const InfoField = ({ label, value, name, onChange, isEditing, type = "text", options = [], icon: Icon, maxLength }) => {
  if (isEditing) {
    return (
      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 space-y-2 ring-1 ring-white/5 focus-within:ring-green-500/30 focus-within:border-green-500/50 transition-all">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-3 h-3 text-green-400/50" />}
          <label className="text-[9px] font-black uppercase tracking-widest text-white/40">{label}</label>
        </div>
        {type === "select" ? (
          <select
            name={name}
            value={value || ""}
            onChange={onChange}
            className="bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer w-full [&>option]:bg-[#111827]"
          >
            <option value="" disabled>Select {label}</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={`Enter ${label}`}
            maxLength={maxLength}
            className="bg-transparent text-sm font-bold text-white focus:outline-none w-full placeholder:text-white/10"
          />
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex flex-col gap-1.5 transition-all hover:bg-white/[0.08] hover:border-white/10 group relative overflow-hidden backdrop-blur-sm">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-3 h-3 text-green-400/30 group-hover:text-green-400/60 transition-colors" />}
        <span className="text-[9px] font-black uppercase tracking-widest text-white/20">{label}</span>
      </div>
      <span className={`text-sm font-bold transition-colors ${value ? 'text-white/80 group-hover:text-white' : 'text-white/40 italic group-hover:text-white/60'}`}>
        {value || 'Not specified'}
      </span>
      {/* Subtle Background Pattern */}
      <div className="absolute -right-2 -bottom-2 p-2 opacity-0 group-hover:opacity-[0.03] transition-all duration-500 group-hover:scale-110">
        {Icon ? <Icon className="w-16 h-16 -rotate-12" /> : <Type className="w-16 h-16 -rotate-12" />}
      </div>
    </div>
  );
};

const DocumentCard = ({ label, isVerified, type = "JPG, PNG, PDF (Max 5MB)" }) => (
  <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 space-y-4 hover:bg-white/[0.08] hover:border-white/20 transition-all group relative overflow-hidden">
    <div className="flex items-start justify-between">
      <div className="w-12 h-12 bg-green-500/5 rounded-xl flex items-center justify-center text-green-400 border border-green-500/10 group-hover:scale-110 transition-transform">
        <FileText className="w-6 h-6" />
      </div>
      <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${isVerified ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-white/5 border-white/10 text-white/20'}`}>
        {isVerified ? 'Verified' : 'Pending'}
      </div>
    </div>

    <div className="space-y-1">
      <h4 className="text-sm font-black text-white">{label}</h4>
      <p className="text-[9px] text-white/20 font-bold uppercase tracking-wider">{type}</p>
    </div>

    <div className="pt-2">
      <button className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white group-hover:border-green-500/30 group-hover:text-green-400">
        <Upload className="w-3.5 h-3.5" />
        {isVerified ? 'Update' : 'Upload File'}
      </button>
    </div>
  </div>
);

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
    dob: '',
    gender: '',
    language: ''
  });

  // Editing State for Bio
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState('');

  // Verification Request Logic
  const [verificationLoading, setVerificationLoading] = useState(false);

  const handleRequestVerification = async () => {
    try {
      setVerificationLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Your session has expired. Please log in again.');
        return;
      }

      const response = await apiService.requestVerification(token);

      if (response.success) {
        alert('Verification request submitted successfully!');
        // Update user state via context if possible, or just refresh/local update
        if (currentUser) {
          currentUser.verification.verificationStatus = 'Verification Requested';
        }
      } else {
        throw new Error(response.message || 'Failed to submit verification request');
      }
    } catch (err) {
      console.error('Verification Request Error:', err);
      alert(err.message || 'Failed to request verification. Please try again later.');
    } finally {
      setVerificationLoading(false);
    }
  };


  // Bank Form State
  const [bankFormData, setBankFormData] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    accountType: '',
    branchName: ''
  });
  const [ifscLoading, setIfscLoading] = useState(false);
  const [bankError, setBankError] = useState('');
  const [isSavingBank, setIsSavingBank] = useState(false);

  // Farm Details State
  const [farmFormData, setFarmFormData] = useState({
    farmName: '',
    farmPhone: '',
    farmSize: '',
    farmUnit: 'Acre',
    ownershipType: '',
    primaryCrops: [],
    otherCrops: [],
    irrigationSource: '',
    waterAvailability: '',
    villageLocality: '',
    district: '',
    state: '',
    pincode: '',
    additionalNotes: ''
  });
  const [farmImages, setFarmImages] = useState([]); // { file, preview, isExisting, url }
  const [isSavingFarm, setIsSavingFarm] = useState(false);
  const [farmError, setFarmError] = useState('');
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);
  const [isLocationAutoFilled, setIsLocationAutoFilled] = useState(false);
  const farmImageInputRef = useRef(null);

  useEffect(() => {
    const fetchPincodeDetails = async () => {
      // Only trigger if exactly 6 digits
      if (farmFormData.pincode.length === 6) {
        try {
          setIsPincodeLoading(true);
          const response = await fetch(`https://api.postalpincode.in/pincode/${farmFormData.pincode}`);
          const data = await response.json();

          if (data[0].Status === "Success") {
            const details = data[0].PostOffice[0];
            setFarmFormData(prev => ({
              ...prev,
              district: details.District,
              state: details.State
            }));
            setIsLocationAutoFilled(true);
            setFarmError(''); // Clear error if success
          } else {
            setFarmError("Invalid PIN code. Please check and try again.");
            setIsLocationAutoFilled(false);
          }
        } catch (error) {
          console.error("PIN code fetch error:", error);
          setFarmError("Could not fetch location details.");
          setIsLocationAutoFilled(false);
        } finally {
          setIsPincodeLoading(false);
        }
      } else {
        // Re-enable if length changes from 6
        setIsLocationAutoFilled(false);
      }
    };

    fetchPincodeDetails();
  }, [farmFormData.pincode]);

  const handleFarmFormChange = (e) => {
    const { name, value } = e.target;
    setFarmFormData(prev => ({ ...prev, [name]: value }));
    if (farmError) setFarmError('');
  };

  const handleFarmImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (farmImages.length + files.length > 5) {
      setFarmError('You can only upload a maximum of 5 images');
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isExisting: false
    }));

    setFarmImages(prev => [...prev, ...newImages]);
  };

  const removeFarmImage = (index) => {
    setFarmImages(prev => {
      const updated = [...prev];
      if (!updated[index].isExisting) {
        URL.revokeObjectURL(updated[index].preview);
      }
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSaveFarmDetails = async (e) => {
    e.preventDefault();
    setFarmError('');

    // Validation
    const requiredFields = ['farmName', 'farmSize', 'ownershipType', 'villageLocality', 'irrigationSource', 'waterAvailability'];
    const missingFields = requiredFields.filter(field => !farmFormData[field]);

    if (missingFields.length > 0) {
      setFarmError('Please fill in all required fields.');
      return;
    }

    if (!farmFormData.primaryCrops || farmFormData.primaryCrops.length === 0) {
      setFarmError('Please select at least one primary crop.');
      return;
    }

    try {
      setIsSavingFarm(true);
      const formData = new FormData();

      // Add text fields
      Object.keys(farmFormData).forEach(key => {
        if (Array.isArray(farmFormData[key])) {
          // Handle arrays (crops)
          farmFormData[key].forEach(val => formData.append(key, val));
        } else {
          formData.append(key, farmFormData[key]);
        }
      });

      // Add new images
      farmImages.forEach(img => {
        if (!img.isExisting) {
          formData.append('farmImages', img.file);
        } else {
          // If we want to keep existing images, we might need a way to tell the backend
          // For now, the backend replaces them if farmImages field is sent.
          // This is a bit tricky with Multer. Let's assume we send all current URLs too if they are existing.
          formData.append('existingFarmImages', img.url);
        }
      });

      const success = await updateProfile(formData);
      if (success) {
        alert('Farm details saved successfully!');
      } else {
        setFarmError('Failed to save farm details.');
      }
    } catch (err) {
      setFarmError('An error occurred while saving.');
    } finally {
      setIsSavingFarm(false);
    }
  };

  const handleBankFormChange = (e) => {
    setBankFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear errors when typing
    if (bankError) setBankError('');
  };

  const handleVerifyIFSC = async (e) => {
    e.preventDefault();
    setBankError('');
    if (bankFormData.ifscCode.length < 11) {
      setBankError('Please enter a valid 11-character IFSC code');
      return;
    }

    try {
      setIfscLoading(true);
      const res = await fetch(`https://ifsc.razorpay.com/${bankFormData.ifscCode.toUpperCase()}`);

      if (!res.ok) {
        throw new Error('Invalid IFSC Code');
      }

      const data = await res.json();

      setBankFormData(prev => ({
        ...prev,
        branchName: data.BRANCH,
        bankName: data.BANK
      }));
    } catch (error) {
      setBankError('Invalid IFSC Code. Please check and try again.');
      setBankFormData(prev => ({
        ...prev,
        branchName: '',
        bankName: ''
      }));
    } finally {
      setIfscLoading(false);
    }
  };

  const handleSaveBankDetails = async (e) => {
    e.preventDefault();
    setBankError('');

    // Validation
    if (!bankFormData.accountHolderName || !bankFormData.accountNumber || !bankFormData.ifscCode || !bankFormData.bankName || !bankFormData.accountType) {
      setBankError('Please fill in all required fields.');
      return;
    }

    try {
      setIsSavingBank(true);
      const success = await updateProfile(bankFormData);
      if (success) {
        alert('Bank details saved successfully!');
      } else {
        setBankError('Failed to save bank details. Please try again.');
      }
    } catch (err) {
      setBankError('An unexpected error occurred.');
    } finally {
      setIsSavingBank(false);
    }
  };

  // Sync state with currentUser
  useEffect(() => {
    if (currentUser) {
      setPersonalFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        dob: currentUser.dob || '',
        gender: currentUser.gender || '',
        language: currentUser.language || 'English'
      });
      setEditedBio(currentUser.bio || '');

      setBankFormData({
        accountHolderName: currentUser.accountHolderName || '',
        accountNumber: currentUser.accountNumber || '',
        ifscCode: currentUser.ifscCode || '',
        bankName: currentUser.bankName || '',
        accountType: currentUser.accountType || '',
        branchName: currentUser.branchName || ''
      });

      setFarmFormData({
        farmName: currentUser.farmName || '',
        farmPhone: currentUser.farmPhone || '',
        farmSize: currentUser.farmSize || '',
        farmUnit: currentUser.farmUnit || 'Acre',
        ownershipType: currentUser.ownershipType || '',
        primaryCrops: Array.isArray(currentUser.primaryCrops) ? currentUser.primaryCrops : (currentUser.primaryCrops ? [currentUser.primaryCrops] : []),
        otherCrops: Array.isArray(currentUser.otherCrops) ? currentUser.otherCrops : (currentUser.otherCrops ? [currentUser.otherCrops] : []),
        irrigationSource: currentUser.irrigationSource || '',
        waterAvailability: currentUser.waterAvailability || '',
        villageLocality: currentUser.villageLocality || '',
        district: currentUser.district || '',
        state: currentUser.state || '',
        pincode: currentUser.pincode || '',
        additionalNotes: currentUser.additionalNotes || ''
      });

      if (currentUser.farmImages && currentUser.farmImages.length > 0) {
        setFarmImages(currentUser.farmImages.map(url => ({
          url,
          preview: url,
          isExisting: true
        })));
      }

      // If existing pincode is valid, set auto-filled
      if (currentUser.pincode && currentUser.pincode.length === 6) {
        setIsLocationAutoFilled(true);
      }
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
    { label: 'Farm Details', icon: Sprout },
    { label: 'Bank Details', icon: Building2 },
    { label: 'Verification', icon: ShieldCheck },
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
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                  {/* Left & Middle: Form & Bio */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 lg:p-10 space-y-10">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="text-2xl font-black text-white">Basic Information</h3>
                          <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">Tell us more about yourself</p>
                        </div>
                        {!isEditingPersonal ? (
                          <button
                            onClick={() => setIsEditingPersonal(true)}
                            className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white"
                          >
                            <Edit className="w-4 h-4 text-green-500" />
                            Edit Profile
                          </button>
                        ) : (
                          <div className="flex gap-4">
                            <button onClick={() => setIsEditingPersonal(false)} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white">Cancel</button>
                            <button
                              onClick={handleSavePersonal}
                              className="flex items-center gap-3 px-8 py-3 bg-green-500 hover:bg-green-600 text-black rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20 active:scale-95"
                            >
                              <Save className="w-4 h-4" />
                              Save Changes
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoField label="Full Name" name="name" value={personalFormData.name} onChange={handlePersonalChange} isEditing={isEditingPersonal} icon={User} maxLength={50} />
                        <InfoField label="Email Address" name="email" value={personalFormData.email} onChange={handlePersonalChange} isEditing={isEditingPersonal} type="email" icon={Mail} maxLength={100} />

                        <InfoField label="Date of Birth" name="dob" value={personalFormData.dob} onChange={handlePersonalChange} isEditing={isEditingPersonal} type="date" icon={Calendar} />
                        <InfoField label="Gender" name="gender" value={personalFormData.gender} onChange={handlePersonalChange} isEditing={isEditingPersonal} type="select" options={['Male', 'Female', 'Other', 'Prefer not to say']} icon={Users} />
                        <InfoField label="Language" name="language" value={personalFormData.language} onChange={handlePersonalChange} isEditing={isEditingPersonal} type="select" options={['English', 'Hindi', 'Bengali', 'Marathi', 'Tamil', 'Telugu']} icon={Languages} />
                      </div>
                    </div>

                    {/* About Me */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 lg:p-10 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="text-2xl font-black text-white">About Me</h3>
                          <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">Share your farming journey</p>
                        </div>
                        {!isEditingBio && (
                          <button onClick={() => setIsEditingBio(true)} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-green-500">
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {isEditingBio ? (
                        <div className="space-y-6">
                          <textarea
                            value={editedBio}
                            onChange={(e) => setEditedBio(e.target.value)}
                            maxLength={500}
                            className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-white text-base focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 min-h-[180px] resize-none transition-all font-medium leading-relaxed placeholder:text-white/5"
                            placeholder="I am passionate about sustainable farming..."
                          />
                          <div className="flex justify-end gap-4">
                            <button onClick={() => setIsEditingBio(false)} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white">Cancel</button>
                            <button onClick={handleSaveBio} className="flex items-center gap-3 px-10 py-4 bg-green-500 hover:bg-green-600 text-black rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest">
                              <Save className="w-4 h-4" />
                              Update Bio
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 group hover:bg-white/[0.08] transition-all cursor-pointer relative overflow-hidden" onClick={() => setIsEditingBio(true)}>
                          <p className="text-white/70 text-base leading-relaxed font-medium italic relative z-10">
                            {currentUser?.bio || 'No bio provided. Click to share your expertise and passion for farming.'}
                          </p>
                          <div className="absolute -right-6 -bottom-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                            <Edit className="w-32 h-32 -rotate-12" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Quick Summary & Identification */}
                  <div className="space-y-8">
                    {/* Identification Documents */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-white">Identification</h3>
                        <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">Verified Documents</p>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <DocumentCard label="Aadhaar Card" isVerified={currentUser?.isVerified} />
                        <DocumentCard label="PAN Card" isVerified={currentUser?.isVerified} />
                        <DocumentCard label="Farmer ID" isVerified={false} type="Optional (JPG/PDF)" />
                      </div>
                    </div>

                    {/* Trust Card */}
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/5 border border-green-500/20 rounded-[2.5rem] p-8 relative overflow-hidden group">
                      <div className="relative z-10 space-y-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                          <ShieldCheck className="w-6 h-6 text-green-400" />
                        </div>
                        <h4 className="text-lg font-black text-white leading-tight">Your Information is Safe</h4>
                        <p className="text-xs text-white/40 leading-relaxed font-medium">
                          We use industry-standard encryption to protect your personal data. Your information will never be shared with third parties without your consent.
                        </p>
                      </div>
                      <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <ShieldCheck className="w-40 h-40" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'Farm Details' && (
                <motion.div
                  key="farm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col items-center text-center space-y-4 mb-8">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 mb-2">
                      <Home className="w-8 h-8 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider">Farm Details</h2>
                    <p className="text-sm text-white/60 font-medium">
                      Provide information about your farm.<br />
                      This helps us serve you better and verify your farm.
                    </p>
                  </div>

                  <form onSubmit={handleSaveFarmDetails} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Column: Farm Information */}
                      <div className="space-y-6 bg-white/[0.02] border border-white/10 rounded-3xl p-6 lg:p-8">
                        <div className="flex items-center gap-3 mb-2">
                          <Home className="w-5 h-5 text-green-400" />
                          <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest">Farm Information</h3>
                        </div>

                        {/* Farm Name */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Farm Name *</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Home className="w-4 h-4 text-green-400/50" />
                            </div>
                            <input
                              type="text"
                              name="farmName"
                              value={farmFormData.farmName}
                              onChange={handleFarmFormChange}
                              placeholder="Enter farm name"
                              maxLength={100}
                              className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all placeholder:text-white/10"
                            />
                          </div>
                        </div>

                        {/* Farm Phone Number */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Farm Contact Phone</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Phone className="w-4 h-4 text-green-400/50" />
                            </div>
                            <input
                              type="tel"
                              name="farmPhone"
                              value={farmFormData.farmPhone}
                              onChange={handleFarmFormChange}
                              placeholder="Enter farm contact number"
                              maxLength={15}
                              className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all placeholder:text-white/10"
                            />
                          </div>
                        </div>

                        {/* Farm Size */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Farm Size *</label>
                          <div className="flex gap-3">
                            <div className="relative flex-1">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Type className="w-4 h-4 text-green-400/50" />
                              </div>
                              <input
                                type="number"
                                name="farmSize"
                                value={farmFormData.farmSize}
                                onChange={handleFarmFormChange}
                                placeholder="Enter farm size"
                                maxLength={10}
                                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all placeholder:text-white/10"
                              />
                            </div>
                            <select
                              name="farmUnit"
                              value={farmFormData.farmUnit}
                              onChange={handleFarmFormChange}
                              className="bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-green-500/50 transition-all appearance-none cursor-pointer [&>option]:bg-[#111827]"
                            >
                              <option value="Acre">Acre</option>
                              <option value="Hectare">Hectare</option>
                            </select>
                          </div>
                        </div>

                        {/* Land Ownership */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Land Ownership *</label>
                          <div className="relative">
                            <select
                              name="ownershipType"
                              value={farmFormData.ownershipType}
                              onChange={handleFarmFormChange}
                              className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-green-500/50 transition-all appearance-none cursor-pointer [&>option]:bg-[#111827]"
                            >
                              <option value="" disabled>Select ownership type</option>
                              <option value="Owned">Owned</option>
                              <option value="Leased">Leased</option>
                              <option value="Ancestral">Ancestral</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                              <ChevronRight className="w-4 h-4 text-white/20 rotate-90" />
                            </div>
                          </div>
                          <p className="text-[10px] text-white/20 italic">Who owns this land?</p>
                        </div>

                        {/* Farm Location */}
                        <div className="space-y-4 pt-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-400" />
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Farm Location *</label>
                          </div>

                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <MapPin className="w-4 h-4 text-green-400/50" />
                            </div>
                            <input
                              type="text"
                              name="villageLocality"
                              value={farmFormData.villageLocality}
                              onChange={handleFarmFormChange}
                              placeholder="Enter village / locality"
                              maxLength={200}
                              className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all placeholder:text-white/10"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              name="district"
                              value={farmFormData.district}
                              onChange={handleFarmFormChange}
                              readOnly={isLocationAutoFilled}
                              placeholder="Select District"
                              className={`w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-green-500/50 ${isLocationAutoFilled ? 'opacity-60 cursor-not-allowed border-green-500/20' : ''}`}
                            />
                            <input
                              type="text"
                              name="state"
                              value={farmFormData.state}
                              onChange={handleFarmFormChange}
                              readOnly={isLocationAutoFilled}
                              placeholder="Select State"
                              className={`w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-green-500/50 ${isLocationAutoFilled ? 'opacity-60 cursor-not-allowed border-green-500/20' : ''}`}
                            />
                          </div>

                          {/* Pincode (Used for Weather & Auto-fill) */}
                          <div className="space-y-2 pt-2">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                              Pincode <span className="text-green-400 normal-case tracking-normal ml-1">(Used for Weather Widget)</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <MapPin className="w-4 h-4 text-green-400/50" />
                              </div>
                              <input
                                type="text"
                                name="pincode"
                                value={farmFormData.pincode}
                                onChange={handleFarmFormChange}
                                placeholder="Enter 6-digit Pincode"
                                maxLength={6}
                                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl pl-11 pr-11 py-3.5 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all placeholder:text-white/10"
                              />
                              {isPincodeLoading && (
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                  <div className="w-4 h-4 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Crop and Resources */}
                      <div className="space-y-6 bg-white/[0.02] border border-white/10 rounded-3xl p-6 lg:p-8">
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 mb-2">
                            <Sprout className="w-5 h-5 text-green-400" />
                            <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest">Crop Information</h3>
                          </div>

                          {/* Primary Crops */}
                          <SearchableMultiSelect
                            label="Primary Crops"
                            options={CROP_OPTIONS}
                            selectedValues={farmFormData.primaryCrops}
                            required={true}
                            onToggle={(val) => {
                              const updated = farmFormData.primaryCrops.includes(val)
                                ? farmFormData.primaryCrops.filter(v => v !== val)
                                : [...farmFormData.primaryCrops, val];
                              setFarmFormData(prev => ({ ...prev, primaryCrops: updated }));
                            }}
                            placeholder="Select primary crops"
                            icon={Sprout}
                          />

                          {/* Other Crops */}
                          <SearchableMultiSelect
                            label="Other Crops"
                            options={CROP_OPTIONS}
                            selectedValues={farmFormData.otherCrops}
                            onToggle={(val) => {
                              const updated = farmFormData.otherCrops.includes(val)
                                ? farmFormData.otherCrops.filter(v => v !== val)
                                : [...farmFormData.otherCrops, val];
                              setFarmFormData(prev => ({ ...prev, otherCrops: updated }));
                            }}
                            placeholder="Select other crops (optional)"
                            icon={Leaf}
                          />
                        </div>

                        <div className="space-y-6 pt-4 border-t border-white/5">
                          <div className="flex items-center gap-3 mb-2">
                            <Droplets className="w-5 h-5 text-green-400" />
                            <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest">Irrigation & Resources</h3>
                          </div>

                          {/* Irrigation Source */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Irrigation Source *</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Droplets className="w-4 h-4 text-green-400/50" />
                              </div>
                              <select
                                name="irrigationSource"
                                value={farmFormData.irrigationSource}
                                onChange={handleFarmFormChange}
                                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-green-500/50 transition-all appearance-none cursor-pointer [&>option]:bg-[#111827]"
                              >
                                <option value="" disabled>Select irrigation source</option>
                                <option value="Borewell">Borewell</option>
                                <option value="Canal">Canal</option>
                                <option value="River">River</option>
                                <option value="Rainfed">Rainfed</option>
                              </select>
                              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <ChevronRight className="w-4 h-4 text-white/20 rotate-90" />
                              </div>
                            </div>
                          </div>

                          {/* Water Availability */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Water Availability *</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Droplets className="w-4 h-4 text-green-400/50" />
                              </div>
                              <select
                                name="waterAvailability"
                                value={farmFormData.waterAvailability}
                                onChange={handleFarmFormChange}
                                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-green-500/50 transition-all appearance-none cursor-pointer [&>option]:bg-[#111827]"
                              >
                                <option value="" disabled>Select water availability</option>
                                <option value="Year-round">Year-round</option>
                                <option value="Seasonal">Seasonal</option>
                                <option value="Critical">Critical</option>
                              </select>
                              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <ChevronRight className="w-4 h-4 text-white/20 rotate-90" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Images and Notes */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Farm Images */}
                      <div className="space-y-4 bg-white/[0.02] border border-white/10 rounded-3xl p-6 lg:p-8">
                        <div className="flex items-center gap-3 mb-2">
                          <ImageIcon className="w-5 h-5 text-green-400" />
                          <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest">Farm Images</h3>
                        </div>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest">Upload photos of your farm (Max 5 images)</p>

                        <div className="flex flex-wrap gap-4 mt-4">
                          {/* Upload Trigger */}
                          {farmImages.length < 5 && (
                            <button
                              type="button"
                              onClick={() => farmImageInputRef.current?.click()}
                              className="w-32 h-32 bg-white/5 border border-white/10 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/10 hover:border-green-500/50 transition-all group"
                            >
                              <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <UploadCloud className="w-5 h-5 text-green-400" />
                              </div>
                              <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Click to upload</span>
                            </button>
                          )}
                          <input
                            type="file"
                            ref={farmImageInputRef}
                            onChange={handleFarmImageUpload}
                            multiple
                            accept="image/*"
                            className="hidden"
                          />

                          {/* Previews */}
                          {farmImages.map((img, index) => (
                            <div key={index} className="relative w-32 h-32 group">
                              <img
                                src={img.preview}
                                alt={`Farm ${index + 1}`}
                                className="w-full h-full object-cover rounded-2xl border border-white/10"
                              />
                              <button
                                type="button"
                                onClick={() => removeFarmImage(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg z-10"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              {img.isExisting && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl pointer-events-none">
                                  <span className="text-[8px] font-black text-white uppercase">Saved</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-[9px] text-white/20 italic">PNG, JPG up to 5MB each</p>
                      </div>

                      {/* Additional Notes */}
                      <div className="space-y-4 bg-white/[0.02] border border-white/10 rounded-3xl p-6 lg:p-8">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="w-5 h-5 text-green-400" />
                          <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest">Additional Notes <span className="text-white/20">(Optional)</span></h3>
                        </div>

                        <div className="relative">
                          <textarea
                            name="additionalNotes"
                            value={farmFormData.additionalNotes}
                            onChange={handleFarmFormChange}
                            placeholder="Any additional information about your farm..."
                            rows={6}
                            maxLength={1000}
                            className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl p-4 focus:outline-none focus:border-green-500/50 transition-all placeholder:text-white/10 resize-none"
                          />
                          <div className="absolute bottom-4 right-4 text-[10px] font-bold text-white/20">
                            {farmFormData.additionalNotes.length}/500
                          </div>
                        </div>
                      </div>
                    </div>

                    {farmError && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                        <p className="text-red-400 text-xs font-bold">{farmError}</p>
                      </div>
                    )}

                    <div className="flex flex-col items-center gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={isSavingFarm}
                        className="bg-green-600 hover:bg-green-500 text-white px-12 py-4 rounded-xl font-black uppercase tracking-widest flex items-center gap-3 transition-all transform active:scale-95 disabled:opacity-50 shadow-[0_10px_40px_rgba(34,197,94,0.2)]"
                      >
                        {isSavingFarm ? (
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Save Farm Details
                          </>
                        )}
                      </button>
                      <div className="flex items-center gap-2 text-white/20">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Your information is secure and encrypted.</span>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'Bank Details' && (
                <motion.div
                  key="bank"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8 max-w-3xl mx-auto"
                >
                  <div className="flex flex-col items-center text-center space-y-4 mb-8">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 mb-2">
                      <Building2 className="w-8 h-8 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider">Bank Details</h2>
                    <p className="text-sm text-white/60 font-medium">
                      Please provide your bank account information.<br />
                      This will be used for secure transactions and payouts.
                    </p>
                  </div>

                  <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 lg:p-8 shadow-2xl">
                    <form onSubmit={handleSaveBankDetails} className="space-y-6">

                      {/* Account Holder Name */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/80">Account Holder Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="w-4 h-4 text-green-400" />
                          </div>
                          <input
                            type="text"
                            name="accountHolderName"
                            value={bankFormData.accountHolderName}
                            onChange={handleBankFormChange}
                            placeholder="Enter account holder name"
                            maxLength={100}
                            className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-colors placeholder:text-white/20 font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Bank Account Number */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white/80">Bank Account Number</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <CreditCard className="w-4 h-4 text-green-400" />
                            </div>
                            <input
                              type="password"
                              name="accountNumber"
                              value={bankFormData.accountNumber}
                              onChange={handleBankFormChange}
                              placeholder="Enter account number"
                              maxLength={20}
                              className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-colors placeholder:text-white/20 font-medium"
                            />
                          </div>
                        </div>

                        {/* IFSC Code */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white/80">IFSC Code</label>
                          <div className="flex gap-3">
                            <div className="relative flex-1">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <ShieldCheck className="w-4 h-4 text-green-400" />
                              </div>
                              <input
                                type="text"
                                name="ifscCode"
                                value={bankFormData.ifscCode}
                                onChange={handleBankFormChange}
                                placeholder="Enter IFSC code"
                                maxLength={11}
                                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-colors placeholder:text-white/20 font-medium uppercase"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleVerifyIFSC}
                              disabled={ifscLoading}
                              className="px-5 py-3 bg-transparent border border-green-500 text-green-400 text-sm font-bold rounded-lg hover:bg-green-500/10 transition-colors focus:outline-none disabled:opacity-50 flex items-center justify-center min-w-[80px]"
                            >
                              {ifscLoading ? <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" /> : 'Verify'}
                            </button>
                          </div>
                          <p className="text-[10px] text-white/40 mt-1">Enter IFSC code to auto-fetch branch name</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Bank Name */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white/80">Bank Name</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Building2 className="w-4 h-4 text-green-400" />
                            </div>
                            <select
                              name="bankName"
                              value={bankFormData.bankName}
                              onChange={handleBankFormChange}
                              className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all appearance-none cursor-pointer font-medium [&>option]:bg-[#111827]"
                            >
                              <option value="" disabled>Select bank name</option>
                              <option value="State Bank of India">State Bank of India</option>
                              <option value="HDFC Bank">HDFC Bank</option>
                              <option value="ICICI Bank">ICICI Bank</option>
                              <option value="Punjab National Bank">Punjab National Bank</option>
                              <option value="Axis Bank">Axis Bank</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                              <ChevronRight className="w-4 h-4 text-white/40 rotate-90" />
                            </div>
                          </div>
                        </div>

                        {/* Account Type */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white/80">Account Type</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <List className="w-4 h-4 text-green-400" />
                            </div>
                            <select
                              name="accountType"
                              value={bankFormData.accountType}
                              onChange={handleBankFormChange}
                              className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all appearance-none cursor-pointer font-medium [&>option]:bg-[#111827]"
                            >
                              <option value="" disabled>Select account type</option>
                              <option value="Savings">Savings Account</option>
                              <option value="Current">Current Account</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                              <ChevronRight className="w-4 h-4 text-white/40 rotate-90" />
                            </div>
                          </div>
                          <p className="text-[10px] text-white/40 mt-1">Savings / Current</p>
                        </div>
                      </div>

                      {/* Branch Name */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/80">Branch Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MapPin className="w-4 h-4 text-green-400" />
                          </div>
                          <input
                            type="text"
                            name="branchName"
                            value={bankFormData.branchName}
                            readOnly
                            placeholder="Branch name will appear here"
                            className="w-full bg-white/5 border border-white/10 text-white/60 text-sm rounded-lg pl-11 pr-4 py-3 focus:outline-none placeholder:text-white/20 font-medium cursor-not-allowed"
                          />
                        </div>
                        <p className="text-[10px] text-white/40 mt-1">Auto-fetched based on IFSC code</p>
                      </div>

                      {bankError && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                          <p className="text-red-400 text-xs font-bold">{bankError}</p>
                        </div>
                      )}

                      {/* Save Button */}
                      <div className="pt-4 flex justify-center">
                        <button
                          type="submit"
                          disabled={isSavingBank}
                          className="bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors focus:outline-none shadow-lg shadow-green-500/20 disabled:opacity-50"
                        >
                          {isSavingBank ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Save Bank Details</>}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Footer Note */}
                  <div className="flex items-center justify-center gap-3 text-center mt-6">
                    <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <p className="text-[11px] text-white/60 font-medium">
                      Your bank information is secure and encrypted.<br className="hidden sm:block" />
                      We do not share your details with any third party.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'Verification' && (
                <motion.div
                  key="verification"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12 py-10"
                >
                  <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-10">
                    {/* Header */}
                    <div className="space-y-4">
                      <div className="w-24 h-24 bg-green-500/10 rounded-[2rem] flex items-center justify-center border border-green-500/20 mx-auto shadow-2xl shadow-green-500/10">
                        <ShieldCheck className="w-12 h-12 text-green-400" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-4xl font-black text-white tracking-tighter">Profile Verification</h3>
                        <p className="text-sm text-white/40 font-medium max-w-md mx-auto">
                          Get the Verified Farmer badge and build trust with your buyers by requesting a formal profile review.
                        </p>
                      </div>
                    </div>

                    {/* Progress Card */}
                    <div className="w-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      
                      <div className="relative z-10 flex flex-col items-center gap-8">
                        <div className="relative transition-transform duration-700 hover:scale-105">
                          <CircularProgress percentage={currentUser?.profileCompletion || 0} size={140} strokeWidth={12} />
                          <div className="absolute inset-0 bg-green-500/5 blur-3xl rounded-full -z-10 animate-pulse" />
                        </div>

                        <div className="space-y-3 text-center">
                          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/10">Profile Score</p>
                          <h4 className="text-3xl font-black text-white tracking-tight">
                            {currentUser?.profileCompletion >= 75 ? 'Verification Ready' : 'Incomplete Profile'}
                          </h4>
                        </div>


                        {/* Status Badges */}
                        <div className="flex flex-wrap justify-center gap-4 py-4">
                          {[
                            { label: 'Not Eligible', active: (currentUser?.profileCompletion || 0) < 75 && currentUser?.verification?.verificationStatus !== 'Verification Requested' && !currentUser?.isVerified },
                            { label: 'Ready for Verification', active: (currentUser?.profileCompletion || 0) >= 75 && currentUser?.verification?.verificationStatus === 'Ready for Verification' },
                            { label: 'Verification Requested', active: currentUser?.verification?.verificationStatus === 'Verification Requested' },
                            { label: 'Verified', active: currentUser?.isVerified || currentUser?.verification?.verificationStatus === 'Verified' }
                          ].map((status, idx) => (
                            <div 
                              key={idx}
                              className={`
                                px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-500
                                ${status.active 
                                  ? 'bg-green-500/20 border-green-500/30 text-green-400 shadow-lg shadow-green-500/10' 
                                  : 'bg-white/5 border-white/5 text-white/10'}
                              `}
                            >
                              {status.label}
                            </div>
                          ))}
                        </div>

                        {/* Action Button Section */}
                        <div className="w-full max-w-sm pt-4">
                          {currentUser?.profileCompletion < 75 ? (
                            <div className="space-y-6">
                              <button
                                disabled
                                className="w-full py-5 rounded-2xl bg-white/5 border border-white/5 text-white/20 text-xs font-black uppercase tracking-[0.2em] cursor-not-allowed"
                              >
                                Request Verification
                              </button>
                              <p className="text-[11px] text-amber-400/60 font-bold uppercase tracking-widest bg-amber-400/5 py-3 px-6 rounded-xl border border-amber-400/10">
                                Complete at least 75% of your profile to request verification.
                              </p>
                            </div>
                          ) : (
                            <button
                              onClick={handleRequestVerification}
                              disabled={verificationLoading || currentUser?.verification?.verificationStatus === 'Verification Requested' || currentUser?.isVerified}
                              className={`
                                w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 transform active:scale-95
                                ${currentUser?.verification?.verificationStatus === 'Verification Requested' || currentUser?.isVerified
                                  ? 'bg-green-500/10 border border-green-500/20 text-green-400 cursor-default'
                                  : 'bg-green-500 hover:bg-green-400 text-black shadow-[0_20px_50px_rgba(34,197,94,0.3)] hover:shadow-[0_25px_60px_rgba(34,197,94,0.4)]'}
                                disabled:opacity-50
                              `}
                            >
                              {verificationLoading ? (
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto" />
                              ) : (
                                currentUser?.isVerified ? 'Verified' : 
                                currentUser?.verification?.verificationStatus === 'Verification Requested' ? 'Verification Requested' : 
                                'Request Verification'
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Trust Footer */}
                    <div className="flex items-center gap-6 text-white/20">
                      <div className="h-px w-20 bg-white/5" />
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Manual Security Audit</span>
                      </div>
                      <div className="h-px w-20 bg-white/5" />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab !== 'Personal Information' && activeTab !== 'Verification' && activeTab !== 'Bank Details' && activeTab !== 'Farm Details' && (
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


