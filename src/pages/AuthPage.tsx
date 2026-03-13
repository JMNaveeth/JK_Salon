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
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.97 }}
                    className="w-full relative overflow-hidden flex items-center justify-center gap-2.5 py-[18px] rounded-2xl text-sm font-bold text-white disabled:opacity-60 disabled:cursor-not-allowed group"
                    style={{
                        background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                        boxShadow: '0 12px 32px rgba(197,160,89,0.35), inset 0 2px 0 rgba(255,255,255,0.2)',
                    }}
                >
                    {loading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /><span>Signing in…</span></>
                    ) : (
                        <>
                            <span className="relative z-10">Sign In</span>
                            <ArrowRight className="relative z-10 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            <motion.div
                                className="absolute inset-0 bg-white/15"
                                initial={{ x: '-110%' }}
                                whileHover={{ x: '110%' }}
                                transition={{ duration: 0.55 }}
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
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.97 }}
                    className="w-full relative overflow-hidden flex items-center justify-center gap-2.5 py-[18px] rounded-2xl text-sm font-bold text-white mt-2 disabled:opacity-60 disabled:cursor-not-allowed group"
                    style={{
                        background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                        boxShadow: '0 12px 32px rgba(197,160,89,0.35), inset 0 2px 0 rgba(255,255,255,0.2)',
                    }}
                >
                    {loading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /><span>Creating account…</span></>
                    ) : (
                        <>
                            <span className="relative z-10">Create Account</span>
                            <ArrowRight className="relative z-10 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            <motion.div
                                className="absolute inset-0 bg-white/15"
                                initial={{ x: '-110%' }}
                                whileHover={{ x: '110%' }}
                                transition={{ duration: 0.55 }}
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
        <div className={`min-h-screen flex w-full relative overflow-hidden`} style={{ background: CREAM }}>
            <div className={`flex w-full ${isLogin ? 'flex-row' : 'flex-row-reverse'}`}>

                {/* Decorative Panel */}
                <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                    className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center z-20"
                    style={{ background: '#0F0F0F' }}
                >
                    {/* Floating background circles */}
                    {[300, 450, 600].map((size, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full pointer-events-none"
                            style={{
                                width: size, height: size,
                                border: `1px solid rgba(197,160,89,${0.12 - i * 0.03})`,
                                top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                            }}
                            animate={{ scale: [1, 1.06, 1], rotate: [0, isLogin ? 3 : -3, 0] }}
                            transition={{ duration: 5 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    ))}

                    {/* Gold ambient glow */}
                    <div
                        className="absolute w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-20"
                        style={{ background: GOLD, top: '40%', left: '50%', transform: 'translate(-50%, -50%)' }}
                    />

                    {/* Content container with absolute positioning to prevent height jumps during crossfade */}
                    <div className="relative z-10 text-center px-12 max-w-lg w-full h-[400px] flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            {isLogin ? (
                                <motion.div
                                    key="login-content"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {/* 3D Scissors Icon */}
                                    <motion.div
                                        whileHover={{ rotateY: 180 }}
                                        transition={{ duration: 0.6 }}
                                        className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-10"
                                        style={{
                                            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                                            boxShadow: `0 30px 60px rgba(197,160,89,0.4), inset 0 2px 0 rgba(255,255,255,0.2)`,
                                            transformStyle: 'preserve-3d',
                                        }}
                                    >
                                        <Scissors className="h-12 w-12 text-white" />
                                    </motion.div>

                                    <h2 className="text-4xl font-serif text-white tracking-tight mb-4">
                                        Welcome to{' '}
                                        <span style={{
                                            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                        }}>
                                            JK Salon
                                        </span>
                                    </h2>
                                    <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                                        Experience premium grooming and styling. Sign in to book appointments, track your visits, and enjoy exclusive member benefits.
                                    </p>

                                    {/* Floating feature pills */}
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {['Premium Services', 'Easy Booking', 'Member Rewards'].map((text, i) => (
                                            <div
                                                key={text}
                                                className="px-4 py-2 rounded-full text-xs font-medium"
                                                style={{
                                                    background: 'rgba(197,160,89,0.08)',
                                                    border: '1px solid rgba(197,160,89,0.15)',
                                                    color: GOLD_LIGHT,
                                                }}
                                            >
                                                <Sparkles className="inline h-3 w-3 mr-1.5" />{text}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="register-content"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {/* 3D Icon */}
                                    <motion.div
                                        animate={{ rotateY: [0, 360] }}
                                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                                        className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-10"
                                        style={{
                                            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                                            boxShadow: `0 30px 60px rgba(197,160,89,0.4), inset 0 2px 0 rgba(255,255,255,0.2)`,
                                            transformStyle: 'preserve-3d',
                                        }}
                                    >
                                        <Scissors className="h-12 w-12 text-white" />
                                    </motion.div>

                                    <h2 className="text-4xl font-serif text-white tracking-tight mb-4">
                                        Join the{' '}
                                        <span style={{
                                            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                        }}>
                                            Experience
                                        </span>
                                    </h2>
                                    <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                                        Create your personal account to unlock member-exclusive offers, seamless booking, and a luxury grooming experience tailored just for you.
                                    </p>

                                    {/* Benefits list */}
                                    <div className="space-y-3 text-left max-w-xs mx-auto">
                                        {[
                                            'Book appointments instantly',
                                            'Earn loyalty rewards',
                                            'Exclusive member discounts',
                                            'Track your style history',
                                        ].map((text, i) => (
                                            <div key={text} className="flex items-center gap-3">
                                                <div
                                                    className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                                                    style={{ background: 'rgba(197,160,89,0.15)' }}
                                                >
                                                    <CheckCircle className="h-3.5 w-3.5" style={{ color: GOLD_LIGHT }} />
                                                </div>
                                                <span className="text-sm text-zinc-400">{text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Form Panel */}
                <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                    className="flex-1 w-full lg:w-1/2 flex items-center justify-center px-6 py-16 lg:px-16 z-10"
                >
                    <AnimatePresence mode="popLayout">
                        {isLogin ? (
                            <LoginForm navigate={navigate} />
                        ) : (
                            <RegisterForm navigate={navigate} />
                        )}
                    </AnimatePresence>
                </motion.div>

            </div>
        </div>
    );
};

export default AuthPage;
