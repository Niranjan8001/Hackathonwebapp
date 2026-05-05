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

/* ── Rich mock data keyed by order ID ────────────────────────────── */
const mockOrders = {
  'ORD12345': {
    id: '#ORD12345',
    status: 'Processing',
    date: 'May 29, 2025',
    time: '10:30 AM',
    expectedDelivery: 'Jun 02, 2025',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid Online',
    total: 1400,
    subtotal: 1250,
    deliveryCharge: 80,
    platformFee: 70,
    customer: {
      name: 'Rohit Sharma',
      phone: '+91 98765 43210',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      address: '123, Faizabad Road, Near IT Park, Lucknow, Uttar Pradesh - 226010',
      location: 'Lucknow, Uttar Pradesh',
      pincode: '226010',
      country: 'India'
    },
    items: [
      { name: 'Organic Wheat', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&h=100&fit=crop', qty: 50, unit: 'kg', pricePerUnit: 28, total: 1400, description: 'Premium quality organic wheat' },
      { name: 'Basmati Rice', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop', qty: 10, unit: 'kg', pricePerUnit: 85, total: 850, description: 'Aromatic long grain basmati rice' },
    ],
    notes: {
      customer: 'Please deliver in the morning. I will be available at home.',
      special: 'Handle with care'
    },
    timeline: [
      { label: 'Order Placed', status: 'done', date: 'May 29, 10:30 AM', icon: Package },
      { label: 'Confirmed', status: 'done', date: 'May 29, 10:35 AM', icon: CheckCircle2 },
      { label: 'Processing', status: 'active', date: 'May 29, 11:00 AM', icon: Loader2 },
      { label: 'Shipped', status: 'pending', date: 'Pending', icon: Truck },
      { label: 'Out for Delivery', status: 'pending', date: 'Pending', icon: Clock },
      { label: 'Delivered', status: 'pending', date: 'Pending', icon: CheckCircle2 },
    ]
  }
};

const fallbackOrder = mockOrders['ORD12345'];

export const OrderDetailView = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const cleanId = orderId?.replace('#', '');
  const order = mockOrders[cleanId] || fallbackOrder;

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
                  {order.id}
                </span>
                <span className="text-[10px] font-medium text-white/20 uppercase tracking-widest">
                  Placed on {order.date} at {order.time}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${order.status === 'Processing' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-green-500/10 border-green-500/20 text-green-400'
              }`}>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-bold">{order.status}</span>
            </div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
              Expected delivery: <span className="text-white/80">{order.expectedDelivery}</span>
            </p>
          </div>
        </div>

        {/* Top Summary Info Card */}
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Customer */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                <img src={order.customer.image} alt={order.customer.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-0.5">Customer</p>
                <p className="text-sm font-bold text-white">{order.customer.name}</p>
                <p className="text-xs text-white/40 font-medium">{order.customer.phone}</p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-0.5">Delivery Address</p>
                <p className="text-sm font-bold text-white truncate max-w-[150px]">{order.customer.location}</p>
                <button className="text-[10px] text-green-400 font-bold hover:underline">View on Map</button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-0.5">Payment Method</p>
                <p className="text-sm font-bold text-white">{order.paymentMethod}</p>
                <p className="text-[10px] text-green-400 font-bold">{order.paymentStatus}</p>
              </div>
            </div>

            {/* Order Date */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-0.5">Order Date</p>
                <p className="text-sm font-bold text-white">{order.date}</p>
                <p className="text-xs text-white/40 font-medium">{order.time}</p>
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-0.5">Total Amount</p>
                <p className="text-xl font-black text-white">₹{order.total.toLocaleString()}</p>
                <p className="text-[10px] text-white/40 font-bold">{order.items.length} items</p>
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

                {order.timeline.map((step, idx) => (
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

                {/* Animated Progress Overlay */}
                <div
                  className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-1000"
                  style={{ width: '40%' }}
                />
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400" />
                <p className="text-xs font-medium text-white/60">
                  We are processing your order. The products are being packed and will be shipped soon.
                </p>
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
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="group">
                        <td className="py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{item.name}</p>
                              <p className="text-[10px] text-white/40 font-medium">{item.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 text-center">
                          <span className="text-sm font-bold text-white/60">₹{item.pricePerUnit} / {item.unit}</span>
                        </td>
                        <td className="py-6 text-center">
                          <span className="text-sm font-bold text-white">{item.qty} {item.unit}</span>
                        </td>
                        <td className="py-6 text-right">
                          <span className="text-sm font-black text-white">₹{item.total.toLocaleString()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
                <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Total Items: <span className="text-white/60">{order.items.length}</span></p>
                <p className="text-xl font-black text-green-400">₹{order.total.toLocaleString()}</p>
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
                <button className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-white/40 hover:text-white transition-colors">
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Address</span>
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-white">{order.customer.name}</p>
                <p className="text-xs font-medium text-white/40 leading-relaxed">
                  {order.customer.address}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-white/60">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{order.customer.phone}</span>
                </div>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Payment Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-white/40">Subtotal ({order.items.length} items)</span>
                  <span className="font-bold text-white">₹{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-white/40">Delivery Fee</span>
                  <span className="font-bold text-white">₹{order.deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-white/40">Platform Fee</span>
                  <span className="font-bold text-white">₹{order.platformFee}</span>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-sm font-bold text-white">Total Amount</span>
                  <span className="text-xl font-black text-green-400">₹{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Order Notes</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3">Customer Note</p>
                  <div className="relative p-4 bg-white/5 border border-white/10 rounded-2xl italic">
                    <Quote className="absolute -top-2 -left-2 w-6 h-6 text-green-500/20 fill-current" />
                    <p className="text-xs text-white/60 leading-relaxed">
                      "{order.notes.customer}"
                    </p>
                    <p className="text-[10px] font-bold text-green-400 mt-2">— {order.customer.name}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3">Special Instructions</p>
                  <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-white/20" />
                    <p className="text-xs font-medium text-white/40">{order.notes.special}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Actions</h3>
                <p className="text-[10px] font-medium text-white/20">Available actions for this order</p>
              </div>

              <div className="space-y-3">
                <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
                  <Truck className="w-4 h-4" />
                  <span>Mark as Shipped</span>
                </button>
                <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 rounded-2xl transition-all">
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

