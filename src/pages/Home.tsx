import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Scissors, Star, Clock, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../services/api';

const Home = () => {
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, reviewsData] = await Promise.all([
          api.getServices(),
          api.getReviews()
        ]);
        setServices(servicesData.slice(0, 4));
        setReviews(reviewsData.filter((r: any) => r.status === 'approved').slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=2000"
            alt="Salon Interior"
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="text-[#C5A059] text-sm font-bold uppercase tracking-[0.4em] mb-6 block">
              Premium Grooming & Styling
            </span>
            <h1 className="text-7xl md:text-9xl font-serif tracking-tighter leading-none mb-8">
              <span className="text-white">JK</span> <span className="text-[#C5A059]">Salon</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-xl leading-relaxed">
              Experience the pinnacle of luxury grooming at JK Salon. Our expert stylists combine traditional techniques with modern trends to craft your perfect look.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/booking"
                className="bg-[#C5A059] hover:bg-[#B48F48] text-white px-8 py-4 rounded-full text-lg font-bold transition-all flex items-center justify-center group"
              >
                Book Appointment
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/services"
                className="bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white border border-white/10 px-8 py-4 rounded-full text-lg font-bold transition-all text-center"
              >
                Explore Services
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-12 right-12 hidden lg:block">
          <div className="flex space-x-12">
            <div>
              <p className="text-4xl font-bold text-white">10+</p>
              <p className="text-xs text-zinc-500 uppercase tracking-widest">Years Exp</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">5k+</p>
              <p className="text-xs text-zinc-500 uppercase tracking-widest">Happy Clients</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">15+</p>
              <p className="text-xs text-zinc-500 uppercase tracking-widest">Expert Barbers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Preview */}
      <section className="py-24 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-16">
            <span className="text-[#C5A059] text-sm font-bold uppercase tracking-[0.3em] mb-4 block">What We Offer</span>
            <h2 className="text-5xl md:text-6xl font-serif text-[#1A1A1A] mb-6">Our Services</h2>
            <div className="w-12 h-[1px] bg-[#C5A059] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="bg-white border border-[#E5E5E5] rounded-lg p-10 flex flex-col items-center text-center transition-all hover:shadow-xl group">
                <div className="w-16 h-16 rounded-full bg-[#F9F5EF] flex items-center justify-center mb-8">
                  {service.category === 'Beard' ? (
                    <Sparkles className="h-6 w-6 text-[#C5A059]" />
                  ) : (
                    <Scissors className="h-6 w-6 text-[#C5A059]" />
                  )}
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#1A1A1A] mb-4">{service.name}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-6 max-w-[250px]">
                  {service.category === 'Hair' ? 'Precision cuts tailored to your personality and lifestyle.' : 
                   service.category === 'Beard' ? 'Expert beard shaping, trimming, and hot towel treatment.' :
                   'Premium grooming services for the modern gentleman.'}
                </p>
                <p className="text-[#C5A059] font-bold text-lg mb-8 uppercase tracking-wider">LKR {service.price.toLocaleString()}</p>
                <Link 
                  to="/booking" 
                  className="px-8 py-2 border border-[#E5E5E5] rounded-md text-sm font-medium text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all"
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
          
          <div className="mt-16">
            <Link to="/services" className="text-[#C5A059] font-semibold hover:underline flex items-center justify-center">
              View All Services <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">What Our Clients Say</h2>
            <div className="flex justify-center space-x-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-[#C5A059] text-[#C5A059]" />)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((testimonial, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-zinc-900 border border-white/5 relative">
                <p className="text-zinc-400 italic mb-8 leading-relaxed">"{testimonial.comment}"</p>
                <div>
                  <p className="font-bold text-white">{testimonial.customerName}</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Verified Client</p>
                </div>
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="col-span-full text-center text-zinc-500 py-12">
                No reviews yet. Be the first to leave one!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=2000"
            alt="Booking Background"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-8">Ready for a Transformation?</h2>
          <p className="text-xl text-zinc-400 mb-10">Book your appointment now and experience the best grooming service in Colombo.</p>
          <Link
            to="/booking"
            className="inline-block bg-[#C5A059] hover:bg-[#B48F48] text-white px-12 py-5 rounded-full text-xl font-bold transition-all shadow-2xl shadow-[#C5A059]/20"
          >
            Book Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
