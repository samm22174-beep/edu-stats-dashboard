import React, { useState, useEffect, useCallback } from 'react';
import { StudentStats, InsightData } from './types';
import PublicDashboard from './PublicDashboard';
import AdminPanel from './AdminPanel';
import { getStatsInsights } from './geminiService';

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
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Check URL for ?admin=true
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsAdmin(params.get('admin') === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const fetchInsights = useCallback(async () => {
    if (!isAdmin) { // Only fetch insights for public view to save tokens/improve speed
      setLoadingInsights(true);
      const data = await getStatsInsights(stats);
      if (data) setInsights(data);
      setLoadingInsights(false);
    }
  }, [stats, isAdmin]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const handleUpdateStats = (newStats: StudentStats) => {
    setStats(newStats);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAdmin ? 'EduStats Admin' : 'Student Statistics'}
            </h1>
          </div>
          
          {isAdmin && (
            <div className="flex items-center px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
              <span className="text-[10px] font-bold uppercase tracking-widest">Editor Mode</span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto w-full p-4 md:p-8">
        {isAdmin ? (
          <AdminPanel 
            stats={stats} 
            onSave={handleUpdateStats} 
          />
        ) : (
          <PublicDashboard 
            stats={stats} 
            insights={insights} 
            loadingInsights={loadingInsights} 
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} EduStats Analytics.
            {!isAdmin && (
              <span className="ml-1 opacity-0 pointer-events-none">Admin access via ?admin=true</span>
            )}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
