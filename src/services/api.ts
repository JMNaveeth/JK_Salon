// Frontend API Service

export const api = {
  // Image Upload
  uploadImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        try {
          const errData = await res.json();
          return { success: false, error: errData.error || `Server Error ${res.status}` };
        } catch {
          const text = await res.text();
          console.error("Local Upload Server Error (Text):", text);
          return { success: false, error: `Server Error ${res.status}` };
        }
      }
      return await res.json();
    } catch (error) {
      console.error("Local Upload Network Error:", error);
      return { success: false, error: "Network Error" };
    }
  },

  // Services
  getServices: async () => {
    try {
      const res = await fetch('/api/services');
      return await res.json();
    } catch (error) {
      console.error("API getServices Error:", error);
      return [];
    }
  },
  createService: async (data: any) => {
    try {
      if (!data.status) data.status = 'Active';
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (error) {
      console.error("API createService Error:", error);
      throw error;
    }
  },
  updateService: async (id: string, data: any) => {
    const res = await fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  deleteService: async (id: string) => {
    const res = await fetch(`/api/services/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },
  toggleServiceStatus: async (id: string) => {
    const res = await fetch(`/api/services/${id}/toggle`, {
      method: 'PATCH'
    });
    return await res.json();
  },

  // Bookings
  getBookings: async () => {
    const res = await fetch('/api/bookings');
    return res.json();
  },
  createBooking: async (data: any) => {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateBookingStatus: async (id: string, status: string) => {
    const res = await fetch(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },
  deleteBooking: async (id: string) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Reviews
  getReviews: async () => {
    const res = await fetch('/api/reviews');
    return res.json();
  },
  createReview: async (data: any) => {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  approveReview: async (id: string) => {
    const res = await fetch(`/api/reviews/${id}/approve`, {
      method: 'PATCH'
    });
    return res.json();
  },

  // Gallery
  getGallery: async () => {
    const res = await fetch('/api/gallery');
    return res.json();
  },
  uploadMedia: async (data: any) => {
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteGalleryItem: async (id: string) => {
    const res = await fetch(`/api/gallery/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Messages
  getMessages: async () => {
    const res = await fetch('/api/messages');
    return res.json();
  },
  sendMessage: async (data: any) => {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
