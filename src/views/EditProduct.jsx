import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Package, 
  Tag, 
  Layout, 
  Image as ImageIcon, 
  Truck, 
  Calendar, 
  ChevronRight, 
  Plus,
  X,
  Upload,
  Eye,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  Scale,
  AlignLeft,
  FileText,
  Hash,
  Leaf,
  ShieldCheck,
  Sprout,
  Award
} from 'lucide-react';
import { useFarmerContext } from '../context/FarmerContext';
import { GlassLayout } from '../components/layout/GlassLayout';
import { apiService } from '../services/apiService';

const FALLBACK_CATEGORIES = [
  { _id: 'f1', name: 'Fruits' },
  { _id: 'f2', name: 'Vegetables' },
  { _id: 'f3', name: 'Grains and Pulses' },
  { _id: 'f4', name: 'Commercial crops' },
  { _id: 'f5', name: 'Dairy' },
  { _id: 'f7', name: 'Spices' }
];

const AVAILABLE_TAGS = [
  { id: 'organic', label: 'Organic farming', icon: Leaf },
  { id: 'chemical_free', label: 'Chemical free', icon: ShieldCheck },
  { id: 'fresh', label: 'Fresh harvest', icon: Sprout },
  { id: 'low_stock', label: 'Low stock', icon: AlertCircle },
  { id: 'best_selling', label: 'Best selling', icon: Award },
];

