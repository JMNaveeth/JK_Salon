import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import {
  Scissors,
  Star,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Award,
  Users,
  Zap,
} from "lucide-react";
import { api } from "../services/api";

const ownerImg = "/hani.jpeg";

const GOLD = "#C5A059";
const GOLD_LIGHT = "#E8C97A";
const GOLD_DIM = "#8B6A2E";
const CREAM = "#FDFAF5";
const CREAM2 = "#F7F2EA";

/* ══════════════════════════════════════════════════════════════
   ATOMS
══════════════════════════════════════════════════════════════ */

const Particle = ({ delay, x, size }: { delay: number; x: number; size: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none z-[1]"
    style={{ left: `${x}%`, bottom: "-10px", width: size, height: size, background: GOLD }}
    animate={{ y: [0, -700], opacity: [0, 0.5, 0] }}
    transition={{ duration: 7 + (delay % 5), delay, repeat: Infinity, ease: "linear" }}
  />
);

const Counter = ({ target, label }: { target: string; label: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className="flex flex-col items-center"
    >
      <span
        className="text-4xl md:text-5xl font-black tracking-tight"
        style={{ background: `linear-gradient(135deg,${GOLD_LIGHT},${GOLD})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
      >
        {target}
      </span>
      <span className="text-[9px] text-zinc-500 uppercase tracking-[0.35em] mt-1">{label}</span>
    </motion.div>
  );
};

const SectionHeading = ({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mb-16 text-center"
    >
      <span className="inline-flex items-center gap-3 text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.5em] mb-5">
        <span className="w-6 h-px bg-[#C5A059]" />
        {eyebrow}
        <span className="w-6 h-px bg-[#C5A059]" />
      </span>
      <h2 className={`text-5xl md:text-6xl font-serif tracking-[-0.02em] mb-5 ${light ? "text-white" : "text-[#1A1A1A]"}`}>
        {title}
      </h2>
      <div className="w-12 h-[2px] rounded-full mx-auto" style={{ background: `linear-gradient(90deg,transparent,${GOLD},transparent)` }} />
    </motion.div>
  );
};

/* ── Service Card ──────────────────────────────────────────── */
const ServiceCard = ({ service, idx }: { service: any; idx: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 70 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10 }}
      className="group relative bg-white rounded-3xl p-10 flex flex-col items-center text-center overflow-hidden"
      style={{ boxShadow: "0 4px 30px rgba(197,160,89,0.08), 0 1px 4px rgba(0,0,0,0.04)", border: "1px solid rgba(197,160,89,0.12)" }}
    >
      {/* hover gold tint */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
        style={{ background: "linear-gradient(135deg,rgba(197,160,89,0.04) 0%,transparent 60%)" }}
      />
      {/* top gold reveal line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg,transparent,${GOLD},transparent)` }} />

      <motion.div
        className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center mb-8 transition-all duration-300"
        style={{ background: `linear-gradient(135deg,rgba(197,160,89,0.12),rgba(232,201,122,0.08))`, border: "1px solid rgba(197,160,89,0.2)" }}
        whileHover={{ rotate: 8, scale: 1.08 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {service.category === "Beard"
          ? <Sparkles className="h-7 w-7 text-[#C5A059]" />
          : <Scissors className="h-7 w-7 text-[#C5A059]" />}
      </motion.div>

      <h3 className="text-2xl font-serif font-bold text-[#1A1A1A] mb-3">{service.name}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed mb-6 max-w-[220px]">
        {service.category === "Hair"
          ? "Precision cuts tailored to your personality and lifestyle."
          : service.category === "Beard"
          ? "Expert beard shaping, trimming, and hot towel treatment."
          : "Premium grooming services for the modern gentleman."}
      </p>

      <div className="flex items-baseline gap-1 mb-8">
        <span className="text-xs text-zinc-400 font-medium">LKR</span>
        <span className="text-2xl font-black tracking-tight" style={{ color: GOLD }}>{service.price.toLocaleString()}</span>
      </div>

      {/* GOLDEN BUTTON */}
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
        <Link
          to="/booking"
          className="group/btn w-full py-3.5 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, color: "#fff", boxShadow: `0 6px 20px rgba(197,160,89,0.35)` }}
        >
          <span className="relative z-10">Reserve Now</span>
          <ArrowRight className="relative z-10 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
          <motion.div className="absolute inset-0 bg-white/15" initial={{ x: "-110%" }} whileHover={{ x: "110%" }} transition={{ duration: 0.5 }} />
        </Link>
      </motion.div>
    </motion.div>
  );
};

/* ── Why Card ──────────────────────────────────────────────── */
const WhyCard = ({ icon, title, desc, idx }: { icon: React.ReactNode; title: string; desc: string; idx: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.13, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative bg-white rounded-2xl p-8 transition-all duration-300 overflow-hidden"
      style={{ border: "1px solid rgba(197,160,89,0.12)", boxShadow: "0 4px 24px rgba(197,160,89,0.06)" }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{ background: "linear-gradient(135deg,rgba(197,160,89,0.05) 0%,transparent 70%)" }} />
      <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg,transparent,${GOLD},transparent)` }} />

      <motion.div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-[#C5A059] mb-6"
        style={{ background: `linear-gradient(135deg,rgba(197,160,89,0.12),rgba(232,201,122,0.06))`, border: "1px solid rgba(197,160,89,0.18)" }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-[#1A1A1A] font-bold text-lg mb-3">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
};

/* ── Review Card ───────────────────────────────────────────── */
const ReviewCard = ({ testimonial, idx }: { testimonial: any; idx: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: idx * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="relative p-8 rounded-3xl bg-white overflow-hidden group"
      style={{ border: "1px solid rgba(197,160,89,0.15)", boxShadow: "0 4px 30px rgba(197,160,89,0.07)" }}
    >
      <div className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg,transparent,${GOLD},transparent)` }} />
      <div className="absolute top-5 right-7 text-8xl font-serif leading-none select-none" style={{ color: `rgba(197,160,89,0.08)` }}>"</div>

      <div className="flex gap-0.5 mb-5">
        {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-[#C5A059] text-[#C5A059]" />)}
      </div>
      <p className="text-zinc-600 text-sm leading-relaxed mb-8 relative z-10">"{testimonial.comment}"</p>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
          style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})` }}
        >
          {testimonial.customerName[0]}
        </div>
        <div>
          <p className="font-bold text-[#1A1A1A] text-sm">{testimonial.customerName}</p>
          <p className="text-zinc-400 text-[10px] uppercase tracking-widest mt-0.5">Verified Client</p>
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════════ */
const Home = () => {
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const ownerY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, reviewsData] = await Promise.all([api.getServices(), api.getReviews()]);
        setServices(servicesData.slice(0, 3));
        setReviews(reviewsData.filter((r: any) => r.status === "approved").slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      }
    };
    fetchData();
  }, []);

  const whyItems = [
    { icon: <Award className="h-6 w-6" />, title: "Premium Quality", desc: "Only the finest products and techniques for your grooming experience." },
    { icon: <Clock className="h-6 w-6" />, title: "On Time Always", desc: "Punctual service that respects your busy schedule." },
    { icon: <ShieldCheck className="h-6 w-6" />, title: "Certified Experts", desc: "Our barbers hold international certifications." },
    { icon: <Zap className="h-6 w-6" />, title: "Luxury Ambience", desc: "Unwind in a space designed to feel like a retreat." },
  ];

  const particles = [
    { delay: 0, x: 8, size: 4 }, { delay: 0.6, x: 18, size: 3 },
    { delay: 1.1, x: 30, size: 5 }, { delay: 1.7, x: 42, size: 3 },
    { delay: 2.2, x: 54, size: 4 }, { delay: 2.8, x: 63, size: 3 },
    { delay: 3.1, x: 74, size: 5 }, { delay: 3.6, x: 82, size: 4 },
    { delay: 0.9, x: 90, size: 3 }, { delay: 1.4, x: 96, size: 4 },
    { delay: 2.4, x: 13, size: 3 }, { delay: 3.4, x: 37, size: 5 },
  ];

  return (
    <div className="text-[#1A1A1A] overflow-x-hidden" style={{ background: CREAM }}>

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">

        {/* Background */}
        <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
          <img
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=2200"
            alt="Salon Interior"
            className="w-full h-full object-cover scale-110"
            referrerPolicy="no-referrer"
            style={{ opacity: 0.12 }}
          />
          {/* cream fade overlays */}
          <div className="absolute inset-0" style={{ background: `linear-gradient(105deg,${CREAM} 38%,rgba(253,250,245,0.75) 58%,rgba(253,250,245,0.2) 100%)` }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top,${CREAM} 0%,transparent 40%)` }} />
          {/* subtle gold radial glow left */}
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 20% 50%,rgba(197,160,89,0.08) 0%,transparent 55%)` }} />
        </motion.div>

        {/* Particles */}
        {particles.map((p, i) => <Particle key={i} delay={p.delay} x={p.x} size={p.size} />)}

        {/* Decorative rings — light gold on cream */}
        {[680, 820, 960].map((size, i) => (
          <motion.div
            key={i}
            className="absolute right-[2%] top-1/2 -translate-y-1/2 hidden xl:block pointer-events-none rounded-full"
            style={{ width: size, height: size, border: `1px solid rgba(197,160,89,${0.12 - i * 0.03})` }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.8, delay: i * 0.15 }}
          />
        ))}

        {/* ── OWNER IMAGE ────────────────────────────────────────── */}
        <div className="absolute right-0 top-30 z-10 hidden lg:flex items-start justify-end w-[48%] h-full pointer-events-none">

          {/* ambient glow */}
          <motion.div
            className="absolute bottom-0 right-0 pointer-events-none"
            style={{ width: 520, height: 620, borderRadius: "50%", background: `radial-gradient(ellipse at center,rgba(197,160,89,0.18) 0%,transparent 70%)`, filter: "blur(50px)" }}
            animate={{ scale: [1, 1.07, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* spinning conic ring 1 */}
          <motion.div className="absolute pointer-events-none" style={{ bottom: 0, right: 60, width: 420, height: 520 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <motion.div
              className="absolute inset-0"
              style={{ background: `conic-gradient(from 0deg,transparent 65%,${GOLD} 80%,${GOLD_LIGHT} 85%,transparent 100%)`, borderRadius: "50% 50% 0 0", filter: "blur(3px)", opacity: 0.6 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          {/* spinning conic ring 2 */}
          <motion.div className="absolute pointer-events-none" style={{ bottom: 0, right: 40, width: 460, height: 560 }}>
            <motion.div
              className="absolute inset-0"
              style={{ background: `conic-gradient(from 180deg,transparent 75%,${GOLD_DIM} 88%,transparent 100%)`, borderRadius: "50% 50% 0 0", filter: "blur(5px)", opacity: 0.3 }}
              animate={{ rotate: -360 }}
              transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          <motion.div
            className="relative z-10 mr-16"
            initial={{ opacity: 0, y: 100, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: ownerY }}
          >
            {/* badge left */}
            <motion.div
              className="absolute -left-14 top-20 z-20 flex items-center gap-3 backdrop-blur-md rounded-2xl px-4 py-3"
              style={{ background: "rgba(255,255,255,0.92)", border: `1px solid rgba(197,160,89,0.3)`, boxShadow: "0 8px 32px rgba(197,160,89,0.15)" }}
              initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.7, duration: 0.8 }}
              whileHover={{ scale: 1.06 }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})` }}>
                <Scissors className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-[#1A1A1A] text-xs font-bold leading-none mb-1">Master Stylist</p>
                <p className="text-zinc-500 text-[10px]">10+ Years Experience</p>
              </div>
            </motion.div>

            {/* badge right */}
            <motion.div
              className="absolute -right-10 top-[38%] z-20 rounded-2xl px-5 py-4 text-center"
              style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 16px 40px rgba(197,160,89,0.4)` }}
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.9, duration: 0.8 }}
              whileHover={{ scale: 1.06 }}
            >
              <div className="flex items-center justify-center gap-0.5 mb-1.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-white text-white" />)}
              </div>
              <p className="text-white text-sm font-black leading-none">5.0</p>
              <p className="text-white/80 text-[9px] mt-0.5 uppercase tracking-wider">Rating</p>
            </motion.div>

            {/* badge bottom */}
            <motion.div
              className="absolute -left-10 bottom-28 z-20 flex items-center gap-3 backdrop-blur-md rounded-2xl px-4 py-3"
              style={{ background: "rgba(255,255,255,0.92)", border: `1px solid rgba(197,160,89,0.25)`, boxShadow: "0 8px 32px rgba(197,160,89,0.12)" }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.1, duration: 0.8 }}
              whileHover={{ scale: 1.06 }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})` }}>
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-[#1A1A1A] text-xs font-bold leading-none mb-1">5,000+ Clients</p>
                <p className="text-zinc-500 text-[10px]">Served & Satisfied</p>
              </div>
            </motion.div>

            {/* photo */}
            <motion.div
              className="relative w-[340px] h-[500px] rounded-[2.5rem] overflow-hidden"
              style={{ boxShadow: `0 0 0 1.5px rgba(197,160,89,0.4), 0 50px 100px rgba(197,160,89,0.15), 0 20px 60px rgba(0,0,0,0.08)` }}
              whileHover={{ scale: 1.025, boxShadow: `0 0 0 2.5px rgba(197,160,89,0.65), 0 50px 100px rgba(197,160,89,0.22), 0 20px 60px rgba(0,0,0,0.1)` }}
              transition={{ duration: 0.5 }}
            >
              <img src={ownerImg} alt="JK Salon Owner" className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(197,160,89,0.25) 0%,transparent 40%)" }} />
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-10">
                <div className="backdrop-blur-sm rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.88)", border: "1px solid rgba(197,160,89,0.2)" }}>
                  <p className="text-[#1A1A1A] font-bold text-sm tracking-widest uppercase leading-none">JK Salon</p>
                  <p className="text-[10px] tracking-[0.3em] mt-1" style={{ color: GOLD }}>Owner · Colombo</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── HERO TEXT ───────────────────────────────────────────── */}
        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 w-full"
          style={{ y: textY }}
        >
          <div className="max-w-[540px]">
            {/* eyebrow */}
            <motion.div
              className="inline-flex items-center gap-3 mb-10"
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
            >
              <span className="w-10 h-px" style={{ background: `linear-gradient(90deg,transparent,${GOLD})` }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.5em]" style={{ color: GOLD }}>Premium Grooming &amp; Styling</span>
              <span className="w-10 h-px" style={{ background: `linear-gradient(90deg,${GOLD},transparent)` }} />
            </motion.div>

            {/* title */}
            <div className="overflow-hidden mb-2">
              <motion.h1
                className="font-serif leading-[0.9] tracking-[-0.04em] text-[#1A1A1A]"
                style={{ fontSize: "clamp(5rem,10vw,8rem)" }}
                initial={{ y: 130 }} animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                JK
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-10">
              <motion.h1
                className="font-serif leading-[0.9] tracking-[-0.04em]"
                style={{ fontSize: "clamp(5rem,10vw,8rem)", background: `linear-gradient(135deg,${GOLD} 0%,${GOLD_LIGHT} 45%,${GOLD} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                initial={{ y: 130 }} animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
              >
                Salon
              </motion.h1>
            </div>

            {/* description */}
            <motion.p
              className="text-zinc-500 text-base md:text-lg leading-relaxed mb-10 max-w-[420px]"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72, duration: 0.8 }}
            >
              Experience the pinnacle of luxury grooming. Our expert stylists combine traditional techniques with modern trends to craft your perfect look.
            </motion.p>

            {/* CTA buttons — both golden */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-16"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.92, duration: 0.7 }}
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/booking"
                  className="group relative overflow-hidden flex items-center justify-center gap-2 px-9 py-4 rounded-full text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 8px 30px rgba(197,160,89,0.4)` }}
                >
                  <span className="relative z-10">Book Appointment</span>
                  <ArrowRight className="relative z-10 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  <motion.div className="absolute inset-0 bg-white/20" initial={{ x: "-110%" }} whileHover={{ x: "110%" }} transition={{ duration: 0.5 }} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/services"
                  className="group flex items-center justify-center gap-2 px-9 py-4 rounded-full text-sm font-bold"
                  style={{ background: "transparent", border: `2px solid ${GOLD}`, color: GOLD }}
                >
                  Explore Services
                  <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* stats */}
            <motion.div
              className="flex gap-10"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15, duration: 0.7 }}
            >
              <Counter target="10+" label="Years Exp" />
              <div className="w-px self-stretch" style={{ background: "rgba(197,160,89,0.25)" }} />
              <Counter target="5k+" label="Happy Clients" />
              <div className="w-px self-stretch" style={{ background: "rgba(197,160,89,0.25)" }} />
              <Counter target="15+" label="Expert Barbers" />
            </motion.div>
          </div>
        </motion.div>

        {/* scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
        >
          <motion.div animate={{ y: [0, 9, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <ChevronDown className="h-5 w-5" style={{ color: GOLD }} />
          </motion.div>
          <p className="text-[8px] uppercase tracking-[0.4em]" style={{ color: GOLD }}>Scroll</p>
        </motion.div>
      </section>

      {/* ══ MARQUEE ═══════════════════════════════════════════════════════════ */}
      <div className="relative py-4 overflow-hidden" style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT},${GOLD})` }}>
        <motion.div
          className="flex gap-0 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(10)].map((_, i) => (
            <span key={i} className="inline-flex items-center gap-5 px-6 text-white/90 text-[10px] font-black uppercase tracking-[0.35em]">
              <Scissors className="h-3 w-3 shrink-10" />
              Premium Grooming
              <span className="w-1 h-1 rounded-full bg-white/30 shrink-0" />
              Expert Stylists
              <span className="w-1 h-1 rounded-full bg-white/30 shrink-0" />
              Luxury Experience
              <span className="w-1 h-1 rounded-full bg-white/30 shrink-0" />
              Colombo's Finest
              <span className="w-1 h-1 rounded-full bg-white/30 shrink-0" />
            </span>
          ))}
        </motion.div>
      </div>

      {/* ══ SERVICES ══════════════════════════════════════════════════════════ */}
      <section className="py-28" style={{ background: CREAM2 }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <SectionHeading eyebrow="What We Offer" title="Our Services" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {services.map((service, idx) => (
              <ServiceCard key={service._id || idx} service={service} idx={idx} />
            ))}
          </div>
          <motion.div
            className="mt-14 text-center"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            {/* GOLDEN outline link button */}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link
                to="/services"
                className="group inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold"
                style={{ border: `2px solid ${GOLD}`, color: GOLD }}
              >
                View All Services <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ WHY US ════════════════════════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden" style={{ background: CREAM }}>
        <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(90deg,transparent,rgba(197,160,89,0.3),transparent)` }} />
        <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: `linear-gradient(90deg,transparent,rgba(197,160,89,0.3),transparent)` }} />
        {/* soft gold radial bg */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 50%,rgba(197,160,89,0.04) 0%,transparent 65%)` }} />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <SectionHeading eyebrow="The JK Difference" title="Why Choose Us" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyItems.map((item, idx) => (
              <WhyCard key={idx} icon={item.icon} title={item.title} desc={item.desc} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══════════════════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden" style={{ background: CREAM2 }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `radial-gradient(ellipse at 15% 50%,rgba(197,160,89,0.06) 0%,transparent 55%),radial-gradient(ellipse at 85% 50%,rgba(197,160,89,0.06) 0%,transparent 55%)` }} />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <SectionHeading eyebrow="Client Love" title="What They Say" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((testimonial, idx) => (
              <ReviewCard key={testimonial._id || idx} testimonial={testimonial} idx={idx} />
            ))}
            {reviews.length === 0 && (
              <div className="col-span-full text-center text-zinc-400 py-16 text-sm">
                No reviews yet. Be the first to leave one!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══ BOOKING CTA ═══════════════════════════════════════════════════════ */}
      <section className="py-36 relative overflow-hidden" style={{ background: CREAM }}>
        {/* soft warm background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=2200"
            alt="Barber shop"
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
            style={{ opacity: 0.06 }}
          />
          <div className="absolute inset-0" style={{ background: `${CREAM}cc` }} />
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center,rgba(197,160,89,0.1) 0%,transparent 65%)` }} />
        </div>

        {/* concentric gold rings */}
        {[180, 320, 470, 620].map((size, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{ width: size, height: size, border: `1px solid rgba(197,160,89,${0.18 - i * 0.04})` }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2.5 + i * 0.8, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
          />
        ))}

        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.5em] mb-7" style={{ color: GOLD }}>
              <span className="w-6 h-px" style={{ background: GOLD }} />
              Get Started Today
              <span className="w-6 h-px" style={{ background: GOLD }} />
            </span>

            <h2 className="font-serif tracking-[-0.03em] leading-[1.05] mb-8 text-[#1A1A1A]"
              style={{ fontSize: "clamp(3rem,7vw,5.5rem)" }}>
              Ready for a<br />
              <span style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Transformation?
              </span>
            </h2>

            <p className="text-zinc-500 text-base leading-relaxed mb-10">
              Book your appointment now and experience the finest grooming service in Colombo.
            </p>

            {/* GOLDEN CTA button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/booking"
                className="relative overflow-hidden inline-flex items-center gap-3 px-14 py-5 rounded-full text-base font-bold text-white"
                style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 16px 50px rgba(197,160,89,0.4)` }}
              >
                <span className="relative z-10">Book Now</span>
                <ArrowRight className="relative z-10 h-5 w-5" />
                <motion.div className="absolute inset-0 bg-white/20" initial={{ x: "-110%" }} whileHover={{ x: "110%" }} transition={{ duration: 0.5 }} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;