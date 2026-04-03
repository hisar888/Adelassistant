import { create } from 'zustand';

// Инициализируем демо-состояние прогресса
const INITIAL_NODES = [
  { id: 'basics', title: 'Основы ИИ', color: 'var(--branch-basics)', status: 'IN_PROGRESS', progress: 30, icon: '🧠', bg: 'bg-blue-100' },
  { id: 'prompts', title: 'Промпты', color: 'var(--branch-prompts)', status: 'AVAILABLE', progress: 0, icon: '✍️', bg: 'bg-orange-100' },
  { id: 'content', title: 'Контент', color: 'var(--branch-content)', status: 'LOCKED', progress: 0, icon: '🎨', bg: 'bg-purple-100' },
  { id: 'study', title: 'Учеба', color: 'var(--branch-study)', status: 'LOCKED', progress: 0, icon: '📚', bg: 'bg-green-100' },
  { id: 'automation', title: 'Автоматизация', color: 'var(--branch-automation)', status: 'LOCKED', progress: 0, icon: '⚡', bg: 'bg-teal-100' },
  { id: 'data', title: 'Данные', color: 'var(--branch-data)', status: 'LOCKED', progress: 0, icon: '📊', bg: 'bg-indigo-100' },
];

const INITIAL_ACHIEVEMENTS = [
  { id: 1, name: 'Первичное знакомство', desc: 'Написал первый запрос', icon: '🎯', unlocked: true, date: 'Сегодня' },
  { id: 2, name: 'Исследователь', desc: 'Задал 10 бесплатных вопросов', icon: '🔍', unlocked: true, date: 'Вчера' },
  { id: 3, name: 'Огонек', desc: '3 дня подряд', icon: '🔥', unlocked: false, progress: '2/3' },
  { id: 4, name: 'Полиглот', desc: 'Использовал ИИ для перевода', icon: '🌍', unlocked: false },
  { id: 5, name: 'Выпускник', desc: 'Завершил первую ветку', icon: '🎓', unlocked: false },
];

export const useProgressStore = create((set, get) => ({
  nodes: INITIAL_NODES,
  achievements: INITIAL_ACHIEVEMENTS,
  
  completeQuest: (nodeId) => {
    set((state) => {
      const newNodes = [...state.nodes];
      
      const nodeIndex = newNodes.findIndex(n => n.id === nodeId);
      if (nodeIndex === -1) return state;
      
      // Отмечаем текущий узел как полностью пройденный
      newNodes[nodeIndex] = { ...newNodes[nodeIndex], status: 'COMPLETED', progress: 100 };
      
      // Разблокируем следующий узел, если он существует и был заблокирован
      if (nodeIndex + 1 < newNodes.length && newNodes[nodeIndex + 1].status === 'LOCKED') {
        newNodes[nodeIndex + 1] = { ...newNodes[nodeIndex + 1], status: 'IN_PROGRESS', progress: 0 };
      }
      
      // Выдаем достижение "Выпускник" при прохождении первой ветки
      let newAchievements = [...state.achievements];
      if (nodeIndex === 0) {
        newAchievements = newAchievements.map(a => 
          a.id === 5 ? { ...a, unlocked: true, date: 'Только что' } : a
        );
      }

      return { nodes: newNodes, achievements: newAchievements };
    });
  }
}));
