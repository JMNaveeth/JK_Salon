import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scissors, Calendar, Clock, User, CreditCard, CheckCircle,
  ArrowLeft, ArrowRight, Loader2, Shield, Star, ChevronLeft, ChevronRight, Sparkles,
} from 'lucide-react';
import {
  format, addDays, startOfToday, isSameDay,
  startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isBefore,
} from 'date-fns';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { cn } from '@/src/utils/cn';
import { api } from '../services/api';
import { simulatePayment } from '../api/bookingApi';
import { db } from '../firebase/firebase';

/* ─── Design tokens ────────────────────────────────────────── */
const GOLD       = '#C5A059';
const GOLD_LIGHT = '#E8C97A';
const GOLD_DIM   = '#5C4A25';
const BG         = '#FDFAF5';
const BG2        = '#FFFFFF';
const PANEL      = '#FFFFFF';
const BORDER     = 'rgba(197,160,89,0.24)';
const BORDER_HI  = 'rgba(197,160,89,0.38)';
const TEXT       = '#1E1A14';
const TEXT_MID   = 'rgba(30,26,20,0.56)';

const timeSlots = [
  '09:00 AM','10:00 AM','11:00 AM','12:00 PM',
  '01:00 PM','02:00 PM','03:00 PM','04:00 PM',
  '05:00 PM','06:00 PM','07:00 PM',
];

const steps = [
  { id: 1, title: 'Service',  icon: Scissors  },
  { id: 2, title: 'Schedule', icon: Calendar  },
  { id: 3, title: 'Details',  icon: User      },
  { id: 4, title: 'Payment',  icon: CreditCard},
];

const resolveSCode = (code?: string, bookingId?: string) => {
  if (code && String(code).trim()) return String(code).trim().toUpperCase();
  if (bookingId && String(bookingId).trim()) return `S-${String(bookingId).trim().toUpperCase()}`;
  return '';
};

const normalizeStatus = (status?: string) => (status || '').trim().toLowerCase();
const normalizeSlotLabel = (slot?: string) => String(slot || '').trim().toUpperCase().replace(/\s+/g, ' ');

