import React, { useState, useEffect, useCallback } from 'react';
import { StudentStats, ViewMode, InsightData } from './types';
import PublicDashboard from './PublicDashboard';
import AdminPanel from './AdminPanel';
import { getStatsInsights } from './geminiService';
import { LayoutDashboard, Settings } from 'lucide-react';

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

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const fetchInsights = useCallback(async () => {
    setLoadingInsights(true);
    const data = await getStatsInsights(stats);
    if (data) setInsights(data);
    setLoadingInsights(false);
  }, [stats]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const handleUpdateStats = (newStats: StudentStats) => {
    setStats(newStats);
    getStatsInsights(newStats).then(data => {
      if (data) setInsights(data);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">EduStats</h1>
          </div>

          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode(ViewMode.DASHBOARD)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === ViewMode.DASHBOARD
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard size={18} className="mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setViewMode(ViewMode.ADMIN)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === ViewMode.ADMIN
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings size={18} className="mr-2" />
              Manage
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto w-full p-4 md:p-8">
        {viewMode === ViewMode.DASHBOARD ? (
          <PublicDashboard 
            stats={stats} 
            insights={insights} 
            loadingInsights={loadingInsights} 
          />
        ) : (
          <AdminPanel 
            stats={stats} 
            onSave={handleUpdateStats} 
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} EduStats Analytics. Designed for Google Sites.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
