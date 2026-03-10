import React, { useEffect, useState } from 'react';
import { Star, Check, X, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { api } from '../services/api';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchReviews();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.approveReview(id);
      setReviews(reviews.map(r => r.id === id ? { ...r, approved: 1 } : r));
    } catch (error) {
      console.error('Failed to approve review:', error);
    }
  };

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
          <h1 className="text-3xl font-bold text-white tracking-tighter">Reviews</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage customer feedback and testimonials.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] font-bold">
                  {review.customerName[0]}
                </div>
                <div>
                  <h3 className="text-white font-bold">{review.customerName}</h3>
                  <div className="flex space-x-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("h-3 w-3", i < review.rating ? "fill-[#C5A059] text-[#C5A059]" : "text-zinc-700")} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed italic">"{review.comment}"</p>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest">{review.date}</p>
            </div>

            <div className="flex items-center space-x-3">
              {!review.approved ? (
                <button 
                  onClick={() => handleApprove(review.id)}
                  className="flex-1 md:flex-none px-6 py-2.5 bg-[#C5A059] text-white text-xs font-bold rounded-xl hover:bg-[#B48F48] transition-all flex items-center justify-center"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </button>
              ) : (
                <span className="px-3 py-1.5 rounded-lg bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold uppercase tracking-widest border border-[#C5A059]/20">
                  Approved
                </span>
              )}
              <button className="p-2.5 bg-zinc-800 text-zinc-400 rounded-xl hover:text-red-500 transition-all">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewManagement;
