
import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { ServiceCategory, ClientPreferences } from '../types';
import { TERMS_TEXT } from '../constants';
import { 
  CheckCircle2, 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowRight,
  Sparkles,
  Ticket,
  Coffee,
  Check,
  UserCheck,
  Scissors,
  Eye,
  Activity,
  Droplets,
  ShieldCheck,
  Bell,
  CheckSquare,
  Square,
  Zap,
  X
} from 'lucide-react';

interface ScheduleViewProps {
  preselectedServiceId?: string | null;
  onClearPreselected?: () => void;
  onComplete?: () => void;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ preselectedServiceId, onClearPreselected, onComplete }) => {
  const { user, addAppointment, services, salonConfig, updateAppointmentPreferences, requestPushPermission } = useApp();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [confirmedId, setConfirmedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'Todos'>('Todos');
  const [dateError, setDateError] = useState('');

  // Estados de Conformidade
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [whatsappConsent, setWhatsappConsent] = useState(false);

  const [prefs, setPrefs] = useState<ClientPreferences>({
    environment: 'none',
    refreshment: 'Nada',
    health: { alergias: '', cheiro: '', aguaTemp: 'Morna', outros: '' },
    nails: { formato: 'none', pref: '' },
    lashes: '',
    hairExtra: 'none',
    saveToProfile: false // Por padrão, não salva automático se for a primeira vez
  });

  const dayMap: { [key: string]: number } = { 'Dom': 0, 'Seg': 1, 'Ter': 2, 'Qua': 3, 'Qui': 4, 'Sex': 5, 'Sáb': 6 };
  const allowedDays = salonConfig.businessHours.days.map(d => dayMap[d]);

  useEffect(() => {
    if (preselectedServiceId) {
      setSelectedService(preselectedServiceId);
      setStep(2);
      if (onClearPreselected) onClearPreselected();
    }
    if (user?.permanentPreferences) {
      setPrefs({ ...user.permanentPreferences, saveToProfile: true });
    }
  }, [preselectedServiceId]);

  const handleConfirm = () => {
    const id = addAppointment({
      serviceId: selectedService,
      clientName: user?.name || 'Cliente',
      clientPhone: user?.phone || '',
      date: selectedDate,
      time: selectedTime,
      termsAccepted: termsAccepted,
      whatsappConsent: whatsappConsent
    }, false);
    setConfirmedId(id);
    
    // LÓGICA INTELIGENTE: Se já tem preferências permanentes, pula o ritual.
    if (user?.permanentPreferences) {
      handleFinish();
    } else {
      setStep(5); // Ritual de Curadoria
    }
  };

  const savePreferences = () => {
    if (confirmedId) {
      updateAppointmentPreferences(confirmedId, prefs);
      handleFinish();
    }
  };

  const handleFinish = () => {
    if (onComplete) onComplete();
    else {
      setStep(1);
      setSelectedService('');
      setConfirmedId(null);
    }
  };

  const handleDateChange = (dateStr: string) => {
    const selected = new Date(dateStr);
    const dayOfWeek = selected.getUTCDay();
    if (!allowedDays.includes(dayOfWeek)) {
      setDateError(`O estúdio não abre neste dia.`);
      setSelectedDate('');
    } else {
      setDateError('');
      setSelectedDate(dateStr);
    }
  };

  const serviceData = services.find(s => s.id === selectedService);
  const filteredServices = activeCategory === 'Todos' ? services : services.filter(s => s.category === activeCategory);
  const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 space-y-10 pb-16 animate-studio-fade">
      <div className="flex items-center justify-between px-6">
        {[1, 2, 3, 4, 5].map((idx) => (
          <div key={idx} className="flex flex-col items-center gap-2">
            <div className={`h-1.5 w-8 rounded-full transition-all duration-700 ${step >= idx ? 'bg-studio-accent shadow-sm shadow-studio-accent/20' : 'bg-stone-100 dark:bg-stone-800'}`} />
          </div>
        ))}
      </div>

      <div className="min-h-[65vh]">
        {step === 1 && (
          <div className="space-y-8 animate-studio-fade">
            <div className="px-2">
              <h3 className="text-4xl font-serif font-medium text-studio-ink dark:text-white tracking-tight">Protocolos</h3>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.25em] mt-1">Escolha seu tratamento</p>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {['Todos', ...Object.values(ServiceCategory)].map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat as any)} className={`px-6 py-3 rounded-2xl text-[10px] font-bold whitespace-nowrap border transition-all ${activeCategory === cat ? 'bg-studio-ink text-white border-studio-ink shadow-lg' : 'bg-white dark:bg-stone-900 text-stone-400 border-stone-100 dark:border-stone-800'}`}>{cat}</button>
              ))}
            </div>
            <div className="grid gap-5">
              {filteredServices.map(service => (
                <button key={service.id} onClick={() => { setSelectedService(service.id); setStep(2); }} className={`p-8 rounded-[3rem] border text-left transition-all group ${selectedService === service.id ? 'bg-stone-50 dark:bg-stone-800 border-studio-accent shadow-inner' : 'bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800 hover:border-studio-accent/30'}`}>
                  <span className="text-[9px] font-bold text-studio-accent uppercase tracking-widest">{service.category}</span>
                  <h4 className="font-bold text-base dark:text-white tracking-tight mt-1">{service.name}</h4>
                  <p className="text-[11px] text-stone-400 italic font-serif mt-1 leading-relaxed">{service.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-12 animate-studio-fade">
             <div className="px-2 flex items-center justify-between">
                <div>
                  <h3 className="text-4xl font-serif font-medium text-studio-ink dark:text-white tracking-tight">Agenda</h3>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.25em] mt-1">Disponibilidade</p>
                </div>
                <button onClick={() => setStep(1)} className="p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl shadow-sm hover:bg-stone-100 transition-colors"><ChevronLeft size={20}/></button>
             </div>
             <div className="space-y-5">
                <label className="text-[11px] font-bold text-stone-400 uppercase ml-4 flex items-center gap-3 tracking-widest"><CalendarIcon size={16} className="text-studio-accent" /> Selecione a Data</label>
                <input type="date" min={today} value={selectedDate} onChange={(e) => handleDateChange(e.target.value)} className={`w-full p-7 bg-white dark:bg-stone-900 border ${dateError ? 'border-rose-300 focus:border-rose-500' : 'border-stone-100 dark:border-stone-800 focus:border-studio-accent'} rounded-[3rem] outline-none font-bold shadow-sm dark:text-white transition-all`} />
                {dateError && (
                  <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50 p-5 rounded-[2rem] flex items-center gap-4 animate-studio-fade shadow-sm mt-2">
                    <div className="w-10 h-10 bg-white dark:bg-stone-800 rounded-full flex items-center justify-center text-rose-500 flex-shrink-0 shadow-sm">
                      <X size={20} />
                    </div>
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-widest leading-tight">{dateError}</p>
                  </div>
                )}
             </div>
             <div className={`space-y-6 transition-opacity duration-500 ${!selectedDate || dateError ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                <label className="text-[11px] font-bold text-stone-400 uppercase ml-4 flex items-center gap-3 tracking-widest"><Clock size={16} className="text-studio-accent" /> Horários Disponíveis</label>
                <div className="grid grid-cols-3 gap-4">
                  {times.map(t => (
                    <button 
                      key={t} 
                      onClick={() => setSelectedTime(t)} 
                      className={`py-6 rounded-[2rem] text-[12px] font-bold border-2 transition-all duration-300 ${
                        selectedTime === t 
                          ? 'bg-studio-accent text-white border-studio-accent shadow-xl shadow-studio-accent/30 scale-105' 
                          : 'bg-white dark:bg-stone-900 text-studio-ink dark:text-white border-studio-accent/20 hover:border-studio-accent/60 hover:shadow-md hover:-translate-y-1'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
             </div>
             {selectedTime && (
               <button onClick={() => setStep(3)} className="w-full bg-studio-ink text-white py-6 rounded-[2.5rem] font-bold text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">Revisar Reserva <ArrowRight size={20}/></button>
             )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10 animate-studio-fade">
            <div className="px-2 flex items-center justify-between">
              <div>
                <h3 className="text-4xl font-serif font-medium text-studio-ink dark:text-white tracking-tight">Resumo</h3>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.25em] mt-1">Check-out digital</p>
              </div>
              <button onClick={() => setStep(2)} className="p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl shadow-sm hover:bg-stone-100 transition-colors"><ChevronLeft size={20}/></button>
            </div>
            <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[3.5rem] overflow-hidden shadow-2xl relative">
              <div className="bg-studio-ink p-7 text-white flex items-center gap-3"><Ticket size={20} className="text-studio-gold" /><span className="text-[10px] font-bold uppercase tracking-[0.2em]">Reserva Ivone Studio</span></div>
              <div className="p-10 space-y-6">
                <div className="border-b border-stone-50 dark:border-stone-800 border-dashed pb-6">
                  <p className="text-[9px] text-stone-400 uppercase font-bold tracking-widest">Protocolo Selecionado</p>
                  <p className="text-2xl font-serif font-medium dark:text-white mt-1">{serviceData?.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div><p className="text-[9px] text-stone-400 uppercase font-bold tracking-widest">Data</p><p className="text-base font-bold dark:text-white mt-1">{selectedDate.split('-').reverse().join('/')}</p></div>
                  <div className="text-right"><p className="text-[9px] text-stone-400 uppercase font-bold tracking-widest">Hora</p><p className="text-base font-bold dark:text-white mt-1">{selectedTime}</p></div>
                </div>
              </div>
            </div>
            <button onClick={() => setStep(4)} className="w-full bg-studio-accent text-white py-6 rounded-[2.5rem] font-bold uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-studio-accent/20 active:scale-95 transition-all">Seguir para Termos</button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-fade">
            <div className="px-2 flex items-center justify-between">
              <div><h3 className="text-3xl font-serif font-bold dark:text-white">Segurança</h3><p className="text-[10px] text-gray-400 font-bold uppercase">Privacidade & LGPD</p></div>
              <button onClick={() => setStep(3)} className="p-3 bg-gray-100 rounded-2xl"><ChevronLeft size={18}/></button>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] rounded-[2.5rem] p-6 shadow-sm overflow-hidden">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><ShieldCheck size={14} className="text-[#D4B499]"/> Termos de Uso</label>
                <div className="h-48 overflow-y-auto pr-4 text-[11px] text-gray-500 leading-relaxed italic no-scrollbar whitespace-pre-wrap">
                  {TERMS_TEXT}
                </div>
              </div>

              <div className="space-y-4 px-2">
                <button 
                  onClick={() => setTermsAccepted(!termsAccepted)}
                  className="flex items-start gap-4 text-left group"
                >
                  <div className={`mt-1 transition-colors ${termsAccepted ? 'text-[#8B5E3C]' : 'text-gray-300'}`}>
                    {termsAccepted ? <CheckSquare size={22} /> : <Square size={22} />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-200">Li e aceito os Termos de Uso e Política de Privacidade</p>
                    <p className="text-[10px] text-gray-400 leading-tight mt-1">Obrigatório para prosseguir com o agendamento.</p>
                  </div>
                </button>

                <button 
                  onClick={() => setWhatsappConsent(!whatsappConsent)}
                  className="flex items-start gap-4 text-left group"
                >
                  <div className={`mt-1 transition-colors ${whatsappConsent ? 'text-[#86BDB1]' : 'text-gray-300'}`}>
                    {whatsappConsent ? <CheckSquare size={22} /> : <Square size={22} />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-200">Aceito receber notificações de agendamento e comunicações via WhatsApp</p>
                    <p className="text-[10px] text-gray-400 leading-tight mt-1">Lembretes de horário e novidades exclusivas.</p>
                  </div>
                </button>
              </div>
            </div>

            <button 
              onClick={handleConfirm} 
              disabled={!termsAccepted}
              className={`w-full py-5 rounded-[2.5rem] font-bold uppercase text-[11px] tracking-widest shadow-xl transition-all ${termsAccepted ? 'bg-[#D4B499] text-white' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
            >
              Confirmar Agendamento
            </button>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-8 animate-fade pb-10">
             <div className="text-center space-y-4">
               <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500 mx-auto shadow-inner"><CheckCircle2 size={40} /></div>
               <h3 className="text-2xl font-serif font-bold dark:text-white">Reserva Confirmada!</h3>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Desenhe agora a sua experiência premium:</p>
             </div>

             <div className="bg-gradient-to-br from-[#FAF7F5] to-white dark:from-zinc-900 dark:to-zinc-800 p-8 rounded-[3.5rem] border-2 border-[#D4B499] shadow-2xl space-y-10 animate-fade-up">
               
               <div className="bg-[#86BDB1]/10 p-6 rounded-3xl border-2 border-[#86BDB1]/20 space-y-4">
                  <div className="flex items-center gap-3">
                    <Bell className="text-[#86BDB1]" size={20} />
                    <p className="text-xs font-bold text-[#86BDB1] uppercase tracking-tighter">Notificações Inteligentes Ativas</p>
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium">Você será avisada assim que a Ivone aceitar o horário.</p>
                  
                  <button 
                    onClick={requestPushPermission}
                    className="w-full bg-[#86BDB1] text-white py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
                  >
                    <Zap size={14}/> Ativar Push no Navegador
                  </button>
               </div>

               <div className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-sm border-2 border-[#D4B499] ring-8 ring-[#FAF7F5] dark:ring-zinc-900/50">
                  <button 
                    onClick={() => setPrefs({...prefs, saveToProfile: !prefs.saveToProfile})}
                    className="w-full flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl shadow-inner ${prefs.saveToProfile ? 'bg-[#D4B499] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <UserCheck size={24} />
                      </div>
                      <div className="text-left">
                        <p className="text-[11px] font-bold text-[#8B5E3C] dark:text-[#D4B499] uppercase tracking-tighter">Memorizar Perfil Permanente?</p>
                        <p className="text-[9px] text-gray-400 font-medium">Lembrar estas preferências para sempre.</p>
                      </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${prefs.saveToProfile ? 'bg-[#D4B499]' : 'bg-gray-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${prefs.saveToProfile ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                  </button>
               </div>

               <div className="space-y-4">
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Coffee size={14}/> Menu de Bebidas</label>
                 <div className="grid grid-cols-2 gap-2">
                   {[
                     {id: 'Café Quente', label: '☕ Café Quente'},
                     {id: 'Café Morno', label: '☕ Café Morno'},
                     {id: 'Chá Quente', label: '🍵 Chá Quente'},
                     {id: 'Chá Morno', label: '🍵 Chá Morno'},
                     {id: 'Água Fresca', label: '💧 Água Fresca'},
                     {id: 'Água Gelada', label: '💧 Água Gelada'},
                     {id: 'Nada', label: '🚫 Nada'}
                   ].map(item => (
                     <button 
                       key={item.id}
                       onClick={() => setPrefs({...prefs, refreshment: item.id as any})}
                       className={`p-3 rounded-2xl text-[9px] font-bold border-2 transition-all ${prefs.refreshment === item.id ? 'bg-[#D4B499] border-[#D4B499] text-white shadow-lg' : 'bg-white dark:bg-zinc-800 border-transparent text-gray-400'}`}
                     >
                       {item.label}
                     </button>
                   ))}
                 </div>
               </div>

               <div className="space-y-4">
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Activity size={14}/> Saúde & Bem-estar</label>
                 <div className="grid gap-3">
                   <div className="grid grid-cols-2 gap-2">
                     <input placeholder="Alergias..." value={prefs.health.alergias} onChange={e => setPrefs({...prefs, health: {...prefs.health, alergias: e.target.value}})} className="p-4 bg-white dark:bg-zinc-800 rounded-2xl text-[11px] border-2 border-transparent focus:border-[#D4B499] outline-none shadow-sm" />
                     <input placeholder="Aromas..." value={prefs.health.cheiro} onChange={e => setPrefs({...prefs, health: {...prefs.health, cheiro: e.target.value}})} className="p-4 bg-white dark:bg-zinc-800 rounded-2xl text-[11px] border-2 border-transparent focus:border-[#D4B499] outline-none shadow-sm" />
                   </div>
                   <div className="bg-white dark:bg-zinc-800 p-5 rounded-2xl flex items-center justify-between border border-[#F5E6DA] dark:border-zinc-700 shadow-sm">
                     <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2"><Droplets size={12}/> Lavatório</span>
                     <div className="flex gap-2">
                       {['Quente', 'Morna', 'Fria'].map(t => (
                         <button key={t} onClick={() => setPrefs({...prefs, health: {...prefs.health, aguaTemp: t as any}})} className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase transition-all ${prefs.health.aguaTemp === t ? 'bg-[#86BDB1] text-white shadow-md' : 'bg-gray-100 dark:bg-zinc-700 text-gray-400'}`}>{t}</button>
                       ))}
                     </div>
                   </div>
                 </div>
               </div>

               <div className="pt-6 grid grid-cols-2 gap-4">
                  <button onClick={handleFinish} className="py-5 text-[10px] font-bold text-gray-300 uppercase tracking-widest">Pular Ritual</button>
                  <button onClick={savePreferences} className="bg-[#D4B499] text-white py-5 rounded-[2rem] text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-[#8B5E3C] transition-all">Salvar Curadoria <Check size={16}/></button>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleView;
