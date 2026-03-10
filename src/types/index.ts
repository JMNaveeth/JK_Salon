export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  imageUrl: string;
  category: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // ISO string
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed';
  amount: number;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  category: string;
  title?: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
  photoUrl?: string;
}

export interface SalonContent {
  hero: {
    title: string;
    tagline: string;
    backgroundImage: string;
  };
  about: {
    story: string;
    mission: string;
    vision: string;
  };
  contact: {
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
    workingHours: string;
    googleMapsUrl: string;
  };
}
