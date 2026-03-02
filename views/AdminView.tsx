
import React, { useState, useMemo } from 'react';
import { useApp } from '../store';
import { ServiceCategory, Service, Voucher, GalleryCategory, WeeklyOffer, SalonConfig, User as AppUser } from '../types';
import { 
  CheckCircle, 
  XCircle, 
  Lock,
  Plus,
  Calendar,
  Camera,
  MessageCircle,
  X,
  Scissors,
  Sparkles,
  Megaphone,
  PlusCircle,
  Clock,
  User,
  Phone,
  ArrowUpRight,
  Ticket,
  MapPin,
  Play,
  Image as ImageIcon,
  Trash2,
  Settings,
  BarChart3,
  Users,
  Tag,
  CreditCard,
  Palette,
  Eye,
  Save,
  Bell,
  Check,
  ChevronRight,
  ChevronDown,
  Award,
  Instagram,
  Gift
} from 'lucide-react';

interface AdminViewProps {
  onGoToChat?: () => void;
}

type AdminSubView = 'ops' | 'services' | 'offers' | 'vouchers' | 'users' | 'gallery' | 'config' | 'reports' | 'loyalty';

const AdminView: React.FC<AdminViewProps> = ({ onGoToChat }) => {
  const { 
    allUsers, appointments, confirmAppointment, completeAppointment, cancelAppointment, confirmPayment,
    sendNotification, services, galleryItems, addGalleryItem, deleteGalleryItem, addAppointment,
    addService, updateService, deleteService, vouchers, updateVoucher, redeemVoucher,
    salonConfig, updateSalonConfig, weeklyOffers, updateWeeklyOffer, updateUserPoints,
    logout, deleteUser, addUser, notifications, markNotificationsAsRead, deleteNotification
  } = useApp();
  
  const [activeSubView, setActiveSubView] = useState<AdminSubView>('ops');
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);
  const [showHoursConfig, setShowHoursConfig] = useState(false);
  
  // Agenda Filter
  const [agendaDate, setAgendaDate] = useState(new Date().toISOString().split('T')[0]);

  // Reports Filters
  const [reportStart, setReportStart] = useState('');
  const [reportEnd, setReportEnd] = useState('');

  // Forms State
  const [showQuickBook, setShowQuickBook] = useState(false);
  const [qbData, setQbData] = useState({ name: '', phone: '', serviceId: '', date: '', time: '' });

  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', phone: '', birthDate: '' });

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [editingOffer, setEditingOffer] = useState<{day: number, offer: any} | null>(null);
  
  const [galleryUrl, setGalleryUrl] = useState('');
  const [galleryCat, setGalleryCat] = useState<GalleryCategory>('Cabelo');

  const [notifData, setNotifData] = useState({ title: '', body: '', type: 'news' as any });

  const handleUnlock = () => {
    if (password === 'Ivone2026') setIsLocked(false);
    else alert('Senha incorreta!');
  };

  const handleQuickBook = () => {
    if (!qbData.name || !qbData.phone || !qbData.serviceId || !qbData.date || !qbData.time) return;
    addAppointment({
      serviceId: qbData.serviceId,
      clientName: qbData.name,
      clientPhone: qbData.phone,
      date: qbData.date,
      time: qbData.time,
      termsAccepted: true,
      whatsappConsent: true
    }, true);
    setShowQuickBook(false);
    setQbData({ name: '', phone: '', serviceId: '', date: '', time: '' });
  };

  const handleAddUser = () => {
    if (!newUserData.name || !newUserData.phone) return;
    addUser({
      name: newUserData.name,
      phone: newUserData.phone,
      birthDate: newUserData.birthDate,
      termsAccepted: true,
      smartNotifications: true
    });
    setShowAddUser(false);
    setNewUserData({ name: '', phone: '', birthDate: '' });
  };

  const handleAddService = () => {
    addService({
      name: 'Novo Serviço',
      category: ServiceCategory.HAIR,
      duration: '60 min',
      price: 0,
      description: 'Descrição do serviço...'
    });
  };

  const handleSendCustomNotif = () => {
    if (!notifData.title || !notifData.body) return;
    sendNotification(notifData.title, notifData.body, notifData.type);
    setNotifData({ title: '', body: '', type: 'news' });
    alert('Notificação enviada a todos!');
  };

  // Reports Logic
  const reports = useMemo(() => {
    const filteredApps = appointments.filter(a => {
      if (reportStart && a.date < reportStart) return false;
      if (reportEnd && a.date > reportEnd) return false;
      return true;
    });

    const serviceCounts: Record<string, number> = {};
    let totalRevenue = 0;
    const paymentMethods: Record<string, number> = {
      'debito': 0,
      'credito': 0,
      'pix': 0,
      'cash': 0
    };
    const professionalRevenue: Record<string, number> = {
      [salonConfig.professionals.prof1_nome]: 0,
      [salonConfig.professionals.prof2_nome]: 0,
      [salonConfig.professionals.prof3_nome]: 0
    };

    filteredApps.forEach(a => {
      if (a.status === 'completed' || a.paymentStatus === 'paid') {
        const service = services.find(s => s.id === a.serviceId);
        if (service) {
          totalRevenue += service.price;
          serviceCounts[service.name] = (serviceCounts[service.name] || 0) + 1;
          
          if (a.paymentMethod) {
            paymentMethods[a.paymentMethod] += service.price;
          }

          // Simplified professional attribution based on service category
          let prof = salonConfig.professionals.prof1_nome;
          if (service.category === ServiceCategory.NAILS || service.category === ServiceCategory.MASSAGE) prof = salonConfig.professionals.prof3_nome;
          else if (service.category === ServiceCategory.FACE) prof = salonConfig.professionals.prof2_nome;
          
          professionalRevenue[prof] += service.price;
        }
      }
    });

    const currentMonth = new Date().getMonth();
    const birthdayClients = allUsers.filter(u => {
      if (!u.birthDate) return false;
      return new Date(u.birthDate).getMonth() === currentMonth;
    });

    const vouchersUsed = vouchers.reduce((acc, v) => acc + v.redeemed, 0);

    const now = new Date();
    const inactive30 = allUsers.filter(u => {
      const lastApp = appointments.filter(a => a.clientPhone === u.phone && a.status === 'completed').sort((a, b) => b.date.localeCompare(a.date))[0];
      if (!lastApp) return true;
      const diff = (now.getTime() - new Date(lastApp.date).getTime()) / (1000 * 60 * 60 * 24);
      return diff > 30;
    });

    const inactive60 = allUsers.filter(u => {
      const lastApp = appointments.filter(a => a.clientPhone === u.phone && a.status === 'completed').sort((a, b) => b.date.localeCompare(a.date))[0];
      if (!lastApp) return true;
      const diff = (now.getTime() - new Date(lastApp.date).getTime()) / (1000 * 60 * 60 * 24);
      return diff > 60;
    });

    return {
      totalAppointments: filteredApps.length,
      confirmed: filteredApps.filter(a => a.status === 'confirmed').length,
      completed: filteredApps.filter(a => a.status === 'completed').length,
      totalRevenue,
      birthdayClients,
      vouchersUsed,
      inactive30: inactive30.length,
      inactive60: inactive60.length,
      professionalRevenue,
      paymentMethods,
      serviceCounts: Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])
    };
  }, [appointments, services, allUsers, reportStart, reportEnd, salonConfig.professionals, vouchers]);

  if (isLocked) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-fade">
        <div className="w-20 h-20 bg-[#FAF7F5] dark:bg-zinc-800 rounded-[2.5rem] flex items-center justify-center text-[#D4B499] shadow-inner">
          <Lock size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-gray-800 dark:text-white">Acesso Ivone</h2>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.3em]">Painel Administrativo</p>
        </div>
        <div className="w-full max-w-xs space-y-4">
          <input 
            type="password" 
            placeholder="Senha Mestra"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUnlock()}
            className="w-full p-6 bg-white dark:bg-zinc-900 border border-[#F5E6DA] dark:border-zinc-800 rounded-[2rem] text-center outline-none focus:border-[#D4B499] shadow-sm"
          />
          <button 
            onClick={handleUnlock}
            className="w-full bg-[#D4B499] text-studio-ink py-6 rounded-[2rem] font-bold uppercase text-[11px] tracking-widest shadow-xl active:scale-95 transition-all"
          >
            Entrar no Painel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 pb-32 animate-fade">
      <header className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-800 dark:text-white">Studio Gestão</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Controle Interno</p>
        </div>
        <div className="flex gap-2 relative">
          <button 
            onClick={() => {
              setShowNotifs(!showNotifs);
              if (!showNotifs) markNotificationsAsRead();
            }} 
            className="p-3 bg-gray-100 dark:bg-zinc-800 rounded-2xl text-gray-400 relative"
          >
            <Bell size={20} />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-zinc-900" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute top-16 right-0 w-72 bg-white dark:bg-zinc-900 border border-stone-100 dark:border-stone-800 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Notificações</span>
                <button onClick={() => setShowNotifs(false)}><X size={14} className="text-stone-300"/></button>
              </div>
              <div className="max-h-80 overflow-y-auto no-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-[10px] text-stone-400 italic">Nenhuma notificação</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-4 border-b border-stone-50 dark:border-stone-800/50 hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors group">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-[11px] font-bold dark:text-white">{n.title}</p>
                        <button onClick={() => deleteNotification(n.id)} className="opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} className="text-rose-300"/></button>
                      </div>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-relaxed">{n.body}</p>
                      <p className="text-[8px] text-stone-300 mt-2">{new Date(n.timestamp).toLocaleTimeString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <button onClick={logout} className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl" title="Encerrar Sessão">
            <XCircle size={20} />
          </button>
          <button onClick={() => setIsLocked(true)} className="p-3 bg-gray-100 dark:bg-zinc-800 rounded-2xl text-gray-400">
            <Lock size={20} />
          </button>
        </div>
      </header>

      {/* SUB-NAV */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar bg-gray-100 dark:bg-zinc-900 p-1.5 rounded-[2rem] border border-[#F5E6DA]/30">
        {[
          {id: 'ops', label: 'Agenda', icon: Calendar, badge: appointments.filter(a => a.status === 'pending').length},
          {id: 'services', label: 'Serviços', icon: Scissors},
          {id: 'offers', label: 'Promo', icon: Tag},
          {id: 'vouchers', label: 'Vouchers', icon: Ticket},
          {id: 'users', label: 'Clientes', icon: Users},
          {id: 'loyalty', label: 'Clube', icon: Award},
          {id: 'gallery', label: 'Galeria', icon: ImageIcon},
          {id: 'config', label: 'Config', icon: Settings},
          {id: 'reports', label: 'Relatórios', icon: BarChart3}
        ].map(nav => (
          <button 
            key={nav.id}
            onClick={() => setActiveSubView(nav.id as any)}
            className={`px-6 py-4 rounded-3xl text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 whitespace-nowrap relative ${activeSubView === nav.id ? 'bg-white dark:bg-zinc-800 text-[#D4B499] shadow-md' : 'text-gray-400'}`}
          >
            <nav.icon size={14}/> {nav.label}
            {nav.badge ? (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] flex items-center justify-center rounded-full border border-white dark:border-zinc-900">
                {nav.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {/* OPERATIONS / AGENDA */}
        {activeSubView === 'ops' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-serif font-bold dark:text-white">Horários</h3>
                <input 
                  type="date" 
                  value={agendaDate} 
                  onChange={e => setAgendaDate(e.target.value)}
                  className="p-2 bg-white dark:bg-zinc-800 border border-stone-100 dark:border-stone-700 rounded-xl text-xs outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowHoursConfig(!showHoursConfig)} 
                  className="bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-stone-100 dark:border-stone-700 px-5 py-3 rounded-2xl text-[9px] font-bold uppercase flex items-center gap-2 shadow-sm"
                >
                  <Clock size={16}/> Horários
                </button>
                <button onClick={() => setShowQuickBook(true)} className="bg-[#86BDB1] text-studio-ink px-5 py-3 rounded-2xl text-[9px] font-bold uppercase flex items-center gap-2 shadow-lg">
                  <PlusCircle size={16}/> Agendar
                </button>
              </div>
            </div>

            {showHoursConfig && (
              <div className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] p-8 rounded-[3rem] shadow-sm space-y-6 animate-in slide-in-from-top-4 duration-300">
                <div className="flex justify-between items-center pb-4 border-b border-[#F5E6DA]/30">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D4B499]">Configurar Funcionamento</h4>
                  <button onClick={() => setShowHoursConfig(false)}><X size={20} className="text-gray-400"/></button>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Dias de Atendimento</p>
                    <div className="flex flex-wrap gap-2">
                      {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, idx) => {
                        const dayValue = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][idx];
                        const isActive = salonConfig.businessHours.days.includes(dayValue);
                        return (
                          <button
                            key={day}
                            onClick={() => {
                              const newDays = isActive 
                                ? salonConfig.businessHours.days.filter(d => d !== dayValue)
                                : [...salonConfig.businessHours.days, dayValue];
                              updateSalonConfig({ businessHours: { ...salonConfig.businessHours, days: newDays } });
                            }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${isActive ? 'bg-[#D4B499] text-white' : 'bg-gray-50 text-gray-400'}`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[8px] font-bold text-gray-400 uppercase ml-1">Início</label>
                      <input 
                        type="time" 
                        value={salonConfig.businessHours.start} 
                        onChange={e => updateSalonConfig({ businessHours: { ...salonConfig.businessHours, start: e.target.value } })}
                        className="w-full p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-xs outline-none border border-transparent focus:border-[#D4B499]" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] font-bold text-gray-400 uppercase ml-1">Término</label>
                      <input 
                        type="time" 
                        value={salonConfig.businessHours.end} 
                        onChange={e => updateSalonConfig({ businessHours: { ...salonConfig.businessHours, end: e.target.value } })}
                        className="w-full p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-xs outline-none border border-transparent focus:border-[#D4B499]" 
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-stone-50 dark:border-stone-800">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Intervalo (Almoço)</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[8px] font-bold text-gray-400 uppercase ml-1">Início Intervalo</label>
                        <input 
                          type="time" 
                          value={salonConfig.businessHours.breakStart} 
                          onChange={e => updateSalonConfig({ businessHours: { ...salonConfig.businessHours, breakStart: e.target.value } })}
                          className="w-full p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-xs outline-none border border-transparent focus:border-[#D4B499]" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-bold text-gray-400 uppercase ml-1">Fim Intervalo</label>
                        <input 
                          type="time" 
                          value={salonConfig.businessHours.breakEnd} 
                          onChange={e => updateSalonConfig({ businessHours: { ...salonConfig.businessHours, breakEnd: e.target.value } })}
                          className="w-full p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-xs outline-none border border-transparent focus:border-[#D4B499]" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showQuickBook && (
               <div className="bg-[#FAF7F5] dark:bg-zinc-900 border-2 border-[#86BDB1] p-8 rounded-[3rem] shadow-2xl space-y-6">
                 <div className="flex justify-between items-center pb-4 border-b border-[#86BDB1]/20">
                    <h4 className="text-[10px] font-black uppercase text-[#86BDB1]">Agendamento Direto</h4>
                    <button onClick={() => setShowQuickBook(false)}><X size={20} className="text-gray-400"/></button>
                 </div>
                 <div className="grid gap-3">
                    <input placeholder="Cliente" value={qbData.name} onChange={e => setQbData({...qbData, name: e.target.value})} className="w-full p-4 bg-white dark:bg-zinc-800 rounded-2xl text-xs outline-none" />
                    <input placeholder="WhatsApp" value={qbData.phone} onChange={e => setQbData({...qbData, phone: e.target.value})} className="w-full p-4 bg-white dark:bg-zinc-800 rounded-2xl text-xs outline-none" />
                    <select value={qbData.serviceId} onChange={e => setQbData({...qbData, serviceId: e.target.value})} className="w-full p-4 bg-white dark:bg-zinc-800 rounded-2xl text-xs outline-none">
                      <option value="">Serviço</option>
                      {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <div className="grid grid-cols-2 gap-3">
                       <input type="date" value={qbData.date} onChange={e => setQbData({...qbData, date: e.target.value})} className="w-full p-4 bg-white dark:bg-zinc-800 rounded-2xl text-xs outline-none" />
                       <input type="time" value={qbData.time} onChange={e => setQbData({...qbData, time: e.target.value})} className="w-full p-4 bg-white dark:bg-zinc-800 rounded-2xl text-xs outline-none" />
                    </div>
                 </div>
                 <button onClick={handleQuickBook} className="w-full bg-[#86BDB1] text-studio-ink py-5 rounded-[2rem] font-bold uppercase text-[10px] tracking-widest shadow-xl">Confirmar</button>
               </div>
            )}

            {/* PENDING APPROVALS SECTION */}
            {appointments.some(a => a.status === 'pending') && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-500">Solicitações Pendentes</h4>
                </div>
                <div className="grid gap-4">
                  {appointments.filter(a => a.status === 'pending').map(app => {
                    const service = services.find(s => s.id === app.serviceId);
                    return (
                      <div key={app.id} className="bg-rose-50/30 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 p-6 rounded-[2.5rem] shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <span className="text-[8px] font-bold text-rose-400 uppercase tracking-[0.2em]">{service?.name}</span>
                            <h4 className="text-base font-serif font-bold dark:text-white">{app.clientName}</h4>
                            <p className="text-[9px] text-stone-500 font-medium flex items-center gap-1"><Phone size={10}/> {app.clientPhone}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => confirmAppointment(app.id)} className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg" title="Aprovar">
                              <Check size={20}/>
                            </button>
                            <button onClick={() => cancelAppointment(app.id)} className="w-10 h-10 bg-white dark:bg-zinc-800 text-rose-400 border border-rose-100 dark:border-rose-900/30 rounded-xl flex items-center justify-center shadow-sm" title="Recusar">
                              <X size={20}/>
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-3 bg-white/50 dark:bg-zinc-800/50 p-3 rounded-xl border border-rose-100/50 dark:border-rose-900/20">
                          <div className="flex-1">
                            <p className="text-[7px] font-bold text-stone-400 uppercase">Data</p>
                            <p className="text-[10px] font-bold dark:text-stone-200">{app.date.split('-').reverse().join('/')}</p>
                          </div>
                          <div className="flex-1 border-l border-rose-100 dark:border-rose-900/20 pl-3">
                            <p className="text-[7px] font-bold text-stone-400 uppercase">Hora</p>
                            <p className="text-[10px] font-bold dark:text-stone-200">{app.time}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {appointments
                .filter(a => a.date === agendaDate && a.status !== 'cancelled')
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(app => {
                const service = services.find(s => s.id === app.serviceId);
                return (
                  <div key={app.id} className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] dark:border-zinc-800 p-7 rounded-[3rem] shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-[#D4B499] uppercase tracking-widest">{service?.name}</span>
                        <h4 className="text-lg font-serif font-bold dark:text-white">{app.clientName}</h4>
                        <p className="text-[10px] text-gray-600 font-medium flex items-center gap-1"><Phone size={10}/> {app.clientPhone}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                         {app.status === 'pending' && (
                           <button onClick={() => confirmAppointment(app.id)} className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg" title="Confirmar Agendamento">
                              <CheckCircle size={22}/>
                           </button>
                         )}
                         {(app.status === 'confirmed' || app.status === 'in_service') && app.checkInStatus === 'checked_in' && (
                           <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                             <MapPin size={10}/> No Salão
                           </div>
                         )}
                         {app.status === 'in_service' && (
                           <button onClick={() => completeAppointment(app.id)} className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg" title="Concluir Serviço">
                              <Check size={22}/>
                           </button>
                         )}
                         <button onClick={() => cancelAppointment(app.id)} className="w-12 h-12 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center shadow-inner" title="Cancelar">
                            <XCircle size={22} />
                         </button>
                      </div>
                    </div>

                    {app.checkInPhoto && (
                      <div className="mt-2">
                        <p className="text-[8px] font-bold text-gray-600 uppercase mb-1">Foto do Check-in</p>
                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                          <img src={app.checkInPhoto} className="w-full h-full object-cover" alt="Check-in" />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 bg-[#FAF7F5] dark:bg-zinc-800 p-4 rounded-2xl border border-[#F5E6DA]/30">
                       <div className="flex-1">
                          <p className="text-[8px] font-bold text-gray-600 uppercase">Data</p>
                          <p className="text-xs font-bold dark:text-gray-200">{app.date.split('-').reverse().join('/')}</p>
                       </div>
                       <div className="flex-1 border-l border-[#F5E6DA] pl-3">
                          <p className="text-[8px] font-bold text-gray-600 uppercase">Hora</p>
                          <p className="text-xs font-bold dark:text-gray-200">{app.time}</p>
                       </div>
                       <div className="flex-1 border-l border-[#F5E6DA] pl-3">
                          <p className="text-[8px] font-bold text-gray-600 uppercase">Pagamento</p>
                          <button 
                            onClick={() => confirmPayment(app.id)}
                            disabled={app.paymentStatus === 'paid'}
                            className={`text-[9px] font-bold px-2 py-1 rounded-lg transition-all ${
                              app.paymentStatus === 'paid' 
                                ? 'bg-emerald-100 text-emerald-600' 
                                : app.paymentStatus === 'waiting_verification'
                                  ? 'bg-amber-400 text-white animate-pulse'
                                  : 'bg-amber-100 text-amber-600'
                            }`}
                          >
                            {app.paymentStatus === 'paid' ? 'Pago' : app.paymentStatus === 'waiting_verification' ? 'Confirmar?' : 'Pendente'}
                          </button>
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SERVICES MANAGEMENT */}
        {activeSubView === 'services' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-serif font-bold dark:text-white">Catálogo</h3>
              <button onClick={handleAddService} className="bg-[#D4B499] text-studio-ink px-5 py-3 rounded-2xl text-[9px] font-bold uppercase flex items-center gap-2 shadow-lg">
                <Plus size={16}/> Novo
              </button>
            </div>
            <div className="grid gap-4">
              {services.map(s => (
                <div key={s.id} className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] p-6 rounded-[2.5rem] shadow-sm space-y-4">
                  {editingService?.id === s.id ? (
                    <div className="space-y-4">
                      <input value={editingService.name} onChange={e => setEditingService({...editingService, name: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl text-xs" />
                      <textarea value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl text-xs" />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="number" value={editingService.price} onChange={e => setEditingService({...editingService, price: Number(e.target.value)})} className="p-3 bg-gray-50 rounded-xl text-xs" />
                        <input value={editingService.duration} onChange={e => setEditingService({...editingService, duration: e.target.value})} className="p-3 bg-gray-50 rounded-xl text-xs" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { updateService(s.id, editingService); setEditingService(null); }} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl text-[9px] font-bold uppercase">Salvar</button>
                        <button onClick={() => setEditingService(null)} className="flex-1 bg-gray-100 text-gray-400 py-3 rounded-xl text-[9px] font-bold uppercase">Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-sm dark:text-white">{s.name}</h4>
                          <p className="text-[10px] text-gray-600">{s.category} • {s.duration}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingService(s)} className="p-2 bg-gray-50 rounded-lg text-gray-400"><Settings size={14}/></button>
                          <button onClick={() => deleteService(s.id)} className="p-2 bg-red-50 rounded-lg text-red-400"><Trash2 size={14}/></button>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-700 italic">{s.description}</p>
                      <p className="text-xs font-bold text-[#D4B499]">R$ {s.price}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROMOTIONS / OFFERS */}
        {activeSubView === 'offers' && (
          <div className="space-y-8">
            <h3 className="text-xl font-serif font-bold dark:text-white px-2">Promoções da Semana</h3>
            <div className="grid gap-6">
              {weeklyOffers.map(offer => (
                <div key={offer.day} className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] p-6 rounded-[2.5rem] shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm dark:text-white">{offer.title}</h4>
                    <button 
                      onClick={() => updateWeeklyOffer(offer.day, { active: !offer.active })}
                      className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase ${offer.active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {offer.active ? 'Ativo' : 'Inativo'}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {offer.offers.map((o, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[10px] bg-gray-50 p-3 rounded-xl">
                        <span>{o.name}</span>
                        <span className="font-bold text-[#D4B499]">R$ {o.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VOUCHERS */}
        {activeSubView === 'vouchers' && (
          <div className="space-y-8">
            <h3 className="text-xl font-serif font-bold dark:text-white px-2">Gerenciar Vouchers</h3>
            <div className="grid gap-4">
              {vouchers.map(v => (
                <div key={v.id} className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] p-6 rounded-[2.5rem] shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm dark:text-white">{v.name}</h4>
                      <p className="text-[10px] text-gray-600">{v.description}</p>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => redeemVoucher(v.id)} className="p-3 bg-emerald-50 text-emerald-500 rounded-xl shadow-sm">
                         <CheckCircle size={20}/>
                       </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#D4B499]" style={{ width: `${(v.redeemed / v.limit) * 100}%` }} />
                    </div>
                    <div className="flex items-center gap-2">
                       <input 
                         type="number" 
                         value={v.limit} 
                         onChange={e => updateVoucher(v.id, { limit: Number(e.target.value) })}
                         className="w-16 p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg text-xs text-center border border-stone-100 dark:border-stone-700"
                       />
                       <span className="text-[10px] font-bold text-gray-600">Limite</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-600">{v.redeemed}/{v.limit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS / CLIENTS */}
        {activeSubView === 'users' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-serif font-bold dark:text-white">Base de Clientes</h3>
              <button onClick={() => setShowAddUser(true)} className="bg-[#D4B499] text-studio-ink px-5 py-3 rounded-2xl text-[9px] font-bold uppercase flex items-center gap-2 shadow-lg">
                <Plus size={16}/> Novo Cliente
              </button>
            </div>

            {showAddUser && (
               <div className="bg-[#FAF7F5] dark:bg-zinc-900 border-2 border-[#D4B499] p-8 rounded-[3rem] shadow-2xl space-y-6">
                 <div className="flex justify-between items-center pb-4 border-b border-[#D4B499]/20">
                    <h4 className="text-[10px] font-black uppercase text-[#D4B499]">Novo Cliente</h4>
                    <button onClick={() => setShowAddUser(false)}><X size={20} className="text-gray-400"/></button>
                 </div>
                 <div className="grid gap-3">
                    <input placeholder="Nome" value={newUserData.name} onChange={e => setNewUserData({...newUserData, name: e.target.value})} className="w-full p-4 bg-white dark:bg-zinc-800 rounded-2xl text-xs outline-none" />
                    <input placeholder="WhatsApp" value={newUserData.phone} onChange={e => setNewUserData({...newUserData, phone: e.target.value})} className="w-full p-4 bg-white dark:bg-zinc-800 rounded-2xl text-xs outline-none" />
                    <input type="date" placeholder="Nascimento" value={newUserData.birthDate} onChange={e => setNewUserData({...newUserData, birthDate: e.target.value})} className="w-full p-4 bg-white dark:bg-zinc-800 rounded-2xl text-xs outline-none" />
                 </div>
                 <button onClick={handleAddUser} className="w-full bg-[#D4B499] text-studio-ink py-5 rounded-[2rem] font-bold uppercase text-[10px] tracking-widest shadow-xl">Cadastrar</button>
               </div>
            )}

            <div className="grid gap-4">
              {allUsers.map(u => (
                <div key={u.id} className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] p-6 rounded-[2.5rem] shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm dark:text-white">{u.name}</h4>
                      <p className="text-[10px] text-gray-600">{u.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-[#FAF7F5] px-3 py-1 rounded-lg text-[9px] font-bold text-[#D4B499]">
                        {u.points.escovas + u.points.manicurePedicure + u.points.ciliosManutencao} pts
                      </div>
                      <button onClick={() => deleteUser(u.id)} className="p-2 bg-red-50 text-red-400 rounded-lg">
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </div>
                  {u.permanentPreferences && (
                    <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                       <p className="text-[9px] font-bold text-gray-600 uppercase">Preferências</p>
                       <p className="text-[10px] text-gray-700 italic">Ambiente: {u.permanentPreferences.environment}</p>
                       <p className="text-[10px] text-gray-700 italic">Bebida: {u.permanentPreferences.refreshment}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => sendNotification(`Olá ${u.name.split(' ')[0]}!`, "Temos um presente para você no Studio. Vem ver! 🎁", "promo")} className="flex-1 bg-gray-100 py-3 rounded-xl text-[9px] font-bold uppercase text-gray-600">Notificar</button>
                    <button onClick={() => {
                      const newPoints = { ...u.points, escovas: u.points.escovas + 1 };
                      updateUserPoints(u.id, newPoints);
                    }} className="flex-1 bg-[#D4B499] text-studio-ink py-3 rounded-xl text-[9px] font-bold uppercase">+1 Ponto</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LOYALTY CLUB MANAGEMENT */}
        {activeSubView === 'loyalty' && (
          <div className="space-y-8">
            <div className="px-2">
              <h3 className="text-xl font-serif font-bold dark:text-white">Clube de Pontos</h3>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Gerencie benefícios e cartões fidelidade</p>
            </div>

            {/* Social Media & Referral */}
            <div className="grid gap-6">
              <div className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] p-8 rounded-[3rem] shadow-sm space-y-6">
                <div className="flex items-center gap-3 text-rose-500">
                  <Instagram size={20} />
                  <h4 className="text-sm font-bold uppercase tracking-tight">Social Media Star</h4>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Desconto (%)</label>
                    <input 
                      value={salonConfig.loyaltyClub.socialMediaStar.discount} 
                      onChange={e => updateSalonConfig({ loyaltyClub: { ...salonConfig.loyaltyClub, socialMediaStar: { ...salonConfig.loyaltyClub.socialMediaStar, discount: e.target.value } } })}
                      className="w-full p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-xs outline-none border border-transparent focus:border-rose-300" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Regra / Texto</label>
                    <textarea 
                      value={salonConfig.loyaltyClub.socialMediaStar.rule} 
                      onChange={e => updateSalonConfig({ loyaltyClub: { ...salonConfig.loyaltyClub, socialMediaStar: { ...salonConfig.loyaltyClub.socialMediaStar, rule: e.target.value } } })}
                      className="w-full p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-xs outline-none border border-transparent focus:border-rose-300 h-24" 
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] p-8 rounded-[3rem] shadow-sm space-y-6">
                <div className="flex items-center gap-3 text-emerald-500">
                  <Gift size={20} />
                  <h4 className="text-sm font-bold uppercase tracking-tight">Indique e Ganhe</h4>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Desconto (%)</label>
                    <input 
                      value={salonConfig.loyaltyClub.referral.discount} 
                      onChange={e => updateSalonConfig({ loyaltyClub: { ...salonConfig.loyaltyClub, referral: { ...salonConfig.loyaltyClub.referral, discount: e.target.value } } })}
                      className="w-full p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-xs outline-none border border-transparent focus:border-emerald-300" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Regra / Texto</label>
                    <textarea 
                      value={salonConfig.loyaltyClub.referral.rule} 
                      onChange={e => updateSalonConfig({ loyaltyClub: { ...salonConfig.loyaltyClub, referral: { ...salonConfig.loyaltyClub.referral, rule: e.target.value } } })}
                      className="w-full p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-xs outline-none border border-transparent focus:border-emerald-300 h-24" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Loyalty Cards */}
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <h4 className="text-sm font-bold dark:text-white uppercase tracking-widest">Cartões de Pontos</h4>
              </div>
              <div className="grid gap-4">
                {salonConfig.loyaltyClub.cards.map((card, idx) => (
                  <div key={card.id} className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] p-8 rounded-[3rem] shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                      <h5 className="text-xs font-bold text-[#D4B499] uppercase tracking-widest">Cartão {idx + 1}</h5>
                      <span className="text-[8px] font-bold bg-gray-100 px-2 py-1 rounded-lg text-gray-400 uppercase">{card.category}</span>
                    </div>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Nome do Cartão</label>
                        <input 
                          value={card.name} 
                          onChange={e => {
                            const newCards = [...salonConfig.loyaltyClub.cards];
                            newCards[idx] = { ...card, name: e.target.value };
                            updateSalonConfig({ loyaltyClub: { ...salonConfig.loyaltyClub, cards: newCards } });
                          }}
                          className="w-full p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-xs outline-none" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Meta (Procedimentos)</label>
                          <input 
                            type="number"
                            value={card.target} 
                            onChange={e => {
                              const newCards = [...salonConfig.loyaltyClub.cards];
                              newCards[idx] = { ...card, target: Number(e.target.value) };
                              updateSalonConfig({ loyaltyClub: { ...salonConfig.loyaltyClub, cards: newCards } });
                            }}
                            className="w-full p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-xs outline-none" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Prêmio</label>
                          <input 
                            value={card.reward} 
                            onChange={e => {
                              const newCards = [...salonConfig.loyaltyClub.cards];
                              newCards[idx] = { ...card, reward: e.target.value };
                              updateSalonConfig({ loyaltyClub: { ...salonConfig.loyaltyClub, cards: newCards } });
                            }}
                            className="w-full p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-xs outline-none" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button onClick={() => alert('Configurações do Clube salvas!')} className="w-full bg-[#D4B499] text-studio-ink py-5 rounded-[2rem] font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl"><Save size={16}/> Salvar Clube de Pontos</button>
          </div>
        )}

        {/* GALLERY */}
        {activeSubView === 'gallery' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] p-8 rounded-[3rem] shadow-sm space-y-6">
               <h3 className="text-xl font-serif font-bold dark:text-white">Adicionar Foto</h3>
               <div className="space-y-4">
                  <input placeholder="Link da Imagem" value={galleryUrl} onChange={e => setGalleryUrl(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl text-xs" />
                  <div className="grid grid-cols-2 gap-2">
                     {['Cabelo', 'Unhas', 'Cílios', 'Antes e Depois', 'Linhas de Produtos'].map(cat => (
                       <button key={cat} onClick={() => setGalleryCat(cat as any)} className={`py-3 rounded-xl text-[9px] font-bold uppercase border ${galleryCat === cat ? 'bg-[#D4B499] text-studio-ink' : 'bg-white text-gray-600'}`}>{cat}</button>
                     ))}
                  </div>
                  <button onClick={() => { addGalleryItem(galleryUrl, galleryCat); setGalleryUrl(''); }} className="w-full bg-[#D4B499] text-studio-ink py-5 rounded-[2rem] font-bold uppercase text-[10px] tracking-widest">Postar</button>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {galleryItems.map(item => (
                <div key={item.id} className="relative aspect-square rounded-[2rem] overflow-hidden border border-[#F5E6DA]">
                  <img src={item.imageUrl} className="w-full h-full object-cover" />
                  <button onClick={() => deleteGalleryItem(item.id)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-xl"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONFIG / LAYOUT */}
        {activeSubView === 'config' && (
          <div className="space-y-8">
            <h3 className="text-xl font-serif font-bold dark:text-white px-2">Layout & Textos</h3>
            <div className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] p-8 rounded-[3rem] space-y-6">
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-gray-600 uppercase">Título Hero</label>
                    <input value={salonConfig.dynamicText.heroTitle} onChange={e => updateSalonConfig({ dynamicText: { ...salonConfig.dynamicText, heroTitle: e.target.value } })} className="w-full p-4 bg-gray-50 rounded-2xl text-xs" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-gray-600 uppercase">Subtítulo Hero</label>
                    <textarea value={salonConfig.dynamicText.heroSubtitle} onChange={e => updateSalonConfig({ dynamicText: { ...salonConfig.dynamicText, heroSubtitle: e.target.value } })} className="w-full p-4 bg-gray-50 rounded-2xl text-xs" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Cor Primária</label>
                    <div className="flex gap-4 items-center">
                      <input type="color" value={salonConfig.colors.primary} onChange={e => updateSalonConfig({ colors: { ...salonConfig.colors, primary: e.target.value } })} className="w-12 h-12 rounded-xl overflow-hidden" />
                      <span className="text-xs font-mono">{salonConfig.colors.primary}</span>
                    </div>
                  </div>
               </div>
               <button onClick={() => alert('Configurações salvas!')} className="w-full bg-[#D4B499] text-studio-ink py-5 rounded-[2rem] font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"><Save size={16}/> Salvar Alterações</button>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] p-8 rounded-[3rem] space-y-6">
               <h3 className="text-xl font-serif font-bold dark:text-white">Contatos do Chat</h3>
               <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Configure os profissionais que aparecem no chat</p>
               
               <div className="space-y-6">
                 {/* Prof 1 - Cabelo */}
                 <div className="p-6 bg-rose-50/30 dark:bg-rose-900/10 rounded-[2rem] border border-rose-100 dark:border-rose-900/20 space-y-4">
                   <p className="text-[9px] font-black uppercase tracking-widest text-rose-400">Profissional 1 (Cabelo)</p>
                   <div className="grid grid-cols-2 gap-3">
                     <div className="space-y-1">
                       <label className="text-[8px] font-bold text-gray-400 uppercase ml-1">Nome</label>
                       <input 
                         value={salonConfig.professionals.prof1_nome} 
                         onChange={e => updateSalonConfig({ professionals: { ...salonConfig.professionals, prof1_nome: e.target.value } })} 
                         className="w-full p-3 bg-white dark:bg-zinc-800 rounded-xl text-xs outline-none border border-transparent focus:border-rose-300" 
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[8px] font-bold text-gray-400 uppercase ml-1">WhatsApp</label>
                       <input 
                         value={salonConfig.professionals.prof1_whats} 
                         onChange={e => updateSalonConfig({ professionals: { ...salonConfig.professionals, prof1_whats: e.target.value } })} 
                         className="w-full p-3 bg-white dark:bg-zinc-800 rounded-xl text-xs outline-none border border-transparent focus:border-rose-300" 
                       />
                     </div>
                   </div>
                 </div>

                 {/* Prof 2 - Olhar */}
                 <div className="p-6 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/20 space-y-4">
                   <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Profissional 2 (Olhar)</p>
                   <div className="grid grid-cols-2 gap-3">
                     <div className="space-y-1">
                       <label className="text-[8px] font-bold text-gray-400 uppercase ml-1">Nome</label>
                       <input 
                         value={salonConfig.professionals.prof2_nome} 
                         onChange={e => updateSalonConfig({ professionals: { ...salonConfig.professionals, prof2_nome: e.target.value } })} 
                         className="w-full p-3 bg-white dark:bg-zinc-800 rounded-xl text-xs outline-none border border-transparent focus:border-indigo-300" 
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[8px] font-bold text-gray-400 uppercase ml-1">WhatsApp</label>
                       <input 
                         value={salonConfig.professionals.prof2_whats} 
                         onChange={e => updateSalonConfig({ professionals: { ...salonConfig.professionals, prof2_whats: e.target.value } })} 
                         className="w-full p-3 bg-white dark:bg-zinc-800 rounded-xl text-xs outline-none border border-transparent focus:border-indigo-300" 
                       />
                     </div>
                   </div>
                 </div>

                 {/* Prof 3 - Manicure */}
                 <div className="p-6 bg-emerald-50/30 dark:bg-emerald-900/10 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/20 space-y-4">
                   <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Profissional 3 (Manicure)</p>
                   <div className="grid grid-cols-2 gap-3">
                     <div className="space-y-1">
                       <label className="text-[8px] font-bold text-gray-400 uppercase ml-1">Nome</label>
                       <input 
                         value={salonConfig.professionals.prof3_nome} 
                         onChange={e => updateSalonConfig({ professionals: { ...salonConfig.professionals, prof3_nome: e.target.value } })} 
                         className="w-full p-3 bg-white dark:bg-zinc-800 rounded-xl text-xs outline-none border border-transparent focus:border-emerald-300" 
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[8px] font-bold text-gray-400 uppercase ml-1">WhatsApp</label>
                       <input 
                         value={salonConfig.professionals.prof3_whats} 
                         onChange={e => updateSalonConfig({ professionals: { ...salonConfig.professionals, prof3_whats: e.target.value } })} 
                         className="w-full p-3 bg-white dark:bg-zinc-800 rounded-xl text-xs outline-none border border-transparent focus:border-emerald-300" 
                       />
                     </div>
                   </div>
                 </div>
               </div>

               <button 
                 onClick={() => {
                   const clean = (num: string) => num.replace(/\D/g, '');
                   updateSalonConfig({
                     professionals: {
                       ...salonConfig.professionals,
                       prof1_whats: clean(salonConfig.professionals.prof1_whats),
                       prof2_whats: clean(salonConfig.professionals.prof2_whats),
                       prof3_whats: clean(salonConfig.professionals.prof3_whats),
                     }
                   });
                   alert('Dados dos profissionais atualizados!');
                 }} 
                 className="w-full bg-studio-ink text-white py-5 rounded-[2rem] font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
               >
                 <Save size={16}/> Salvar Contatos
               </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] p-8 rounded-[3rem] space-y-6">
               <h4 className="text-sm font-bold dark:text-white">Notificação em Massa</h4>
               <div className="space-y-4">
                  <input placeholder="Título" value={notifData.title} onChange={e => setNotifData({...notifData, title: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl text-xs" />
                  <textarea placeholder="Mensagem..." value={notifData.body} onChange={e => setNotifData({...notifData, body: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl text-xs" />
                  <button onClick={handleSendCustomNotif} className="w-full bg-[#86BDB1] text-studio-ink py-5 rounded-[2rem] font-bold uppercase text-[10px] tracking-widest">Enviar para Todos</button>
               </div>
            </div>
          </div>
        )}

        {/* REPORTS */}
        {activeSubView === 'reports' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
              <h3 className="text-xl font-serif font-bold dark:text-white">Relatórios Avançados</h3>
              <div className="flex gap-2 w-full sm:w-auto">
                <input 
                  type="date" 
                  value={reportStart} 
                  onChange={e => setReportStart(e.target.value)}
                  className="flex-1 p-2 bg-white dark:bg-zinc-800 border border-stone-100 dark:border-stone-700 rounded-xl text-[10px] outline-none"
                />
                <input 
                  type="date" 
                  value={reportEnd} 
                  onChange={e => setReportEnd(e.target.value)}
                  className="flex-1 p-2 bg-white dark:bg-zinc-800 border border-stone-100 dark:border-stone-700 rounded-xl text-[10px] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-[#F5E6DA] text-center space-y-1">
                <p className="text-[9px] font-bold text-gray-400 uppercase">Total Reservas</p>
                <p className="text-2xl font-serif font-bold text-[#D4B499]">{reports.totalAppointments}</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-[#F5E6DA] text-center space-y-1">
                <p className="text-[9px] font-bold text-gray-400 uppercase">Faturamento</p>
                <p className="text-2xl font-serif font-bold text-emerald-500">R$ {reports.totalRevenue}</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-[#F5E6DA] text-center space-y-1">
                <p className="text-[9px] font-bold text-gray-400 uppercase">Vouchers</p>
                <p className="text-2xl font-serif font-bold text-blue-500">{reports.vouchersUsed}</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-[#F5E6DA] text-center space-y-1">
                <p className="text-[9px] font-bold text-gray-400 uppercase">Aniversários</p>
                <p className="text-2xl font-serif font-bold text-rose-500">{reports.birthdayClients.length}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
               <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-[#F5E6DA] space-y-6">
                  <h4 className="text-sm font-bold dark:text-white flex items-center gap-2"><Scissors size={16}/> Serviços por Tipo</h4>
                  <div className="space-y-4">
                     {reports.serviceCounts.map(([name, count], idx) => (
                       <div key={idx} className="flex items-center justify-between">
                         <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{name}</span>
                         <span className="text-[10px] font-bold bg-gray-50 dark:bg-zinc-800 px-2 py-1 rounded-lg text-gray-400">{count} agend.</span>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-[#F5E6DA] space-y-6">
                  <h4 className="text-sm font-bold dark:text-white flex items-center gap-2"><CreditCard size={16}/> Faturamento Profissional</h4>
                  <div className="space-y-4">
                     {Object.entries(reports.professionalRevenue).map(([name, revenue], idx) => (
                       <div key={idx} className="flex items-center justify-between">
                         <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{name}</span>
                         <span className="text-[10px] font-bold text-emerald-500">R$ {revenue}</span>
                       </div>
                     ))}
                  </div>
                  <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
                    <p className="text-[9px] font-bold text-stone-400 uppercase">Por Método de Pagamento</p>
                    {Object.entries(reports.paymentMethods).map(([method, value]) => (
                      <div key={method} className="flex justify-between items-center">
                        <span className="text-[10px] text-stone-500 uppercase">{method}</span>
                        <span className="text-[10px] font-bold dark:text-white">R$ {value}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
               <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-[#F5E6DA] space-y-6">
                  <h4 className="text-sm font-bold dark:text-white flex items-center gap-2"><Users size={16}/> Retenção de Clientes</h4>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-stone-50 dark:bg-zinc-800 p-4 rounded-2xl text-center">
                        <p className="text-[8px] font-bold text-gray-400 uppercase">Sem visita +30d</p>
                        <p className="text-xl font-bold text-amber-500">{reports.inactive30}</p>
                     </div>
                     <div className="bg-stone-50 dark:bg-zinc-800 p-4 rounded-2xl text-center">
                        <p className="text-[8px] font-bold text-gray-400 uppercase">Sem visita +60d</p>
                        <p className="text-xl font-bold text-rose-500">{reports.inactive60}</p>
                     </div>
                  </div>
               </div>

               <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-[#F5E6DA] space-y-6">
                  <h4 className="text-sm font-bold dark:text-white flex items-center gap-2"><Calendar size={16}/> Aniversariantes do Mês</h4>
                  <div className="max-h-40 overflow-y-auto no-scrollbar space-y-3">
                     {reports.birthdayClients.map(u => (
                       <div key={u.id} className="flex items-center justify-between p-3 bg-stone-50 dark:bg-zinc-800 rounded-xl">
                         <span className="text-xs font-medium dark:text-white">{u.name}</span>
                         <span className="text-[10px] text-rose-400 font-bold">{u.birthDate.split('-').reverse().slice(0, 2).join('/')}</span>
                       </div>
                     ))}
                     {reports.birthdayClients.length === 0 && <p className="text-xs text-gray-400 italic">Nenhum aniversariante este mês.</p>}
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      <footer className="fixed bottom-24 left-6 right-6 flex gap-4">
         <button onClick={onGoToChat} className="flex-1 bg-white dark:bg-zinc-900 border border-[#F5E6DA] py-5 rounded-[2rem] shadow-xl text-[#D4B499] font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-3">
           <MessageCircle size={20}/> Chat
         </button>
         <button onClick={() => setActiveSubView('config')} className="flex-1 bg-[#86BDB1] py-5 rounded-[2rem] shadow-xl text-studio-ink font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-3">
           <Megaphone size={20}/> Notificar
         </button>
      </footer>
    </div>
  );
};

export default AdminView;
