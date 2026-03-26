import React, { useEffect, useState } from 'react';
import { cn } from '@/src/utils/cn';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import {
  Calendar,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Loader2,
  MessageSquare,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BarChart3,
} from 'lucide-react';

const GOLD = '#C5A059';
const GOLD_LIGHT = '#E8C97A';

const DashboardOverview = () => {
  const { user } = useAuth();
  const [data, setData] = useState<{ bookings: any[]; messages: any[]; reviews: any[]; services: any[] }>({
    bookings: [],
    messages: [],
    reviews: [],
    services: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookings, messages, reviews, services] = await Promise.all([
          api.getBookings(),
          api.getMessages(),
          api.getReviews(),
          api.getServices(),
        ]);
        setData({ bookings, messages, reviews, services });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = data.bookings
    .filter((b) => b.paymentStatus === 'Paid')
    .reduce((sum, b) => sum + b.amount, 0);

  const pendingBookings = data.bookings.filter((b) => b.status === 'Pending');
  const confirmedBookings = data.bookings.filter((b) => b.status === 'Confirmed');
  const unreadMessages = data.messages.filter((m) => m.status === 'Unread');
  const avgRating = data.reviews.length
    ? (data.reviews.reduce((sum, r) => sum + r.rating, 0) / data.reviews.length).toFixed(1)
    : '0.0';

  const stats = [
    {
      name: 'Total Revenue',
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.08)',
      border: 'rgba(16, 185, 129, 0.15)',
    },
    {
      name: 'Bookings',
      value: data.bookings.length.toString(),
      icon: Calendar,
      color: GOLD,
      bg: 'rgba(197, 160, 89, 0.08)',
      border: 'rgba(197, 160, 89, 0.15)',
    },
    {
      name: 'Unread Messages',
      value: unreadMessages.length.toString(),
      icon: MessageSquare,
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.08)',
      border: 'rgba(59, 130, 246, 0.15)',
    },
    {
      name: 'Avg. Rating',
      value: avgRating,
      icon: Star,
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.08)',
      border: 'rgba(245, 158, 11, 0.15)',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin" style={{ color: GOLD }} />
          <p className="text-zinc-500 text-sm font-medium tracking-wide">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4" style={{ color: GOLD }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: GOLD }}>
              JK Salon Dashboard
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tighter">
            {greeting()},{' '}
            <span style={{ color: GOLD }}>{user?.displayName || 'Admin'}</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1.5">Here's an overview of your salon today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="group relative p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-default"
            style={{
              background: stat.bg,
              borderColor: stat.border,
            }}
          >
            <div className="flex justify-between items-start mb-5">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: stat.bg, border: `1px solid ${stat.border}` }}
              >
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <ArrowUpRight
                className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: stat.color }}
              />
            </div>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">{stat.name}</p>
            <p className="text-2xl font-bold text-white mt-1 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4" style={{ color: GOLD }} />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Bookings</h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              {data.bookings.length} total
            </span>
          </div>

          {data.bookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm">No bookings yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 border-b border-white/5">
                    <th className="px-5 py-3.5">Customer</th>
                    <th className="px-5 py-3.5">Service</th>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {data.bookings.slice(0, 6).map((booking, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` }}
                          >
                            {booking.customerName?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-white text-sm">{booking.customerName}</p>
                            <p className="text-[11px] text-zinc-600">{booking.customerEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-zinc-400">{booking.serviceName}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-zinc-400">
                          <Clock className="h-3.5 w-3.5 text-zinc-600" />
                          <span>{booking.date}</span>
                          {booking.time && <span className="text-zinc-600">• {booking.time}</span>}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                            booking.status === 'Confirmed'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : booking.status === 'Pending'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-red-500/10 text-red-400'
                          )}
                        >
                          {booking.status === 'Confirmed' ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <AlertCircle className="h-3 w-3" />
                          )}
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-white">
                        Rs. {booking.amount?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Quick Stats Card */}
          <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <BarChart3 className="h-4 w-4" style={{ color: GOLD }} />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Stats</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-sm">Confirmed</span>
                <span className="font-bold text-emerald-400 text-sm">{confirmedBookings.length}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${data.bookings.length ? (confirmedBookings.length / data.bookings.length) * 100 : 0}%`,
                    background: 'linear-gradient(90deg, #10B981, #34D399)',
                  }}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-sm">Pending</span>
                <span className="font-bold text-amber-400 text-sm">{pendingBookings.length}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${data.bookings.length ? (pendingBookings.length / data.bookings.length) * 100 : 0}%`,
                    background: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
                  }}
                />
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <span className="text-zinc-500 text-sm">Active Services</span>
                <span className="font-bold text-white text-sm">
                  {data.services.filter((s) => s.status === 'Active').length}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-sm">Total Reviews</span>
                <span className="font-bold text-white text-sm">{data.reviews.length}</span>
              </div>
            </div>
          </div>

          {/* Recent Messages Card */}
          <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <MessageSquare className="h-4 w-4" style={{ color: GOLD }} />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Messages</h3>
            </div>

            {data.messages.length === 0 ? (
              <p className="text-zinc-600 text-sm text-center py-4">No messages yet</p>
            ) : (
              <div className="space-y-3">
                {data.messages.slice(0, 4).map((msg, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-zinc-800/40 border border-white/[0.03] hover:border-white/[0.08] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-white text-sm font-semibold truncate max-w-[140px]">{msg.name}</p>
                      {msg.status === 'Unread' && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed">
                      {msg.subject || msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
