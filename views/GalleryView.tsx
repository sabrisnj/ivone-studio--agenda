
import React, { useState } from 'react';
import { useApp } from '../store';
import { GalleryCategory } from '../types';
import { 
  Camera, 
  Sparkles, 
  ChevronRight,
  Maximize2,
  X
} from 'lucide-react';

const GalleryView: React.FC = () => {
  const { galleryItems } = useApp();
  const [activeFilter, setActiveFilter] = useState<GalleryCategory | 'Todos'>('Todos');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filters: (GalleryCategory | 'Todos')[] = ['Todos', 'Cabelo', 'Unhas', 'Cílios', 'Antes e Depois'];

  const filteredItems = activeFilter === 'Todos' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <div className="p-6 space-y-12 pb-20 animate-studio-fade">
      <header className="px-2 space-y-4">
        <div className="w-16 h-16 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center text-studio-accent shadow-inner">
          <Camera size={32} strokeWidth={1.5} />
        </div>
        <h2 className="text-4xl font-serif font-medium text-studio-ink dark:text-white tracking-tight">Studio Gallery</h2>
        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.25em]">Nossa arte em resultados reais</p>
      </header>

      {/* Filtros */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {filters.map(filter => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-7 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${
              activeFilter === filter 
                ? 'bg-studio-accent border-studio-accent text-white shadow-xl shadow-studio-accent/20 scale-105' 
                : 'bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800 text-stone-400 hover:border-studio-accent/30'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Grid de Fotos */}
      {filteredItems.length === 0 ? (
        <div className="py-24 text-center space-y-6 bg-white/50 dark:bg-stone-900 rounded-[3rem] border border-dashed border-stone-200 dark:border-stone-800">
           <Sparkles size={48} className="mx-auto text-studio-accent opacity-20" />
           <p className="text-sm text-stone-400 italic font-serif">Em breve, novos resultados aqui...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              onClick={() => setSelectedImage(item.imageUrl)}
              className="aspect-square bg-stone-100 rounded-[2.5rem] overflow-hidden relative group cursor-pointer shadow-sm border border-stone-100 dark:border-stone-800"
            >
              <img 
                src={item.imageUrl} 
                alt={item.category} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-studio-ink/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                 <span className="text-[9px] font-bold text-white uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl">
                   {item.category}
                 </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Zoom */}
      {selectedImage && (
        <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-studio-fade">
           <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-8 right-8 text-white p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
           >
             <X size={24} />
           </button>
           <img 
            src={selectedImage} 
            alt="Result" 
            className="max-w-full max-h-[80vh] rounded-[2rem] shadow-2xl" 
           />
        </div>
      )}
    </div>
  );
};

export default GalleryView;
