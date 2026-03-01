
import React from 'react';
import { useApp } from '../store';
// Added Ticket to the imports to fix the "Cannot find name 'Ticket'" error
import { Award, Sparkles, Scissors, Footprints, Gift, Share2, Users, Copy, CheckCircle2, Clock, HelpCircle, Ticket, Instagram } from 'lucide-react';

const PointsView: React.FC = () => {
  const { user, speak, salonConfig } = useApp();

  if (!user) return null;

  const rules = salonConfig.loyaltyClub.cards.map(card => {
    let current = 0;
    if (card.id === 'escovas') current = user.points.escovas;
    else if (card.id === 'unhas') current = user.points.manicurePedicure;
    else if (card.id === 'cilios') current = user.points.ciliosManutencao;
    
    let icon = Scissors;
    let color = 'bg-rose-50 text-rose-500';
    
    if (card.category === 'Nails') {
      icon = Footprints;
      color = 'bg-amber-50 text-amber-500';
    } else if (card.category === 'Lashes') {
      icon = Sparkles;
      color = 'bg-purple-50 text-purple-500';
    }

    return {
      ...card,
      current,
      total: card.target,
      icon,
      color,
      title: card.name
    };
  });

  const handleShare = async () => {
    const text = `Oi! Adorei o Studio Ivone! Use meu código ${user.referralCode} ao baixar o app e ganhe ${salonConfig.loyaltyClub.referral.discount} de desconto no seu primeiro serviço! 💖\n\nPoste sua experiência e marque @ivonehairstudio para ganhar +${salonConfig.loyaltyClub.socialMediaStar.discount} OFF extra! 📸✨`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Presente Studio Ivone', text: text, url: window.location.href });
      } catch (err) { console.log(err); }
    } else {
      navigator.clipboard.writeText(text);
      speak("Código de indicação e convite social copiados!");
      alert('Código e convite social copiados para sua área de transferência!');
    }
  };

  return (
    <div className="p-6 space-y-10 animate-studio-fade pb-16">
      <header className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-stone-50 dark:bg-stone-800 rounded-full text-studio-accent mb-2 shadow-inner" aria-hidden="true">
          <Award size={40} strokeWidth={1.5} />
        </div>
        <h2 className="text-4xl font-serif font-medium text-studio-ink dark:text-white tracking-tight">Clube de Pontos</h2>
        <p className="text-sm text-stone-400 font-serif italic">Acumule serviços e ganhe mimos premium</p>
      </header>

      {/* Social Media Star Voucher */}
      <section className="bg-white dark:bg-stone-900 border border-studio-accent/20 p-6 rounded-[2.5rem] shadow-sm space-y-4 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl flex items-center justify-center">
            <Instagram size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-studio-ink dark:text-white uppercase tracking-tight">Social Media Star</h3>
            <p className="text-[10px] text-stone-500 font-medium">Ganhe {salonConfig.loyaltyClub.socialMediaStar.discount} OFF Extra</p>
          </div>
          <div className="bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full">
            NOVO
          </div>
        </div>
        <p className="text-[11px] text-stone-600 dark:text-stone-400 italic leading-relaxed relative z-10">
          {salonConfig.loyaltyClub.socialMediaStar.rule}
        </p>
        <Sparkles className="absolute -right-4 -bottom-4 text-rose-500/10" size={100} />
      </section>

      {/* Seção Indique e Ganhe Validada */}
      <section className="bg-gradient-to-br from-studio-sage to-emerald-600 p-8 rounded-[3rem] text-white shadow-2xl shadow-studio-sage/20 relative overflow-hidden group" aria-labelledby="referral-title">
         <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
               <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md" aria-hidden="true">
                  <Gift size={28} />
               </div>
               <div>
                  <h3 id="referral-title" className="text-xl font-serif font-medium leading-tight">Ganhe {salonConfig.loyaltyClub.referral.discount} OFF!</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Indique suas melhores amigas</p>
               </div>
            </div>
            
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 backdrop-blur-sm space-y-2">
              <p className="text-[11px] leading-relaxed opacity-90 font-medium italic font-serif">
                {salonConfig.loyaltyClub.referral.rule}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/20 p-4 rounded-2xl border border-white/20 backdrop-blur-md">
               <span className="flex-1 text-base font-bold tracking-[0.2em] uppercase text-center">{user.referralCode}</span>
               <button onClick={handleShare} aria-label="Compartilhar código" className="bg-white text-studio-sage p-3 rounded-xl shadow-lg active:scale-90 transition-all hover:bg-stone-50">
                  <Share2 size={18} />
               </button>
            </div>

            {user.referrals.length > 0 && (
              <div className="space-y-4 pt-2">
                 <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Status das Amigas:</p>
                    <HelpCircle size={14} className="opacity-40" />
                 </div>
                 <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                    {user.referrals.map((ref, i) => (
                      <div key={i} className="bg-white/10 px-5 py-4 rounded-2xl border border-white/10 flex items-center gap-4 whitespace-nowrap min-w-[140px] backdrop-blur-sm">
                         <div className="flex flex-col">
                            <span className="text-[11px] font-bold">{ref.friendName}</span>
                            <span className="text-[8px] uppercase font-bold opacity-70 mt-0.5">
                              {ref.status === 'converted' ? 'Validado ✅' : 'Aguardando ⏳'}
                            </span>
                         </div>
                         {ref.status === 'converted' ? (
                           <CheckCircle2 size={16} className="text-emerald-300" />
                         ) : (
                           <Clock size={16} className="text-amber-200" />
                         )}
                      </div>
                    ))}
                 </div>
              </div>
            )}
         </div>
         <Gift className="absolute -right-16 -bottom-16 opacity-10 rotate-12" size={240} aria-hidden="true" />
      </section>

      {/* Cartões de Pontos */}
      <div className="space-y-6">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-400 dark:text-stone-600 px-2">Meus Cartões</h3>
        {rules.map((rule) => {
          const Icon = rule.icon;
          const progress = Math.min((rule.current / rule.total) * 100, 100);
          return (
            <div key={rule.id} className="bg-white dark:bg-stone-900 p-8 rounded-[3rem] shadow-sm border border-stone-100 dark:border-stone-800 space-y-6" role="progressbar" aria-valuenow={rule.current} aria-valuemin={0} aria-valuemax={rule.total}>
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl ${rule.color} shadow-sm`} aria-hidden="true"><Icon size={28} /></div>
                <div className="flex-1">
                  <h4 className="font-bold text-stone-800 dark:text-white text-base tracking-tight">{rule.title}</h4>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mt-0.5">{rule.current}/{rule.total} Procedimentos</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-3 w-full bg-stone-50 dark:bg-stone-800 rounded-full overflow-hidden border border-stone-100 dark:border-stone-700">
                  <div className="h-full bg-gradient-to-r from-studio-accent to-studio-gold transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex items-center gap-3 bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-700">
                  <Ticket size={16} className="text-studio-accent" />
                  <p className="text-[11px] font-bold text-studio-accent uppercase tracking-tight">Prêmio: {rule.reward}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Export default PointsView to fix import error in App.tsx
export default PointsView;
