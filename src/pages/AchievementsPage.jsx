import React from 'react';
import { ChevronLeft, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/useProgressStore';

export default function AchievementsPage() {
  const navigate = useNavigate();
  const ACHIEVEMENTS = useProgressStore(state => state.achievements);

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)]">
      <div className="flex items-center gap-3 mb-6 sticky top-0 bg-[var(--bg-primary)] py-2 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-[var(--bg-secondary)] rounded-full text-gray-700">
           <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold text-xl flex items-center gap-2">
          <Trophy className="text-yellow-500" /> Достижения
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4 pb-8">
        {ACHIEVEMENTS.map((ach) => (
          <div key={ach.id} className={`p-4 rounded-xl border ${ach.unlocked ? 'bg-white border-yellow-200' : 'bg-gray-50 border-gray-200 opacity-60'} flex flex-col items-center text-center relative`}>
            <div className={`text-4xl mb-3 ${!ach.unlocked && 'grayscale'}`}>{ach.icon}</div>
            <h3 className="font-bold text-sm mb-1 leading-tight">{ach.name}</h3>
            <p className="text-[10px] text-gray-500 mb-2">{ach.desc}</p>
            {ach.unlocked ? (
              <span className="text-[10px] font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full mt-auto">Открыто</span>
            ) : (
              <span className="text-[10px] font-bold text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full mt-auto">
                {ach.progress || 'Закрыто'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
