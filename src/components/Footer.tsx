import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import {
  Scissors, Instagram, Facebook, Twitter, Mail, Phone,
  MapPin, Clock, Heart, ArrowRight
} from 'lucide-react';
import {
  OwnerProfile,
  defaultOwnerProfile,
  getOwnerProfile,
  subscribeOwnerProfileChanges,
} from '../utils/ownerProfile';

/* ── Real-time shop status based on Sri Lanka time (Asia/Colombo, UTC+5:30) ── */
const useSalonStatus = () => {
  const checkStatus = () => {
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })
    );
    const day = now.getDay(); // 0 = Sunday
    const hour = now.getHours();
    const minute = now.getMinutes();
    const time = hour + minute / 60;

    // Schedule:
    // Mon–Fri (1–5): 9:00 AM – 8:00 PM
    // Saturday  (6): 9:00 AM – 6:00 PM
    // Sunday    (0): 10:00 AM – 4:00 PM
    if (day >= 1 && day <= 5) return time >= 9 && time < 20;
    if (day === 6) return time >= 9 && time < 18;
    if (day === 0) return time >= 10 && time < 16;
    return false;
  };

  const [isOpen, setIsOpen] = useState(checkStatus);

  useEffect(() => {
    const interval = setInterval(() => setIsOpen(checkStatus()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return isOpen;
};

const GOLD = '#C5A059';
const GOLD_LIGHT = '#E8C97A';

const SocialIcon = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noreferrer"
    whileHover={{ y: -4, scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="group relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all duration-300"
    style={{
      background: 'rgba(197,160,89,0.08)',
      border: '1px solid rgba(197,160,89,0.18)',
    }}
    aria-label={label}
  >
    <div
      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ background: `linear-gradient(135deg, ${GOLD}30, ${GOLD_LIGHT}20)`, border: `1px solid ${GOLD}40` }}
    />
    <Icon className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px] relative z-10 text-zinc-500 group-hover:text-[#C5A059] transition-colors duration-300" />
  </motion.a>
);

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <li>
    <Link
      to={to}
      className="group inline-flex items-center gap-1.5 py-1 text-[13px] text-zinc-600 hover:text-zinc-900 transition-all duration-300"
    >
      <span
        className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <ArrowRight className="h-3 w-3" style={{ color: GOLD }} />
      </span>
      {children}
    </Link>
  </li>
);

const ContactLine = ({ icon: Icon, children }: { icon: any; children: React.ReactNode }) => (
  <li className="flex items-start gap-3 group">
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-110"
      style={{
        background: 'rgba(197,160,89,0.08)',
        border: '1px solid rgba(197,160,89,0.12)',
      }}
    >
      <Icon className="h-3.5 w-3.5" style={{ color: GOLD }} />
    </div>
    <span className="text-[13px] text-zinc-600 leading-relaxed group-hover:text-zinc-900 transition-colors duration-300">
      {children}
    </span>
  </li>
);

const Footer = () => {
  const isOpen = useSalonStatus();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile>(() => ({ ...defaultOwnerProfile, ...getOwnerProfile() }));

  useEffect(() => {
    const unsubscribe = subscribeOwnerProfileChanges((profile) => {
      setOwnerProfile({ ...defaultOwnerProfile, ...profile });
    });

    return unsubscribe;
  }, []);

  const openingHoursList = ownerProfile.openingHours
    .split(',')
    .map((slot) => slot.trim())
    .filter(Boolean);

  return (
    <footer className="relative overflow-hidden" style={{ background: '#FDFBF7' }}>
      {/* Decorative Top Border */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}40, transparent)` }} />

      {/* Ambient Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-[0.03]"
        style={{ background: `radial-gradient(ellipse, ${GOLD_LIGHT}, transparent 70%)` }}
      />

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(197,160,89,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(197,160,89,0.12) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10 lg:pt-14 pb-8">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="space-y-5 rounded-2xl border border-[#C5A059]/15 bg-white/70 p-4 sm:p-0 sm:border-0 sm:bg-transparent lg:col-span-1"
          >
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` }}
              >
                <Scissors className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900">
                {ownerProfile.shopName}
              </span>
            </Link>
            <p className="text-[13px] text-zinc-600 leading-[1.8] max-w-[280px]">
              {ownerProfile.bio}
            </p>
            <div className="flex gap-2.5">
              <SocialIcon href={ownerProfile.instagram || '#'} icon={Instagram} label="Instagram" />
              <SocialIcon href={ownerProfile.facebook || '#'} icon={Facebook} label="Facebook" />
              <SocialIcon href={ownerProfile.website || '#'} icon={Twitter} label="Website" />
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="rounded-2xl border border-[#C5A059]/15 bg-white/70 p-4 sm:p-0 sm:border-0 sm:bg-transparent"
          >
            <h4
              className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
              style={{ color: GOLD }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3.5">
              <FooterLink to="/services">Services</FooterLink>
              <FooterLink to="/booking">Book Appointment</FooterLink>
              <FooterLink to="/gallery">Gallery</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="rounded-2xl border border-[#C5A059]/15 bg-white/70 p-4 sm:p-0 sm:border-0 sm:bg-transparent"
          >
            <h4
              className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
              style={{ color: GOLD }}
            >
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <ContactLine icon={MapPin}>
                {ownerProfile.shopAddress}
              </ContactLine>
              <ContactLine icon={Phone}>
                {ownerProfile.contactPhone}
              </ContactLine>
              <ContactLine icon={Mail}>
                {ownerProfile.email}
              </ContactLine>
            </ul>
          </motion.div>

          {/* Opening Hours */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="rounded-2xl border border-[#C5A059]/15 bg-white/70 p-4 sm:p-0 sm:border-0 sm:bg-transparent"
          >
            <h4
              className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
              style={{ color: GOLD }}
            >
              Opening Hours
            </h4>
            <div className="space-y-3">
              {openingHoursList.map((item) => (
                <div
                  key={item}
                  className="flex justify-between items-center py-2.5 px-3.5 rounded-xl transition-all duration-300 hover:bg-[#C5A059]/[0.05]"
                  style={{ border: '1px solid rgba(197,160,89,0.12)' }}
                >
                  <span className="text-[13px] text-zinc-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
            {/* Status Badge — live based on Sri Lanka time */}
            <div
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-500"
              style={{
                background: isOpen ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${isOpen ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,
              }}
            >
              <span className="relative flex h-2 w-2">
                {isOpen && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className="relative inline-flex rounded-full h-2 w-2 transition-colors duration-500"
                  style={{ background: isOpen ? '#10B981' : '#EF4444' }}
                />
              </span>
              <span
                className="text-[11px] font-bold uppercase tracking-wider transition-colors duration-500"
                style={{ color: isOpen ? '#34D399' : '#F87171' }}
              >
                {isOpen ? 'Open Now' : 'Closed'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-10 sm:mt-14 lg:mt-20 pt-6 sm:pt-7 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4"
          style={{ borderTop: '1px solid rgba(197,160,89,0.15)' }}
        >
          <p className="text-[11px] text-zinc-600 tracking-wide text-center sm:text-left">
            © {new Date().getFullYear()} JK Salon. All rights reserved.
          </p>
          <p className="text-[11px] text-zinc-700 flex items-center gap-1.5">
            Crafted with <Heart className="h-3 w-3" style={{ color: GOLD, fill: GOLD }} /> by JK Studio
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
