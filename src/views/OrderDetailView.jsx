import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GlassLayout } from '../components/layout/GlassLayout';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Calendar,
  Phone,
  MessageSquare,
  ChevronRight,
  Package,
  CheckCircle2,
  Clock,
  Loader2,
  Truck,
  AlertCircle,
  Edit2,
  User,
  Quote
} from 'lucide-react';
import { motion } from 'framer-motion';

export const OrderDetailView = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
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

    fetchOrderDetails();
  }, [orderId]);

  const timelineSteps = useMemo(() => {
    if (!order) return [];
    
    const statuses = ['pending', 'accepted', 'processing', 'shipped', 'out for delivery', 'delivered'];
    const currentStatus = order.status?.toLowerCase() || 'pending';
    const currentIndex = statuses.indexOf(currentStatus);

    return [
      { label: 'Order Placed', status: currentIndex >= 0 ? 'done' : 'pending', date: new Date(order.placedAt || order.createdAt).toLocaleString(), icon: Package },
      { label: 'Confirmed', status: currentIndex >= 1 ? 'done' : (currentIndex === 0 ? 'active' : 'pending'), date: currentIndex >= 1 ? 'Confirmed' : 'Pending', icon: CheckCircle2 },
      { label: 'Processing', status: currentIndex >= 2 ? 'done' : (currentIndex === 2 ? 'active' : 'pending'), date: currentIndex >= 2 ? 'In Process' : 'Pending', icon: Loader2 },
      { label: 'Shipped', status: currentIndex >= 3 ? 'done' : (currentIndex === 3 ? 'active' : 'pending'), date: currentIndex >= 3 ? 'Shipped' : 'Pending', icon: Truck },
      { label: 'Out for Delivery', status: currentIndex >= 4 ? 'done' : (currentIndex === 4 ? 'active' : 'pending'), date: currentIndex >= 4 ? 'On its way' : 'Pending', icon: Clock },
      { label: 'Delivered', status: currentIndex >= 5 ? 'done' : (currentIndex === 5 ? 'active' : 'pending'), date: currentIndex >= 5 ? 'Delivered' : 'Pending', icon: CheckCircle2 },
    ];
  }, [order]);

  if (loading) {
    return (
      <GlassLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
        </div>
      </GlassLayout>
    );
  }

  if (error || !order) {
    return (
      <GlassLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <AlertCircle className="w-12 h-12 text-rose-500" />
          <p className="text-xl font-bold text-white">{error || "Order not found"}</p>
          <button onClick={() => navigate('/orders')} className="text-green-400 hover:underline font-bold">Back to Orders</button>
        </div>
      </GlassLayout>
    );
  }

  return (
    <GlassLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <button
              onClick={() => navigate('/orders')}
              className="flex items-center gap-2 text-xs font-bold text-white/40 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Orders</span>
            </button>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-white tracking-tight">Order Details</h1>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white/60">
                  #ORD{String(order._id).slice(-6).toUpperCase()}
                </span>
                <span className="text-[10px] font-medium text-white/20 uppercase tracking-widest">
                  Placed on {new Date(order.placedAt || order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${
                ['delivered', 'shipped'].includes(order.status?.toLowerCase()) ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
              }`}>
              <span className="text-sm font-bold uppercase tracking-widest">{order.status}</span>
            </div>
          </div>
        </div>

        {/* Top Summary Info Card */}
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Customer */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center border border-white/10 text-green-400">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-0.5">Customer</p>
                <p className="text-sm font-bold text-white">{order.customerDetails?.fullName || order.userId?.name || 'Unknown'}</p>
                <p className="text-xs text-white/40 font-medium">{order.customerDetails?.phoneNumber || order.userId?.phone || 'N/A'}</p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-0.5">Delivery Address</p>
                <p className="text-sm font-bold text-white truncate max-w-[150px]">{order.customerDetails?.address || 'N/A'}</p>
                <p className="text-[10px] text-white/40">{order.customerDetails?.district}, {order.customerDetails?.state}</p>
              </div>
            </div>

            {/* Payment Status */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-0.5">Payment</p>
                <p className="text-sm font-bold text-white uppercase">{order.paymentStatus || 'Pending'}</p>
                <p className="text-[10px] text-green-400 font-bold">Secure Transaction</p>
              </div>
            </div>

            {/* Order Date */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-0.5">Order Date</p>
                <p className="text-sm font-bold text-white">{new Date(order.placedAt || order.createdAt).toLocaleDateString()}</p>
                <p className="text-xs text-white/40 font-medium">{new Date(order.placedAt || order.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-0.5">Total Amount</p>
                <p className="text-xl font-black text-white">₹{order.summary?.total?.toLocaleString() || 0}</p>
                <p className="text-[10px] text-white/40 font-bold">{order.items?.length || 0} items</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Delivery Timeline Card */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 space-y-8">
              <h3 className="text-lg font-bold text-white">Delivery Timeline</h3>

              <div className="relative flex justify-between">
                {/* Horizontal Connector Line */}
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-white/5" />

                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center text-center gap-3 w-20">
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${step.status === 'done' ? 'bg-green-500 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]' :
                        step.status === 'active' ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' :
                          'bg-white/5 border-white/10 text-white/20'
                      }`}>
                      <step.icon className={`w-5 h-5 ${step.status === 'active' ? 'animate-pulse' : ''}`} />
                    </div>
                    <div>
                      <p className={`text-[10px] font-bold transition-colors ${step.status === 'pending' ? 'text-white/20' :
                          step.status === 'active' ? 'text-blue-400' : 'text-green-400'
                        }`}>
                        {step.label}
                      </p>
                      <p className="text-[10px] text-white/20 font-medium whitespace-nowrap mt-0.5">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items in Order Card */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden">
              <div className="p-8 border-b border-white/5">
                <h3 className="text-lg font-bold text-white">Items in this Order</h3>
              </div>
              <div className="p-8 space-y-6">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                      <th className="pb-4">Product</th>
                      <th className="pb-4 text-center">Price</th>
                      <th className="pb-4 text-center">Quantity</th>
                      <th className="pb-4 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {order.items?.map((item, idx) => (
                      <tr key={idx} className="group">
                        <td className="py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                              <img src={item.productId?.images?.[0] || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&h=100&fit=crop'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{item.name}</p>
                              <p className="text-[10px] text-white/40 font-medium">{item.productId?.title || 'Farm Product'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 text-center">
                          <span className="text-sm font-bold text-white/60">₹{item.price}</span>
                        </td>
                        <td className="py-6 text-center">
                          <span className="text-sm font-bold text-white">{item.quantity}</span>
                        </td>
                        <td className="py-6 text-right">
                          <span className="text-sm font-black text-white">₹{item.totalPrice?.toLocaleString()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
                <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Total Items: <span className="text-white/60">{order.items?.length || 0}</span></p>
                <p className="text-xl font-black text-green-400">₹{order.summary?.total?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">

            {/* Delivery Address Details */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/40">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Delivery Address</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-white">{order.customerDetails?.fullName || order.userId?.name || 'Unknown'}</p>
                <p className="text-xs font-medium text-white/40 leading-relaxed">
                  {order.customerDetails?.address || 'N/A'}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-white/60">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{order.customerDetails?.phoneNumber || order.userId?.phone || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Payment Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-white/40">Subtotal</span>
                  <span className="font-bold text-white">₹{order.summary?.subtotal?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-white/40">Delivery Fee</span>
                  <span className="font-bold text-white">₹{order.summary?.deliveryFee || 0}</span>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-sm font-bold text-white">Total Amount</span>
                  <span className="text-xl font-black text-green-400">₹{order.summary?.total?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            {order.customerDetails?.notes && (
              <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 space-y-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Order Notes</h3>
                <div className="relative p-4 bg-white/5 border border-white/10 rounded-2xl italic">
                  <Quote className="absolute -top-2 -left-2 w-6 h-6 text-green-500/20 fill-current" />
                  <p className="text-xs text-white/60 leading-relaxed">
                    "{order.customerDetails.notes}"
                  </p>
                </div>
              </div>
            )}

            {/* Actions Card */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Actions</h3>
                <p className="text-[10px] font-medium text-white/20">Available actions for this order</p>
              </div>

              <div className="space-y-3">
                {order.status?.toLowerCase() === 'processing' && (
                  <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
                    <Truck className="w-4 h-4" />
                    <span>Mark as Shipped</span>
                  </button>
                )}
                <button 
                  onClick={() => window.location.href = `tel:${order.customerDetails?.phoneNumber || order.userId?.phone}`}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 rounded-2xl transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Contact Customer</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </GlassLayout>
  );
};

