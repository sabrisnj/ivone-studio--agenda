
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store';
import { Send, MessageCircle, User, Mic, MicOff, Waves } from 'lucide-react';

const ChatView: React.FC = () => {
  const { user, chatMessages, sendChatMessage, markChatAsRead, isTyping, isAdmin, accessibility, speak } = useApp();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = chatMessages.filter(m => isAdmin || m.userId === user?.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (user) markChatAsRead(user.id, isAdmin ? 'admin' : 'client');
  }, [messages.length, isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    const textToSend = (inputText + ' ' + interimText).trim();
    if (textToSend && !isTyping) {
      sendChatMessage(textToSend, isAdmin ? 'admin' : 'client');
      setInputText('');
      setInterimText('');
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      if (accessibility.readAloud) speak("Estou ouvindo. Pode falar.");
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        setInputText(prev => prev + ' ' + finalTranscript);
      }
      setInterimText(interimTranscript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => {
      setIsListening(false);
      setInterimText('');
    };

    if (isListening) recognition.stop();
    else recognition.start();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-studio-fade" role="region" aria-label="Chat Ivone Studio">
      <header className="p-6 border-b border-studio-accent/10 dark:border-stone-800 flex items-center gap-5 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="w-14 h-14 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center text-studio-accent border border-stone-100 dark:border-stone-700 shadow-inner">
          <MessageCircle size={28} strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-xl font-serif font-medium text-studio-ink dark:text-white tracking-tight">Central Ivone</h3>
          <p className="text-[10px] text-studio-sage font-bold uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-studio-sage rounded-full animate-pulse" /> Canal Online
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-6">
             <MessageCircle size={64} strokeWidth={1} />
             <p className="text-[11px] font-bold uppercase tracking-[0.3em] font-serif">Inicie sua conversa</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.sender === (isAdmin ? 'admin' : 'client') ? 'items-end' : 'items-start'} animate-studio-fade`}>
              <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm leading-relaxed shadow-sm ${
                m.sender === (isAdmin ? 'admin' : 'client') 
                  ? 'bg-studio-accent text-white rounded-tr-none shadow-studio-accent/10' 
                  : 'bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 text-stone-700 dark:text-stone-200 rounded-tl-none'
              }`}>
                {m.text}
              </div>
              <span className="text-[9px] text-stone-300 font-bold uppercase mt-2 px-2 tracking-tighter">
                {new Date(m.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 transition-colors">
        <form onSubmit={handleSend} className="space-y-4">
          {interimText && (
            <div className="px-5 py-3 bg-rose-50 dark:bg-rose-900/20 rounded-2xl animate-pulse border border-rose-100 dark:border-rose-900/30">
               <p className="text-[10px] text-rose-400 italic font-serif">Ouvindo: {interimText}...</p>
            </div>
          )}
          <div className="flex gap-3">
            {accessibility.voiceControl && (
              <button 
                type="button" 
                onClick={startListening}
                aria-label={isListening ? "Parar de ouvir" : "Ditar mensagem"}
                className={`p-5 rounded-[1.8rem] transition-all flex items-center justify-center min-w-[64px] shadow-sm ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-stone-50 text-stone-400 dark:bg-stone-800 dark:text-stone-500'}`}
              >
                {isListening ? <Waves size={24} className="animate-spin-slow" /> : <Mic size={24} />}
              </button>
            )}
            <input 
              type="text" 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? "Pode falar..." : "Digite sua mensagem..."}
              className="flex-1 bg-stone-50 dark:bg-stone-800 border border-transparent focus:border-studio-accent rounded-[1.8rem] px-6 py-5 text-sm outline-none dark:text-white transition-all shadow-inner"
            />
            <button 
              type="submit" 
              disabled={!inputText.trim() && !interimText.trim()} 
              className="bg-studio-accent text-white p-5 rounded-[1.8rem] shadow-xl shadow-studio-accent/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <Send size={24} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
