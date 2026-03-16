import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { Scissors, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Sparkles, User, CheckCircle } from 'lucide-react';

const GOLD = '#C5A059';
const GOLD_LIGHT = '#E8C97A';
const CREAM = '#FDFAF5';

const LoginForm = ({ navigate }: { navigate: any }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err: any) {
            if (err.code === 'auth/user-not-found') setError('No account found with this email.');
            else if (err.code === 'auth/wrong-password') setError('Incorrect password.');
            else if (err.code === 'auth/invalid-email') setError('Invalid email address.');
            else if (err.code === 'auth/invalid-credential') setError('Invalid email or password.');
            else setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            key="login"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[440px] mx-auto"
        >
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-10">
                <motion.div
                    whileHover={{ rotateY: 180 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                    style={{
                        background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                        boxShadow: `0 16px 40px rgba(197,160,89,0.3)`,
                        transformStyle: 'preserve-3d',
                    }}
                >
                    <Scissors className="h-8 w-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-serif text-[#1A1A1A]">JK Salon</h2>
            </div>

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl lg:text-4xl font-serif text-[#1A1A1A] tracking-tight mb-3">
                    Sign In
                </h1>
                <p className="text-zinc-400 text-sm">
                    Welcome back! Please enter your details.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5" noValidate>
                {/* Email */}
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: GOLD }}>
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-zinc-300" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                            placeholder="your@email.com"
                            className="w-full rounded-2xl pl-12 pr-5 py-4 text-sm text-[#1A1A1A] outline-none transition-all duration-300 placeholder:text-zinc-300 bg-[#FAF7F2] focus:bg-white focus:shadow-[0_8px_32px_rgba(197,160,89,0.12),0_0_0_3px_rgba(197,160,89,0.08)]"
                            style={{ border: '1.5px solid transparent' }}
                            onFocus={(e) => (e.target.style.borderColor = GOLD)}
                            onBlur={(e) => (e.target.style.borderColor = 'transparent')}
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: GOLD }}>
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-zinc-300" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                            placeholder="••••••••"
                            className="w-full rounded-2xl pl-12 pr-12 py-4 text-sm text-[#1A1A1A] outline-none transition-all duration-300 placeholder:text-zinc-300 bg-[#FAF7F2] focus:bg-white focus:shadow-[0_8px_32px_rgba(197,160,89,0.12),0_0_0_3px_rgba(197,160,89,0.08)]"
                            style={{ border: '1.5px solid transparent' }}
                            onFocus={(e) => (e.target.style.borderColor = GOLD)}
                            onBlur={(e) => (e.target.style.borderColor = 'transparent')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                        </button>
                    </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -8, height: 0 }}
                            className="text-xs font-semibold px-4 py-3 rounded-2xl"
                            style={{ background: 'rgba(239,68,68,0.06)', color: '#DC2626', border: '1px solid rgba(239,68,68,0.15)' }}
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={loading ? {} : { 
                        scale: 1.02,
                        boxShadow: `0 20px 40px rgba(197,160,89,0.45), inset 0 2px 0 rgba(255,255,255,0.3)`,
                    }}
                    whileTap={loading ? {} : { scale: 0.96 }}
                    className="w-full relative overflow-hidden flex items-center justify-center gap-2.5 py-[18px] rounded-2xl text-sm font-bold text-white disabled:opacity-60 disabled:cursor-not-allowed group transition-shadow duration-300"
                    style={{
                        background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                        boxShadow: '0 12px 32px rgba(197,160,89,0.35), inset 0 2px 0 rgba(255,255,255,0.2)',
                    }}
                >
                    {loading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /><span>Signing in…</span></>
                    ) : (
                        <>
                            <span className="relative z-10 flex items-center gap-2.5">
                                Sign In
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            {/* Premium Shimmer Effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-[35deg] pointer-events-none"
                                initial={{ left: '-150%' }}
                                whileHover={{ left: '150%' }}
                                transition={{ duration: 0.75, ease: "easeInOut" }}
                            />
                        </>
                    )}
                </motion.button>
            </form>

            <p className="text-center text-sm text-zinc-400 mt-8">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold transition-colors hover:underline" style={{ color: GOLD }}>
                    Create one
                </Link>
            </p>
        </motion.div>
    );
};

const RegisterForm = ({ navigate }: { navigate: any }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const passwordStrength = () => {
        if (!password) return 0;
        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    };

    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
    const strengthColor = ['', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#10B981'];
    const strength = passwordStrength();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            navigate('/');
        } catch (err: any) {
            if (err.code === 'auth/email-already-in-use') setError('Email is already registered. Try logging in.');
            else if (err.code === 'auth/invalid-email') setError('Invalid email address.');
            else if (err.code === 'auth/weak-password') setError('Password is too weak. Use at least 6 characters.');
            else setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            key="register"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[440px] mx-auto"
        >
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-10">
                <motion.div
                    whileHover={{ rotateY: 180 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                    style={{
                        background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                        boxShadow: `0 16px 40px rgba(197,160,89,0.3)`,
                        transformStyle: 'preserve-3d',
                    }}
                >
                    <Scissors className="h-8 w-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-serif text-[#1A1A1A]">JK Salon</h2>
            </div>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-serif text-[#1A1A1A] tracking-tight mb-3">
                    Create Account
                </h1>
                <p className="text-zinc-400 text-sm">
                    Join JK Salon to enjoy premium services and exclusive perks.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4" noValidate>
                {/* Full Name */}
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: GOLD }}>
                        Full Name
                    </label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-zinc-300" />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setError(''); }}
                            placeholder="John Doe"
                            className="w-full rounded-2xl pl-12 pr-5 py-4 text-sm text-[#1A1A1A] outline-none transition-all duration-300 placeholder:text-zinc-300 bg-[#FAF7F2] focus:bg-white focus:shadow-[0_8px_32px_rgba(197,160,89,0.12),0_0_0_3px_rgba(197,160,89,0.08)]"
                            style={{ border: '1.5px solid transparent' }}
                            onFocus={(e) => (e.target.style.borderColor = GOLD)}
                            onBlur={(e) => (e.target.style.borderColor = 'transparent')}
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: GOLD }}>
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-zinc-300" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                            placeholder="your@email.com"
                            className="w-full rounded-2xl pl-12 pr-5 py-4 text-sm text-[#1A1A1A] outline-none transition-all duration-300 placeholder:text-zinc-300 bg-[#FAF7F2] focus:bg-white focus:shadow-[0_8px_32px_rgba(197,160,89,0.12),0_0_0_3px_rgba(197,160,89,0.08)]"
                            style={{ border: '1.5px solid transparent' }}
                            onFocus={(e) => (e.target.style.borderColor = GOLD)}
                            onBlur={(e) => (e.target.style.borderColor = 'transparent')}
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: GOLD }}>
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-zinc-300" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                            placeholder="Min. 6 characters"
                            className="w-full rounded-2xl pl-12 pr-12 py-4 text-sm text-[#1A1A1A] outline-none transition-all duration-300 placeholder:text-zinc-300 bg-[#FAF7F2] focus:bg-white focus:shadow-[0_8px_32px_rgba(197,160,89,0.12),0_0_0_3px_rgba(197,160,89,0.08)]"
                            style={{ border: '1.5px solid transparent' }}
                            onFocus={(e) => (e.target.style.borderColor = GOLD)}
                            onBlur={(e) => (e.target.style.borderColor = 'transparent')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                        </button>
                    </div>
                    {/* Strength Meter */}
                    {password && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-2.5 space-y-1.5"
                        >
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <div
                                        key={level}
                                        className="h-1 flex-1 rounded-full transition-all duration-500"
                                        style={{
                                            background: strength >= level ? strengthColor[strength] : 'rgba(0,0,0,0.06)',
                                        }}
                                    />
                                ))}
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: strengthColor[strength] }}>
                                {strengthLabel[strength]}
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: GOLD }}>
                        Confirm Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-zinc-300" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                            placeholder="Re-enter password"
                            className="w-full rounded-2xl pl-12 pr-12 py-4 text-sm text-[#1A1A1A] outline-none transition-all duration-300 placeholder:text-zinc-300 bg-[#FAF7F2] focus:bg-white focus:shadow-[0_8px_32px_rgba(197,160,89,0.12),0_0_0_3px_rgba(197,160,89,0.08)]"
                            style={{ border: '1.5px solid transparent' }}
                            onFocus={(e) => (e.target.style.borderColor = GOLD)}
                            onBlur={(e) => (e.target.style.borderColor = 'transparent')}
                        />
                        {confirmPassword && password === confirmPassword && (
                            <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-emerald-500" />
                        )}
                    </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -8, height: 0 }}
                            className="text-xs font-semibold px-4 py-3 rounded-2xl"
                            style={{ background: 'rgba(239,68,68,0.06)', color: '#DC2626', border: '1px solid rgba(239,68,68,0.15)' }}
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={loading ? {} : { 
                        scale: 1.02,
                        boxShadow: `0 20px 40px rgba(197,160,89,0.45), inset 0 2px 0 rgba(255,255,255,0.3)`,
                    }}
                    whileTap={loading ? {} : { scale: 0.96 }}
                    className="w-full relative overflow-hidden flex items-center justify-center gap-2.5 py-[18px] rounded-2xl text-sm font-bold text-white mt-2 disabled:opacity-60 disabled:cursor-not-allowed group transition-shadow duration-300"
                    style={{
                        background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                        boxShadow: '0 12px 32px rgba(197,160,89,0.35), inset 0 2px 0 rgba(255,255,255,0.2)',
                    }}
                >
                    {loading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /><span>Creating account…</span></>
                    ) : (
                        <>
                            <span className="relative z-10 flex items-center gap-2.5">
                                Create Account
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            {/* Premium Shimmer Effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-[35deg] pointer-events-none"
                                initial={{ left: '-150%' }}
                                whileHover={{ left: '150%' }}
                                transition={{ duration: 0.75, ease: "easeInOut" }}
                            />
                        </>
                    )}
                </motion.button>
            </form>

            <p className="text-center text-sm text-zinc-400 mt-8">
                Already have an account?{' '}
                <Link to="/login" className="font-bold transition-colors hover:underline" style={{ color: GOLD }}>
                    Sign in
                </Link>
            </p>
        </motion.div>
    );
};

const AuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === '/login';

    return (
        <div 
            className="min-h-screen w-full relative flex items-center justify-center py-12 px-4 lg:px-8 overflow-hidden" 
            style={{ background: CREAM }}
        >
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[400, 700, 1000].map((size, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: size, height: size,
                            border: `1px solid rgba(197,160,89,${0.08 - i * 0.02})`,
                            top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                        animate={{ 
                            scale: [1, 1.05, 1], 
                            rotate: [0, isLogin ? 5 : -5, 0] 
                        }}
                        transition={{ duration: 8 + i * 4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                ))}
            </div>

            {/* Main Floating Container */}
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full lg:w-[65%] max-w-4xl aspect-square lg:aspect-[16/9] flex flex-col lg:flex-row bg-white rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.12)] border border-white"
            >
                <div className={`flex w-full h-full ${isLogin ? 'flex-row' : 'flex-row-reverse'}`}>
                    
                    {/* Decorative Panel (Old Design Component) */}
                    <motion.div
                        layout
                        className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-12"
                        style={{ background: '#0F0F0F' }}
                    >
                        {/* Panel Animations */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <motion.div
                                className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-20"
                                style={{ background: GOLD, top: '40%', left: '50%', transform: 'translate(-50%, -50%)' }}
                                animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
                                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            />
                        </div>

                        <div className="relative z-10 text-center w-full max-w-md">
                            <AnimatePresence mode="wait">
                                {isLogin ? (
                                    <motion.div
                                        key="login-content"
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                    >
                                        <motion.div
                                            whileHover={{ rotateY: 180 }}
                                            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8"
                                            style={{
                                                background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                                                boxShadow: `0 20px 40px rgba(197,160,89,0.3)`,
                                            }}
                                        >
                                            <Scissors className="h-10 w-10 text-white" />
                                        </motion.div>
                                        <h2 className="text-4xl font-serif text-white mb-4">Welcome Back</h2>
                                        <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                                            Return to luxury. Sign in to manage your appointments and services.
                                        </p>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {['Premium', 'Luxury', 'Expert'].map(tag => (
                                                <span key={tag} className="px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border border-zinc-800 text-zinc-400 bg-zinc-900/50">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="register-content"
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                    >
                                        <motion.div
                                            animate={{ rotateY: [0, 360] }}
                                            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                                            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8"
                                            style={{
                                                background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                                                boxShadow: `0 20px 40px rgba(197,160,89,0.3)`,
                                            }}
                                        >
                                            <Scissors className="h-10 w-10 text-white" />
                                        </motion.div>
                                        <h2 className="text-4xl font-serif text-white mb-4">Join Us</h2>
                                        <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                                            Experience the finest grooming services tailored to your style.
                                        </p>
                                        <div className="space-y-4 text-left max-w-[240px] mx-auto">
                                            {[
                                                'Priority Booking',
                                                'Member Perks',
                                                'Style Tracking'
                                            ].map((benefit) => (
                                                <div key={benefit} className="flex items-center gap-3 text-sm text-zinc-400">
                                                    <CheckCircle className="h-4 w-4 text-[#C5A059]" />
                                                    {benefit}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Form Panel */}
                    <div className="flex-1 overflow-y-auto premium-scrollbar bg-white relative">
                        <div className="min-h-full flex items-center justify-center p-8 lg:p-16">
                            <div className="w-full max-w-[440px]">
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {isLogin ? (
                                        <LoginForm navigate={navigate} />
                                    ) : (
                                        <RegisterForm navigate={navigate} />
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
