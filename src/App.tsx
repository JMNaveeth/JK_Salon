/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './customer/Home';
import Services from './customer/Services';
import Gallery from './customer/Gallery';
import About from './customer/About';
import Contact from './customer/Contact';
import Booking from './customer/Booking';
import AuthPage from './auth/AdminLogin';
import AdminLogin from './auth/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import ScrollToTop from './components/ScrollToTop';
import { useAuth } from './auth/useAuth';

/* Loading spinner component */
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDFAF5' }}>
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-10 h-10 rounded-full border-[3px] border-t-transparent animate-spin"
        style={{ borderColor: '#C5A059', borderTopColor: 'transparent' }}
      />
      <p className="text-sm font-medium text-zinc-400 tracking-wide">Loading...</p>
    </div>
  </div>
);

/* Auth guard — redirects to /login if not logged in */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

/* Admin guard — redirects non-admin users away */
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const hideChrome =
    ['/login', '/register'].includes(location.pathname) ||
    location.pathname.startsWith('/admin');
  const hideFooter = hideChrome || location.pathname === '/booking';

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-emerald-500/30 selection:text-emerald-500">
      {!hideChrome && <Navbar />}
      <ScrollToTop />
      <main>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Public and Protected routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/*" element={<AdminRoute><AdminLayout /></AdminRoute>} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

