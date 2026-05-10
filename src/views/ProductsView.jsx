import React, { useState, useMemo, useEffect } from 'react';
import { useFarmerContext } from '../context/FarmerContext';
import { GlassLayout } from '../components/layout/GlassLayout';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit3, 
  ChevronLeft, 
  ChevronRight,
  Package,
  Boxes,
  Eye,
  TrendingUp,

} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProductsView = () => {
  const { products, loading, fetchProducts } = useFarmerContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const normalizedProducts = useMemo(() => {
    return products.map(p => ({
      ...p,
      id: p._id || p.id,
      name: p.title || p.name,
      image: p.images?.[0] || p.image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop',
    }));
  }, [products]);

  const inStockCount = normalizedProducts.filter(p => p.stock > 0 || p.status === 'In Stock').length;
  // Estimate views and sales based on sold amount if needed, or default to 0
  const totalSalesValue = normalizedProducts.reduce((acc, p) => {
    const sold = parseFloat(p.sold) || 0;
    const price = parseFloat(p.price) || 0;
    return acc + (sold * price);
  }, 0);

  const totalViewsValue = normalizedProducts.reduce((acc, p) => acc + (parseInt(p.views) || 0), 0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return normalizedProducts.filter(product => {
      const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All Categories' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'All Status' || product.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [normalizedProducts, searchQuery, categoryFilter, statusFilter]);

  return (
    <GlassLayout>
      <div className="h-full flex flex-col gap-6 overflow-hidden">
        
        <div className="shrink-0" />

        {/* 📊 TOP STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          <StatCard 
            icon={<Package className="text-green-400" />} 
            label="Total Products" 
            value={products.length.toString()} 
            trend="Active listings" 
            trendColor="text-white/40"
          />
          <StatCard 
            icon={<Boxes className="text-orange-400" />} 
            label="In Stock" 
            value={inStockCount.toString()} 
            trend="Products available" 
            trendColor="text-white/40"
          />
          <StatCard 
            icon={<Eye className="text-blue-400" />} 
            label="Total Views" 
            value={totalViewsValue.toLocaleString()} 
            trend="Real-time tracking" 
            trendColor="text-white/40"
          />
          <StatCard 
            icon={<TrendingUp className="text-green-400" />} 
            label="Total Sales" 
            value={`₹${totalSalesValue.toLocaleString()}`} 
            trend="From confirmed orders" 
            trendColor="text-white/40"
          />
        </div>

        {/* 📦 PRODUCTS LIST TABLE CARD */}
        <div className="flex-1 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl flex flex-col min-h-0">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 shrink-0">
            <h3 className="text-xl font-bold">Products List</h3>
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type="text" 
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all"
                />
              </div>
              
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option className="bg-[#0F172A]">All Categories</option>
                <option className="bg-[#0F172A]">Grains</option>
                <option className="bg-[#0F172A]">Vegetables</option>
                <option className="bg-[#0F172A]">Oils</option>
              </select>

              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option className="bg-[#0F172A]">All Status</option>
                <option className="bg-[#0F172A]">In Stock</option>
                <option className="bg-[#0F172A]">Low Stock</option>
                <option className="bg-[#0F172A]">Out of Stock</option>
              </select>

              <button 
                onClick={() => navigate('/add-product')}
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-green-500/20 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* TABLE AREA */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
            <table className="w-full border-separate border-spacing-y-3">
              <thead className="text-[10px] font-black uppercase tracking-widest text-white/20 sticky top-0 bg-transparent backdrop-blur-md z-10">
                <tr>
                  <th className="pb-4 text-left pl-6 font-black">Product</th>
                  <th className="pb-4 text-left font-black">Category</th>
                  <th className="pb-4 text-left font-black">Price</th>
                  <th className="pb-4 text-left font-black">Stock</th>
                  <th className="pb-4 text-left font-black">Sold</th>
                  <th className="pb-4 text-left font-black">Status</th>
                  <th className="pb-4 text-right pr-6 font-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? filteredProducts.map((p) => (
                  <ProductRow key={p.id} product={p} />
                )) : (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="flex flex-col items-center justify-center opacity-50">
                        <Package className="w-8 h-8 mb-3" />
                        <p className="text-sm font-bold uppercase tracking-widest">No products found</p>
                        <p className="text-xs mt-1">Add your first product to start selling</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="mt-8 flex justify-between items-center shrink-0 border-t border-white/5 pt-6">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
              Showing {filteredProducts.length > 0 ? 1 : 0} to {filteredProducts.length} of {products.length} products
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all"><ChevronLeft className="w-4 h-4" /></button>
              <button className="w-8 h-8 flex items-center justify-center bg-green-500 text-white text-[10px] font-black rounded-lg shadow-lg shadow-green-500/20">1</button>
              <button className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/40 hover:text-white text-[10px] font-black rounded-lg transition-all">2</button>
              <button className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/40 hover:text-white text-[10px] font-black rounded-lg transition-all">3</button>
              <span className="text-white/20 px-1">...</span>
              <button className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/40 hover:text-white text-[10px] font-black rounded-lg transition-all">5</button>
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

        </div>

      </div>
    </GlassLayout>
  );
};

const StatCard = ({ icon, label, value, trend, trendColor }) => (
  <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] p-6 flex items-center gap-6 transition-all hover:bg-white/10 shadow-xl group">
    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { className: 'w-7 h-7' })}
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{label}</p>
      <p className="text-2xl font-black">{value}</p>
      <p className={`text-[10px] font-bold mt-1 ${trendColor}`}>
        {trend}
      </p>
    </div>
  </div>
);

const ProductRow = ({ product }) => {
  const isOut = product.stock <= 0 || product.status === 'Out of Stock';
  const isLow = !isOut && (product.quantity <= 30 || product.status === 'Low Stock');

  return (
    <tr className="bg-white/[0.02] hover:bg-white/[0.05] transition-all group">
      <td className="py-4 pl-6 rounded-l-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold">{product.name}</span>

            </div>
            <p className="text-[10px] text-white/40 font-medium max-w-[200px] truncate">High quality farm-fresh products.</p>
          </div>
        </div>
      </td>
      <td className="py-4">
        <span className="text-xs font-bold text-white/60">{product.category}</span>
      </td>
      <td className="py-4">
        <span className="text-xs font-black">
          {String(product.price).startsWith('₹') ? product.price : `₹${product.price}`}
        </span>
        <span className="text-[10px] text-white/20 ml-1">{product.unit}</span>
      </td>
      <td className="py-4">
        <span className={`text-xs font-black ${isOut ? 'text-red-400' : isLow ? 'text-orange-400' : 'text-green-400'}`}>
          {product.stock}
        </span>
      </td>
      <td className="py-4">
        <span className="text-xs font-bold text-white/60">{product.sold || 0} {product.unit || 'units'}</span>
      </td>
      <td className="py-4">
        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
          isOut ? 'bg-red-500/10 text-red-400' :
          isLow ? 'bg-orange-500/10 text-orange-400' :
          'bg-green-500/10 text-green-400'
        }`}>
          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
        </span>
      </td>
      <td className="py-4 pr-6 rounded-r-2xl text-right">
        <div className="flex justify-end gap-2">
          <button className="p-2 bg-white/5 hover:bg-green-500 hover:text-white rounded-lg text-white/40 transition-all" title="Edit">
            <Edit3 className="w-4 h-4" />
          </button>
          <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 transition-all">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};
