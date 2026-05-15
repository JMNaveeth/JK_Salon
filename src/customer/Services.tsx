import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { Scissors, Clock, ArrowRight, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const GOLD      = '#C5A059';
const GOLD_LIGHT = '#E8C97A';
const GOLD_DIM  = '#8B6A2E';
const CREAM     = '#FDFAF5';
const CREAM2    = '#F7F2EA';

/* ══════════════════════════════════════════════════════════════
   FILTER BAR
══════════════════════════════════════════════════════════════ */
const FilterBar = ({
  categories,
  active,
  onChange,
}: {
  categories: string[];
  active: string;
  onChange: (c: string) => void;
}) => {
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const pillRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const btn = pillRefs.current[active];
    const bar = barRef.current;
    if (btn && bar) {
      const btnRect = btn.getBoundingClientRect();
      const barRect = bar.getBoundingClientRect();
      setIndicatorStyle({ left: btnRect.left - barRect.left, width: btnRect.width });
    }
  }, [active, categories]);

  return (
    <div
      ref={barRef}
      className="relative flex flex-wrap gap-1 items-center"
    >
      {/* sliding gold indicator */}
      <motion.div
        className="absolute bottom-0 h-[2px] rounded-full pointer-events-none"
        style={{ background: `linear-gradient(90deg,transparent,${GOLD},${GOLD_LIGHT},${GOLD},transparent)` }}
        animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      />

      {categories.map((cat) => (
        <button
          key={cat}
          ref={(el) => { pillRefs.current[cat] = el; }}
          onClick={() => onChange(cat)}
          className="relative px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.35em] transition-all duration-300 rounded-t-lg"
          style={{
            color: active === cat ? GOLD : 'rgba(100,90,80,0.65)',
            background: active === cat ? 'rgba(197,160,89,0.06)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {active === cat && (
            <motion.div
              layoutId="pill-bg"
              className="absolute inset-0 rounded-t-lg pointer-events-none"
              style={{ background: 'rgba(197,160,89,0.07)' }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            />
          )}
          <span className="relative z-10">{cat}</span>
        </button>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   SERVICE CARD  (full-bleed cinematic — matches Home)
══════════════════════════════════════════════════════════════ */
const ServiceCard = ({
  service,
  idx,
  featured = false,
}: {
  service: any;
  idx: number;
  featured?: boolean;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [hovered, setHovered] = useState(false);

  const imageUrl =
    service.imageUrl ||
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=1200';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.9, delay: (idx % 3) * 0.13, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative overflow-hidden w-full cursor-pointer select-none"
      style={{
        borderRadius: 28,
        height: 'clamp(360px, 48vw, 500px)',
        boxShadow: hovered
          ? '0 32px 80px rgba(0,0,0,0.22), 0 8px 32px rgba(197,160,89,0.22)'
          : '0 16px 48px rgba(0,0,0,0.14), 0 4px 16px rgba(197,160,89,0.08)',
        transition: 'box-shadow 0.5s ease',
      }}
    >
      {/* ── Full-bleed image ── */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: hovered ? 1.1 : 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={imageUrl}
          alt={service.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      {/* ── Cinematic vignette ── */}
      <div
        className="absolute inset-0"
        style={{
          background: featured
            ? 'linear-gradient(to right, rgba(8,6,4,0.92) 0%, rgba(8,6,4,0.60) 45%, rgba(8,6,4,0.15) 100%)'
            : 'linear-gradient(to top, rgba(8,6,4,0.98) 0%, rgba(8,6,4,0.72) 38%, rgba(8,6,4,0.25) 62%, rgba(8,6,4,0.08) 100%)',
        }}
      />

      {/* ── Gold shimmer top edge ── */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2.5px] origin-left pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${GOLD} 30%, ${GOLD_LIGHT} 55%, ${GOLD} 75%, transparent 100%)`,
          boxShadow: `0 0 14px ${GOLD}88`,
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* ── Permanent gold bottom bar ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px] pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${GOLD}, ${GOLD_LIGHT}, ${GOLD}, transparent)`,
          opacity: 0.55,
        }}
      />

      {/* ── Watermark index ── */}
      <div
        className="absolute top-2 right-4 font-serif pointer-events-none select-none leading-none"
        style={{
          fontSize: featured ? 'clamp(90px, 16vw, 140px)' : 'clamp(78px, 22vw, 108px)',
          fontWeight: 900,
          color: 'rgba(197,160,89,0.09)',
          lineHeight: 1,
        }}
      >
        {String(idx + 1).padStart(2, '0')}
      </div>

      {/* ── Badges ── */}
      <div
        className="absolute z-20 flex flex-col gap-2"
        style={{ top: 18, left: 18 }}
      >
        <motion.span
          className="px-3 py-[5px] rounded-full text-[9px] font-black uppercase tracking-[0.35em] backdrop-blur-md inline-block"
          style={{
            background: 'rgba(197,160,89,0.18)',
            color: GOLD_LIGHT,
            border: '1px solid rgba(197,160,89,0.45)',
            boxShadow: '0 4px 16px rgba(197,160,89,0.15)',
          }}
          animate={{ opacity: hovered ? 0.7 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {service.category || 'Service'}
        </motion.span>

        {service.duration && (
          <span
            className="flex items-center gap-1.5 px-3 py-[5px] rounded-full text-[9px] font-semibold backdrop-blur-md self-start"
            style={{
              background: 'rgba(255,255,255,0.10)',
              color: 'rgba(255,255,255,0.80)',
              border: '1px solid rgba(255,255,255,0.14)',
            }}
          >
            <Clock className="h-2.5 w-2.5 shrink-0" style={{ color: GOLD }} />
            {service.duration} min
          </span>
        )}
      </div>

      {/* ── Featured layout: text on left side ── */}
      {featured ? (
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 sm:p-12 max-w-[55%]">
          <motion.div
            className="mb-4"
            style={{ height: 1, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT} 40%, transparent)` }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: hovered ? 1 : 0.3 }}
            transition={{ duration: 0.5 }}
          />
          <h3
            className="font-serif text-white font-bold leading-tight tracking-tight mb-2"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}
          >
            {service.name}
          </h3>
          <motion.p
            className="text-white/50 text-xs leading-relaxed overflow-hidden"
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={hovered ? { height: 'auto', opacity: 1, marginBottom: 16 } : { height: 0, opacity: 0, marginBottom: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {service.description || 'Premium grooming service with expert care and precision styling.'}
          </motion.p>
          <div className="flex items-end gap-5 mt-2">
            <div>
              <span className="block text-[8px] uppercase tracking-[0.38em] mb-0.5" style={{ color: 'rgba(197,160,89,0.60)' }}>From</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[10px] font-bold" style={{ color: GOLD }}>LKR</span>
                <motion.span
                  className="font-black tracking-tight text-white leading-none"
                  style={{ fontSize: 'clamp(1.8rem,4vw,2.4rem)' }}
                  animate={{ scale: hovered ? 1.06 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {Number(service.price).toLocaleString()}
                </motion.span>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={`/booking?service=${service.id || service._id || ''}`}
                className="relative overflow-hidden flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase text-white"
                style={{
                  background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
                  boxShadow: '0 8px 28px rgba(197,160,89,0.50)',
                }}
              >
                <span className="relative z-10">Reserve</span>
                <ArrowRight className="relative z-10 h-3 w-3" />
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-110%' }}
                  animate={hovered ? { x: '110%' } : { x: '-110%' }}
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                />
              </Link>
            </motion.div>
          </div>
        </div>
      ) : (
        /* ── Standard layout: text at bottom ── */
        <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-5 pt-4">
          <motion.div
            className="mb-3"
            style={{ height: 1, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT} 40%, transparent)` }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: hovered ? 1 : 0.25 }}
            transition={{ duration: 0.5 }}
          />
          <h3
            className="font-serif text-white font-bold leading-tight tracking-tight mb-1"
            style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.45rem)' }}
          >
            {service.name}
          </h3>
          <motion.p
            className="text-white/52 text-[10.5px] leading-relaxed overflow-hidden line-clamp-2"
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={hovered ? { height: 'auto', opacity: 1, marginBottom: 12 } : { height: 0, opacity: 0, marginBottom: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {service.description || 'Premium grooming service with expert care and precision styling.'}
          </motion.p>
          <div className="flex items-end justify-between gap-3 mt-3">
            <div>
              <span className="block text-[7.5px] uppercase tracking-[0.38em] mb-0.5" style={{ color: 'rgba(197,160,89,0.60)' }}>From</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[9px] font-bold" style={{ color: GOLD }}>LKR</span>
                <motion.span
                  className="font-black tracking-tight text-white leading-none"
                  style={{ fontSize: 'clamp(1.4rem, 4.5vw, 1.75rem)' }}
                  animate={{ scale: hovered ? 1.06 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {Number(service.price).toLocaleString()}
                </motion.span>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} className="shrink-0">
              <Link
                to={`/booking?service=${service.id || service._id || ''}`}
                className="relative overflow-hidden flex items-center gap-2 px-5 py-3 rounded-2xl text-[9px] font-black tracking-widest uppercase text-white"
                style={{
                  background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
                  boxShadow: '0 8px 28px rgba(197,160,89,0.50)',
                }}
              >
                <span className="relative z-10">Reserve</span>
                <ArrowRight className="relative z-10 h-3 w-3" />
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-110%' }}
                  animate={hovered ? { x: '110%' } : { x: '-110%' }}
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                />
              </Link>
            </motion.div>
          </div>
        </div>
      )}

      {/* ── Corner glow ── */}
      <motion.div
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 30% 80%, rgba(197,160,89,0.22) 0%, transparent 65%)',
          filter: 'blur(20px)',
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════
   SERVICES PAGE
══════════════════════════════════════════════════════════════ */
const Services = () => {
  const [services, setServices]     = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [count, setCount]           = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.getServices();
        setServices(data.filter((s: any) => s.status === 'Active'));
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();

    const source = new EventSource('/api/services/stream');
    source.onmessage = (event) => { if (event.data === 'updated') fetchServices(); };
    return () => source.close();
  }, []);

  const categories = ['All', ...Array.from(new Set(services.map((s: any) => s.category))) as string[]];
  const filtered   = activeFilter === 'All' ? services : services.filter((s) => s.category === activeFilter);

  /* animate count */
  useEffect(() => {
    setCount(0);
    const timer = setTimeout(() => setCount(filtered.length), 80);
    return () => clearTimeout(timer);
  }, [filtered.length]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: CREAM }}>
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* spinning conic ring */}
          <div className="relative w-20 h-20">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(from 0deg, transparent 65%, ${GOLD} 80%, ${GOLD_LIGHT} 90%, transparent 100%)`,
                filter: 'blur(1px)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            />
            <div
              className="absolute inset-[6px] rounded-full flex items-center justify-center"
              style={{ background: CREAM }}
            >
              <Scissors className="h-6 w-6" style={{ color: GOLD }} />
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-[0.5em] font-bold" style={{ color: GOLD }}>
            Loading Services
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden" style={{ background: CREAM }}>

      {/* ════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════ */}
      <section className="relative pt-44 pb-32 flex flex-col items-center justify-center overflow-hidden">

        {/* dark background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=2200"
            alt="Barber background"
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
            style={{ opacity: 0.07 }}
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom,${CREAM} 0%,rgba(253,250,245,0.55) 50%,${CREAM} 100%)` }} />
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 38%,rgba(197,160,89,0.11) 0%,transparent 58%)` }} />
        </div>

        {/* concentric rings */}
        {[280, 420, 570, 720].map((size, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{ width: size, height: size, border: `1px solid rgba(197,160,89,${0.11 - i * 0.022})` }}
            animate={{ scale: [1, 1.04, 1], opacity: [0.35, 0.65, 0.35] }}
            transition={{ duration: 3.5 + i * 0.6, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
          />
        ))}

        {/* diagonal gold line — decorative */}
        <div
          className="absolute pointer-events-none hidden lg:block"
          style={{
            width: 1,
            height: 220,
            background: `linear-gradient(to bottom, transparent, ${GOLD}, transparent)`,
            opacity: 0.3,
            left: '12%',
            top: '20%',
            transform: 'rotate(20deg)',
          }}
        />
        <div
          className="absolute pointer-events-none hidden lg:block"
          style={{
            width: 1,
            height: 160,
            background: `linear-gradient(to bottom, transparent, ${GOLD}, transparent)`,
            opacity: 0.2,
            right: '10%',
            top: '28%',
            transform: 'rotate(-15deg)',
          }}
        />

        {/* text */}
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.div
            className="inline-flex items-center gap-3 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="w-8 h-px" style={{ background: `linear-gradient(90deg,transparent,${GOLD})` }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em]" style={{ color: GOLD }}>
              JK Salon · Colombo
            </span>
            <span className="w-8 h-px" style={{ background: `linear-gradient(90deg,${GOLD},transparent)` }} />
          </motion.div>

          <div className="overflow-hidden mb-2">
            <motion.h1
              className="font-serif text-[#1A1A1A] leading-none tracking-[-0.04em]"
              style={{ fontSize: 'clamp(4rem, 9vw, 7rem)' }}
              initial={{ y: 120 }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              Our
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-10">
            <motion.h1
              className="font-serif leading-none tracking-[-0.04em]"
              style={{
                fontSize: 'clamp(4rem, 9vw, 7rem)',
                background: `linear-gradient(135deg,${GOLD} 0%,${GOLD_LIGHT} 45%,${GOLD} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              initial={{ y: 120 }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              Services
            </motion.h1>
          </div>

          <motion.p
            className="text-zinc-500 text-base md:text-lg leading-relaxed max-w-md mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
          >
            Premium grooming crafted for the modern gentleman. Every detail, perfected.
          </motion.p>

          {/* service count stat */}
          <motion.div
            className="inline-flex items-center gap-4 px-6 py-3 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(197,160,89,0.22)',
              boxShadow: '0 8px 24px rgba(197,160,89,0.10)',
            }}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.75, duration: 0.6 }}
          >
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest">Available</span>
            <span className="font-black text-2xl tracking-tight" style={{ color: GOLD }}>{services.length}</span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest">Services</span>
          </motion.div>

          <motion.div
            className="flex flex-col items-center gap-1 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
              <ChevronDown className="h-5 w-5" style={{ color: GOLD }} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          STICKY FILTER BAR
      ════════════════════════════════════════════════════════ */}
      <div
        className="sticky top-[64px] z-30 py-0"
        style={{
          background: 'rgba(253,250,245,0.96)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(197,160,89,0.14)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center gap-6">
            {/* scissor icon */}
            <motion.div
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
              style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})` }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Scissors className="h-4 w-4 text-white" />
            </motion.div>

            {/* scrollable filter pills */}
            <div className="overflow-x-auto pb-0 -mx-1 px-1 flex-1">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <FilterBar categories={categories} active={activeFilter} onChange={setActiveFilter} />
              </motion.div>
            </div>

            {/* live count chip */}
            <AnimatePresence mode="wait">
              <motion.span
                key={activeFilter}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold shrink-0"
                style={{
                  background: 'rgba(197,160,89,0.10)',
                  color: GOLD,
                  border: '1px solid rgba(197,160,89,0.25)',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25 }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: GOLD }}
                />
                {filtered.length} results
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          SERVICE GRID
      ════════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ background: CREAM2 }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                className="text-center py-32"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'rgba(197,160,89,0.10)', border: '1px solid rgba(197,160,89,0.25)' }}
                >
                  <Sparkles className="h-7 w-7" style={{ color: GOLD, opacity: 0.5 }} />
                </div>
                <p className="text-zinc-400 text-sm">No services found in this category.</p>
              </motion.div>
            ) : (
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                  {filtered.map((service, i) => (
                    <ServiceCard
                      key={service.id || service._id || i}
                      service={service}
                      idx={i}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          BOTTOM CTA
      ════════════════════════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden" style={{ background: CREAM }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 50%,rgba(197,160,89,0.09) 0%,transparent 65%)` }}
        />
        {[160, 300, 450].map((size, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{ width: size, height: size, border: `1px solid rgba(197,160,89,${0.15 - i * 0.04})` }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 2.5 + i, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}

        <div className="relative z-10 max-w-xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8"
              style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: '0 12px 30px rgba(197,160,89,0.35)' }}
            >
              <Scissors className="h-7 w-7 text-white" />
            </div>

            <h2
              className="font-serif tracking-[-0.02em] mb-5 text-[#1A1A1A]"
              style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', lineHeight: 1.1 }}
            >
              Ready to{' '}
              <span
                style={{
                  background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Book?
              </span>
            </h2>

            <p className="text-zinc-500 text-base leading-relaxed mb-10">
              Choose your service and secure your slot with our expert stylists today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/booking"
                  className="relative overflow-hidden inline-flex items-center gap-2 px-10 py-4 rounded-full text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: '0 12px 40px rgba(197,160,89,0.4)' }}
                >
                  <span className="relative z-10">Book an Appointment</span>
                  <ArrowRight className="relative z-10 h-4 w-4" />
                  <motion.div className="absolute inset-0 bg-white/20" initial={{ x: '-110%' }} whileHover={{ x: '110%' }} transition={{ duration: 0.5 }} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-sm font-bold"
                  style={{ border: `2px solid ${GOLD}`, color: GOLD, background: 'transparent' }}
                >
                  Back to Home
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;