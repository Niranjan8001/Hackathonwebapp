import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { FarmerProvider, useFarmerContext } from './context/FarmerContext';
import { Topbar } from './components/layout/Topbar';
import { BottomNavigation } from './components/layout/BottomNavigation';

// Views
import { Login } from './views/Login';
import { DashboardView } from './views/DashboardView';
import { AddProduct } from './views/AddProduct';
import { EditProduct } from './views/EditProduct';
import { OrdersView } from './views/OrdersView';
import { ProductsView } from './views/ProductsView';
import { EarningsView } from './views/EarningsView';

import { CompleteProfile } from './views/CompleteProfile';
import { ReviewsView } from './views/ReviewsView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';
import { NeedHelpView } from './views/NeedHelpView';
import { OrderDetailView } from './views/OrderDetailView';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isProfileComplete, justRegistered } = useFarmerContext();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/" />;
  
  // Only force profile completion if they just registered AND profile is incomplete
  if (justRegistered && !isProfileComplete && location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" />;
  }
  
  return children;
};

const MainLayout = ({ children }) => {
  const location = useLocation();
  
  const getPageTitle = (path) => {
    switch (path) {
      case '/add-product': return 'Add Product';
      case '/inventory': return 'My Products';
      default:
        if (path.startsWith('/edit-product/')) return 'Edit Product';
        return 'FarmDirect';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Topbar title={getPageTitle(location.pathname)} />
      <main className="max-w-md mx-auto bg-white min-h-screen shadow-sm relative">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

const AppRoutes = () => {
  const { isAppReady } = useFarmerContext();

  if (!isAppReady) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center flex-col gap-4">
        <div className="w-8 h-8 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
        <p className="text-white/40 text-xs tracking-widest uppercase font-bold">Initializing System...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/complete-profile" element={<PrivateRoute><CompleteProfile /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><DashboardView /></PrivateRoute>} />
      <Route path="/add-product" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
      <Route path="/edit-product/:id" element={<PrivateRoute><EditProduct /></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute><OrdersView /></PrivateRoute>} />
      <Route path="/orders/:orderId" element={<PrivateRoute><OrderDetailView /></PrivateRoute>} />
      <Route path="/inventory" element={<PrivateRoute><ProductsView /></PrivateRoute>} />
      <Route path="/earnings" element={<PrivateRoute><EarningsView /></PrivateRoute>} />

      <Route path="/reviews" element={<PrivateRoute><ReviewsView /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><ProfileView /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><SettingsView /></PrivateRoute>} />
      <Route path="/need-help" element={<PrivateRoute><NeedHelpView /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};




function App() {
  return (
    <FarmerProvider>
      <AppRoutes />
    </FarmerProvider>
  );
}

export default App;
