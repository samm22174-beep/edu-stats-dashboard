import React, { useState, useEffect } from 'react';
import { StudentStats } from './types';
import PublicDashboard from './PublicDashboard';
import AdminPanel from './AdminPanel';

const STORAGE_KEY = 'school_stats_permanent_v2';

const DEFAULT_STATS: StudentStats = {
  total: 140,
  boys: 60,
  girls: 80,
  lastUpdated: new Date().toISOString()
};

const App: React.FC = () => {
  const [stats, setStats] = useState<StudentStats>(DEFAULT_STATS);
  const [view, setView] = useState<'public' | 'admin'>('public');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Set initial view based on URL
    if (params.get('admin') === 'true') {
      setView('admin');
    }

    // 1. Try to load from URL first (Permanent Data)
    const urlData = params.get('d');
    if (urlData) {
      try {
        const decoded = JSON.parse(atob(urlData));
        setStats(decoded);
        return;
      } catch (e) {
        console.error("Invalid URL data");
      }
    }

    // 2. Load from LocalStorage
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
      <header className="w-full bg-white border-b border-slate-100 py-3 px-6 flex justify-between items-center sticky top-0 z-50">
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => setView('public')}
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
            <span className="text-white font-black text-sm">S</span>
          </div>
          <span className="text-base font-black text-slate-800 tracking-tight">Student Dashboard</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {view === 'admin' ? (
            <button 
              onClick={() => setView('public')}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
            >
              View Dashboard
            </button>
          ) : (
            <button 
              onClick={() => setView('admin')}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
            >
              Admin Login
            </button>
          )}
          
          {view === 'admin' && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
              <span className="text-[9px] font-black uppercase tracking-tighter">Edit Mode</span>
            </div>
          )}
        </div>
      </header>

      <main className="w-full max-w-4xl p-4 md:p-8 flex-grow">
        {view === 'admin' ? (
          <AdminPanel stats={stats} onSave={handleUpdateStats} onBack={() => setView('public')} />
        ) : (
          <PublicDashboard stats={stats} />
        )}
      </main>
      
      <footer className="w-full py-6 text-center border-t border-slate-100 bg-white/50">
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em]">
          Institutional Records &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default App;
