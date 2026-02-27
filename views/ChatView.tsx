
import React from 'react';
import { useApp } from '../store';
import { MessageCircle, Phone, Sparkles, ExternalLink } from 'lucide-react';

const ChatView: React.FC = () => {
  const { isAdmin, salonConfig } = useApp();

  const contactOptions = [
    {
      name: salonConfig.professionals.prof1_nome,
      area: 'Cabelo & Coloração',
      icon: '💇‍♀️',
      phone: salonConfig.professionals.prof1_whats,
      color: 'bg-rose-50 text-rose-600 border-rose-100'
    },
    {
      name: salonConfig.professionals.prof2_nome,
      area: 'Olhar - Cílios & Sobrancelhas',
      icon: '👁️',
      phone: salonConfig.professionals.prof2_whats,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100'
    },
    {
      name: salonConfig.professionals.prof3_nome,
      area: 'Manicure & Massagem',
      icon: '💅',
      phone: salonConfig.professionals.prof3_whats,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    }
  ];

  const openWhatsApp = (phone: string, name: string, area: string) => {
    const text = encodeURIComponent(`Olá ${name}! Gostaria de tirar uma dúvida sobre ${area}.`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-studio-fade bg-stone-50/50 dark:bg-stone-950/50" role="region" aria-label="Atendimento Humano">
      <header className="p-8 border-b border-studio-accent/10 dark:border-stone-800 flex items-center gap-6 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="w-16 h-16 bg-studio-accent/10 rounded-[2rem] flex items-center justify-center text-studio-accent border border-studio-accent/20 shadow-inner">
          <Sparkles size={32} strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-2xl font-serif font-bold text-studio-ink dark:text-white tracking-tight">Atendimento</h3>
          <p className="text-[10px] text-studio-sage font-bold uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-studio-sage rounded-full animate-pulse" /> Toque Humano & Carinho
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
        <div className="bg-white dark:bg-stone-900 p-8 rounded-[3rem] border border-stone-100 dark:border-stone-800 shadow-sm space-y-6">
          <div className="space-y-4">
            <h4 className="text-xl font-serif font-bold dark:text-white">Olá! ✨</h4>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Sabemos que a praticidade do app é ótima, mas sabemos também que alguns questionamentos pedem um toque humano, e estamos aqui para ajudar!
            </p>
          </div>

          <div className="pt-4 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Escolha a área desejada e fale diretamente conosco:</p>
            
            <div className="grid gap-4">
              {contactOptions.map((opt) => (
                <button
                  key={opt.name}
                  onClick={() => openWhatsApp(opt.phone, opt.name, opt.area)}
                  className="group flex items-center gap-5 p-5 bg-stone-50 dark:bg-stone-800/50 rounded-[2rem] border border-transparent hover:border-studio-accent transition-all active:scale-[0.98] text-left"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm border ${opt.color}`}>
                    {opt.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-0.5">{opt.area}</p>
                    <p className="text-base font-bold dark:text-white flex items-center gap-2">
                      Falar com {opt.name} <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-studio-accent text-white rounded-full flex items-center justify-center shadow-lg shadow-studio-accent/20">
                    <Phone size={18} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-stone-50 dark:border-stone-800">
            <p className="text-[11px] text-stone-500 dark:text-stone-500 italic leading-relaxed">
              Pedimos apenas um pouquinho de paciência no retorno, em horário de atendimento, estamos transformando alguns visuais e queremos dar atenção total a cada atendimento. Assim que finalizarmos o procedimento atual, responderemos com todo o carinho que você merece! 🌸
            </p>
          </div>
        </div>

        <div className="flex justify-center opacity-30 py-4">
          <MessageCircle size={48} strokeWidth={1} />
        </div>
      </div>
    </div>
  );
};

export default ChatView;
