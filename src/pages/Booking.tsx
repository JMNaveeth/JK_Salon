import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Scissors, Calendar, Clock, User, CreditCard, CheckCircle, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/src/utils/cn';
import { api } from '../services/api';
import { simulatePayment } from '../api/bookingApi';
import { db } from '../firebase/firebase';

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', 
  '05:00 PM', '06:00 PM', '07:00 PM'
];

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialServiceId = searchParams.get('service');

  const [step, setStep] = React.useState(1);
  const [services, setServices] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [formData, setFormData] = React.useState({
    serviceId: initialServiceId || '',
    date: startOfToday(),
    timeSlot: '',
    name: '',
    email: '',
    phone: '',
  });

  React.useEffect(() => {
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

    // Listen to real-time updates
    const source = new EventSource('/api/services/stream');
    source.onmessage = (event) => {
      if (event.data === 'updated') {
        fetchServices();
      }
    };

    return () => {
      source.close();
    };
  }, []);

  const selectedService = services.find(s => s.id === formData.serviceId);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#C5A059] animate-spin" />
      </div>
    );
  }

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const steps = [
    { id: 1, title: 'Service', icon: Scissors },
    { id: 2, title: 'Schedule', icon: Calendar },
    { id: 3, title: 'Details', icon: User },
    { id: 4, title: 'Payment', icon: CreditCard },
  ];

  const handleBooking = async () => {
    try {
      const bookingPayload = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        serviceName: selectedService?.name,
        date: format(formData.date, 'yyyy-MM-dd'),
        time: formData.timeSlot,
        amount: selectedService?.price,
      };

      const response = await api.createBooking({
        ...bookingPayload,
      });

      if (response.success) {
        const bookingRef = doc(db, 'bookings', response.id);

        await setDoc(bookingRef, {
          id: response.id,
          ...bookingPayload,
          status: 'Pending',
          paymentStatus: 'Pending',
          source: 'web',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true });

        // Simulate payment
        const paymentResult = await simulatePayment(response.id, selectedService?.price || 0);

        await updateDoc(bookingRef, {
          status: 'Confirmed',
          paymentStatus: 'Paid',
          transactionId: paymentResult?.transactionId || null,
          updatedAt: serverTimestamp(),
        });

        setStep(5); // Success step
      }
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Something went wrong while saving your booking. Please try again.');
    }
  };

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -z-10" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-[#C5A059] transition-all duration-500 -z-10" 
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    step >= s.id ? "bg-[#C5A059] text-white" : "bg-zinc-900 text-zinc-500 border border-white/5"
                  )}
                >
                  <s.icon className="h-5 w-5" />
                </div>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest mt-2",
                  step >= s.id ? "text-[#C5A059]" : "text-zinc-500"
                )}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 lg:p-12 min-h-[500px] flex flex-col">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Select a Service</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setFormData({ ...formData, serviceId: service.id })}
                      className={cn(
                        "p-6 rounded-2xl border text-left transition-all",
                        formData.serviceId === service.id 
                          ? "bg-[#C5A059]/10 border-[#C5A059]" 
                          : "bg-black border-white/5 hover:border-white/20"
                      )}
                    >
                      <h3 className="font-bold text-white mb-1">{service.name}</h3>
                      <p className="text-zinc-500 text-xs mb-4">{service.duration} mins</p>
                      <p className="text-[#C5A059] font-bold">Rs. {service.price}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Choose Date & Time</h2>
                
                <div className="mb-8">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 block mb-4">Select Date</label>
                  <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                    {[...Array(14)].map((_, i) => {
                      const date = addDays(startOfToday(), i);
                      return (
                        <button
                          key={i}
                          onClick={() => setFormData({ ...formData, date })}
                          className={cn(
                            "flex-shrink-0 w-20 h-24 rounded-2xl border flex flex-col items-center justify-center transition-all",
                            isSameDay(formData.date, date)
                              ? "bg-[#C5A059] border-[#C5A059] text-white"
                              : "bg-black border-white/5 text-zinc-400 hover:border-white/20"
                          )}
                        >
                          <span className="text-[10px] uppercase font-bold mb-1">{format(date, 'EEE')}</span>
                          <span className="text-xl font-bold">{format(date, 'dd')}</span>
                          <span className="text-[10px] uppercase font-bold mt-1">{format(date, 'MMM')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 block mb-4">Select Time Slot</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setFormData({ ...formData, timeSlot: slot })}
                        className={cn(
                          "py-3 rounded-xl border text-sm font-bold transition-all",
                          formData.timeSlot === slot
                            ? "bg-[#C5A059] border-[#C5A059] text-white"
                            : "bg-black border-white/5 text-zinc-400 hover:border-white/20"
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Your Details</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Full Name</label>
                    <input 
                      type="text" 
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
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] outline-none transition-all"
                      placeholder="+94 77 123 4567"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Confirm & Pay</h2>
                <div className="bg-black rounded-2xl p-6 border border-white/5 mb-8">
                  <div className="flex justify-between mb-4">
                    <span className="text-zinc-500">Service</span>
                    <span className="text-white font-bold">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-zinc-500">Date</span>
                    <span className="text-white font-bold">{format(formData.date, 'MMMM dd, yyyy')}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-zinc-500">Time</span>
                    <span className="text-white font-bold">{formData.timeSlot}</span>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between">
                    <span className="text-white font-bold">Total Amount</span>
                    <span className="text-[#C5A059] font-bold text-xl">Rs. {selectedService?.price}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-xs text-zinc-500 text-center">Secure payment via PayHere / Genie</p>
                  <div className="flex gap-4">
                    <div className="flex-1 h-12 bg-zinc-800 rounded-lg animate-pulse" />
                    <div className="flex-1 h-12 bg-zinc-800 rounded-lg animate-pulse" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-20 h-20 bg-[#C5A059] rounded-full flex items-center justify-center mb-8">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">Booking Confirmed!</h2>
                <p className="text-zinc-400 mb-8 max-w-sm">
                  Your appointment has been successfully scheduled. We've sent a confirmation email to {formData.email}.
                </p>
                <button 
                  onClick={() => navigate('/')}
                  className="bg-[#C5A059] hover:bg-[#B48F48] text-white px-8 py-3 rounded-full font-bold transition-all"
                >
                  Back to Home
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {step < 5 && (
            <div className="mt-auto pt-12 flex justify-between">
              {step > 1 ? (
                <button
                  onClick={prevStep}
                  className="flex items-center text-zinc-400 hover:text-white font-bold transition-all"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </button>
              ) : <div />}
              
              <button
                onClick={step === 4 ? handleBooking : nextStep}
                disabled={
                  (step === 1 && !formData.serviceId) ||
                  (step === 2 && !formData.timeSlot) ||
                  (step === 3 && (!formData.name || !formData.email || !formData.phone))
                }
                className="bg-[#C5A059] hover:bg-[#B48F48] disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-4 rounded-full font-bold transition-all flex items-center"
              >
                {step === 4 ? 'Pay & Confirm' : 'Continue'}
                {step < 4 && <ArrowRight className="ml-2 h-5 w-5" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
