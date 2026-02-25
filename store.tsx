
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Appointment, Voucher, AppNotification, ChatMessage, ServiceCategory, AccessibilityConfig, SalonConfig, Service, ClientPreferences, GalleryItem, GalleryCategory, WeeklyOffer } from './types';
import { MOCK_VOUCHERS, SERVICES as INITIAL_SERVICES, WEEKLY_OFFERS as INITIAL_OFFERS } from './constants';

interface AppState {
  user: User | null;
  allUsers: User[];
  appointments: Appointment[];
  vouchers: Voucher[];
  weeklyOffers: WeeklyOffer[];
  notifications: AppNotification[];
  chatMessages: ChatMessage[];
  services: Service[];
  galleryItems: GalleryItem[];
  isAdmin: boolean;
  isBirthMonth: boolean;
  accessibility: AccessibilityConfig;
  salonConfig: SalonConfig;
  isTyping: boolean;
  login: (name: string, phone: string, birthDate?: string, referralCode?: string) => void;
  logout: () => void;
  toggleAdmin: () => void;
  addAppointment: (app: Omit<Appointment, 'id' | 'status' | 'paymentStatus' | 'reminderSent' | 'createdAt' | 'checkInStatus'>, isAdminDirect?: boolean) => string;
  confirmAppointment: (id: string) => void;
  cancelAppointment: (id: string) => void;
  completeAppointment: (id: string) => void;
  updateAccessibility: (config: Partial<AccessibilityConfig>) => void;
  updateUserData: (data: Partial<User>) => void;
  sendChatMessage: (text: string, sender: 'client' | 'admin', targetUserId?: string) => void;
  markChatAsRead: (userId: string, reader: 'client' | 'admin') => void;
  performCheckIn: (id: string) => void;
  speak: (text: string) => void;
  rateAppointment: (id: string, rating: number, comment?: string) => void;
  sendNotification: (title: string, body: string, type: AppNotification['type']) => void;
  markNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  requestPushPermission: () => void;
  updateAppointmentPreferences: (id: string, prefs: ClientPreferences) => void;
  addGalleryItem: (imageUrl: string, category: GalleryCategory) => void;
  deleteGalleryItem: (id: string) => void;
  // Management Actions
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  updateVoucher: (id: string, voucher: Partial<Voucher>) => void;
  confirmPayment: (id: string) => void;
  redeemVoucher: (id: string) => void;
  updateSalonConfig: (config: Partial<SalonConfig>) => void;
  updateWeeklyOffer: (day: number, offer: Partial<WeeklyOffer>) => void;
  updateUserPoints: (userId: string, points: User['points']) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ivone_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ivone_all_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('ivone_apps');
    return saved ? JSON.parse(saved) : [];
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('ivone_gallery');
    return saved ? JSON.parse(saved) : [];
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('ivone_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    const saved = localStorage.getItem('ivone_vouchers');
    return saved ? JSON.parse(saved) : MOCK_VOUCHERS;
  });

  const [weeklyOffers, setWeeklyOffers] = useState<WeeklyOffer[]>(() => {
    const saved = localStorage.getItem('ivone_offers');
    return saved ? JSON.parse(saved) : INITIAL_OFFERS.map(o => ({ ...o, active: true }));
  });

  const [accessibility, setAccessibility] = useState<AccessibilityConfig>(() => {
    const saved = localStorage.getItem('ivone_accessibility');
    return saved ? JSON.parse(saved) : {
      fontSize: 100,
      highContrast: false,
      darkMode: false,
      readAloud: false,
      voiceControl: true,
      speechRate: 1,
      speechPitch: 1
    };
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBirthMonth, setIsBirthMonth] = useState(false);

  const [salonConfig, setSalonConfig] = useState<SalonConfig>(() => {
    const saved = localStorage.getItem('ivone_config');
    return saved ? JSON.parse(saved) : {
      pointsPerService: 1,
      pointsTarget: 2,
      pointsValidityMonths: 6,
      pixPrepayment: true,
      pixName: 'Ivone Hair Studio',
      businessHours: {
        days: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        start: '09:00',
        end: '18:00',
        breakStart: '12:00',
        breakEnd: '13:00',
      },
      dynamicText: {
        heroTitle: "The Ivory Experience",
        heroSubtitle: "Design de beleza sob medida para realçar sua essência.",
        studioDescription: "Protocolos Studio",
        protocolSectionTitle: "Nossa Curadoria",
        loyaltySectionTitle: "Clube de Pontos"
      },
      colors: {
        primary: '#D99489',
        secondary: '#86BDB1',
        accent: '#8B5E3C'
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('ivone_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('ivone_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('ivone_vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  useEffect(() => {
    localStorage.setItem('ivone_offers', JSON.stringify(weeklyOffers));
  }, [weeklyOffers]);

  useEffect(() => {
    localStorage.setItem('ivone_config', JSON.stringify(salonConfig));
  }, [salonConfig]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ivone_user', JSON.stringify(user));
      if (user.birthDate) {
        const birthDateObj = new Date(user.birthDate);
        if (!isNaN(birthDateObj.getTime())) {
          const birthMonth = birthDateObj.getUTCMonth();
          const currentMonth = new Date().getUTCMonth();
          setIsBirthMonth(birthMonth === currentMonth);
        }
      }
    } else {
      localStorage.removeItem('ivone_user');
      setIsBirthMonth(false);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ivone_accessibility', JSON.stringify(accessibility));
    const html = document.documentElement;
    html.classList.toggle('dark-mode', accessibility.darkMode);
    html.classList.toggle('high-contrast', accessibility.highContrast);
    html.style.setProperty('--font-scale', (accessibility.fontSize / 100).toString());
  }, [accessibility]);

  useEffect(() => {
    localStorage.setItem('ivone_apps', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('ivone_gallery', JSON.stringify(galleryItems));
  }, [galleryItems]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window && accessibility.readAloud) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = accessibility.speechRate;
      utterance.pitch = accessibility.speechPitch;
      window.speechSynthesis.speak(utterance);
    }
  };

  const login = (name: string, phone: string, birthDate: string = '', referralCode?: string) => {
    const myCode = `IVONE-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const newUser: User = { 
        id: phone, name, phone, birthDate, 
        referralCode: myCode,
        referredBy: referralCode,
        referrals: [],
        rewards: [], 
        points: { escovas: 0, manicurePedicure: 0, ciliosManutencao: 0 }, 
        createdAt: new Date().toISOString()
    };
    setUser(newUser);
    setAllUsers(prev => {
      const exists = prev.find(u => u.id === phone);
      if (exists) return prev.map(u => u.id === phone ? { ...u, name, birthDate } : u);
      return [...prev, newUser];
    });
    speak(`Bem-vinda, ${name.split(' ')[0]}.`);
  };

  const logout = () => { setUser(null); setIsAdmin(false); localStorage.removeItem('ivone_user'); };
  
  const toggleAdmin = () => setIsAdmin(!isAdmin);

  const sendNotification = (title: string, body: string, type: AppNotification['type']) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotif: AppNotification = { id, title, body, timestamp: new Date(), read: false, type };
    setNotifications(prev => [newNotif, ...prev]);

    if ("Notification" in window && window.Notification.permission === "granted") {
      new window.Notification(title, { body });
    }
  };

  const confirmAppointment = (id: string) => {
    setAppointments(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, status: 'confirmed' as const } : a);
      const app = updated.find(a => a.id === id);
      if (app) {
        const service = services.find(s => s.id === app.serviceId);
        const dateFormatted = app.date.split('-').reverse().join('/');
        sendNotification(
          "Horário Confirmado! 💖",
          `Olá ${app.clientName}, seu agendamento para ${service?.name} em ${dateFormatted} às ${app.time} foi aceito pela Ivone.`,
          'schedule'
        );
      }
      return updated;
    });
  };

  const addGalleryItem = (imageUrl: string, category: GalleryCategory) => {
    const newItem: GalleryItem = {
      id: Math.random().toString(36).substr(2, 9),
      imageUrl,
      category,
      createdAt: new Date().toISOString()
    };
    setGalleryItems(prev => [newItem, ...prev]);
  };

  const deleteGalleryItem = (id: string) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
  };

  const requestPushPermission = () => {
    if ("Notification" in window) {
      window.Notification.requestPermission().then(permission => {
        if (permission === "granted") speak("Notificações push ativadas.");
      });
    }
  };

  const addAppointment = (app: Omit<Appointment, 'id' | 'status' | 'paymentStatus' | 'reminderSent' | 'createdAt' | 'checkInStatus'>, isAdminDirect = false) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newApp: Appointment = { ...app, id, status: isAdminDirect ? 'confirmed' : 'pending', paymentStatus: 'unpaid', checkInStatus: 'none', createdAt: new Date().toISOString() };
    setAppointments(prev => [...prev, newApp]);
    return id;
  };

  const cancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' as const } : a));
  };

  const completeAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'completed' as const } : a));
  };

  const updateAccessibility = (config: Partial<AccessibilityConfig>) => {
    setAccessibility(prev => ({ ...prev, ...config }));
  };

  const updateUserData = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  const sendChatMessage = (text: string, sender: 'client' | 'admin', targetUserId?: string) => {
    const userId = sender === 'client' ? user?.id : targetUserId;
    if (!userId) return;
    const newMessage: ChatMessage = { id: Date.now().toString(), userId, sender, text, timestamp: new Date(), read: false };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const updateAppointmentPreferences = (id: string, prefs: ClientPreferences) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, preferences: prefs } : a));
    if (prefs.saveToProfile && user) {
      updateUserData({ permanentPreferences: prefs });
    }
  };

  const performCheckIn = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, checkInStatus: 'checked_in' as const, status: 'in_service' as const } : a));
    speak("Check-in realizado.");
  };

  const addService = (service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: Math.random().toString(36).substr(2, 9) };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (id: string, service: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...service } : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const updateVoucher = (id: string, voucher: Partial<Voucher>) => {
    setVouchers(prev => prev.map(v => v.id === id ? { ...v, ...voucher } : v));
  };

  const confirmPayment = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, paymentStatus: 'paid' as const } : a));
  };

  const redeemVoucher = (id: string) => {
    setVouchers(prev => prev.map(v => v.id === id ? { ...v, redeemed: v.redeemed + 1 } : v));
    sendNotification("Voucher Confirmado!", "Seu voucher foi validado com sucesso.", "promo");
  };

  const updateSalonConfig = (config: Partial<SalonConfig>) => {
    setSalonConfig(prev => ({ ...prev, ...config }));
  };

  const updateWeeklyOffer = (day: number, offer: Partial<WeeklyOffer>) => {
    setWeeklyOffers(prev => prev.map(o => o.day === day ? { ...o, ...offer } : o));
  };

  const updateUserPoints = (userId: string, points: User['points']) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, points } : u));
    if (user?.id === userId) {
      setUser(prev => prev ? { ...prev, points } : null);
    }
  };

  return (
    <AppContext.Provider value={{
      user, allUsers, appointments, vouchers, weeklyOffers, notifications, chatMessages, services, galleryItems, isAdmin, isBirthMonth, accessibility, salonConfig, isTyping: false,
      login, logout, toggleAdmin, addAppointment, confirmAppointment, cancelAppointment, completeAppointment,
      updateAccessibility, updateUserData, sendChatMessage, markNotificationsAsRead, deleteNotification,
      performCheckIn, speak, rateAppointment: () => {}, sendNotification, requestPushPermission, updateAppointmentPreferences,
      addGalleryItem, deleteGalleryItem, markChatAsRead: () => {},
      addService, updateService, deleteService, updateVoucher, confirmPayment, redeemVoucher, updateSalonConfig, updateWeeklyOffer, updateUserPoints
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
