
import React, { useState } from 'react';
import { useApp } from '../store';
import { MessageCircle, Phone, Sparkles, ExternalLink, MessageSquare, Send, CheckCircle } from 'lucide-react';

const ChatView: React.FC = () => {
  const { isAdmin, salonConfig, sendFeedback } = useApp();
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

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

  const handleSendFeedback = () => {
    if (!feedbackText.trim()) return;
    sendFeedback(feedbackText);
    setFeedbackText('');
    setFeedbackSent(true);
    setTimeout(() => setFeedbackSent(false), 5000);
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

        {/* Avaliação Google */}
        <div className="bg-white dark:bg-stone-900 p-8 rounded-[3rem] border border-stone-100 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                <path d="M12 8v8"/>
                <path d="M8 12h8"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="text-base font-bold dark:text-white tracking-tight">Avalie nossos serviços</p>
              <p className="text-[10px] text-stone-600 font-bold uppercase tracking-widest mt-0.5">Sua opinião no Google</p>
            </div>
          </div>
          <button 
            onClick={() => window.open('https://www.google.com/search?sca_esv=d2de273313dd764e&biw=1280&bih=631&sxsrf=ANbL-n6djD_dGUV9ESISYzDyOILKcmCSpg:1772373309565&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOeWrVS7HOjcy9hKpXa7ZQS4Uo2c9Dh34l4i8T22ANHMuJ4ChCZAJiKH8OKlcPMsq_9mgAKwJsBc8JW_FqG6HEVJZaQdPV78Oc_Wl3-hR0IbKPGEUIg%3D%3D&q=Ivone+Hair+Studio+Coment%C3%A1rios&sa=X&ved=2ahUKEwiXspqM7f6SAxWSHbkGHaUEOd4Q0bkNegQIIBAF&cshid=1772373435215824', '_blank')}
            className="w-full py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 transition-all bg-white dark:bg-stone-800 border-2 border-blue-100 dark:border-blue-900 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 active:scale-95"
          >
            <ExternalLink size={18}/>
            Deixar Comentário no Google
          </button>
        </div>

        {/* Ouvidoria Ivone */}
        <div className="bg-white dark:bg-stone-900 p-8 rounded-[3rem] border border-stone-100 dark:border-stone-800 space-y-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-500">
              <MessageSquare size={24} />
            </div>
            <div className="text-left">
              <p className="text-base font-bold dark:text-white tracking-tight">Ouvidoria Ivone</p>
              <p className="text-[10px] text-stone-600 font-bold uppercase tracking-widest mt-0.5">Reclamações ou Sugestões</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <textarea 
              placeholder="Como podemos melhorar sua experiência? Sua voz é fundamental para nós..."
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              className="w-full p-5 bg-stone-50 dark:bg-stone-800 rounded-[2rem] text-[11px] border-2 border-transparent focus:border-studio-accent outline-none shadow-inner min-h-[120px] resize-none dark:text-white"
            />
            <button 
              onClick={handleSendFeedback}
              disabled={!feedbackText.trim() || feedbackSent}
              className={`w-full py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 transition-all ${feedbackSent ? 'bg-emerald-500 text-white' : 'bg-studio-ink text-white active:scale-95 disabled:opacity-50'}`}
            >
              {feedbackSent ? <CheckCircle size={18}/> : <Send size={18}/>}
              {feedbackSent ? 'Enviado com Sucesso!' : 'Enviar Feedback'}
            </button>
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
