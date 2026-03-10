import React, { useEffect, useState } from 'react';
import { cn } from '@/src/utils/cn';
import { api } from '../services/api';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';

const DashboardOverview = () => {
  const [data, setData] = useState<{ bookings: any[], messages: any[], reviews: any[] }>({
    bookings: [],
    messages: [],
    reviews: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookings, messages, reviews] = await Promise.all([
          api.getBookings(),
          api.getMessages(),
          api.getReviews()
        ]);
        setData({ bookings, messages, reviews });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = data.bookings
    .filter(b => b.paymentStatus === 'Paid')
    .reduce((sum, b) => sum + b.amount, 0);

  const stats = [
    { name: 'Total Bookings', value: data.bookings.length.toString(), change: '+12%', trend: 'up', icon: Calendar },
    { name: 'Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, change: '+8%', trend: 'up', icon: DollarSign },
    { name: 'New Messages', value: data.messages.filter(m => m.status === 'Unread').length.toString(), change: '+2', trend: 'up', icon: Users },
    { name: 'Pending Reviews', value: data.reviews.filter(r => r.status === 'pending').length.toString(), change: '0%', trend: 'neutral', icon: TrendingUp },
  ];

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
          <h1 className="text-3xl font-bold text-white tracking-tighter">Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-lg border border-white/5 hover:bg-zinc-800 transition-all">
            Export Report
          </button>
          <button className="px-4 py-2 bg-[#C5A059] text-white text-xs font-bold rounded-lg hover:bg-[#B48F48] transition-all">
            New Booking
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-[#C5A059]" />
              </div>
              <div className={cn(
                "flex items-center text-xs font-bold",
                stat.trend === 'up' ? "text-[#C5A059]" : "text-red-500"
              )}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3 ml-1" /> : <ArrowDownRight className="h-3 w-3 ml-1" />}
              </div>
            </div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{stat.name}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Recent Bookings</h3>
          <button className="text-[#C5A059] text-xs font-bold hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-b border-white/5">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm text-zinc-400">
              {data.bookings.slice(0, 5).map((booking, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-all">
                  <td className="px-6 py-4 font-bold text-white">{booking.customerName}</td>
                  <td className="px-6 py-4">{booking.serviceName}</td>
                  <td className="px-6 py-4">{booking.date}</td>
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
                  <td className="px-6 py-4 font-bold text-white">Rs. {booking.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
