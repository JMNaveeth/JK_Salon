import React, { useEffect, useState } from 'react';
import { Search, Check, X, Eye, Loader2, Trash2, Calendar as CalIcon, Clock, Phone, Mail, User, CreditCard, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';
import { cn } from '@/src/utils/cn';
import { api } from '../services/api';

const GOLD = '#C5A059';
const GOLD_LIGHT = '#E8C97A';

const resolveSCode = (booking: any) => {
  if (booking?.sCode && String(booking.sCode).trim()) return String(booking.sCode).trim().toUpperCase();
  if (booking?.id && String(booking.id).trim()) return `S-${String(booking.id).trim().toUpperCase()}`;
  return 'N/A';
};

const BookingManagement = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  
  const [viewBooking, setViewBooking] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBookings = async () => {
    try {
      const data = await api.getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      showToast('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    const source = new EventSource('/api/bookings/stream');
    source.onmessage = (event) => {
      if (event.data === 'updated') fetchBookings();
    };
    source.onerror = () => {
      source.close();
    };
    return () => source.close();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.updateBookingStatus(id, newStatus);
      showToast(`Booking marked as ${newStatus}`);
      fetchBookings();
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteBooking(id);
      showToast('Booking deleted permanently');
      setDeleteId(null);
      setViewBooking(null);
      fetchBookings();
    } catch (error) {
      showToast('Failed to delete booking', 'error');
    }
  };

  // Advanced Filtering
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'All' && b.date) {
      const bDate = parseISO(b.date);
      if (dateFilter === 'Today') matchesDate = isToday(bDate);
      if (dateFilter === 'Tomorrow') matchesDate = isTomorrow(bDate);
      if (dateFilter === 'Past') matchesDate = isPast(bDate) && !isToday(bDate);
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-500/85 text-white border-emerald-300/95 font-semibold';
      case 'Pending': return 'bg-amber-500/85 text-white border-amber-200/95 font-semibold';
      case 'Cancelled': return 'bg-red-500/85 text-white border-red-200/95 font-semibold';
      case 'Completed': return 'bg-blue-500/85 text-white border-blue-200/95 font-semibold';
      default: return 'bg-zinc-700/85 text-white border-zinc-300/80 font-semibold';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin" style={{ color: GOLD }} />
        <p className="text-zinc-500 text-sm font-medium tracking-wide">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Toast Notification */}
      {toast && (
        <div className={cn(
          "fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold shadow-2xl border animate-in slide-in-from-right",
          toast.type === 'success' ? "bg-emerald-500/85 text-white border-emerald-300/95" : "bg-red-500/85 text-white border-red-200/95"
        )}>
          {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tighter mb-2">Booking Management</h1>
        <p className="text-zinc-500 text-sm">You have {bookings.filter(b => b.status === 'Pending').length} pending bookings awaiting action.</p>
      </div>

      {/* Filters & Control Panel */}
      <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search by name, email, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-[#C5A059]/50 outline-none transition-all placeholder:text-zinc-600"
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#C5A059]/50 outline-none transition-all min-w-[140px]"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#C5A059]/50 outline-none transition-all min-w-[140px]"
          >
            <option value="All">All Dates</option>
            <option value="Today">Today</option>
            <option value="Tomorrow">Tomorrow</option>
            <option value="Past">Past Bookings</option>
          </select>
        </div>
      </div>

      {/* Bookings List / Table */}
      <div className="bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-16 text-center">
            <CalIcon className="h-10 w-10 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 text-sm">No bookings found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto flex flex-col">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-b border-white/5 bg-black/20">
                  <th className="px-6 py-4 whitespace-nowrap">Customer</th>
                  <th className="px-6 py-4 whitespace-nowrap">Service Details</th>
                  <th className="px-6 py-4 whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    {/* Customer Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-white text-xs"
                             style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` }}>
                          {booking.customerName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white">{booking.customerName}</p>
                          <p className="text-[11px] text-zinc-500">{booking.customerPhone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Service & Time */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-zinc-200">{booking.serviceName}</p>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-1">
                        <span className="flex items-center gap-1"><CalIcon className="w-3 h-3" />{booking.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{booking.time}</span>
                      </div>
                    </td>

                    {/* Statuses */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border", getStatusColor(booking.status))}>
                          {booking.status}
                        </span>
                        {resolveSCode(booking) !== 'N/A' && (
                          <span className="text-[10px] font-black uppercase tracking-widest text-white bg-[#C5A059]/85 border border-[#f5deb1] px-2.5 py-1 rounded-full shadow-sm">
                            {resolveSCode(booking)}
                          </span>
                        )}
                        {booking.paymentStatus === 'Paid' && (
                          <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Paid
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Quick Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1 opacity-100 transition-opacity">
                        {booking.status === 'Pending' && (
                          <button onClick={() => updateStatus(booking.id, 'Confirmed')} className="p-2 rounded-lg bg-emerald-500/85 hover:bg-emerald-500 text-white border border-emerald-300/95 transition-colors shadow-sm" title="Confirm Booking">
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        {booking.status === 'Confirmed' && (
                          <button onClick={() => updateStatus(booking.id, 'Completed')} className="p-2 rounded-lg bg-blue-500/85 hover:bg-blue-500 text-white border border-blue-200/95 transition-colors shadow-sm" title="Mark Completed">
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                        {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                          <button onClick={() => updateStatus(booking.id, 'Cancelled')} className="p-2 rounded-lg bg-amber-500/85 hover:bg-amber-500 text-white border border-amber-200/95 transition-colors shadow-sm" title="Cancel Booking">
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={() => setViewBooking(booking)} className="p-2 rounded-lg bg-[#C5A059]/85 hover:bg-[#C5A059] text-white transition-colors ml-2 border border-[#f5deb1] shadow-sm" title="View Full Details">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          VIEW BOOKING MODAL
      ═══════════════════════════════════════════════════════════ */}
      {viewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setViewBooking(null)} />
          <div className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 bg-zinc-800">
                  <CalIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">Booking Details</h2>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">ID: {viewBooking.id}</p>
                </div>
              </div>
              <button onClick={() => setViewBooking(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Status Banner */}
              <div className={cn("p-4 rounded-2xl border flex items-center justify-between", getStatusColor(viewBooking.status))}>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-0.5">Current Status</p>
                  <p className="text-lg font-bold">{viewBooking.status}</p>
                </div>
                {viewBooking.paymentStatus === 'Paid' && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/20 rounded-full">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Paid Offline/Online</span>
                  </div>
                )}
              </div>

              {/* Booking Code */}
              <div>
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <CreditCard className="h-3 w-3" /> Booking Code
                </h3>
                <div className="bg-[#C5A059]/20 border border-[#C5A059]/50 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm">
                  <div>
                    <p className="text-xs text-zinc-400 mb-1 font-semibold">Customer S-code</p>
                    <p className="text-2xl font-black tracking-[0.25em] text-[#C5A059] font-mono" style={{ letterSpacing: '0.15em' }}>{resolveSCode(viewBooking)}</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-[#C5A059]/85 border border-[#f5deb1] text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                    Verify at check-in
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <User className="h-3 w-3" /> Customer Information
                </h3>
                <div className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-4">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Full Name</p>
                    <p className="text-sm font-bold text-white">{viewBooking.customerName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><Phone className="h-3 w-3"/> Phone</p>
                      <p className="text-sm text-zinc-300">{viewBooking.customerPhone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><Mail className="h-3 w-3"/> Email</p>
                      <p className="text-sm text-zinc-300 truncate" title={viewBooking.customerEmail}>{viewBooking.customerEmail || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Info */}
              <div>
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <Clock className="h-3 w-3" /> Appointment Details
                </h3>
                <div className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Service Requested</p>
                      <p className="text-sm font-bold text-white">{viewBooking.serviceName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-500 mb-1">Amount</p>
                      <p className="text-sm font-bold" style={{ color: GOLD }}>Rs. {Number(viewBooking.amount).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Date</p>
                      <p className="text-sm text-zinc-300">{viewBooking.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Time</p>
                      <p className="text-sm text-zinc-300">{viewBooking.time}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="p-6 border-t border-white/5 bg-zinc-950 flex flex-wrap gap-3">
               {viewBooking.status === 'Pending' && (
                 <button onClick={() => { updateStatus(viewBooking.id, 'Confirmed'); setViewBooking(null); }} className="flex-1 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-sm border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
                   Confirm Appointment
                 </button>
               )}
               {viewBooking.status === 'Confirmed' && (
                 <button onClick={() => { updateStatus(viewBooking.id, 'Completed'); setViewBooking(null); }} className="flex-1 py-3 rounded-xl bg-blue-500/20 text-blue-400 font-bold text-sm border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
                   Mark as Completed
                 </button>
               )}
               {(viewBooking.status === 'Pending' || viewBooking.status === 'Confirmed') && (
                 <button onClick={() => { updateStatus(viewBooking.id, 'Cancelled'); setViewBooking(null); }} className="flex-1 py-3 rounded-xl bg-amber-500/10 text-amber-500 font-bold text-sm border border-amber-500/20 hover:bg-amber-500/20 transition-colors">
                   Cancel Appointment
                 </button>
               )}
               <button onClick={() => setDeleteId(viewBooking.id)} className="p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors" title="Delete Permanently">
                 <Trash2 className="h-5 w-5" />
               </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
      ═══════════════════════════════════════════════════════════ */}
      {deleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
              <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Booking?</h3>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
              This action cannot be undone. This will permanently remove the booking record.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-zinc-800 hover:bg-zinc-700 transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-red-600 border border-red-500 hover:bg-red-700 transition-colors shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;

