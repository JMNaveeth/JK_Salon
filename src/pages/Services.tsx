import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { Scissors, Clock, ArrowRight, Loader2, Sparkles, Star, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const GOLD = '#C5A059';
const GOLD_LIGHT = '#E8C97A';
const CREAM = '#FDFAF5';
const CREAM2 = '#F7F2EA';

/* ── Category filter pill ───────────────────────────────────── */
const FilterPill = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
    style={
      active
        ? {
            background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`,
            color: '#fff',
            boxShadow: `0 6px 20px rgba(197,160,89,0.35)`,
          }
        : {
            background: '#fff',
            color: '#888',
            border: `1.5px solid rgba(197,160,89,0.2)`,
          }
    }
  >
    {label}
  </motion.button>
);

/* ── Single service card ─────────────────────────────────────── */
const ServiceCard = ({ service, idx }: { service: any; idx: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: (idx % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-3xl overflow-hidden flex flex-col"
      style={{
        border: '1px solid rgba(197,160,89,0.13)',
        boxShadow: '0 4px 30px rgba(197,160,89,0.07), 0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {/* top gold line reveal */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg,transparent,${GOLD},transparent)` }}
      />

      {/* image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={service.imageUrl}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          style={{ transform: 'scale(1.01)' }}
          referrerPolicy="no-referrer"
        />
        {/* image overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top,rgba(253,250,245,0.55) 0%,transparent 50%)',
          }}
        />
        {/* category badge */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] backdrop-blur-sm"
            style={{
              background: 'rgba(255,255,255,0.88)',
              color: GOLD,
              border: `1px solid rgba(197,160,89,0.3)`,
              boxShadow: '0 2px 12px rgba(197,160,89,0.15)',
            }}
          >
            {service.category}
          </span>
        </div>
        {/* duration badge */}
        <div className="absolute top-4 right-4 z-10">
          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold backdrop-blur-sm"
            style={{
              background: 'rgba(255,255,255,0.88)',
              color: '#555',
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <Clock className="h-3 w-3" style={{ color: GOLD }} />
            {service.duration} mins
          </span>
        </div>
      </div>

      {/* content */}
      <div className="flex flex-col flex-1 p-8">
        {/* stars */}
        <div className="flex gap-0.5 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-[#C5A059] text-[#C5A059]" />
          ))}
        </div>

        <h3 className="text-xl font-bold text-[#1A1A1A] mb-3 leading-tight">{service.name}</h3>
        <p className="text-zinc-500 text-sm leading-relaxed mb-6 line-clamp-2 flex-1">
          {service.description}
        </p>

        {/* price + button */}
        <div
          className="flex items-center justify-between pt-5"
          style={{ borderTop: '1px solid rgba(197,160,89,0.12)' }}
        >
          <div>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-0.5">Price</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-zinc-400 font-medium">LKR</span>
              <span
                className="text-2xl font-black tracking-tight"
                style={{ color: GOLD }}
              >
                {service.price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* GOLDEN Book Now button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={`/booking?service=${service.id}`}
              className="group/btn relative overflow-hidden flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white"
              style={{
                background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`,
                boxShadow: `0 6px 20px rgba(197,160,89,0.4)`,
              }}
            >
              <span className="relative z-10">Book Now</span>
              <ArrowRight className="relative z-10 h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
              {/* shimmer */}
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-110%' }}
                whileHover={{ x: '110%' }}
                transition={{ duration: 0.5 }}
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════
   SERVICES PAGE
══════════════════════════════════════════════════════════════ */
const Services = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.getServices();
        setServices(data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category)))];
  const filtered =
    activeFilter === 'All' ? services : services.filter((s) => s.category === activeFilter);

  /* ── Loading state ── */
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: CREAM }}
      >
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})` }}
          >
            <Loader2 className="h-7 w-7 text-white animate-spin" />
          </div>
          <p className="text-xs uppercase tracking-[0.4em] font-bold" style={{ color: GOLD }}>
            Loading Services
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden" style={{ background: CREAM }}>

      {/* ════════════════════════════════════════════════════════
          HERO HEADER
      ════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative pt-40 pb-32 flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Parallax background */}
        <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
          <img
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=2200"
            alt="Barber"
            className="w-full h-full object-cover scale-110"
            referrerPolicy="no-referrer"
            style={{ opacity: 0.1 }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom,${CREAM} 0%,rgba(253,250,245,0.7) 50%,${CREAM} 100%)`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 50% 40%,rgba(197,160,89,0.1) 0%,transparent 60%)`,
            }}
          />
        </motion.div>

        {/* decorative rings */}
        {[300, 450, 600].map((size, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              width: size,
              height: size,
              border: `1px solid rgba(197,160,89,${0.1 - i * 0.025})`,
            }}
            animate={{ scale: [1, 1.04, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}

        {/* text */}
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.div
            className="inline-flex items-center gap-3 mb-7"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="w-8 h-px" style={{ background: GOLD }} />
            <span
              className="text-[10px] font-bold uppercase tracking-[0.5em]"
              style={{ color: GOLD }}
            >
              JK Salon · Colombo
            </span>
            <span className="w-8 h-px" style={{ background: GOLD }} />
          </motion.div>

          <div className="overflow-hidden mb-4">
            <motion.h1
              className="font-serif tracking-[-0.03em] text-[#1A1A1A]"
              style={{ fontSize: 'clamp(3.5rem,8vw,6rem)', lineHeight: 1 }}
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              Our{' '}
              <span
                style={{
                  background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Services
              </span>
            </motion.h1>
          </div>

          <motion.p
            className="text-zinc-500 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Discover our range of premium grooming services designed to make you
            look and feel your absolute best.
          </motion.p>

          {/* scroll cue */}
          <motion.div
            className="flex flex-col items-center gap-1.5 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronDown className="h-5 w-5" style={{ color: GOLD }} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FILTER BAR
      ════════════════════════════════════════════════════════ */}
      <div
        className="sticky top-[64px] z-30 py-4"
        style={{
          background: `rgba(253,250,245,0.92)`,
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(197,160,89,0.12)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            className="flex flex-wrap gap-3 items-center justify-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Scissors className="h-4 w-4 mr-2 hidden sm:block" style={{ color: GOLD }} />
            {categories.map((cat) => (
              <FilterPill
                key={cat}
                label={cat}
                active={activeFilter === cat}
                onClick={() => setActiveFilter(cat)}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          SERVICE GRID
      ════════════════════════════════════════════════════════ */}
      <section className="py-20" style={{ background: CREAM2 }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

          {/* result count */}
          <motion.p
            key={activeFilter}
            className="text-xs text-zinc-400 uppercase tracking-widest mb-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            Showing{' '}
            <span className="font-bold" style={{ color: GOLD }}>
              {filtered.length}
            </span>{' '}
            {activeFilter === 'All' ? 'services' : `${activeFilter} services`}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((service, idx) => (
              <ServiceCard key={service.id || service._id} service={service} idx={idx} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24">
              <Sparkles className="h-10 w-10 mx-auto mb-4" style={{ color: GOLD, opacity: 0.4 }} />
              <p className="text-zinc-400 text-sm">No services found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          BOTTOM CTA
      ════════════════════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden" style={{ background: CREAM }}>
        {/* gold radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 50%,rgba(197,160,89,0.09) 0%,transparent 65%)`,
          }}
        />
        {/* rings */}
        {[160, 280, 400].map((size, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              width: size,
              height: size,
              border: `1px solid rgba(197,160,89,${0.15 - i * 0.04})`,
            }}
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
              style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 12px 30px rgba(197,160,89,0.35)` }}
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

            {/* golden CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/booking"
                  className="relative overflow-hidden inline-flex items-center gap-2 px-10 py-4 rounded-full text-sm font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`,
                    boxShadow: `0 12px 40px rgba(197,160,89,0.4)`,
                  }}
                >
                  <span className="relative z-10">Book an Appointment</span>
                  <ArrowRight className="relative z-10 h-4 w-4" />
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-110%' }}
                    whileHover={{ x: '110%' }}
                    transition={{ duration: 0.5 }}
                  />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-sm font-bold"
                  style={{
                    border: `2px solid ${GOLD}`,
                    color: GOLD,
                    background: 'transparent',
                  }}
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