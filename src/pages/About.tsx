import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Users, Award, History } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=1000"
                alt="Salon Team"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-[#C5A059] rounded-3xl -z-10 hidden md:block" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <span className="text-[#C5A059] font-bold tracking-widest uppercase text-xs">Our Story</span>
            <h2 className="text-5xl font-serif tracking-tighter text-white leading-tight">
              Crafting Confidence <br /> Since 2014.
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              JK Salon started with a simple vision: to create a sanctuary where grooming meets luxury. Over the past decade, we have grown from a small neighborhood barber shop to Colombo's premier destination for modern grooming.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Our philosophy is rooted in precision and personalized care. We believe that a great haircut is more than just a service—it's an experience that boosts your confidence and reflects your unique personality.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
              <div>
                <p className="text-3xl font-bold text-white mb-1">10+</p>
                <p className="text-xs text-zinc-500 uppercase tracking-widest">Years of Excellence</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">15k+</p>
                <p className="text-xs text-zinc-500 uppercase tracking-widest">Styles Crafted</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {[
            { icon: ShieldCheck, title: 'Quality', desc: 'We never compromise on the quality of our products and services.' },
            { icon: Users, title: 'Community', desc: 'Building lasting relationships with our clients is at our core.' },
            { icon: Award, title: 'Expertise', desc: 'Continuous training keeps our stylists at the top of their game.' },
            { icon: History, title: 'Heritage', desc: 'Respecting traditional techniques while embracing modern trends.' },
          ].map((value, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-[#C5A059]/30 transition-all">
              <value.icon className="h-8 w-8 text-[#C5A059] mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif tracking-tighter text-white mb-4">Meet Our Experts</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">The talented hands behind JK Salon's signature looks.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: 'Jayantha Kumara', role: 'Founder & Master Stylist', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800' },
            { name: 'Sameera Perera', role: 'Senior Barber', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800' },
            { name: 'Dilshan Silva', role: 'Styling Specialist', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800' },
          ].map((member, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-3xl bg-zinc-900">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                <p className="text-[#C5A059] text-sm mt-1">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
