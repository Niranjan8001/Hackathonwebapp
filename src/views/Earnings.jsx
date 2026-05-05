import React from 'react';
import { useFarmerContext } from '../context/FarmerContext';
import { Card } from '../components/ui/Card';
import { Wallet, TrendingUp, Calendar } from 'lucide-react';

export const Earnings = () => {
  const { totalEarnings, weeklyEarnings, orders } = useFarmerContext();
  
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Wallet className="w-24 h-24" />
        </div>
        <div className="relative z-10">
          <p className="text-green-100 font-medium mb-1">Total Lifetime Earnings</p>
          <h2 className="text-4xl font-bold mb-4">₹{totalEarnings}</h2>
          
          <div className="flex items-center gap-2 bg-white/20 inline-flex px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <TrendingUp className="w-4 h-4 text-green-100" />
            <span className="text-sm font-medium text-green-50">+12% this month</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-3">This Week</h3>
        <Card className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full text-green-700">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Weekly Revenue</p>
              <p className="text-xl font-bold text-slate-800">₹{weeklyEarnings}</p>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-3">Recent Transactions</h3>
        <div className="space-y-3">
          {deliveredOrders.length === 0 ? (
            <p className="text-slate-500 text-center py-4">No completed transactions yet.</p>
          ) : (
            deliveredOrders.map((order) => (
              <Card key={order.id} className="flex justify-between items-center !py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                    {order.customerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{order.productName}</p>
                    <p className="text-xs text-slate-500">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+₹{order.total}</p>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
