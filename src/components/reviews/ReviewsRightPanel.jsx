import React from 'react';
import { Star, ChevronDown, ArrowRight, RotateCcw, XCircle, Mail } from 'lucide-react';

const RatingBar = ({ label, percentage, count }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs text-slate-500 dark:text-[#94A3B8] w-8">{label}</span>
    <div className="flex-1 h-2 bg-slate-100 dark:bg-[#0F172A] rounded-full overflow-hidden">
      <div 
        className="h-full bg-green-600 dark:bg-green-500 rounded-full" 
        style={{ width: `${percentage}%` }}
      />
    </div>
    <span className="text-[10px] text-slate-500 dark:text-[#94A3B8] w-12 text-right">{count} ({percentage}%)</span>
  </div>
);

const ProductRating = ({ img, name, rating, count }) => (
  <div className="flex items-center gap-3">
    <img src={img} alt={name} className="w-10 h-10 rounded-lg object-cover border border-slate-100 dark:border-[#334155] shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-xs font-bold text-slate-800 dark:text-[#F8FAFC] truncate">{name}</p>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className="text-[11px] font-bold text-slate-700 dark:text-[#CBD5E1]">{rating}</span>
        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
        <span className="text-[10px] text-slate-400 dark:text-[#94A3B8]">({count})</span>
      </div>
    </div>
  </div>
);

export const ReviewsRightPanel = () => {
  return (
    <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
      
      {/* Review Summary */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 dark:text-[#F8FAFC]">Review Summary</h3>
          <button className="text-xs font-medium text-green-600 dark:text-green-400 hover:underline">View All</button>
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="text-4xl font-bold text-slate-800 dark:text-[#F8FAFC]">4.7</span>
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-1 font-medium">Average Rating</p>
            <p className="text-[10px] text-slate-400 dark:text-[#94A3B8]">Based on 48 reviews</p>
          </div>
          <div className="flex-1 space-y-2.5">
            <RatingBar label="5 Star" percentage={75} count={36} />
            <RatingBar label="4 Star" percentage={17} count={8} />
            <RatingBar label="3 Star" percentage={6} count={3} />
            <RatingBar label="2 Star" percentage={2} count={1} />
            <RatingBar label="1 Star" percentage={0} count={0} />
          </div>
        </div>
      </div>

      {/* Reviews by Product */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 dark:text-[#F8FAFC]">Reviews by Product</h3>
          <button className="text-xs font-medium text-green-600 dark:text-green-400 hover:underline">View Report</button>
        </div>
        <div className="space-y-4">
          <ProductRating img="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&h=100&fit=crop" name="Farm Fresh Tomatoes" rating={4.8} count={18} />
          <ProductRating img="https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=100&h=100&fit=crop" name="Potatoes" rating={4.6} count={12} />
          <ProductRating img="https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=100&h=100&fit=crop" name="Cucumbers" rating={4.5} count={10} />
          <ProductRating img="https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=100&h=100&fit=crop" name="Red Onions" rating={4.4} count={6} />
          <ProductRating img="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&h=100&fit=crop" name="Whole Wheat" rating={4.9} count={2} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl p-5">
        <h3 className="font-bold text-slate-800 dark:text-[#F8FAFC] mb-4">Quick Actions</h3>
        <div className="space-y-1">
          <button className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-colors w-full text-left group">
            <div className="text-green-600 dark:text-green-400 mt-0.5">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-800 dark:text-[#F8FAFC]">Reply to Pending Reviews</p>
              <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5">Respond to 5 pending reviews</p>
            </div>
          </button>
          <button className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-colors w-full text-left group">
            <div className="text-green-600 dark:text-green-400 mt-0.5">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-800 dark:text-[#F8FAFC]">Hide Inappropriate Reviews</p>
              <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5">Manage hidden or reported reviews</p>
            </div>
          </button>
          <button className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-colors w-full text-left group">
            <div className="text-green-600 dark:text-green-400 mt-0.5">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-800 dark:text-[#F8FAFC]">Request a Review</p>
              <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5">Send review requests to customers</p>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
};
