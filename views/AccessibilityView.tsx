
import React from 'react';
import { useApp } from '../store';
import { 
  Accessibility, 
  Moon, 
  Sun, 
  Type, 
  Volume2, 
  Contrast, 
  Info,
  ChevronRight
} from 'lucide-react';

const AccessibilityView: React.FC = () => {
  const { accessibility, updateAccessibility } = useApp();

  return (
    <div className="p-6 space-y-8 animate-fade pb-10">
      <header className="space-y-2">
        <div className="w-14 h-14 bg-[#FAF7F5] dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-[#D4B499] shadow-inner mb-4">
          <Accessibility size={30} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-gray-800 dark:text-white">Acessibilidade</h2>
        <p className="text-sm text-gray-400">Personalize o Studio Ivone para sua melhor experiência de navegação.</p>
      </header>

      <div className="space-y-4">
        {/* Toggle Dark Mode */}
        <button 
          onClick={() => updateAccessibility({ darkMode: !accessibility.darkMode })}
          className="w-full bg-white dark:bg-zinc-800 border border-[#F5E6DA] dark:border-zinc-700 p-5 rounded-[2rem] flex items-center justify-between shadow-sm active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${accessibility.darkMode ? 'bg-[#D99489] text-white' : 'bg-gray-100 text-gray-400'}`}>
              {accessibility.darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-800 dark:text-white">Modo Escuro</p>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{accessibility.darkMode ? 'Ativado' : 'Desativado'}</p>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full p-1 transition-colors ${accessibility.darkMode ? 'bg-[#D99489]' : 'bg-gray-200'}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${accessibility.darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </button>

        {/* Toggle High Contrast */}
        <button 
          onClick={() => updateAccessibility({ highContrast: !accessibility.highContrast })}
          className="w-full bg-white dark:bg-zinc-800 border border-[#F5E6DA] dark:border-zinc-700 p-5 rounded-[2rem] flex items-center justify-between shadow-sm active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${accessibility.highContrast ? 'bg-black text-yellow-400' : 'bg-gray-100 text-gray-400'}`}>
              <Contrast size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-800 dark:text-white">Alto Contraste</p>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{accessibility.highContrast ? 'Ativado' : 'Melhora visibilidade'}</p>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full p-1 transition-colors ${accessibility.highContrast ? 'bg-black' : 'bg-gray-200'}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${accessibility.highContrast ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </button>

        {/* Font Size Slider */}
        <div className="bg-white dark:bg-zinc-800 border border-[#F5E6DA] dark:border-zinc-700 p-6 rounded-[2rem] space-y-4 shadow-sm">
           <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gray-100 dark:bg-zinc-700 text-gray-400">
              <Type size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-800 dark:text-white">Tamanho da Fonte</p>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Escalonamento: {accessibility.fontSize}%</p>
            </div>
          </div>
          <input 
            type="range" 
            min="80" 
            max="150" 
            step="10"
            value={accessibility.fontSize}
            onChange={(e) => updateAccessibility({ fontSize: parseInt(e.target.value) })}
            className="w-full accent-[#D99489] h-1 bg-gray-100 dark:bg-zinc-700 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            <span>Padrão</span>
            <span>Máximo</span>
          </div>
        </div>

        {/* Toggle Read Aloud */}
        <button 
          onClick={() => updateAccessibility({ readAloud: !accessibility.readAloud })}
          className="w-full bg-white dark:bg-zinc-800 border border-[#F5E6DA] dark:border-zinc-700 p-5 rounded-[2rem] flex items-center justify-between shadow-sm active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${accessibility.readAloud ? 'bg-[#86BDB1] text-white' : 'bg-gray-100 text-gray-400'}`}>
              <Volume2 size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-800 dark:text-white">Leitura em Voz</p>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{accessibility.readAloud ? 'Narrador Ativo' : 'Ativar áudio'}</p>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full p-1 transition-colors ${accessibility.readAloud ? 'bg-[#86BDB1]' : 'bg-gray-200'}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${accessibility.readAloud ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </button>
      </div>

      <div className="bg-[#FAF7F5] dark:bg-zinc-800 p-6 rounded-[2rem] border border-[#F5E6DA] dark:border-zinc-700 flex gap-4 items-start">
        <Info size={20} className="text-[#D4B499] flex-shrink-0" />
        <p className="text-[10px] text-gray-500 leading-relaxed italic">
          Essas configurações facilitam a interação de pessoas com baixa visão, sensibilidade à luz ou que preferem suporte por áudio. O Studio Ivone valoriza cada cliente.
        </p>
      </div>
    </div>
  );
};

export default AccessibilityView;