export const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useFarmerContext();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    shortDescription: '',
    price: '',
    stock: '',
    unit: 'kg',
    minOrderQuantity: 1,
    sku: '',
    grade: 'Grade A',
    harvestDate: '',
    storageInstructions: '',
    season: 'all_season',
    tags: [],
    isVisible: true,
    deliveryType: 'Home Delivery',
    deliveryFee: '0',
    deliveryTime: '2-3 Days',
  });


  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiService.getCategories();
        if (res.success && res.data && res.data.length > 0) {
          setCategories(res.data);
        } else {
          setCategories(FALLBACK_CATEGORIES);
        }
      } catch (err) {
        setCategories(FALLBACK_CATEGORIES);
      } finally {
        setCategoriesLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await apiService.getProductById(id);
        if (res.success && res.data) {
          const p = res.data;
          setFormData({
            title: p.title || '',
            category: p.category || '',
            description: p.description || '',
            shortDescription: p.shortDescription || '',
            price: p.price || '',
            stock: p.stock || '',
            unit: p.unit || 'kg',
            minOrderQuantity: p.minOrderQuantity || 1,
            sku: p.sku || '',
            grade: p.grade || 'Grade A',
            harvestDate: p.harvestDate ? new Date(p.harvestDate).toISOString().split('T')[0] : '',
            storageInstructions: p.storageInstructions || '',
            season: p.season || 'all_season',
            tags: p.tags || [],
            isVisible: p.isVisible !== false,
            deliveryType: p.deliveryType || 'Home Delivery',
            deliveryFee: p.deliveryFee || '0',
            deliveryTime: p.deliveryTime || '2-3 Days',
          });
          
          if (p.images && p.images.length > 0) {
            setExistingImages(p.images);
            setImagePreviews(p.images);
          }
        } else {
          setError('Failed to load product details.');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch product.');
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleTag = (tagLabel) => {
    setFormData(prev => {
      const isSelected = prev.tags.includes(tagLabel);
      if (isSelected) {
        return { ...prev, tags: prev.tags.filter(t => t !== tagLabel) };
      } else {
        return { ...prev, tags: [...prev.tags, tagLabel] };
      }
    });
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    // Overwrite existing images visually when new ones are selected
    setImageFiles(files);
    setExistingImages([]);

    const previews = [];
    let loadedCount = 0;
    
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews[index] = reader.result;
        loadedCount++;
        if (loadedCount === files.length) {
            setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    if (imageFiles.length > 0) {
      setImageFiles(prev => prev.filter((_, i) => i !== index));
    } else {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.price || !formData.stock) {
      setError("Please fill all required fields (Name, Category, Price, Stock).");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });
      
      if (imageFiles.length > 0) {
        imageFiles.forEach(file => {
          data.append('images', file);
        });
      } else if (existingImages.length > 0) {
        data.append('existingImages', JSON.stringify(existingImages));
      }

      const res = await apiService.updateProduct(id, data, token);
      if (res.success) {
        navigate('/inventory');
      }
    } catch (err) {
      setError(err.message || "Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <GlassLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
        </div>
      </GlassLayout>
    );
  }

  return (
    <GlassLayout>
      <div className="max-w-[1600px] mx-auto pb-12 animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>
        
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-2 mb-10">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
             <span className="hover:text-green-400 cursor-pointer transition-colors" onClick={() => navigate('/dashboard')}>Dashboard</span>
             <ChevronRight className="w-3 h-3" />
             <span className="hover:text-green-400 cursor-pointer transition-colors" onClick={() => navigate('/inventory')}>My Products</span>
             <ChevronRight className="w-3 h-3" />
             <span className="text-white/40">Edit Product</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="space-y-1">
                <h1 className="text-4xl font-black text-white tracking-tight">Edit Product</h1>
                <p className="text-sm text-white/30 font-medium tracking-wide">Update your product details and inventory</p>
             </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: BASIC INFO */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* PRODUCT INFORMATION CARD */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20 text-green-400">
                     <Package className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                     <h3 className="text-lg font-bold text-white">Product Information</h3>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Product Name *</label>
                     <div className="relative group/input">
                        <input 
                           type="text" name="title" value={formData.title} onChange={handleChange}
                           placeholder="e.g., Fresh Tomatoes"
                           maxLength={100}
                           className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-green-500/50 transition-all placeholder:text-white/10"
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Category *</label>
                         <div className="relative">
                            <select 
                               name="category" value={formData.category} onChange={handleChange}
                               className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm font-bold text-white focus:outline-none focus:border-green-500/50 transition-all appearance-none cursor-pointer"
                            >
                               <option value="" className="bg-[#0F172A]">Select category</option>
                               {categories.map(cat => (
                                 <option key={cat._id} value={cat.name} className="bg-[#0F172A]">{cat.name}</option>
                               ))}
                            </select>
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 rotate-90 pointer-events-none" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Location *</label>
                         <div className="relative">
                            <input 
                               type="text" 
                               value={currentUser?.state || 'Not specified'} 
                               readOnly
                               className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white/50 cursor-not-allowed focus:outline-none"
                            />
                         </div>
                      </div>
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between items-center">
                         <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Detailed Description</label>
                         <span className="text-[10px] text-white/30">{formData.description.length}/500</span>
                     </div>
                     <textarea 
                        name="description" value={formData.description} onChange={handleChange}
                        placeholder="Provide detailed information about quality, origin, etc."
                        maxLength={500}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-green-500/50 transition-all placeholder:text-white/10 min-h-[120px] resize-none"
                     />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Season</label>
                        <select 
                           name="season" value={formData.season} onChange={handleChange}
                           className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-green-500/50 transition-all appearance-none cursor-pointer"
                        >
                           <option value="all_season" className="bg-[#0F172A]">All Season</option>
                           <option value="summer" className="bg-[#0F172A]">Summer</option>
                           <option value="winter" className="bg-[#0F172A]">Winter</option>
                           <option value="monsoon" className="bg-[#0F172A]">Monsoon</option>
                           <option value="spring" className="bg-[#0F172A]">Spring</option>
                           <option value="autumn" className="bg-[#0F172A]">Autumn</option>
                        </select>
                     </div>
                  </div>

               </div>
            </div>

            {/* PRICING & INVENTORY CARD */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20 text-green-400">
                     <span className="font-black text-lg">₹</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">Pricing & Inventory</h3>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Price per unit (₹) *</label>
                     <input 
                        type="number" name="price" value={formData.price} onChange={handleChange}
                        placeholder="0.00"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-green-500/50 transition-all"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Stock Quantity *</label>
                     <input 
                        type="number" name="stock" value={formData.stock} onChange={handleChange}
                        placeholder="0"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-green-500/50 transition-all"
                     />
                  </div>

               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: IMAGE, STATUS, ADDITIONAL INFO */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* PRODUCT IMAGE CARD */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 text-blue-400">
                     <ImageIcon className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                     <h3 className="text-lg font-bold text-white">Product Image</h3>
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Upload clear images of your product</p>
                  </div>
               </div>

               <div className="space-y-6">
                  {imagePreviews.length > 0 ? (
                    <div className="space-y-4">
                       <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-black border border-white/10 relative group">
                           <img src={imagePreviews[0]} alt="Main Preview" className="w-full h-full object-cover opacity-80" />
                       </div>
                       
                       <div className="grid grid-cols-4 gap-3">
                         {imagePreviews.slice(1, 5).map((img, idx) => (
                            <div key={idx} className="aspect-square rounded-xl bg-black border border-white/10 overflow-hidden relative group">
                               <img src={img} alt="Preview" className="w-full h-full object-cover opacity-80" />
                               <button 
                                 type="button"
                                 onClick={(e) => { e.preventDefault(); removeImage(idx + 1); }}
                                 className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                               >
                                 <X className="w-3 h-3" />
                               </button>
                            </div>
                         ))}
                       </div>

                       <div className="flex items-center justify-between pt-4">
                          <button 
                            type="button"
                            onClick={() => document.getElementById('edit-image-upload').click()}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-xs font-bold text-white"
                          >
                             <Upload className="w-4 h-4" />
                             Replace Images
                          </button>
                          <button 
                            type="button"
                            onClick={() => { setImagePreviews([]); setImageFiles([]); setExistingImages([]); }}
                            className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                          >
                             Remove All
                          </button>
                       </div>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-white/10 rounded-3xl p-16 flex flex-col items-center justify-center gap-4 bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer group"
                      onClick={() => document.getElementById('edit-image-upload').click()}
                    >
                       <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="w-8 h-8 text-white/20" />
                       </div>
                       <div className="text-center">
                          <p className="text-xs font-black text-white uppercase tracking-widest mb-1">Click to upload images</p>
                          <p className="text-[10px] font-medium text-white/20">Recommended size: 1200x1200px • JPG, PNG (Max 5MB)</p>
                       </div>
                    </div>
                  )}
                  <input id="edit-image-upload" type="file" multiple className="hidden" accept="image/*" onChange={handleImageUpload} />
               </div>
            </div>

            {/* PRODUCT STATUS CARD */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20 text-green-400">
                     <Check className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Product Status</h3>
               </div>
               
               <p className="text-[11px] font-medium text-white/40 mb-4">Choose whether this product is available for sale.</p>

               <div className="flex items-center gap-4">
                  <div 
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all ${formData.isVisible ? 'bg-green-500' : 'bg-white/10'}`}
                    onClick={() => setFormData(prev => ({ ...prev, isVisible: !prev.isVisible }))}
                  >
                     <div className={`w-4 h-4 bg-white rounded-full transition-all ${formData.isVisible ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                  <span className={`text-sm font-bold ${formData.isVisible ? 'text-white' : 'text-white/40'}`}>
                     {formData.isVisible ? 'Active' : 'Inactive'}
                  </span>
               </div>
               {!formData.isVisible && (
                  <p className="text-[10px] text-white/20 mt-3 italic">* Inactive products will not be visible to customers.</p>
               )}
            </div>

            {/* ADDITIONAL INFO CARD */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20 text-purple-400">
                     <Hash className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                     <h3 className="text-lg font-bold text-white">Additional Information</h3>
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Add any additional details about your product.</p>
                  </div>
               </div>

               <div className="space-y-4">
                     <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Select Tags</label>
                     <div className="grid grid-cols-1 gap-3">
                        {AVAILABLE_TAGS.map((tag) => {
                          const Icon = tag.icon;
                          const isSelected = formData.tags.includes(tag.label);
                          return (
                            <div 
                              key={tag.id}
                              onClick={() => toggleTag(tag.label)}
                              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${
                                isSelected 
                                  ? 'bg-green-500/10 border-green-500/30' 
                                  : 'bg-white/5 border-white/10 hover:border-white/20'
                              }`}
                            >
                               <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                 isSelected ? 'bg-green-500 border-green-500' : 'border-white/20 group-hover:border-white/40'
                               }`}>
                                  {isSelected && <Check className="w-3 h-3 text-black stroke-[4]" />}
                               </div>
                               <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                 isSelected ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/20'
                               }`}>
                                  <Icon className="w-4 h-4" />
                               </div>
                               <span className={`text-xs font-bold transition-colors ${isSelected ? 'text-white' : 'text-white/40'}`}>
                                  {tag.label}
                               </span>
                            </div>
                          );
                        })}
                     </div>
                  </div>
            </div>
          </div>

          {/* ACTION BUTTONS (FLOATING / STICKY AT BOTTOM) */}
          <div className="lg:col-span-12 flex flex-col md:flex-row items-center justify-end gap-6 pt-6 border-t border-white/5">
             {error && (
               <div className="flex items-center gap-2 text-red-400 bg-red-500/10 px-6 py-3 rounded-2xl border border-red-500/20 text-[10px] font-black uppercase tracking-widest w-full md:w-auto text-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                  {error}
               </div>
             )}
             
             <button 
               type="button" 
               onClick={() => navigate('/inventory')}
               className="px-10 py-4.5 text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 w-full md:w-auto"
             >
                Cancel
             </button>
             
             <button 
               type="submit"
               disabled={loading}
               className="w-full md:w-auto px-12 py-4.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-black rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(34,197,94,0.3)] transition-all active:scale-95 group overflow-hidden relative"
             >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Save Changes</span>
                  </>
                )}
             </button>
          </div>

        </form>
      </div>
    </GlassLayout>
  );
};
