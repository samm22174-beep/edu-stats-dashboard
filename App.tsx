import React, { useState, useEffect, useRef } from 'react';
import { StudentStats } from './types';
import PublicDashboard from './PublicDashboard';
import AdminPanel from './AdminPanel';

const STORAGE_KEY = 'school_stats_permanent_v2';
const SYNC_CHANNEL = 'school_stats_sync_channel';

const DEFAULT_STATS: StudentStats = {
  total: 140,
  boys: 60,
  girls: 80,
  lastUpdated: new Date().toISOString()
};

const App: React.FC = () => {
  const [stats, setStats] = useState<StudentStats>(DEFAULT_STATS);
  const [view, setView] = useState<'public' | 'admin'>('public');
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Sync Logic
  const syncFromStorage = () => {
    const params = new URLSearchParams(window.location.search);
    const urlData = params.get('d');
    const saved = localStorage.getItem(STORAGE_KEY);
    
    let urlStats: StudentStats | null = null;
    let storageStats: StudentStats | null = null;

    if (urlData) {
      try { urlStats = JSON.parse(atob(urlData)); } catch (e) { console.error("URL parse error"); }
    }
    if (saved) {
      try { storageStats = JSON.parse(saved); } catch (e) { console.error("Storage parse error"); }
    }

    setStats(prev => {
      let latest = prev;
      if (urlStats && new Date(urlStats.lastUpdated) > new Date(latest.lastUpdated)) latest = urlStats;
      if (storageStats && new Date(storageStats.lastUpdated) > new Date(latest.lastUpdated)) latest = storageStats;
      return latest;
    });
  };

  useEffect(() => {
    // 1. Setup Broadcast Channel
    const channel = new BroadcastChannel(SYNC_CHANNEL);
    broadcastChannelRef.current = channel;
    channel.onmessage = (event) => {
      if (event.data?.type === 'STATS_UPDATE') {
        const incoming = event.data.payload;
        setStats(prev => (new Date(incoming.lastUpdated) > new Date(prev.lastUpdated) ? incoming : prev));
      }
    };

    // 2. Initial Sync
    syncFromStorage();

    // 3. Set view
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') setView('admin');

    // 4. "On the Spot" Listeners
    window.addEventListener('storage', syncFromStorage);
    window.addEventListener('focus', syncFromStorage);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') syncFromStorage();
    });

    // 5. Heartbeat Sync (Checks every 2 seconds for updates)
    const interval = setInterval(syncFromStorage, 2000);

    return () => {
      window.removeEventListener('storage', syncFromStorage);
      window.removeEventListener('focus', syncFromStorage);
      clearInterval(interval);
      channel.close();
    };
  }, []);

  const handleUpdateStats = (newStats: StudentStats) => {
    setStats(newStats);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type: 'STATS_UPDATE', payload: newStats });
    }
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
          {view === 'admin' && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
              <span className="text-[9px] font-black uppercase">Edit Mode</span>
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
