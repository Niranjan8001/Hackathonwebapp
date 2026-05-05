import React from 'react';

export const InputField = ({ label, id, ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className="border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
        {...props}
      />
    </div>
  );
};
