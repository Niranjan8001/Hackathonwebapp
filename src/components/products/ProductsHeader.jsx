import React from 'react';
import { Download, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProductsHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-[#F8FAFC]">My Products</h2>
        <p className="text-slate-500 dark:text-[#94A3B8] mt-1 text-sm">Manage all your farm products in one place.</p>
      </div>
      
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-slate-700 dark:text-[#F8FAFC] px-4 py-2.5 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-colors shadow-sm text-sm">
          <Download className="w-4 h-4" />
          <span>Import Products</span>
        </button>
        <button 
          onClick={() => navigate('/add-product')}
          className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm dark:shadow-green-500/20 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>
    </div>
  );
};
