import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20 flex flex-col">
      <main className="flex-1 w-full max-w-md mx-auto relative pt-4 px-4 pb-8">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
