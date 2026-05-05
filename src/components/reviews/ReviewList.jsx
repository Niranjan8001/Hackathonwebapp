import React from 'react';
import { Star, MoreVertical, Reply, Eye, Check, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const RatingStars = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} 
      />
    ))}
  </div>
);

export const ReviewList = ({ reviews }) => {
  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl overflow-hidden flex flex-col">
      <div className="flex-grow">
        {reviews.map((review, index) => (
          <div key={review.id} className={`p-6 hover:bg-slate-50/50 dark:hover:bg-[#0F172A]/30 transition-colors ${index !== reviews.length - 1 ? 'border-b border-slate-100 dark:border-[#334155]' : ''}`}>
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
              
              {/* Left Column: Customer & Review */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-4 mb-3">
                  <img src={review.customerImg} alt={review.customer} className="w-12 h-12 rounded-full object-cover shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-slate-800 dark:text-[#F8FAFC]">{review.customer}</p>
                      <span className="bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded">Verified Buyer</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <RatingStars rating={review.rating} />
                      <span className="text-[11px] text-slate-400 dark:text-[#94A3B8]">• {review.time}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
                  {review.text}
                </p>
              </div>

              {/* Middle Column: Product Info */}
              <div className="xl:w-[240px] flex shrink-0 items-center gap-3 bg-slate-50 dark:bg-[#0F172A] p-3 rounded-xl border border-slate-100 dark:border-[#334155]/50">
                <img src={review.img} alt={review.product} className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-[#F8FAFC]">{review.product}</p>
                  <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5">{review.weight}</p>
                </div>
              </div>

              {/* Right Column: Status & Actions */}
              <div className="xl:w-[140px] shrink-0 flex xl:flex-col items-center xl:items-end justify-between xl:justify-center gap-4">
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 ${
                    review.status === 'Published' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                  }`}>
                    {review.status}
                  </span>
                  <p className="text-[10px] text-slate-400 dark:text-[#94A3B8]">{review.date}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  {review.status === 'Pending' ? (
                    <>
                      <button className="p-1.5 rounded-md bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-400 transition-colors">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-md border border-slate-200 dark:border-[#334155] text-slate-400 hover:text-slate-600 dark:hover:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#1E293B]">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button className="p-1.5 rounded-md border border-slate-200 dark:border-[#334155] text-slate-400 hover:text-slate-600 dark:hover:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#1E293B] transition-colors">
                      <Reply className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button className="p-1.5 rounded-md border border-slate-200 dark:border-[#334155] text-slate-400 hover:text-slate-600 dark:hover:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#1E293B]">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 dark:bg-[#0F172A]/30">
        <p className="text-sm text-slate-500 dark:text-[#94A3B8]">
          Showing <span className="font-medium text-slate-800 dark:text-[#F8FAFC]">1</span> to <span className="font-medium text-slate-800 dark:text-[#F8FAFC]">5</span> of <span className="font-medium text-slate-800 dark:text-[#F8FAFC]">48</span> reviews
        </p>
        
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-md border border-slate-200 dark:border-[#334155] text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1E293B] transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-green-600 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-transparent text-slate-600 dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-sm font-medium transition-colors">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-transparent text-slate-600 dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-sm font-medium transition-colors">3</button>
          <span className="text-slate-400 px-1">...</span>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-transparent text-slate-600 dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-sm font-medium transition-colors">10</button>
          
          <button className="p-1.5 rounded-md border border-slate-200 dark:border-[#334155] text-slate-600 dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E293B] transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <button className="flex items-center gap-2 ml-4 p-1.5 px-3 rounded-md border border-slate-200 dark:border-[#334155] text-sm text-slate-600 dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E293B] transition-colors">
            <span>5 / page</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
