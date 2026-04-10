export type OwnerProfile = {
  ownerName: string;
  role: string;
  yearsExperience: string;
  bio: string;
  profileImageUrl: string;
  shopName: string;
  shopAddress: string;
  googleMapsUrl: string;
  businessRegNo: string;
  contactPhone: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  specialties: string;
  instagram: string;
  facebook: string;
  website: string;
};

export const OWNER_PROFILE_STORAGE_KEY = 'jk_salon_owner_profile';
export const OWNER_PROFILE_UPDATED_EVENT = 'jk-owner-profile-updated';

export const defaultOwnerProfile: OwnerProfile = {
  ownerName: 'Naveeth Perera',
  role: 'Founder & Lead Stylist',
  yearsExperience: '12',
  bio: 'Award-winning barber and stylist focused on modern grooming, fade artistry, and premium client care.',
  profileImageUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=300',
  shopName: 'JK Salon Colombo',
  shopAddress: '123 Salon Street, Colombo 07, Sri Lanka',
  googleMapsUrl: 'https://maps.google.com',
  businessRegNo: 'BRN-2024-00198',
  contactPhone: '+94 75 956 0114',
  whatsapp: '+94 75 956 0114',
  email: 'hello@jksalon.com',
  openingHours: 'Mon-Fri 9:00 AM - 8:00 PM, Sat 9:00 AM - 6:00 PM, Sun 10:00 AM - 4:00 PM',
  specialties: 'Skin Fade, Beard Design, Hair Spa, Bridal Grooming',
  instagram: 'https://instagram.com/jksalon',
  facebook: 'https://facebook.com/jksalon',
  website: 'https://jksalon.com',
};

export const getOwnerProfile = (): OwnerProfile => {
  if (typeof window === 'undefined') return defaultOwnerProfile;

  try {
    const cached = window.localStorage.getItem(OWNER_PROFILE_STORAGE_KEY);
    if (!cached) return defaultOwnerProfile;
    return { ...defaultOwnerProfile, ...JSON.parse(cached) };
  } catch {
    return defaultOwnerProfile;
  }
};

export const saveOwnerProfile = (profile: OwnerProfile): void => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(OWNER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new CustomEvent(OWNER_PROFILE_UPDATED_EVENT, { detail: profile }));
};

export const subscribeOwnerProfileChanges = (onChange: (profile: OwnerProfile) => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === OWNER_PROFILE_STORAGE_KEY) {
      onChange(getOwnerProfile());
    }
  };

  const handleCustomEvent = () => {
    onChange(getOwnerProfile());
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(OWNER_PROFILE_UPDATED_EVENT, handleCustomEvent);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(OWNER_PROFILE_UPDATED_EVENT, handleCustomEvent);
  };
};

export const toTelLink = (phone: string): string => {
  const sanitized = phone.replace(/[^+\d]/g, '');
  return `tel:${sanitized}`;
};

export const toWhatsAppLink = (phone: string): string => {
  const digitsOnly = phone.replace(/[^\d]/g, '');
  return `https://wa.me/${digitsOnly}`;
};
