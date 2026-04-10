import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Phone, Mail, MapPin, Clock, MessageSquare,
  Send, CheckCircle, Loader2, ArrowRight, Scissors
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  OwnerProfile,
  defaultOwnerProfile,
  getOwnerProfile,
  subscribeOwnerProfileChanges,
  toTelLink,
  toWhatsAppLink,
} from '../utils/ownerProfile';

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
      whileHover={{ y: -8, scale: 1.02, rotateX: 6, rotateY: -3 }}
      className="group relative bg-white rounded-2xl p-7 transition-all"
      style={{
        border: '1px solid rgba(197,160,89,0.13)',
        boxShadow: '0 4px 24px rgba(197,160,89,0.07)',
        transformPerspective: 1000,
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
        <div className="mt-5 pb-2 w-full max-w-[200px]">
          <ActionBtn3D
            href={action.href}
            icon={action.label.includes('Call') ? Phone : action.label.includes('Chat') ? MessageSquare : Mail}
            label={action.label}
            colorTop={action.label.includes('Call') ? GOLD_LIGHT : action.label.includes('Chat') ? '#4ADE80' : '#60A5FA'}
            colorBottom={action.label.includes('Call') ? GOLD : action.label.includes('Chat') ? '#16A34A' : '#2563EB'}
            colorShadow={action.label.includes('Call') ? '#99783D' : action.label.includes('Chat') ? '#14532D' : '#1E3A8A'}
          />
        </div>
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
  <div className="relative group pt-3 mb-2">
    <label
      className="absolute top-0 left-4 px-2 text-[10px] font-bold uppercase tracking-[0.2em] z-10 transition-colors duration-300 rounded-full"
      style={{ color: GOLD, background: '#ffffff' }}
    >
      {label}
    </label>
    {children}
  </div>
);

const inputClass =
  'w-full rounded-[1.25rem] px-5 py-[18px] text-sm text-[#1A1A1A] outline-none transition-all duration-500 placeholder:text-zinc-300 bg-[#FAF7F2]';
const inputStyle = {
  border: '1.5px solid transparent',
};
const inputFocusStyle = {
  borderColor: GOLD,
  background: '#ffffff',
  boxShadow: `0 8px 32px rgba(197,160,89,0.12), 0 0 0 4px rgba(197,160,89,0.05)`,
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

/* ── 3D Action Button ───────────────────────────────────────── */
const ActionBtn3D = ({ icon: Icon, label, href, colorTop, colorBottom, colorShadow }: { icon: any, label: string, href: string, colorTop: string, colorBottom: string, colorShadow: string }) => {
  return (
    <a
      href={href}
      className="relative w-full block group outline-none"
      target="_blank"
      rel="noreferrer"
    >
      {/* 3D Depth Layer */}
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-150 group-hover:translate-y-[2px]"
        style={{
          background: colorShadow,
          transform: 'translateY(6px)',
        }}
      />
      {/* Top Layer */}
      <div
        className="relative flex items-center justify-center gap-2 py-3.5 px-2 rounded-2xl font-bold text-white transition-all duration-150 group-hover:-translate-y-[1px] group-active:translate-y-[6px]"
        style={{
          background: `linear-gradient(135deg, ${colorTop}, ${colorBottom})`,
          boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -2px 0 rgba(0,0,0,0.1)'
        }}
      >
        <Icon className="h-5 w-5" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))' }} />
        <span className="text-[13px] sm:text-sm tracking-wide" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{label}</span>
      </div>
    </a>
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
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile>(() => ({ ...defaultOwnerProfile, ...getOwnerProfile() }));

  useEffect(() => {
    const unsubscribe = subscribeOwnerProfileChanges((profile) => {
      setOwnerProfile({ ...defaultOwnerProfile, ...profile });
    });

    return unsubscribe;
  }, []);

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

  const openingHourRows = ownerProfile.openingHours
    .split(',')
    .map((slot) => slot.trim())
    .filter(Boolean);

  const encodedAddress = encodeURIComponent(ownerProfile.shopAddress || 'Colombo, Sri Lanka');
  const mapOpenUrl = ownerProfile.googleMapsUrl?.trim() || `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const mapEmbedSrc = ownerProfile.googleMapsUrl?.includes('/maps/embed')
    ? ownerProfile.googleMapsUrl
    : `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

  const infoCards = [
    {
      icon: Phone,
      title: 'Call Us',
      lines: [ownerProfile.contactPhone, ownerProfile.whatsapp],
      action: { label: 'Call Now', href: toTelLink(ownerProfile.contactPhone) },
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp',
      lines: [ownerProfile.whatsapp, 'Fast replies during business hours'],
      action: { label: 'Chat Now', href: toWhatsAppLink(ownerProfile.whatsapp) },
    },
    {
      icon: Mail,
      title: 'Email Us',
      lines: [ownerProfile.email, ownerProfile.website],
      action: { label: 'Send Email', href: `mailto:${ownerProfile.email}` },
    },
    {
      icon: Clock,
      title: 'Opening Hours',
      lines: openingHourRows.length ? openingHourRows : [ownerProfile.openingHours],
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
              className="relative z-10"
            >
              {/* Decorative blurred glow behind form */}
              <div
                className="absolute -inset-2 lg:-inset-4 rounded-[3rem] -z-10 opacity-60 blur-2xl transition-all duration-700 hover:opacity-100"
                style={{ background: `linear-gradient(135deg, ${GOLD}30, ${GOLD_LIGHT}60, ${CREAM2})` }}
              />

              <div
                className="bg-white rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden"
                style={{
                  border: '1px solid rgba(197,160,89,0.2)',
                  boxShadow: '0 20px 60px rgba(197,160,89,0.08)',
                }}
              >
                {/* top corner decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none"
                  style={{ background: `radial-gradient(circle at top right, ${GOLD}, transparent 70%)` }} />
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
                      className="w-full relative overflow-hidden flex items-center justify-center gap-2 py-[18px] rounded-[1.25rem] text-sm font-bold text-white mt-4 disabled:opacity-60 disabled:cursor-not-allowed group"
                      style={{
                        background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`,
                        boxShadow: `0 12px 32px rgba(197,160,89,0.35), inset 0 2px 0 rgba(255,255,255,0.2)`,
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
                      <a href={toTelLink(ownerProfile.contactPhone)} className="font-bold" style={{ color: GOLD }}>
                        {ownerProfile.contactPhone}
                      </a>
                    </p>
                  </form>
                )}
              </div>
            </motion.div>

            {/* ── Location Block ── */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full min-h-[500px] lg:min-h-[600px] flex flex-col justify-end lg:justify-center z-20 group perspective-1000"
            >
              {/* Back Layer Map */}
              <div
                className="absolute inset-0 rounded-[2.5rem] overflow-hidden transition-transform duration-700 lg:group-hover:scale-[1.01]"
                style={{
                  border: '1px solid rgba(197,160,89,0.2)',
                  boxShadow: '0 24px 50px rgba(0,0,0,0.08)',
                }}
              >
                <div className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-500 opacity-20 lg:group-hover:opacity-0"
                  style={{ background: 'linear-gradient(to bottom right, rgba(197,160,89,0.4), transparent)' }} />
                <iframe
                  src={mapEmbedSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(0.2) saturate(1.1) contrast(1.05)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="JK Salon Location"
                  className="transition-all duration-700"
                />
                <a
                  href={mapOpenUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-4 right-4 z-20 px-4 py-2 rounded-xl text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 8px 22px rgba(197,160,89,0.35)` }}
                >
                  Open in Maps
                </a>
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