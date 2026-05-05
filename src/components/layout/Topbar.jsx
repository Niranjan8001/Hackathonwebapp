import React from 'react';
import { useFarmerContext } from '../../context/FarmerContext';
import { Leaf } from 'lucide-react';

export const Topbar = ({ title }) => {
  const { language, setLanguage } = useFarmerContext();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-green-50 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2 text-green-700">
        <Leaf className="w-6 h-6 fill-current" />
        <h1 className="font-bold text-lg">{title || 'FarmDirect'}</h1>
      </div>
      
      <button 
        onClick={() => setLanguage(language === 'English' ? 'Hindi' : 'English')}
        className="text-xs font-semibold bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-200"
      >
        {language === 'English' ? 'A/अ' : 'अ/A'}
      </button>
    </header>
  );
};
