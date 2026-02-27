
import React, { useRef, useState } from 'react';
import { useApp } from '../store';
import { ServiceCategory, Service, Appointment } from '../types';
import { SALON_INFO, WEEKLY_OFFERS } from '../constants';
import { 
  Leaf,
  Sparkles,
  Scissors,
  QrCode,
  ChevronRight,
  MessageCircle,
  RefreshCw,
  Camera,
  Eye,
  Flower,
  Palette,
  Instagram,
  Heart,
  Wind,
  Plus,
  Calendar,
  MapPin,
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  Wallet
} from 'lucide-react';

interface HomeViewProps {
  onQuickRebook: (serviceId: string) => void;
  onGoToAdmin?: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onQuickRebook }) => {
  const { user, salonConfig, services, appointments, performCheckIn, payAppointment, weeklyOffers } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Active appointment for today
  const activeApp = appointments.find(a => 
    a.clientPhone === user?.phone && 
    a.date === todayStr && 
    ['confirmed', 'in_service'].includes(a.status) &&
    a.status !== 'completed' &&
    a.status !== 'cancelled'
  );

  const handlePhotoCheckIn = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeApp) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        performCheckIn(activeApp.id, reader.result as string);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimpleCheckIn = () => {
    if (activeApp) {
      performCheckIn(activeApp.id);
    }
  };

  const handlePayment = (method: 'debito' | 'credito' | 'pix') => {
    if (activeApp) {
      if (method === 'pix') {
        alert(`Chave PIX: ${salonConfig.pixName || SALON_INFO.pixKey}\nNome: Ivone Hair Studio`);
      }
      payAppointment(activeApp.id, method);
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Olá Ivone! Sou ${user?.name}, gostaria de tirar uma dúvida.`);
    window.open(`https://wa.me/${SALON_INFO.whatsapp.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  const getServiceIcon = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return { icon: Heart, color: 'text-rose-400', bg: 'bg-rose-50' };
    const name = service.name.toLowerCase();
    if (name.includes('escova')) return { icon: Wind, color: 'text-amber-500', bg: 'bg-amber-50' };
    if (name.includes('corte')) return { icon: Scissors, color: 'text-rose-500', bg: 'bg-rose-50' };
    if (name.includes('manicure')) return { icon: Sparkles, color: 'text-emerald-500', bg: 'bg-emerald-50' };
    return { icon: Heart, color: 'text-rose-400', bg: 'bg-rose-50' };
  };

  return (
    <div className="p-6 space-y-8 pb-12 animate-fade">
      {/* ACTIVE APPOINTMENT FLOW */}
      {activeApp && (
        <section className="animate-fade">
          <div className="bg-gradient-to-br from-[#D99489] to-[#8B5E3C] rounded-[2.5rem] p-6 text-white shadow-xl space-y-4 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-100">Seu Agendamento de Hoje</p>
                  <h3 className="text-xl font-serif font-bold">
                    {services.find(s => s.id === activeApp.serviceId)?.name || 'Serviço'}
                  </h3>
                </div>
                <div className="bg-white/30 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {activeApp.time}
                </div>
              </div>

              {activeApp.status === 'confirmed' && activeApp.checkInStatus === 'none' && (
                <div className="space-y-3 pt-2">
                  <p className="text-[11px] italic opacity-100">Você já chegou ao studio? Faça seu check-in!</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={handleSimpleCheckIn}
                      className="bg-white text-[#D99489] py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                    >
                      Estou no Salão
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-black/30 backdrop-blur-md text-white border border-white/40 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                    >
                      <Camera size={14} /> Foto Check-in
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handlePhotoCheckIn} 
                      accept="image/*" 
                      capture="user" 
                      className="hidden" 
                    />
                  </div>
                </div>
              )}

              {activeApp.status === 'in_service' && activeApp.paymentStatus === 'unpaid' && (
                <div className="space-y-3 pt-2">
                  <p className="text-[11px] italic opacity-100">Check-in realizado! Como deseja pagar?</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => handlePayment('debito')}
                      className="bg-white/30 backdrop-blur-md text-white border border-white/40 py-3 rounded-2xl text-[9px] font-bold uppercase tracking-widest flex flex-col items-center gap-1 shadow-lg active:scale-95 transition-all"
                    >
                      <CreditCard size={14} /> Débito
                    </button>
                    <button 
                      onClick={() => handlePayment('credito')}
                      className="bg-white/30 backdrop-blur-md text-white border border-white/40 py-3 rounded-2xl text-[9px] font-bold uppercase tracking-widest flex flex-col items-center gap-1 shadow-lg active:scale-95 transition-all"
                    >
                      <CreditCard size={14} /> Crédito
                    </button>
                    <button 
                      onClick={() => handlePayment('pix')}
                      className="bg-white text-[#D99489] py-3 rounded-2xl text-[9px] font-bold uppercase tracking-widest flex flex-col items-center gap-1 shadow-lg active:scale-95 transition-all"
                    >
                      <QrCode size={14} /> PIX
                    </button>
                  </div>
                </div>
              )}

              {activeApp.paymentStatus === 'waiting_verification' && (
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-white/30">
                  <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center animate-pulse">
                    <RefreshCw size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Aguardando Verificação</p>
                    <p className="text-[9px] opacity-100">Ivone está confirmando seu pagamento...</p>
                  </div>
                </div>
              )}
            </div>
            <Wind className="absolute -right-8 -bottom-8 opacity-10 text-white" size={160} />
          </div>
        </section>
      )}

      {/* HERO */}
      <section className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] dark:border-zinc-800 rounded-[3.5rem] p-8 shadow-sm relative overflow-hidden transition-colors">
        <div className="relative z-10 space-y-5">
          <div className="flex items-center gap-2">
            <div className="h-[1px] w-6 bg-[#D4B499]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#D4B499]">
              {salonConfig.dynamicText.heroTitle}
            </span>
          </div>
          <h2 className="text-4xl font-serif font-bold text-[#4A3B39] dark:text-white leading-[1] tracking-tighter">
            Oi, {user?.name.split(' ')[0]}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm max-w-[220px] leading-relaxed italic">
            {salonConfig.dynamicText.heroSubtitle}
          </p>
          
          <div className="flex gap-2">
            <button onClick={handleWhatsApp} className="flex-1 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-3 rounded-2xl flex items-center justify-center gap-2 shadow-sm">
               <MessageCircle size={14} className="text-emerald-500" />
               <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-tighter">WhatsApp</span>
            </button>
            <button onClick={() => window.open(`https://instagram.com/${SALON_INFO.instagram.replace('@', '')}`)} className="flex-1 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-3 rounded-2xl flex items-center justify-center gap-2 shadow-sm">
               <Instagram size={14} className="text-rose-500" />
               <span className="text-[10px] font-black text-rose-700 dark:text-rose-400 uppercase tracking-tighter">Instagram</span>
            </button>
          </div>
        </div>
        <Leaf className="absolute -right-12 -bottom-12 opacity-[0.03] text-[#D4B499]" size={280} />
      </section>

      {/* MIMOS DA SEMANA */}
      <section className="space-y-5">
        <div className="px-2 flex justify-between items-end">
          <div>
            <h3 className="text-xl font-serif font-bold dark:text-white">Mimos da Semana</h3>
            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest italic">Preços Especiais</p>
          </div>
          <Sparkles size={18} className="text-[#D4B499] animate-pulse" />
        </div>

        <div className="space-y-4">
          {weeklyOffers.filter(o => o.active).map((group) => (
            <div key={group.day} className="space-y-3">
               <p className="text-[10px] font-black uppercase tracking-widest text-[#D4B499] ml-2">{group.title}</p>
               <div className="grid gap-3">
                 {group.offers.map(offer => {
                   const config = getServiceIcon(offer.id);
                   const Icon = config.icon;
                   return (
                     <button 
                       key={offer.id}
                       onClick={() => onQuickRebook(offer.id.split('-')[0])}
                       className="w-full text-left bg-white dark:bg-zinc-900 border border-[#F5E6DA] dark:border-zinc-800 rounded-[2rem] p-4 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all group"
                     >
                       <div className={`w-12 h-12 ${config.bg} dark:bg-zinc-800 rounded-xl flex items-center justify-center ${config.color} shadow-inner`}>
                          <Icon size={24} />
                       </div>
                       <div className="flex-1">
                         <h4 className="text-[11px] font-bold text-gray-800 dark:text-white uppercase">{offer.name}</h4>
                         <p className="text-[9px] text-gray-600 italic">{offer.desc}</p>
                       </div>
                       <div className="text-right">
                          <span className="bg-[#D4B499] text-studio-ink text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-sm">R$ {offer.price}</span>
                       </div>
                     </button>
                   );
                 })}
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="space-y-6">
        <div className="px-2">
          <h3 className="text-xl font-serif font-bold dark:text-white">Studio Protocols</h3>
          <p className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">Catálogo Completo</p>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {services.map((service) => (
            <button 
              key={service.id} 
              onClick={() => onQuickRebook(service.id)}
              className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] dark:border-zinc-800 rounded-2xl p-4 flex flex-col items-center text-center gap-3 shadow-sm active:scale-[0.97] transition-all group"
            >
              <div className="w-12 h-12 bg-[#FAF7F5] dark:bg-zinc-800 text-[#D4B499] rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                 <Calendar size={20} />
              </div>
              <h4 className="text-[9px] font-bold dark:text-white uppercase tracking-wider">{service.name}</h4>
            </button>
          ))}
        </div>
      </section>

      {/* VISITE NOSSO ESPAÇO */}
      <section className="space-y-6">
        <div className="px-2">
          <h3 className="text-xl font-serif font-bold dark:text-white">Visite nosso espaço</h3>
          <p className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">Studio Protocols</p>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] dark:border-zinc-800 rounded-[2.5rem] p-6 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#FAF7F5] dark:bg-zinc-800 text-[#D4B499] rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-gray-800 dark:text-white uppercase tracking-tight">Endereço & Horário</p>
              <p className="text-[10px] text-gray-700 dark:text-gray-400 leading-relaxed">
                {SALON_INFO.address}
              </p>
              <p className="text-[10px] text-studio-accent font-bold">
                {SALON_INFO.hours}
              </p>
            </div>
          </div>
          <button 
            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SALON_INFO.address)}`, '_blank')}
            className="w-full bg-[#FAF7F5] dark:bg-zinc-800 text-[#D4B499] py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#D4B499] hover:text-studio-ink transition-all"
          >
            Ver no Google Maps <ArrowUpRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
