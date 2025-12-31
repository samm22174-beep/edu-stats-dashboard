import React, { useState, useEffect } from 'react';
import { StudentStats } from './types';
import PublicDashboard from './PublicDashboard';
import AdminPanel from './AdminPanel';

const STORAGE_KEY = 'school_stats_permanent_v1';

const DEFAULT_STATS: StudentStats = {
  total: 140,
  boys: 60,
  girls: 80,
  lastUpdated: new Date().toISOString()
};

const App: React.FC = () => {
  const [stats, setStats] = useState<StudentStats>(DEFAULT_STATS);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsAdmin(params.get('admin') === 'true');
    
    // 1. Try to load from URL first (for Permanent Google Sites Links)
    const urlData = params.get('d');
    if (urlData) {
      try {
        const decoded = JSON.parse(atob(urlData));
        setStats(decoded);
        return; // Use URL data as source of truth
      } catch (e) {
        console.error("Failed to decode URL data");
      }
    }

    // 2. Otherwise load from LocalStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setStats(JSON.parse(saved));
      } catch (e) {
        setStats(DEFAULT_STATS);
      }
    }
  }, []);

  const handleUpdateStats = (newStats: StudentStats) => {
    setStats(newStats);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <header className="w-full bg-white border-b border-slate-100 py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white font-black text-sm">S</span>
          </div>
          <span className="text-lg font-black text-slate-800 tracking-tight">Student Dashboard</span>
        </div>
        
        {isAdmin && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200 shadow-sm">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest">Management Mode</span>
          </div>
        )}
      </header>

      <main className="w-full max-w-5xl p-4 md:p-8 flex-grow">
        {isAdmin ? (
          <AdminPanel stats={stats} onSave={handleUpdateStats} />
        ) : (
          <PublicDashboard stats={stats} />
        )}
      </main>
      
      {!isAdmin && (
        <footer className="w-full py-8 text-center border-t border-slate-100 bg-white/50">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">
            Official Institutional Records &copy; {new Date().getFullYear()}
          </p>
        </footer>
      )}
    </div>
  );
};

export default App;
