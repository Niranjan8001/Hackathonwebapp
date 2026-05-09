import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../services/apiService';

const FarmerContext = createContext();

export const useFarmerContext = () => useContext(FarmerContext);

export const FarmerProvider = ({ children }) => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [language, setLanguage] = useState('English');
  const [currentUser, setCurrentUser] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const [isDark, setIsDark] = useState(true);
  
  const [realProducts, setRealProducts] = useState([]);
  const [realOrders, setRealOrders] = useState([]);
  const [realReviews, setRealReviews] = useState([]);
  const [realEarnings, setRealEarnings] = useState({ total: 0, weekly: 0, thisMonth: 0, lastMonth: 0, pending: 0, percentageChange: 0 });
  const [earningsLoading, setEarningsLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleTheme = () => setIsDark(!isDark);

  const fetchUserData = async (token) => {
    try {
      setEarningsLoading(true);
      const profileRes = await apiService.getMe(token);
      
      if (profileRes.success && profileRes.data) {
        // Standardize photoURL -> profilePhoto for the state
        const userData = {
          ...profileRes.data,
          profilePhoto: profileRes.data.profilePhoto || profileRes.data.photoURL
        };
        
        setCurrentUser(userData);
        setIsProfileComplete(!!userData.farmName); 
        setIsAuthenticated(true);
        
        // Fetch Real Data 
        const [productsRes, ordersRes, reviewsRes] = await Promise.all([
          apiService.getMyProducts(token).catch(() => ({ success: true, data: [] })),
          apiService.getMyOrders(token).catch(() => ({ success: true, data: [] })),
          apiService.getReviews(token).catch(() => ({ success: true, data: [] })),
        ]);

        if (productsRes.success) setRealProducts(productsRes.data || []);
        if (reviewsRes.success) setRealReviews(reviewsRes.data || []);
        if (ordersRes.success) {
          const orders = ordersRes.data || [];
          setRealOrders(orders);
          
          // Calculate earnings from completed/delivered orders
          const deliveredOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'delivered');
          const pendingOrders = orders.filter(o => o.status === 'Processing' || o.status === 'Pending' || o.status === 'pending' || o.status === 'accepted' || o.status === 'shipped');
          
          const totalEarnings = deliveredOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
          const pendingEarnings = pendingOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
          
          const now = new Date();
          
          // Weekly earnings (orders from last 7 days)
          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          const weeklyEarnings = deliveredOrders
            .filter(o => new Date(o.createdAt) > sevenDaysAgo)
            .reduce((acc, o) => acc + (o.totalAmount || 0), 0);
            
          // This month earnings
          const thisMonthEarnings = deliveredOrders
            .filter(o => {
              const d = new Date(o.createdAt);
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            })
            .reduce((acc, o) => acc + (o.totalAmount || 0), 0);
            
          // Last month earnings
          const lastMonthEarnings = deliveredOrders
            .filter(o => {
              const d = new Date(o.createdAt);
              let lastMonth = now.getMonth() - 1;
              let year = now.getFullYear();
              if (lastMonth < 0) {
                lastMonth = 11;
                year -= 1;
              }
              return d.getMonth() === lastMonth && d.getFullYear() === year;
            })
            .reduce((acc, o) => acc + (o.totalAmount || 0), 0);

          let percentageChange = 0;
          if (lastMonthEarnings > 0) {
            percentageChange = ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100;
          } else if (thisMonthEarnings > 0) {
            percentageChange = 100;
          }
            
          setRealEarnings({ 
            total: totalEarnings, 
            weekly: weeklyEarnings,
            thisMonth: thisMonthEarnings,
            lastMonth: lastMonthEarnings,
            pending: pendingEarnings,
            percentageChange: Math.round(percentageChange)
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    } finally {
      setIsAppReady(true);
      setLoading(false);
      setEarningsLoading(false);
    }
  };

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        await fetchUserData(savedToken);
      } else {
        setIsAppReady(true);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.login(email, password);
      if (res.success) {
        localStorage.setItem('token', res.data.token);
        // Clear any old mock data from localStorage if it exists
        localStorage.removeItem('demo_mode');
        await fetchUserData(res.data.token);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      setError({ message: err.message || 'Login failed', type: 'auth' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.register(userData);
      if (res.success) {
        localStorage.setItem("token", res.data.token);
        setJustRegistered(true);
        await fetchUserData(res.data.token);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Registration error:", err);
      setError({ message: err.message || 'Registration failed', type: 'auth' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setJustRegistered(false);
    setCurrentUser(null);
    setRealProducts([]);
    setRealOrders([]);
    setRealEarnings({ total: 0, weekly: 0, thisMonth: 0, lastMonth: 0, pending: 0, percentageChange: 0 });
  };

  const addProduct = async (productData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      const result = await apiService.addProduct(productData, token);
      if (result.success) {
        // Refresh products
        const productsRes = await apiService.getMyProducts(token);
        if (productsRes.success) setRealProducts(productsRes.data || []);
        return result.data;
      }
      throw new Error(result.message);
    } catch (err) {
      console.error('Add product error:', err);
      throw err;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      
      const res = await apiService.updateProfile(profileData, token);
      if (res.success) {
        // Standardize photoURL -> profilePhoto
        const updatedData = {
          ...res.data,
          profilePhoto: res.data.profilePhoto || res.data.photoURL
        };
        setCurrentUser(updatedData);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Update profile error:', err);
      return false;
    }
  };

  const updateBio = (bio) => updateProfile({ bio });
  
  const updateProfileImages = (banner, profileFile) => {
    // profileFile should be an actual File object now, not a Base64 string
    const formData = new FormData();
    if (banner) formData.append('bannerImage', banner);
    if (profileFile) formData.append('profilePhoto', profileFile);
    
    updateProfile(formData).then(() => setIsProfileComplete(true));
  };

  const addCertification = (cert) => {
    updateProfile({ certification: { ...cert, id: Date.now() } });
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setEarningsLoading(true);
    const res = await apiService.getMyProducts(token);
    if (res.success) setRealProducts(res.data || []);
    setEarningsLoading(false);
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await apiService.getMyOrders(token);
    if (res.success) setRealOrders(res.data || []);
  };

  return (
    <FarmerContext.Provider value={{
      isAppReady,
      isAuthenticated,
      currentUser,
      isProfileComplete,
      setIsProfileComplete,
      language,
      setLanguage,
      isDark,
      toggleTheme,
      login,
      register,
      logout,
      justRegistered,
      setJustRegistered,
      products: realProducts,
      orders: realOrders,
      loading,
      earningsLoading,
      realEarnings,
      realProducts,
      realReviews,
      fetchProducts,
      fetchOrders,
      updateProfile,
      updateBio,
      updateProfileImages,
      addCertification,
      totalEarnings: realEarnings.total,
      weeklyEarnings: realEarnings.weekly,
      thisMonthEarnings: realEarnings.thisMonth,
      lastMonthEarnings: realEarnings.lastMonth,
      pendingEarnings: realEarnings.pending,
      earningsPercentageChange: realEarnings.percentageChange,
    }}>
      {children}
    </FarmerContext.Provider>
  );
};
