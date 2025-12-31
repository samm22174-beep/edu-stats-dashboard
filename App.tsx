import React, { useState, useEffect } from 'react';
import { StudentStats } from './types';
import PublicDashboard from './PublicDashboard';
import AdminPanel from './AdminPanel';

const STORAGE_KEY = 'edu_stats_data_v2';

const DEFAULT_STATS: StudentStats = {
  total: 140,
  boys: 60,
  girls: 80,
  lastUpdated: new Date().toISOString()
};

const App: React.FC = () => {
  const [stats, setStats] = useState<StudentStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_STATS;
      }
    }
    return DEFAULT_STATS;
  });

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsAdmin(params.get('admin') === 'true');
    
    // Listen for storage changes from other tabs (admin updates)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setStats(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleUpdateStats = (newStats: StudentStats) => {
    setStats(newStats);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {!isAdmin && (
        <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 py-3 px-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">E</span>
            </div>
            <span className="text-sm font-extrabold text-slate-800 tracking-tight">Student Statistics</span>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
            Live Feed
          </div>
        </header>
      )}

      <main className={`w-full max-w-4xl ${isAdmin ? 'p-4' : 'p-3 md:p-6'} flex-grow`}>
        {isAdmin ? (
          <AdminPanel stats={stats} onSave={handleUpdateStats} />
        ) : (
          <PublicDashboard stats={stats} />
        )}
      </main>
      
      {!isAdmin && (
        <footer className="w-full py-4 text-center border-t border-slate-100 bg-white/50">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
            School Data Dashboard &copy; {new Date().getFullYear()}
          </p>
        </footer>
      )}
    </div>
  );
};

export default App;
