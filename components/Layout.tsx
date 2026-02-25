
import React, { useRef, useEffect } from 'react';
import { useApp } from '../store';
import { motion } from 'framer-motion';
import { 
  Home as HomeIcon, 
  Calendar, 
  User as UserIcon, 
  Award, 
  Bell,
  MessageCircle,
  Image as ImageIcon
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface TabItem {
  id: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { notifications, chatMessages, isAdmin, user } = useApp();
  const tabsRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const unreadMessages = chatMessages.filter(m => !m.read && (isAdmin ? m.sender === 'client' : m.sender === 'admin')).length;

  const tabs: TabItem[] = [
    { id: 'home', icon: HomeIcon, label: 'Início' },
    { id: 'gallery', icon: ImageIcon, label: 'Galeria' },
    { id: 'schedule', icon: Calendar, label: 'Agendar' },
    { id: 'chat', icon: MessageCircle, label: 'Chat', badge: unreadMessages },
    { id: 'points', icon: Award, label: 'Pontos' },
    { id: 'profile', icon: UserIcon, label: 'Perfil' },
  ];

  if (isAdmin) {
    tabs.unshift({ id: 'admin', icon: Award, label: 'Gestão' });
  }

  useEffect(() => {
    const activeTabElement = document.getElementById(`nav-tab-${activeTab}`);
    if (activeTabElement && tabsRef.current) {
      const container = tabsRef.current;
      const scrollLeft = activeTabElement.offsetLeft - container.offsetWidth / 2 + activeTabElement.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeTab]);

  return (
    <div className="flex flex-col min-h-screen bg-studio-bg dark:bg-stone-950 max-w-md mx-auto relative shadow-2xl overflow-hidden transition-colors">
      <header className="sticky top-0 z-50 px-6 py-5 flex justify-between items-center glass-nav border-b border-studio-accent/5">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
           <div className="w-11 h-11 bg-studio-accent rounded-2xl flex items-center justify-center text-white font-serif font-light text-xl shadow-lg shadow-studio-accent/20">IH</div>
           <div>
              <h1 className="text-base font-serif font-medium text-studio-ink dark:text-white leading-none tracking-tight">Ivone Studio</h1>
              <p className="text-[9px] text-studio-sage font-bold uppercase tracking-[0.25em] mt-1">Premium Beauty</p>
           </div>
        </motion.div>
        <motion.button 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTab('notifications')}
          className="relative p-3 bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 active:scale-90 transition-all hover:bg-stone-50 dark:hover:bg-stone-700"
          aria-label="Ver notificações"
        >
          <Bell size={20} className="text-studio-accent" />
          {unreadNotifs > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-stone-900">
              {unreadNotifs}
            </span>
          )}
        </motion.button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar bg-transparent pb-32">
        {children}
      </main>

      <nav className="fixed bottom-8 left-6 right-6 z-50 glass-nav border border-studio-accent/10 rounded-[2.5rem] p-2 shadow-2xl shadow-studio-accent/10">
        <div 
          ref={tabsRef}
          className="flex items-center gap-1 overflow-x-auto no-scrollbar px-2 snap-x snap-mandatory scroll-smooth"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                id={`nav-tab-${tab.id}`}
                key={tab.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveTab(tab.id)}
                className={`relative p-3.5 rounded-2xl transition-all duration-500 flex flex-col items-center justify-center min-w-[4.5rem] snap-center ${
                  isActive 
                    ? 'text-white -translate-y-1' 
                    : 'text-stone-400 hover:text-studio-accent'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-tab"
                    className="absolute inset-0 bg-studio-accent rounded-2xl shadow-xl shadow-studio-accent/30"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center gap-1.5">
                  <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <motion.span 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[8px] font-bold uppercase tracking-widest"
                    >
                      {tab.label}
                    </motion.span>
                  )}
                </div>
                {tab.badge ? (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 z-20 w-4 h-4 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-stone-900"
                  >
                    {tab.badge}
                  </motion.span>
                ) : null}
              </motion.button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
