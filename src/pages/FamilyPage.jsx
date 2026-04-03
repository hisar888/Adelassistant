import React from 'react';
import { Users, Target, Flame, Star } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';

const FAMILY_MEMBERS = [
  { id: '1', name: 'Папа', role: 'Админ', level: 3, xp: 800, streak: 5, avatar: '😎' },
  { id: '2', name: 'Мама', role: 'Участник', level: 2, xp: 450, streak: 3, avatar: '👩' },
  { id: '3', name: 'Дочка (15)', role: 'Участник', level: 1, xp: 120, streak: 1, avatar: '👧' },
  { id: '4', name: 'Дочка (9)', role: 'Участник', level: 1, xp: 50, streak: 0, avatar: '👱‍♀️' },
  { id: '5', name: 'Сын (6)', role: 'Участник', level: 1, xp: 200, streak: 2, avatar: '👦' },
];

export default function FamilyPage() {
  const user = useUserStore(state => state.user);
  const sortedMembers = [...FAMILY_MEMBERS].sort((a, b) => b.xp - a.xp);

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)]">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="font-bold text-2xl flex items-center gap-2">
          <Users className="text-[var(--accent-primary)]" /> Моя Семья
        </h1>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Target size={64} />
        </div>
        <h3 className="font-bold text-orange-800 flex items-center gap-2 mb-1">
          <Target size={18} /> Семейный Вызов
        </h3>
        <p className="text-sm border-b border-orange-200 pb-3 mb-3 text-orange-700">Соберите 2000 XP вместе на этой неделе!</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-orange-200 h-3 rounded-full overflow-hidden">
             <div className="bg-orange-500 h-full" style={{ width: '80%' }}></div>
          </div>
          <span className="font-bold text-orange-800 text-sm">1620 / 2000</span>
        </div>
      </div>

      <h2 className="font-bold mb-3 text-lg">Таблица лидеров</h2>
      <div className="space-y-3 pb-8">
        {sortedMembers.map((member, i) => (
          <div key={member.id} className={`flex p-4 bg-white border ${member.name === user.name ? 'border-[var(--accent-primary)] shadow-md relative' : 'border-gray-200'} rounded-xl items-center`}>
            {member.name === user.name && <div className="absolute top-0 right-0 bg-[var(--accent-primary)] text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-xl">ВЫ</div>}
            
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${i === 0 ? 'bg-yellow-100 text-yellow-600' : i === 1 ? 'bg-gray-200 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-600' : 'text-gray-400'}`}>
              {i + 1}
            </div>
            
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-2xl border border-gray-100 mr-4">
              {member.avatar}
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold">{member.name}</h3>
              <p className="text-xs text-gray-500">Уровень {member.level}</p>
            </div>
            
            <div className="text-right">
              <div className="font-bold text-[var(--accent-primary)]">{member.xp} XP</div>
              <div className="text-xs text-gray-500 flex items-center justify-end gap-1"><Flame size={12} className="text-orange-500"/> {member.streak} дн</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
