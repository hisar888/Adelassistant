import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { useTranslation } from 'react-i18next';
import { Check, ChevronRight, User, Globe, Sparkles, MessageCircle } from 'lucide-react';

const AVATARS = ['🤖', '🦊', '🐶', '🐱', '🦄', '🐧', '🦖', '🐼', '🐯', '🐰', '🐸', '🐙'];

const MENTORS = [
  { id: 'nova', name: 'Нова', icon: '🤖', desc: 'Добрая и поддерживающая', color: 'bg-pink-100' },
  { id: 'bit', name: 'Бит', icon: '⚡', desc: 'Веселый игровой дроид', color: 'bg-green-100' },
  { id: 'alex', name: 'Алекс', icon: '🎧', desc: 'Стильный и современный', color: 'bg-blue-100' },
  { id: 'prof_q', name: 'Проф Кью', icon: '🧐', desc: 'Мудрый ученый', color: 'bg-orange-100' },
  { id: 'mira', name: 'Мира', icon: '🌟', desc: 'Вдохновляющий коуч', color: 'bg-yellow-100' },
  { id: 'hacker', name: 'Хакер', icon: '💻', desc: 'Крутой технарь', color: 'bg-gray-200' },
];

export default function OnboardingPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, completeOnboarding } = useUserStore();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    avatar: '🤖',
    language: 'ru',
    mentorCharacter: 'nova',
    mentorTone: 'friendly',
    studyPurpose: '',
  });

  const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };

  const handleFinish = () => {
    completeOnboarding(formData);
    navigate('/home');
  };

  const handleSelectPurpose = (purpose) => {
    updateForm('studyPurpose', purpose);
    setTimeout(() => {
      setStep(6);
    }, 400); // Small delay for visual feedback
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2"><User /> Выберите аватар</h2>
            <div className="grid grid-cols-4 gap-4">
              {AVATARS.map(a => (
                <button
                  key={a}
                  onClick={() => updateForm('avatar', a)}
                  className={`text-4xl p-2 rounded-xl border-2 transition-all ${formData.avatar === a ? 'border-[var(--accent-primary)] bg-orange-50' : 'border-transparent bg-[var(--bg-secondary)] hover:bg-orange-50/50'}`}
                >
                  {a}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Как вас называть?</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => updateForm('name', e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Globe /> Выберите язык</h2>
            <div className="space-y-3">
              {[
                {id: 'ru', label: '🇷🇺 Русский'},
                {id: 'tt', label: '🏳️ Татарча'},
                {id: 'en', label: '🇬🇧 English'}
              ].map(lang => (
                <button
                  key={lang.id}
                  onClick={() => {
                    updateForm('language', lang.id);
                    i18n.changeLanguage(lang.id);
                  }}
                  className={`w-full p-4 text-left rounded-xl border-2 font-medium flex items-center justify-between ${formData.language === lang.id ? 'border-[var(--accent-primary)] bg-orange-50 text-[var(--accent-primary)]' : 'border-[var(--border)] text-[var(--text-secondary)]'}`}
                >
                  {lang.label}
                  {formData.language === lang.id && <Check size={20} />}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Sparkles /> Выберите наставника</h2>
            <div className="grid grid-cols-2 gap-4">
              {MENTORS.map(m => (
                <button
                  key={m.id}
                  onClick={() => updateForm('mentorCharacter', m.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${formData.mentorCharacter === m.id ? 'border-[var(--accent-primary)] bg-white shadow-md' : 'border-transparent bg-[var(--bg-secondary)] opacity-70'} ${m.color}`}
                >
                  <div className="text-4xl mb-2">{m.icon}</div>
                  <div className="font-bold text-gray-800">{m.name}</div>
                  <div className="text-xs text-gray-600">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2"><MessageCircle /> Тон общения</h2>
            <div className="space-y-3">
              {[
                {id: 'friendly', label: 'Дружелюбный 😊'},
                {id: 'coach', label: 'Мотивирующий 🚀'},
                {id: 'strict', label: 'Строгий 📚'},
                {id: 'funny', label: 'Смешной 🤡'}
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => updateForm('mentorTone', t.id)}
                  className={`w-full p-4 text-left rounded-xl border-2 font-medium flex items-center justify-between ${formData.mentorTone === t.id ? 'border-[var(--accent-primary)] bg-orange-50 text-[var(--accent-primary)]' : 'border-[var(--border)] text-[var(--text-secondary)]'}`}
                >
                  {t.label}
                  {formData.mentorTone === t.id && <Check size={20} />}
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Давай познакомимся поближе!</h2>
            <div className="bg-[var(--bg-secondary)] p-4 rounded-xl space-y-4">
               <div className="flex gap-3">
                 <div className="text-2xl">{MENTORS.find(m => m.id === formData.mentorCharacter)?.icon}</div>
                 <div className="bg-white p-3 border rounded-lg text-sm rounded-tl-none">
                   Привет, {formData.name}! Я твой наставник. Для чего ты хочешь изучать ИИ?
                 </div>
               </div>
               {/* Interactive purpose buttons */}
               <div className="flex flex-col gap-2 pl-10 pt-4">
                 {[
                   { id: 'study', label: 'Для учебы / школы' },
                   { id: 'work', label: 'Для работы / проектов' },
                   { id: 'curiosity', label: 'Просто интересно' }
                 ].map(entry => (
                   <button 
                     key={entry.id}
                     onClick={() => handleSelectPurpose(entry.id)}
                     className={`p-3 rounded-xl text-sm text-left transition-all border-2 flex items-center justify-between ${formData.studyPurpose === entry.id ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]' : 'bg-white text-[var(--text-primary)] border-transparent hover:border-[var(--accent-primary)]'}`}
                   >
                     {entry.label}
                     {formData.studyPurpose === entry.id && <Check size={16} />}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6 text-center py-8">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-2xl font-bold text-[var(--accent-primary)]">Твоё путешествие начинается!</h2>
            <p className="text-[var(--text-secondary)]">Я подготовил для тебя первую ветвь навыков: "Основы ИИ". Готов начать выполнение первого квеста?</p>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-4 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-[var(--bg-secondary)] h-2 rounded-full mb-8 mt-4 overflow-hidden">
        <div 
          className="bg-[var(--accent-primary)] h-full transition-all duration-300 ease-in-out" 
          style={{ width: `${(step / 6) * 100}%` }}
        ></div>
      </div>

      <div className="flex-1">
        {renderStep()}
      </div>

      <div className="pt-8 pb-4 border-t border-[var(--border)] mt-auto flex justify-between">
        {step > 1 ? (
          <button 
            onClick={() => setStep(step - 1)}
            className="px-6 py-3 text-[var(--text-secondary)] font-medium"
          >
            Назад
          </button>
        ) : <div></div>}
        
        {step < 6 ? (
          <button 
            onClick={handleNext}
            disabled={step === 1 && !formData.name}
            className="px-6 py-3 bg-[var(--accent-primary)] text-white rounded-xl font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
          >
            Далее <ChevronRight size={20} />
          </button>
        ) : (
          <button 
            onClick={handleFinish}
            className="px-6 py-3 bg-[var(--success)] text-white rounded-xl font-bold flex items-center gap-2 hover:opacity-90 w-full justify-center"
          >
            Начать первый квест! 🚀
          </button>
        )}
      </div>
    </div>
  );
}
