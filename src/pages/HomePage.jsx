import React from 'react';
import { useUserStore } from '../store/useUserStore';
import { useTranslation } from 'react-i18next';
import { Flame, Zap, Star, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/useProgressStore';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useUserStore(state => state.user);
  const nodes = useProgressStore(state => state.nodes);

  if (!user) return null;

  // Find the node to display: current IN_PROGRESS or first AVAILABLE
  const currentNode = nodes.find(n => n.status === 'IN_PROGRESS') || nodes.find(n => n.status === 'AVAILABLE') || nodes[0];

  const hour = new Date().getHours();
  let greetingKey = 'greeting_evening';
  if (hour >= 5 && hour < 12) greetingKey = 'greeting_morning';
  else if (hour >= 12 && hour < 18) greetingKey = 'greeting_afternoon';

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* Header Profile Summary */}
      <motion.div variants={item} className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight">{t(`home.${greetingKey}`, { name: user.name })}</h1>
          <p className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest">{t(`levels.adult_${user.level}`)}</p>
        </div>
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="text-5xl bg-white rounded-[24px] p-2 border-4 border-[var(--accent-primary)]/10 shadow-2xl flex items-center justify-center w-20 h-20"
        >
          {user.avatar || '🤖'}
        </motion.div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div variants={item} className="grid grid-cols-3 gap-4 px-1">
        {[
          { icon: Flame, color: 'text-orange-500', value: user.streak, label: t('gamification.streak'), bg: 'bg-orange-50' },
          { icon: Zap, color: 'text-emerald-500', value: `${user.energy}/5`, label: t('gamification.energy'), bg: 'bg-emerald-50' },
          { icon: Star, color: 'text-yellow-500', value: user.level, label: t('gamification.level'), bg: 'bg-yellow-50' }
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -5 }}
            className={`rounded-3xl p-4 flex flex-col items-center justify-center shadow-sm border border-black/5 relative overflow-hidden glass-card`}
          >
            <stat.icon className={`${stat.color} mb-2`} size={24} />
            <span className="font-black text-2xl tracking-tighter leading-none mb-1">{stat.value}</span>
            <span className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-[0.1em]">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Continue Learning Card */}
      <motion.div variants={item}>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-[32px] p-6 shadow-2xl shadow-blue-100/50 border border-gray-100 relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-3 h-full group-hover:w-4 transition-all" style={{ backgroundColor: currentNode.color }}></div>
          <div className="pl-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white" style={{ backgroundColor: currentNode.color }}>{currentNode.title}</span>
              <div className="flex-1 h-[1px] bg-gray-100"></div>
            </div>
            
            <h2 className="text-2xl font-black mb-1 text-gray-900 tracking-tight">Продолжить путь</h2>
            <p className="text-sm font-medium text-[var(--text-secondary)] mb-6">Следующий шаг к мастерству ИИ уже ждет тебя!</p>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 bg-gray-100 h-3 rounded-full overflow-hidden p-[2px]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${currentNode.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]" 
                  style={{ backgroundColor: currentNode.color }}
                />
              </div>
              <span className="text-sm font-black text-gray-400">{currentNode.progress}%</span>
            </div>

            <button 
              onClick={() => navigate(`/quest/${currentNode.id}`)}
              className="w-full py-4 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
              style={{ backgroundColor: currentNode.color }}
            >
              🚀 {t('home.continue_learning')} <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Daily Quest */}
      <motion.div variants={item}>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[32px] p-1 shadow-2xl relative"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-[31px] p-6 text-white h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-xl flex items-center gap-3"><Sparkles className="text-yellow-300 fill-yellow-300" size={24} /> {t('home.daily_quest')}</h3>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black tracking-widest">+50 XP</div>
            </div>
            <p className="text-indigo-100 font-medium text-lg leading-snug mb-6">Задай один любой вопрос наставнику о будущем технологий</p>
            <button 
              onClick={() => navigate('/chat')} 
              className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-black text-lg shadow-xl hover:shadow-[0_0_24px_rgba(255,255,255,0.4)] transition-all"
            >
              Начать квест ⚡
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Family Ranking Snippet */}
      <motion.div variants={item} className="px-2">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-xl font-black tracking-tight">{t('home.family_ranking')}</h3>
          <button onClick={() => navigate('/family')} className="text-xs font-black text-[var(--accent-primary)] uppercase tracking-widest flex items-center gap-1">Все <TrendingUp size={12}/></button>
        </div>
        <div className="bg-white p-4 rounded-[32px] shadow-xl border border-gray-100 space-y-3">
          {[
            { name: 'Папа', level: 3, xp: 800, isMe: user.role === 'papa', avatar: '😎' },
            { name: 'Мама', level: 2, xp: 450, isMe: user.role === 'mama', avatar: '👩' },
            { name: user.name, level: user.level, xp: user.xp, isMe: true, avatar: user.avatar }
          ].sort((a,b) => b.xp - a.xp).map((member, i) => (
             <motion.div 
                key={`${member.name}-${i}`} 
                whileHover={{ scale: 1.02 }}
                className={`flex items-center p-3 rounded-2xl transition-colors ${member.isMe ? 'bg-orange-50/50 border border-orange-100 shadow-sm' : 'hover:bg-gray-50'}`}
             >
               <div className={`w-8 text-center font-black text-sm mr-2 ${i === 0 ? 'text-yellow-500' : 'text-gray-300'}`}>{i+1}</div>
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mr-4 text-2xl shadow-sm border border-gray-100">{member.avatar}</div>
               <div className="flex-1">
                 <div className="font-black text-gray-900 leading-none mb-1">{member.name} {member.isMe && <span className="text-[10px] text-orange-500 uppercase ml-2 px-2 py-0.5 bg-white rounded-full border border-orange-100 shadow-sm">Это ты</span>}</div>
                 <div className="text-xs font-bold text-gray-400 capitalize whitespace-nowrap overflow-hidden text-ellipsis">{t(`levels.adult_${member.level}`)}</div>
               </div>
               <div className="text-right">
                 <div className="text-sm font-black text-indigo-600">{member.xp} XP</div>
                 <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Уровень {member.level}</div>
               </div>
             </motion.div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}
