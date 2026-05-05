import React from 'react';
import { Store, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BottomBanner = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-xl max-xs:p-3 p-5 max-xs:mt-3 mt-6 flex items-center justify-between max-xs:gap-3 gap-4">
      <div className="flex items-center gap-4 max-xs:gap-2.5 min-w-0">
        <div className="bg-green-100 dark:bg-green-800/40 max-xs:p-2 p-2.5 rounded-full text-green-600 dark:text-green-400 flex-shrink-0">
          <Store className="max-xs:w-4 max-xs:h-4 w-6 h-6" />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-slate-800 dark:text-[#F8FAFC] max-xs:text-xs text-base">Keep your store updated</h3>
          <p className="max-xs:text-[10px] text-sm text-slate-600 dark:text-[#94A3B8] mt-0.5 max-xs:line-clamp-1">Add new products regularly to get more orders and visibility.</p>
        </div>
      </div>
      <button onClick={() => navigate('/add-product')} className="bg-green-600 hover:bg-green-700 text-white max-xs:px-3 max-xs:py-2 px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm dark:shadow-green-500/20 flex-shrink-0 max-xs:text-xs">
        <span className="max-xs:hidden">Add Product</span>
        <Plus className="w-4 h-4 hidden max-xs:block" />
      </button>
    </div>
  );
};
