import React, { useState } from 'react';
import { useFarmerContext } from '../context/FarmerContext';
import { Card } from '../components/ui/Card';
import { Edit2, Check } from 'lucide-react';

import { LoadingSpinner, ErrorState } from '../components/ui/Feedback';

export const Inventory = () => {
  const { products, updateProductQuantity, loading, error, handleRetry } = useFarmerContext();
  const [editingId, setEditingId] = useState(null);
  const [editVal, setEditVal] = useState('');

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditVal(product.quantity.toString());
  };

  const handleSave = (id) => {
    updateProductQuantity(id, Number(editVal));
    setEditingId(null);
  };

  const handleMarkOutOfStock = (id) => {
    updateProductQuantity(id, 0);
  };

  if (loading && products.length === 0) {
    return <LoadingSpinner message="Loading your inventory..." />;
  }

  if (error && products.length === 0) {
    return <ErrorState message={error.message} onRetry={handleRetry} status={error.status} />;
  }

  return (
    <div className="p-4 pb-24 space-y-4">
      {error && (
        <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-xl flex items-center justify-between gap-3 mb-2">
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">{error.message}</p>
          <button onClick={handleRetry} className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-800/30 px-2 py-1 rounded">Retry</button>
        </div>
      )}
      {products.length === 0 ? (
        <div className="text-center text-slate-500 py-10">Your inventory is empty.</div>
      ) : (
        products.map((product) => (
          <Card key={product.id} className="flex gap-4 items-center">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-20 h-20 object-cover rounded-lg border border-slate-100"
            />
            <div className="flex-1">
              <h3 className="font-bold text-slate-800">{product.name}</h3>
              <p className="text-sm text-slate-500 mb-1">₹{product.price} / kg</p>
              
              {editingId === product.id ? (
                <div className="flex items-center gap-2 mt-2">
                  <input 
                    type="number" 
                    value={editVal}
                    onChange={(e) => setEditVal(e.target.value)}
                    className="w-20 border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-green-500"
                  />
                  <button 
                    onClick={() => handleSave(product.id)}
                    className="bg-green-100 text-green-700 p-1.5 rounded-lg active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-sm font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.quantity > 0 ? `${product.quantity} kg available` : 'Out of Stock'}
                  </span>
                  
                  <div className="flex gap-2">
                    {product.quantity > 0 && (
                      <button 
                        onClick={() => handleMarkOutOfStock(product.id)}
                        className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded"
                      >
                        Clear
                      </button>
                    )}
                    <button 
                      onClick={() => handleEditClick(product)}
                      className="bg-slate-100 p-1.5 rounded-lg text-slate-600 active:scale-95"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))
      )}
    </div>
  );
};
