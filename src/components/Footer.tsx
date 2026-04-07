import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import {
  Scissors, Instagram, Facebook, Twitter, Mail, Phone,
  MapPin, ArrowUpRight, Clock, Heart, ArrowRight
} from 'lucide-react';

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
    className="group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300"
    style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}
    aria-label={label}
  >
    <div
      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ background: `linear-gradient(135deg, ${GOLD}30, ${GOLD_LIGHT}20)`, border: `1px solid ${GOLD}40` }}
    />
    <Icon className="h-[18px] w-[18px] relative z-10 text-zinc-400 group-hover:text-white transition-colors duration-300" />
  </motion.a>
);

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <li>
    <Link
      to={to}
      className="group inline-flex items-center gap-1.5 text-[13px] text-zinc-500 hover:text-white transition-all duration-300"
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
    <span className="text-[13px] text-zinc-500 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
      {children}
    </span>
  </li>
);

const Footer = () => {
  const isOpen = useSalonStatus();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <footer className="relative overflow-hidden" style={{ background: 'white' }}>
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
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 lg:pt-24 pb-8">
        {/* Top CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-16 mb-12"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div>
            <h2 className="text-3xl lg:text-4xl font-serif text-white tracking-tight mb-3">
              Ready for a{' '}
              <span
                style={{
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                transformation?
              </span>
            </h2>
            <p className="text-zinc-500 text-sm max-w-md">
              Book your appointment today and experience premium grooming at its finest.
            </p>
          </div>
          <Link to="/booking">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-bold text-white transition-all"
              style={{
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                boxShadow: `0 12px 32px rgba(197,160,89,0.25)`,
              }}
            >
              Book Appointment
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <div
                className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </motion.div>
          </Link>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="space-y-6 lg:col-span-1"
          >
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` }}
              >
                <Scissors className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                JK <span className="font-light text-zinc-400">SALON</span>
              </span>
            </Link>
            <p className="text-[13px] text-zinc-500 leading-[1.8] max-w-[260px]">
              Premium grooming and styling services for the modern individual. Where precision meets luxury.
            </p>
            <div className="flex gap-2.5">
              <SocialIcon href="#" icon={Instagram} label="Instagram" />
              <SocialIcon href="#" icon={Facebook} label="Facebook" />
              <SocialIcon href="#" icon={Twitter} label="Twitter" />
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
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
          >
            <h4
              className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
              style={{ color: GOLD }}
            >
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <ContactLine icon={MapPin}>
                123 Salon Street,<br />Colombo 07, Sri Lanka
              </ContactLine>
              <ContactLine icon={Phone}>
                +94 759560114
              </ContactLine>
              <ContactLine icon={Mail}>
                hello@jksalon.com
              </ContactLine>
            </ul>
          </motion.div>

          {/* Opening Hours */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <h4
              className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
              style={{ color: GOLD }}
            >
              Opening Hours
            </h4>
            <div className="space-y-3">
              {[
                { day: 'Mon – Fri', time: '9:00 AM – 8:00 PM' },
                { day: 'Saturday', time: '9:00 AM – 6:00 PM' },
                { day: 'Sunday', time: '10:00 AM – 4:00 PM' },
              ].map((item) => (
                <div
                  key={item.day}
                  className="flex justify-between items-center py-2.5 px-3.5 rounded-xl transition-all duration-300 hover:bg-white/[0.03]"
                  style={{ border: '1px solid rgba(255,255,255,0.03)' }}
                >
                  <span className="text-[13px] text-zinc-500">{item.day}</span>
                  <span className="text-[13px] text-zinc-300 font-medium">{item.time}</span>
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
          className="mt-16 lg:mt-20 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="text-[11px] text-zinc-600 tracking-wide">
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