/* ─── Floating label input ─────────────────────────────────── */
const FloatInput = ({
  label, type = 'text', value, onChange, placeholder,
}: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
}) => {
  const [focused, setFocused] = React.useState(false);
  const lifted = focused || value.length > 0;
  return (
    <div className="relative">
      <label
        className="absolute left-4 transition-all duration-200 pointer-events-none z-10 font-bold tracking-widest uppercase"
        style={{
          top: lifted ? '8px' : '50%',
          transform: lifted ? 'none' : 'translateY(-50%)',
          fontSize: lifted ? '9px' : '12px',
          color: focused ? GOLD : TEXT_MID,
          letterSpacing: '0.3em',
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={focused ? placeholder : ''}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pt-6 pb-3 px-4 rounded-2xl text-sm outline-none transition-all duration-300"
        style={{
          background: 'rgba(0,0,0,0.02)',
          border: `1px solid ${focused ? BORDER_HI : BORDER}`,
          color: TEXT,
          boxShadow: focused ? `0 0 0 3px rgba(197,160,89,0.07), inset 0 1px 0 rgba(197,160,89,0.06)` : 'none',
        }}
      />
      {/* animated gold underline */}
      <motion.div
        className="absolute bottom-0 left-4 right-4 h-[1.5px] rounded-full"
        style={{ background: `linear-gradient(90deg,transparent,${GOLD},${GOLD_LIGHT},${GOLD},transparent)` }}
        animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      />
    </div>
  );
};

/* ─── Mini calendar ────────────────────────────────────────── */
const MiniCalendar = ({
  selected, onSelect,
}: { selected: Date; onSelect: (d: Date) => void }) => {
  const [viewMonth, setViewMonth] = React.useState(startOfMonth(startOfToday()));
  const today = startOfToday();
  const start = startOfMonth(viewMonth);
  const end   = endOfMonth(viewMonth);
  const days  = eachDayOfInterval({ start, end });
  const leadingBlanks = getDay(start); // 0=Sun

  return (
    <div className="rounded-2xl p-5" style={{ background: 'rgba(0,0,0,0.015)', border: `1px solid ${BORDER}` }}>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: TEXT_MID, border: `1px solid ${BORDER}` }}
          onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
          onMouseLeave={e => (e.currentTarget.style.color = TEXT_MID)}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-bold tracking-wider uppercase" style={{ color: TEXT }}>
          {format(viewMonth, 'MMMM yyyy')}
        </span>
        <button
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: TEXT_MID, border: `1px solid ${BORDER}` }}
          onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
          onMouseLeave={e => (e.currentTarget.style.color = TEXT_MID)}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <div key={d} className="text-center text-[9px] font-black uppercase tracking-widest py-1" style={{ color: TEXT_MID }}>
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-y-1">
        {[...Array(leadingBlanks)].map((_, i) => <div key={`b-${i}`} />)}
        {days.map(day => {
          const past     = isBefore(day, today);
          const isToday  = isSameDay(day, today);
          const isSel    = isSameDay(day, selected);
          return (
            <button
              key={day.toISOString()}
              disabled={past}
              onClick={() => onSelect(day)}
              className="relative flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 h-9"
              style={{
                color: past ? 'rgba(30,26,20,0.25)' : isSel ? '#fff' : isToday ? GOLD : TEXT,
                background: isSel
                  ? `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`
                  : isToday ? 'rgba(197,160,89,0.10)' : 'transparent',
                border: isToday && !isSel ? `1px solid rgba(197,160,89,0.30)` : '1px solid transparent',
                cursor: past ? 'not-allowed' : 'pointer',
                boxShadow: isSel ? `0 4px 16px rgba(197,160,89,0.35)` : 'none',
              }}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Service card (cinematic full-bleed) ──────────────────── */
const ServiceSelectCard = ({
  service, selected, onSelect, idx,
}: { service: any; selected: boolean; onSelect: () => void; idx: number }) => {
  const [hovered, setHovered] = React.useState(false);
  const imageUrl = service.imageUrl ||
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800';

  return (
    <motion.button
      onClick={onSelect}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden text-left cursor-pointer"
      style={{
        borderRadius: 20,
        aspectRatio: '3 / 2.2',
        border: selected ? `1.5px solid ${GOLD}` : `1.5px solid ${BORDER}`,
        boxShadow: selected
          ? `0 0 0 3px rgba(197,160,89,0.14), 0 20px 50px rgba(197,160,89,0.18)`
          : hovered ? `0 16px 40px rgba(0,0,0,0.28)` : `0 4px 12px rgba(0,0,0,0.16)`,
        transition: 'box-shadow 0.4s ease, border-color 0.3s ease',
      }}
    >
      {/* image */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: hovered || selected ? 1.07 : 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src={imageUrl} alt={service.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </motion.div>

      {/* gradient overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,7,10,0.96) 0%, rgba(8,7,10,0.55) 45%, rgba(8,7,10,0.10) 100%)' }} />

      {/* gold top shimmer on hover/select */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg,transparent,${GOLD},${GOLD_LIGHT},${GOLD},transparent)`, boxShadow: `0 0 12px ${GOLD}88` }}
        animate={{ scaleX: hovered || selected ? 1 : 0, opacity: hovered || selected ? 1 : 0 }}
        initial={{ scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.45 }}
      />

      {/* selected checkmark */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 4px 14px rgba(197,160,89,0.5)` }}
          >
            <CheckCircle className="h-4 w-4 text-white" strokeWidth={2.5} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* category badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.28em] backdrop-blur-md"
          style={{ background: 'rgba(197,160,89,0.16)', color: GOLD_LIGHT, border: `1px solid rgba(197,160,89,0.38)` }}>
          {service.category || 'Service'}
        </span>
      </div>

      {/* bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white font-bold text-sm leading-tight mb-1" style={{ fontFamily: 'serif' }}>{service.name}</p>
            {service.duration && (
              <span className="flex items-center gap-1 text-[9px]" style={{ color: TEXT_MID }}>
                <Clock className="h-2.5 w-2.5" style={{ color: GOLD }} />
                {service.duration} min
              </span>
            )}
          </div>
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(197,160,89,0.55)' }}>From</p>
            <p className="font-black text-lg leading-none" style={{ color: selected ? GOLD_LIGHT : GOLD }}>
              LKR {Number(service.price).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </motion.button>
  );
};

/* ─── Left summary panel ───────────────────────────────────── */
const SummaryPanel = ({
  step, formData, selectedService,
}: { step: number; formData: any; selectedService: any }) => {
  return (
    <div
      className="relative flex flex-col h-full overflow-hidden"
      style={{ background: PANEL, borderRight: `1px solid ${BORDER}` }}
    >
      {/* ambient glow */}
      <div className="absolute top-0 left-0 right-0 h-80 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%,rgba(197,160,89,0.09) 0%,transparent 65%)` }} />

      {/* branding */}
      <div className="relative z-10 px-8 pt-10 pb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 6px 20px rgba(197,160,89,0.35)` }}>
            <Scissors className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-black text-sm tracking-widest uppercase" style={{ color: TEXT }}>JK Salon</p>
            <p className="text-[9px] uppercase tracking-[0.35em]" style={{ color: GOLD }}>Colombo</p>
          </div>
        </div>
      </div>

      {/* booking details */}
      <div className="mx-6 rounded-2xl p-4 space-y-3 mb-6"
        style={{ background: 'rgba(0,0,0,0.015)', border: `1px solid ${BORDER}` }}>
        {[
          { icon: Scissors, label: 'Service',  value: selectedService?.name          || '—' },
          { icon: Calendar, label: 'Date',     value: formData.date ? format(formData.date, 'MMM dd, yyyy') : '—' },
          { icon: Clock,    label: 'Time',     value: formData.timeSlot               || '—' },
          { icon: CreditCard, label: 'Amount', value: selectedService ? `LKR ${Number(selectedService.price).toLocaleString()}` : '—' },
        ].map(({ icon: Icon, label, value }, i) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(197,160,89,0.10)', border: `1px solid rgba(197,160,89,0.18)` }}>
              <Icon className="h-3 w-3" style={{ color: GOLD }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[8.5px] uppercase tracking-[0.3em] font-bold mb-0.5" style={{ color: TEXT_MID }}>{label}</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={value}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-xs font-bold truncate"
                  style={{ color: value === '—' ? TEXT_MID : TEXT }}
                >
                  {value}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* vertical step indicator */}
      <div className="mx-6 space-y-0 mb-6 flex-1">
        {steps.map((s, i) => {
          const done    = step > s.id;
          const active  = step === s.id;
          const isLast  = i === steps.length - 1;
          return (
            <div key={s.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <motion.div
                  className="w-7 h-7 rounded-full flex items-center justify-center z-10 relative flex-shrink-0"
                  style={{
                    background: done
                      ? `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`
                      : active
                        ? `rgba(197,160,89,0.15)`
                        : 'rgba(0,0,0,0.03)',
                    border: active
                      ? `1.5px solid ${GOLD}`
                      : done ? 'none' : `1px solid rgba(0,0,0,0.08)`,
                    boxShadow: active ? `0 0 16px rgba(197,160,89,0.35)` : 'none',
                  }}
                  animate={{ scale: active ? [1, 1.12, 1] : 1 }}
                  transition={{ duration: 1.5, repeat: active ? Infinity : 0 }}
                >
                  {done
                    ? <CheckCircle className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                    : <s.icon className="h-3 w-3" style={{ color: active ? GOLD : TEXT_MID }} />
                  }
                </motion.div>
                {!isLast && (
                  <div className="w-px flex-1 my-0.5" style={{ minHeight: 20,
                    background: done ? `linear-gradient(to bottom,${GOLD_DIM},${GOLD_DIM})` : 'rgba(0,0,0,0.08)' }} />
                )}
              </div>
              <div className="pb-4 pt-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em]"
                  style={{ color: active ? GOLD : done ? 'rgba(197,160,89,0.55)' : TEXT_MID }}>
                  {s.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* trust badges */}
      <div className="mx-6 mb-8 flex gap-2">
        {[
          { icon: Shield, label: 'Secure' },
          { icon: Star, label: 'Premium' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(0,0,0,0.015)', border: `1px solid ${BORDER}` }}>
            <Icon className="h-3 w-3 flex-shrink-0" style={{ color: GOLD }} />
            <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: TEXT_MID }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MobileSummaryCard = ({
  formData, selectedService,
}: { formData: any; selectedService: any }) => {
  return (
    <div
      className="lg:hidden mx-4 mt-4 mb-3 rounded-3xl overflow-hidden"
      style={{ border: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.75)' }}
    >
      <div className="px-4 pt-4 pb-3" style={{ background: `linear-gradient(180deg, rgba(197,160,89,0.08), rgba(255,255,255,0.01))` }}>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 8px 22px rgba(197,160,89,0.32)` }}
          >
            <Scissors className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-black text-sm tracking-[0.25em] uppercase truncate" style={{ color: TEXT }}>JK Salon</p>
            <p className="text-[9px] uppercase tracking-[0.45em]" style={{ color: GOLD }}>Colombo</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Service', value: selectedService?.name || '—' },
            { label: 'Date', value: formData.date ? format(formData.date, 'MMM dd, yyyy') : '—' },
            { label: 'Time', value: formData.timeSlot || '—' },
            { label: 'Amount', value: selectedService ? `LKR ${Number(selectedService.price).toLocaleString()}` : '—' },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-2xl p-3"
              style={{ background: 'rgba(255,255,255,0.9)', border: `1px solid ${BORDER}` }}
            >
              <p className="text-[8px] uppercase tracking-[0.35em] font-black mb-1" style={{ color: TEXT_MID }}>{label}</p>
              <p className="text-xs font-bold leading-tight break-words" style={{ color: TEXT }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   BOOKING PAGE
══════════════════════════════════════════════════════════════ */
const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const initialServiceId = searchParams.get('service');

  const [step, setStep]         = React.useState(1);
  const [services, setServices] = React.useState<any[]>([]);
  const [loading, setLoading]   = React.useState(true);
  const [paying, setPaying]     = React.useState(false);
  const [payMethod, setPayMethod] = React.useState<'payhere' | 'genie'>('payhere');
  const [sCode, setSCode]       = React.useState('');
  const [bookingConfirmed, setBookingConfirmed] = React.useState(false);
  const [reviewRating, setReviewRating] = React.useState(5);
  const [reviewComment, setReviewComment] = React.useState('');
  const [reviewSubmitting, setReviewSubmitting] = React.useState(false);
  const [reviewSubmitted, setReviewSubmitted] = React.useState(false);
  const [bookedSlots, setBookedSlots] = React.useState<Set<string>>(new Set());
  const [slotAvailabilityLoading, setSlotAvailabilityLoading] = React.useState(false);
  const [slotError, setSlotError] = React.useState('');
  const [formData, setFormData] = React.useState({
    serviceId: initialServiceId || '',
    date: startOfToday(),
    timeSlot: '',
    name: '', email: '', phone: '',
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
    const source = new EventSource('/api/services/stream');
    source.onmessage = (event) => { if (event.data === 'updated') fetchServices(); };
    return () => source.close();
  }, []);

  React.useEffect(() => {
    const selectedDate = format(formData.date, 'yyyy-MM-dd');
    setSlotAvailabilityLoading(true);
    let firebaseSlots = new Set<string>();
    let apiSlots = new Set<string>();

    const mergeAndApply = () => {
      const merged = new Set<string>([...firebaseSlots, ...apiSlots]);
      setBookedSlots(merged);
      if (formData.timeSlot && merged.has(normalizeSlotLabel(formData.timeSlot))) {
        setFormData((prev) => ({ ...prev, timeSlot: '' }));
        setSlotError('Please select a valid time slot');
      }
    };

    const fetchSlotsFromApi = async () => {
      try {
        const allBookings = await api.getBookings();
        const slots = new Set<string>();
        allBookings
          .filter((booking: any) => booking.date === selectedDate && normalizeStatus(booking.status) !== 'cancelled')
          .forEach((booking: any) => {
            const slot = normalizeSlotLabel(booking?.timeSlot || booking?.time);
            if (slot) slots.add(slot);
          });
        apiSlots = slots;
        mergeAndApply();
      } catch (error) {
        console.error('Failed to load slot availability:', error);
      } finally {
        setSlotAvailabilityLoading(false);
      }
    };

    const q = query(collection(db, 'bookings'), where('date', '==', selectedDate));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const activeSlots = new Set<string>();
        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data() as any;
          const status = normalizeStatus(data?.status);
          if (status !== 'cancelled') {
            const slot = normalizeSlotLabel(data?.timeSlot || data?.time);
            if (slot) activeSlots.add(slot);
          }
        });
        firebaseSlots = activeSlots;
        mergeAndApply();
        setSlotAvailabilityLoading(false);
      },
      () => {
        setSlotAvailabilityLoading(false);
      }
    );

    fetchSlotsFromApi();
    const source = new EventSource('/api/bookings/stream');
    source.onmessage = (event) => {
      if (event.data === 'updated') fetchSlotsFromApi();
    };
    source.onerror = () => {
      source.close();
    };

    const polling = window.setInterval(fetchSlotsFromApi, 10000);

    return () => {
      unsubscribe();
      source.close();
      window.clearInterval(polling);
    };
  }, [formData.date]);

  const selectedService = services.find(s => s.id === formData.serviceId);

  const isSlotBooked = (slot: string) => bookedSlots.has(normalizeSlotLabel(slot));

  const onSelectSlot = (slot: string) => {
    if (isSlotBooked(slot)) {
      setSlotError('Please select a valid time slot');
      return;
    }
    setSlotError('');
    setFormData({ ...formData, timeSlot: slot });
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const canNext = () => {
    if (step === 1) return !!formData.serviceId;
    if (step === 2) return !!formData.date && !!formData.timeSlot && !isSlotBooked(formData.timeSlot);
    if (step === 3) return !!(formData.name && formData.email && formData.phone);
    return true;
  };

  const handleContinue = () => {
    if (step === 2 && (!formData.date || !formData.timeSlot || isSlotBooked(formData.timeSlot))) {
      setSlotError('Please select a valid time slot');
      return;
    }
    setSlotError('');
    nextStep();
  };

  const handleBooking = async () => {
    try {
      setPaying(true);
      setBookingConfirmed(false);
      const bookingPayload = {
        userId: formData.email || formData.phone || 'guest-user',
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        serviceName: selectedService?.name,
        date: format(formData.date, 'yyyy-MM-dd'),
        timeSlot: formData.timeSlot,
        time: formData.timeSlot,
        amount: selectedService?.price,
      };
      const response = await api.createBooking({ ...bookingPayload });
      if (response.success) {
        const generatedSCode = resolveSCode(response.sCode, response.id);
        setSCode(generatedSCode);
        setBookingConfirmed(true);

        setStep(5);

        const paymentResult = await simulatePayment(response.id, selectedService?.price || 0);
        if (paymentResult?.transactionId) {
          console.info('Payment transaction:', paymentResult.transactionId);
        }
      } else {
        alert(response?.error || 'Booking failed. Please try another slot.');
      }
    } catch (error: any) {
      const message = String(error?.message || '').toLowerCase();
      if (message.includes('slot already booked')) {
        setSlotError('Please select a valid time slot');
        alert('This slot was just booked by another customer. Please pick another time slot.');
        return;
      }
      console.error('Booking failed:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewComment.trim()) return;

    try {
      setReviewSubmitting(true);
      await api.createReview({
        customerName: formData.name,
        rating: reviewRating,
        comment: reviewComment.trim(),
        date: new Date().toISOString(),
        serviceName: selectedService?.name || '',
        photoUrl: '',
      });
      setReviewSubmitted(true);
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Could not submit your review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
        <motion.div className="flex flex-col items-center gap-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="relative w-20 h-20">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: `conic-gradient(from 0deg,transparent 65%,${GOLD} 80%,${GOLD_LIGHT} 90%,transparent 100%)`, filter: 'blur(1px)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-[6px] rounded-full flex items-center justify-center" style={{ background: BG2 }}>
              <Scissors className="h-6 w-6" style={{ color: GOLD }} />
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-[0.5em] font-bold" style={{ color: GOLD }}>Loading</p>
        </motion.div>
      </div>
    );
  }

  /* ── Success screen ── */
  if (step === 5) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden" style={{ background: BG }}>
        {/* ambient */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 40%,rgba(197,160,89,0.10) 0%,transparent 60%)` }} />
        {/* floating particles */}
        {[...Array(14)].map((_, i) => (
          <motion.div key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 3 + (i % 3), height: 3 + (i % 3),
              background: i % 3 === 0 ? GOLD : i % 3 === 1 ? GOLD_LIGHT : 'rgba(197,160,89,0.4)',
              left: `${5 + i * 6.5}%`, bottom: '-10px',
            }}
            animate={{ y: -700, opacity: [0, 0.7, 0] }}
            transition={{ duration: 5 + (i % 4), delay: i * 0.3, repeat: Infinity, ease: 'linear' }}
          />
        ))}

        <motion.div
          className="relative z-10 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ticket card */}
          <div className="rounded-3xl overflow-hidden" style={{ border: `1px solid ${BORDER_HI}`, boxShadow: `0 40px 100px rgba(197,160,89,0.18), 0 0 0 1px rgba(197,160,89,0.05)` }}>

            {/* top gold band */}
            <div className="h-1.5" style={{ background: `linear-gradient(90deg,${GOLD_DIM},${GOLD},${GOLD_LIGHT},${GOLD},${GOLD_DIM})` }} />

            {/* header */}
            <div className="px-8 pt-8 pb-6 text-center" style={{ background: `linear-gradient(to bottom,rgba(197,160,89,0.06),${BG2})` }}>
              <motion.div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 12px 40px rgba(197,160,89,0.45)` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.2 }}
              >
                <CheckCircle className="h-10 w-10 text-white" strokeWidth={2} />
              </motion.div>
              <motion.h2
                className="font-serif text-3xl font-bold mb-1"
                style={{ color: TEXT }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {bookingConfirmed ? 'Booking Received' : 'Booking Confirmed'}
              </motion.h2>
              <motion.p
                className="text-xs tracking-[0.3em] uppercase"
                style={{ color: GOLD }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                See you soon
              </motion.p>
            </div>

            {/* perforated divider */}
            <div className="relative flex items-center" style={{ background: BG2 }}>
              <div className="w-6 h-6 rounded-full absolute -left-3" style={{ background: BG }} />
              <div className="flex-1 border-t-2 border-dashed mx-6" style={{ borderColor: 'rgba(197,160,89,0.18)' }} />
              <div className="w-6 h-6 rounded-full absolute -right-3" style={{ background: BG }} />
            </div>

            {/* ticket body */}
            <div className="px-8 pt-6 pb-8" style={{ background: BG2 }}>
              {[
                { label: 'Service',  value: selectedService?.name || '—' },
                { label: 'Date',     value: format(formData.date, 'EEEE, MMMM dd yyyy') },
                { label: 'Time',     value: formData.timeSlot },
                { label: 'Client',   value: formData.name },
                { label: 'Amount',   value: `LKR ${Number(selectedService?.price || 0).toLocaleString()}`, gold: true },
              ].map(({ label, value, gold }, i) => (
                <motion.div
                  key={label}
                  className="flex items-center justify-between py-2.5"
                  style={{ borderBottom: i < 4 ? `1px solid rgba(255,255,255,0.05)` : 'none' }}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                >
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: TEXT_MID }}>{label}</span>
                  <span className="text-sm font-bold" style={{ color: gold ? GOLD_LIGHT : TEXT }}>{value}</span>
                </motion.div>
              ))}

              {/* reference */}
              <motion.div
                className="mt-5 rounded-2xl p-4 text-center"
                style={{ background: 'rgba(197,160,89,0.07)', border: `1px dashed rgba(197,160,89,0.25)` }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <p className="text-[9px] uppercase tracking-[0.4em] mb-1 font-bold" style={{ color: TEXT_MID }}>S-code</p>
                <p className="text-xl font-black tracking-widest" style={{ color: GOLD, fontFamily: 'monospace' }}>{sCode || 'S-CODE-N/A'}</p>
              </motion.div>

              <motion.p
                className="text-center text-[10px] mt-4"
                style={{ color: TEXT_MID }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {bookingConfirmed ? 'Your S-code is ready now. Confirmation will update after payment.' : `Confirmation sent to ${formData.email}`}
              </motion.p>

              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <div className="mt-4 rounded-2xl p-4 text-left" style={{ background: 'rgba(197,160,89,0.06)', border: `1px solid rgba(197,160,89,0.16)` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-4 w-4" style={{ color: GOLD }} />
                    <p className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: TEXT }}>Leave a Review</p>
                  </div>

                  {reviewSubmitted ? (
                    <div className="rounded-xl px-4 py-3 text-sm font-semibold" style={{ background: 'rgba(34,197,94,0.08)', color: '#15803D', border: '1px solid rgba(34,197,94,0.18)' }}>
                      Thanks. Your review has been sent to the shop owner.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((value) => {
                          const active = value <= reviewRating;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setReviewRating(value)}
                              className="transition-transform hover:scale-105"
                              aria-label={`Set rating to ${value}`}
                            >
                              <Star className="h-5 w-5" style={{ color: active ? GOLD : 'rgba(30,26,20,0.18)', fill: active ? GOLD : 'transparent' }} />
                            </button>
                          );
                        })}
                      </div>

                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={4}
                        placeholder="Tell the owner what you liked about the service..."
                        className="w-full rounded-2xl px-4 py-3 text-sm outline-none resize-none"
                        style={{ background: 'rgba(255,255,255,0.85)', border: `1px solid ${BORDER}`, color: TEXT }}
                      />

                      <button
                        type="button"
                        onClick={handleReviewSubmit}
                        disabled={reviewSubmitting || !reviewComment.trim()}
                        className="w-full py-3 rounded-2xl text-sm font-black uppercase tracking-[0.25em] text-white disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 10px 24px rgba(197,160,89,0.28)` }}
                      >
                        {reviewSubmitting ? 'Sending Review...' : 'Submit Review'}
                      </button>
                    </div>
                  )}
                </div>

                <motion.button
                  onClick={() => navigate('/')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 rounded-2xl text-sm font-black tracking-widest uppercase text-white relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, boxShadow: `0 10px 30px rgba(197,160,89,0.38)` }}
                >
                  Back to Home
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     MAIN BOOKING LAYOUT (split panel)
  ══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: BG, paddingTop: 64 }}>

      <MobileSummaryCard formData={formData} selectedService={selectedService} />

      {/* ── LEFT SUMMARY PANEL (desktop only) ─────────────────── */}
      <div className="hidden lg:block w-80 xl:w-96 flex-shrink-0 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
        <SummaryPanel step={step} formData={formData} selectedService={selectedService} />
      </div>

      {/* ── RIGHT STEP CONTENT ────────────────────────────────── */}
      <div className="flex-1 min-h-[calc(100vh-64px)] flex flex-col w-full">

        {/* mobile progress bar */}
        <div className="lg:hidden px-4 sm:px-6 pt-2 pb-5">
          <div className="flex items-start gap-2 overflow-x-auto pb-1">
            {steps.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-1 min-w-[64px] shrink-0">
                  <div className={cn('w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300')} style={{
                    background: step >= s.id ? `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})` : 'rgba(0,0,0,0.03)',
                    border: step >= s.id ? 'none' : `1px solid rgba(0,0,0,0.08)`,
                    boxShadow: step === s.id ? `0 0 16px rgba(197,160,89,0.4)` : 'none',
                  }}>
                    {step > s.id ? <CheckCircle className="h-4 w-4 text-white" strokeWidth={2.5} /> : <s.icon className="h-3.5 w-3.5" style={{ color: step >= s.id ? '#fff' : TEXT_MID }} />}
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-center leading-tight" style={{ color: step >= s.id ? GOLD : TEXT_MID }}>{s.title}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-8 shrink-0 h-px mt-4" style={{ background: step > s.id ? `linear-gradient(90deg,${GOLD_DIM},${GOLD_DIM})` : 'rgba(0,0,0,0.08)' }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* step content area */}
        <div className="flex-1 px-4 sm:px-6 lg:px-14 xl:px-20 py-4 sm:py-8 lg:py-10">
          <AnimatePresence mode="wait">

            {/* ── STEP 1: Service ── */}
            {step === 1 && (
              <motion.div key="step1"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-6 sm:mb-8 max-w-xl">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.45em] mb-2 sm:mb-3" style={{ color: GOLD }}>Step 1 of 4</p>
                  <h2 className="font-serif text-2xl sm:text-4xl font-bold mb-2" style={{ color: TEXT }}>Choose Your Service</h2>
                  <p className="text-sm leading-relaxed max-w-lg" style={{ color: TEXT_MID }}>Select the grooming service you'd like to book.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                  {services.map((service, idx) => (
                    <ServiceSelectCard
                      key={service.id}
                      service={service}
                      idx={idx}
                      selected={formData.serviceId === service.id}
                      onSelect={() => setFormData({ ...formData, serviceId: service.id })}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Schedule ── */}
            {step === 2 && (
              <motion.div key="step2"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-6 sm:mb-8 max-w-xl">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.45em] mb-2 sm:mb-3" style={{ color: GOLD }}>Step 2 of 4</p>
                  <h2 className="font-serif text-2xl sm:text-4xl font-bold mb-2" style={{ color: TEXT }}>Pick Date & Time</h2>
                  <p className="text-sm leading-relaxed" style={{ color: TEXT_MID }}>Choose a date and your preferred time slot.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* calendar */}
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-3" style={{ color: TEXT_MID }}>Select Date</p>
                    <MiniCalendar selected={formData.date} onSelect={date => setFormData({ ...formData, date })} />
                  </div>

                  {/* time slots */}
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-3" style={{ color: TEXT_MID }}>
                      Select Time · {format(formData.date, 'EEE, MMM dd')}
                    </p>
                    {slotAvailabilityLoading && (
                      <p className="text-[10px] mb-2" style={{ color: TEXT_MID }}>Checking real-time availability...</p>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-2.5">
                      {timeSlots.map((slot, i) => {
                        const sel = formData.timeSlot === slot;
                        const booked = isSlotBooked(slot);
                        return (
                          <motion.button
                            key={slot}
                            onClick={() => onSelectSlot(slot)}
                            disabled={booked}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            whileHover={booked ? {} : { y: -2 }}
                            whileTap={booked ? {} : { scale: 0.97 }}
                            className="py-3 px-3 rounded-xl text-xs font-bold transition-all duration-200 relative overflow-hidden"
                            style={{
                              background: booked
                                ? 'rgba(239,68,68,0.10)'
                                : sel
                                ? `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`
                                : 'rgba(0,0,0,0.03)',
                              border: `1px solid ${booked ? 'rgba(239,68,68,0.35)' : sel ? GOLD : BORDER}`,
                              color: booked ? '#B91C1C' : sel ? '#fff' : TEXT_MID,
                              boxShadow: sel ? `0 6px 20px rgba(197,160,89,0.35)` : 'none',
                              cursor: booked ? 'not-allowed' : 'pointer',
                              opacity: booked ? 0.78 : 1,
                            }}
                          >
                            {sel && !booked && (
                              <motion.div
                                className="absolute inset-0 bg-white/15"
                                initial={{ x: '-110%' }}
                                animate={{ x: '110%' }}
                                transition={{ duration: 0.5 }}
                              />
                            )}
                            <span className="relative z-10">{slot} {booked ? '❌' : '✅'}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                    {slotError && (
                      <p className="mt-3 text-xs font-semibold" style={{ color: '#B91C1C' }}>{slotError}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Details ── */}
            {step === 3 && (
              <motion.div key="step3"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-lg"
              >
                <div className="mb-6 sm:mb-8">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.45em] mb-2 sm:mb-3" style={{ color: GOLD }}>Step 3 of 4</p>
                  <h2 className="font-serif text-2xl sm:text-4xl font-bold mb-2" style={{ color: TEXT }}>Your Details</h2>
                  <p className="text-sm leading-relaxed" style={{ color: TEXT_MID }}>We'll use these to confirm your booking.</p>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <FloatInput label="Full Name" value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="John Doe" />
                  <FloatInput label="Email Address" type="email" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} placeholder="john@example.com" />
                  <FloatInput label="Phone Number" type="tel" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} placeholder="+94 77 123 4567" />
                </div>

                {/* privacy note */}
                <div className="mt-5 sm:mt-6 flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: 'rgba(197,160,89,0.05)', border: `1px solid rgba(197,160,89,0.12)` }}>
                  <Shield className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
                  <p className="text-[10px] leading-relaxed" style={{ color: TEXT_MID }}>
                    Your information is encrypted and never shared with third parties. We use it only to confirm your appointment.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── STEP 4: Payment ── */}
            {step === 4 && (
              <motion.div key="step4"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-lg"
              >
                <div className="mb-6 sm:mb-8">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.45em] mb-2 sm:mb-3" style={{ color: GOLD }}>Step 4 of 4</p>
                  <h2 className="font-serif text-2xl sm:text-4xl font-bold mb-2" style={{ color: TEXT }}>Confirm & Pay</h2>
                  <p className="text-sm leading-relaxed" style={{ color: TEXT_MID }}>Review your booking and complete payment.</p>
                </div>

                {/* receipt card with perforated divider */}
                <div className="rounded-3xl overflow-hidden mb-6"
                  style={{ border: `1px solid ${BORDER}`, boxShadow: `0 20px 60px rgba(0,0,0,0.30)` }}>

                  {/* gold accent bar */}
                  <div className="h-1" style={{ background: `linear-gradient(90deg,${GOLD_DIM},${GOLD},${GOLD_LIGHT},${GOLD},${GOLD_DIM})` }} />

                  <div className="px-6 pt-5 pb-5" style={{ background: BG2 }}>
                    {/* service image mini strip */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={selectedService?.imageUrl || 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=200'} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="" />
                      </div>
                      <div>
                        <p className="font-serif font-bold text-base" style={{ color: TEXT }}>{selectedService?.name}</p>
                        <p className="text-[9px] uppercase tracking-widest mt-0.5 font-bold" style={{ color: TEXT_MID }}>
                          {selectedService?.category}
                          {selectedService?.duration && ` · ${selectedService.duration} min`}
                        </p>
                      </div>
                    </div>

                    {[
                      { label: 'Date',  value: format(formData.date, 'EEEE, MMMM dd yyyy') },
                      { label: 'Time',  value: formData.timeSlot },
                      { label: 'Client', value: formData.name },
                    ].map(({ label, value }, i, arr) => (
                      <div key={label} className="flex justify-between items-center py-2.5"
                        style={{ borderBottom: i < arr.length - 1 ? `1px solid rgba(0,0,0,0.06)` : 'none' }}>
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: TEXT_MID }}>{label}</span>
                        <span className="text-xs font-bold" style={{ color: TEXT }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* perforated divider */}
                  <div className="relative flex items-center" style={{ background: BG2 }}>
                    <div className="w-5 h-5 rounded-full absolute -left-2.5" style={{ background: BG }} />
                    <div className="flex-1 border-t-2 border-dashed mx-5" style={{ borderColor: 'rgba(197,160,89,0.15)' }} />
                    <div className="w-5 h-5 rounded-full absolute -right-2.5" style={{ background: BG }} />
                  </div>

                  <div className="px-6 pt-4 pb-5 flex items-center justify-between" style={{ background: BG2 }}>
                    <span className="text-xs font-black uppercase tracking-[0.35em]" style={{ color: TEXT_MID }}>Total</span>
                    <motion.span
                      className="text-3xl font-black"
                      style={{ color: GOLD_LIGHT }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    >
                      LKR {Number(selectedService?.price || 0).toLocaleString()}
                    </motion.span>
                  </div>
                </div>

                {/* payment method selector */}
                <div className="mb-6">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-3" style={{ color: TEXT_MID }}>Payment Method</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(['payhere', 'genie'] as const).map((method) => (
                      <motion.button
                        key={method}
                        onClick={() => setPayMethod(method)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="py-4 px-4 rounded-2xl transition-all duration-200 text-left"
                        style={{
                          background: payMethod === method ? 'rgba(197,160,89,0.10)' : 'rgba(0,0,0,0.02)',
                          border: `1.5px solid ${payMethod === method ? GOLD : BORDER}`,
                          boxShadow: payMethod === method ? `0 4px 20px rgba(197,160,89,0.15)` : 'none',
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                            style={{ borderColor: payMethod === method ? GOLD : 'rgba(0,0,0,0.15)' }}>
                            {payMethod === method && (
                              <div className="w-2.5 h-2.5 rounded-full" style={{ background: GOLD }} />
                            )}
                          </div>
                          <CreditCard className="h-4 w-4" style={{ color: payMethod === method ? GOLD : TEXT_MID }} />
                        </div>
                        <p className="text-xs font-black uppercase tracking-wider" style={{ color: payMethod === method ? GOLD_LIGHT : TEXT_MID }}>
                          {method === 'payhere' ? 'PayHere' : 'Genie'}
                        </p>
                        <p className="text-[9px] mt-0.5" style={{ color: TEXT_MID }}>
                          {method === 'payhere' ? 'Cards & Bank Transfer' : 'Dialog Genie Wallet'}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* security note */}
                <div className="flex items-center gap-2 text-[9px]" style={{ color: TEXT_MID }}>
                  <Shield className="h-3.5 w-3.5 flex-shrink-0" style={{ color: GOLD }} />
                  256-bit SSL encrypted · Powered by PayHere Sri Lanka
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Navigation bar ── */}
        <div className="sticky bottom-0 px-4 sm:px-6 lg:px-14 xl:px-20 py-4 sm:py-5"
          style={{
            background: `linear-gradient(to top,${BG} 60%,transparent 100%)`,
            borderTop: `1px solid ${BORDER}`,
          }}>
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 max-w-2xl">
            {step > 1 ? (
              <motion.button
                onClick={prevStep}
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 text-sm font-bold transition-all rounded-full py-3 sm:py-0"
                style={{ color: TEXT_MID }}
                onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
                onMouseLeave={e => (e.currentTarget.style.color = TEXT_MID)}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </motion.button>
            ) : <div />}

            <motion.button
              onClick={step === 4 ? handleBooking : handleContinue}
              disabled={!canNext() || paying}
              whileHover={canNext() ? { scale: 1.03 } : {}}
              whileTap={canNext() ? { scale: 0.97 } : {}}
              className="relative overflow-hidden flex items-center justify-center gap-2.5 px-8 sm:px-10 py-4 rounded-full text-sm font-black tracking-wider uppercase text-white transition-all w-full sm:w-auto"
              style={{
                background: canNext()
                  ? `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`
                  : 'rgba(0,0,0,0.08)',
                boxShadow: canNext() ? `0 10px 32px rgba(197,160,89,0.42)` : 'none',
                color: canNext() ? '#fff' : TEXT_MID,
                cursor: canNext() ? 'pointer' : 'not-allowed',
              }}
            >
              {paying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin relative z-10" />
                  <span className="relative z-10">Processing…</span>
                </>
              ) : (
                <>
                  <span className="relative z-10">{step === 4 ? 'Pay & Confirm' : 'Continue'}</span>
                  {step < 4 && <ArrowRight className="relative z-10 h-4 w-4" />}
                  {/* shimmer */}
                  {canNext() && (
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: '-110%' }}
                      animate={{ x: '110%' }}
                      transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.5 }}
                    />
                  )}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;