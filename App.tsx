
import React, { useState, useEffect } from 'react';
import { useApp } from './store';
import Layout from './components/Layout';
import HomeView from './views/HomeView';
import ScheduleView from './views/ScheduleView';
import PointsView from './views/PointsView';
import ProfileView from './views/ProfileView';
import AdminView from './views/AdminView';
import NotificationView from './views/NotificationView';
import ChatView from './views/ChatView';
import GalleryView from './views/GalleryView';
import RatingPopup from './components/RatingPopup';
import { ShieldCheck, FileText, ChevronLeft, X, Gift, CheckCircle } from 'lucide-react';
import { TERMS_TEXT } from './constants';

const App: React.FC = () => {
  const { user, login, isAdmin, toggleAdmin, speak, accessibility, salonConfig, acceptTerms } = useApp();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', salonConfig.colors.primary);
    root.style.setProperty('--secondary', salonConfig.colors.secondary);
    root.style.setProperty('--accent', salonConfig.colors.accent);
  }, [salonConfig.colors]);

  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);
  const [showLoginTerms, setShowLoginTerms] = useState(false);
  
  const [lName, setLName] = useState('');
  const [lPhone, setLPhone] = useState('');
  const [lReferral, setLReferral] = useState('');

  useEffect(() => {
    if (user && accessibility.readAloud) {
      const tabNames: {[key: string]: string} = {
        home: 'Início',
        gallery: 'Galeria',
        schedule: 'Agendamento',
        chat: 'Chat com Ivone',
        points: 'Clube de Pontos',
        profile: 'Meu Perfil',
        admin: 'Painel de Gestão',
        notifications: 'Notificações'
      };
      speak(`Tela de ${tabNames[activeTab] || activeTab}`);
    }
  }, [activeTab, user, accessibility.readAloud, speak]);

  const handleQuickRebook = (serviceId: string) => {
    setPreselectedServiceId(serviceId);
    setActiveTab('schedule');
  };

  const handleBookingComplete = () => {
    setActiveTab('home');
    setPreselectedServiceId(null);
  };

  if (!user && isAdmin) {
    return (
      <Layout activeTab="admin" setActiveTab={setActiveTab}>
        <AdminView onGoToChat={() => setActiveTab('chat')} />
      </Layout>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-[#FFF9F8] dark:bg-zinc-950 transition-colors">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[50px] p-10 shadow-2xl space-y-8 animate-fade text-center border border-[#F5E6DA]/20 relative overflow-hidden">
          
          {!showLoginTerms ? (
            <div className="space-y-6 animate-fade">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-[#D99489] rounded-full mx-auto flex items-center justify-center text-white text-3xl font-serif font-bold shadow-xl ring-8 ring-[#FAF7F5] dark:ring-zinc-800" aria-hidden="true">IH</div>
                <div>
                  <h1 className="text-2xl font-serif font-bold dark:text-white leading-tight">Ivone Hair Studio</h1>
                  <p className="text-[10px] font-bold text-[#86BDB1] tracking-[0.4em] uppercase">Beleza & Bem-estar</p>
                </div>
              </div>
              
              <div className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-gray-400 ml-1 tracking-widest">Nome Completo</label>
                  <input aria-label="Nome Completo" placeholder="Como gostaria que chamássemos você?" value={lName} onChange={e => setLName(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-zinc-800 dark:text-white rounded-2xl outline-none border border-transparent focus:border-[#D99489] transition-all shadow-inner text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-gray-400 ml-1 tracking-widest">WhatsApp</label>
                  <input aria-label="Número do WhatsApp" placeholder="(11) 99999-9999" value={lPhone} onChange={e => setLPhone(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-zinc-800 dark:text-white rounded-2xl outline-none border border-transparent focus:border-[#D99489] transition-all shadow-inner text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-[#86BDB1] ml-1 tracking-widest flex items-center gap-1"><Gift size={10}/> Código de Indicação</label>
                  <input placeholder="Ex: IVONE-ABCD" value={lReferral} onChange={e => setLReferral(e.target.value)} className="w-full p-4 bg-emerald-50/30 dark:bg-emerald-900/10 dark:text-white rounded-2xl outline-none border border-emerald-100 dark:border-emerald-800 text-sm placeholder:text-emerald-200" />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <button 
                  onClick={() => login(lName, lPhone, '', lReferral)} 
                  disabled={!lName || !lPhone} 
                  className="w-full bg-gradient-to-r from-[#D99489] to-[#8B5E3C] text-white py-5 rounded-2xl font-bold shadow-xl disabled:opacity-50 active:scale-95 transition-all uppercase tracking-[0.2em] text-[11px]"
                >
                  Entrar no Studio
                </button>
                <div className="flex flex-col gap-3">
                  <button onClick={() => setShowLoginTerms(true)} className="text-[9px] text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:text-[#D4B499]"><FileText size={12}/> Privacidade & Termos</button>
                  <button onClick={() => { toggleAdmin(); setActiveTab('admin'); }} className="text-[9px] text-[#86BDB1] font-bold uppercase tracking-widest border border-dashed border-[#86BDB1] py-3 rounded-2xl"><ShieldCheck size={14} className="inline mr-2" /> Acesso Administrativo</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade text-left py-4">
              <div className="flex items-center justify-between mb-4">
                 <button onClick={() => setShowLoginTerms(false)} className="p-2 bg-gray-50 rounded-xl" aria-label="Voltar"><ChevronLeft size={18}/></button>
                 <h2 className="text-sm font-serif font-bold dark:text-white">Políticas Studio</h2>
                 <button onClick={() => setShowLoginTerms(false)} aria-label="Fechar"><X size={18}/></button>
              </div>
              <div className="bg-[#FAF7F5] dark:bg-zinc-800 p-6 rounded-[2.5rem] border border-[#F5E6DA] dark:border-zinc-700 max-h-96 overflow-y-auto no-scrollbar text-[10px] text-gray-500 italic leading-relaxed whitespace-pre-wrap">
                  {TERMS_TEXT}
              </div>
              <button onClick={() => setShowLoginTerms(false)} className="w-full bg-[#D4B499] text-white py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest">Fechar Termos</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Blocking Terms Acceptance for first-time users
  if (user && !user.termsAccepted) {
    return (
      <div className="min-h-screen bg-[#FFF9F8] dark:bg-zinc-950 flex items-center justify-center p-6 transition-colors">
        <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[3.5rem] p-10 shadow-2xl space-y-8 animate-fade-up border border-[#F5E6DA]/30">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-studio-accent/10 rounded-full mx-auto flex items-center justify-center text-studio-accent shadow-inner">
              <ShieldCheck size={40} />
            </div>
            <h2 className="text-2xl font-serif font-bold dark:text-white tracking-tight">Bem-vinda ao Ivone Studio</h2>
            <p className="text-[10px] text-stone-500 font-bold uppercase tracking-[0.2em]">Políticas de Privacidade & Termos</p>
          </div>

          <div className="bg-stone-50 dark:bg-stone-800/50 p-8 rounded-[2.5rem] border border-stone-100 dark:border-stone-700 max-h-[50vh] overflow-y-auto no-scrollbar shadow-inner">
            <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed italic whitespace-pre-wrap font-medium">
              {TERMS_TEXT}
            </p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={acceptTerms}
              className="w-full bg-studio-accent text-studio-ink py-6 rounded-2xl font-bold uppercase text-[11px] tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <CheckCircle size={20} className="text-studio-ink" />
              Li e Aceito os Termos
            </button>
            <p className="text-[9px] text-center text-stone-400 font-medium px-8 leading-relaxed">
              Ao clicar em aceitar, você concorda com nossas diretrizes de privacidade e tratamento de dados (LGPD).
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <RatingPopup />
      {activeTab === 'home' && <HomeView onQuickRebook={handleQuickRebook} onGoToAdmin={() => setActiveTab('admin')} />}
      {activeTab === 'gallery' && <GalleryView />}
      {activeTab === 'schedule' && (
        <ScheduleView 
          preselectedServiceId={preselectedServiceId} 
          onClearPreselected={() => setPreselectedServiceId(null)} 
          onComplete={handleBookingComplete}
        />
      )}
      {activeTab === 'chat' && <ChatView />}
      {activeTab === 'points' && <PointsView />}
      {activeTab === 'profile' && <ProfileView />}
      {activeTab === 'admin' && <AdminView onGoToChat={() => setActiveTab('chat')} />}
      {activeTab === 'notifications' && <NotificationView />}
    </Layout>
  );
};

export default App;
