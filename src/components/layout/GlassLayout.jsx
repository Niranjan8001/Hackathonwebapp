import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Menu, 
  ChevronDown,
  LayoutDashboard,
  Package,
  ClipboardList,
  DollarSign,
  Star,
  User,
  Settings,
  Headphones,
  LogOut,
  Leaf,
  Search
} from 'lucide-react';
import { useFarmerContext } from '../../context/FarmerContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const GlassLayout = ({ children }) => {
  const { currentUser } = useFarmerContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  return (
    <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden font-sans text-white/90">
      
      {/* 🎬 CINEMATIC VIDEO BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-40 scale-105"
        >
          <source src="/farm-bg.webm" type="video/webm" />
          <img src="/farm-poster.jpg" alt="Farm background" className="w-full h-full object-cover" />
        </video>
        {/* Deep gradient overlay for that premium feel */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 flex h-screen overflow-hidden">
        
        {/* 🌿 GLASS SIDEBAR (Desktop) */}
        <div className="hidden lg:block h-full py-6 pl-6 pr-3 shrink-0">
          <GlassSidebar />
        </div>

        {/* 🚀 MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* TOPBAR */}
          <header className="h-20 flex items-center justify-between px-10 shrink-0">
            <div className="flex items-center gap-6">
              <button 
                className="lg:hidden p-2 bg-white/5 rounded-xl border border-white/10"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="flex-1" />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 border-r border-white/5 pr-6">
                <button className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group">
                   <Bell className="w-5 h-5 text-white/40 group-hover:text-white" />
                </button>
              </div>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-1.5 pr-4 hover:bg-white/10 transition-all cursor-pointer group">
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 bg-green-500/10 flex items-center justify-center">
                  {currentUser?.profilePhoto ? (
                    <img 
                      src={`${currentUser.profilePhoto}${currentUser.profilePhoto.includes('?') ? '&' : '?'}t=${Date.now()}`} 
                      alt="User" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User className="w-5 h-5 text-green-400/40" />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white group-hover:text-green-400 transition-colors">
                    {currentUser?.name || 'Loading...'}
                  </p>
                  <p className="text-[10px] font-medium text-white/40 capitalize">{currentUser?.role || 'Farmer'}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-white/20" />
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1 overflow-y-auto custom-scrollbar px-10 pb-10">
             <div className="max-w-[1600px] mx-auto">
               {children}
             </div>
          </main>
        </div>
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            className="relative w-72 h-full py-5 px-4"
          >
            <GlassSidebar isMobile onClose={() => setIsMobileMenuOpen(false)} />
          </motion.div>
        </div>
      )}
    </div>
  );
};

const GlassSidebar = ({ isMobile, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useFarmerContext();
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Package, label: 'My Products', path: '/inventory' },
    { icon: ClipboardList, label: 'Orders', path: '/orders' },
    { icon: DollarSign, label: 'Earnings', path: '/earnings' },
    { icon: Star, label: 'Reviews', path: '/reviews' },
    { icon: User, label: 'Farm Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleNav = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  return (
    <div className="w-64 h-full bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
      {/* Brand Logo */}
      <div className="p-8 pb-10 flex items-center gap-4">
        <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-black text-xl leading-tight tracking-tight">FarmDirect</h1>
          <p className="text-[9px] text-green-500 font-black uppercase tracking-[0.2em] mt-1">From farm. To you.</p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button 
              key={item.label}
              onClick={() => handleNav(item.path)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative ${
                isActive 
                ? 'bg-green-500/10 text-green-400' 
                : 'text-white/30 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              {isActive && <div className="absolute left-0 w-1 h-6 bg-green-500 rounded-r-full shadow-[0_0_15px_rgba(34,197,94,0.8)]" />}
              <item.icon className={`w-5 h-5 ${isActive ? 'text-green-400' : 'text-white/20 group-hover:text-white/40 transition-colors'}`} />
              <span className="text-sm font-bold tracking-wide">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-6 mt-auto space-y-4">
        {/* Help Card */}
        <div 
          onClick={() => handleNav('/need-help')}
          className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-5 relative overflow-hidden group cursor-pointer hover:bg-white/5 transition-all"
        >
          <div className="relative z-10">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400 mb-3">
               <Headphones className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Need Help?</h3>
            <p className="text-[10px] text-white/40 font-medium mt-1">Contact Support</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-green-500/10 blur-2xl rounded-full" />
        </div>

        {/* Logout */}
        <button 
          onClick={() => { logout(); navigate('/'); }}
          className="w-full bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-[1.5rem] p-4 flex items-center gap-4 transition-all group"
        >
          <div className="w-10 h-10 bg-white/5 group-hover:bg-red-500/20 rounded-xl flex items-center justify-center text-white/20 group-hover:text-red-400 transition-all">
             <LogOut className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-white/40 group-hover:text-red-400 transition-colors">Logout</span>
        </button>
      </div>
    </div>
  );
};
