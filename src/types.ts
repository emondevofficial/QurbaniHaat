export interface Animal {
  id: number;
  name: string;
  type: 'Cow' | 'Goat' | 'Sheep';
  breed: string;
  price: number;
  weight: number; // in kg
  age: number; // in years
  location: string;
  description: string;
  image: string;
  category: 'Large Animal' | 'Medium Animal' | 'Small Animal';
  teethCount?: number;
  vaccinationStatus?: 'Fully Vaccinated' | 'Verified Healthy';
  diet?: string;
  color?: string;
  isFeatured?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  image?: string;
  createdAt: string;
  emailVerified?: boolean;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  deliveryDate?: string;
  specialInstructions?: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}
