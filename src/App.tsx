/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import AuthPage from './pages/AuthPage';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import ScrollToTop from './components/ScrollToTop';
import { useAuth } from './hooks/useAuth';
import { auth } from './firebase/firebase';

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
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const hideChrome =
    ['/login', '/register'].includes(location.pathname) ||
    (!!loading || !user) && location.pathname === '/';

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-emerald-500/30 selection:text-emerald-500">
      {!hideChrome && <Navbar onLogout={user ? handleLogout : undefined} />}
      <ScrollToTop />
      <main>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected routes — require login */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
          <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
          <Route path="/gallery" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path="/admin/*" element={<AdminRoute><AdminLayout /></AdminRoute>} />
        </Routes>
      </main>
      {!hideChrome && <Footer />}
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

