import React from 'react';
import { Star } from 'lucide-react';
import { useFarmerContext } from '../../context/FarmerContext';

export const RatingDistribution = () => {
  const { realReviews = [] } = useFarmerContext();
  
  const total = realReviews.length;
  const distribution = [5, 4, 3, 2, 1].map(star => {
    const count = realReviews.filter(r => r.rating === star).length;
    const percent = total > 0 ? (count / total * 100).toFixed(1) : 0;
    return { star, count, percent };
  });

  const avgRating = total > 0 ? (realReviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : "0.0";

  return (
    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 h-full shadow-2xl flex flex-col opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
      <h3 className="text-xl font-bold text-white mb-10 tracking-tight">Rating Distribution</h3>
      
      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Left Side: Progress Bars */}
        <div className="flex-1 w-full space-y-4">
          {distribution.map((item, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className="flex items-center gap-1 w-12 shrink-0">
                <span className="text-xs font-black text-white/40">{item.star}</span>
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              </div>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${
                    item.star >= 4 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 
                    item.star === 3 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 
                    'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                  }`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
              <div className="w-20 text-right shrink-0">
                <span className="text-[10px] font-black text-white/40">{item.count} ({item.percent}%)</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Donut Summary */}
        <div className="relative w-48 h-48 group">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="12" strokeOpacity="0.05" />
            <circle 
              cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="12" 
              strokeDasharray="251.2" strokeDashoffset={total > 0 ? 251.2 * (1 - (parseFloat(avgRating)/5)) : 251.2} 
              className="transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
             <p className="text-3xl font-black text-white tracking-tighter">{avgRating}</p>
             <div className="flex items-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={`w-2.5 h-2.5 ${s <= Math.round(parseFloat(avgRating)) ? 'text-yellow-500 fill-yellow-500' : 'text-white/10'}`} />
                ))}
             </div>
             <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 mt-2 leading-none">Average Rating</p>
          </div>
        </div>
      </div>

      {/* Sentiment Summary Bottom */}
      <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/5">
         <SentimentStat label="Positive" value={distribution.filter(d => d.star >= 4).reduce((s, d) => s + parseFloat(d.percent), 0).toFixed(1) + "%"} color="text-green-400" />
         <SentimentStat label="Neutral" value={distribution.find(d => d.star === 3).percent + "%"} color="text-yellow-400" />
         <SentimentStat label="Negative" value={distribution.filter(d => d.star <= 2).reduce((s, d) => s + parseFloat(d.percent), 0).toFixed(1) + "%"} color="text-red-400" />
      </div>
    </div>
  );
};

const SentimentStat = ({ label, value, color }) => (
  <div className="text-center space-y-1">
    <p className={`text-sm font-black ${color}`}>{value}</p>
    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{label}</p>
  </div>
);
