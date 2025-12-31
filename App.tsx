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

  // Initialize Broadcast Channel and Data
  useEffect(() => {
    // 1. Setup Broadcast Channel for "on the spot" updates
    const channel = new BroadcastChannel(SYNC_CHANNEL);
    broadcastChannelRef.current = channel;

    channel.onmessage = (event) => {
      if (event.data && event.data.type === 'STATS_UPDATE') {
        const incomingStats = event.data.payload as StudentStats;
        setStats(prev => {
          // Only update if incoming data is actually newer
          if (new Date(incomingStats.lastUpdated) > new Date(prev.lastUpdated)) {
            console.log("On-the-spot update received via BroadcastChannel");
            return incomingStats;
          }
          return prev;
        });
      }
    };

    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setView('admin');
    }

    // 2. Initial Data Loading Logic (The "Latest Wins" Strategy)
    const loadInitialData = () => {
      const urlData = params.get('d');
      const saved = localStorage.getItem(STORAGE_KEY);
      
      let urlStats: StudentStats | null = null;
      let storageStats: StudentStats | null = null;

      if (urlData) {
        try { urlStats = JSON.parse(atob(urlData)); } catch (e) { console.error("Invalid URL data"); }
      }
      if (saved) {
        try { storageStats = JSON.parse(saved); } catch (e) { console.error("Invalid storage data"); }
      }

      // Logic: Pick the absolute latest update between the URL and local storage
      let finalStats = DEFAULT_STATS;
      
      if (urlStats && storageStats) {
        finalStats = new Date(urlStats.lastUpdated) > new Date(storageStats.lastUpdated) 
          ? urlStats 
          : storageStats;
      } else if (urlStats) {
        finalStats = urlStats;
      } else if (storageStats) {
        finalStats = storageStats;
      }

      setStats(finalStats);
    };

    loadInitialData();

    // 3. Fallback: Storage event (for browsers that might struggle with BroadcastChannel)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newStats = JSON.parse(e.newValue);
          setStats(prev => {
            if (new Date(newStats.lastUpdated) > new Date(prev.lastUpdated)) {
              return newStats;
            }
            return prev;
          });
        } catch (err) {
          console.error("Failed to parse synced storage data", err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      channel.close();
    };
  }, []);

  const handleUpdateStats = (newStats: StudentStats) => {
    // 1. Update local state
    setStats(newStats);
    
    // 2. Persist to LocalStorage (triggers 'storage' event in other tabs)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    
    // 3. Broadcast to all other frames/tabs immediately
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
          {view === 'admin' && (
            <>
              <button 
                onClick={() => setView('public')}
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
              >
                View Dashboard
              </button>
              <div className="flex items-center space-x-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] font-black uppercase tracking-tighter">Edit Mode</span>
              </div>
            </>
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
