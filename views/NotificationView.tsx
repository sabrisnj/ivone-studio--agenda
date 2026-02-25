
import React, { useEffect } from 'react';
import { useApp } from '../store';
// Add Sparkles to the lucide-react imports
import { Bell, Calendar, Tag, Info, Trash2, X, Sparkles } from 'lucide-react';

const NotificationView: React.FC = () => {
  const { notifications, markNotificationsAsRead, deleteNotification } = useApp();

  useEffect(() => {
    markNotificationsAsRead();
  }, [markNotificationsAsRead]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'schedule': return <Calendar className="text-blue-400" size={18} />;
      case 'promo': return <Tag className="text-amber-400" size={18} />;
      default: return <Info className="text-[#D4B499]" size={18} />;
    }
  };

  return (
    <div className="p-6 space-y-10 pb-16 animate-studio-fade">
      <header className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-4xl font-serif font-medium text-studio-ink dark:text-white tracking-tight">Inbox</h2>
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.25em] mt-1">Lembretes & Ofertas</p>
        </div>
        <div className="bg-stone-50 dark:bg-stone-800 p-4 rounded-2xl text-studio-accent shadow-inner border border-stone-100 dark:border-stone-700">
          <Bell size={28} strokeWidth={1.5} />
        </div>
      </header>

      <div className="space-y-5">
        {notifications.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 p-20 rounded-[3.5rem] border border-dashed border-stone-200 dark:border-stone-800 text-center space-y-6 shadow-sm">
            <div className="w-20 h-20 bg-stone-50 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto text-stone-200 dark:text-stone-700">
              <Bell size={40} strokeWidth={1} />
            </div>
            <p className="text-sm text-stone-400 font-serif italic">Sua caixa de entrada está limpa!</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div 
              key={notif.id} 
              className={`p-6 rounded-[2.5rem] border transition-all flex gap-5 group relative ${
                !notif.read ? 'bg-white dark:bg-stone-900 border-studio-accent/20 shadow-xl shadow-studio-accent/5' : 'bg-stone-50/50 dark:bg-stone-900/50 border-transparent'
              }`}
            >
              <div className="mt-1 flex-shrink-0">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white dark:bg-stone-800 shadow-sm border border-stone-100 dark:border-stone-700`}>
                  {getIcon(notif.type)}
                </div>
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex justify-between items-start">
                  <h4 className={`text-base font-bold leading-tight pr-6 tracking-tight ${!notif.read ? 'text-studio-ink dark:text-white' : 'text-stone-400'}`}>
                    {notif.title}
                  </h4>
                  <button 
                    onClick={() => deleteNotification(notif.id)}
                    className="absolute top-6 right-6 text-stone-300 hover:text-rose-500 p-1.5 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className={`text-[12px] leading-relaxed font-serif ${!notif.read ? 'text-stone-600 dark:text-stone-300' : 'text-stone-400'}`}>
                  {notif.body}
                </p>
                <div className="pt-3 flex justify-between items-center">
                   <span className="text-[9px] text-stone-300 font-bold uppercase tracking-widest">
                    {notif.timestamp.toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!notif.read && <div className="w-2 h-2 bg-studio-accent rounded-full shadow-lg shadow-studio-accent/50" />}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-studio-accent/5 p-8 rounded-[3rem] border border-studio-accent/10 flex gap-5 items-center shadow-sm">
        <Sparkles size={28} className="text-studio-accent" strokeWidth={1.5} />
        <p className="text-[11px] text-studio-accent leading-relaxed font-bold uppercase tracking-widest">
          Dica: Mantenha suas notificações ativas para ganhar mimos relâmpago!
        </p>
      </div>
    </div>
  );
};

export default NotificationView;
