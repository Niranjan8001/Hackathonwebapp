import React from 'react';
import { GlassLayout } from '../components/layout/GlassLayout';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Sprout, 
  Map, 
  Wallet,
  Clock,
  CloudSun,
  Droplets,
  Wind,
  CloudRain
} from 'lucide-react';

import { useFarmerContext } from '../context/FarmerContext';

import { WeatherWidget } from '../components/dashboard/WeatherWidget';

export const DashboardView = () => {
  const { products = [], orders = [], totalEarnings = 0, earningsPercentageChange } = useFarmerContext();
  
  // Calculate some derived stats
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const activeProducts = products.filter(p => p.status === 'Active' || p.stock > 0).length;

  return (
    <GlassLayout>
      <div className="h-full flex flex-col gap-3 lg:gap-6 overflow-y-auto lg:overflow-hidden custom-scrollbar pb-20 lg:pb-0">
        
        {/* 📊 TOP STAT CARDS - Optimized for Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 shrink-0">
          <StatCard 
            icon={<Wallet />} 
            label="Earnings" 
            value={`₹${totalEarnings.toLocaleString('en-IN')}`} 
            trend={earningsPercentageChange !== null ? `${earningsPercentageChange > 0 ? '+' : ''}${earningsPercentageChange}%` : "Insufficient Data"} 
            trendUp={earningsPercentageChange === null || earningsPercentageChange >= 0} 
          />
          <StatCard 
            icon={<Clock />} 
            label="Orders" 
            value={orders.length.toString()} 
            trend={orders.length > 0 ? `${pendingOrders} pending` : "No orders"} 
            trendUp={orders.length > 0 && pendingOrders === 0} 
          />
          <StatCard 
            icon={<Sprout />} 
            label="Crops" 
            value={products.length.toString()} 
            trend={products.length > 0 ? `${activeProducts} active` : "No crops"} 
            trendUp={products.length > 0} 
          />
          <StatCard 
            icon={<Map />} 
            label="Farm Area" 
            value="12.5" 
            unit="ac"
            trend="Irrigated" 
            trendUp={true} 
          />
        </div>

        {/* 📈 MIDDLE ROW */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 lg:gap-6 min-h-0 flex-none lg:flex-1">
          {/* Earnings Overview */}
          <div className="xl:col-span-6 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl lg:rounded-[1.5rem] p-4 lg:p-6 shadow-xl flex flex-col min-h-[220px] lg:min-h-0">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-xs lg:text-lg font-bold uppercase tracking-wider text-white/60">Earnings Overview</h3>
              <select className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[9px] font-bold focus:outline-none">
                <option className="bg-[#1E293B]">This Month</option>
              </select>
            </div>
            
            <div className="relative flex-1 flex items-end justify-between px-1 pb-6 group min-h-[60px]">
              <div className="absolute inset-x-0 bottom-6 h-[1px] bg-white/5" />
              {totalEarnings > 0 ? [30, 45, 35, 60, 50, 80, 70].map((h, i) => (
                <div key={i} className="relative w-5 lg:w-8 bg-green-500/20 rounded-t-md lg:rounded-t-lg transition-all hover:bg-green-500/40 cursor-pointer" style={{ height: `${h}%` }}>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-green-500 text-[8px] font-bold px-1.5 py-0.5 rounded">
                    ₹{h * 600}
                  </div>
                </div>
              )) : (
                <div className="w-full flex items-center justify-center pb-4 text-white/30 text-xs font-bold uppercase tracking-widest">
                  No Earnings Data
                </div>
              )}
            </div>
            <div className="flex justify-between px-1 text-[8px] font-black uppercase tracking-widest text-white/10 shrink-0">
              <span>May 1</span>
              <span>May 15</span>
              <span>May 29</span>
            </div>

            <div className={`mt-4 ${earningsPercentageChange === null ? 'bg-white/5 border-white/10' : (earningsPercentageChange >= 0 ? 'bg-green-500/5 border-green-500/10' : 'bg-red-500/5 border-red-500/10')} border rounded-xl p-2.5 flex items-center gap-3 shrink-0`}>
              <div className={`${earningsPercentageChange === null ? 'bg-white/10 text-white/40' : (earningsPercentageChange >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400')} p-1 rounded-lg`}>
                {earningsPercentageChange === null ? (
                  <TrendingUp className="w-3.5 h-3.5 lg:w-4 lg:h-4 opacity-50" />
                ) : earningsPercentageChange >= 0 ? (
                  <TrendingUp className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                )}
              </div>
              <p className="text-[9px] lg:text-[10px] font-bold text-white/60">
                {earningsPercentageChange === null ? (
                  "Insufficient Data for performance tracking."
                ) : (
                  <>Performance {earningsPercentageChange >= 0 ? 'up' : 'down'} <span className={earningsPercentageChange >= 0 ? 'text-green-400' : 'text-red-400'}>{Math.abs(earningsPercentageChange)}%</span> this month.</>
                )}
              </p>
            </div>
          </div>

          {/* Market Prices */}
          <div className="xl:col-span-3 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl lg:rounded-[1.5rem] p-4 lg:p-6 shadow-xl flex flex-col min-h-[180px] lg:min-h-0">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-xs lg:text-lg font-bold uppercase tracking-wider text-white/60">Market</h3>
              <button className="text-[8px] font-black uppercase tracking-widest text-green-400">All</button>
            </div>
            <div className="space-y-1.5 lg:space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-1">
              {products.length > 0 ? products.slice(0, 3).map((p, i) => (
                <PriceRow key={p.id || i} name={p.name} price={p.price} unit={p.unit} trend="+0%" up={true} />
              )) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 py-4">
                  <Sprout className="w-6 h-6 mb-2" />
                  <p className="text-[10px] font-bold">No Products Found</p>
                </div>
              )}
            </div>
          </div>

          {/* Crop Advisory */}
          <div className="xl:col-span-3 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl lg:rounded-[1.5rem] p-4 lg:p-6 shadow-xl flex flex-col min-h-[180px] lg:min-h-0">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-xs lg:text-lg font-bold uppercase tracking-wider text-white/60">Advisory</h3>
            </div>
            <div className="flex-1 bg-green-500/5 border border-green-500/10 rounded-2xl p-4 flex flex-col items-center text-center min-h-0">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-500/20 border border-green-500/20 rounded-xl flex items-center justify-center mb-2 lg:mb-3 shrink-0">
                <Droplets className="w-4 h-4 lg:w-5 lg:h-5 text-green-400" />
              </div>
              <h4 className="font-bold text-[11px] lg:text-xs mb-1">Irrigation</h4>
              <p className="text-[9px] lg:text-[10px] text-white/30 leading-tight mb-3 lg:mb-4 flex-1 overflow-hidden">Moderate irrigation recommended for Wheat in North India.</p>
              <button className="w-full py-2 bg-green-600/80 hover:bg-green-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shrink-0">
                Details
              </button>
            </div>
          </div>
        </div>

        {/* 📦 BOTTOM ROW */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 lg:gap-6 min-h-0 flex-none lg:flex-1">
          {/* Recent Orders */}
          <div className="xl:col-span-7 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl lg:rounded-[1.5rem] p-4 lg:p-6 shadow-xl flex flex-col min-h-[220px] lg:min-h-0">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-xs lg:text-xl font-bold uppercase tracking-wider text-white/60">Recent Orders</h3>
              <button className="text-[8px] font-black uppercase tracking-widest text-green-400">View All</button>
            </div>
            <div className="flex-1 overflow-x-auto lg:overflow-y-auto custom-scrollbar">
              <table className="w-full border-separate border-spacing-y-1.5 min-w-[450px] lg:min-w-0">
                <thead className="text-[8px] font-black uppercase tracking-widest text-white/10 sticky top-0 bg-[#020617]/80 backdrop-blur-md z-10">
                  <tr>
                    <th className="pb-2 text-left pl-2">ID</th>
                    <th className="pb-2 text-left">Crop</th>
                    <th className="pb-2 text-left">Status</th>
                    <th className="pb-2 text-left pr-2">Date</th>
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  {orders.length > 0 ? orders.slice(0, 3).map((o, i) => (
                    <OrderRow key={o.id || i} id={`#${o.id}`} crop={o.productName} qty={o.quantity} status={o.status} date={new Date(o.date).toLocaleDateString()} />
                  )) : (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-white/30 text-xs font-bold uppercase tracking-widest">
                        No Recent Orders
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Weather Update */}
          <WeatherWidget />
        </div>

      </div>
    </GlassLayout>
  );
};

const StatCard = ({ icon, label, value, unit, trend, trendUp }) => (
  <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-xl lg:rounded-[2rem] p-3 lg:p-6 flex lg:flex-row items-center gap-3 lg:gap-6 transition-all hover:bg-white/5 group">
    <div className="w-9 h-9 lg:w-14 lg:h-14 bg-green-500/10 border border-green-500/10 rounded-lg lg:rounded-2xl flex items-center justify-center text-green-400 shrink-0">
      {React.cloneElement(icon, { className: 'w-4 h-4 lg:w-7 lg:h-7' })}
    </div>
    <div className="min-w-0">
      <p className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-white/20 mb-0.5 truncate">{label}</p>
      <div className="flex items-baseline gap-0.5 lg:gap-1">
        <p className="text-sm lg:text-2xl font-black text-white/90">{value}</p>
        {unit && <span className="text-[8px] lg:text-xs font-bold text-white/20">{unit}</span>}
      </div>
      <p className={`text-[8px] lg:text-[10px] font-bold truncate ${trendUp ? 'text-green-400' : 'text-orange-400/60'}`}>
        {trend}
      </p>
    </div>
  </div>
);

const PriceRow = ({ name, price, unit, trend, up }) => (
  <div className="flex items-center justify-between p-2.5 lg:p-4 bg-white/[0.02] rounded-xl lg:rounded-2xl border border-white/5 hover:border-green-500/20 transition-all cursor-pointer">
    <div className="flex items-center gap-3">
       <div className="w-7 h-7 lg:w-10 lg:h-10 bg-green-500/5 rounded-lg lg:rounded-xl flex items-center justify-center text-green-400/40 shrink-0">
         <Sprout className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
       </div>
       <div className="min-w-0">
         <p className="text-[10px] lg:text-xs font-bold text-white/80 truncate">{name}</p>
         <p className="text-[9px] lg:text-[10px] text-white/20 truncate"><span className="text-white/60 font-black">{price}</span> {unit}</p>
       </div>
    </div>
    <div className={`text-[8px] lg:text-[10px] font-black flex items-center gap-1 shrink-0 ${up ? 'text-green-400' : 'text-red-400/60'}`}>
      {up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
      {trend}
    </div>
  </div>
);

const OrderRow = ({ id, crop, qty, status, date }) => (
  <tr className="bg-white/5 hover:bg-white/10 transition-all">
    <td className="py-2.5 pl-3 rounded-l-xl text-[10px] lg:text-xs font-bold text-white/20">{id}</td>
    <td className="py-2.5">
      <div className="flex items-center gap-2">
        <Sprout className="w-3 h-3 text-green-400/40" />
        <span className="text-[10px] lg:text-xs font-bold text-white/80">{crop}</span>
      </div>
    </td>
    <td className="py-2.5 text-[10px] lg:text-xs font-bold text-white/60">{qty}</td>
    <td className="py-2.5">
      <span className={`px-2 py-0.5 rounded-md text-[8px] lg:text-[10px] font-black uppercase tracking-wider ${
        status === 'Confirmed' ? 'bg-green-500/10 text-green-400' :
        status === 'Processing' ? 'bg-orange-500/10 text-orange-400' :
        'bg-blue-500/10 text-blue-400'
      }`}>
        {status}
      </span>
    </td>
    <td className="py-2.5 pr-3 rounded-r-xl text-[10px] lg:text-xs font-bold text-white/20">{date}</td>
  </tr>
);

const WeatherDetail = ({ icon, label, value }) => (
  <div className="flex items-center gap-2">
    <div className="shrink-0">{icon}</div>
    <div className="flex justify-between items-center w-full min-w-0">
      <span className="text-[8px] lg:text-[10px] font-bold text-white/20 uppercase tracking-widest truncate mr-2">{label}</span>
      <span className="text-[10px] lg:text-xs font-black text-white/80 shrink-0">{value}</span>
    </div>
  </div>
);

const ForecastDay = ({ day, icon, temp, active }) => (
  <div className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${active ? 'bg-green-500/10 border border-green-500/20' : 'hover:bg-white/5'}`}>
    <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-white/20">{day}</span>
    {icon}
    <span className="text-[8px] lg:text-[10px] font-black text-white/60">{temp}</span>
  </div>
);
