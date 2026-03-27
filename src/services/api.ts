// Frontend API Service
import { db, storage } from '../firebase/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const api = {
  // Image Upload
  uploadImage: async (file: File) => {
    try {
      const storageRef = ref(storage, `services/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return { success: true, imageUrl: downloadURL };
    } catch (error) {
      console.error("Firebase Storage Upload Error:", error);
      return { success: false, error };
    }
  },

  // Services
  getServices: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'services'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Firebase getServices Error:", error);
      return [];
    }
  },
  createService: async (data: any) => {
    try {
      // Set default status if not present
      if (!data.status) data.status = 'Active';
      const docRef = await addDoc(collection(db, 'services'), data);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Firebase createService Error:", error);
      throw error;
    }
  },
  updateService: async (id: string, data: any) => {
    const serviceRef = doc(db, 'services', id);
    await updateDoc(serviceRef, data);
    return { success: true };
  },
  deleteService: async (id: string) => {
    const serviceRef = doc(db, 'services', id);
    await deleteDoc(serviceRef);
    return { success: true };
  },
  toggleServiceStatus: async (id: string) => {
    const serviceRef = doc(db, 'services', id);
    const serviceSnap = await getDoc(serviceRef);
    if (serviceSnap.exists()) {
      const newStatus = serviceSnap.data().status === 'Active' ? 'Inactive' : 'Active';
      await updateDoc(serviceRef, { status: newStatus });
      return { success: true, status: newStatus };
    }
    throw new Error('Service not found');
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
