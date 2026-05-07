import React, { useState, useEffect } from 'react';
import { Sidebar } from '../dashboard/Sidebar';
import { Bell, Sun, Moon, Search, Menu, Home, ClipboardList, PlusCircle, Package, DollarSign } from 'lucide-react';
import { useFarmerContext } from '../../context/FarmerContext';
import { NavLink } from 'react-router-dom';

/* ── Mobile Bottom Nav (≤420px only) ─────────────────────────── */
const MobileBottomNav = () => {
  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: ClipboardList, label: 'Orders', path: '/orders' },
    { icon: PlusCircle, label: 'Add', path: '/add-product', isCenter: true },
    { icon: Package, label: 'Products', path: '/inventory' },
    { icon: DollarSign, label: 'Earnings', path: '/earnings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-[#334155] z-50 hidden max-xs:block safe-area-bottom">
      <div className="flex justify-around items-center h-14">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full transition-colors ${
                item.isCenter
                  ? 'text-green-500'
                  : isActive
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-slate-400 dark:text-slate-500'
              }`
            }
          >
            <item.icon className={`${item.isCenter ? 'w-7 h-7' : 'w-5 h-5'}`} />
            {!item.isCenter && <span className="text-[9px] font-medium mt-0.5">{item.label}</span>}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export const DesktopLayout = ({ children }) => {
  const { isDark, toggleTheme, currentUser } = useFarmerContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      // Tablet range: 769px to 1024px -> Collapsed Sidebar
      if (width >= 769 && width <= 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
      
      if (width > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const mainMargin = windowWidth > 768 ? (isCollapsed ? 'ml-20' : 'ml-64') : 'ml-0';

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] transition-all duration-300 font-sans text-slate-900 dark:text-[#F8FAFC]">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} isCollapsed={isCollapsed} />
      
      <div className={`${mainMargin} flex flex-col min-h-screen transition-all duration-300`}>
        {/* Global Topbar */}
        <header className="h-16 tablet:h-20 flex-shrink-0 px-4 tablet:px-8 flex items-center justify-between border-b border-slate-200 dark:border-[#334155] sticky top-0 bg-[#F8FAFC]/80 dark:bg-[#020617]/80 backdrop-blur-md z-40">
          
          {/* Mobile Menu Toggle */}
          <button 
            className="tablet:hidden p-2 -ml-2 mr-2 rounded-lg text-slate-600 dark:text-[#94A3B8] hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search Bar - Responsive */}
          <div className="flex-1 max-w-xl mx-4 hidden sm-mobile:block">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
            </div>
          </div>

          <div className="flex items-center gap-2 tablet:gap-4 ml-auto">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full border border-slate-200 dark:border-[#334155] text-slate-600 dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E293B] transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-slate-600 dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E293B] rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full border-2 border-[#F8FAFC] dark:border-[#020617]"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-[#334155]">
              <div className="w-8 h-8 tablet:w-10 tablet:h-10 rounded-full border-2 border-slate-100 dark:border-[#1E293B] overflow-hidden shrink-0 bg-green-500/10 flex items-center justify-center">
                {currentUser?.profilePhoto ? (
                  <img 
                    src={`${currentUser.profilePhoto}${currentUser.profilePhoto.includes('?') ? '&' : '?'}t=${Date.now()}`} 
                    alt={currentUser?.name || "User"} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Home className="w-4 h-4 text-green-500/40" />
                )}
              </div>
              <div className="hidden desktop:block">
                <p className="text-sm font-bold text-slate-800 dark:text-[#F8FAFC]">
                  {currentUser?.name || "Loading..."}
                </p>
                <p className="text-xs text-slate-500 dark:text-[#94A3B8] capitalize">{currentUser?.role || "Farmer"}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Fluid Content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="fluid-container py-6 tablet:py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (Only for phones) */}
      <div className="sm-mobile:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
};
