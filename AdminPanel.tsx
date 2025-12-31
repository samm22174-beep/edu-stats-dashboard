import React, { useState, useEffect } from 'react';
import { StudentStats } from './types';
import { 
  Save, 
  ChevronLeft, 
  Link as LinkIcon, 
  Copy, 
  Calculator, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  PieChart as PieIcon,
  Zap
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Props {
  stats: StudentStats;
  onSave: (stats: StudentStats) => void;
  onBack: () => void;
}

const AdminPanel: React.FC<Props> = ({ stats, onSave, onBack }) => {
  const [draft, setDraft] = useState({
    total: stats.total,
    boys: stats.boys,
    girls: stats.girls
  });
  
  const [isSaved, setIsSaved] = useState(false);
  const [permanentLink, setPermanentLink] = useState<string | null>(null);

  // Automatic Calculation Logic: Ensures Total = Boys + Girls at all times
  const handleFieldChange = (field: 'total' | 'boys' | 'girls', value: number) => {
    const numValue = Math.max(0, value);
    setDraft(prev => {
      let next = { ...prev, [field]: numValue };
      
      if (field === 'boys') {
        // Changing boys increases/decreases the total
        next.total = numValue + prev.girls;
      } else if (field === 'girls') {
        // Changing girls increases/decreases the total
        next.total = prev.boys + numValue;
      } else if (field === 'total') {
        // Changing total adjusts girls while keeping boys constant
        next.girls = Math.max(0, numValue - prev.boys);
        // If the new total is smaller than boys, adjust boys too
        if (numValue < prev.boys) {
          next.boys = numValue;
          next.girls = 0;
        }
      }
      return next;
    });
  };

  const handlePublish = () => {
    const newStats: StudentStats = {
      ...draft,
      lastUpdated: new Date().toISOString()
    };
    onSave(newStats);
    
    // Generate the URL for Google Sites Embed
    const baseUrl = window.location.href.split('?')[0];
    const encoded = btoa(JSON.stringify(newStats));
    setPermanentLink(`${baseUrl}?d=${encoded}`);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const copyLink = () => {
    if (permanentLink) {
      navigator.clipboard.writeText(permanentLink);
      alert("Link copied! Use this as the 'Embed' URL in Google Sites.");
    }
  };

  const chartData = [
    { name: 'Boys', value: draft.boys, color: '#6366F1' },
    { name: 'Girls', value: draft.girls, color: '#F43F5E' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack} 
          className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft size={14} className="mr-1" /> Dashboard View
        </button>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
            <Zap size={10} className="mr-1.5 fill-current animate-pulse" />
            Active Editor
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Editor Controls */}
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
          <div className="p-8 bg-slate-50 border-b border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin Controls</h2>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest">Calculates Automatically</p>
          </div>

          <div className="p-8 space-y-6 flex-grow">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Enrollment</label>
              <input
                type="number"
                value={draft.total}
                onChange={(e) => handleFieldChange('total', parseInt(e.target.value) || 0)}
                className="w-full px-5 py-4 bg-slate-900 text-white rounded-2xl focus:ring-4 ring-indigo-500/20 transition-all outline-none text-4xl font-black text-center"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Boys</label>
                <input
                  type="number"
                  value={draft.boys}
                  onChange={(e) => handleFieldChange('boys', parseInt(e.target.value) || 0)}
                  className="w-full px-5 py-4 bg-indigo-50 border-2 border-indigo-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none text-2xl font-black text-center text-indigo-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Girls</label>
                <input
                  type="number"
                  value={draft.girls}
                  onChange={(e) => handleFieldChange('girls', parseInt(e.target.value) || 0)}
                  className="w-full px-5 py-4 bg-rose-50 border-2 border-rose-100 rounded-2xl focus:border-rose-500 focus:bg-white transition-all outline-none text-2xl font-black text-center text-rose-600"
                />
              </div>
            </div>

            <button
              onClick={handlePublish}
              className={`w-full py-5 rounded-2xl font-black text-base shadow-xl transition-all active:scale-[0.98] flex items-center justify-center space-x-3 ${
                isSaved ? 'bg-green-600 text-white shadow-green-100' : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'
              }`}
            >
              {isSaved ? <CheckCircle2 size={18} /> : <Globe size={18} />}
              <span>{isSaved ? 'Live Site Updated!' : 'Publish Updates'}</span>
            </button>
          </div>
        </div>

        {/* Live Preview Side Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col items-center text-center">
            <h3 className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase mb-4 flex items-center">
              <PieIcon size={12} className="mr-2 text-indigo-500" /> Live Preview
            </h3>
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <p className="text-xl font-black text-slate-800">
                  {draft.total > 0 ? Math.round((draft.girls / draft.total) * 100) : 0}%
                </p>
              </div>
            </div>
            <p className="text-[9px] font-bold text-slate-300 uppercase mt-2 italic">
              * This is how the public chart will look
            </p>
          </div>

          {permanentLink && (
            <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center text-indigo-400">
                <LinkIcon size={12} className="mr-2" /> Google Sites URL
              </h4>
              <div className="flex space-x-2">
                <input 
                  readOnly 
                  value={permanentLink} 
                  className="flex-grow bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-[8px] font-mono overflow-hidden text-white/60 focus:outline-none"
                />
                <button onClick={copyLink} className="bg-white text-slate-900 p-2 rounded-xl hover:bg-indigo-400 transition-all active:scale-90">
                  <Copy size={14} />
                </button>
              </div>
              <p className="text-[8px] text-white/40 font-bold uppercase tracking-tight">
                Update the "Embed By URL" source in Google Sites with this link to ensure data persists.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
