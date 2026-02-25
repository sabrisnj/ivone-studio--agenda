
import React, { useState } from 'react';
import { Star, X, Sparkles } from 'lucide-react';
import { useApp } from '../store';

const RatingPopup: React.FC = () => {
  const { user, appointments, services, rateAppointment } = useApp();
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);

  // Encontra o primeiro agendamento concluído que ainda não foi avaliado
  const pendingRating = appointments.find(
    app => app.clientPhone === user?.phone && app.status === 'completed' && !app.rating
  );

  if (!pendingRating) return null;

  const service = services.find(s => s.id === pendingRating.serviceId);

  const handleSubmit = () => {
    if (selectedRating > 0) {
      rateAppointment(pendingRating.id, selectedRating, comment);
      setSelectedRating(0);
      setComment('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fade">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[3rem] p-8 shadow-2xl border border-[#F5E6DA] dark:border-zinc-800 space-y-6 text-center">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
            <Sparkles size={24} />
          </div>
          <button onClick={() => rateAppointment(pendingRating.id, -1)} className="text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-serif font-bold text-gray-800 dark:text-white">Como foi sua experiência?</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
            {service?.name} • {pendingRating.date.split('-').reverse().join('/')}
          </p>
        </div>

        <div className="flex justify-center gap-2 py-4">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setSelectedRating(star)}
              className="transition-transform active:scale-90"
            >
              <Star
                size={36}
                className={`${
                  (hoverRating || selectedRating) >= star 
                    ? 'fill-amber-400 text-amber-400' 
                    : 'text-gray-200 dark:text-zinc-700'
                } transition-colors`}
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>

        <textarea
          placeholder="Deixe um comentário (opcional)..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="w-full p-4 bg-gray-50 dark:bg-zinc-800 dark:text-white rounded-2xl text-xs outline-none border border-transparent focus:border-amber-200 transition-all resize-none h-24"
        />

        <button
          onClick={handleSubmit}
          disabled={selectedRating === 0}
          className="w-full bg-gradient-to-r from-[#D99489] to-[#8B5E3C] text-white py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-lg disabled:opacity-30 transition-all active:scale-95"
        >
          Enviar Avaliação
        </button>
      </div>
    </div>
  );
};

export default RatingPopup;
