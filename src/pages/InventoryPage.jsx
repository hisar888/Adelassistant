import React, { useState } from 'react';
import { ChevronLeft, Package, FileText, Code, PenTool } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const INVENTORY = [
  { id: 1, type: 'cheatsheet', name: 'Основы ИИ', desc: 'Памятка по базовым терминам', icon: <FileText size={20} className="text-blue-500" /> },
  { id: 2, type: 'template', name: 'Генерация картинки', desc: 'Шаблон промпта для Midjourney', icon: <PenTool size={20} className="text-purple-500" /> },
  { id: 3, type: 'tool', name: 'Отладчик 3000', desc: 'Команда для поиска ошибок в коде', icon: <Code size={20} className="text-orange-500" /> },
];

export default function InventoryPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)]">
      <div className="flex items-center gap-3 mb-6 sticky top-0 bg-[var(--bg-primary)] py-2 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-[var(--bg-secondary)] rounded-full text-gray-700">
           <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold text-xl flex items-center gap-2">
          <Package className="text-[var(--branch-content)]" /> Инвентарь
        </h1>
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-6 overflow-x-auto no-scrollbar">
        {['all', 'cheatsheet', 'template', 'tool'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-white shadow text-black' : 'text-gray-500'}`}
          >
            {f === 'all' ? 'Все' : f === 'cheatsheet' ? 'Шпаргалки' : f === 'template' ? 'Шаблоны' : 'Инструменты'}
          </button>
        ))}
      </div>

      <div className="space-y-3 pb-8">
        {INVENTORY.filter(i => filter === 'all' || i.type === filter).map(item => (
          <div key={item.id} className="flex p-4 bg-white border border-gray-200 rounded-xl shadow-sm gap-4 items-center cursor-pointer hover:border-[var(--accent-primary)] active:bg-gray-50">
            <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
              {item.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm">{item.name}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
            <ChevronLeft size={16} className="rotate-180 text-gray-300" />
          </div>
        ))}
        {INVENTORY.filter(i => filter === 'all' || i.type === filter).length === 0 && (
          <div className="text-center py-10 text-gray-400">
            Здесь пока ничего нет.
          </div>
        )}
      </div>
    </div>
  );
}
