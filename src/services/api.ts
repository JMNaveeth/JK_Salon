import { supabase } from '../supabase/supabase';

// Frontend API Service
export const api = {
  // Image Upload
  uploadImage: async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      return { success: true, url: publicUrl };
    } catch (error: any) {
      console.error("Supabase Upload Error:", error);
      return { success: false, error: error.message };
    }
  },

  // Services
  getServices: async () => {
    try {
      const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("API getServices Error:", error);
      return [];
    }
  },
  createService: async (data: any) => {
    try {
      if (!data.status) data.status = 'Active';
      const { data: newService, error } = await supabase.from('services').insert([data]).select().single();
      if (error) throw error;
      return newService;
    } catch (error) {
      console.error("API createService Error:", error);
      throw error;
    }
  },
  updateService: async (id: string, data: any) => {
    try {
      const { data: updatedService, error } = await supabase.from('services').update(data).eq('id', id).select().single();
      if (error) throw error;
      return updatedService;
    } catch (error) {
      console.error("API updateService Error:", error);
      throw error;
    }
  },
  deleteService: async (id: string) => {
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error("API deleteService Error:", error);
      return { error: error.message };
    }
  },
  toggleServiceStatus: async (id: string) => {
    try {
      const { data: service, error: fetchError } = await supabase.from('services').select('status').eq('id', id).single();
      if (fetchError) throw fetchError;
      
      const newStatus = service.status === 'Active' ? 'Inactive' : 'Active';
      const { data, error } = await supabase.from('services').update({ status: newStatus }).eq('id', id).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("API toggleServiceStatus Error:", error);
      throw error;
    }
  },

  // Bookings
  getBookings: async () => {
    try {
      const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("API getBookings Error:", error);
      return [];
    }
  },
  createBooking: async (data: any) => {
    try {
      const { data: newBooking, error } = await supabase.from('bookings').insert([data]).select().single();
      if (error) throw error;
      return newBooking;
    } catch (error) {
      console.error("API createBooking Error:", error);
      throw error;
    }
  },
  updateBookingStatus: async (id: string, status: string) => {
    try {
      const { data, error } = await supabase.from('bookings').update({ status }).eq('id', id).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("API updateBookingStatus Error:", error);
      throw error;
    }
  },
  deleteBooking: async (id: string) => {
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error("API deleteBooking Error:", error);
      return { error: error.message };
    }
  },

  // Reviews
  getReviews: async () => {
    try {
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("API getReviews Error:", error);
      return [];
    }
  },
  createReview: async (data: any) => {
    try {
      const { data: newReview, error } = await supabase.from('reviews').insert([data]).select().single();
      if (error) throw error;
      return newReview;
    } catch (error) {
      console.error("API createReview Error:", error);
      throw error;
    }
  },
  approveReview: async (id: string) => {
    try {
      const { data, error } = await supabase.from('reviews').update({ status: 'approved' }).eq('id', id).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("API approveReview Error:", error);
      throw error;
    }
  },

  // Gallery
  getGallery: async () => {
    try {
      const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("API getGallery Error:", error);
      return [];
    }
  },
  uploadMedia: async (data: any) => {
    try {
      const { data: newMedia, error } = await supabase.from('gallery').insert([data]).select().single();
      if (error) throw error;
      return newMedia;
    } catch (error) {
      console.error("API uploadMedia Error:", error);
      throw error;
    }
  },
  deleteGalleryItem: async (id: string) => {
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error("API deleteGalleryItem Error:", error);
      return { error: error.message };
    }
  },

  // Messages
  getMessages: async () => {
    try {
      const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("API getMessages Error:", error);
      return [];
    }
  },
  sendMessage: async (data: any) => {
    try {
      const { data: newMessage, error } = await supabase.from('messages').insert([data]).select().single();
      if (error) throw error;
      return newMessage;
    } catch (error) {
      console.error("API sendMessage Error:", error);
      throw error;
    }
  }
};
