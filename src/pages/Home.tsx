import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { Scissors, Star, Clock, ShieldCheck, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { api } from '../services/api';

const ownerImg = '/owner.jpg';

const GOLD = '#C5A059';
const GOLD_LIGHT = '#D4B06A';

/* ── Floating particle ───────────────────────────────────────────────────── */
const Particle = ({ delay, x, size }: { delay: number; x: number; size: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ left: `${x}%`, bottom: '-20px', width: size, height: size, background: GOLD, opacity: 0.15 }}
    animate={{ y: [0, -600], opacity: [0, 0.4, 0] }}
    transition={{ duration: 6 + (delay % 4), delay, repeat: Infinity, ease: 'linear' }}
  />
);

/* ── Counter ─────────────────────────────────────────────────────────────── */
const Counter = ({ target, label }: { target: string; label: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center">
      <p className="text-4xl md:text-5xl font-bold text-white tracking-tight">{target}</p>
      <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mt-1">{label}</p>
    </motion.div>
  );
};

/* ── Section heading ─────────────────────────────────────────────────────── */
const SectionHeading = ({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="mb-16 text-center">
      <span className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.4em] mb-4 block">{eyebrow}</span>
      <h2 className={`text-5xl md:text-6xl font-serif tracking-tight mb-5 ${light ? 'text-white' : 'text-[#1A1A1A]'}`}>{title}</h2>
      <div className="w-10 h-px bg-[#C5A059] mx-auto" />
    </motion.div>
  );
};

/* ── Service card – hooks safe inside its own component ─────────────────── */
const ServiceCard = ({ service, idx }: { service: any; idx: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: idx * 0.15 }}
      whileHover={{ y: -8, boxShadow: '0 30px 60px rgba(197,160,89,0.12)' }}
      className="group bg-white border border-[#E5E5E5] rounded-2xl p-10 flex flex-col items-center text-center transition-shadow"
    >
      <motion.div
        className="w-16 h-16 rounded-full bg-[#F9F5EF] flex items-center justify-center mb-8 group-hover:bg-[#C5A059] transition-colors duration-300"
        whileHover={{ rotate: 15, scale: 1.1 }}
      >
        {service.category === 'Beard'
          ? <Sparkles className="h-6 w-6 text-[#C5A059] group-hover:text-white transition-colors" />
          : <Scissors className="h-6 w-6 text-[#C5A059] group-hover:text-white transition-colors" />}
      </motion.div>
      <h3 className="text-2xl font-serif font-bold text-[#1A1A1A] mb-4">{service.name}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed mb-6 max-w-[240px]">
        {service.category === 'Hair' ? 'Precision cuts tailored to your personality and lifestyle.'
          : service.category === 'Beard' ? 'Expert beard shaping, trimming, and hot towel treatment.'
          : 'Premium grooming services for the modern gentleman.'}
      </p>
      <p className="text-[#C5A059] font-bold text-base mb-8 uppercase tracking-wider">LKR {service.price.toLocaleString()}</p>
      <Link to="/booking" className="group/btn px-8 py-2.5 border border-[#1A1A1A] rounded-full text-xs font-bold text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all flex items-center gap-2">
        Book Now <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
};

/* ── Why-us card ─────────────────────────────────────────────────────────── */
const WhyCard = ({ icon, title, desc, idx }: { icon: React.ReactNode; title: string; desc: string; idx: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.12, duration: 0.6 }}
      whileHover={{ borderColor: 'rgba(197,160,89,0.5)', y: -4 }}
      className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 transition-all"
    >
      <div className="w-12 h-12 rounded-xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] mb-6">{icon}</div>
      <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
};

