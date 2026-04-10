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
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BarChart3,
  Scissors,
  MessageSquare,
  XCircle,
  ClipboardCheck,
  ShieldAlert,
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

  const normalizeStatus = (status?: string) => (status || '').trim().toLowerCase();
  const normalizePaymentStatus = (status?: string) => (status || '').trim().toLowerCase();
  const isSameDay = (value?: string) => {
    if (!value) return false;
    const d = new Date(value);
    const today = new Date();
    if (Number.isNaN(d.getTime())) return false;
    return d.toDateString() === today.toDateString();
  };
  const getBookingDateTime = (booking: any) => {
    const datePart = booking?.date ? new Date(booking.date) : null;
    if (!datePart || Number.isNaN(datePart.getTime())) return null;
    const timeRaw = booking?.time || booking?.timeSlot;
    if (!timeRaw) return datePart;
    const timeMatch = String(timeRaw).match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!timeMatch) return datePart;

    let hours = Number(timeMatch[1]);
    const minutes = Number(timeMatch[2]);
    const period = timeMatch[3]?.toUpperCase();
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const merged = new Date(datePart);
    merged.setHours(hours, minutes, 0, 0);
    return merged;
  };

  const totalRevenue = data.bookings
    .filter((b) => normalizePaymentStatus(b.paymentStatus) === 'paid')
    .reduce((sum, b) => sum + b.amount, 0);

  const pendingBookings = data.bookings.filter((b) => normalizeStatus(b.status) === 'pending');
  const confirmedBookings = data.bookings.filter((b) => normalizeStatus(b.status) === 'confirmed');
  const completedBookings = data.bookings.filter((b) => normalizeStatus(b.status) === 'completed');
  const cancelledBookings = data.bookings.filter((b) => normalizeStatus(b.status) === 'cancelled');
  const unreadMessages = data.messages.filter((m) => normalizeStatus(m.status) === 'unread');
  const avgRating = data.reviews.length
    ? (data.reviews.reduce((sum, r) => sum + r.rating, 0) / data.reviews.length).toFixed(1)
    : '0.0';

  const activeServices = data.services.filter((s) => normalizeStatus(s.status) === 'active').length;
  const todayBookings = data.bookings.filter((b) => isSameDay(b.date));
  const todayRevenue = todayBookings
    .filter((b) => normalizePaymentStatus(b.paymentStatus) === 'paid')
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);
  const todayPending = todayBookings.filter((b) => normalizeStatus(b.status) === 'pending').length;
  const completionRate = data.bookings.length
    ? Math.round((completedBookings.length / data.bookings.length) * 100)
    : 0;
  const cancellationRate = data.bookings.length
    ? Math.round((cancelledBookings.length / data.bookings.length) * 100)
    : 0;
  const confirmationRate = data.bookings.length
    ? Math.round((confirmedBookings.length / data.bookings.length) * 100)
    : 0;

  const upcomingQueue = data.bookings
    .filter((b) => ['pending', 'confirmed'].includes(normalizeStatus(b.status)))
    .map((b) => ({ ...b, bookingAt: getBookingDateTime(b) }))
    .filter((b) => b.bookingAt && b.bookingAt.getTime() >= Date.now())
    .sort((a, b) => (a.bookingAt?.getTime() || 0) - (b.bookingAt?.getTime() || 0))
    .slice(0, 5);

  const serviceDemandMap = data.bookings.reduce((acc: Record<string, number>, booking) => {
    const key = booking.serviceName || 'Unknown Service';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const topService = (Object.entries(serviceDemandMap) as Array<[string, number]>).sort((a, b) => b[1] - a[1])[0];

  const stats = [
    {
      name: 'Today Revenue',
      value: `Rs. ${todayRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: '#16A34A',
      bg: 'rgba(22, 163, 74, 0.1)',
      border: 'rgba(22, 163, 74, 0.2)',
    },
    {
      name: 'Today Bookings',
      value: todayBookings.length.toString(),
      icon: Calendar,
      color: GOLD,
      bg: 'rgba(197, 160, 89, 0.08)',
      border: 'rgba(197, 160, 89, 0.15)',
    },
    {
      name: 'Pending Action',
      value: pendingBookings.length.toString(),
      icon: ShieldAlert,
      color: '#F97316',
      bg: 'rgba(249, 115, 22, 0.1)',
      border: 'rgba(249, 115, 22, 0.25)',
    },
    {
      name: 'Completed Jobs',
      value: completedBookings.length.toString(),
      icon: ClipboardCheck,
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.1)',
      border: 'rgba(59, 130, 246, 0.2)',
    },
    {
      name: 'Cancelled',
      value: cancelledBookings.length.toString(),
      icon: XCircle,
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.2)',
    },
    {
      name: 'Total Revenue',
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.08)',
      border: 'rgba(16, 185, 129, 0.15)',
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
    <div className="space-y-5 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-3 md:gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" style={{ color: GOLD }} />
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: GOLD }}>
              JK Salon Dashboard
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tighter">
            {greeting()},{' '}
            <span style={{ color: GOLD }}>{user?.displayName || 'Admin'}</span>
          </h1>
          <p className="text-zinc-500 text-xs md:text-sm mt-1 md:mt-1.5">Here's an overview of your salon today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 lg:gap-5">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="group relative p-4 md:p-5 lg:p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-default"
            style={{
              background: stat.bg,
              borderColor: stat.border,
            }}
          >
            <div className="flex justify-between items-start mb-3 md:mb-5">
              <div
                className="w-10 md:w-11 h-10 md:h-11 rounded-xl flex items-center justify-center"
                style={{ background: stat.bg, border: `1px solid ${stat.border}` }}
              >
                <stat.icon className="h-4 md:h-5 w-4 md:w-5" style={{ color: stat.color }} />
              </div>
              <ArrowUpRight
                className="h-3 md:h-4 w-3 md:w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: stat.color }}
              />
            </div>
            <p className="text-zinc-500 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]">{stat.name}</p>
            <p className="text-xl md:text-2xl font-bold text-white mt-1 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Operational Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-5">
        <div className="lg:col-span-3 bg-zinc-900/40 border border-white/5 rounded-2xl p-4 md:p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-3.5 md:h-4 w-3.5 md:w-4" style={{ color: GOLD }} />
            <h3 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">Business Health</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-500 text-xs">Confirmation Rate</span>
                <span className="text-emerald-400 text-xs font-bold">{confirmationRate}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${confirmationRate}%`, background: 'linear-gradient(90deg, #10B981, #34D399)' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-500 text-xs">Completion Rate</span>
                <span className="text-blue-400 text-xs font-bold">{completionRate}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${completionRate}%`, background: 'linear-gradient(90deg, #3B82F6, #60A5FA)' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-500 text-xs">Cancellation Rate</span>
                <span className="text-red-400 text-xs font-bold">{cancellationRate}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${cancellationRate}%`, background: 'linear-gradient(90deg, #EF4444, #F87171)' }} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/5">
            <div>
              <p className="text-zinc-500 text-[11px]">Today Pending</p>
              <p className="text-white font-bold text-base">{todayPending}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-[11px]">Unread Messages</p>
              <p className="text-white font-bold text-base">{unreadMessages.length}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-[11px]">Active Services</p>
              <p className="text-white font-bold text-base">{activeServices}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-[11px]">Top Service</p>
              <p className="text-white font-bold text-sm truncate">{topService ? `${topService[0]} (${topService[1]})` : 'No data'}</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 md:p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-3.5 md:h-4 w-3.5 md:w-4 text-amber-400" />
            <h3 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">Action Queue</h3>
          </div>
          {upcomingQueue.length === 0 ? (
            <p className="text-zinc-500 text-xs">No upcoming pending or confirmed bookings.</p>
          ) : (
            <div className="space-y-2.5">
              {upcomingQueue.map((booking, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-zinc-800/40 border border-white/[0.03]">
                  <p className="text-white text-xs font-semibold truncate">{booking.customerName}</p>
                  <p className="text-zinc-400 text-[11px] truncate">{booking.serviceName}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-zinc-500 text-[10px]">{booking.date} {booking.time || booking.timeSlot || ''}</span>
                    <span
                      className={cn(
                        'text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border',
                        normalizeStatus(booking.status) === 'pending'
                          ? 'bg-amber-500/85 text-white border-amber-200/95'
                          : 'bg-emerald-500/85 text-white border-emerald-300/95'
                      )}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Bookings */}
        <div className="md:col-span-2 bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-3 md:p-5 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 md:h-4 w-3.5 md:w-4" style={{ color: GOLD }} />
              <h3 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">Recent Bookings</h3>
            </div>
            <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-600">
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
                  <tr className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 border-b border-white/5">
                    <th className="px-2 md:px-5 py-2.5 md:py-3.5">Customer</th>
                    <th className="px-2 md:px-5 py-2.5 md:py-3.5 hidden sm:table-cell">Service</th>
                    <th className="px-2 md:px-5 py-2.5 md:py-3.5 hidden md:table-cell">Date</th>
                    <th className="px-2 md:px-5 py-2.5 md:py-3.5">Status</th>
                    <th className="px-2 md:px-5 py-2.5 md:py-3.5 text-right hidden sm:table-cell">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-xs md:text-sm">
                  {data.bookings.slice(0, 6).map((booking, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-2 md:px-5 py-2 md:py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 md:w-8 h-7 md:h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` }}
                          >
                            {booking.customerName?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-white text-xs md:text-sm truncate">{booking.customerName}</p>
                            <p className="text-[9px] md:text-[11px] text-zinc-600 truncate">{booking.customerEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 md:px-5 py-2 md:py-4 text-zinc-400 hidden sm:table-cell text-xs md:text-sm">{booking.serviceName}</td>
                      <td className="px-2 md:px-5 py-2 md:py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1 text-zinc-400 text-xs md:text-sm">
                          <Clock className="h-3 w-3 text-zinc-600" />
                          <span>{booking.date}</span>
                          {booking.time && <span className="text-zinc-600 hidden lg:inline">• {booking.time}</span>}
                        </div>
                      </td>
                      <td className="px-2 md:px-5 py-2 md:py-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2 md:px-2.5 py-1 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap border shadow-sm',
                            normalizeStatus(booking.status) === 'confirmed'
                              ? 'bg-emerald-500/85 text-white border-emerald-300/95'
                              : normalizeStatus(booking.status) === 'pending'
                              ? 'bg-amber-500/85 text-white border-amber-200/95'
                              : normalizeStatus(booking.status) === 'completed'
                              ? 'bg-blue-500/85 text-white border-blue-200/95'
                              : 'bg-red-500/85 text-white border-red-200/95'
                          )}
                        >
                          {normalizeStatus(booking.status) === 'confirmed' ? (
                            <CheckCircle2 className="h-2.5 md:h-3 w-2.5 md:w-3" />
                          ) : (
                            <AlertCircle className="h-2.5 md:h-3 w-2.5 md:w-3" />
                          )}
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-2 md:px-5 py-2 md:py-4 text-right font-bold text-white hidden sm:table-cell text-xs md:text-sm">
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
        <div className="space-y-4 md:space-y-6">
          {/* Quick Stats Card */}
          <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-4 md:mb-5">
              <BarChart3 className="h-3.5 md:h-4 w-3.5 md:w-4" style={{ color: GOLD }} />
              <h3 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">Quick Stats</h3>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-xs md:text-sm">Confirmed</span>
                <span className="font-bold text-emerald-400 text-xs md:text-sm">{confirmedBookings.length}</span>
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

              <div className="flex justify-between items-center pt-2 md:pt-3 border-t border-white/5">
                <span className="text-zinc-500 text-xs md:text-sm">Pending</span>
                <span className="font-bold text-amber-400 text-xs md:text-sm">{pendingBookings.length}</span>
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

              <div className="flex justify-between items-center pt-2 md:pt-3 border-t border-white/5">
                <span className="text-zinc-500 text-xs md:text-sm">Completed</span>
                <span className="font-bold text-blue-400 text-xs md:text-sm">{completedBookings.length}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-xs md:text-sm">Cancelled</span>
                <span className="font-bold text-red-400 text-xs md:text-sm">{cancelledBookings.length}</span>
              </div>

              <div className="flex justify-between items-center pt-2 md:pt-3 border-t border-white/5">
                <span className="text-zinc-500 text-xs md:text-sm">Active Services</span>
                <span className="font-bold text-white text-xs md:text-sm">
                  {activeServices}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-xs md:text-sm">Total Reviews</span>
                <span className="font-bold text-white text-xs md:text-sm">{data.reviews.length}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-xs md:text-sm">Avg Rating</span>
                <span className="font-bold text-white text-xs md:text-sm">{avgRating}</span>
              </div>
            </div>
          </div>

          {/* Recent Messages Card */}
          <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-4 md:mb-5">
              <MessageSquare className="h-3.5 md:h-4 w-3.5 md:w-4" style={{ color: GOLD }} />
              <h3 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">Recent Messages</h3>
            </div>

            {data.messages.length === 0 ? (
              <p className="text-zinc-600 text-xs md:text-sm text-center py-4">No messages yet</p>
            ) : (
              <div className="space-y-2 md:space-y-3">
                {data.messages.slice(0, 4).map((msg, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 md:p-3 rounded-xl bg-zinc-800/40 border border-white/[0.03] hover:border-white/[0.08] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white text-xs md:text-sm font-semibold truncate max-w-[120px] md:max-w-[140px]">{msg.name}</p>
                      {msg.status === 'Unread' && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-zinc-500 text-[11px] md:text-xs line-clamp-2 leading-relaxed">
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
