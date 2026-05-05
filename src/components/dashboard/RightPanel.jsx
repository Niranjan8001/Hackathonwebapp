import React from 'react';
import { ChevronDown, MapPin, CheckCircle, PlusCircle, ClipboardList, DollarSign, User } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const ProfileCard = () => (
  <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl overflow-hidden shadow-sm">
    <div className="h-24 sm-mobile:h-32 overflow-hidden relative">
      <img 
        src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=800&h=300" 
        alt="Farm Cover" 
        className="w-full h-full object-cover"
      />
    </div>
    <div className="px-5 pb-5">
      <div className="relative flex justify-between items-start">
        <div className="w-16 h-16 sm-mobile:w-20 sm-mobile:h-20 rounded-full border-4 border-white dark:border-[#1E293B] overflow-hidden -mt-10 relative z-10 bg-slate-100 shadow-md">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150" 
            alt="Ramesh Yadav" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <div className="mt-3">
        <h3 className="text-xl font-bold text-slate-800 dark:text-[#F8FAFC]">Ramesh Yadav</h3>
        <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-[#94A3B8] mt-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>Jaipur, Rajasthan</span>
        </div>
        
        <div className="mt-4 inline-flex items-center gap-1.5 bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-green-100 dark:border-green-500/20">
          <CheckCircle className="w-3.5 h-3.5" />
          <span className="uppercase tracking-wider">Verified Farmer</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-slate-100 dark:border-[#334155] text-center">
        <div>
          <p className="font-bold text-slate-800 dark:text-[#F8FAFC] flex items-center justify-center gap-1">
            4.8 <span className="text-amber-400 text-sm">★</span>
          </p>
          <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#94A3B8] mt-1">Rating</p>
        </div>
        <div>
          <p className="font-bold text-slate-800 dark:text-[#F8FAFC]">245</p>
          <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#94A3B8] mt-1">Orders</p>
        </div>
        <div>
          <p className="font-bold text-slate-800 dark:text-[#F8FAFC]">1.2K</p>
          <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#94A3B8] mt-1">Followers</p>
        </div>
      </div>
    </div>
  </div>
);

const QuickActionItem = ({ icon: Icon, title, description, onClick }) => (
  <button onClick={onClick} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-all w-full text-left group">
    <div className="bg-green-50 dark:bg-green-500/10 p-3 rounded-xl text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform shadow-sm">
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <p className="font-bold text-sm text-slate-800 dark:text-[#F8FAFC]">{title}</p>
      <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5 line-clamp-1">{description}</p>
    </div>
  </button>
);

const QuickActions = () => {
  const navigate = useNavigate();
  const actions = [
    { icon: PlusCircle, title: 'Add Product', description: 'List a new product', path: '/add-product' },
    { icon: ClipboardList, title: 'Orders', description: 'View and process orders', path: '/orders' },
    { icon: DollarSign, title: 'Earnings', description: 'Check your earnings', path: '/earnings' },
    { icon: User, title: 'Profile', description: 'Update your farm details', path: '/profile' },
  ];

  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl p-5 shadow-sm">
      <h3 className="font-bold text-slate-800 dark:text-[#F8FAFC] mb-4 uppercase text-xs tracking-widest text-slate-400">Quick Actions</h3>
      <div className="grid grid-cols-1 sm-mobile:grid-cols-2 tablet:grid-cols-1 laptop:grid-cols-1 gap-1">
        {actions.map((a) => (
          <QuickActionItem key={a.path} icon={a.icon} title={a.title} description={a.description} onClick={() => navigate(a.path)} />
        ))}
      </div>
    </div>
  );
};

export const RightPanel = () => {
  return (
    <div className="w-full flex flex-col gap-6 tablet:mt-0">
      <ProfileCard />
      <QuickActions />
    </div>
  );
};
