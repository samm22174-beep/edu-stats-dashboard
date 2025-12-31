import React, { useState, useEffect } from 'react';
import { StudentStats } from './types';
import PublicDashboard from './PublicDashboard';
import AdminPanel from './AdminPanel';

const STORAGE_KEY = 'edu_stats_data';

const DEFAULT_STATS: StudentStats = {
  total: 100,
  boys: 50,
  girls: 50,
  lastUpdated: new Date().toISOString()
};

const App: React.FC = () => {
  const [stats, setStats] = useState<StudentStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_STATS;
  });

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsAdmin(params.get('admin') === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const handleUpdateStats = (newStats: StudentStats) => {
    setStats(newStats);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">E</span>
            </div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight">
              {isAdmin ? 'EduStats Admin' : 'Student Statistics'}
            </h1>
          </div>
          
          {isAdmin && (
            <div className="flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
              <span className="text-[8px] font-bold uppercase tracking-widest">Admin</span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow w-full p-2 md:p-4 overflow-x-hidden">
        {isAdmin ? (
          <AdminPanel 
            stats={stats} 
            onSave={handleUpdateStats} 
          />
        ) : (
          <PublicDashboard 
            stats={stats} 
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-3">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-[10px] text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} School Enrollment Dashboard
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
