import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scissors, Menu, X, Sun, Moon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/utils/cn';

// Theme context (can be moved to a separate context file)
const ThemeContext = React.createContext<{
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}>({ theme: 'dark', toggleTheme: () => {} });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');

  React.useEffect(() => {
    const saved = localStorage.getItem('jk-theme') as 'dark' | 'light' | null;
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('jk-theme', next);
      return next;
    });
  };

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => React.useContext(ThemeContext);

const Navbar = ({ onLogout }: { onLogout?: () => void }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isDark = theme === 'dark';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-colors duration-300",
        isDark
          ? "bg-black/30 border-[#C5A059]/20"
          : "bg-white/70 border-[#C5A059]/30 shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Scissors className="h-8 w-8 text-[#C5A059]" />
            <span className={cn(
              "text-2xl font-bold tracking-tighter transition-colors duration-300",
              isDark ? "text-white" : "text-zinc-900"
            )}>
              JK SALON
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#C5A059]",
                  isActive(link.path)
                    ? "text-[#C5A059]"
                    : isDark ? "text-white" : "text-zinc-700"
                )}
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/booking"
              className="bg-[#C5A059] hover:bg-[#B48F48] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all"
            >
              Book Now
            </Link>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              className={cn(
                "relative w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 border",
                isDark
                  ? "bg-zinc-800 border-zinc-700 text-amber-400 hover:bg-zinc-700"
                  : "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
              )}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.span
                    key="sun"
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-4 w-4" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Logout Button */}
            {onLogout && (
              <motion.button
                onClick={onLogout}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full border transition-all duration-200",
                  isDark
                    ? "border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-400/50 hover:bg-red-400/10"
                    : "border-zinc-300 text-zinc-600 hover:text-red-500 hover:border-red-400/60 hover:bg-red-50"
                )}
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log out</span>
              </motion.button>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="md:hidden flex items-center gap-2">
            {/* Theme Toggle Mobile */}
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.85 }}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center border transition-colors duration-300",
                isDark
                  ? "bg-zinc-800 border-zinc-700 text-amber-400"
                  : "bg-amber-50 border-amber-200 text-amber-600"
              )}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.span key="sun-m" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                    <Sun className="h-4 w-4" />
                  </motion.span>
                ) : (
                  <motion.span key="moon-m" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                    <Moon className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "p-2 transition-colors",
                isDark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "md:hidden border-b transition-colors duration-300",
              isDark
                ? "bg-zinc-900 border-white/10"
                : "bg-white border-zinc-200 shadow-lg"
            )}
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-4 text-base font-medium rounded-md transition-colors",
                    isActive(link.path)
                      ? "text-[#C5A059] bg-[#C5A059]/10"
                      : isDark
                        ? "text-zinc-400 hover:text-white hover:bg-zinc-800"
                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                  )}
                >
                  {link.name}
                </Link>
              ))}

              <Link
                to="/booking"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-[#C5A059] hover:bg-[#B48F48] text-white px-6 py-4 rounded-xl text-base font-semibold mt-4 transition-colors"
              >
                Book Now
              </Link>

              {/* Mobile Logout */}
              {onLogout && (
                <button
                  onClick={() => { setIsOpen(false); onLogout(); }}
                  className={cn(
                    "flex items-center gap-2 w-full px-3 py-4 text-base font-medium rounded-md mt-1 transition-colors",
                    isDark
                      ? "text-red-400 hover:bg-red-400/10"
                      : "text-red-500 hover:bg-red-50"
                  )}
                >
                  <LogOut className="h-5 w-5" />
                  Log out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;