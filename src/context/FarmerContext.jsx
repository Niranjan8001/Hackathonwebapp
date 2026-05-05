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
  
  const [realProducts, setRealProducts] = useState([]);
  const [realOrders, setRealOrders] = useState([]);
  const [realEarnings, setRealEarnings] = useState({ total: 0, weekly: 0 });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  const getData = useCallback((type) => {
    // We no longer have isDemoUser logic, but we keep the structure for compatibility
    switch(type) {
      case 'products': return realProducts;
      case 'orders': return realOrders;
      case 'earnings': return realEarnings;
      default: return null;
    }
  }, [realProducts, realOrders, realEarnings]);

  const fetchUserData = async (token) => {
    try {
      const profileRes = await apiService.getMe(token);
      
      if (profileRes.success && profileRes.data) {
        setCurrentUser(profileRes.data);
        setIsProfileComplete(!!profileRes.data.farmName); // Example completion check
        setIsAuthenticated(true);
        
        // Fetch Real Data 
        const [productsRes, ordersRes, earningsRes] = await Promise.all([
          apiService.getProductsByFarmer(profileRes.data._id).catch(() => ({ success: true, data: [] })),
          apiService.getOrders(token).catch(() => ({ success: true, data: [] })),
          apiService.getEarnings(token).catch(() => ({ success: true, data: { total: 0, weekly: 0 } }))
        ]);

        if (productsRes.success) setRealProducts(productsRes.data || []);
        if (ordersRes.success) setRealOrders(ordersRes.data || []);
        if (earningsRes.success) setRealEarnings(earningsRes.data || { total: 0, weekly: 0 });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setIsAuthenticated(false);
    } finally {
      setIsAppReady(true);
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

  const [confirmationResult, setConfirmationResult] = useState(null);

  const setupRecaptcha = (containerId = 'recaptcha-container') => {
    if (window.recaptchaVerifier) return window.recaptchaVerifier;

    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => console.log('reCAPTCHA verified'),
        'expired-callback': () => {
          console.warn('reCAPTCHA expired');
          window.recaptchaVerifier = null;
        }
      });
      return window.recaptchaVerifier;
    } catch (err) {
      console.error('reCAPTCHA initialization error:', err);
      return null;
    }
  };

  const sendOTP = async (phoneNumber) => {
    try {
      setLoading(true);
      setError(null);
      
      const appVerifier = setupRecaptcha();
      if (!appVerifier) throw new Error('Failed to initialize reCAPTCHA');

      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      console.log('DEBUG: Sending OTP to', formattedPhone);
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      console.log('OTP sent successfully');
      return true;
    } catch (err) {
      console.error('OTP send error:', err);
      setError({ message: err.message || 'Failed to send OTP', type: 'auth' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otpCode) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!confirmationResult) throw new Error('No active OTP session');
      
      console.log('DEBUG: Verifying OTP...');
      const result = await confirmationResult.confirm(otpCode);
      console.log('OTP verified successfully');
      
      const firebaseToken = await result.user.getIdToken();
      console.log('DEBUG: Firebase token received');

      // Sync with Backend
      const backendRes = await apiService.firebaseLogin(firebaseToken);
      console.log('DEBUG: Backend response received', backendRes);

      if (backendRes.success) {
        localStorage.setItem('token', backendRes.data.token);
        await fetchUserData(backendRes.data.token);
        return true;
      } else {
        throw new Error(backendRes.message || 'Backend authentication failed');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError({ message: err.message || 'Verification failed', type: 'auth' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (type = 'google', data = {}) => {
    // We only support real auth now
    return false; 
  };

  const register = async (farmerData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.register(farmerData);
      if (res.success) {
        localStorage.setItem("token", res.data.token);
        await fetchUserData(res.data.token);
        return true;
      }
      throw new Error(res.message || 'Registration failed');
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
    setCurrentUser(null);
    setRealProducts([]);
    setRealOrders([]);
    setRealEarnings({ total: 0, weekly: 0 });
    signOut(auth).catch(console.error);
  };

  const addProduct = async (productData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      const result = await apiService.addProduct(productData, token);
      if (result.success) {
        // Refresh products
        const productsRes = await apiService.getProductsByFarmer(currentUser._id);
        if (productsRes.success) setRealProducts(productsRes.data || []);
        return result.data;
      }
      throw new Error(result.message);
    } catch (err) {
      console.error('Add product error:', err);
      throw err;
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

  const products = getData('products');
  const orders = getData('orders');
  const earnings = getData('earnings');

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
      sendOTP,
      verifyOTP,
      register,
      logout,
      products,
      loading,
      error,
      addProduct,
      orders,
      totalEarnings: earnings?.total || 0,
      weeklyEarnings: earnings?.weekly || 0,
      updateProfileImages,
      updateBio,
      addCertification
    }}>
      {children}
    </FarmerContext.Provider>
  );
};
