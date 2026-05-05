import React from 'react';
import { useFarmerContext } from '../context/FarmerContext';
import { Card } from '../components/ui/Card';
import { Wallet, Package, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { totalEarnings, orders, products } = useFarmerContext();
  const navigate = useNavigate();
  
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const totalProducts = products.length;

  return (
    <div className="p-4 space-y-6 pb-24">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Namaste, Farmer</h2>
        <p className="text-slate-500">Here's your farm summary today.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="col-span-2 bg-green-600 !border-0 text-white !shadow-md">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <Wallet className="w-5 h-5" />
            <h3 className="font-medium">Total Earnings</h3>
          </div>
          <p className="text-3xl font-bold">₹{totalEarnings}</p>
        </Card>

        <Card onClick={() => navigate('/orders')}>
          <div className="flex flex-col items-center justify-center py-2 text-center">
            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-2">
              <ClipboardList className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{pendingOrders}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Pending Orders</p>
          </div>
        </Card>

        <Card onClick={() => navigate('/inventory')}>
          <div className="flex flex-col items-center justify-center py-2 text-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
              <Package className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{totalProducts}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Total Products</p>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-3">Quick Actions</h3>
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate('/add-product')}
            className="bg-white border border-green-200 rounded-xl p-4 flex items-center justify-between shadow-sm active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg text-green-700">
                <Package className="w-5 h-5" />
              </div>
              <span className="font-semibold text-slate-700">Add New Product</span>
            </div>
            <span className="text-green-600 text-xl">+</span>
          </button>
          
          <button 
            onClick={() => navigate('/orders')}
            className="bg-white border border-green-200 rounded-xl p-4 flex items-center justify-between shadow-sm active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg text-green-700">
                <ClipboardList className="w-5 h-5" />
              </div>
              <span className="font-semibold text-slate-700">View Recent Orders</span>
            </div>
            <span className="text-green-600 text-xl">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
