import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <Scissors className="h-8 w-8 text-[#C5A059]" />
              <span className="text-2xl font-bold tracking-tighter text-white">JK SALON</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Premium grooming and styling services for the modern individual. Experience luxury and precision at JK Salon.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-[#C5A059] transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-[#C5A059] transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-[#C5A059] transition-colors"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/services" className="hover:text-[#C5A059] transition-colors">Services</Link></li>
              <li><Link to="/booking" className="hover:text-[#C5A059] transition-colors">Book Appointment</Link></li>
              <li><Link to="/gallery" className="hover:text-[#C5A059] transition-colors">Gallery</Link></li>
              <li><Link to="/about" className="hover:text-[#C5A059] transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#C5A059] shrink-0" />
                <span>123 Salon Street, Colombo 07, Sri Lanka</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#C5A059] shrink-0" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#C5A059] shrink-0" />
                <span>hello@jksalon.com</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-white font-semibold mb-6">Opening Hours</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between">
                <span>Mon - Fri</span>
                <span className="text-white">9:00 AM - 8:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span className="text-white">9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="text-white">10:00 AM - 4:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 lg:mt-20 pt-8 border-t border-white/5 text-center text-xs">
          <p>© {new Date().getFullYear()} JK Salon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
