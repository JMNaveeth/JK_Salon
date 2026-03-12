import React, { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Phone, Mail, MapPin, Clock, MessageSquare,
  Send, CheckCircle, Loader2, ArrowRight, Scissors
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const GOLD = '#C5A059';
const GOLD_LIGHT = '#E8C97A';
const CREAM = '#FDFAF5';
const CREAM2 = '#F7F2EA';

/* ── Info card ─────────────────────────────────────────────── */
const InfoCard = ({
  icon: Icon,
  title,
  lines,
  action,
  idx,
}: {
  icon: any;
  title: string;
  lines: React.ReactNode[];
  action?: { label: string; href: string };
  idx: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-2xl p-7 overflow-hidden transition-all"
      style={{
        border: '1px solid rgba(197,160,89,0.13)',
        boxShadow: '0 4px 24px rgba(197,160,89,0.07)',
      }}
    >
      {/* top gold reveal */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg,transparent,${GOLD},transparent)` }}
      />
      {/* icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
        style={{
          background: `linear-gradient(135deg,rgba(197,160,89,0.12),rgba(232,201,122,0.06))`,
          border: '1px solid rgba(197,160,89,0.18)',
        }}
      >
        <Icon className="h-5 w-5" style={{ color: GOLD }} />
      </div>
      <h3 className="text-[#1A1A1A] font-bold text-base mb-3">{title}</h3>
      <div className="space-y-1">
        {lines.map((line, i) => (
          <p key={i} className="text-zinc-500 text-sm leading-relaxed">{line}</p>
        ))}
      </div>
      {action && (
        <a
          href={action.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold uppercase tracking-wider transition-all hover:gap-2.5"
          style={{ color: GOLD }}
        >
          {action.label} <ArrowRight className="h-3 w-3" />
        </a>
      )}
    </motion.div>
  );
};

/* ── Styled input ──────────────────────────────────────────── */
const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <label
      className="block text-[10px] font-bold uppercase tracking-[0.35em]"
      style={{ color: GOLD }}
    >
      {label}
    </label>
    {children}
  </div>
);

const inputClass =
  'w-full rounded-xl px-4 py-3.5 text-sm text-[#1A1A1A] outline-none transition-all placeholder:text-zinc-400 bg-white';
const inputStyle = {
  border: '1.5px solid rgba(197,160,89,0.2)',
  boxShadow: '0 2px 8px rgba(197,160,89,0.04)',
};
const inputFocusStyle = {
  borderColor: GOLD,
  boxShadow: `0 0 0 3px rgba(197,160,89,0.12)`,
};

/* ── Focus-aware input wrapper ─────────────────────────────── */
const FocusInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      className={inputClass}
      style={{ ...inputStyle, ...(focused ? inputFocusStyle : {}) }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

const FocusTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      {...props}
      className={inputClass + ' resize-none'}
      style={{ ...inputStyle, ...(focused ? inputFocusStyle : {}) }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

/* ══════════════════════════════════════════════════════════════
   CONTACT PAGE
══════════════════════════════════════════════════════════════ */
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill in all fields before sending.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.sendMessage(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 6000);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send your message. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true, margin: '-60px' });

  const infoCards = [
    {
      icon: Phone,
      title: 'Call Us',
      lines: ['+94 11 234 5678', '+94 77 123 4567'],
      action: { label: 'Call Now', href: 'tel:+94112345678' },
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp',
      lines: ['+94 77 123 4567', 'Available 9am – 8pm'],
      action: { label: 'Chat Now', href: 'https://wa.me/94771234567' },
    },
    {
      icon: Mail,
      title: 'Email Us',
      lines: ['hello@jksalon.com', 'support@jksalon.com'],
      action: { label: 'Send Email', href: 'mailto:hello@jksalon.com' },
    },
    {
      icon: Clock,
      title: 'Opening Hours',
      lines: ['Mon – Fri: 9:00am – 8:00pm', 'Sat – Sun: 9:00am – 6:00pm'],
    },
  ];

  return (
    <div className="overflow-x-hidden" style={{ background: CREAM }}>

      {/* ════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════ */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=2200"
            alt="Salon"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            style={{ opacity: 0.07 }}
          />
          <div className="absolute inset-0"
            style={{ background: `linear-gradient(to bottom,${CREAM} 0%,rgba(253,250,245,0.5) 50%,${CREAM} 100%)` }} />
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 50% 40%,rgba(197,160,89,0.1) 0%,transparent 60%)' }} />
        </div>

        {[280, 420, 560].map((size, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{ width: size, height: size, border: `1px solid rgba(197,160,89,${0.09 - i * 0.02})` }}
            animate={{ scale: [1, 1.04, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.div
            className="inline-flex items-center gap-3 mb-7"
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="w-8 h-px" style={{ background: GOLD }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em]" style={{ color: GOLD }}>
              We'd Love to Hear from You
            </span>
            <span className="w-8 h-px" style={{ background: GOLD }} />
          </motion.div>

          <div className="overflow-hidden mb-5">
            <motion.h1
              className="font-serif tracking-[-0.03em] text-[#1A1A1A]"
              style={{ fontSize: 'clamp(3.5rem,8vw,6rem)', lineHeight: 1 }}
              initial={{ y: 100 }} animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              Get in{' '}
              <span style={{
                background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                Touch
              </span>
            </motion.h1>
          </div>

          <motion.p
            className="text-zinc-500 text-base md:text-lg leading-relaxed max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Have questions or want to book a special session? Reach out to us anytime — we're always happy to help.
          </motion.p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          INFO CARDS
      ════════════════════════════════════════════════════════ */}
      <section className="pb-16" style={{ background: CREAM }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {infoCards.map((card, idx) => (
              <InfoCard
                key={idx}
                idx={idx}
                icon={card.icon}
                title={card.title}
                lines={card.lines}
                action={card.action}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FORM + LOCATION SIDE BY SIDE
      ════════════════════════════════════════════════════════ */}
      <section className="py-16" style={{ background: CREAM2 }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* ── Contact Form ── */}
            <motion.div
              ref={formRef}
              initial={{ opacity: 0, x: -50 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-3xl p-8 lg:p-10"
              style={{
                border: '1px solid rgba(197,160,89,0.15)',
                boxShadow: '0 8px 40px rgba(197,160,89,0.08)',
              }}
            >
              {/* form header */}
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})` }}
                >
                  <Send className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] leading-none">Send a Message</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">We reply within 24 hours</p>
                </div>
              </div>

              {/* success state */}
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                    style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 16px 40px rgba(197,160,89,0.35)` }}
                  >
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#1A1A1A] mb-3">Message Sent!</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Full Name">
                      <FocusInput
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                      />
                    </Field>
                    <Field label="Email Address">
                      <FocusInput
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                      />
                    </Field>
                  </div>

                  <Field label="Subject">
                    <FocusInput
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                    />
                  </Field>

                  <Field label="Message">
                    <FocusTextarea
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your enquiry..."
                    />
                  </Field>

                  {/* error */}
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-semibold px-4 py-3 rounded-xl"
                      style={{ background: 'rgba(197,160,89,0.08)', color: '#9B6D1E', border: '1px solid rgba(197,160,89,0.2)' }}
                    >
                      {error}
                    </motion.p>
                  )}

                  {/* submit — GOLDEN button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.97 }}
                    className="w-full relative overflow-hidden flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold text-white disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`,
                      boxShadow: `0 8px 28px rgba(197,160,89,0.38)`,
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending…</span>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">Send Message</span>
                        <Send className="relative z-10 h-4 w-4" />
                        {/* shimmer */}
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          initial={{ x: '-110%' }}
                          whileHover={{ x: '110%' }}
                          transition={{ duration: 0.55 }}
                        />
                      </>
                    )}
                  </motion.button>

                  <p className="text-center text-[10px] text-zinc-400 uppercase tracking-widest">
                    Or call us directly at{' '}
                    <a href="tel:+94112345678" className="font-bold" style={{ color: GOLD }}>
                      +94 11 234 5678
                    </a>
                  </p>
                </form>
              )}
            </motion.div>

            {/* ── Location side ── */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              {/* location card */}
              <div
                className="bg-white rounded-3xl p-8"
                style={{ border: '1px solid rgba(197,160,89,0.15)', boxShadow: '0 8px 40px rgba(197,160,89,0.07)' }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})` }}
                  >
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[#1A1A1A] font-bold text-lg mb-1">Our Location</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      123 Salon Street, Colombo 07, Sri Lanka.<br />
                      Near Independence Square.
                    </p>
                    <a
                      href="https://maps.google.com/?q=Colombo+07+Sri+Lanka"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold uppercase tracking-wider"
                      style={{ color: GOLD }}
                    >
                      Open in Google Maps <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                {/* Opening hours removed per request */}
              </div>

              {/* Google Map embed */}
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  border: '1px solid rgba(197,160,89,0.15)',
                  boxShadow: '0 8px 30px rgba(197,160,89,0.08)',
                  height: 280,
                }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.81529707!2d79.8211859!3d6.9218374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2593cf65a1e9d%3A0x53139987a6691ff3!2sColombo!5e0!3m2!1sen!2slk!4v1647856456789!5m2!1sen!2slk"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'saturate(0.8) contrast(1.05)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="JK Salon Location"
                />
              </div>

              {/* quick action buttons */}
              <div className="grid grid-cols-2 gap-4">
                <motion.a
                  href="tel:+94112345678"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 6px 20px rgba(197,160,89,0.3)` }}
                >
                  <Phone className="h-4 w-4" /> Call Now
                </motion.a>
                <motion.a
                  href="https://wa.me/94771234567"
                  target="_blank" rel="noreferrer"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold"
                  style={{ border: `2px solid ${GOLD}`, color: GOLD, background: 'transparent' }}
                >
                  <MessageSquare className="h-4 w-4" /> WhatsApp
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA section removed per request */}
    </div>
  );
};

export default Contact;