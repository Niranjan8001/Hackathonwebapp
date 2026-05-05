import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  DollarSign, 
  Star, 
  User, 
  Settings,
  HeadphonesIcon,
  X,
  LogOut
} from 'lucide-react';
import { useFarmerContext } from '../../context/FarmerContext';

import { useNavigate, useLocation } from 'react-router-dom';

const NavItem = ({ icon: Icon, label, active, onClick, isCollapsed }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 font-medium' 
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-[#1E293B]'
    } ${isCollapsed ? 'justify-center px-0' : ''}`}
    title={isCollapsed ? label : ''}
  >
    <Icon className={`w-5 h-5 shrink-0 transition-transform ${!active && 'group-hover:scale-110'}`} />
    {!isCollapsed && <span className="truncate">{label}</span>}
  </button>
);

export const Sidebar = ({ isOpen, onClose, isCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useFarmerContext();

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';

  return (
    <>
      {/* Mobile Overlay (Drawer mode) */}
      <div 
        className={`fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm tablet:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside className={`fixed left-0 top-0 h-screen ${sidebarWidth} border-r border-slate-200 dark:border-[#334155] bg-white dark:bg-[#020617] flex flex-col pt-6 pb-4 z-[70] transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full tablet:translate-x-0'
      }`}>
        {/* Logo and Close */}
        <div className={`px-6 flex items-center mb-8 ${isCollapsed ? 'justify-center px-0' : 'justify-between'}`}>
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => navigate('/dashboard')}
          >
            <div className="bg-green-500 rounded-lg p-1.5 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22S4 14 4 8a8 8 0 1116 0c0 6-8 14-8 14zm0-11a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            </div>
            {!isCollapsed && (
              <div className="transition-opacity duration-300">
                <h1 className="font-bold text-xl text-slate-800 dark:text-[#F8FAFC] leading-none">FarmDirect</h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mt-0.5 whitespace-nowrap">From Farm. To You.</p>
              </div>
            )}
          </div>
          
          {isOpen && (
            <button 
              className="tablet:hidden p-1.5 -mr-2 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1E293B]"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Nav Links */}
      <nav className={`flex-1 px-4 space-y-1 ${isCollapsed ? 'px-2' : ''}`}>
        <NavItem icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/dashboard'} onClick={() => navigate('/dashboard')} isCollapsed={isCollapsed} />
        <NavItem icon={Package} label="My Products" active={location.pathname === '/inventory'} onClick={() => navigate('/inventory')} isCollapsed={isCollapsed} />
        <NavItem icon={ClipboardList} label="Orders" active={location.pathname.startsWith('/orders')} onClick={() => navigate('/orders')} isCollapsed={isCollapsed} />
        <NavItem icon={DollarSign} label="Earnings" active={location.pathname === '/earnings'} onClick={() => navigate('/earnings')} isCollapsed={isCollapsed} />

        <NavItem icon={Star} label="Reviews" active={location.pathname === '/reviews'} onClick={() => navigate('/reviews')} isCollapsed={isCollapsed} />
        <NavItem icon={User} label="Farm Profile" active={location.pathname === '/profile'} onClick={() => navigate('/profile')} isCollapsed={isCollapsed} />
        <NavItem icon={Settings} label="Settings" active={location.pathname === '/settings'} onClick={() => navigate('/settings')} isCollapsed={isCollapsed} />
      </nav>

      {/* Need Help & Logout */}
      <div className={`px-4 mt-auto space-y-2 ${isCollapsed ? 'px-2' : ''}`}>
        <button
          onClick={() => navigate('/need-help')}
          className={`w-full rounded-2xl p-4 flex items-center gap-3 transition-all cursor-pointer group ${
            location.pathname === '/need-help'
              ? 'bg-green-100 dark:bg-green-500/15 ring-1 ring-green-400/30'
              : 'bg-green-50 dark:bg-[#0F172A] hover:bg-green-100 dark:hover:bg-green-500/10'
          } ${isCollapsed ? 'p-2 justify-center rounded-xl' : ''}`}
          title={isCollapsed ? "Need Help?" : ""}
        >
          <div className="bg-white dark:bg-[#1E293B] p-2 rounded-full shadow-sm text-green-600 dark:text-green-400 shrink-0 group-hover:rotate-12 transition-transform">
            <HeadphonesIcon className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="text-left overflow-hidden transition-opacity">
              <p className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC] whitespace-nowrap">Need Help?</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Contact Support</p>
            </div>
          )}
        </button>

        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className={`w-full rounded-2xl p-4 flex items-center gap-3 transition-all cursor-pointer group bg-red-50 dark:bg-red-500/5 hover:bg-red-100 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 ${isCollapsed ? 'p-2 justify-center rounded-xl' : ''}`}
          title={isCollapsed ? "Logout" : ""}
        >
          <div className="bg-white dark:bg-[#1E293B] p-2 rounded-full shadow-sm shrink-0 group-hover:scale-110 transition-transform">
            <LogOut className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <span className="text-sm font-bold whitespace-nowrap">Logout</span>
          )}
        </button>
      </div>
    </aside>
    </>
  );
};
