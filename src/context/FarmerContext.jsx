import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { auth, googleProvider, signInWithRedirect, getRedirectResult, signInWithPhoneNumber, RecaptchaVerifier } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import { apiService } from '../services/apiService';
import { DEMO_PRODUCTS, DEMO_ORDERS, DEMO_EARNINGS } from '../mock/demoData';

const FarmerContext = createContext();

export const useFarmerContext = () => useContext(FarmerContext);

export const FarmerProvider = ({ children }) => {
  const isMockSessionRef = useRef(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [language, setLanguage] = useState('English');
  const [currentUser, setCurrentUser] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isDark, setIsDark] = useState(true);
  
  // Real Data States
  const [realProducts, setRealProducts] = useState([]);
  const [realOrders, setRealOrders] = useState([]);
  const [realEarnings, setRealEarnings] = useState({ total: 0, weekly: 0 });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  // Centralized Data Access Abstraction
  const getData = useCallback((type) => {
    const isDemo = currentUser?.isDemoUser;
    switch(type) {
      case 'products':
        return isDemo ? DEMO_PRODUCTS : realProducts;
      case 'orders':
        return isDemo ? DEMO_ORDERS : realOrders;
      case 'earnings':
        return isDemo ? DEMO_EARNINGS : realEarnings;
      default:
        return null;
    }
  }, [currentUser, realProducts, realOrders, realEarnings]);

  const fetchUserData = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      const profileRes = await apiService.getMe(token);
      let isDemo = false;
      let isProfileCompleteCheck = false;

      if (profileRes.success && profileRes.data) {
        isDemo = !!profileRes.data.isDemoUser;
        // Logic for profile completion (example: phone and farm details required)
        isProfileCompleteCheck = !!profileRes.data.phone; 
      }
      
      setCurrentUser({
        ...firebaseUser,
        ...profileRes.data,
        isDemoUser: isDemo
      });
      setIsProfileComplete(isProfileCompleteCheck);
      setIsAuthenticated(true);
      
      // Fetch Real Data 
      if (!isDemo) {
        const [productsRes, ordersRes, earningsRes] = await Promise.all([
          apiService.getProductsByFarmer(firebaseUser.uid).catch(() => ({ success: true, data: [] })),
          apiService.getOrders(token).catch(() => ({ success: true, data: [] })),
          apiService.getEarnings(token).catch(() => ({ success: true, data: { total: 0, weekly: 0 } }))
        ]);

        if (productsRes.success) setRealProducts(productsRes.data || []);
        if (ordersRes.success) setRealOrders(ordersRes.data || []);
        if (earningsRes.success) setRealEarnings(earningsRes.data || { total: 0, weekly: 0 });
      }

    } catch (error) {
      console.error('Error fetching user profile data:', error);
      // Fallback
      setCurrentUser({ ...firebaseUser, isDemoUser: false });
      setIsAuthenticated(true);
      setIsProfileComplete(false);
    } finally {
      setIsAppReady(true);
    }
  };

  // Handle Redirect Result on Mount
  useEffect(() => {
    const handleRedirect = async () => {
      try {
        setLoading(true);
        const result = await getRedirectResult(auth);
        if (result?.user) {
          isMockSessionRef.current = false;
          await fetchUserData(result.user);
        } else {
          // If no redirect result, wait for onAuthStateChanged
        }
      } catch (err) {
        console.error('Redirect login error:', err);
        setError({ message: 'Google login failed. Please try again.', type: 'auth' });
        setIsAppReady(true);
      } finally {
        setLoading(false);
      }
    };

    handleRedirect();
  }, []);

  // Listen for Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        isMockSessionRef.current = false;
        await fetchUserData(user);
      } else {
        if (isMockSessionRef.current) return; // Prevent wiping mock session
        
        // Full State Reset
        setIsAuthenticated(false);
        setCurrentUser(null);
        setRealProducts([]);
        setRealOrders([]);
        setRealEarnings({ total: 0, weekly: 0 });
        setIsAppReady(true);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchProducts = async () => {
    if (currentUser?.isDemoUser) return; // Handled by abstraction
    
    if (loading && !isRetrying) return; 

    try {
      setLoading(true);
      setError(null);
      const user = auth.currentUser;
      if (!user) return;

      const result = await apiService.getProductsByFarmer(user.uid);
      if (result.success) {
        setRealProducts(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError({ 
        message: err.status === 0 ? 'Network error. Backend might be offline.' : err.message || 'Failed to load products.',
        type: 'fetch',
        status: err.status
      });
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  const handleRetry = () => {
    setIsRetrying(true);
    fetchProducts();
  };

  const login = async (type = 'google', data = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // MOCK_MODE removal: If someone needs to test locally without backend,
      // they should just use a specific test email.
      if (type === 'demo') {
        // A dedicated demo login backdoor for showcase purposes if requested
        isMockSessionRef.current = true;
        setIsAuthenticated(true);
        setCurrentUser({
          displayName: 'Demo Farmer',
          email: 'demo@farmdirect.com',
          isDemoUser: true,
          photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
          certifications: [
            { id: 1, title: 'Jaivik Bharat', issuer: 'Certified Organic by FSSAI' },
            { id: 2, title: 'India Organic', issuer: 'NPOP Certification' }
          ]
        });
        setIsProfileComplete(true);
        setIsAppReady(true);
        return true;
      }

      if (type === 'google') {
        await signInWithRedirect(auth, googleProvider);
        return true;
      }

      if (type === 'phone' && data.phone && data.otp?.length === 4) {
        // Simple bypass for testing real phone login flow
        isMockSessionRef.current = true;
        setIsAuthenticated(true);
        setCurrentUser({ name: 'Farmer', phone: data.phone, isDemoUser: true });
        setIsProfileComplete(true);
        setIsAppReady(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      setError({ message: 'Authentication failed. Please try again.', type: 'auth' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (farmerData) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you'd call apiService.register(farmerData)
      // and it would create the user in MongoDB with isDemoUser: false
      
      isMockSessionRef.current = true;
      setIsAuthenticated(true);
      setCurrentUser({
        ...farmerData,
        displayName: farmerData.name || 'New Farmer',
        email: farmerData.email || 'farmer@demo.com',
        isDemoUser: false, 
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      });
      setIsProfileComplete(false);
      
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      setError({ message: 'Registration failed. Please try again.', type: 'auth' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfileImages = (banner, profile) => {
    setCurrentUser(prev => ({
      ...prev,
      bannerImage: banner || prev.bannerImage,
      photoURL: profile || prev.photoURL
    }));
    setIsProfileComplete(true);
  };

  const updateBio = (newBio) => {
    setCurrentUser(prev => ({
      ...prev,
      bio: newBio
    }));
  };

  const addCertification = (cert) => {
    setCurrentUser(prev => ({
      ...prev,
      certifications: [...(prev.certifications || []), { ...cert, id: Date.now() }]
    }));
  };

  const logout = () => {
    isMockSessionRef.current = false;
    // Full state reset
    setIsAuthenticated(false);
    setCurrentUser(null);
    setRealProducts([]);
    setRealOrders([]);
    setRealEarnings({ total: 0, weekly: 0 });
    
    signOut(auth).catch(console.error);
  };

  const addProduct = async (productData) => {
    try {
      if (currentUser?.isDemoUser) {
        // Pretend to add product for demo users
        return { ...productData, id: `demo_new_${Date.now()}` };
      }

      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const token = await user.getIdToken();
      const result = await apiService.addProduct(productData, token);

      if (result.success) {
        await fetchProducts(); 
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error('Add product error:', err);
      throw err;
    }
  };

  const updateProductQuantity = (id, newQuantity) => {
    if (currentUser?.isDemoUser) return; // Prevent editing demo products directly
    setRealProducts(realProducts.map(p => p.id === id ? { ...p, quantity: newQuantity, stock: newQuantity } : p));
  };

  const updateOrderStatus = (id, status) => {
    if (currentUser?.isDemoUser) return;
    setRealOrders(realOrders.map(o => o.id === id ? { ...o, status } : o));
  };

  // Expose the abstracted data directly so components don't have to change
  const products = getData('products');
  const orders = getData('orders');
  const earnings = getData('earnings');

  const totalEarnings = earnings?.total || 0;
  const weeklyEarnings = earnings?.weekly || 0;

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
      updateProfileImages,
      updateBio,
      addCertification,
      logout,
      products,
      loading,
      error,
      fetchProducts,
      handleRetry,
      addProduct,
      updateProductQuantity,
      orders,
      updateOrderStatus,
      totalEarnings,
      weeklyEarnings
    }}>
      {children}
    </FarmerContext.Provider>
  );
};

