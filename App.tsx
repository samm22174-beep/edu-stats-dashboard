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
  // This state represents what the Public Dashboard shows
  const [liveStats, setLiveStats] = useState<StudentStats>(DEFAULT_STATS);
  const [view, setView] = useState<'public' | 'admin'>('public');
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Sync Logic: Merges URL data and LocalStorage data based on the newest timestamp
  const syncLiveStats = () => {
    const params = new URLSearchParams(window.location.search);
    const urlData = params.get('d');
    const saved = localStorage.getItem(STORAGE_KEY);
    
    let urlStats: StudentStats | null = null;
    let storageStats: StudentStats | null = null;

    if (urlData) {
      try {
        urlStats = JSON.parse(atob(urlData));
      } catch (e) {
        console.error("URL data corruption");
      }
    }

    if (saved) {
      try {
        storageStats = JSON.parse(saved);
      } catch (e) {
        console.error("Storage data corruption");
      }
    }

    setLiveStats(prev => {
      let candidate = prev;
      
      if (urlStats && new Date(urlStats.lastUpdated) > new Date(candidate.lastUpdated)) {
        candidate = urlStats;
      }
      
      if (storageStats && new Date(storageStats.lastUpdated) > new Date(candidate.lastUpdated)) {
        candidate = storageStats;
      }

      return candidate;
    });
  };

  useEffect(() => {
    // 1. Initial Load
    syncLiveStats();

    // 2. Check for Admin View
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setView('admin');
    }

    // 3. Setup Broadcast Channel for cross-tab sync
    const channel = new BroadcastChannel(SYNC_CHANNEL);
    broadcastChannelRef.current = channel;
    channel.onmessage = (event) => {
      if (event.data?.type === 'STATS_UPDATE') {
        const incoming = event.data.payload as StudentStats;
        setLiveStats(prev => {
          if (new Date(incoming.lastUpdated) > new Date(prev.lastUpdated)) {
            return incoming;
          }
          return prev;
        });
      }
    };

    // 4. Robust event listeners for "On the spot" updates
    window.addEventListener('storage', syncLiveStats);
    window.addEventListener('focus', syncLiveStats);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') syncLiveStats();
    });

    // 5. Polling for restricted environments (Google Sites)
    const interval = setInterval(syncLiveStats, 3000);

    return () => {
      window.removeEventListener('storage', syncLiveStats);
      window.removeEventListener('focus', syncLiveStats);
      clearInterval(interval);
      channel.close();
    };
  }, []);

  // When Admin clicks "Publish"
  const handlePublishStats = (newStats: StudentStats) => {
    setLiveStats(newStats);
    // Persist for next session
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    // Alert other open frames/tabs immediately
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'STATS_UPDATE',
        payload: newStats
      });
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
          {view === 'admin' ? (
             <div className="flex items-center space-x-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
             <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
             <span className="text-[9px] font-black uppercase tracking-widest">Admin Control</span>
           </div>
          ) : (
            <button 
              onClick={() => setView('admin')}
              className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
            >
              Manage Data
            </button>
          )}
        </div>
      </header>

      <main className="w-full max-w-4xl p-4 md:p-8 flex-grow">
        {view === 'admin' ? (
          <AdminPanel stats={liveStats} onSave={handlePublishStats} onBack={() => setView('public')} />
        ) : (
          <PublicDashboard stats={liveStats} onManualRefresh={syncLiveStats} />
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
