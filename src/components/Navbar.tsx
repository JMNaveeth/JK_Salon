import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scissors, Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/utils/cn';

const Navbar = () => {
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 from-[#E8C97A]/40 via-[#C5A059]/30 to-[#E8C97A]/40 backdrop-blur-xl border-b border-[#C5A059]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <Scissors className="h-8 w-8 text-[#C5A059]" />
            <span className="text-2xl font-bold tracking-tighter text-white">JK SALON</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#C5A059]",
                  isActive(link.path) ? "text-[#C5A059]" : "text-white"
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
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-400 hover:text-white p-2"
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
            className="md:hidden bg-zinc-900 border-b border-white/10"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-4 text-base font-medium rounded-md",
                    isActive(link.path) ? "text-[#C5A059] bg-[#C5A059]/10" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/booking"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-[#C5A059] hover:bg-[#B48F48] text-white px-6 py-4 rounded-xl text-base font-semibold mt-4"
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
