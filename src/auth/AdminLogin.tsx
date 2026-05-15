import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabase';
import { motion } from 'motion/react';
import { Lock, Mail, Scissors } from 'lucide-react';

const AdminLogin = () => {
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [adminSecret, setAdminSecret] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Basic validation
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        if (adminSecret !== 'JK-ADMIN-SECRET') {
          throw new Error('Invalid Admin Secret Code. Registration denied.');
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role: 'admin' }
          }
        });
        if (signUpError) throw signUpError;

        if (data.user) {
          setIsSignUp(false);
          setAdminSecret('');
          setPassword('');
          setError('Admin account created successfully. Please sign in to continue.');
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;

        // Check if user has admin role in metadata
        const userRole = data.user.user_metadata?.role;

        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else {
          // Not an admin — sign them out and show error
          await supabase.auth.signOut();
          setError('Access denied. This account does not have admin privileges.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-zinc-900/50 border border-white/5 rounded-3xl p-8 lg:p-12"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#C5A059]/10 mb-6">
            <Scissors className="h-8 w-8 text-[#C5A059]" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tighter">Admin Portal</h1>
          <p className="text-zinc-500 text-sm mt-2">
            {isSignUp ? 'Register a new admin account' : 'Sign in to manage JK Salon'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-[#C5A059] outline-none transition-all"
                placeholder="admin@jksalon.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-[#C5A059] outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {isSignUp && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Secret Admin Code</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-[#C5A059] outline-none transition-all"
                  placeholder="Required for admin registration"
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-xs font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C5A059] hover:bg-[#b59048] disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center"
          >
            {loading ? (isSignUp ? 'Registering...' : 'Signing in...') : (isSignUp ? 'Create Admin Account' : 'Sign In')}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-zinc-500 hover:text-[#C5A059] text-xs font-semibold transition-colors"
            >
              {isSignUp ? 'Already an admin? Sign in instead' : 'Need an admin account? Register'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
