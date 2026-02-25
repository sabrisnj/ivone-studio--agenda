
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
  ChevronDown
} from 'lucide-react';

interface AdminViewProps {
  onGoToChat?: () => void;
}

type AdminSubView = 'ops' | 'services' | 'offers' | 'vouchers' | 'users' | 'gallery' | 'config' | 'reports';

const AdminView: React.FC<AdminViewProps> = ({ onGoToChat }) => {
  const { 
    allUsers, appointments, confirmAppointment, completeAppointment, cancelAppointment, confirmPayment,
    sendNotification, services, galleryItems, addGalleryItem, deleteGalleryItem, addAppointment,
    addService, updateService, deleteService, vouchers, updateVoucher, redeemVoucher,
    salonConfig, updateSalonConfig, weeklyOffers, updateWeeklyOffer, updateUserPoints
  } = useApp();
  
  const [activeSubView, setActiveSubView] = useState<AdminSubView>('ops');
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  
  // Forms State
  const [showQuickBook, setShowQuickBook] = useState(false);
  const [qbData, setQbData] = useState({ name: '', phone: '', serviceId: '', date: '', time: '' });

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
    const serviceCounts: Record<string, number> = {};
    appointments.forEach(a => {
      serviceCounts[a.serviceId] = (serviceCounts[a.serviceId] || 0) + 1;
    });
    const topServices = Object.entries(serviceCounts)
      .map(([id, count]) => ({ name: services.find(s => s.id === id)?.name || 'Unknown', count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalAppointments: appointments.length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      topServices
    };
  }, [appointments, services]);

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
            className="w-full bg-[#D4B499] text-white py-6 rounded-[2rem] font-bold uppercase text-[11px] tracking-widest shadow-xl active:scale-95 transition-all"
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
        <button onClick={() => setIsLocked(true)} className="p-3 bg-gray-100 dark:bg-zinc-800 rounded-2xl text-gray-400">
          <Lock size={20} />
        </button>
      </header>

      {/* SUB-NAV */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar bg-gray-100 dark:bg-zinc-900 p-1.5 rounded-[2rem] border border-[#F5E6DA]/30">
        {[
          {id: 'ops', label: 'Agenda', icon: Calendar},
          {id: 'services', label: 'Serviços', icon: Scissors},
          {id: 'offers', label: 'Promo', icon: Tag},
          {id: 'vouchers', label: 'Vouchers', icon: Ticket},
          {id: 'users', label: 'Clientes', icon: Users},
          {id: 'gallery', label: 'Galeria', icon: ImageIcon},
          {id: 'config', label: 'Config', icon: Settings},
          {id: 'reports', label: 'Relatórios', icon: BarChart3}
        ].map(nav => (
          <button 
            key={nav.id}
            onClick={() => setActiveSubView(nav.id as any)}
            className={`px-6 py-4 rounded-3xl text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeSubView === nav.id ? 'bg-white dark:bg-zinc-800 text-[#D4B499] shadow-md' : 'text-gray-400'}`}
          >
            <nav.icon size={14}/> {nav.label}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {/* OPERATIONS / AGENDA */}
        {activeSubView === 'ops' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-serif font-bold dark:text-white">Horários</h3>
              <button onClick={() => setShowQuickBook(true)} className="bg-[#86BDB1] text-white px-5 py-3 rounded-2xl text-[9px] font-bold uppercase flex items-center gap-2 shadow-lg">
                <PlusCircle size={16}/> Agendar
              </button>
            </div>

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
                 <button onClick={handleQuickBook} className="w-full bg-[#86BDB1] text-white py-5 rounded-[2rem] font-bold uppercase text-[10px] tracking-widest shadow-xl">Confirmar</button>
               </div>
            )}

            <div className="grid gap-4">
              {appointments.filter(a => a.status !== 'completed' && a.status !== 'cancelled').reverse().map(app => {
                const service = services.find(s => s.id === app.serviceId);
                return (
                  <div key={app.id} className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] dark:border-zinc-800 p-7 rounded-[3rem] shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-[#D4B499] uppercase tracking-widest">{service?.name}</span>
                        <h4 className="text-lg font-serif font-bold dark:text-white">{app.clientName}</h4>
                        <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1"><Phone size={10}/> {app.clientPhone}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                         {app.status === 'pending' && (
                           <button onClick={() => confirmAppointment(app.id)} className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                              <CheckCircle size={22}/>
                           </button>
                         )}
                         {app.status === 'confirmed' && (
                           <button onClick={() => completeAppointment(app.id)} className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                              <Check size={22}/>
                           </button>
                         )}
                         <button onClick={() => cancelAppointment(app.id)} className="w-12 h-12 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center shadow-inner">
                            <XCircle size={22} />
                         </button>
                      </div>
                    </div>
                    <div className="flex gap-3 bg-[#FAF7F5] dark:bg-zinc-800 p-4 rounded-2xl border border-[#F5E6DA]/30">
                       <div className="flex-1">
                          <p className="text-[8px] font-bold text-gray-400 uppercase">Data</p>
                          <p className="text-xs font-bold dark:text-gray-200">{app.date.split('-').reverse().join('/')}</p>
                       </div>
                       <div className="flex-1 border-l border-[#F5E6DA] pl-3">
                          <p className="text-[8px] font-bold text-gray-400 uppercase">Hora</p>
                          <p className="text-xs font-bold dark:text-gray-200">{app.time}</p>
                       </div>
                       <div className="flex-1 border-l border-[#F5E6DA] pl-3">
                          <p className="text-[8px] font-bold text-gray-400 uppercase">Pagamento</p>
                          <button 
                            onClick={() => confirmPayment(app.id)}
                            className={`text-[9px] font-bold px-2 py-1 rounded-lg ${app.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}
                          >
                            {app.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}
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
              <button onClick={handleAddService} className="bg-[#D4B499] text-white px-5 py-3 rounded-2xl text-[9px] font-bold uppercase flex items-center gap-2 shadow-lg">
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
                          <p className="text-[10px] text-gray-400">{s.category} • {s.duration}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingService(s)} className="p-2 bg-gray-50 rounded-lg text-gray-400"><Settings size={14}/></button>
                          <button onClick={() => deleteService(s.id)} className="p-2 bg-red-50 rounded-lg text-red-400"><Trash2 size={14}/></button>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500 italic">{s.description}</p>
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
                      className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase ${offer.active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}
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
                      <p className="text-[10px] text-gray-400">{v.description}</p>
                    </div>
                    <button onClick={() => redeemVoucher(v.id)} className="p-3 bg-emerald-50 text-emerald-500 rounded-xl shadow-sm">
                      <CheckCircle size={20}/>
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#D4B499]" style={{ width: `${(v.redeemed / v.limit) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">{v.redeemed}/{v.limit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS / CLIENTS */}
        {activeSubView === 'users' && (
          <div className="space-y-8">
            <h3 className="text-xl font-serif font-bold dark:text-white px-2">Base de Clientes</h3>
            <div className="grid gap-4">
              {allUsers.map(u => (
                <div key={u.id} className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] p-6 rounded-[2.5rem] shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm dark:text-white">{u.name}</h4>
                      <p className="text-[10px] text-gray-400">{u.phone}</p>
                    </div>
                    <div className="bg-[#FAF7F5] px-3 py-1 rounded-lg text-[9px] font-bold text-[#D4B499]">
                      {u.points.escovas + u.points.manicurePedicure + u.points.ciliosManutencao} pts
                    </div>
                  </div>
                  {u.permanentPreferences && (
                    <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                       <p className="text-[9px] font-bold text-gray-400 uppercase">Preferências</p>
                       <p className="text-[10px] text-gray-600 italic">Ambiente: {u.permanentPreferences.environment}</p>
                       <p className="text-[10px] text-gray-600 italic">Bebida: {u.permanentPreferences.refreshment}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => sendNotification(`Olá ${u.name.split(' ')[0]}!`, "Temos um presente para você no Studio. Vem ver! 🎁", "promo")} className="flex-1 bg-gray-100 py-3 rounded-xl text-[9px] font-bold uppercase text-gray-500">Notificar</button>
                    <button onClick={() => {
                      const newPoints = { ...u.points, escovas: u.points.escovas + 1 };
                      updateUserPoints(u.id, newPoints);
                    }} className="flex-1 bg-[#D4B499] text-white py-3 rounded-xl text-[9px] font-bold uppercase">+1 Ponto</button>
                  </div>
                </div>
              ))}
            </div>
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
                     {['Cabelo', 'Unhas', 'Cílios', 'Antes e Depois'].map(cat => (
                       <button key={cat} onClick={() => setGalleryCat(cat as any)} className={`py-3 rounded-xl text-[9px] font-bold uppercase border ${galleryCat === cat ? 'bg-[#D4B499] text-white' : 'bg-white text-gray-400'}`}>{cat}</button>
                     ))}
                  </div>
                  <button onClick={() => { addGalleryItem(galleryUrl, galleryCat); setGalleryUrl(''); }} className="w-full bg-[#D4B499] text-white py-5 rounded-[2rem] font-bold uppercase text-[10px] tracking-widest">Postar</button>
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
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Título Hero</label>
                    <input value={salonConfig.dynamicText.heroTitle} onChange={e => updateSalonConfig({ dynamicText: { ...salonConfig.dynamicText, heroTitle: e.target.value } })} className="w-full p-4 bg-gray-50 rounded-2xl text-xs" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Subtítulo Hero</label>
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
               <button onClick={() => alert('Configurações salvas!')} className="w-full bg-[#D4B499] text-white py-5 rounded-[2rem] font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"><Save size={16}/> Salvar Alterações</button>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] p-8 rounded-[3rem] space-y-6">
               <h4 className="text-sm font-bold dark:text-white">Notificação em Massa</h4>
               <div className="space-y-4">
                  <input placeholder="Título" value={notifData.title} onChange={e => setNotifData({...notifData, title: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl text-xs" />
                  <textarea placeholder="Mensagem..." value={notifData.body} onChange={e => setNotifData({...notifData, body: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl text-xs" />
                  <button onClick={handleSendCustomNotif} className="w-full bg-[#86BDB1] text-white py-5 rounded-[2rem] font-bold uppercase text-[10px] tracking-widest">Enviar para Todos</button>
               </div>
            </div>
          </div>
        )}

        {/* REPORTS */}
        {activeSubView === 'reports' && (
          <div className="space-y-8">
            <h3 className="text-xl font-serif font-bold dark:text-white px-2">Relatórios</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-[#F5E6DA] text-center space-y-1">
                <p className="text-[9px] font-bold text-gray-400 uppercase">Total Reservas</p>
                <p className="text-3xl font-serif font-bold text-[#D4B499]">{reports.totalAppointments}</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-[#F5E6DA] text-center space-y-1">
                <p className="text-[9px] font-bold text-gray-400 uppercase">Concluídos</p>
                <p className="text-3xl font-serif font-bold text-emerald-500">{reports.completed}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-[#F5E6DA] space-y-6">
               <h4 className="text-sm font-bold dark:text-white">Serviços mais procurados</h4>
               <div className="space-y-4">
                  {reports.topServices.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-gray-300">0{idx + 1}</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{s.name}</span>
                      </div>
                      <span className="text-[10px] font-bold bg-gray-50 px-2 py-1 rounded-lg text-gray-400">{s.count} agend.</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}
      </div>

      <footer className="fixed bottom-24 left-6 right-6 flex gap-4">
         <button onClick={onGoToChat} className="flex-1 bg-white dark:bg-zinc-900 border border-[#F5E6DA] py-5 rounded-[2rem] shadow-xl text-[#D4B499] font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-3">
           <MessageCircle size={20}/> Chat
         </button>
         <button onClick={() => setActiveSubView('config')} className="flex-1 bg-[#86BDB1] py-5 rounded-[2rem] shadow-xl text-white font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-3">
           <Megaphone size={20}/> Notificar
         </button>
      </footer>
    </div>
  );
};

export default AdminView;
