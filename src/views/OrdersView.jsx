import React, { useState, useMemo, useEffect } from 'react';
import { GlassLayout } from '../components/layout/GlassLayout';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Clock, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  MoreVertical, 
  Calendar, 
  Filter, 
  Search,
  Truck,
  ChevronLeft,
  ChevronRight,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useFarmerContext } from '../context/FarmerContext';

export const OrdersView = () => {
  const { orders = [], fetchOrders } = useFarmerContext();
  
  useEffect(() => {
    if (fetchOrders) fetchOrders();
  }, []);
  const [activeTab, setActiveTab] = useState('All Orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(false);

  // Map backend orders to UI format gracefully
  const formattedOrders = useMemo(() => {
    return orders.map(o => ({
      id: `#ORD${o.id || Math.floor(Math.random()*10000)}`,
      rawId: o.id,
      customer: o.customerName || 'Unknown',
      location: o.buyerId?.location || 'India',
      product: o.productName || o.products?.[0]?.productId?.title || 'Unknown Product',
      quantity: `${o.quantity || o.products?.[0]?.quantity || 1}`,
      amount: `₹${o.total || o.totalAmount || 0}`,
      status: o.status === 'pending' ? 'Pending' : (o.status || 'Pending'),
      date: new Date(o.date || o.createdAt || Date.now()).toLocaleDateString(),
      time: new Date(o.date || o.createdAt || Date.now()).toLocaleTimeString(),
      items: o.products?.length || 1,
      customerImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      productImg: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&h=100&fit=crop'
    }));
  }, [orders]);

  const stats = [
    { label: 'Total Orders', value: formattedOrders.length, subtext: 'All time orders', icon: ClipboardList, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
    { label: 'Pending', value: formattedOrders.filter(o => o.status === 'Pending').length, subtext: 'Awaiting action', icon: Clock, color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
    { label: 'Processing', value: formattedOrders.filter(o => o.status === 'Processing').length, subtext: 'In progress', icon: Loader2, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    { label: 'Delivered', value: formattedOrders.filter(o => o.status === 'Delivered').length, subtext: 'Completed', icon: CheckCircle2, color: 'text-green-400', bgColor: 'bg-green-500/10' },
    { label: 'Cancelled', value: formattedOrders.filter(o => o.status === 'Cancelled').length, subtext: 'Cancelled orders', icon: XCircle, color: 'text-rose-400', bgColor: 'bg-rose-500/10' },
  ];

  const tabs = ['All Orders', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = useMemo(() => {
    return formattedOrders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           order.customer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'All Orders' || order.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab, formattedOrders]);

  return (
    <GlassLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-3xl p-6 group hover:bg-white/[0.06] transition-all duration-500"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] font-medium text-white/20 mt-1">{stat.subtext}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Orders Table Section */}
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col min-h-[600px]">
          
          {/* Tabs and Filters Header */}
          <div className="px-8 py-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2 md:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative py-2 text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab ? 'text-green-400' : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTabOrder"
                      className="absolute -bottom-1 left-0 right-0 h-1 bg-green-500 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <div className="relative flex items-center gap-3 h-10">
                <AnimatePresence mode="wait">
                  {!searchExpanded ? (
                    <motion.button
                      key="search-btn"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      onClick={() => setSearchExpanded(true)}
                      className="p-2.5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-white/40 hover:text-white"
                    >
                      <Search className="w-4 h-4" />
                    </motion.button>
                  ) : (
                    <motion.div
                      key="search-input"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: '320px', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="relative flex items-center"
                    >
                      <Search className="absolute left-4 w-4 h-4 text-white/20" />
                      <input 
                        autoFocus
                        type="text" 
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => !searchQuery && setSearchExpanded(false)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-11 pr-10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all text-white placeholder:text-white/20"
                      />
                      <button 
                        onClick={() => {
                          setSearchQuery('');
                          setSearchExpanded(false);
                        }}
                        className="absolute right-3 p-1 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5 text-white/20 hover:text-white/40" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {!searchExpanded && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex items-center gap-3"
                    >
                      <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl text-xs font-bold hover:bg-white/10 transition-all text-white/60">
                        <Calendar className="w-4 h-4 text-white/20" />
                        <span className="hidden sm:inline">May 1 - May 29, 2025</span>
                        <span className="sm:hidden">May 1 - 29</span>
                      </button>
                      <button className="p-2.5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-white/40 hover:text-white">
                        <Filter className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-white/20 uppercase tracking-widest border-b border-white/5">
                  <th className="px-8 py-5 font-bold">Order ID</th>
                  <th className="px-8 py-5 font-bold">Customer</th>
                  <th className="px-8 py-5 font-bold">Products</th>
                  <th className="px-8 py-5 font-bold text-center">Quantity</th>
                  <th className="px-8 py-5 font-bold text-center">Amount</th>
                  <th className="px-8 py-5 font-bold text-center">Status</th>
                  <th className="px-8 py-5 text-right font-bold">Order Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                    <OrderRow key={order.id} order={order} />
                  )) : (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-white/30 text-xs font-bold uppercase tracking-widest">
                        No orders found
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-8 py-6 border-t border-white/5 flex justify-between items-center bg-white/[0.01]">
            <p className="text-xs font-medium text-white/20">
              Showing {filteredOrders.length > 0 ? 1 : 0} to {filteredOrders.length} of {formattedOrders.length} orders
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 transition-all"><ChevronLeft className="w-4 h-4" /></button>
              <button className="w-9 h-9 flex items-center justify-center bg-green-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-green-500/20">1</button>
              <button className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/40 text-xs font-bold rounded-xl transition-all">2</button>
              <button className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/40 text-xs font-bold rounded-xl transition-all">3</button>
              <span className="text-white/10 px-1">...</span>
              <button className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/40 text-xs font-bold rounded-xl transition-all">25</button>
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 transition-all"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

        </div>
      </div>
    </GlassLayout>
  );
};

const OrderRow = ({ order }) => {
  const navigate = useNavigate();
  const statusStyles = {
    Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
    Cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const statusIcons = {
    Pending: Clock,
    Processing: Loader2,
    Shipped: Truck,
    Delivered: CheckCircle2,
    Cancelled: XCircle,
  };

  const StatusIcon = statusIcons[order.status] || Clock;

  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => navigate(`/orders/${order.rawId || order.id.replace('#', '')}`)}
      className="group hover:bg-white/[0.02] transition-all duration-300 cursor-pointer"
    >
      <td className="px-8 py-5">
        <span className="text-sm font-bold text-green-400 group-hover:text-green-300 transition-colors">{order.id}</span>
      </td>
      <td className="px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
            <img src={order.customerImg} alt={order.customer} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{order.customer}</p>
            <p className="text-[10px] text-white/40 font-medium uppercase tracking-tight">{order.location}</p>
          </div>
        </div>
      </td>
      <td className="px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-white/5">
            <img src={order.productImg} alt={order.product} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{order.product}</p>
            <p className="text-[10px] text-white/40 font-medium">{order.items} {order.items > 1 ? 'items' : 'item'}</p>
          </div>
        </div>
      </td>
      <td className="px-8 py-5 text-center">
        <span className="text-sm font-medium text-white/60">{order.quantity}</span>
      </td>
      <td className="px-8 py-5 text-center">
        <span className="text-sm font-black text-white">{order.amount}</span>
      </td>
      <td className="px-8 py-5 text-center">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusStyles[order.status]}`}>
          <StatusIcon className="w-3 h-3" />
          <span>{order.status}</span>
        </div>
      </td>
      <td className="px-8 py-5 text-right">
        <div>
          <p className="text-sm font-medium text-white/80">{order.date}</p>
          <p className="text-[10px] text-white/40 font-medium">{order.time}</p>
        </div>
      </td>
    </motion.tr>
  );
};

