import React, { useState } from 'react';
import { Star, Search, Filter, ChevronDown, Eye, MessageCircle, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFarmerContext } from '../../context/FarmerContext';

export const AllReviewsTable = () => {
  const { realReviews = [], dateRange } = useFarmerContext();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const tabs = [
    { label: 'All', count: realReviews.length },
    { label: 'Replied', count: realReviews.filter(r => r.status === 'replied').length },
    { label: 'Pending', count: realReviews.filter(r => r.status === 'pending').length },
    { label: 'Negative', count: realReviews.filter(r => r.rating <= 2).length },
  ];

  const filtered = realReviews.filter(r => {
    const reviewDate = new Date(r.createdAt);
    const matchesDate = reviewDate >= dateRange.startDate && reviewDate <= dateRange.endDate;
    if (!matchesDate) return false;
    
    if (activeTab === 'Replied') return r.status === 'replied';
    if (activeTab === 'Pending') return r.status === 'pending';
    if (activeTab === 'Negative') return r.rating <= 2;
    return true;
  }).filter(r => {
    return r.customer?.name?.toLowerCase().includes(search.toLowerCase()) || 
           r.comment?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 h-full shadow-2xl flex flex-col opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
      {/* Table Header / Tabs */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
          {tabs.map(tab => (
            <button 
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.label ? 'bg-white/10 text-white shadow-xl' : 'text-white/20 hover:text-white/40'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group flex-1 xl:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-green-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search reviews..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-6 text-xs font-medium focus:outline-none focus:border-green-500/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 cursor-pointer hover:bg-white/10 transition-all">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 cursor-pointer hover:bg-white/10 transition-all">
            <span>Sort: Newest</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-x-auto custom-scrollbar min-h-[400px]">
        <table className="w-full text-left border-separate border-spacing-y-4">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-widest text-white/20">
              <th className="pb-4 pl-6">Customer</th>
              <th className="pb-4">Product</th>
              <th className="pb-4">Rating</th>
              <th className="pb-4">Review Text</th>
              <th className="pb-4">Date</th>
              <th className="pb-4">Status</th>
              <th className="pb-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map((review, i) => (
              <tr key={i} className="group bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                <td className="py-5 pl-6 rounded-l-[2rem]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.customer?.name}`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-0.5">
                       <p className="text-xs font-black text-white group-hover:text-green-400 transition-colors">{review.customer?.name || 'Customer'}</p>
                       <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Verified Buyer</p>
                    </div>
                  </div>
                </td>
                <td className="py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/5 bg-white/5">
                       <img src={review.product?.images?.[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[11px] font-bold text-white/60">{review.product?.title}</p>
                  </div>
                </td>
                <td className="py-5">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-white/10'}`} />
                    ))}
                  </div>
                </td>
                <td className="py-5 max-w-[300px]">
                   <p className="text-[11px] text-white/60 line-clamp-2 leading-relaxed font-medium">"{review.comment}"</p>
                </td>
                <td className="py-5 whitespace-nowrap">
                   <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="py-5">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${
                    review.status === 'replied' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {review.status}
                  </span>
                </td>
                <td className="py-5 pr-6 rounded-r-[2rem] text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-white/40 hover:text-white group/btn">
                       <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    </button>
                    <button className="p-2 bg-white/5 hover:bg-green-500/10 border border-white/10 hover:border-green-500/20 rounded-xl transition-all text-white/40 hover:text-green-400 group/btn">
                       <MessageCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    </button>
                    <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-white/40 hover:text-white group/btn">
                       <MoreVertical className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="py-32 text-center opacity-20">
                   <Star className="w-12 h-12 mx-auto mb-4" />
                   <p className="text-xs font-black uppercase tracking-[0.2em]">No reviews match your criteria</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between mt-10 pt-8 border-t border-white/5">
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Showing 1 to {filtered.length} of {filtered.length} reviews</p>
        <div className="flex items-center gap-2">
          <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/20 hover:text-white transition-all disabled:opacity-20" disabled>
             <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="bg-green-500 text-white w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black shadow-lg shadow-green-500/20">1</div>
          <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/20 hover:text-white transition-all disabled:opacity-20" disabled>
             <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
