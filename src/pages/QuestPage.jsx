import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Zap, Loader2, Lightbulb, CheckCircle2, Trophy, ArrowRight, Star } from 'lucide-react';
import { evaluateAnswer } from '../services/ai';
import { useProgressStore } from '../store/useProgressStore';
import { useUserStore } from '../store/useUserStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuestPage() {
  const { id } = useParams(); // target node id, e.g. "basics"
  const navigate = useNavigate();
  const completeQuestInStore = useProgressStore(state => state.completeQuest);
  const addXp = useUserStore(state => state.addXp);
  
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  
  // Practice state
  const [practiceInput, setPracticeInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Dummy quest data for MVP
  const questContent = {
    title: "Что такое ИИ?",
    id: 'mock_quest_1',
    totalSteps: 3,
    xpReward: 100,
    steps: [
      {
        type: 'dialogue',
        id: 's1',
        text: 'Искусственный интеллект (ИИ) — это способность компьютера обучаться и принимать решения, похоже на то, как это делает человек. Например, когда твой телефон узнает твоё лицо, он использует ИИ! Понятно?',
        options: ['Да, понятно!', 'Приведи ещё пример']
      },
      {
        type: 'practice',
        id: 's2',
        title: 'Твоя очередь!',
        task: 'Напиши короткий промпт, чтобы попросить ИИ нарисовать кота-астронавта.',
        hints: ['Укажи стиль (например, реалистично или мультяшно)', 'Добавь детали окружения (звезды, луна)'],
      },
      {
        type: 'quiz',
        id: 's3',
        question: 'Что из этого использует ИИ?',
        options: ['Обычный калькулятор', 'Умная колонка Алиса', 'Проводной телефон']
      }
    ]
  };

  const handleNext = () => {
    setEvaluationResult(null);
    setPracticeInput('');
    setHintsUsed(0);
    if (step < questContent.totalSteps) {
      setStep(step + 1);
    } else {
      setCompleted(true);
      if (id) {
        completeQuestInStore(id);
      } else {
        completeQuestInStore('basics'); // fallback for testing
      }
      addXp(questContent.xpReward);
    }
  };

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    const result = await evaluateAnswer(questContent.id, currentStep.id, practiceInput);
    setEvaluationResult(result);
    setIsEvaluating(false);
  };

  if (completed) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6 relative overflow-hidden"
      >
        {/* Background celebration circles */}
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute w-[400px] h-[400px] bg-[var(--accent-primary)] rounded-full blur-3xl -z-10"
        />
        
        <motion.div
           initial={{ scale: 0, rotate: -45 }}
           animate={{ scale: 1, rotate: 0 }}
           transition={{ type: "spring", damping: 12, stiffness: 200 }}
           className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl mb-8 relative"
        >
           <Trophy className="text-white" size={64} strokeWidth={2.5} />
           <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 bg-white rounded-full"
           />
        </motion.div>

        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-black mb-4 tracking-tight"
        >
          {t('quest.completed_title', 'Квест пройден!')}
        </motion.h2>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg font-medium text-[var(--text-secondary)] mb-10"
        >
          {t('quest.completed_desc', 'Отличная работа! Ты на шаг ближе к мастерству.')}
        </motion.p>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="bg-white p-8 rounded-[40px] shadow-2xl border border-gray-100 flex flex-col items-center gap-2 mb-12 relative group"
        >
          <div className="absolute -top-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">Награда</div>
          <div className="flex items-center gap-3">
            <Zap size={32} className="text-yellow-500 fill-current" /> 
            <span className="font-black text-5xl text-gray-900 tracking-tighter">+{questContent.xpReward} <span className="text-2xl text-gray-300">XP</span></span>
          </div>
          <div className="flex gap-1 mt-2">
            {[1,2,3].map(i => <Star key={i} size={14} className="text-yellow-400 fill-current" />)}
          </div>
        </motion.div>

        <motion.button 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/home')}
          className="w-full max-w-[280px] bg-gray-900 text-white py-5 rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-gray-200"
        >
          Продолжить <ArrowRight size={20} />
        </motion.button>
      </motion.div>
    );
  }

  const currentStep = questContent.steps[step - 1];

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] px-6 pt-4">
      {/* Header */}
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-4 mb-8"
      >
        <button onClick={() => navigate('/home')} className="p-3 bg-white rounded-2xl shadow-sm text-gray-400 hover:text-gray-900 transition-colors">
           <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-xl tracking-tight leading-none mb-2">{questContent.title}</h1>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
               <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(step / questContent.totalSteps) * 100}%` }}
                className="bg-indigo-600 h-full rounded-full" 
               />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{step}/{questContent.totalSteps}</span>
          </div>
        </div>
      </motion.div>

      {/* Quest Body */}
      <div className="flex-1 relative no-scrollbar overflow-y-auto pb-10">
        <AnimatePresence mode="wait">
          {currentStep.type === 'dialogue' && (
            <motion.div 
              key="dialogue"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="bg-white rounded-[40px] p-8 shadow-2xl border border-gray-100 relative group"
            >
              <div className="absolute top-8 left-0 w-1.5 h-12 bg-indigo-600 rounded-r-full"></div>
              <p className="text-xl font-bold leading-relaxed mb-10 text-gray-800">{currentStep.text}</p>
              <div className="space-y-4">
                {currentStep.options.map((opt, idx) => (
                  <motion.button 
                    key={opt}
                    whileHover={{ x: 10, backgroundColor: 'rgba(79, 70, 229, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={handleNext} 
                    className="w-full p-6 bg-gray-50 text-left rounded-[24px] transition-all border-2 border-transparent hover:border-indigo-100 font-black text-indigo-600 flex items-center justify-between group/btn"
                  >
                    {opt}
                    <ArrowRight size={18} className="opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep.type === 'practice' && (
            <motion.div 
              key="practice"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="bg-white rounded-[40px] p-8 shadow-2xl border border-gray-100 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="bg-purple-100 text-purple-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Практика</span>
                <span className="text-sm font-black text-yellow-500 flex items-center gap-1"><Star size={14} fill="currentColor"/> +100 XP</span>
              </div>
              
              <h3 className="font-black text-2xl mb-2 tracking-tight">{currentStep.title}</h3>
              <p className="text-gray-500 font-medium mb-6 leading-relaxed">{currentStep.task}</p>
              
              <textarea 
                 value={practiceInput}
                 onChange={(e) => setPracticeInput(e.target.value)}
                 placeholder="Твой ответ..."
                 className="w-full h-40 p-6 bg-gray-50 border-2 border-transparent rounded-[32px] focus:outline-none focus:border-indigo-100 focus:bg-white transition-all text-lg font-medium resize-none mb-6 placeholder-gray-300"
                 disabled={isEvaluating || evaluationResult?.pass}
              />

              <AnimatePresence>
                {evaluationResult && (
                   <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className={`p-6 rounded-[28px] mb-6 border-2 ${evaluationResult.pass ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' : 'bg-rose-50/50 border-rose-100 text-rose-800'}`}
                   >
                     <div className="font-black flex justify-between items-center mb-2 uppercase tracking-tighter">
                       {evaluationResult.pass ? 'Успех!' : 'Попробуй еще раз'}
                       <span className="text-xl font-black">{evaluationResult.score}%</span>
                     </div>
                     <p className="text-sm font-medium leading-relaxed">{evaluationResult.feedback}</p>
                   </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-auto space-y-4">
                 <AnimatePresence>
                   {hintsUsed > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-5 bg-yellow-50 border-2 border-yellow-100 rounded-3xl text-sm font-bold text-yellow-800 flex gap-3"
                      >
                         <Lightbulb className="flex-shrink-0 text-yellow-500" size={20} />
                         <p>{currentStep.hints[hintsUsed - 1]}</p>
                      </motion.div>
                   )}
                 </AnimatePresence>

                 <div className="flex gap-3">
                   {hintsUsed < currentStep.hints.length && !evaluationResult?.pass && (
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setHintsUsed(h => h + 1)}
                        className="p-5 flex items-center justify-center bg-gray-100 text-gray-400 rounded-3xl hover:bg-gray-200 transition-colors"
                      >
                        <Lightbulb size={24} />
                      </motion.button>
                   )}
                   
                   {!evaluationResult?.pass ? (
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleEvaluate}
                        disabled={!practiceInput.trim() || isEvaluating}
                        className="flex-1 py-5 bg-indigo-600 text-white rounded-3xl font-black text-xl shadow-xl shadow-indigo-100 disabled:opacity-30 flex items-center justify-center gap-3"
                      >
                        {isEvaluating ? <Loader2 className="animate-spin" size={24} /> : "Проверить"}
                      </motion.button>
                   ) : (
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleNext}
                        className="flex-1 py-5 bg-emerald-500 text-white rounded-3xl font-black text-xl shadow-xl shadow-emerald-100 flex items-center justify-center gap-3"
                      >
                        {t('quest.continue', 'Продолжить')} <ArrowRight size={24} />
                      </motion.button>
                   )}
                 </div>
              </div>
            </motion.div>
          )}

          {currentStep.type === 'quiz' && (
            <motion.div 
              key="quiz"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="bg-white rounded-[40px] p-8 shadow-2xl border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Викторина</span>
              </div>
              
              <h3 className="font-black text-3xl mb-10 tracking-tight leading-tight">{currentStep.question}</h3>
              
              <div className="space-y-4">
                {currentStep.options.map((opt, idx) => (
                  <motion.button 
                    key={opt}
                    whileHover={{ x: 10, borderLeft: "8px solid rgba(59, 130, 246, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={handleNext} 
                    className="w-full p-6 bg-gray-50 text-left rounded-[24px] border-2 border-transparent hover:bg-blue-50 transition-all font-bold text-gray-800 flex items-center justify-between group"
                  >
                    {opt}
                    <div className="w-10 h-10 rounded-full border-2 border-gray-100 group-hover:border-blue-200 transition-colors" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
