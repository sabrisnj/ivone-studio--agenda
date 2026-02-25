
import React, { useState } from 'react';
import { useApp } from '../store';
import { TERMS_TEXT } from '../constants';
import { 
  LogOut, Moon, Sun, Type, Volume2, Award, 
  ShieldCheck, CheckCircle, Contrast, Settings, Info,
  User as UserIcon, Calendar, Phone, Save
} from 'lucide-react';

const ProfileView: React.FC = () => {
  const { user, logout, accessibility, updateAccessibility, updateUserData, speak } = useApp();
  
  const [activeSection, setActiveSection] = useState<'settings' | 'data' | 'policies'>('settings');
  const [editName, setEditName] = useState(user?.name || '');
  const [editBirth, setEditBirth] = useState(user?.birthDate || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!user) return null;

  const handleSaveData = () => {
    updateUserData({ name: editName, birthDate: editBirth });
    setIsSaved(true);
    speak("Dados atualizados com sucesso.");
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-10 pb-16 animate-studio-fade">
      {/* Header Perfil */}
      <section className="flex flex-col items-center text-center space-y-5">
        <div className="relative">
          <div className="w-28 h-28 bg-studio-accent rounded-[3rem] flex items-center justify-center text-white text-5xl font-serif font-light shadow-2xl shadow-studio-accent/20">
            {user.name.charAt(0)}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white dark:bg-stone-800 p-2.5 rounded-full shadow-lg border border-stone-100 dark:border-stone-700">
             <Award size={20} className="text-studio-accent" />
          </div>
        </div>
        <div className="space-y-1.5">
          <h2 className="text-3xl font-serif font-medium text-studio-ink dark:text-white tracking-tight">{user.name}</h2>
          <p className="text-[11px] text-stone-400 font-bold uppercase tracking-[0.2em]">{user.phone}</p>
        </div>
      </section>

      {/* Navegação Interna */}
      <div className="flex gap-2 p-1.5 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800">
        <button 
          onClick={() => setActiveSection('settings')}
          className={`flex-1 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeSection === 'settings' ? 'bg-white dark:bg-stone-800 text-studio-accent shadow-sm' : 'text-stone-400'}`}
        >
          <Settings size={16} className="inline mr-2" /> Preferências
        </button>
        <button 
          onClick={() => setActiveSection('data')}
          className={`flex-1 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeSection === 'data' ? 'bg-white dark:bg-stone-800 text-studio-accent shadow-sm' : 'text-stone-400'}`}
        >
          <UserIcon size={16} className="inline mr-2" /> Meus Dados
        </button>
        <button 
          onClick={() => setActiveSection('policies')}
          className={`flex-1 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeSection === 'policies' ? 'bg-white dark:bg-stone-800 text-studio-accent shadow-sm' : 'text-stone-400'}`}
        >
          <ShieldCheck size={16} className="inline mr-2" /> Segurança
        </button>
      </div>

      {activeSection === 'settings' && (
        <div className="space-y-5 animate-studio-fade">
          <button 
            onClick={() => updateAccessibility({ darkMode: !accessibility.darkMode })}
            className="w-full bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 flex items-center justify-between shadow-sm active:scale-95 transition-all hover:border-studio-accent/20"
          >
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl ${accessibility.darkMode ? 'bg-studio-accent text-white' : 'bg-stone-50 text-stone-400'}`}>
                {accessibility.darkMode ? <Sun size={24} /> : <Moon size={24} />}
              </div>
              <div className="text-left">
                <p className="text-base font-bold dark:text-white tracking-tight">Modo Escuro</p>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">{accessibility.darkMode ? 'Ativado' : 'Desativado'}</p>
              </div>
            </div>
            <div className={`w-14 h-7 rounded-full p-1 transition-colors ${accessibility.darkMode ? 'bg-studio-accent' : 'bg-stone-200'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${accessibility.darkMode ? 'translate-x-7' : 'translate-x-0'}`} />
            </div>
          </button>

          <button 
            onClick={() => updateAccessibility({ highContrast: !accessibility.highContrast })}
            className="w-full bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 flex items-center justify-between shadow-sm active:scale-95 transition-all hover:border-studio-accent/20"
          >
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl ${accessibility.highContrast ? 'bg-studio-ink text-studio-gold' : 'bg-stone-50 text-stone-400'}`}>
                <Contrast size={24} />
              </div>
              <div className="text-left">
                <p className="text-base font-bold dark:text-white tracking-tight">Alto Contraste</p>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">Leitura Otimizada</p>
              </div>
            </div>
            <div className={`w-14 h-7 rounded-full p-1 transition-colors ${accessibility.highContrast ? 'bg-studio-ink' : 'bg-stone-200'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${accessibility.highContrast ? 'translate-x-7' : 'translate-x-0'}`} />
            </div>
          </button>

          <div className="bg-white dark:bg-stone-900 p-8 rounded-[3rem] border border-stone-100 dark:border-stone-800 space-y-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl ${accessibility.readAloud ? 'bg-studio-sage text-white' : 'bg-stone-50 text-stone-400'}`}>
                  <Volume2 size={24} />
                </div>
                <div className="text-left">
                  <p className="text-base font-bold dark:text-white tracking-tight">Narração (Ivone Voice)</p>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">Assistente Virtual</p>
                </div>
              </div>
              <button 
                onClick={() => updateAccessibility({ readAloud: !accessibility.readAloud })}
                className={`w-14 h-7 rounded-full p-1 transition-colors ${accessibility.readAloud ? 'bg-studio-sage' : 'bg-stone-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${accessibility.readAloud ? 'translate-x-7' : 'translate-x-0'}`} />
              </button>
            </div>
            {accessibility.readAloud && (
              <div className="space-y-5 pt-6 border-t border-stone-50 dark:border-stone-800">
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    <span>Velocidade</span>
                    <span className="text-studio-sage">{accessibility.speechRate}x</span>
                  </div>
                  <input type="range" min="0.5" max="2" step="0.1" value={accessibility.speechRate} onChange={e => updateAccessibility({ speechRate: parseFloat(e.target.value) })} className="w-full accent-studio-sage" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'data' && (
        <div className="space-y-4 animate-fade">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-[2.5rem] border border-[#F5E6DA] dark:border-zinc-800 space-y-5 shadow-sm">
             <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><UserIcon size={12}/> Nome Completo</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl outline-none border border-transparent focus:border-[#D4B499] text-sm dark:text-white" />
             </div>
             <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Calendar size={12}/> Data de Nascimento</label>
                <input type="date" value={editBirth} onChange={e => setEditBirth(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl outline-none border border-transparent focus:border-[#D4B499] text-sm dark:text-white" />
                <p className="text-[8px] text-gray-400 italic">Usamos sua data para preparar surpresas no seu mês!</p>
             </div>
             <div className="space-y-2 opacity-50">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Phone size={12}/> WhatsApp (Identificador)</label>
                <input value={user.phone} disabled className="w-full p-4 bg-gray-100 dark:bg-zinc-900 rounded-2xl text-sm dark:text-gray-500" />
             </div>
             
             <button 
                onClick={handleSaveData}
                className={`w-full py-5 rounded-[1.8rem] font-bold uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${isSaved ? 'bg-emerald-500 text-white' : 'bg-[#D4B499] text-white shadow-xl active:scale-95'}`}
             >
                {isSaved ? <CheckCircle size={18}/> : <Save size={18}/>}
                {isSaved ? 'Dados Salvos!' : 'Salvar Alterações'}
             </button>
          </div>
        </div>
      )}

      {activeSection === 'policies' && (
        <div className="space-y-6 animate-fade">
          <div className="bg-white dark:bg-zinc-800 border border-[#F5E6DA] dark:border-zinc-800 p-8 rounded-[2.5rem] shadow-sm space-y-4">
             <div className="flex items-center gap-3 text-[#D4B499]">
                <ShieldCheck size={24} />
                <h3 className="font-serif font-bold text-lg dark:text-white">Privacidade Ivone</h3>
             </div>
             <p className="text-[11px] text-gray-500 leading-relaxed italic whitespace-pre-wrap no-scrollbar overflow-y-auto max-h-60">
                {TERMS_TEXT}
             </p>
             <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                <CheckCircle size={14} className="text-emerald-500" />
                <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">LGPD Compliant</span>
             </div>
          </div>
        </div>
      )}

      <button onClick={logout} className="w-full flex items-center justify-center gap-3 py-6 rounded-[2rem] border-2 border-rose-100 dark:border-rose-900/30 text-rose-400 font-bold uppercase text-[11px] tracking-widest active:scale-95 transition-all">
        <LogOut size={20} /> Encerrar Sessão
      </button>

      <div className="text-center">
        <p className="text-[8px] text-gray-300 font-bold uppercase tracking-[0.5em]">Ivone Studio • v2.6.0 Premium</p>
      </div>
    </div>
  );
};

export default ProfileView;
