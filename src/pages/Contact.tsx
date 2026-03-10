import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.sendMessage(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif tracking-tighter text-white mb-6"
          >
            Get in <span className="text-[#C5A059]">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 max-w-2xl mx-auto text-lg"
          >
            Have questions or want to book a special session? Reach out to us anytime.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5">
                <Phone className="h-6 w-6 text-[#C5A059] mb-4" />
                <h3 className="text-white font-bold mb-2">Call Us</h3>
                <p className="text-zinc-400 text-sm">+94 11 234 5678</p>
                <p className="text-zinc-400 text-sm">+94 77 123 4567</p>
              </div>
              <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5">
                <MessageSquare className="h-6 w-6 text-[#C5A059] mb-4" />
                <h3 className="text-white font-bold mb-2">WhatsApp</h3>
                <p className="text-zinc-400 text-sm">+94 77 123 4567</p>
                <a href="https://wa.me/94771234567" target="_blank" rel="noreferrer" className="text-[#C5A059] text-xs font-bold mt-2 inline-block hover:underline">Chat Now</a>
              </div>
              <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5">
                <Mail className="h-6 w-6 text-[#C5A059] mb-4" />
                <h3 className="text-white font-bold mb-2">Email Us</h3>
                <p className="text-zinc-400 text-sm">hello@jksalon.com</p>
                <p className="text-zinc-400 text-sm">support@jksalon.com</p>
              </div>
              <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5">
                <Clock className="h-6 w-6 text-[#C5A059] mb-4" />
                <h3 className="text-white font-bold mb-2">Visit Us</h3>
                <p className="text-zinc-400 text-sm">Mon-Fri: 9am - 8pm</p>
                <p className="text-zinc-400 text-sm">Sat-Sun: 9am - 6pm</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 flex items-start space-x-6">
              <MapPin className="h-8 w-8 text-[#C5A059] shrink-0" />
              <div>
                <h3 className="text-white font-bold mb-2">Location</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  123 Salon Street, Colombo 07, Sri Lanka. <br />
                  Located near the Independence Square.
                </p>
                <a 
                  href="https://goo.gl/maps/example" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[#C5A059] text-xs font-bold mt-4 inline-block hover:underline"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 lg:p-12"
          >
            <h3 className="text-2xl font-bold text-white mb-8">Send a Message</h3>
            {success ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="h-16 w-16 text-[#C5A059] mb-6" />
                <h4 className="text-2xl font-bold text-white mb-2">Message Sent!</h4>
                <p className="text-zinc-400">Thank you for reaching out. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] outline-none transition-all"
                    placeholder="How can we help?"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Message</label>
                  <textarea 
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] outline-none transition-all resize-none"
                    placeholder="Tell us more..."
                  />
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C5A059] hover:bg-[#B48F48] disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Map Embed Placeholder */}
        <div className="mt-24 h-[400px] rounded-3xl overflow-hidden grayscale invert opacity-50 border border-white/10">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.81529707!2d79.8211859!3d6.9218374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2593cf65a1e9d%3A0x53139987a6691ff3!2sColombo!5e0!3m2!1sen!2slk!4v1647856456789!5m2!1sen!2slk" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
