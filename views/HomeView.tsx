
import React, { useRef } from 'react';
import { useApp } from '../store';
import { ServiceCategory, Service } from '../types';
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
  MapPin,
  ArrowUpRight
} from 'lucide-react';

interface HomeViewProps {
  onQuickRebook: (serviceId: string) => void;
  onGoToAdmin?: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onQuickRebook }) => {
  const { user, salonConfig, services, appointments, performCheckIn, weeklyOffers } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todayApp = appointments.find(a => 
    a.clientPhone === user?.phone && 
    a.date === todayStr && 
    a.status === 'confirmed' && 
    a.checkInStatus === 'none'
  );

  const lastAppointment = appointments
    .filter(a => a.clientPhone === user?.phone && (a.status === 'completed' || a.status === 'confirmed'))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  
  const lastService = lastAppointment ? services.find(s => s.id === lastAppointment.serviceId) : null;

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
          <p className="text-gray-400 dark:text-gray-500 text-sm max-w-[220px] leading-relaxed italic">
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
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic">Preços Especiais</p>
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
                         <p className="text-[9px] text-gray-400 italic">{offer.desc}</p>
                       </div>
                       <div className="text-right">
                          <span className="bg-[#D4B499] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-sm">R$ {offer.price}</span>
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
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Catálogo Completo</p>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {services.map((service) => (
            <button 
              key={service.id} 
              onClick={() => onQuickRebook(service.id)}
              className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] dark:border-zinc-800 rounded-2xl p-4 flex flex-col items-center text-center gap-3 shadow-sm active:scale-[0.97] transition-all group"
            >
              <div className="w-12 h-12 bg-[#FAF7F5] dark:bg-zinc-800 text-[#D4B499] rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                 <Plus size={20} />
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
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Studio Protocols</p>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] dark:border-zinc-800 rounded-[2.5rem] p-6 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#FAF7F5] dark:bg-zinc-800 text-[#D4B499] rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-gray-800 dark:text-white uppercase tracking-tight">Endereço</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                {SALON_INFO.address}
              </p>
            </div>
          </div>
          <button 
            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SALON_INFO.address)}`, '_blank')}
            className="w-full bg-[#FAF7F5] dark:bg-zinc-800 text-[#D4B499] py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#D4B499] hover:text-white transition-all"
          >
            Ver no Google Maps <ArrowUpRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
