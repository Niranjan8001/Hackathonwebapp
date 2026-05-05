import React from 'react';
import { useFarmerContext } from '../context/FarmerContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Orders = () => {
  const { orders, updateOrderStatus } = useFarmerContext();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-4 pb-24 space-y-4">
      {orders.length === 0 ? (
        <div className="text-center text-slate-500 py-10">No orders yet.</div>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="flex flex-col">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-3">
              <div>
                <h3 className="font-bold text-slate-800">{order.productName}</h3>
                <p className="text-sm text-slate-500">Qty: {order.quantity} kg</p>
                <p className="text-sm text-slate-500 mt-1">Customer: <span className="font-medium text-slate-700">{order.customerName}</span></p>
              </div>
              <div className="text-right">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <p className="font-bold text-slate-800 mt-2">₹{order.total}</p>
              </div>
            </div>

            {order.status === 'Pending' && (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Button 
                  variant="outline" 
                  onClick={() => updateOrderStatus(order.id, 'Rejected')}
                  className="!py-2 !text-sm border-red-200 text-red-600 hover:bg-red-50"
                >
                  Reject
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => updateOrderStatus(order.id, 'Accepted')}
                  className="!py-2 !text-sm"
                >
                  Accept
                </Button>
              </div>
            )}
            {order.status === 'Accepted' && (
              <div className="mt-2">
                <Button 
                  fullWidth 
                  variant="primary" 
                  onClick={() => updateOrderStatus(order.id, 'Delivered')}
                  className="!py-2 !text-sm bg-blue-600 hover:bg-blue-700"
                >
                  Mark as Delivered
                </Button>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );
};
