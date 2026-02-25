
export enum ServiceCategory {
  HAIR = 'Cabelo',
  NAILS = 'Unhas',
  BODY = 'Corpo',
  FACE = 'Rosto',
  MASSAGE = 'Massagem',
}

export type GalleryCategory = 'Cabelo' | 'Unhas' | 'Cílios' | 'Antes e Depois';

export interface GalleryItem {
  id: string;
  imageUrl: string;
  category: GalleryCategory;
  description?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  duration: string;
  price: number;
  description: string;
  imageUrl?: string; 
  gallery?: string[]; 
}

export interface User {
  id: string;
  name: string;
  phone: string;
  birthDate: string;
  referralCode: string;
  referredBy?: string;
  referrals: ReferralEntry[];
  rewards: any[]; 
  points: {
    escovas: number;
    manicurePedicure: number;
    ciliosManutencao: number;
  };
  createdAt: string;
  permanentPreferences?: ClientPreferences;
}

export interface ClientPreferences {
  environment: 'papo' | 'zen' | 'none';
  refreshment: 'Café Quente' | 'Café Morno' | 'Chá Quente' | 'Chá Morno' | 'Água Fresca' | 'Água Gelada' | 'Nada';
  health: {
    alergias: string;
    cheiro: string;
    aguaTemp: 'Quente' | 'Morna' | 'Fria';
    outros: string;
  };
  nails: {
    formato: 'Jade' | 'Redonda' | 'Curta' | 'Quadrada' | 'Outros' | 'none';
    pref: string;
  };
  lashes: string;
  hairExtra: 'Lisa' | 'Cacheada' | 'Volumosa' | 'Outras' | 'none';
  saveToProfile?: boolean;
}

export interface AccessibilityConfig {
  fontSize: number;
  highContrast: boolean;
  darkMode: boolean;
  readAloud: boolean;
  voiceControl: boolean;
  speechRate: number;
  speechPitch: number;
}

export interface BusinessHours {
  days: string[];
  start: string;
  end: string;
  breakStart: string;
  breakEnd: string;
}

export interface WeeklyOffer {
  day: number;
  title: string;
  offers: {
    id: string;
    name: string;
    desc: string;
    price: number;
  }[];
  active: boolean;
}

export interface SalonConfig {
  pointsPerService: number;
  pointsTarget: number;
  pointsValidityMonths: number;
  pixPrepayment: boolean;
  pixName: string;
  businessHours: BusinessHours;
  dynamicText: {
    heroTitle: string;
    heroSubtitle: string;
    studioDescription: string;
    protocolSectionTitle: string;
    loyaltySectionTitle: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface ChatMessage {
  id: string;
  userId: string;
  sender: 'client' | 'admin';
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface Voucher {
  id: string;
  name: string;
  description: string;
  limit: number;
  redeemed: number;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
  type: 'promo' | 'schedule' | 'news';
}

export interface AppSurvey {
  id: string;
  appointmentId: string;
  rating: number;
  comment?: string;
}

export interface Appointment {
  id: string;
  serviceId: string;
  clientName: string;
  clientPhone: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'request_cancellation' | 'completed' | 'in_service';
  paymentStatus: 'unpaid' | 'waiting_verification' | 'paid';
  checkInStatus: 'none' | 'pending_preferences' | 'checked_in';
  preferences?: ClientPreferences;
  reminderSent?: boolean;
  rating?: number;
  reviewComment?: string;
  createdAt: string;
  termsAccepted: boolean;
  whatsappConsent: boolean;
}

export interface ReferralEntry {
  friendName: string;
  status: 'joined' | 'converted';
}
