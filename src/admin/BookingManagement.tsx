import React, { useEffect, useState } from 'react';
import { Search, Filter, Check, X, Eye, Loader2 } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { api } from '../services/api';

const BookingManagement = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await api.getBookings();
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(b => 
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-[#C5A059] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tighter">Bookings</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage and track all salon appointments.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search by customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900/50 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-white focus:border-[#C5A059] outline-none transition-all"
          />
        </div>
        <div className="flex gap-4">
          <select className="bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] outline-none transition-all">
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input 
            type="date" 
            className="bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] outline-none transition-all"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-b border-white/5">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-zinc-400">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                  <td className="px-6 py-4 font-bold text-white">{booking.customerName}</td>
                  <td className="px-6 py-4">{booking.serviceName}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span>{booking.date}</span>
                      <span className="text-xs text-zinc-500">{booking.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-xs font-bold",
                      booking.paymentStatus === 'Paid' ? "text-[#C5A059]" : "text-zinc-500"
                    )}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      booking.status === 'Confirmed' ? "bg-[#C5A059]/10 text-[#C5A059]" :
                      booking.status === 'Pending' ? "bg-yellow-500/10 text-yellow-500" :
                      "bg-red-500/10 text-red-500"
                    )}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="p-2 hover:bg-[#C5A059]/10 hover:text-[#C5A059] rounded-lg transition-all">
                        <Check className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all">
                        <X className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-zinc-800 text-zinc-400 rounded-lg transition-all">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;
