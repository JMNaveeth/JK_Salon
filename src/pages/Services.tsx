import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Scissors, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const Services = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#C5A059] animate-spin" />
      </div>
    );
  }
  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif tracking-tighter text-white mb-6"
          >
            Our <span className="text-[#C5A059]">Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 max-w-2xl mx-auto text-lg"
          >
            Discover our range of premium grooming services designed to make you look and feel your best.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-[#C5A059]/30 transition-all"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold uppercase tracking-widest border border-[#C5A059]/20">
                    {service.category}
                  </span>
                  <div className="flex items-center text-zinc-500 text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {service.duration} mins
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{service.name}</h3>
                <p className="text-zinc-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <span className="text-2xl font-bold text-[#C5A059]">Rs. {service.price}</span>
                  <Link
                    to={`/booking?service=${service.id}`}
                    className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#C5A059] hover:text-white transition-all flex items-center"
                  >
                    Book Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
