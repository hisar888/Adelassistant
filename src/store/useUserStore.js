import { create } from 'zustand';

// Pre-defined 5 static users as per spec
export const STATIC_USERS = [
  { id: '1', role: 'papa', email: 'papa@adel.local', name: 'Папа', level: 1, xp: 0, streak: 0, energy: 5, targetDailyQuests: 1 },
  { id: '2', role: 'mama', email: 'mama@adel.local', name: 'Мама', level: 1, xp: 0, streak: 0, energy: 5, targetDailyQuests: 1 },
  { id: '3', role: 'daughter15', email: 'daughter15@adel.local', name: 'Дочка (15)', level: 1, xp: 0, streak: 0, energy: 5, targetDailyQuests: 1 },
  { id: '4', role: 'daughter9', email: 'daughter9@adel.local', name: 'Дочка (9)', level: 1, xp: 0, streak: 0, energy: 5, targetDailyQuests: 1 },
  { id: '5', role: 'son6', email: 'son6@adel.local', name: 'Сын (6)', level: 1, xp: 0, streak: 0, energy: 5, targetDailyQuests: 1 },
];

export const useUserStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email, password) => {
    // Mock login simulating firebase auth
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = STATIC_USERS.find(u => u.email === email);
        if (foundUser) {
          set({ user: foundUser, isAuthenticated: true });
          resolve(foundUser);
        } else {
          reject(new Error("User not found"));
        }
      }, 500);
    });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
  updateProfile: (data) => set((state) => ({ user: { ...state.user, ...data } })),
  completeOnboarding: (data) => set((state) => ({ user: { ...state.user, ...data, onboardingCompleted: true } })),
  addXp: (amount) => set((state) => {
    if (!state.user) return state;
    const newXp = state.user.xp + amount;
    // Simple level up logic: every 1000 XP is a level
    const newLevel = Math.floor(newXp / 1000) + 1;
    return {
      user: {
        ...state.user,
        xp: newXp,
        level: newLevel
      }
    };
  }),
}));
