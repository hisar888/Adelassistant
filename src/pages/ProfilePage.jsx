import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { Trophy, Package, Settings, LogOut, ChevronRight, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useUserStore();
  const { theme, toggleTheme } = useTheme();

  if (!user) return null;

  return (
    <div className="flex flex-col h-full space-y-6 pt-4">
      <div className="text-center pb-6 border-b border-[var(--border)]">
        <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 border-4 border-[var(--accent-primary)] flex items-center justify-center text-5xl shadow-md">
          {user.avatar || '🤖'}
        </div>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-[var(--text-secondary)]">Уровень {user.level} • {user.xp} XP</p>
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => navigate('/profile/achievements')}
          className="w-full flex items-center justify-between p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-sm hover:bg-[var(--bg-secondary)]"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
              <Trophy size={20} />
            </div>
            <div className="text-left">
              <div className="font-bold">Достижения</div>
              <div className="text-xs text-[var(--text-secondary)]">Открыто 2 из 15</div>
            </div>
          </div>
          <ChevronRight className="text-gray-400" />
        </button>

        <button 
          onClick={() => navigate('/profile/inventory')}
          className="w-full flex items-center justify-between p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-sm hover:bg-[var(--bg-secondary)]"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-100 text-[var(--branch-content)] rounded-full flex items-center justify-center">
              <Package size={20} />
            </div>
            <div className="text-left">
              <div className="font-bold">Инвентарь</div>
              <div className="text-xs text-[var(--text-secondary)]">3 предмета</div>
            </div>
          </div>
          <ChevronRight className="text-gray-400" />
        </button>

        <button 
          onClick={toggleTheme}
          className="w-full flex items-center justify-between p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-sm hover:bg-[var(--bg-secondary)]"
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-orange-100 text-orange-500'} rounded-full flex items-center justify-center`}>
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div className="text-left">
              <div className="font-bold">Темная тема</div>
              <div className="text-xs text-[var(--text-secondary)]">
                {theme === 'dark' ? 'Выключить' : 'Включить'}
              </div>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-200'}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </button>

        <button 
          className="w-full flex items-center justify-between p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-sm hover:bg-[var(--bg-secondary)]"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center">
              <Settings size={20} />
            </div>
            <div className="text-left">
              <div className="font-bold">Настройки</div>
              <div className="text-xs text-[var(--text-secondary)]">Язык, Наставник...</div>
            </div>
          </div>
          <ChevronRight className="text-gray-400" />
        </button>
      </div>

      <div className="mt-auto pt-8">
        <button 
          onClick={logout}
          className="w-full p-4 flex items-center justify-center gap-2 text-[var(--streak-red)] font-bold bg-red-50 rounded-xl"
        >
          <LogOut size={20} /> Выйти
        </button>
      </div>
    </div>
  );
}
