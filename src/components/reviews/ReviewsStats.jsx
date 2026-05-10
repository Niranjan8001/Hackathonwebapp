import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Smile, RotateCcw, Clock, ArrowUpRight } from 'lucide-react';
import { useFarmerContext } from '../../context/FarmerContext';

const CountUp = ({ end, decimals = 0, suffix = "" }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(decimals === 0 ? Math.floor(start) : parseFloat(start.toFixed(decimals)));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return <span>{count}{suffix}</span>;
};

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-white/5 rounded-2xl ${className}`} />
);

export const ReviewsStats = () => {
  const { realReviews = [], earningsLoading } = useFarmerContext();

  if (earningsLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-32" />)}
      </div>
    );
  }

  const totalReviews = realReviews.length;
  const avgRating = totalReviews > 0 ? realReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
  const positiveReviews = realReviews.filter(r => r.rating >= 4).length;
  const pendingReviews = realReviews.filter(r => r.status === 'pending').length;
  const responseRate = totalReviews > 0 ? ((totalReviews - pendingReviews) / totalReviews * 100).toFixed(0) : 0;

  const now = new Date();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisMonthReviewsCount = realReviews.filter(r => new Date(r.createdAt) >= thisMonthStart).length;
  const lastMonthReviewsCount = realReviews.filter(r => {
    const d = new Date(r.createdAt);
    return d >= lastMonthStart && d < thisMonthStart;
  }).length;

  let reviewTrend = null;
  if (lastMonthReviewsCount > 0) {
    const change = ((thisMonthReviewsCount - lastMonthReviewsCount) / lastMonthReviewsCount * 100);
    reviewTrend = `${change >= 0 ? '+' : ''}${change.toFixed(1)}% from last month`;
  } else {
    reviewTrend = 'Insufficient Data';
  }

  const stats = [
    { label: 'Average Rating', value: avgRating, decimals: 1, icon: <Star className="text-yellow-400" />, sub: `Based on ${totalReviews} reviews`, color: 'text-yellow-400' },
    { label: 'Total Reviews', value: totalReviews, icon: <MessageSquare className="text-green-400" />, trend: reviewTrend, color: 'text-green-400' },
    { label: 'Positive Reviews', value: positiveReviews, icon: <Smile className="text-green-400" />, sub: `${totalReviews > 0 ? (positiveReviews/totalReviews*100).toFixed(1) : 0}% of total reviews`, color: 'text-green-400' },
    { label: 'Response Rate', value: responseRate, suffix: "%", icon: <RotateCcw className="text-blue-400" />, sub: 'Usually responds in 2h', color: 'text-blue-400' },
    { label: 'Pending Reviews', value: pendingReviews, icon: <Clock className="text-amber-400" />, sub: 'Awaiting your response', color: 'text-amber-400' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
      {stats.map((stat, i) => (
        <div key={i} className="bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-3xl p-6 hover:bg-white/[0.05] transition-all group relative overflow-hidden flex flex-col justify-between min-h-[140px] shadow-2xl">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
               {React.cloneElement(stat.icon, { className: 'w-5 h-5' })}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 leading-tight">{stat.label}</p>
          </div>
          
          <div className="mt-4 relative z-10">
            <div className="flex items-end gap-2">
              <p className="text-2xl font-black text-white tracking-tighter">
                <CountUp end={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
              </p>
              {stat.trend && (
                <div className="flex items-center gap-1 text-[8px] font-black uppercase text-green-400 mb-1.5">
                   <ArrowUpRight className="w-2.5 h-2.5" /> {stat.trend}
                </div>
              )}
            </div>
            <p className={`text-[9px] font-bold mt-1 tracking-wide ${stat.color} opacity-60 uppercase`}>{stat.sub}</p>
          </div>
          
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/5 blur-3xl rounded-full group-hover:bg-white/10 transition-colors" />
        </div>
      ))}
    </div>
  );
};
