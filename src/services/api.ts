// Frontend API Service
// Fetches data from the Express backend

export const api = {
  // Image Upload
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    return res.json();
  },

  // Services
  getServices: async () => {
    const res = await fetch('/api/services');
    return res.json();
  },
  createService: async (data: any) => {
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateService: async (id: string, data: any) => {
    const res = await fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  deleteService: async (id: string) => {
    const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
    return res.json();
  },
  toggleServiceStatus: async (id: string) => {
    const res = await fetch(`/api/services/${id}/toggle`, { method: 'PATCH' });
    return res.json();
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
