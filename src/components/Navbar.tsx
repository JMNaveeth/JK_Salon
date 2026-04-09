import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/utils/cn';

const Navbar = ({ onLogout }: { onLogout?: () => void }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

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
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 bg-black/30 border-[#C5A059]/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/jk_logo.png"
              alt="JK Salon"
              className="h-10 sm:h-11 w-auto object-contain"
            />
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
                    : "text-white"
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

            {/* Logout Button */}
            {onLogout && (
              <motion.button
                onClick={onLogout}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 border",
                  "bg-black/20 border-[#C5A059]/35 text-[#C5A059] hover:bg-[#C5A059]/10"
                )}
                aria-label="Log out"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </motion.button>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="md:hidden flex items-center gap-2">
            {/* Logout Mobile (icon only) */}
            {onLogout && (
              <motion.button
                onClick={onLogout}
                whileTap={{ scale: 0.85 }}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center border transition-colors duration-300",
                  "bg-black/20 border-[#C5A059]/35 text-[#C5A059]"
                )}
                aria-label="Log out"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </motion.button>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 transition-colors text-zinc-400 hover:text-white"
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
              "bg-zinc-900 border-white/10"
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
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
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

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;