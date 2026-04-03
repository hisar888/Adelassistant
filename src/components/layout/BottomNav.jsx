import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map, MessageSquare, Users, UserCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const { t } = useTranslation();

  const navItems = [
    { to: '/home', icon: Home, label: t('nav.home') },
    { to: '/map', icon: Map, label: t('nav.map') },
    { to: '/chat', icon: MessageSquare, label: t('nav.mentor') },
    { to: '/family', icon: Users, label: t('nav.family') },
    { to: '/profile', icon: UserCircle, label: t('nav.profile') },
  ];

  return (
    <nav 
      className="fixed bottom-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-gray-100 dark:border-slate-800 pt-2 px-2 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] z-50 transition-colors"
      style={{ 
        paddingBottom: 'max(env(safe-area-inset-bottom, 12px), 12px)',
        minHeight: 'calc(64px + env(safe-area-inset-bottom, 0px))'
      }}
    >
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-2xl min-w-[64px] transition-all ${
                isActive 
                  ? 'text-orange-500' 
                  : 'text-gray-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={{ 
                    scale: isActive ? 1.15 : 1,
                    y: isActive ? -2 : 0
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
                <span className={`text-[10px] mt-1 font-black uppercase tracking-tighter transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
