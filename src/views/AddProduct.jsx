import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Tag, 
  Layout, 
  Image as ImageIcon, 
  Truck, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  Plus,
  X,
  Upload,
  Eye,
  Check,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
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

export const AddProduct = () => {
  const navigate = useNavigate();
  const { updateProfile, currentUser } = useFarmerContext(); // Reusing for generic updates if needed
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    stock: '',
    grade: 'Grade A',
    harvestDate: new Date().toISOString().split('T')[0],
    storageInstructions: '',
    season: 'all_season',
    tags: [],
    isVisible: true,
    deliveryType: 'Home Delivery',
    deliveryFee: '0',
    deliveryTime: '2-3 Days',
    images: []
  });


  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiService.getCategories();
        if (res.success && res.data && res.data.length > 0) {
          setCategories(res.data);
        } else {
          console.warn("No categories found in database, using fallbacks.");
          setCategories(FALLBACK_CATEGORIES);
        }
      } catch (err) {
        console.error("Failed to fetch categories, using fallbacks:", err);
        setCategories(FALLBACK_CATEGORIES);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

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
    if (formData.images.length + files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    setImageFiles(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.price || !formData.stock || imageFiles.length === 0) {
      setError("Please fill all required fields and upload at least one image.");
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
        } else if (key !== 'images') {
          data.append(key, formData[key]);
        }
      });
      
      imageFiles.forEach(file => {
        data.append('images', file);
      });

      const res = await apiService.addProduct(data, token);
      if (res.success) {
        navigate('/inventory');
      }
    } catch (err) {
      setError(err.message || "Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassLayout>
      <div className="max-w-[1600px] mx-auto pb-12 animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>
        
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-2 mb-10">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
             <span className="hover:text-green-400 cursor-pointer transition-colors" onClick={() => navigate('/inventory')}>My Products</span>
             <ChevronRight className="w-3 h-3" />
             <span className="text-white/40">Add Product</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="space-y-1">
                <h1 className="text-4xl font-black text-white tracking-tight">Add a Product</h1>
                <p className="text-sm text-white/30 font-medium tracking-wide">List your farm product and reach more customers</p>
             </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: BASIC INFO & IMAGES */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* BASIC INFO CARD */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20 text-green-400">
                     <Package className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                     <h3 className="text-lg font-bold text-white">Basic Information</h3>
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Essential details about your product</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Product Name *</label>
                     <div className="relative group/input">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-green-400 transition-colors" />
                        <input 
                           type="text" name="title" value={formData.title} onChange={handleChange}
                           placeholder="Enter product name"
                           maxLength={100}
                           className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-white focus:outline-none focus:border-green-500/50 transition-all placeholder:text-white/10"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Category *</label>
                     <div className="relative">
                        <Layout className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <select 
                           name="category" value={formData.category} onChange={handleChange}
                           className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-white focus:outline-none focus:border-green-500/50 transition-all appearance-none cursor-pointer"
                        >
                           <option value="" className="bg-[#0F172A]">Select category</option>
                           {categories.map(cat => (
                             <option key={cat._id} value={cat.name} className="bg-[#0F172A]">{cat.name}</option>
                           ))}
                           {categories.length === 0 && !categoriesLoading && <option disabled className="bg-[#0F172A]">No categories available</option>}
                        </select>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Description *</label>
                     <textarea 
                        name="description" value={formData.description} onChange={handleChange}
                        placeholder="Describe your product, quality, and freshness"
                        maxLength={1000}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-green-500/50 transition-all placeholder:text-white/10 min-h-[120px] resize-none"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Price (₹ per kg) *</label>
                        <input 
                           type="number" name="price" value={formData.price} onChange={handleChange}
                           placeholder="Enter price"
                           className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-green-500/50 transition-all"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Quantity (kg) *</label>
                        <input 
                           type="number" name="stock" value={formData.stock} onChange={handleChange}
                           placeholder="Enter quantity"
                           className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-green-500/50 transition-all"
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* PRODUCT IMAGES CARD */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 text-blue-400">
                     <ImageIcon className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                     <h3 className="text-lg font-bold text-white">Product Images</h3>
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Add clear images to attract buyers</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div 
                    className="border-2 border-dashed border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer relative group"
                    onClick={() => document.getElementById('image-upload').click()}
                  >
                     <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-white/20" />
                     </div>
                     <div className="text-center">
                        <p className="text-xs font-black text-white uppercase tracking-widest mb-1">Drag and drop images here</p>
                        <p className="text-[10px] font-bold text-white/20">or click to browse</p>
                     </div>
                     <p className="text-[9px] font-medium text-white/10">Upload up to 5 images (JPG, PNG, WEBP) • Max size 5MB each</p>
                     <input id="image-upload" type="file" multiple className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                     {[0, 1, 2, 3, 4].map(i => (
                       <div key={i} className="aspect-square rounded-xl bg-white/5 border border-white/10 overflow-hidden relative group">
                          {imagePreviews[i] ? (
                            <>
                              <img src={imagePreviews[i]} alt="" className="w-full h-full object-cover" />
                              <button 
                                onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                                className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-10">
                               <Plus className="w-4 h-4" />
                            </div>
                          )}
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          {/* CENTER COLUMN: PRODUCT DETAILS & SHIPPING */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* PRODUCT DETAILS CARD */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20 text-purple-400">
                     <Layout className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                     <h3 className="text-lg font-bold text-white">Product Details</h3>
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Additional information about your product</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Quality Grade</label>
                     <select 
                        name="grade" value={formData.grade} onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-green-500/50 transition-all appearance-none cursor-pointer"
                     >
                        <option className="bg-[#0F172A]">Grade A</option>
                        <option className="bg-[#0F172A]">Grade B</option>
                        <option className="bg-[#0F172A]">Grade C</option>
                     </select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Harvest Date</label>
                     <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input 
                           type="date" name="harvestDate" value={formData.harvestDate} onChange={handleChange}
                           className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-white focus:outline-none focus:border-green-500/50 transition-all"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Storage Instructions (optional)</label>
                     <input 
                        type="text" name="storageInstructions" value={formData.storageInstructions} onChange={handleChange}
                        placeholder="Enter storage instructions (optional)"
                        maxLength={200}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-green-500/50 transition-all placeholder:text-white/10"
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

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Location (State)</label>
                        <input 
                           type="text" 
                           value={currentUser?.state || 'Not specified'} 
                           readOnly
                           className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white/50 cursor-not-allowed focus:outline-none"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Pincode</label>
                        <input 
                           type="text" 
                           value={currentUser?.pincode || 'Not specified'} 
                           readOnly
                           className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white/50 cursor-not-allowed focus:outline-none"
                        />
                     </div>
                     <p className="col-span-2 text-[10px] text-white/30 italic mt-1">* State and Pincode are automatically attached to your products based on your profile.</p>
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

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                     <div className="space-y-1">
                        <p className="text-xs font-bold text-white">Availability</p>
                        <p className="text-[10px] text-white/20 font-medium">Product will be visible to buyers</p>
                     </div>
                     <div 
                       className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all ${formData.isVisible ? 'bg-green-500' : 'bg-white/10'}`}
                       onClick={() => setFormData(prev => ({ ...prev, isVisible: !prev.isVisible }))}
                     >
                        <div className={`w-4 h-4 bg-white rounded-full transition-all ${formData.isVisible ? 'translate-x-6' : 'translate-x-0'}`} />
                     </div>
                  </div>
               </div>
            </div>

            {/* SHIPPING & DELIVERY CARD */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20 text-orange-400">
                     <Truck className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                     <h3 className="text-lg font-bold text-white">Shipping & Delivery</h3>
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Set delivery preferences for this product</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Delivery Type</label>
                     <div className="flex items-center gap-8 px-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                           <input 
                             type="radio" name="deliveryType" value="Home Delivery" 
                             checked={formData.deliveryType === 'Home Delivery'} 
                             onChange={handleChange}
                             className="hidden"
                           />
                           <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.deliveryType === 'Home Delivery' ? 'border-green-500 bg-green-500/20' : 'border-white/10 group-hover:border-white/20'}`}>
                              {formData.deliveryType === 'Home Delivery' && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                           </div>
                           <span className={`text-xs font-bold transition-colors ${formData.deliveryType === 'Home Delivery' ? 'text-white' : 'text-white/40'}`}>Home Delivery</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                           <input 
                             type="radio" name="deliveryType" value="Self Pickup" 
                             checked={formData.deliveryType === 'Self Pickup'} 
                             onChange={handleChange}
                             className="hidden"
                           />
                           <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.deliveryType === 'Self Pickup' ? 'border-green-500 bg-green-500/20' : 'border-white/10 group-hover:border-white/20'}`}>
                              {formData.deliveryType === 'Self Pickup' && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                           </div>
                           <span className={`text-xs font-bold transition-colors ${formData.deliveryType === 'Self Pickup' ? 'text-white' : 'text-white/40'}`}>Self Pickup</span>
                        </label>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Delivery Fee (₹)</label>
                     <input 
                        type="number" name="deliveryFee" value={formData.deliveryFee} onChange={handleChange}
                        placeholder="Enter delivery fee"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-green-500/50 transition-all"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Estimated Delivery Time</label>
                     <select 
                        name="deliveryTime" value={formData.deliveryTime} onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-green-500/50 transition-all appearance-none cursor-pointer"
                     >
                        <option className="bg-[#0F172A]">Same Day</option>
                        <option className="bg-[#0F172A]">1 Day</option>
                        <option className="bg-[#0F172A]">2-3 Days</option>
                        <option className="bg-[#0F172A]">4-7 Days</option>
                     </select>
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: TIPS & LIVE PREVIEW */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* TIPS PANEL */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center border border-yellow-500/20 text-yellow-400">
                     <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Tips for a great listing</h3>
               </div>

               <div className="space-y-6">
                  <Tip icon={<ImageIcon className="text-blue-400" />} title="Use high quality images" desc="Clear images build trust and attract buyers" />
                  <Tip icon={<AlertCircle className="text-orange-400" />} title="Write accurate details" desc="Honest information helps avoid returns" />
                  <Tip icon={<Tag className="text-green-400" />} title="Set competitive price" desc="Check similar products in your area" />
                  <Tip icon={<Clock className="text-purple-400" />} title="Keep it fresh" desc="Update stock and availability regularly" />
                  <Tip icon={<Plus className="text-amber-400" />} title="Add tags" desc="Tags help buyers find your product easily" />
               </div>
            </div>

            {/* LIVE PREVIEW CARD */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20 text-green-400">
                     <Eye className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                     <h3 className="text-lg font-bold text-white">Live Preview</h3>
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">This is how your product will appear</p>
                  </div>
               </div>

               <div className="bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden group shadow-2xl p-4">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 mb-6 relative">
                     {imagePreviews[0] ? (
                       <img src={imagePreviews[0]} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     ) : (
                       <div className="w-full h-full flex flex-col items-center justify-center opacity-10 gap-3">
                          <ImageIcon className="w-12 h-12" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Upload Image</p>
                       </div>
                     )}
                     <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[9px] font-black text-white uppercase tracking-widest border border-white/10">
                        {formData.category || 'Category'}
                     </div>
                  </div>
                  <div className="space-y-5 px-2 pb-2">
                     <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                           <h4 className="text-lg font-black text-white truncate">{formData.title || 'Product Name'}</h4>
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-md inline-block border border-green-500/10">{formData.grade}</span>
                        </div>
                        <div className="text-right shrink-0">
                           <p className="text-xl font-black text-white tracking-tighter">₹{formData.price || '--'}</p>
                           <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">/ kg</p>
                        </div>
                     </div>
                     
                     <div className="flex flex-wrap gap-2">
                        {formData.tags.length > 0 ? formData.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[8px] font-black uppercase tracking-widest text-white/30 bg-white/5 px-2 py-1 rounded-md border border-white/5">#{tag}</span>
                        )) : (
                          <span className="text-[8px] font-black uppercase tracking-widest text-white/10 border border-white/10 border-dashed px-2 py-1 rounded-md">-- tags</span>
                        )}
                     </div>

                     <div className="flex items-center justify-between pt-5 border-t border-white/5">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                              <Truck className="w-4 h-4 text-white/40" />
                           </div>
                           <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">{formData.deliveryType}</p>
                        </div>
                        <div className="flex items-center gap-2">
                           <Clock className="w-4 h-4 text-white/20" />
                           <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">{formData.deliveryTime || '-- mins'}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* ACTION BUTTONS (FLOATING / STICKY AT BOTTOM) */}
          <div className="lg:col-span-12 flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-white/5 mt-8">
             <button 
               type="button" 
               onClick={() => navigate('/inventory')}
               className="px-10 py-4.5 text-[11px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-colors"
             >
                Cancel
             </button>
             
             <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                {error && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-500/10 px-6 py-3 rounded-2xl border border-red-500/20 text-[10px] font-black uppercase tracking-widest">
                     <AlertCircle className="w-4 h-4" />
                     {error}
                  </div>
                )}
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-16 py-4.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-black rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-[0_15px_40px_rgba(34,197,94,0.3)] transition-all active:scale-95 group overflow-hidden relative"
                >
                   {loading ? (
                     <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                   ) : (
                     <>
                       <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
                       <span>List Product Now</span>
                     </>
                   )}
                   <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                </button>
             </div>
          </div>

        </form>
      </div>
    </GlassLayout>
  );
};

const Tip = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4 group">
    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
       {React.cloneElement(icon, { className: 'w-5 h-5' })}
    </div>
    <div className="space-y-1 pt-0.5">
       <p className="text-xs font-bold text-white group-hover:text-green-400 transition-colors">{title}</p>
       <p className="text-[10px] text-white/20 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);
