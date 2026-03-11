import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ShieldCheck, Users, Award, History, ArrowRight, Star, Scissors, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

const GOLD = '#C5A059';
const GOLD_LIGHT = '#E8C97A';
const CREAM = '#FDFAF5';
const CREAM2 = '#F7F2EA';

/* ── Reusable animated section heading ───────────────────────── */
const SectionHeading = ({ eyebrow, title, sub, light = false }: { eyebrow: string; title: React.ReactNode; sub?: string; light?: boolean }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="text-center mb-16"
    >
      <span className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.5em] mb-5" style={{ color: GOLD }}>
        <span className="w-6 h-px" style={{ background: GOLD }} />
        {eyebrow}
        <span className="w-6 h-px" style={{ background: GOLD }} />
      </span>
      <h2 className={`text-5xl md:text-6xl font-serif tracking-[-0.02em] mb-5 ${light ? 'text-white' : 'text-[#1A1A1A]'}`}>
        {title}
      </h2>
      <div className="w-12 h-[2px] rounded-full mx-auto mb-5" style={{ background: `linear-gradient(90deg,transparent,${GOLD},transparent)` }} />
      {sub && <p className={`text-base leading-relaxed max-w-2xl mx-auto ${light ? 'text-zinc-400' : 'text-zinc-500'}`}>{sub}</p>}
    </motion.div>
  );
};

