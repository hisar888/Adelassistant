import { create } from 'zustand';
import { fetchAIResponse } from '../services/ai';

export const useChatStore = create((set, get) => ({
  messages: [
    { id: '1', role: 'assistant', content: 'Привет! Я твой наставник в мире Искусственного Интеллекта. Какой у тебя вопрос на сегодня?', timestamp: new Date() }
  ],
  isTyping: false,
  
  sendMessage: async (text) => {
    // Add user message
    const userMsg = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    set((state) => ({ messages: [...state.messages, userMsg], isTyping: true }));
    
    // Fetch AI
    try {
      const response = await fetchAIResponse(text);
      const aiMsg = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: response.response, 
        buttons: response.buttons,
        timestamp: new Date() 
      };
      set((state) => ({ messages: [...state.messages, aiMsg], isTyping: false }));
    } catch (e) {
      set({ isTyping: false });
    }
  },
  
  clearChat: () => set({ messages: [] })
}));
