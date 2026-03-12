import React, { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Phone, Mail, MapPin, Clock, MessageSquare,
  Send, CheckCircle, Loader2, ArrowRight, Scissors, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const GOLD = '#C5A059';
const GOLD_LIGHT = '#E8C97A';
const CREAM = '#FDFAF5';
const CREAM2 = '#F7F2EA';

/* ── Focus-aware input ─────────────────────────────────────── */
const inputBase = 'w-full rounded-2xl px-5 py-4 text-sm text-[#1A1A1A] outline-none transition-all placeholder:text-zinc-400 bg-[#FDFAF5]';
const inputNormal = { border: '1.5px solid rgba(197,160,89,0.22)', boxShadow: '0 2px 8px rgba(197,160,89,0.04)' };
const inputFocus  = { border: `1.5px solid ${GOLD}`, boxShadow: `0 0 0 4px rgba(197,160,89,0.1)` };

const FocusInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const [f, setF] = useState(false);
  return (
    <input {...props} className={inputBase} style={f ? inputFocus : inputNormal}
      onFocus={() => setF(true)} onBlur={() => setF(false)} />
  );
};
const FocusTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const [f, setF] = useState(false);
  return (
    <textarea {...props} className={inputBase + ' resize-none'} style={f ? inputFocus : inputNormal}
      onFocus={() => setF(true)} onBlur={() => setF(false)} />
  );
};

/* ── Field wrapper ──────────────────────────────────────────── */
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: GOLD }}>{label}</label>
    {children}
  </div>
);

