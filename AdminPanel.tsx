import React, { useState, useEffect } from 'react';
import { StudentStats } from './types';
import { Save, RefreshCw, AlertCircle, CheckCircle2, ChevronLeft, Link as LinkIcon, Copy, Zap, Calculator } from 'lucide-react';

interface Props {
  stats: StudentStats;
  onSave: (stats: StudentStats) => void;
  onBack: () => void;
}

const AdminPanel: React.FC<Props> = ({ stats, onSave, onBack }) => {
  const [formData, setFormData] = useState({
    total: stats.total,
    boys: stats.boys,
    girls: stats.girls
  });
  const [autoBroadcast, setAutoBroadcast] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [permanentLink, setPermanentLink] = useState<string | null>(null);

  // Trigger sync to parent if auto-broadcast is on
  useEffect(() => {
    if (autoBroadcast) {
      const newStats: StudentStats = {
        ...formData,
        lastUpdated: new Date().toISOString()
      };
      onSave(newStats);
    }
  }, [formData, autoBroadcast]);

  const handleManualSave = () => {
    const newStats: StudentStats = {
      ...formData,
      lastUpdated: new Date().toISOString()
    };
    onSave(newStats);
    const baseUrl = window.location.href.split('?')[0];
    const encoded = btoa(JSON.stringify(newStats));
    setPermanentLink(`${baseUrl}?d=${encoded}`);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleFieldChange = (name: string, value: number) => {
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      if (name === 'boys') {
        updated.total = value + prev.girls;
      } else if (name === 'girls') {
        updated.total = prev.boys + value;
      } else if (name === 'total') {
        // If total changes, try to maintain current ratio or default to 50/50
        const currentTotal = prev.boys + prev.girls;
        if (currentTotal > 0) {
          const boyRatio = prev.boys / currentTotal;
          updated.boys = Math.round(value * boyRatio);
          updated.girls = value - updated.boys;
        } else {
          updated.boys = Math.round(value / 2);
          updated.girls = value - updated.boys;
        }
      }
      return updated;
    });
  };

  const copyLink = () => {
    if (permanentLink) {
      navigator.clipboard.writeText(permanentLink);
      alert("Link copied! Use this in Google Sites Embed.");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
          <ChevronLeft size={14} className="mr-1" /> Dashboard
        </button>
        <div className="flex items-center space-x-2">
          <label className="flex items-center cursor-pointer bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
            <input 
              type="checkbox" 
              checked={autoBroadcast} 
              onChange={(e) => setAutoBroadcast(e.target.checked)}
              className="hidden"
            />
            <Zap size={10} className={`mr-2 ${autoBroadcast ? 'text-indigo-600' : 'text-slate-300'}`} />
            <span className={`text-[9px] font-black uppercase ${autoBroadcast ? 'text-indigo-600' : 'text-slate-400'}`}>
              {autoBroadcast ? 'Auto-Sync On' : 'Manual Save Only'}
            </span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Enrollment Editor</h2>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest">Calculates Automatically</p>
          </div>
          <div className="p-3 bg-white rounded-2xl shadow-md text-indigo-500">
            <Calculator size={24} />
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Students</label>
            <input
              type="number"
              value={formData.total}
              onChange={(e) => handleFieldChange('total', parseInt(e.target.value) || 0)}
              className="w-full px-5 py-4 bg-slate-900 text-white rounded-2xl focus:ring-4 ring-indigo-500/20 transition-all outline-none text-4xl font-black text-center"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-indigo-500">Boys Count</label>
              <input
                type="number"
                value={formData.boys}
                onChange={(e) => handleFieldChange('boys', parseInt(e.target.value) || 0)}
                className="w-full px-5 py-4 bg-indigo-50 border-2 border-indigo-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none text-2xl font-black text-center text-indigo-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-rose-500">Girls Count</label>
              <input
                type="number"
                value={formData.girls}
                onChange={(e) => handleFieldChange('girls', parseInt(e.target.value) || 0)}
                className="w-full px-5 py-4 bg-rose-50 border-2 border-rose-100 rounded-2xl focus:border-rose-500 focus:bg-white transition-all outline-none text-2xl font-black text-center text-rose-600"
              />
            </div>
          </div>

          <button
            onClick={handleManualSave}
            className={`w-full py-5 rounded-2xl font-black text-base shadow-xl transition-all active:scale-[0.98] flex items-center justify-center space-x-3 ${
              isSaved ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white'
            }`}
          >
            {isSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
            <span>{isSaved ? 'Permanent Link Generated!' : 'Save & Get Link'}</span>
          </button>
        </div>

        {permanentLink && (
          <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center">
              <LinkIcon size={12} className="mr-2" /> Permanent Google Site Link
            </h4>
            <div className="flex space-x-2">
              <input 
                readOnly 
                value={permanentLink} 
                className="flex-grow bg-white border border-slate-200 rounded-xl px-4 py-2 text-[9px] font-mono overflow-hidden"
              />
              <button onClick={copyLink} className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700">
                <Copy size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
