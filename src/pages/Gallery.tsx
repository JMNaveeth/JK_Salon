import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { Play, Maximize2, Loader2, Sparkles, ChevronDown, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const GOLD = '#C5A059';
const GOLD_LIGHT = '#E8C97A';
const CREAM = '#FDFAF5';
const CREAM2 = '#F7F2EA';



/* ── Filter pill ────────────────────────────────────────────── */
const FilterPill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
    style={
      active
        ? { background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, color: '#fff', boxShadow: `0 6px 20px rgba(197,160,89,0.35)` }
        : { background: '#fff', color: '#888', border: `1.5px solid rgba(197,160,89,0.2)` }
    }
  >
    {label}
  </motion.button>
);

/* ── Lightbox ───────────────────────────────────────────────── */
const Lightbox = ({ item, onClose }: { item: any; onClose: () => void }) => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
    style={{ background: 'rgba(253,250,245,0.96)', backdropFilter: 'blur(20px)' }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="relative max-w-4xl w-full"
      initial={{ scale: 0.88, y: 30 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.88, y: 30 }}
      transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* close */}
      <motion.button
        className="absolute -top-5 -right-5 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white"
        style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 8px 24px rgba(197,160,89,0.4)` }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </motion.button>

      <div
        className="overflow-hidden rounded-3xl"
        style={{ border: `1.5px solid rgba(197,160,89,0.25)`, boxShadow: '0 40px 80px rgba(197,160,89,0.15), 0 10px 30px rgba(0,0,0,0.08)' }}
      >
        <img
          src={item.url}
          alt={item.category}
          className="w-full max-h-[75vh] object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="px-8 py-6" style={{ background: '#fff' }}>
          <span className="text-[9px] font-black uppercase tracking-[0.4em]" style={{ color: GOLD }}>{item.category}</span>
          <h3 className="text-xl font-bold text-[#1A1A1A] mt-1">Signature {item.category}</h3>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

/* ── Gallery card ───────────────────────────────────────────── */
const GalleryCard = ({ item, idx, onClick }: { item: any; idx: number; onClick: () => void }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  // alternate tall cards for masonry feel
  const isTall = idx % 5 === 1 || idx % 5 === 3;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (idx % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, boxShadow: '0 30px 60px rgba(197,160,89,0.15)' }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-3xl cursor-pointer bg-white ${isTall ? 'row-span-2' : ''}`}
      style={{
        border: '1px solid rgba(197,160,89,0.12)',
        boxShadow: '0 4px 24px rgba(197,160,89,0.07)',
        aspectRatio: isTall ? '3/4' : '1/1',
      }}
    >
      {/* top gold reveal */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg,transparent,${GOLD},transparent)` }}
      />

      <img
        src={item.url}
        alt={item.category}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />

      {/* hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col items-center justify-center p-6 text-center"
        style={{ background: 'rgba(253,250,245,0.88)', backdropFilter: 'blur(4px)' }}
      >
        {/* gold ring icon */}
        <motion.div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
          style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 8px 24px rgba(197,160,89,0.4)` }}
          initial={{ scale: 0.7, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
        >
          {item.type === 'video'
            ? <Play className="h-5 w-5 text-white fill-white" />
            : <Maximize2 className="h-5 w-5 text-white" />}
        </motion.div>
        <span className="text-[9px] font-black uppercase tracking-[0.4em] mb-1" style={{ color: GOLD }}>
          {item.category}
        </span>
        <h3 className="text-[#1A1A1A] font-bold text-base">Signature {item.category}</h3>
      </div>

      {/* category pill — always visible bottom-left */}
      <div className="absolute bottom-4 left-4 z-10 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
        <span
          className="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em]"
          style={{ background: 'rgba(255,255,255,0.9)', color: GOLD, border: `1px solid rgba(197,160,89,0.25)` }}
        >
          {item.category}
        </span>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════
   GALLERY PAGE
══════════════════════════════════════════════════════════════ */
const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [lightboxItem, setLightboxItem] = useState<any | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await api.getGallery();
        setGalleryItems(data);
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();

    const source = new EventSource('/api/gallery/stream');
    source.onmessage = (event) => {
      if (event.data === 'updated') {
        fetchGallery();
      }
    };
    return () => source.close();
  }, []);

  const displayItems = galleryItems;

  const categories = ['All', ...Array.from(new Set(displayItems.map((item) => item.category))) as string[]];
  const filtered = filter === 'All' ? displayItems : displayItems.filter((item) => item.category === filter);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: CREAM }}>
        <motion.div className="flex flex-col items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})` }}>
            <Loader2 className="h-7 w-7 text-white animate-spin" />
          </div>
          <p className="text-xs uppercase tracking-[0.4em] font-bold" style={{ color: GOLD }}>Loading Gallery</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden" style={{ background: CREAM }}>

      {/* ════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════ */}
      <section className="relative pt-40 pb-24 flex flex-col items-center justify-center overflow-hidden">
        {/* background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=2200"
            alt="Salon"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            style={{ opacity: 0.07 }}
          />
          <div className="absolute inset-0"
            style={{ background: `linear-gradient(to bottom,${CREAM} 0%,rgba(253,250,245,0.5) 50%,${CREAM} 100%)` }} />
          <div className="absolute inset-0"
            style={{ background: `radial-gradient(ellipse at 50% 40%,rgba(197,160,89,0.1) 0%,transparent 60%)` }} />
        </div>

        {/* rings */}
        {[280, 420, 560].map((size, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{ width: size, height: size, border: `1px solid rgba(197,160,89,${0.1 - i * 0.025})` }}
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
              JK Salon · Colombo
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
              Our{' '}
              <span style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Work
              </span>
            </motion.h1>
          </div>

          <motion.p
            className="text-zinc-500 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            A showcase of our finest grooming transformations, precision cuts, and luxury salon experiences.
          </motion.p>

          {/* stats strip */}
          <motion.div
            className="inline-flex items-center gap-8 px-8 py-4 rounded-2xl mt-4"
            style={{ background: '#fff', border: '1px solid rgba(197,160,89,0.15)', boxShadow: '0 4px 20px rgba(197,160,89,0.08)' }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            {[['200+', 'Photos'], ['50+', 'Styles'], ['5★', 'Rated']].map(([val, lab]) => (
              <div key={lab} className="text-center">
                <p className="font-black text-xl" style={{ color: GOLD }}>{val}</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{lab}</p>
              </div>
            ))}
          </motion.div>

          <motion.div className="flex flex-col items-center gap-1 mt-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronDown className="h-5 w-5" style={{ color: GOLD }} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          STICKY FILTER BAR
      ════════════════════════════════════════════════════════ */}
      <div
        className="sticky top-[64px] z-30 py-4"
        style={{
          background: 'rgba(253,250,245,0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(197,160,89,0.12)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            className="flex flex-wrap gap-3 items-center justify-center"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Sparkles className="h-4 w-4 mr-1 hidden sm:block" style={{ color: GOLD }} />
            {categories.map((cat) => (
              <FilterPill key={cat} label={cat} active={filter === cat} onClick={() => setFilter(cat)} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          GALLERY GRID
      ════════════════════════════════════════════════════════ */}
      <section className="py-16" style={{ background: CREAM2 }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

          {/* count */}
          <motion.p
            key={filter}
            className="text-xs text-zinc-400 uppercase tracking-widest mb-10 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
          >
            Showing <span className="font-bold" style={{ color: GOLD }}>{filtered.length}</span>{' '}
            {filter === 'All' ? 'works' : `${filter} works`}
          </motion.p>

          {/* masonry-style grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            <AnimatePresence>
              {filtered.map((item, idx) => (
                <div key={item.id || item._idx} className="break-inside-avoid mb-6">
                  <GalleryCard item={item} idx={idx} onClick={() => setLightboxItem(item)} />
                </div>
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24">
              <Sparkles className="h-10 w-10 mx-auto mb-4" style={{ color: GOLD, opacity: 0.4 }} />
              <p className="text-zinc-400 text-sm">No works found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden" style={{ background: CREAM }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 50%,rgba(197,160,89,0.08) 0%,transparent 65%)` }} />
        {[160, 280, 400].map((size, i) => (
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
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8"
              style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 12px 30px rgba(197,160,89,0.35)` }}
            >
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h2
              className="font-serif tracking-[-0.02em] mb-5 text-[#1A1A1A]"
              style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', lineHeight: 1.1 }}
            >
              Love What{' '}
              <span style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                You See?
              </span>
            </h2>
            <p className="text-zinc-500 text-base leading-relaxed mb-10">
              Book your appointment today and let our expert stylists create your signature look.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/booking"
                  className="relative overflow-hidden inline-flex items-center gap-2 px-10 py-4 rounded-full text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 12px 40px rgba(197,160,89,0.4)` }}
                >
                  <span className="relative z-10">Book an Appointment</span>
                  <ArrowRight className="relative z-10 h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-sm font-bold"
                  style={{ border: `2px solid ${GOLD}`, color: GOLD, background: 'transparent' }}
                >
                  View Services
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          LIGHTBOX
      ════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {lightboxItem && (
          <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;