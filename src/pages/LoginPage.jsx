import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { useTranslation } from 'react-i18next';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const { t } = useTranslation();
  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      if (user.onboardingCompleted) {
        navigate('/home');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      setError("Ошибка входа: неверный email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-primary)]">
      <div className="w-full max-w-sm bg-[var(--bg-card)] p-8 rounded-[var(--radius-lg)] shadow-lg border border-[var(--border)]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--accent-primary)] text-white rounded-[var(--radius-full)] flex items-center justify-center mx-auto mb-4 animate-[pulseGlow_2s_infinite]">
            <LogIn size={32} />
          </div>
          <h1 className="text-[var(--text-3xl)] font-bold text-[var(--accent-primary)] mb-2">Adel Assistant</h1>
          <p className="text-[var(--text-secondary)]">Твоя семья. Твой ИИ. Твоё будущее.</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[var(--text-sm)] font-medium text-[var(--text-primary)] mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-3 border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--accent-primary)] text-[var(--text-primary)] bg-transparent"
              placeholder="papa@adel.local"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[var(--text-sm)] font-medium text-[var(--text-primary)] mb-1">Пароль</label>
            <input 
              type="password" 
              className="w-full p-3 border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--accent-primary)] text-[var(--text-primary)] bg-transparent"
              placeholder="Любой пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-[var(--accent-primary)] text-white rounded-[var(--radius-md)] font-semibold hover:opacity-90 transition-opacity flex justify-center items-center cursor-pointer"
          >
            {loading ? t('common.loading') : "Войти"}
          </button>
        </form>

        <div className="mt-6 text-xs text-center text-[var(--text-secondary)]">
          Доступно только для членов семьи. Регистрация закрыта. (попробуйте: papa@adel.local, mama@adel.local, daughter15@adel.local, daughter9@adel.local, son6@adel.local)
        </div>
      </div>
    </div>
  );
}
