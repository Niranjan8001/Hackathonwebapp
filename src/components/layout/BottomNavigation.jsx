import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, PlusCircle, ClipboardList, Wallet } from 'lucide-react';

export const BottomNavigation = () => {
  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: ClipboardList, label: 'Orders', path: '/orders' },
    { icon: PlusCircle, label: 'Add', path: '/add-product' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: Wallet, label: 'Earnings', path: '/earnings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-20">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-green-600' : 'text-slate-400 hover:text-green-500'
              }`
            }
          >
            <item.icon className={`w-6 h-6 ${item.label === 'Add' ? 'w-8 h-8 text-green-500 mb-1' : ''}`} />
            {item.label !== 'Add' && <span className="text-[10px] font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
