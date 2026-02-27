
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
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
  acceptTerms: () => void;
  sendFeedback: (text: string) => void;
  sendChatMessage: (text: string, sender: 'client' | 'admin', targetUserId?: string) => void;
  markChatAsRead: (userId: string, reader: 'client' | 'admin') => void;
  performCheckIn: (id: string, photoUrl?: string) => void;
  payAppointment: (id: string, method: 'debito' | 'credito' | 'pix') => void;
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
  const [isTyping, setIsTyping] = useState(false);

  const [salonConfig, setSalonConfig] = useState<SalonConfig>(() => {
    const defaultConfig: SalonConfig = {
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
      },
      professionals: {
        prof1_nome: 'Ivone',
        prof1_whats: '5511997308578',
        prof2_nome: 'Bia',
        prof2_whats: '5511985807495',
        prof3_nome: 'Edinete',
        prof3_whats: '5511952040382',
      }
    };

    const saved = localStorage.getItem('ivone_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultConfig,
        ...parsed,
        dynamicText: { ...defaultConfig.dynamicText, ...(parsed.dynamicText || {}) },
        colors: { ...defaultConfig.colors, ...(parsed.colors || {}) },
        professionals: { ...defaultConfig.professionals, ...(parsed.professionals || {}) },
        businessHours: { ...defaultConfig.businessHours, ...(parsed.businessHours || {}) }
      };
    }
    return defaultConfig;
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

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window && accessibility.readAloud) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = accessibility.speechRate;
      utterance.pitch = accessibility.speechPitch;
      window.speechSynthesis.speak(utterance);
    }
  }, [accessibility.readAloud, accessibility.speechRate, accessibility.speechPitch]);

  const login = useCallback((name: string, phone: string, birthDate: string = '', referralCode?: string, termsAccepted: boolean = false) => {
    const myCode = `IVONE-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const newUser: User = { 
        id: phone, name, phone, birthDate, 
        referralCode: myCode,
        referredBy: referralCode,
        referrals: [],
        rewards: [], 
        points: { escovas: 0, manicurePedicure: 0, ciliosManutencao: 0 }, 
        createdAt: new Date().toISOString(),
        termsAccepted,
        smartNotifications: true
    };
    setUser(newUser);
    setAllUsers(prev => {
      const exists = prev.find(u => u.id === phone);
      if (exists) return prev.map(u => u.id === phone ? { ...u, name, birthDate, termsAccepted: u.termsAccepted || termsAccepted } : u);
      return [...prev, newUser];
    });
    speak(`Bem-vinda, ${name.split(' ')[0]}.`);
  }, [speak]);

  const logout = useCallback(() => { setUser(null); setIsAdmin(false); localStorage.removeItem('ivone_user'); }, []);
  
  const toggleAdmin = useCallback(() => setIsAdmin(prev => !prev), []);

  const sendNotification = useCallback((title: string, body: string, type: AppNotification['type']) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotif: AppNotification = { id, title, body, timestamp: new Date(), read: false, type };
    setNotifications(prev => [newNotif, ...prev]);

    if ("Notification" in window && window.Notification.permission === "granted") {
      new window.Notification(title, { body });
    }
  }, []);

  const confirmAppointment = useCallback((id: string) => {
    setAppointments(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, status: 'confirmed' as const } : a);
      const app = updated.find(a => a.id === id);
      if (app) {
        sendNotification(
          "Horário Confirmado! 💄✨",
          "Seu horário foi confirmado! Aguardamos você no Ivone Studio 💄✨",
          'schedule'
        );
      }
      return updated;
    });
  }, [sendNotification]);

  const addGalleryItem = useCallback((imageUrl: string, category: GalleryCategory) => {
    const newItem: GalleryItem = {
      id: Math.random().toString(36).substr(2, 9),
      imageUrl,
      category,
      createdAt: new Date().toISOString()
    };
    setGalleryItems(prev => [newItem, ...prev]);
  }, []);

  const deleteGalleryItem = useCallback((id: string) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const requestPushPermission = useCallback(() => {
    if ("Notification" in window) {
      window.Notification.requestPermission().then(permission => {
        if (permission === "granted") speak("Notificações push ativadas.");
      });
    }
  }, [speak]);

  const addAppointment = useCallback((app: Omit<Appointment, 'id' | 'status' | 'paymentStatus' | 'reminderSent' | 'createdAt' | 'checkInStatus'>, isAdminDirect = false) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newApp: Appointment = { ...app, id, status: isAdminDirect ? 'confirmed' : 'pending', paymentStatus: 'unpaid', checkInStatus: 'none', createdAt: new Date().toISOString() };
    setAppointments(prev => [...prev, newApp]);
    
    if (!isAdminDirect) {
      sendNotification(
        "Agendamento Recebido! 📥",
        "Seu agendamento foi recebido e está aguardando confirmação.",
        'schedule'
      );
    } else {
      sendNotification(
        "Novo Agendamento! ✨",
        "Seu horário foi confirmado! Aguardamos você no Ivone Studio 💄✨",
        'schedule'
      );
    }
    
    return id;
  }, [sendNotification]);

  const cancelAppointment = useCallback((id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' as const } : a));
  }, []);

  const completeAppointment = useCallback((id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'completed' as const } : a));
  }, []);

  const updateAccessibility = useCallback((config: Partial<AccessibilityConfig>) => {
    setAccessibility(prev => ({ ...prev, ...config }));
  }, []);

  const updateUserData = useCallback((data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      setAllUsers(users => users.map(u => u.id === prev.id ? updated : u));
      return updated;
    });
  }, []);

  const acceptTerms = useCallback(() => {
    updateUserData({ termsAccepted: true });
  }, [updateUserData]);

  const sendFeedback = useCallback((text: string) => {
    if (!user) return;
    const feedbackNotification: AppNotification = {
      id: Date.now().toString(),
      title: 'Nova Reclamação/Sugestão',
      body: `De: ${user.name}\n${text}`,
      type: 'promo',
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [feedbackNotification, ...prev]);
    speak("Agradecemos seu feedback. Nossa equipe foi notificada.");
  }, [user, speak]);

  const sendChatMessage = useCallback((text: string, sender: 'client' | 'admin', targetUserId?: string) => {
    const userId = sender === 'client' ? user?.id : targetUserId;
    if (!userId) return;
    const newMessage: ChatMessage = { id: Date.now().toString(), userId, sender, text, timestamp: new Date(), read: false };
    setChatMessages(prev => [...prev, newMessage]);
  }, [user?.id]);

  const markNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const updateAppointmentPreferences = useCallback((id: string, prefs: ClientPreferences) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, preferences: prefs } : a));
    if (prefs.saveToProfile && user) {
      updateUserData({ permanentPreferences: prefs });
    }
  }, [user, updateUserData]);

  const performCheckIn = useCallback((id: string, photoUrl?: string) => {
    setAppointments(prev => {
      const updated = prev.map(a => a.id === id ? { 
        ...a, 
        checkInStatus: 'checked_in' as const, 
        status: 'in_service' as const,
        checkInPhoto: photoUrl 
      } : a);
      
      const app = updated.find(a => a.id === id);
      if (app) {
        sendNotification(
          "Cliente no Salão! 📍",
          `${app.clientName} acabou de fazer check-in no studio.`,
          'schedule'
        );
        
        // Notify user about payment options
        setTimeout(() => {
          sendNotification(
            "Pagamento Disponível 💳",
            "Você pode realizar o pagamento pelas opções abaixo: Débito, Crédito ou PIX.",
            'schedule'
          );
        }, 2000);
      }
      
      return updated;
    });
    speak("Check-in realizado.");
  }, [sendNotification, speak]);

  const payAppointment = useCallback((id: string, method: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, paymentStatus: 'waiting_verification' as const } : a));
    sendNotification(
      "Pagamento em Processamento ⏳",
      `Seu pagamento via ${method.toUpperCase()} foi enviado para verificação.`,
      'schedule'
    );
  }, [sendNotification]);

  const rateAppointment = useCallback((id: string, rating: number, comment?: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, rating, ratingComment: comment } : a));
    if (rating > 0) {
      sendNotification("Obrigada pela Avaliação! ❤️", "Sua opinião é muito importante para nós.", 'news');
    }
  }, [sendNotification]);

  const markChatAsRead = useCallback((userId: string, reader: 'client' | 'admin') => {
    setChatMessages(prev => prev.map(m => 
      m.userId === userId && m.sender !== reader ? { ...m, read: true } : m
    ));
  }, []);

  const addService = useCallback((service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: Math.random().toString(36).substr(2, 9) };
    setServices(prev => [...prev, newService]);
  }, []);

  const updateService = useCallback((id: string, service: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...service } : s));
  }, []);

  const deleteService = useCallback((id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  }, []);

  const updateVoucher = useCallback((id: string, voucher: Partial<Voucher>) => {
    setVouchers(prev => prev.map(v => v.id === id ? { ...v, ...voucher } : v));
  }, []);

  const confirmPayment = useCallback((id: string) => {
    setAppointments(prev => {
      const updated = prev.map(a => a.id === id ? { 
        ...a, 
        paymentStatus: 'paid' as const,
        status: 'completed' as const 
      } : a);
      
      const app = updated.find(a => a.id === id);
      if (app) {
        sendNotification(
          "Pagamento Confirmado! ✅",
          "Pagamento confirmado. Obrigada por escolher o Ivone Studio 💖",
          'schedule'
        );
      }
      
      return updated;
    });
  }, [sendNotification]);

  const redeemVoucher = useCallback((id: string) => {
    setVouchers(prev => prev.map(v => v.id === id ? { ...v, redeemed: v.redeemed + 1 } : v));
    sendNotification("Voucher Confirmado!", "Seu voucher foi validado com sucesso.", "promo");
  }, [sendNotification]);

  const updateSalonConfig = useCallback((config: Partial<SalonConfig>) => {
    setSalonConfig(prev => ({ ...prev, ...config }));
  }, []);

  const updateWeeklyOffer = useCallback((day: number, offer: Partial<WeeklyOffer>) => {
    setWeeklyOffers(prev => prev.map(o => o.day === day ? { ...o, ...offer } : o));
  }, []);

  const updateUserPoints = useCallback((userId: string, points: User['points']) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, points } : u));
    if (user?.id === userId) {
      setUser(prev => prev ? { ...prev, points } : null);
    }
  }, [user?.id]);

  return (
    <AppContext.Provider value={{
      user, allUsers, appointments, vouchers, weeklyOffers, notifications, chatMessages, services, galleryItems, isAdmin, isBirthMonth, accessibility, salonConfig, isTyping,
      login, logout, toggleAdmin, addAppointment, confirmAppointment, cancelAppointment, completeAppointment,
      updateAccessibility, updateUserData, acceptTerms, sendFeedback, sendChatMessage, markNotificationsAsRead, deleteNotification,
      performCheckIn, payAppointment, speak, rateAppointment, sendNotification, requestPushPermission, updateAppointmentPreferences,
      addGalleryItem, deleteGalleryItem, markChatAsRead,
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