/* ── Value card ───────────────────────────────────────────────── */
const ValueCard = ({ icon: Icon, title, desc, idx }: { icon: any; title: string; desc: string; idx: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative bg-white rounded-2xl p-8 overflow-hidden transition-all"
      style={{ border: '1px solid rgba(197,160,89,0.12)', boxShadow: '0 4px 24px rgba(197,160,89,0.06)' }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{ background: 'linear-gradient(135deg,rgba(197,160,89,0.05) 0%,transparent 70%)' }} />
      <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg,transparent,${GOLD},transparent)` }} />
      <motion.div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: `linear-gradient(135deg,rgba(197,160,89,0.12),rgba(232,201,122,0.06))`, border: '1px solid rgba(197,160,89,0.18)' }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Icon className="h-6 w-6" style={{ color: GOLD }} />
      </motion.div>
      <h3 className="text-[#1A1A1A] font-bold text-lg mb-3">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
};

/* ── Team card ────────────────────────────────────────────────── */
const TeamCard = ({ member, idx }: { member: any; idx: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden rounded-3xl bg-white"
      style={{ border: '1px solid rgba(197,160,89,0.13)', boxShadow: '0 4px 30px rgba(197,160,89,0.07)' }}
    >
      {/* top gold line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg,transparent,${GOLD},transparent)` }} />

      <div className="aspect-[3/4] overflow-hidden relative">
        <img
          src={member.img}
          alt={member.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-108"
          referrerPolicy="no-referrer"
        />
        {/* subtle cream fade at bottom */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(253,250,245,0.6) 0%,transparent 50%)' }} />
      </div>

      <div className="p-7">
        {/* stars */}
        <div className="flex gap-0.5 mb-3">
          {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-[#C5A059] text-[#C5A059]" />)}
        </div>
        <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">{member.name}</h3>
        <p className="text-sm font-semibold mb-4" style={{ color: GOLD }}>{member.role}</p>
        <p className="text-zinc-500 text-xs leading-relaxed mb-5">{member.bio}</p>

        {/* experience badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(197,160,89,0.08)', border: '1px solid rgba(197,160,89,0.2)' }}>
          <Scissors className="h-3 w-3" style={{ color: GOLD }} />
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>{member.exp}</span>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Stat block ───────────────────────────────────────────────── */
const StatBlock = ({ value, label, delay }: { value: string; label: string; delay: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
      className="text-center"
    >
      <p className="text-4xl font-black tracking-tight mb-1"
        style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">{label}</p>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════
   ABOUT PAGE
══════════════════════════════════════════════════════════════ */
const About = () => {
  const storyRef = useRef(null);
  const storyInView = useInView(storyRef, { once: true, margin: '-80px' });

  const team = [
    {
      name: 'Jayantha Kumara',
      role: 'Founder & Master Stylist',
      bio: 'With over 15 years of experience, Jayantha founded JK Salon with a passion for precision grooming and luxury experiences.',
      exp: '15+ Years',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
    },
    {
      name: 'Sameera Perera',
      role: 'Senior Barber',
      bio: 'Sameera specializes in classic cuts and modern fades, bringing artistic flair to every client who sits in his chair.',
      exp: '10+ Years',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    },
    {
      name: 'Dilshan Silva',
      role: 'Styling Specialist',
      bio: "Dilshan is our creative powerhouse, known for transformative styling that perfectly suits each client's personality.",
      exp: '8+ Years',
      img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800',
    },
  ];

  const values = [
    { icon: ShieldCheck, title: 'Quality First', desc: 'We never compromise on the quality of our products and services — only the finest for our clients.' },
    { icon: Users, title: 'Community', desc: 'Building lasting relationships with our clients and Colombo community is at our core.' },
    { icon: Award, title: 'Expertise', desc: 'Continuous training keeps our stylists ahead of global grooming trends.' },
    { icon: History, title: 'Heritage', desc: 'Respecting traditional barbering techniques while embracing modern trends.' },
  ];

  return (
    <div className="overflow-x-hidden" style={{ background: CREAM }}>

      {/* ════════════════════════════════════════════════════════
          HERO BANNER
      ════════════════════════════════════════════════════════ */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        {/* background */}
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
            style={{ background: `radial-gradient(ellipse at 50% 40%,rgba(197,160,89,0.1) 0%,transparent 60%)` }} />
        </div>

        {/* rings */}
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
            <span className="text-[10px] font-bold uppercase tracking-[0.5em]" style={{ color: GOLD }}>JK Salon · Est. 2014</span>
            <span className="w-8 h-px" style={{ background: GOLD }} />
          </motion.div>

          <div className="overflow-hidden mb-5">
            <motion.h1
              className="font-serif tracking-[-0.03em] text-[#1A1A1A]"
              style={{ fontSize: 'clamp(3.5rem,8vw,6rem)', lineHeight: 1 }}
              initial={{ y: 100 }} animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              About{' '}
              <span style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Us
              </span>
            </motion.h1>
          </div>

          <motion.p
            className="text-zinc-500 text-base md:text-lg leading-relaxed max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            A decade of crafting confidence, one perfect cut at a time — Colombo's most trusted luxury grooming destination.
          </motion.p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          OUR STORY
      ════════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ background: CREAM2 }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* image side */}
            <motion.div
              ref={storyRef}
              initial={{ opacity: 0, x: -50 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* decorative gold block behind */}
              <div
                className="absolute -bottom-6 -right-6 w-full h-full rounded-3xl hidden md:block"
                style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, opacity: 0.12, zIndex: 0, borderRadius: '1.5rem' }}
              />
              {/* main image */}
              <div className="relative z-10 rounded-3xl overflow-hidden"
                style={{ boxShadow: '0 30px 60px rgba(197,160,89,0.15), 0 0 0 1.5px rgba(197,160,89,0.2)' }}>
                <img
                  src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=1000"
                  alt="JK Salon Interior"
                  className="w-full aspect-[4/5] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(253,250,245,0.3) 0%,transparent 50%)' }} />
              </div>

              {/* floating badge */}
              <motion.div
                className="absolute -left-6 top-10 z-20 flex items-center gap-3 rounded-2xl px-5 py-4"
                style={{ background: 'rgba(255,255,255,0.95)', border: `1.5px solid rgba(197,160,89,0.25)`, boxShadow: '0 12px 30px rgba(197,160,89,0.15)', backdropFilter: 'blur(10px)' }}
                initial={{ opacity: 0, x: -30 }}
                animate={storyInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})` }}>
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-[#1A1A1A] text-sm font-bold leading-none mb-0.5">Est. 2014</p>
                  <p className="text-zinc-500 text-[10px]">Colombo's Finest</p>
                </div>
              </motion.div>

              {/* floating stat badge */}
              <motion.div
                className="absolute -right-4 bottom-16 z-20 rounded-2xl px-5 py-4 text-center"
                style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 16px 40px rgba(197,160,89,0.45)` }}
                initial={{ opacity: 0, x: 30 }}
                animate={storyInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.8, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-white text-2xl font-black leading-none">15k+</p>
                <p className="text-white/80 text-[9px] uppercase tracking-wider mt-1">Styles Crafted</p>
              </motion.div>
            </motion.div>

            {/* text side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-7"
            >
              <span className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.5em]" style={{ color: GOLD }}>
                <span className="w-6 h-px" style={{ background: GOLD }} />
                Our Story
              </span>
              <h2 className="text-5xl font-serif tracking-[-0.03em] text-[#1A1A1A] leading-tight">
                Crafting Confidence<br />
                <span style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Since 2014.
                </span>
              </h2>
              <p className="text-zinc-500 leading-relaxed">
                JK Salon started with a simple vision: to create a sanctuary where grooming meets luxury. Over the past decade, we have grown from a small neighbourhood barber shop to Colombo's premier destination for modern grooming.
              </p>
              <p className="text-zinc-500 leading-relaxed">
                Our philosophy is rooted in precision and personalised care. We believe that a great haircut is more than just a service — it's an experience that boosts your confidence and reflects your unique personality.
              </p>

              {/* quote */}
              <div className="relative pl-6 py-2" style={{ borderLeft: `3px solid ${GOLD}` }}>
                <Quote className="h-5 w-5 mb-2" style={{ color: GOLD, opacity: 0.5 }} />
                <p className="text-[#1A1A1A] font-serif text-lg italic leading-relaxed">
                  "Every client deserves to leave feeling like the best version of themselves."
                </p>
                <p className="text-xs font-bold uppercase tracking-widest mt-2" style={{ color: GOLD }}>— Jayantha Kumara, Founder</p>
              </div>

              {/* stats row */}
              <div
                className="grid grid-cols-3 gap-6 pt-8"
                style={{ borderTop: '1px solid rgba(197,160,89,0.15)' }}
              >
                <StatBlock value="10+" label="Years Exp" delay={0.3} />
                <StatBlock value="15k+" label="Styles Done" delay={0.45} />
                <StatBlock value="5★" label="Avg Rating" delay={0.6} />
              </div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/booking"
                  className="relative overflow-hidden inline-flex items-center gap-2 px-9 py-4 rounded-full text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 8px 28px rgba(197,160,89,0.38)` }}
                >
                  <span className="relative z-10">Book an Appointment</span>
                  <ArrowRight className="relative z-10 h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          VALUES
      ════════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ background: CREAM }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow="What We Stand For"
            title="Our Values"
            sub="The principles that guide every cut, every style, and every client interaction at JK Salon."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => (
              <ValueCard key={idx} icon={v.icon} title={v.title} desc={v.desc} idx={idx} />
            ))}
          </div>
        </div>
      </section>

  

      {/* ════════════════════════════════════════════════════════
          TEAM
      ════════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ background: CREAM }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow="The People Behind the Magic"
            title="Meet Our Experts"
            sub="The talented hands and creative minds behind JK Salon's signature looks."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <TeamCard key={idx} member={member} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden" style={{ background: CREAM2 }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 50%,rgba(197,160,89,0.09) 0%,transparent 65%)` }} />
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
              <Scissors className="h-7 w-7 text-white" />
            </div>
            <h2
              className="font-serif tracking-[-0.02em] mb-5 text-[#1A1A1A]"
              style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', lineHeight: 1.1 }}
            >
              Come Experience{' '}
              <span style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                JK Salon
              </span>
            </h2>
            <p className="text-zinc-500 text-base leading-relaxed mb-10">
              Join thousands of satisfied clients and discover what makes JK Salon Colombo's most trusted grooming destination.
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
    </div>
  );
};

export default About;