
import React, { useState } from 'react';
import { useApp } from '../store';
import { TERMS_TEXT } from '../constants';
import { 
  LogOut, Moon, Sun, Type, Volume2, Award, 
  ShieldCheck, CheckCircle, Contrast, Settings, Info,
  User as UserIcon, Calendar, Phone, Save, ChevronDown, ChevronUp,
  Bell, Coffee, HeartPulse, Thermometer, Zap, Droplets, UserCheck, Activity,
  MessageSquare, Send, Heart, BookOpen, Camera, Edit
} from 'lucide-react';
import { ClientPreferences } from '../types';

const ProfileView: React.FC = () => {
  const { user, logout, accessibility, updateAccessibility, updateUserData, acceptTerms, sendFeedback, speak, requestPushPermission } = useApp();
  
  const [activeSection, setActiveSection] = useState<'settings' | 'data' | 'policies'>('settings');
  const [isAcessibilidadeOpen, setIsAcessibilidadeOpen] = useState(false);
  const [isExperienciaOpen, setIsExperienciaOpen] = useState(false);
  const [isGuiaOpen, setIsGuiaOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editBirth, setEditBirth] = useState(user?.birthDate || '');
  const [isSaved, setIsSaved] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const [ritualPrefs, setRitualPrefs] = useState<ClientPreferences>(user?.permanentPreferences || {
    environment: 'none',
    refreshment: 'Nada',
    health: { alergias: '', cheiro: '', aguaTemp: 'Morna', outros: '' },
    nails: { formato: 'none', pref: '' },
    lashes: '',
    hairExtra: 'none',
    saveToProfile: true
  });

  if (!user) return null;

  const handleSaveData = () => {
    updateUserData({ 
      name: editName, 
      birthDate: editBirth,
      permanentPreferences: ritualPrefs 
    });
    setIsSaved(true);
    speak("Dados e preferências atualizados com sucesso.");
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSendFeedback = () => {
    if (!feedbackText.trim()) return;
    sendFeedback(feedbackText);
    setFeedbackText('');
    setFeedbackSent(true);
    setTimeout(() => setFeedbackSent(false), 5000);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUserData({ profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 space-y-10 pb-16 animate-studio-fade">
      {/* Header Perfil */}
      <section className="flex flex-col items-center text-center space-y-5">
        <div className="relative group">
          <label className="cursor-pointer block">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleProfileImageChange} 
            />
            <div className="w-28 h-28 bg-studio-accent rounded-[3rem] flex items-center justify-center text-white text-5xl font-serif font-light shadow-2xl shadow-studio-accent/20 overflow-hidden relative">
              {user.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                user.name.charAt(0)
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </div>
          </label>
          <div className="absolute -bottom-2 -right-2 bg-white dark:bg-stone-800 p-2.5 rounded-full shadow-lg border border-stone-100 dark:border-stone-700">
             <Award size={20} className="text-studio-accent" />
          </div>
        </div>
        <div className="space-y-1.5">
          <h2 className="text-3xl font-serif font-medium text-studio-ink dark:text-white tracking-tight">{user.name}</h2>
          <p className="text-[11px] text-stone-600 font-bold uppercase tracking-[0.2em]">{user.phone}</p>
        </div>
      </section>

      {/* Navegação Interna */}
      <div className="flex gap-2 p-1.5 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800">
        <button 
          onClick={() => setActiveSection('settings')}
          className={`flex-1 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeSection === 'settings' ? 'bg-white dark:bg-stone-800 text-studio-accent shadow-sm' : 'text-stone-600'}`}
        >
          <Settings size={16} className="inline mr-2" /> Preferências
        </button>
        <button 
          onClick={() => setActiveSection('data')}
          className={`flex-1 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeSection === 'data' ? 'bg-white dark:bg-stone-800 text-studio-accent shadow-sm' : 'text-stone-600'}`}
        >
          <UserIcon size={16} className="inline mr-2" /> Meus Dados
        </button>
        <button 
          onClick={() => setActiveSection('policies')}
          className={`flex-1 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeSection === 'policies' ? 'bg-white dark:bg-stone-800 text-studio-accent shadow-sm' : 'text-stone-600'}`}
        >
          <ShieldCheck size={16} className="inline mr-2" /> Segurança
        </button>
      </div>

      {activeSection === 'settings' && (
        <div className="space-y-6 animate-studio-fade">
          {/* Menu de Acessibilidade */}
          <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 overflow-hidden shadow-sm">
            <button 
              onClick={() => setIsAcessibilidadeOpen(!isAcessibilidadeOpen)}
              className="w-full p-6 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              <div className="flex items-center gap-5">
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 text-studio-accent">
                  <Settings size={24} />
                </div>
                <div className="text-left">
                  <p className="text-base font-bold dark:text-white tracking-tight">Acessibilidade</p>
                  <p className="text-[10px] text-stone-600 font-bold uppercase tracking-widest mt-0.5">Personalize sua experiência</p>
                </div>
              </div>
              {isAcessibilidadeOpen ? <ChevronUp size={20} className="text-stone-400" /> : <ChevronDown size={20} className="text-stone-400" />}
            </button>

            {isAcessibilidadeOpen && (
              <div className="p-6 pt-0 space-y-4 animate-studio-fade">
                <button 
                  onClick={() => updateAccessibility({ darkMode: !accessibility.darkMode })}
                  className="w-full bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl flex items-center justify-between active:scale-95 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${accessibility.darkMode ? 'bg-studio-accent text-studio-ink' : 'bg-white dark:bg-stone-800 text-stone-600'}`}>
                      {accessibility.darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </div>
                    <p className="text-sm font-bold dark:text-white">Modo Escuro</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${accessibility.darkMode ? 'bg-studio-accent' : 'bg-stone-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${accessibility.darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </button>

                <button 
                  onClick={() => updateAccessibility({ highContrast: !accessibility.highContrast })}
                  className="w-full bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl flex items-center justify-between active:scale-95 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${accessibility.highContrast ? 'bg-studio-ink text-studio-gold' : 'bg-white dark:bg-stone-800 text-stone-600'}`}>
                      <Contrast size={20} />
                    </div>
                    <p className="text-sm font-bold dark:text-white">Alto Contraste</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${accessibility.highContrast ? 'bg-studio-ink' : 'bg-stone-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${accessibility.highContrast ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </button>

                <button 
                  onClick={() => updateAccessibility({ fontSize: accessibility.fontSize === 100 ? 125 : 100 })}
                  className="w-full bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl flex items-center justify-between active:scale-95 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${accessibility.fontSize > 100 ? 'bg-studio-accent text-studio-ink' : 'bg-white dark:bg-stone-800 text-stone-600'}`}>
                      <Type size={20} />
                    </div>
                    <p className="text-sm font-bold dark:text-white">Tamanho da Fonte</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${accessibility.fontSize > 100 ? 'bg-studio-accent' : 'bg-stone-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${accessibility.fontSize > 100 ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </button>

                <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${accessibility.readAloud ? 'bg-studio-sage text-studio-ink' : 'bg-white dark:bg-stone-800 text-stone-600'}`}>
                        <Volume2 size={20} />
                      </div>
                      <p className="text-sm font-bold dark:text-white">Narração</p>
                    </div>
                    <button 
                      onClick={() => updateAccessibility({ readAloud: !accessibility.readAloud })}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${accessibility.readAloud ? 'bg-studio-sage' : 'bg-stone-200'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${accessibility.readAloud ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  {accessibility.readAloud && (
                    <div className="pt-2 border-t border-stone-100 dark:border-stone-700 space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-stone-600">
                        <span>Velocidade</span>
                        <span className="text-studio-sage">{accessibility.speechRate}x</span>
                      </div>
                      <input type="range" min="0.5" max="2" step="0.1" value={accessibility.speechRate} onChange={e => updateAccessibility({ speechRate: parseFloat(e.target.value) })} className="w-full accent-studio-sage" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Notificações Inteligentes */}
          <div className="bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl ${user.smartNotifications ? 'bg-studio-sage/10 text-studio-sage' : 'bg-stone-50 text-stone-400'}`}>
                <Bell size={24} />
              </div>
              <div className="text-left">
                <p className="text-base font-bold dark:text-white tracking-tight">Notificações Inteligentes</p>
                <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${user.smartNotifications ? 'text-studio-sage' : 'text-stone-400'}`}>
                  {user.smartNotifications ? 'ALERTAS ATIVOS' : 'ALERTAS DESATIVADOS'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => {
                const newState = !user.smartNotifications;
                updateUserData({ smartNotifications: newState });
                if (newState) requestPushPermission();
              }}
              className={`w-14 h-7 rounded-full p-1 transition-colors ${user.smartNotifications ? 'bg-studio-sage' : 'bg-stone-200'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${user.smartNotifications ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Experiência Personalizada */}
          <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 overflow-hidden shadow-sm">
            <button 
              onClick={() => setIsExperienciaOpen(!isExperienciaOpen)}
              className="w-full p-6 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              <div className="flex items-center gap-5">
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 text-studio-accent">
                  <UserCheck size={24} />
                </div>
                <div className="text-left">
                  <p className="text-base font-bold dark:text-white tracking-tight">Experiência Personalizada</p>
                  <p className="text-[10px] text-stone-600 font-bold uppercase tracking-widest mt-0.5">Sua jornada sob medida</p>
                </div>
              </div>
              {isExperienciaOpen ? <ChevronUp size={20} className="text-stone-400" /> : <ChevronDown size={20} className="text-stone-400" />}
            </button>

            {isExperienciaOpen && (
              <div className="p-8 pt-0 space-y-8 animate-studio-fade">
                <div className="flex items-center justify-between pt-6 border-t border-stone-50 dark:border-stone-800">
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-2xl ${ritualPrefs.saveToProfile ? 'bg-studio-accent text-studio-ink' : 'bg-stone-50 text-stone-600'}`}>
                      <Heart size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-bold dark:text-white tracking-tight">Memorizar Perfil?</p>
                      <p className="text-[10px] text-stone-600 font-bold uppercase tracking-widest mt-0.5">Preferências Permanentes</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setRitualPrefs({...ritualPrefs, saveToProfile: !ritualPrefs.saveToProfile})}
                    className={`w-14 h-7 rounded-full p-1 transition-colors ${ritualPrefs.saveToProfile ? 'bg-studio-accent' : 'bg-stone-200'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${ritualPrefs.saveToProfile ? 'translate-x-7' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="space-y-4 pt-6 border-t border-stone-50 dark:border-stone-800">
                  <label className="text-[10px] font-bold text-stone-600 uppercase tracking-widest flex items-center gap-2"><Coffee size={14}/> Menu de Bebidas</label>
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
                        onClick={() => setRitualPrefs({...ritualPrefs, refreshment: item.id as any})}
                        className={`p-3 rounded-2xl text-[9px] font-bold border-2 transition-all ${ritualPrefs.refreshment === item.id ? 'bg-studio-accent border-studio-accent text-studio-ink shadow-lg' : 'bg-stone-50 dark:bg-stone-800 border-transparent text-stone-600'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-stone-50 dark:border-stone-800">
                  <label className="text-[10px] font-bold text-stone-600 uppercase tracking-widest flex items-center gap-2"><Activity size={14}/> Saúde & Bem-estar</label>
                  <div className="grid gap-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input placeholder="Alergias..." value={ritualPrefs.health.alergias} onChange={e => setRitualPrefs({...ritualPrefs, health: {...ritualPrefs.health, alergias: e.target.value}})} className="p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl text-[11px] border-2 border-transparent focus:border-studio-accent outline-none shadow-sm dark:text-white" />
                      <input placeholder="Aromas..." value={ritualPrefs.health.cheiro} onChange={e => setRitualPrefs({...ritualPrefs, health: {...ritualPrefs.health, cheiro: e.target.value}})} className="p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl text-[11px] border-2 border-transparent focus:border-studio-accent outline-none shadow-sm dark:text-white" />
                    </div>
                    <div className="bg-stone-50 dark:bg-stone-800 p-5 rounded-2xl flex items-center justify-between border border-stone-100 dark:border-stone-700 shadow-sm">
                      <span className="text-[10px] font-bold text-stone-600 uppercase flex items-center gap-2"><Droplets size={12}/> Lavatório</span>
                      <div className="flex gap-2">
                        {['Quente', 'Morna', 'Fria'].map(t => (
                          <button key={t} onClick={() => setRitualPrefs({...ritualPrefs, health: {...ritualPrefs.health, aguaTemp: t as any}})} className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase transition-all ${ritualPrefs.health.aguaTemp === t ? 'bg-studio-sage text-studio-ink shadow-md' : 'bg-white dark:bg-stone-700 text-stone-600'}`}>{t}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleSaveData}
                  className={`w-full py-5 rounded-[1.8rem] font-bold uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${isSaved ? 'bg-emerald-500 text-white' : 'bg-studio-accent text-studio-ink shadow-xl active:scale-95'}`}
                >
                  {isSaved ? <CheckCircle size={18}/> : <Save size={18}/>}
                  {isSaved ? 'Preferências Salvas!' : 'Salvar Preferências'}
                </button>
              </div>
            )}
          </div>

          {/* Guia de Uso do App */}
          <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 overflow-hidden shadow-sm">
            <button 
              onClick={() => setIsGuiaOpen(!isGuiaOpen)}
              className="w-full p-6 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              <div className="flex items-center gap-5">
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 text-studio-accent">
                  <BookOpen size={24} />
                </div>
                <div className="text-left">
                  <p className="text-base font-bold dark:text-white tracking-tight">Guia de Uso do App</p>
                  <p className="text-[10px] text-stone-600 font-bold uppercase tracking-widest mt-0.5">Aprenda a navegar no Studio</p>
                </div>
              </div>
              {isGuiaOpen ? <ChevronUp size={20} className="text-stone-400" /> : <ChevronDown size={20} className="text-stone-400" />}
            </button>

            {isGuiaOpen && (
              <div className="p-8 pt-0 space-y-8 animate-studio-fade">
                <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-stone-100 dark:border-stone-800">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://app.heygen.com/embeds/b064c067ab774201bdbfa013379d1472" 
                    title="HeyGen video player" 
                    frameBorder="0" 
                    allow="encrypted-media; fullscreen;" 
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="space-y-6 text-left">
                  <div className="space-y-2">
                    <button 
                      onClick={() => setIsManualOpen(!isManualOpen)}
                      className="w-full flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                    >
                      <div className="flex flex-col text-left">
                        <h3 className="text-sm font-serif font-bold dark:text-white">📖 Manual do Usuário: Ivone Studio</h3>
                        <p className="text-[8px] text-studio-accent font-bold uppercase tracking-widest">Versão 1.0 Premium</p>
                      </div>
                      {isManualOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    {isManualOpen && (
                      <div className="space-y-6 animate-studio-fade pt-4">
                        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                          Bem-vinda ao ecossistema digital do Ivone Studio. Este guia prático ajudará você a navegar por todas as funcionalidades do nosso aplicativo de agendamento, garantindo que sua jornada de beleza comece antes mesmo de você chegar ao salão.
                        </p>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <p className="text-xs font-bold dark:text-white">1. Visão Geral (Tela Inicial)</p>
                            <ul className="text-[11px] text-stone-600 dark:text-stone-400 space-y-1 list-disc pl-4">
                              <li><span className="font-bold">Próximos Agendamentos:</span> No topo, você verá seus horários confirmados.</li>
                              <li><span className="font-bold">Check-in:</span> No dia do seu atendimento, um botão de "Estou no Salão" aparecerá aqui.</li>
                              <li><span className="font-bold">Clube de Pontos:</span> Acompanhe quantos pontos você tem para trocar por mimos.</li>
                              <li><span className="font-bold">Reagendamento Rápido:</span> Atalhos para os serviços que você mais ama.</li>
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-bold dark:text-white">2. Como Realizar um Agendamento</p>
                            <p className="text-[11px] text-stone-600 dark:text-stone-400">O processo é dividido em 4 passos simples e intuitivos:</p>
                            <div className="pl-2 space-y-3">
                              <div className="space-y-1">
                                <p className="text-[11px] font-bold dark:text-stone-200">Passo 1: Escolha do Serviço</p>
                                <ul className="text-[10px] text-stone-500 dark:text-stone-400 space-y-1 list-disc pl-4">
                                  <li>Toque no botão "Agendar Agora" na Home ou no ícone de Calendário no menu inferior.</li>
                                  <li>Categorias: Filtre por Cabelo, Unhas, Rosto, etc.</li>
                                  <li>Serviço: Toque no serviço desejado. Você verá a duração e uma breve descrição.</li>
                                </ul>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[11px] font-bold dark:text-stone-200">Passo 2: Data e Horário</p>
                                <ul className="text-[10px] text-stone-500 dark:text-stone-400 space-y-1 list-disc pl-4">
                                  <li>Calendário: Selecione o dia desejado. Dias com bolinhas indicam disponibilidade.</li>
                                  <li>Horários: Escolha entre os horários disponíveis (Manhã ou Tarde).</li>
                                  <li><span className="italic">Dica: Se um horário não aparece, é porque já foi reservado por outra cliente.</span></li>
                                </ul>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[11px] font-bold dark:text-stone-200">Passo 3: Experiência Personalizada (Opcional)</p>
                                <ul className="text-[10px] text-stone-500 dark:text-stone-400 space-y-1 list-disc pl-4">
                                  <li>Ambiente: Escolha entre "Papo" ou "Zen".</li>
                                  <li>Bebidas: Selecione sua preferência (Café, Chá, Água ou Nada).</li>
                                  <li>Saúde: Informe alergias ou preferências de temperatura da água.</li>
                                </ul>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[11px] font-bold dark:text-stone-200">Passo 4: Confirmação</p>
                                <ul className="text-[10px] text-stone-500 dark:text-stone-400 space-y-1 list-disc pl-4">
                                  <li>Revise todos os dados e toque em "Confirmar Reserva".</li>
                                  <li>Pronto! Sua reserva foi enviada e você será notificada.</li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-bold dark:text-white">3. Gestão de Agendamentos (Editar e Cancelar)</p>
                            <ul className="text-[11px] text-stone-600 dark:text-stone-400 space-y-1 list-disc pl-4">
                              <li><span className="font-bold">Para Cancelar:</span> Localize o card na Home e toque no "X".</li>
                              <li><span className="italic">Nota: Pedimos que cancele com pelo menos 24h de antecedência.</span></li>
                              <li><span className="font-bold">Para Editar:</span> Recomendamos cancelar o atual e realizar um novo agendamento.</li>
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-bold dark:text-white">4. Perfil e Dados Pessoais</p>
                            <ul className="text-[11px] text-stone-600 dark:text-stone-400 space-y-1 list-disc pl-4">
                              <li><span className="font-bold">Meus Dados:</span> Atualize seu nome e data de nascimento.</li>
                              <li><span className="font-bold">Experiência Permanente:</span> Salve suas preferências para agilizar futuros agendamentos.</li>
                              <li><span className="font-bold">Acessibilidade:</span> Personalize o modo escuro e tamanho da fonte.</li>
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-bold dark:text-white">5. Dicas de Ouro ✨</p>
                            <ul className="text-[11px] text-stone-600 dark:text-stone-400 space-y-1 list-disc pl-4">
                              <li><span className="font-bold">Check-in com Foto:</span> Ao chegar, use a foto para avisar a Ivone e agilizar o atendimento.</li>
                              <li><span className="font-bold">Galeria:</span> Inspire-se com nossos resultados e linhas de produtos.</li>
                              <li><span className="font-bold">Indique Amigas:</span> Use seu código para ganhar pontos extras!</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-stone-100 dark:border-stone-800 space-y-2">
                    <p className="text-xs font-bold dark:text-white">Suporte e Ouvidoria</p>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-relaxed">
                      Caso tenha qualquer dúvida ou sugestão, utilize a seção "Ouvidoria Ivone" dentro do seu Perfil. Sua voz é fundamental para mantermos o padrão Premium do nosso Studio.
                    </p>
                    <div className="pt-2 text-[9px] text-stone-400 font-bold uppercase tracking-widest">
                      <p>Ivone Studio</p>
                      <p>Rua Olinda, 23 - São Bernardo do Campo</p>
                      <p>WhatsApp: (11) 99730-8578</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reclamações e Sugestões */}
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
        </div>
      )}

      {activeSection === 'data' && (
        <div className="space-y-4 animate-fade">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-[2.5rem] border border-[#F5E6DA] dark:border-zinc-800 space-y-5 shadow-sm">
             <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-2"><UserIcon size={12}/> Nome Completo</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl outline-none border border-transparent focus:border-[#D4B499] text-sm dark:text-white" />
             </div>
             <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-2"><Calendar size={12}/> Data de Nascimento</label>
                <input type="date" value={editBirth} onChange={e => setEditBirth(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl outline-none border border-transparent focus:border-[#D4B499] text-sm dark:text-white" />
                <p className="text-[8px] text-[#D99489] font-bold uppercase tracking-wider mt-1">🎁 Ganhe 10% de desconto no seu mês e um atendimento especializado!</p>
             </div>
             <div className="space-y-2 opacity-50">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-2"><Phone size={12}/> WhatsApp (Identificador)</label>
                <input value={user.phone} disabled className="w-full p-4 bg-gray-100 dark:bg-zinc-900 rounded-2xl text-sm dark:text-gray-500" />
             </div>
             
             <button 
                onClick={handleSaveData}
                className={`w-full py-5 rounded-[1.8rem] font-bold uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${isSaved ? 'bg-emerald-500 text-white' : 'bg-[#D4B499] text-studio-ink shadow-xl active:scale-95'}`}
             >
                {isSaved ? <CheckCircle size={18}/> : <Save size={18}/>}
                {isSaved ? 'Dados Salvos!' : 'Salvar Alterações'}
             </button>
          </div>
        </div>
      )}

      {activeSection === 'policies' && (
        <div className="space-y-6 animate-fade">
          <div className="bg-white dark:bg-zinc-800 border border-[#F5E6DA] dark:border-zinc-800 p-8 rounded-[3.5rem] shadow-sm space-y-6">
             <div className="flex items-center gap-3 text-studio-accent">
                <ShieldCheck size={28} />
                <h3 className="font-serif font-bold text-xl dark:text-white tracking-tight">Privacidade Ivone</h3>
             </div>
             <div className="bg-stone-50 dark:bg-stone-900 p-6 rounded-[2rem] border border-stone-100 dark:border-stone-800">
               <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed italic whitespace-pre-wrap no-scrollbar overflow-y-auto max-h-60">
                  {TERMS_TEXT}
               </p>
             </div>
             
             {user.termsAccepted ? (
               <div className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                  <div className="w-10 h-10 bg-white dark:bg-stone-800 rounded-full flex items-center justify-center text-emerald-500 shadow-sm">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Termos Aceitos</p>
                    <p className="text-[8px] text-emerald-600/70 dark:text-emerald-500/70 uppercase tracking-widest mt-0.5">LGPD Compliant</p>
                  </div>
               </div>
             ) : (
               <button 
                 onClick={acceptTerms}
                 className="w-full bg-studio-accent text-studio-ink py-5 rounded-2xl font-bold uppercase text-[11px] tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
               >
                 <CheckCircle size={18} /> Aceito os Termos
               </button>
             )}
          </div>
        </div>
      )}

      <button onClick={logout} className="w-full flex items-center justify-center gap-3 py-6 rounded-[2rem] border-2 border-rose-100 dark:border-rose-900/30 text-rose-400 font-bold uppercase text-[11px] tracking-widest active:scale-95 transition-all">
        <LogOut size={20} /> Encerrar Sessão
      </button>

      <div className="text-center">
        <p className="text-[8px] text-gray-300 font-bold uppercase tracking-[0.5em]">Ivone Studio • v1 Premium</p>
      </div>
    </div>
  );
};

export default ProfileView;
