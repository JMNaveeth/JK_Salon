import React, { useEffect, useState } from 'react';
import { Star, Check, Trash2, Loader2, MessageSquare, CheckCircle2, Clock3, Sparkles } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { api } from '../services/api';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const totalReviews = reviews.length;
  const approvedReviews = reviews.filter((review) => Boolean(review.approved)).length;
  const pendingReviews = totalReviews - approvedReviews;
  const averageRating = totalReviews
    ? (reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / totalReviews).toFixed(1)
    : '0.0';

  const formatReviewDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const fetchReviews = async () => {
    try {
      const data = await api.getReviews();
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();

    const source = new EventSource('/api/reviews/stream');
    source.onmessage = (event) => {
      if (event.data === 'updated') {
        fetchReviews();
      }
    };

    return () => source.close();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.approveReview(id);
      setReviews((current) => current.map((review) => (review.id === id ? { ...review, approved: true } : review)));
    } catch (error) {
      console.error('Failed to approve review:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C5A059]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-[#C5A059]/15 bg-gradient-to-br from-white via-[#FFFDF9] to-[#FAF3E2] p-6 shadow-[0_24px_80px_rgba(197,160,89,0.10)] md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(245,222,177,0.20),transparent_28%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/20 bg-white/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.35em] text-[#9A7441]">
              <Sparkles className="h-3.5 w-3.5" />
              Customer feedback
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-zinc-950 md:text-4xl">Reviews</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600 md:text-base">
              Track customer feedback, approve testimonials, and keep an eye on what clients are saying about the salon.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: 'Total', value: totalReviews, icon: MessageSquare },
              { label: 'Approved', value: approvedReviews, icon: CheckCircle2 },
              { label: 'Pending', value: pendingReviews, icon: Clock3 },
              { label: 'Avg. Rating', value: averageRating, icon: Star },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-2xl border border-[#C5A059]/12 bg-white/75 px-4 py-3 shadow-sm backdrop-blur">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">{label}</span>
                  <Icon className="h-4 w-4 text-[#C5A059]" />
                </div>
                <div className="text-2xl font-black tracking-tight text-zinc-950">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-[#C5A059]/20 bg-white/60 p-10 text-center">
          <MessageSquare className="mx-auto h-10 w-10 text-[#C5A059]" />
          <h3 className="mt-4 text-xl font-bold text-zinc-950">No reviews yet</h3>
          <p className="mt-2 text-sm text-zinc-500">New customer reviews will appear here as soon as they are submitted.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {reviews.map((review) => {
            const initial = (review.customerName || '?').charAt(0).toUpperCase();
            const isApproved = Boolean(review.approved);
            const serviceName = review.serviceName || 'Salon service';

            return (
              <article
                key={review.id}
                className={cn(
                  'group relative overflow-hidden rounded-[1.75rem] border bg-white/85 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.05)] transition-all duration-300 md:p-6',
                  isApproved
                    ? 'border-[#E7D2A7] hover:shadow-[0_22px_60px_rgba(197,160,89,0.10)]'
                    : 'border-amber-200/70 hover:shadow-[0_22px_60px_rgba(251,191,36,0.12)]'
                )}
              >
                <div className={cn('absolute inset-y-0 left-0 w-1.5', isApproved ? 'bg-[#C5A059]' : 'bg-amber-400')} />

                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C5A059] to-[#E8C97A] text-sm font-black text-white shadow-[0_12px_30px_rgba(197,160,89,0.30)]">
                        {initial}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-zinc-950">{review.customerName}</h3>
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.3em] shadow-sm',
                              isApproved
                                ? 'border-emerald-300/80 bg-emerald-500/85 text-white'
                                : 'border-amber-300/80 bg-amber-500/85 text-white'
                            )}
                          >
                            {isApproved ? 'Approved' : 'Pending'}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                          <span>{serviceName}</span>
                          <span className="text-zinc-300">|</span>
                          <span>{formatReviewDate(review.date)}</span>
                        </div>

                        <div className="mt-3 flex items-center gap-1.5">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={cn('h-4 w-4', index < Number(review.rating) ? 'fill-[#C5A059] text-[#C5A059]' : 'text-zinc-200')}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#C5A059]/10 bg-[#FFFCF7] px-4 py-4">
                      <p className="text-sm italic leading-relaxed text-zinc-700 md:text-[15px]">&ldquo;{review.comment}&rdquo;</p>
                    </div>
                  </div>

                  <div className="flex flex-row gap-3 lg:flex-col lg:items-end">
                    {!isApproved ? (
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="inline-flex items-center justify-center rounded-2xl border border-[#f5deb1] bg-[#C5A059]/90 px-5 py-3 text-xs font-black uppercase tracking-[0.3em] text-white shadow-[0_12px_28px_rgba(197,160,89,0.35)] transition-transform hover:-translate-y-0.5"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Approve
                      </button>
                    ) : (
                      <div className="inline-flex items-center rounded-2xl border border-emerald-300/80 bg-emerald-500/85 px-4 py-3 text-xs font-black uppercase tracking-[0.3em] text-white shadow-sm">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Published
                      </div>
                    )}

                    <button className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-500 transition-colors hover:border-red-200 hover:text-red-500">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;
