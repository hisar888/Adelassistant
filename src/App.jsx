import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import SkillMapPage from './pages/SkillMapPage';
import ChatPage from './pages/ChatPage';
import QuestPage from './pages/QuestPage';
import ProfilePage from './pages/ProfilePage';
import FamilyPage from './pages/FamilyPage';
import AchievementsPage from './pages/AchievementsPage';
import InventoryPage from './pages/InventoryPage';
import MainLayout from './components/layout/MainLayout';
import { useUserStore } from './store/useUserStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

function RequireAuth({ children }) {
  const isAuthenticated = useUserStore(state => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        
        {/* Onboarding doesn't show the BottomNav */}
        <Route path="/onboarding" element={
          <RequireAuth><PageWrapper><OnboardingPage /></PageWrapper></RequireAuth>
        } />
        
        {/* Protected Routes inside Layout */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<RequireAuth><PageWrapper><HomePage /></PageWrapper></RequireAuth>} />
          <Route path="/map" element={<RequireAuth><PageWrapper><SkillMapPage /></PageWrapper></RequireAuth>} />
          <Route path="/chat" element={<RequireAuth><PageWrapper><ChatPage /></PageWrapper></RequireAuth>} />
          <Route path="/family" element={<RequireAuth><PageWrapper><FamilyPage /></PageWrapper></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><PageWrapper><ProfilePage /></PageWrapper></RequireAuth>} />
          <Route path="/profile/achievements" element={<RequireAuth><PageWrapper><AchievementsPage /></PageWrapper></RequireAuth>} />
          <Route path="/profile/inventory" element={<RequireAuth><PageWrapper><InventoryPage /></PageWrapper></RequireAuth>} />
          <Route path="/quest/:id" element={<RequireAuth><PageWrapper><QuestPage /></PageWrapper></RequireAuth>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