/* ── Review card ─────────────────────────────────────────────────────────── */
const ReviewCard = ({ testimonial, idx }: { testimonial: any; idx: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.94, y: 30 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.15, duration: 0.7 }}
      whileHover={{ borderColor: 'rgba(197,160,89,0.3)' }}
      className="relative p-8 rounded-3xl bg-zinc-900 border border-white/5 overflow-hidden group"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-[#C5A059] text-[#C5A059]" />)}
      </div>
      <p className="text-zinc-400 text-sm italic mb-8 leading-relaxed">"{testimonial.comment}"</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059] font-bold text-sm">
          {testimonial.customerName[0]}
        </div>
        <div>
          <p className="font-bold text-white text-sm">{testimonial.customerName}</p>
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest">Verified Client</p>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════════════════════ */
const Home = () => {
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, reviewsData] = await Promise.all([api.getServices(), api.getReviews()]);
        setServices(servicesData.slice(0, 3));
        setReviews(reviewsData.filter((r: any) => r.status === 'approved').slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      }
    };
    fetchData();
  }, []);

  const whyItems = [
    { icon: <Star className="h-6 w-6" />, title: 'Premium Quality', desc: 'Only the finest products and techniques for your grooming experience.' },
    { icon: <Clock className="h-6 w-6" />, title: 'On Time Always', desc: 'Punctual service that respects your busy schedule.' },
    { icon: <ShieldCheck className="h-6 w-6" />, title: 'Certified Experts', desc: 'Our barbers hold international certifications.' },
    { icon: <Sparkles className="h-6 w-6" />, title: 'Luxury Ambience', desc: 'Unwind in a space designed to feel like a retreat.' },
  ];

  const particles = [
    { delay: 0, x: 10, size: 4 }, { delay: 0.5, x: 20, size: 3 }, { delay: 1, x: 33, size: 5 },
    { delay: 1.5, x: 45, size: 3 }, { delay: 2, x: 55, size: 4 }, { delay: 2.5, x: 65, size: 3 },
    { delay: 3, x: 72, size: 5 }, { delay: 3.5, x: 80, size: 4 }, { delay: 0.8, x: 88, size: 3 },
    { delay: 1.2, x: 94, size: 4 }, { delay: 2.2, x: 15, size: 3 }, { delay: 3.2, x: 40, size: 5 },
  ];

  return (
    <div className="bg-black text-white overflow-x-hidden">

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">

        <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
          <img src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=2000" alt="Salon Interior" className="w-full h-full object-cover opacity-40 scale-110" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </motion.div>

        {particles.map((p, i) => <Particle key={i} delay={p.delay} x={p.x} size={p.size} />)}

        <motion.div className="absolute right-[5%] top-1/2 -translate-y-1/2 hidden xl:block pointer-events-none" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 0.08 }} transition={{ duration: 1.5 }}>
          <div className="w-[700px] h-[700px] rounded-full border border-[#C5A059]" />
        </motion.div>
        <motion.div className="absolute right-[5%] top-1/2 -translate-y-1/2 hidden xl:block pointer-events-none" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 0.04 }} transition={{ duration: 1.5, delay: 0.2 }}>
          <div className="w-[850px] h-[850px] rounded-full border border-[#C5A059]" />
        </motion.div>

        {/* Owner image */}
        <div className="absolute right-0 bottom-0 z-10 hidden lg:flex items-end justify-end w-[45%] h-full pointer-events-none">
          <motion.div className="absolute bottom-0 right-0 w-[500px] h-[600px] rounded-full" style={{ background: 'radial-gradient(ellipse at center, rgba(197,160,89,0.18) 0%, transparent 70%)', filter: 'blur(40px)' }} animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute bottom-0 right-16 w-[400px] h-[500px] pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            <motion.div className="absolute inset-0" style={{ background: `conic-gradient(from 0deg, transparent 70%, ${GOLD} 85%, transparent 100%)`, borderRadius: '50% 50% 0 0', filter: 'blur(2px)' }} animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
          </motion.div>

          <motion.div className="relative z-10 mr-10" initial={{ opacity: 0, y: 80, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            <motion.div className="absolute -left-12 top-24 z-20 bg-black/80 backdrop-blur-sm border border-[#C5A059]/40 rounded-2xl px-4 py-3 flex items-center gap-3" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6, duration: 0.7 }} whileHover={{ scale: 1.05 }}>
              <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 flex items-center justify-center">
                <Scissors className="h-4 w-4 text-[#C5A059]" />
              </div>
              <div>
                <p className="text-white text-xs font-bold">Master Stylist</p>
                <p className="text-zinc-400 text-[10px]">10+ Years</p>
              </div>
            </motion.div>

            <motion.div className="absolute -right-8 top-1/3 z-20 bg-[#C5A059] rounded-2xl px-4 py-3 text-center shadow-2xl shadow-[#C5A059]/40" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.8, duration: 0.7 }} whileHover={{ scale: 1.05 }}>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-white text-white" />)}
              </div>
              <p className="text-white text-xs font-bold">5.0 Rating</p>
              <p className="text-white/70 text-[9px]">5k+ Clients</p>
            </motion.div>

            <motion.div
              className="relative w-[340px] h-[480px] rounded-[2rem] overflow-hidden"
              style={{ boxShadow: `0 0 0 1px rgba(197,160,89,0.3), 0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(197,160,89,0.1)` }}
              whileHover={{ scale: 1.02, boxShadow: `0 0 0 2px rgba(197,160,89,0.6), 0 40px 80px rgba(0,0,0,0.6), 0 0 80px rgba(197,160,89,0.2)` }}
              transition={{ duration: 0.4 }}
            >
              <img src={ownerImg} alt="Salon Owner" className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <p className="text-white font-bold text-sm tracking-wider uppercase">JK Salon Owner</p>
                <p className="text-[#C5A059] text-xs tracking-widest">Colombo, Sri Lanka</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Hero text */}
        <motion.div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-24 w-full" style={{ y: textY }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="max-w-xl">
            <motion.span className="inline-flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-[0.45em] mb-8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
              <span className="w-8 h-px bg-[#C5A059]" />
              Premium Grooming &amp; Styling
              <span className="w-8 h-px bg-[#C5A059]" />
            </motion.span>
            <div className="overflow-hidden mb-3">
              <motion.h1 className="text-[5.5rem] md:text-[7rem] font-serif tracking-[-0.04em] leading-none text-white" initial={{ y: 120 }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>JK</motion.h1>
            </div>
            <div className="overflow-hidden mb-8">
              <motion.h1 className="text-[5.5rem] md:text-[7rem] font-serif tracking-[-0.04em] leading-none" initial={{ y: 120 }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }} style={{ background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 50%, ${GOLD} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Salon</motion.h1>
            </div>
            <motion.p className="text-base md:text-lg text-zinc-400 mb-10 max-w-md leading-relaxed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7 }}>
              Experience the pinnacle of luxury grooming. Our expert stylists combine traditional techniques with modern trends to craft your perfect look.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }}>
              <Link to="/booking" className="group relative overflow-hidden bg-[#C5A059] text-white px-8 py-4 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-[#C5A059]/40">
                <span className="relative z-10">Book Appointment</span>
                <ArrowRight className="relative z-10 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/services" className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C5A059]/40 text-white px-8 py-4 rounded-full text-sm font-bold transition-all text-center flex items-center justify-center gap-2">
                Explore Services
                <Sparkles className="h-4 w-4 text-[#C5A059] group-hover:rotate-12 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div className="absolute bottom-12 left-6 sm:left-8 lg:left-12 flex gap-10 md:gap-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.6 }}>
            <Counter target="10+" label="Years Exp" />
            <Counter target="5k+" label="Happy Clients" />
            <Counter target="15+" label="Expert Barbers" />
          </motion.div>
        </motion.div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="flex flex-col items-center gap-1">
            <p className="text-zinc-600 text-[9px] uppercase tracking-widest">Scroll</p>
            <ChevronDown className="h-4 w-4 text-zinc-600" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══ MARQUEE ═══════════════════════════════════════════════════════════ */}
      <div className="py-5 bg-[#C5A059] overflow-hidden">
        <motion.div className="flex gap-12 whitespace-nowrap" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
          {[...Array(8)].map((_, i) => (
            <span key={i} className="text-black text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-4">
              <Scissors className="h-3 w-3 inline-block" /> Premium Grooming
              <span className="w-1 h-1 rounded-full bg-black/30 inline-block" />
              Expert Stylists
              <span className="w-1 h-1 rounded-full bg-black/30 inline-block" />
              Luxury Experience
              <span className="w-1 h-1 rounded-full bg-black/30 inline-block" />
              Colombo's Best
              <span className="w-1 h-1 rounded-full bg-black/30 inline-block" />
            </span>
          ))}
        </motion.div>
      </div>

      {/* ══ SERVICES ══════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <SectionHeading eyebrow="What We Offer" title="Our Services" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <ServiceCard key={service._id || idx} service={service} idx={idx} />
            ))}
          </div>
          <motion.div className="mt-14 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link to="/services" className="text-[#C5A059] font-bold text-sm hover:underline flex items-center justify-center gap-2">
              View All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══ WHY US ════════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-[#0E0E0E] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <SectionHeading eyebrow="The JK Difference" title="Why Choose Us" light />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyItems.map((item, idx) => (
              <WhyCard key={idx} icon={item.icon} title={item.title} desc={item.desc} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══════════════════════════════════════════════════════ */}
      <section className="py-28 bg-zinc-950 relative">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #C5A059 0%, transparent 50%), radial-gradient(circle at 80% 50%, #C5A059 0%, transparent 50%)' }} />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <SectionHeading eyebrow="Client Love" title="What They Say" light />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((testimonial, idx) => (
              <ReviewCard key={testimonial._id || idx} testimonial={testimonial} idx={idx} />
            ))}
            {reviews.length === 0 && (
              <div className="col-span-full text-center text-zinc-600 py-16">No reviews yet. Be the first to leave one!</div>
            )}
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=2000" alt="Booking Background" className="w-full h-full object-cover opacity-15 scale-110" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        {[200, 350, 500].map((size, i) => (
          <motion.div key={i} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C5A059]/10 pointer-events-none" style={{ width: size, height: size }} animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }} />
        ))}
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <span className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.4em] mb-6 block">Get Started Today</span>
            <h2 className="text-5xl md:text-7xl font-serif tracking-tight mb-8 leading-none">
              Ready for a<br />
              <span style={{ background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Transformation?
              </span>
            </h2>
            <p className="text-zinc-400 text-base mb-10 leading-relaxed">Book your appointment now and experience the finest grooming service in Colombo.</p>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/booking" className="inline-flex items-center gap-3 bg-[#C5A059] hover:bg-[#B48F48] text-white px-14 py-5 rounded-full text-base font-bold transition-all shadow-2xl shadow-[#C5A059]/30">
                Book Now <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;