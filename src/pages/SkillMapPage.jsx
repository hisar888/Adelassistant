import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Lock, Star, Check, Play, BookOpen, ChevronRight, X } from 'lucide-react';
import { useProgressStore } from '../store/useProgressStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function SkillMapPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { nodes: SKILL_NODES } = useProgressStore();
  const [selectedNode, setSelectedNode] = useState(null);

  const getStatusVisuals = (status, color) => {
    switch(status) {
      case 'LOCKED': return { border: 'border-gray-200', bg: 'bg-gray-50', icon: <Lock size={18} className="text-gray-400" /> };
      case 'AVAILABLE': return { border: `border-[${color}]`, bg: 'bg-white', glow: true, badge: 'NEW' };
      case 'IN_PROGRESS': return { border: `border-[${color}]`, bg: 'bg-white', ring: true };
      case 'COMPLETED': return { border: `border-[var(--success)]`, bg: 'bg-white', icon: <Check size={18} className="text-[var(--success)]" /> };
      case 'MASTERED': return { border: 'border-yellow-400', bg: 'bg-yellow-50', icon: <Star size={18} className="text-yellow-500 fill-current" /> };
      default: return { border: 'border-gray-200', bg: 'bg-white' };
    }
  };

  return (
    <div className="relative h-full flex flex-col pt-4 pb-[100px] overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="px-6 mb-8"
      >
        <h1 className="text-3xl font-black tracking-tight mb-2">{t('nav.map')}</h1>
        <p className="text-[var(--text-secondary)] font-medium">Открой все секреты ИИ!</p>
      </motion.div>

      {/* Map visualization */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 relative flex flex-col items-center no-scrollbar">
        {/* Draw lines behind nodes */}
        <div className="absolute top-0 bottom-0 w-1.5 bg-gray-100 left-1/2 -translate-x-1/2 z-0 rounded-full"></div>

        {SKILL_NODES.map((node, i) => {
          const vs = getStatusVisuals(node.status, node.color);
          const isLeft = i % 2 === 0;

          return (
            <motion.div 
              key={node.id} 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative w-full flex mb-16 z-10"
            >
               {/* Connecting horizontal line */}
               <div className={`absolute top-1/2 ${isLeft ? 'right-1/2' : 'left-1/2'} w-[35%] h-1 bg-gray-100 -z-10 rounded-full`}></div>

               <div className={`w-full flex ${isLeft ? 'justify-start pl-[5%]' : 'justify-end pr-[5%]'}`}>
                  <motion.button 
                    whileHover={node.status !== 'LOCKED' ? { scale: 1.08 } : {}}
                    whileTap={node.status !== 'LOCKED' ? { scale: 0.95 } : {}}
                    animate={node.status === 'AVAILABLE' ? {
                      y: [0, -8, 0],
                      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    } : {}}
                    onClick={() => node.status !== 'LOCKED' && setSelectedNode(node)}
                    className={`relative flex flex-col items-center cursor-pointer transition-opacity ${node.status === 'LOCKED' ? 'opacity-80' : 'opacity-100'}`}
                  >
                    {/* Pulsing glow if available */}
                    {vs.glow && (
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-[var(--accent-primary)] -z-10 blur-xl"
                      />
                    )}
                    
                    {/* Node circle */}
                    <div 
                      className={`w-24 h-24 rounded-full flex items-center justify-center border-[6px] relative shadow-xl glass-card transition-colors duration-500`}
                      style={{ borderColor: node.status !== 'LOCKED' ? node.color : 'rgba(0,0,0,0.1)' }}
                    >
                       <div className={`w-full h-full rounded-full flex mx-auto items-center justify-center text-4xl ${node.status === 'LOCKED' ? 'grayscale opacity-30' : ''}`}>
                         {node.icon}
                       </div>

                       {/* Status Badge */}
                       {vs.icon && (
                         <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -bottom-1 -right-1 w-9 h-9 bg-white rounded-full flex items-center justify-center border-2 border-gray-100 shadow-lg text-emerald-500"
                         >
                           {vs.icon}
                         </motion.div>
                       )}
                       {vs.badge && (
                         <motion.div 
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--accent-primary)] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg z-20"
                         >
                           {vs.badge}
                         </motion.div>
                       )}

                       {/* Progress ring svg overlay */}
                       {vs.ring && (
                         <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-[2px]">
                           <circle className="stroke-gray-100" strokeWidth="6" stroke="currentColor" fill="transparent" r="41" cx="44" cy="44" />
                           <motion.circle 
                              stroke={node.color} 
                              strokeWidth="6" 
                              strokeDasharray="257" 
                              initial={{ strokeDashoffset: 257 }}
                              animate={{ strokeDashoffset: 257 - (257 * node.progress) / 100 }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              strokeLinecap="round" 
                              fill="transparent" 
                              r="41" cx="44" cy="44" 
                            />
                         </svg>
                       )}
                    </div>
                    
                    {/* Node title */}
                    <div className="mt-4 font-black text-center bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg text-xs border border-white/50 whitespace-nowrap uppercase tracking-wider">
                      {node.title}
                    </div>
                  </motion.button>
               </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Sheet for selected node */}
      <AnimatePresence>
        {selectedNode && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-40 backdrop-blur-sm" 
              onClick={() => setSelectedNode(null)}
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 w-full bg-white rounded-t-[40px] z-50 p-8 shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar"
            >
              <div className="w-16 h-2 bg-gray-200 rounded-full mx-auto mb-8 opacity-50"></div>
              
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-6">
                   <motion.div 
                    initial={{ scale: 0.5, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className={`w-20 h-20 rounded-[28px] flex items-center justify-center text-4xl shadow-2xl bg-gradient-to-br from-white to-gray-50 border border-white/80`}
                   >
                     {selectedNode.icon}
                   </motion.div>
                   <div>
                     <h2 className="text-3xl font-black leading-none mb-2" style={{ color: selectedNode.color }}>{selectedNode.title}</h2>
                     <div className="flex items-center gap-2">
                       <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
                         <div className="h-full rounded-full" style={{ width: `${selectedNode.progress}%`, backgroundColor: selectedNode.color }}></div>
                       </div>
                       <span className="text-xs font-black text-gray-400 uppercase">{selectedNode.progress}%</span>
                     </div>
                   </div>
                </div>
                <button onClick={() => setSelectedNode(null)} className="p-3 bg-gray-100 rounded-2xl text-gray-400 hover:text-gray-600 transition-colors">
                   <X size={24} />
                </button>
              </div>

              <div className="space-y-6 mb-10">
                <p className="text-gray-600 leading-relaxed font-medium">
                  {selectedNode.id === 'basics' ? 'Изучите основные концепции искусственного интеллекта и поймите, как он учится.' : 'Эта ветвь откроет новые навыки и возможности ИИ.'}
                </p>

                <div className="space-y-4">
                   <div className="flex items-center justify-between p-5 border border-gray-100 rounded-3xl bg-emerald-50/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200"><Check size={20} /></div>
                        <span className="font-bold text-gray-800">Что такое ИИ?</span>
                      </div>
                      <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full uppercase">Завершено</span>
                   </div>
                   <div className="flex items-center justify-between p-5 border-2 rounded-3xl shadow-xl shadow-blue-100/50" style={{ borderColor: selectedNode.color, backgroundColor: `${selectedNode.color}08` }}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl text-white flex items-center justify-center shadow-lg" style={{ backgroundColor: selectedNode.color, boxShadow: `0 8px 16px ${selectedNode.color}33` }}><Play size={20} className="ml-1" /></div>
                        <span className="font-black text-gray-900 text-lg">Как учится ИИ?</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Награда</span>
                        <span className="text-sm font-black text-blue-600 flex items-center gap-1"><Star size={14} fill="currentColor"/> 100 XP</span>
                      </div>
                   </div>
                   <div className="flex items-center justify-between p-5 border border-gray-100 rounded-3xl opacity-40 bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-gray-200 text-gray-400 flex items-center justify-center"><Lock size={20} /></div>
                        <span className="font-bold text-gray-500">ИИ вокруг нас</span>
                      </div>
                      <Lock size={16} className="text-gray-300" />
                   </div>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedNode(null);
                  navigate(`/quest/${selectedNode.id}`);
                }}
                className="w-full py-5 text-white rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl transition-all"
                style={{ 
                  backgroundColor: selectedNode.color,
                  boxShadow: `0 12px 24px ${selectedNode.color}44`
                }}
              >
                <BookOpen size={24} /> Начать урок
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
