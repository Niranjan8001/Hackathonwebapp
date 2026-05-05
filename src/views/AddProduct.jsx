import React, { useState } from 'react';
import { useFarmerContext } from '../context/FarmerContext';
import { DesktopLayout } from '../components/layout/DesktopLayout';
import { 
  Leaf, 
  IndianRupee, 
  Scale, 
  CloudUpload, 
  Package, 
  Image as ImageIcon, 
  Info, 
  Coins, 
  Clock,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Breadcrumbs = () => {
  const navigate = useNavigate();
  return (
    <nav className="flex items-center gap-2 mb-6 text-sm font-medium">
      <button 
        onClick={() => navigate('/inventory')}
        className="text-green-500 hover:text-green-600 transition-colors"
      >
        My Products
      </button>
      <ChevronRight className="w-4 h-4 text-slate-500" />
      <span className="text-slate-500">Add Product</span>
    </nav>
  );
};

const TipItem = ({ icon: Icon, title, description }) => (
  <div className="flex gap-4 p-2">
    <div className="bg-green-500/10 p-2 rounded-lg text-green-500 shrink-0">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</h4>
      <p className="text-xs text-slate-500 mt-0.5">{description}</p>
    </div>
  </div>
);

export const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useFarmerContext();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: ''
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.quantity) return;

    try {
      setLoading(true);
      setError(null);
      
      await addProduct({
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      });

      setSuccess(true);
      
      // Redirect after a short delay to show success
      setTimeout(() => {
        navigate('/inventory');
      }, 2000);
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Failed to list product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DesktopLayout>
      <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto">
        <Breadcrumbs />
        
        <div className="mb-8" />

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-6 py-4 rounded-xl mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-semibold">Product listed successfully! Redirecting...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-xl mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <Info className="w-6 h-6" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1E293B]/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Product Name</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter product name"
                    className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Category</label>
                <div className="relative">
                  <select 
                    className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-slate-800 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all cursor-pointer"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="" disabled>Select category</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Dairy">Dairy</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Price (₹ per kg)</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <IndianRupee className="w-5 h-5" />
                    </div>
                    <input 
                      type="number" 
                      placeholder="Enter price"
                      className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Quantity (kg)</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Scale className="w-5 h-5" />
                    </div>
                    <input 
                      type="number" 
                      placeholder="Enter quantity"
                      className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Product Image</label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0F172A] group hover:border-green-500/50 transition-colors cursor-pointer">
                  <div className="bg-white dark:bg-[#1E293B] p-4 rounded-full mb-4 text-slate-400 group-hover:text-green-500 transition-colors shadow-sm">
                    <CloudUpload className="w-8 h-8" />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">Drag and drop an image here</p>
                  <p className="text-slate-500 text-sm mt-1">or tap to <span className="text-green-500 font-semibold">browse</span></p>
                  <p className="text-slate-400 dark:text-slate-600 text-xs mt-4 uppercase tracking-widest font-bold">JPG, PNG up to 5MB</p>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || success}
                className={`w-full ${loading || success ? 'bg-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-green-600/20`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Package className="w-5 h-5" />
                )}
                <span>{loading ? 'Listing...' : 'List Product'}</span>
              </button>
            </form>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1E293B]/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
              <div className="bg-green-500/10 p-3 rounded-xl text-green-500">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">Fresh produce. Fair prices.</p>
                <p className="text-xs text-slate-500 mt-1">Help your customers eat better!</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E293B]/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Tips for a great listing</h3>
              <div className="space-y-6">
                <TipItem 
                  icon={ImageIcon}
                  title="Use clear product images"
                  description="High quality images build trust"
                />
                <TipItem 
                  icon={Info}
                  title="Add accurate details"
                  description="Correct info helps avoid issues"
                />
                <TipItem 
                  icon={Coins}
                  title="Set a fair price"
                  description="Check market rates in your area"
                />
                <TipItem 
                  icon={Clock}
                  title="Keep it fresh"
                  description="Update stock and availability"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DesktopLayout>
  );
};
