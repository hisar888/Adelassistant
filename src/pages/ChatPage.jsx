import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useUserStore } from '../store/useUserStore';
import { useTranslation } from 'react-i18next';
import { Send, Image as ImageIcon, Mic, MoreVertical, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPage() {
  const { t } = useTranslation();
  const { messages, isTyping, sendMessage } = useChatStore();
  const user = useUserStore(state => state.user);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleQuickReply = (text) => {
    sendMessage(text);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] rounded-[40px] border border-white/50 shadow-2xl glass-card overflow-hidden">
      {/* Chat header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-md border-b border-gray-100 p-5 flex items-center justify-between shadow-sm z-10"
      >
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-orange-100"
          >
            {user?.mentorCharacter === 'nova' ? '🤖' : '🎧'} 
          </motion.div>
          <div>
            <h2 className="font-black text-gray-900 tracking-tight leading-none mb-1">Наставник</h2>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isTyping ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`}></span>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{isTyping ? t('mentor.thinking') : 'В сети'}</p>
            </div>
          </div>
        </div>
        <button className="p-3 text-gray-300 hover:text-gray-500 transition-colors">
          <MoreVertical size={20} />
        </button>
      </motion.div>

      {/* Chat body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div 
              key={msg.id || idx} 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.05 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-5 rounded-[32px] shadow-sm relative overflow-hidden group/msg ${msg.role === 'user' 
                ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-tr-sm shadow-xl shadow-indigo-100/50' 
                : 'bg-white border border-gray-100 rounded-tl-sm shadow-xl shadow-gray-100/50'}`}
              >
                {msg.role === 'assistant' && (
                  <Sparkles size={14} className="absolute top-2 right-2 text-indigo-100 opacity-20 group-hover/msg:opacity-40 transition-opacity" />
                )}
                <p className={`text-[15px] font-medium leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'text-indigo-50' : 'text-gray-700'}`}>
                   {msg.content}
                </p>
                
                {msg.buttons && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-2 mt-4"
                  >
                    {msg.buttons.map(btn => (
                      <motion.button 
                        key={btn} 
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuickReply(btn)}
                        className="bg-indigo-50 text-indigo-600 text-xs font-black shadow-sm uppercase tracking-widest px-4 py-2 rounded-full border border-indigo-100 hover:bg-white transition-all"
                      >
                        {btn}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
               <div className="bg-white border border-gray-100 p-5 rounded-[32px] rounded-tl-sm shadow-xl shadow-gray-100/50 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* User input */}
      <div className="bg-white/80 backdrop-blur-md p-5 border-t border-gray-100 m-4 rounded-[32px] shadow-[0_-8px_32px_rgba(0,0,0,0.03)] z-10 border border-white">
        <form onSubmit={handleSend} className="flex items-center gap-4">
          <motion.button 
            type="button" 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 transition-colors rounded-2xl"
          >
            <Mic size={24} />
          </motion.button>
          
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 bg-gray-50 border-2 border-transparent rounded-[24px] px-6 py-3.5 text-sm font-bold focus:outline-none focus:bg-white focus:border-indigo-100/50 focus:ring-0 transition-all text-gray-800 placeholder-gray-300"
            placeholder="Спроси меня о чём угодно..."
          />
          
          <motion.button 
            type="button" 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 transition-colors rounded-2xl"
          >
            <ImageIcon size={24} />
          </motion.button>
          
          <motion.button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.9, x: -2 }}
            className="p-4 bg-orange-500 text-white rounded-[20px] disabled:opacity-30 disabled:grayscale transition-all shadow-xl shadow-orange-100 active:shadow-none"
          >
            <Send size={20} className="fill-current" />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