/* ── Info card ──────────────────────────────────────────────── */
const InfoCard = ({ icon: Icon, title, lines, action, idx }: {
  icon: any; title: string; lines: string[]; action?: { label: string; href: string }; idx: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative bg-white rounded-2xl p-7 overflow-hidden"
      style={{ border: '1px solid rgba(197,160,89,0.13)', boxShadow: '0 4px 24px rgba(197,160,89,0.07)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg,transparent,${GOLD},transparent)` }} />
      <motion.div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
        style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})` }}
        whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: 'spring', stiffness: 300 }}
      >
        <Icon className="h-5 w-5 text-white" />
      </motion.div>
      <h3 className="text-[#1A1A1A] font-bold text-base mb-3">{title}</h3>
      <div className="space-y-1 mb-4">
        {lines.map((l, i) => <p key={i} className="text-zinc-500 text-sm">{l}</p>)}
      </div>
      {action && (
        <a href={action.href} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider group/link"
          style={{ color: GOLD }}
        >
          {action.label}
          <ArrowRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
        </a>
      )}
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════
   CONTACT PAGE
══════════════════════════════════════════════════════════════ */
const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]   = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill in all fields before sending.'); return;
    }
    setLoading(true); setError('');
    try {
      await api.sendMessage(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 6000);
    } catch {
      setError('Failed to send your message. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  const mainRef = useRef(null);
  const mainInView = useInView(mainRef, { once: true, margin: '-60px' });

  const infoCards = [
    { icon: Phone,        title: 'Call Us',       lines: ['+94 11 234 5678', '+94 77 123 4567'],          action: { label: 'Call Now',    href: 'tel:+94112345678' }           },
    { icon: MessageSquare,title: 'WhatsApp',       lines: ['+94 77 123 4567', 'Available 9am – 8pm'],      action: { label: 'Chat Now',    href: 'https://wa.me/94771234567' }  },
    { icon: Mail,         title: 'Email Us',       lines: ['hello@jksalon.com', 'support@jksalon.com'],    action: { label: 'Send Email',  href: 'mailto:hello@jksalon.com' }   },
    { icon: Clock,        title: 'Opening Hours',  lines: ['Mon – Fri: 9:00am – 8:00pm', 'Sat – Sun: 9:00am – 6:00pm'] },
  ];

  const hours = [
    { day: 'Monday – Friday', time: '9:00 AM – 8:00 PM' },
    { day: 'Saturday',        time: '9:00 AM – 6:00 PM' },
    { day: 'Sunday',          time: '9:00 AM – 6:00 PM' },
  ];

  return (
    <div className="overflow-x-hidden" style={{ background: CREAM }}>

      {/* ════ HERO ═══════════════════════════════════════════════ */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=2200"
            alt="Salon" className="w-full h-full object-cover" referrerPolicy="no-referrer" style={{ opacity: 0.07 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom,${CREAM} 0%,rgba(253,250,245,0.5) 50%,${CREAM} 100%)` }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%,rgba(197,160,89,0.1) 0%,transparent 60%)' }} />
        </div>

        {[280, 420, 560].map((size, i) => (
          <motion.div key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{ width: size, height: size, border: `1px solid rgba(197,160,89,${0.09 - i * 0.02})` }}
            animate={{ scale: [1, 1.04, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }} />
        ))}

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.div className="inline-flex items-center gap-3 mb-7"
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="w-8 h-px" style={{ background: GOLD }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em]" style={{ color: GOLD }}>We'd Love to Hear from You</span>
            <span className="w-8 h-px" style={{ background: GOLD }} />
          </motion.div>

          <div className="overflow-hidden mb-5">
            <motion.h1 className="font-serif tracking-[-0.03em] text-[#1A1A1A]"
              style={{ fontSize: 'clamp(3.5rem,8vw,6rem)', lineHeight: 1 }}
              initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
              Get in{' '}
              <span style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Touch
              </span>
            </motion.h1>
          </div>

          <motion.p className="text-zinc-500 text-base md:text-lg leading-relaxed max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}>
            Have questions or want to book a special session? Reach out to us anytime — we're always happy to help.
          </motion.p>

          {/* rating strip */}
          <motion.div className="inline-flex items-center gap-3 mt-8 px-6 py-3 rounded-full"
            style={{ background: '#fff', border: '1px solid rgba(197,160,89,0.18)', boxShadow: '0 4px 20px rgba(197,160,89,0.08)' }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-[#C5A059] text-[#C5A059]" />)}
            </div>
            <span className="text-xs font-bold text-[#1A1A1A]">5.0 Rated</span>
            <span className="w-px h-4 bg-zinc-200" />
            <span className="text-xs text-zinc-400">5,000+ Happy Clients</span>
          </motion.div>
        </div>
      </section>

      {/* ════ INFO CARDS ═════════════════════════════════════════ */}
      <section className="pb-16" style={{ background: CREAM }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {infoCards.map((card, idx) => (
              <InfoCard key={idx} idx={idx} icon={card.icon} title={card.title} lines={card.lines} action={card.action} />
            ))}
          </div>
        </div>
      </section>

      {/* ════ FORM + MAP ═════════════════════════════════════════ */}
      <section className="py-16" style={{ background: CREAM2 }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div ref={mainRef} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* ── FORM ── */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={mainInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-3xl p-8 lg:p-10"
              style={{ border: '1px solid rgba(197,160,89,0.15)', boxShadow: '0 12px 50px rgba(197,160,89,0.09)' }}
            >
              {/* header */}
              <div className="flex items-center gap-4 mb-8 pb-6" style={{ borderBottom: '1px solid rgba(197,160,89,0.12)' }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 6px 20px rgba(197,160,89,0.3)` }}>
                  <Send className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] leading-none">Send a Message</h3>
                  <p className="text-xs text-zinc-400 mt-1">We reply within 24 hours · All fields required</p>
                </div>
              </div>

              {/* success */}
              {success ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-14 text-center">
                  <motion.div
                    className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                    style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 16px 40px rgba(197,160,89,0.35)` }}
                    animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <CheckCircle className="h-12 w-12 text-white" />
                  </motion.div>
                  <h4 className="text-2xl font-bold text-[#1A1A1A] mb-3">Message Sent!</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <div className="flex gap-1 mt-6">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-[#C5A059] text-[#C5A059]" />)}
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Full Name">
                      <FocusInput type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
                    </Field>
                    <Field label="Email Address">
                      <FocusInput type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                    </Field>
                  </div>
                  <Field label="Subject">
                    <FocusInput type="text" name="subject" required value={formData.subject} onChange={handleChange} placeholder="How can we help?" />
                  </Field>
                  <Field label="Message">
                    <FocusTextarea name="message" rows={5} required value={formData.message} onChange={handleChange} placeholder="Tell us more about your enquiry..." />
                  </Field>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold"
                      style={{ background: 'rgba(197,160,89,0.08)', color: '#9B6D1E', border: '1px solid rgba(197,160,89,0.2)' }}>
                      {error}
                    </motion.div>
                  )}

                  <motion.button type="submit" disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.97 }}
                    className="w-full relative overflow-hidden flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold text-white disabled:opacity-60"
                    style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 8px 28px rgba(197,160,89,0.38)` }}>
                    {loading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /><span>Sending…</span></>
                    ) : (
                      <>
                        <span className="relative z-10">Send Message</span>
                        <Send className="relative z-10 h-4 w-4" />
                        <motion.div className="absolute inset-0 bg-white/20" initial={{ x: '-110%' }} whileHover={{ x: '110%' }} transition={{ duration: 0.55 }} />
                      </>
                    )}
                  </motion.button>

                  <p className="text-center text-[10px] text-zinc-400 uppercase tracking-widest pt-1">
                    Or call us at{' '}
                    <a href="tel:+94112345678" className="font-bold" style={{ color: GOLD }}>+94 11 234 5678</a>
                  </p>
                </form>
              )}
            </motion.div>

            {/* ── MAP + LOCATION ── */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={mainInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-5"
            >
              {/* location info card — matches screenshot style */}
              <div className="bg-white rounded-3xl p-7"
                style={{ border: '1px solid rgba(197,160,89,0.15)', boxShadow: '0 8px 40px rgba(197,160,89,0.08)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 6px 16px rgba(197,160,89,0.3)` }}>
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#1A1A1A] font-bold text-lg mb-1">Our Location</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      123 Salon Street, Colombo 07, Sri Lanka.<br />
                      Near Independence Square.
                    </p>
                    <a href="https://maps.google.com/?q=Independence+Square+Colombo+Sri+Lanka"
                      target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold uppercase tracking-wider group/ml"
                      style={{ color: GOLD }}>
                      Open in Google Maps
                      <ArrowRight className="h-3 w-3 group-hover/ml:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Google Map — zoomed to Colombo 07 / Independence Square */}
              <div className="rounded-3xl overflow-hidden relative"
                style={{ border: '1px solid rgba(197,160,89,0.18)', boxShadow: '0 8px 30px rgba(197,160,89,0.1)', height: 300 }}>
                {/* gold corner accent */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm"
                  style={{ background: 'rgba(255,255,255,0.9)', border: `1px solid rgba(197,160,89,0.3)`, boxShadow: '0 2px 12px rgba(197,160,89,0.15)' }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: GOLD }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: GOLD }}>JK Salon</span>
                </div>
                <iframe
                  /* Zoomed to Colombo 07 Independence Square area */
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7923.8!2d79.8612!3d6.9006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259601b4c4c57%3A0x8a0a63e32f4e40!2sIndependence+Square%2C+Colombo+07!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="JK Salon – Colombo 07"
                />
              </div>

              {/* Hours table */}
              <div className="bg-white rounded-3xl p-7"
                style={{ border: '1px solid rgba(197,160,89,0.13)', boxShadow: '0 4px 24px rgba(197,160,89,0.06)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})` }}>
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-bold text-[#1A1A1A] text-base">Opening Hours</h3>
                </div>
                <div className="space-y-3">
                  {hours.map((row, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 px-4 rounded-xl"
                      style={{ background: i === 0 ? 'rgba(197,160,89,0.06)' : 'transparent', border: i === 0 ? '1px solid rgba(197,160,89,0.12)' : 'none' }}>
                      <span className="text-sm text-zinc-500">{row.day}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
                        <span className="text-sm font-bold text-[#1A1A1A]">{row.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* action buttons */}
              <div className="grid grid-cols-2 gap-4">
                <motion.a href="tel:+94112345678"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 6px 20px rgba(197,160,89,0.35)` }}>
                  <Phone className="h-4 w-4" /> Call Now
                </motion.a>
                <motion.a href="https://wa.me/94771234567" target="_blank" rel="noreferrer"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold"
                  style={{ border: `2px solid ${GOLD}`, color: GOLD }}>
                  <MessageSquare className="h-4 w-4" /> WhatsApp
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════ BOTTOM CTA ═════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden" style={{ background: CREAM }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%,rgba(197,160,89,0.09) 0%,transparent 65%)' }} />
        {[160, 280, 400].map((size, i) => (
          <motion.div key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{ width: size, height: size, border: `1px solid rgba(197,160,89,${0.14 - i * 0.04})` }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 2.5 + i, repeat: Infinity, delay: i * 0.5 }} />
        ))}
        <div className="relative z-10 max-w-xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8"
              style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 12px 30px rgba(197,160,89,0.35)` }}>
              <Scissors className="h-7 w-7 text-white" />
            </div>
            <h2 className="font-serif tracking-[-0.02em] mb-5 text-[#1A1A1A]"
              style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', lineHeight: 1.1 }}>
              Ready to{' '}
              <span style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Book?
              </span>
            </h2>
            <p className="text-zinc-500 text-base leading-relaxed mb-10">
              Skip the message — book your appointment directly and secure your slot today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                <Link to="/booking"
                  className="relative overflow-hidden inline-flex items-center gap-2 px-10 py-4 rounded-full text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 12px 40px rgba(197,160,89,0.4)` }}>
                  <span className="relative z-10">Book an Appointment</span>
                  <ArrowRight className="relative z-10 h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                <Link to="/services"
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-sm font-bold"
                  style={{ border: `2px solid ${GOLD}`, color: GOLD }}>
                  View Services
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;