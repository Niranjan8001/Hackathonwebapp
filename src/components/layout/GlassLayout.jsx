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
  Leaf
} from 'lucide-react';
import { useFarmerContext } from '../../context/FarmerContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const GlassLayout = ({ children }) => {
  const { currentUser } = useFarmerContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden font-sans text-white/90">
      
      {/* 🎬 CINEMATIC VIDEO BACKGROUND */}
      <div className="fixed inset-0 z-0">
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
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 flex h-screen overflow-hidden">
        
        {/* 🌿 GLASS SIDEBAR (Desktop) */}
        <div className="hidden lg:block h-full py-5 pl-5 pr-2.5 shrink-0">
          <GlassSidebar />
        </div>

        {/* 🚀 MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* TOPBAR */}
          <header className="h-16 lg:h-20 flex items-center justify-between px-4 lg:px-10 shrink-0">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 bg-white/5 rounded-xl border border-white/10"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {location.pathname === '/dashboard' ? (
                <div className="min-w-0">
                  <h2 className="text-sm lg:text-2xl font-bold tracking-tight truncate">
                    Welcome back, <span className="text-green-400">{currentUser?.displayName?.split(' ')[0] || 'Farmer'}!</span> 👋
                  </h2>
                  <p className="hidden lg:block text-[10px] lg:text-xs text-white/40 font-bold uppercase tracking-widest">Here's what's happening on your farm today.</p>
                </div>
              ) : (
                <div className="min-w-0">
                  <h2 className="text-sm lg:text-2xl font-bold tracking-tight text-white truncate">
                    {location.pathname === '/inventory' && 'My Products'}
                    {location.pathname === '/orders' && 'Orders'}
                    {location.pathname === '/earnings' && 'Earnings'}
                    {location.pathname === '/reviews' && 'Reviews'}
                    {location.pathname === '/profile' && 'Farm Profile'}
                    {location.pathname === '/settings' && 'Settings'}
                    {location.pathname === '/need-help' && 'Need Help?'}
                    {location.pathname === '/add-product' && 'Add Product'}
                    {location.pathname.startsWith('/orders/') && 'Order Details'}
                  </h2>
                  <p className="hidden lg:block text-[10px] lg:text-xs text-white/40 font-bold uppercase tracking-widest">
                    {location.pathname === '/inventory' && 'Manage your farm inventory'}
                    {location.pathname === '/orders' && 'Track and manage your orders'}
                    {location.pathname === '/earnings' && 'View your revenue and payouts'}
                    {location.pathname === '/reviews' && 'See what customers are saying'}
                    {location.pathname === '/profile' && 'Manage your personal profile'}
                    {location.pathname === '/settings' && 'Update your preferences'}
                    {location.pathname === '/need-help' && 'Contact our support team'}
                    {location.pathname === '/add-product' && 'List a new product'}
                    {location.pathname.startsWith('/orders/') && 'View detailed order information'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              <button className="relative p-2 lg:p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group">
                <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-white/60 group-hover:text-white" />
                <span className="absolute top-2 lg:top-2.5 right-2 lg:right-2.5 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full border-2 border-black"></span>
              </button>

              <div className="flex items-center gap-2 lg:gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl lg:rounded-2xl p-1 lg:p-1.5 lg:pr-4 transition-all cursor-pointer group">
                <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl overflow-hidden border border-white/10">
                  <img src={currentUser?.photoURL || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"} alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-white group-hover:text-green-400 transition-colors">{currentUser?.displayName || 'Farmer'}</p>
                  <p className="text-[10px] font-medium text-white/40">Farmer</p>
                </div>
                <ChevronDown className="w-4 h-4 text-white/20 hidden lg:block" />
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1 overflow-y-auto custom-scrollbar px-4 lg:px-10 pb-6">
            {children}
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
    <div className="w-64 h-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
      {/* Brand Logo */}
      <div className="p-8 pb-10 flex items-center gap-4">
        <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.1)]">
          <Leaf className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <h1 className="font-bold text-xl leading-tight">FarmDirect</h1>
          <p className="text-[10px] text-green-500/60 font-black uppercase tracking-[0.2em] mt-0.5">Agriculture Portal</p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button 
              key={item.label}
              onClick={() => handleNav(item.path)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                isActive 
                ? 'bg-green-600 text-white shadow-xl shadow-green-600/20' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white transition-colors'}`} />
              <span className="text-sm font-bold tracking-wide">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 mt-auto space-y-3">
        {/* Help Card */}
        <button 
          onClick={() => handleNav('/need-help')}
          className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] p-4 flex items-center gap-4 hover:bg-white/5 transition-all text-left"
        >
          <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400">
             <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Need Help?</h3>
            <p className="text-[10px] text-white/40 font-medium">Contact Support</p>
          </div>
        </button>

        {/* Logout */}
        <button 
          onClick={() => { logout(); navigate('/'); }}
          className="w-full bg-red-500/5 border border-red-500/10 rounded-[1.5rem] p-4 flex items-center gap-4 hover:bg-red-500/10 transition-all text-left group"
        >
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
             <LogOut className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-red-400">Logout</span>
        </button>
      </div>
    </div>
  );
};
