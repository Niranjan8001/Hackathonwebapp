import React from 'react';
import { Star } from 'lucide-react';
import { useFarmerContext } from '../../context/FarmerContext';

export const RecentReviews = () => {
  const { realReviews = [] } = useFarmerContext();
  const recent = realReviews.slice(0, 3);

  return (
    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 h-full shadow-2xl flex flex-col opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-white tracking-tight">Recent Reviews</h3>
        <button className="text-[10px] font-black uppercase tracking-widest text-green-400 hover:text-green-300 transition-colors">View All Reviews</button>
      </div>

      <div className="space-y-6 flex-1">
        {recent.length > 0 ? recent.map((review, i) => (
          <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
             <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 shrink-0">
                <img src={review.product?.images?.[0] || "https://images.unsplash.com/photo-1594488310394-29b0db24ca39?w=100&h=100&fit=crop"} alt="Product" className="w-full h-full object-cover" />
             </div>
             <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                   <p className="text-xs font-bold text-white group-hover:text-green-400 transition-colors">{review.product?.title || 'Product'}</p>
                   <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${review.status === 'replied' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {review.status}
                   </span>
                </div>
                <div className="flex items-center gap-2">
                   <p className="text-[10px] font-medium text-white/40">{review.customer?.name || 'Customer'}</p>
                   <span className="text-[10px] text-white/20">•</span>
                   <p className="text-[10px] text-white/20 font-medium">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-0.5 my-1">
                   {[1, 2, 3, 4, 5].map(s => (
                     <Star key={s} className={`w-2.5 h-2.5 ${s <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-white/10'}`} />
                   ))}
                </div>
                <p className="text-[11px] text-white/60 line-clamp-2 leading-relaxed">"{review.comment}"</p>
             </div>
          </div>
        )) : (
          <div className="flex-1 flex flex-col items-center justify-center py-12 opacity-20 text-center grayscale">
             <Star className="w-12 h-12 mb-4" />
             <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">No reviews yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
