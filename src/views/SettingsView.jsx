import React from 'react';
import { DesktopLayout } from '../components/layout/DesktopLayout';
import { Settings, User, Bell, Shield, CreditCard, HelpCircle, LogOut } from 'lucide-react';
import { useFarmerContext } from '../context/FarmerContext';
import { useNavigate } from 'react-router-dom';

const SettingsSection = ({ icon: Icon, title, description, children }) => (
  <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl overflow-hidden mb-6">
    <div className="p-6 border-b border-slate-100 dark:border-[#334155] flex items-center gap-3">
      <div className="p-2 bg-slate-50 dark:bg-[#0F172A] rounded-lg text-slate-600 dark:text-[#94A3B8]">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-bold text-slate-800 dark:text-[#F8FAFC]">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-[#94A3B8]">{description}</p>
      </div>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const SettingItem = ({ label, control }) => (
  <div className="flex items-center justify-between py-3 last:pb-0 first:pt-0">
    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
    {control}
  </div>
);

const Toggle = ({ enabled }) => (
  <button className={`w-10 h-5 rounded-full relative transition-colors ${enabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
    <span className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${enabled ? 'right-1' : 'left-1'}`} />
  </button>
);

export const SettingsView = () => {
  const { currentUser, logout } = useFarmerContext();
  const navigate = useNavigate();

  return (
    <DesktopLayout>
      <div className="px-4 md:px-8 py-8 max-w-4xl">
        <div className="mb-8" />

        <SettingsSection 
          icon={User} 
          title="Account Information" 
          description="Update your personal details and farm identity."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-[#94A3B8] uppercase mb-1.5">Full Name</label>
              <input type="text" defaultValue={currentUser?.name || ''} className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-[#94A3B8] uppercase mb-1.5">Email Address</label>
              <input type="email" defaultValue={currentUser?.email || ''} className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-[#94A3B8] uppercase mb-1.5">Phone Number</label>
              <input type="text" defaultValue={currentUser?.phone || ''} className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-[#94A3B8] uppercase mb-1.5">Farm Location</label>
              <input type="text" defaultValue={currentUser?.locationText || ''} className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-500" />
            </div>
          </div>
          <button className="mt-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
            Save Changes
          </button>
        </SettingsSection>

        <SettingsSection 
          icon={Bell} 
          title="Notifications" 
          description="Control how you receive updates and alerts."
        >
          <div className="space-y-1">
            <SettingItem label="Email Notifications" control={<Toggle enabled={true} />} />
            <SettingItem label="SMS Alerts for New Orders" control={<Toggle enabled={true} />} />
            <SettingItem label="Push Notifications" control={<Toggle enabled={false} />} />
            <SettingItem label="Weekly Earnings Summary" control={<Toggle enabled={true} />} />
          </div>
        </SettingsSection>

        <SettingsSection 
          icon={Shield} 
          title="Security" 
          description="Protect your account and data."
        >
          <div className="space-y-4">
            <button className="text-sm font-medium text-green-600 dark:text-green-400 hover:underline flex items-center gap-2">
              Change Password
            </button>
            <button className="text-sm font-medium text-green-600 dark:text-green-400 hover:underline flex items-center gap-2">
              Two-Factor Authentication
            </button>
          </div>
        </SettingsSection>

        <div className="flex items-center gap-4 pt-4">
          <button 
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </DesktopLayout>
  );
};
