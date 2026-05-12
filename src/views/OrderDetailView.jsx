import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GlassLayout } from '../components/layout/GlassLayout';
import { apiService } from '../services/apiService';
import { OrderRejectionModal } from '../components/orders/OrderRejectionModal';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Calendar,
  Phone,
  Package,
  CheckCircle2,
  Clock,
  Loader2,
  Truck,
  AlertCircle,
  User,
  X,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OrderDetailView = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await apiService.getOrderById(orderId, token);
      if (res.success) {
        setOrder(res.data);
      } else {
        setError(res.message || "Failed to fetch order details");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const res = await apiService.updateOrderStatus(orderId, newStatus, token);
      if (res.success) {
        setOrder(res.data);
        if (newStatus === 'cancelled') {
          setIsRejectModalOpen(false);
        }
      } else {
        alert(res.message || `Failed to update status to ${newStatus}`);
      }
    } catch (err) {
      alert(err.message || "An error occurred during status update");
    } finally {
      setActionLoading(false);
    }
  };

  const timelineSteps = useMemo(() => {
    if (!order) return [];
    
    const statuses = ['pending', 'processing', 'dispatched', 'out for delivery', 'delivered'];
    const currentStatus = order.status?.toLowerCase() || 'pending';
    
    if (currentStatus === 'cancelled') {
      return [
        { label: 'Order Placed', status: 'done', icon: Package, description: 'Order has been placed successfully.' },
        { label: 'Cancelled', status: 'cancelled', icon: X, description: 'Order has been cancelled.' }
      ];
    }

    const currentIndex = statuses.indexOf(currentStatus);

    return [
      { 
        label: 'Order Placed', 
        status: currentIndex >= 0 ? 'done' : 'pending', 
        icon: Package,
        description: 'Order has been placed successfully.'
      },
      { 
        label: 'Processing', 
        status: currentIndex >= 1 ? 'done' : (currentIndex === 0 ? 'active' : 'pending'), 
        icon: Loader2,
        description: currentIndex >= 1 ? 'Order is being processed.' : 'Order has not been processed yet.'
      },
      { 
        label: 'Dispatched', 
        status: currentIndex >= 2 ? 'done' : (currentIndex === 1 ? 'active' : 'pending'), 
        icon: Truck,
        description: currentIndex >= 2 ? 'Order has been dispatched.' : 'Order has not been dispatched yet.'
      },
      { 
        label: 'Out for Delivery', 
        status: currentIndex >= 3 ? 'done' : (currentIndex === 2 ? 'active' : 'pending'), 
        icon: Clock,
        description: currentIndex >= 3 ? 'Order is out for delivery.' : 'Order has not reached this stage.'
      },
      { 
        label: 'Delivered', 
        status: currentIndex >= 4 ? 'done' : (currentIndex === 3 ? 'active' : 'pending'), 
        icon: CheckCircle2,
        description: currentIndex >= 4 ? 'Order has been delivered.' : 'Waiting for delivery.'
      },
    ];
  }, [order]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'dispatched': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'processing': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'cancelled': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-white/60 bg-white/5 border-white/10';
    }
  };

  if (loading) {
    return (
      <GlassLayout>
        <div className="max-w-7xl mx-auto space-y-8 p-6">
          <div className="flex justify-between items-end">
            <div className="space-y-4 w-1/2">
              <div className="h-4 w-32 bg-white/5 rounded-full animate-pulse" />
              <div className="h-10 w-64 bg-white/5 rounded-2xl animate-pulse" />
            </div>
            <div className="space-y-2 w-1/4">
              <div className="h-12 w-full bg-white/5 rounded-2xl animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="h-48 w-full bg-white/5 rounded-[2.5rem] animate-pulse" />
              <div className="h-96 w-full bg-white/5 rounded-[2.5rem] animate-pulse" />
            </div>
            <div className="space-y-8">
              <div className="h-96 w-full bg-white/5 rounded-[2.5rem] animate-pulse" />
              <div className="h-48 w-full bg-white/5 rounded-[2.5rem] animate-pulse" />
            </div>
          </div>
        </div>
      </GlassLayout>
    );
  }

  if (error || !order) {
    return (
      <GlassLayout>
        <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
          <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 text-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
            <AlertCircle className="w-10 h-10" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-2xl font-bold text-white tracking-tight">{error || "Order Not Found"}</p>
            <p className="text-white/40 font-medium">We couldn't find the order details you're looking for.</p>
          </div>
          <button 
            onClick={() => navigate('/orders')} 
            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold transition-all active:scale-95"
          >
            Back to Orders
          </button>
        </div>
      </GlassLayout>
    );
  }

  return (
    <GlassLayout>
      <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Top Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-6">
            <button
              onClick={() => navigate('/orders')}
              className="flex items-center gap-2 text-sm font-bold text-white/40 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Orders</span>
            </button>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-4xl font-black text-white tracking-tight">
                  #ORD<span className="text-green-400">{String(order._id).slice(-6).toUpperCase()}</span>
                </h1>
                <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${getStatusColor(order.status)}`}>
                  {order.status}
                </div>
              </div>
              
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2 text-white/40">
                  <Calendar className="w-4 h-4 text-green-500/60" />
                  <span className="text-xs font-bold">{new Date(order.placedAt || order.createdAt).toLocaleDateString()} at {new Date(order.placedAt || order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-2 text-white/40">
                  <CreditCard className="w-4 h-4 text-blue-500/60" />
                  <span className="text-xs font-bold">{order.summary?.paymentMethod || 'COD'}</span>
                  {order.summary?.paymentMethod === 'COD' && (
                    <span className="px-2 py-0.5 bg-white/5 rounded-md text-[8px] font-bold border border-white/10">Cash on Delivery</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex flex-col gap-1 text-right">
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Order Actions</p>
              <div className="flex gap-3">
                {order.status?.toLowerCase() === 'processing' && (
                  <button
                    onClick={() => handleStatusUpdate('dispatched')}
                    disabled={actionLoading}
                    className="flex-1 sm:flex-none px-6 py-4 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white rounded-[1.25rem] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40 active:scale-95 disabled:opacity-50"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Mark as Dispatched</span>
                  </button>
                )}
                {['pending', 'processing'].includes(order.status?.toLowerCase()) && (
                  <button
                    onClick={() => setIsRejectModalOpen(true)}
                    disabled={actionLoading}
                    className="flex-1 sm:flex-none px-6 py-4 bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/50 text-white hover:text-rose-400 rounded-[1.25rem] font-bold text-xs flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] active:scale-95 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject Order</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Main Details */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Order Items Card */}
            <div className="bg-[#0F172A]/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-xl">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20">
                    <Package className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Order Items</h3>
                </div>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{order.items?.length || 0} items total</span>
              </div>
              
              <div className="p-8 space-y-8">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                    <div className="flex items-center gap-6">
                      <div className="relative w-20 h-20 rounded-[1.5rem] overflow-hidden border border-white/10 bg-white/5 group-hover:border-green-500/50 transition-colors duration-500">
                        <img 
                          src={item.productId?.images?.[0] || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=200&fit=crop'} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-bold text-white group-hover:text-green-400 transition-colors">{item.name}</p>
                        <p className="text-xs text-white/40 font-medium flex items-center gap-2">
                          <TrendingUp className="w-3 h-3 text-green-500/60" />
                          {item.productId?.title || 'Farm Fresh Product'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-12 sm:gap-16 pl-2 sm:pl-0">
                      <div className="text-center sm:text-left space-y-0.5">
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Quantity</p>
                        <p className="text-sm font-black text-white">{item.quantity}</p>
                      </div>
                      <div className="text-center sm:text-left space-y-0.5">
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Unit Price</p>
                        <p className="text-sm font-bold text-white/60">₹{item.price}</p>
                      </div>
                      <div className="text-right space-y-0.5">
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Total</p>
                        <p className="text-lg font-black text-green-400">₹{item.totalPrice?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Customer Details Card */}
              <div className="bg-[#0F172A]/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <User className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Customer Details</h3>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center text-blue-400 overflow-hidden shadow-inner">
                    {order.userId?.avatar ? (
                      <img src={order.userId.avatar} alt={order.userId.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 opacity-40" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-white">{order.customerDetails?.fullName || order.userId?.name || 'Anonymous User'}</p>
                    <p className="text-xs text-white/40 font-medium flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      {order.customerDetails?.phoneNumber || order.userId?.phone || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                    <MapPin className="w-4 h-4 text-white/20" />
                    <div>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Location</p>
                      <p className="text-xs font-bold text-white/60">{order.customerDetails?.district || 'Unknown City'}, {order.customerDetails?.state || 'Unknown State'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary Card */}
              <div className="bg-[#0F172A]/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-green-500/5 blur-[50px] rounded-full" />
                
                <div className="flex items-center gap-3 relative z-10">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Order Summary</h3>
                </div>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-white/40">Subtotal</span>
                    <span className="text-sm font-bold text-white">₹{order.summary?.subtotal?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-white/40">Delivery Fee</span>
                    <span className="text-sm font-bold text-white">₹{order.summary?.deliveryFee || 0}</span>
                  </div>
                  {order.summary?.codCharges > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-white/40">COD Charges</span>
                      <span className="text-sm font-bold text-white">₹{order.summary?.codCharges}</span>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Total Amount</span>
                      <p className="text-2xl font-black text-green-400 shadow-green-500/20 shadow-sm">
                        ₹{order.summary?.total?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-green-500/10 rounded-lg border border-green-500/20">
                       <span className="text-[8px] font-black text-green-500 uppercase tracking-tighter">Paid via {order.summary?.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address Card */}
            <div className="bg-[#0F172A]/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Delivery Address</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Full Address</p>
                  <p className="text-sm font-medium text-white/70 leading-relaxed">
                    {order.customerDetails?.address || 'N/A'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Pincode</p>
                    <p className="text-sm font-bold text-white">{order.customerDetails?.pincode || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Contact</p>
                    <p className="text-sm font-bold text-white">{order.customerDetails?.phoneNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Timeline */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 bg-[#0F172A]/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-xl space-y-8 h-fit">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Delivery Timeline</h3>
              </div>

              <div className="relative space-y-0">
                {/* Vertical Connector Line */}
                <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-white/5" />
                
                <div className="space-y-6">
                  {timelineSteps.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-6 group">
                      {/* Status Icon Node */}
                      <div className={`relative z-10 w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 shadow-lg ${
                        step.status === 'done' ? 'bg-green-500 border-green-400 text-white shadow-green-500/30 scale-100' :
                        step.status === 'active' ? 'bg-blue-600 border-blue-400 text-white shadow-blue-500/40 scale-110' :
                        step.status === 'cancelled' ? 'bg-rose-500 border-rose-400 text-white shadow-rose-500/30' :
                        'bg-[#1E293B] border-white/10 text-white/20 scale-90'
                      }`}>
                        <step.icon className={`w-5 h-5 ${step.status === 'active' ? 'animate-pulse' : ''}`} />
                        
                        {/* Status Pulse Ring for Active */}
                        {step.status === 'active' && (
                          <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 animate-ping opacity-20" />
                        )}
                        
                        {/* Completed Connector Section */}
                        {step.status === 'done' && idx < timelineSteps.length - 1 && (
                          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="space-y-1.5 py-1">
                        <p className={`text-sm font-black tracking-tight transition-colors ${
                          step.status === 'pending' ? 'text-white/20' :
                          step.status === 'active' ? 'text-blue-400' :
                          step.status === 'cancelled' ? 'text-rose-400' : 'text-green-400'
                        }`}>
                          {step.label}
                        </p>
                        <p className="text-[10px] text-white/40 font-medium leading-relaxed max-w-[180px]">
                          {step.description}
                        </p>
                        {step.status === 'done' && (
                          <p className="text-[9px] text-green-500/60 font-bold uppercase tracking-tighter">Completed</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Bottom Info Tip */}
              <div className="pt-8 border-t border-white/5">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex gap-4">
                  <div className="p-2 h-fit rounded-lg bg-blue-500/10 text-blue-400">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] text-white/40 font-medium leading-relaxed">
                    Once the order is dispatched, the customer will be notified and can track the delivery status.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <OrderRejectionModal 
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={() => handleStatusUpdate('cancelled')}
        orderId={orderId}
        loading={actionLoading}
      />
    </GlassLayout>
  );
};
