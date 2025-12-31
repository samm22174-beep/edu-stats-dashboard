import React, { useState, useEffect } from 'react';
import { StudentStats } from './types';
import { Save, ChevronLeft, Link as LinkIcon, Copy, Calculator, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  stats: StudentStats;
  onSave: (stats: StudentStats) => void;
  onBack: () => void;
}

const AdminPanel: React.FC<Props> = ({ stats, onSave, onBack }) => {
  // Use a local "draft" state so changes don't hit the public dashboard until Saved
  const [draft, setDraft] = useState({
    total: stats.total,
    boys: stats.boys,
    girls: stats.girls
  });
  
  const [isSaved, setIsSaved] = useState(false);
  const [permanentLink, setPermanentLink] = useState<string | null>(null);

  // Reciprocal calculation logic: Total = Boys + Girls
  const handleFieldChange = (field: 'total' | 'boys' | 'girls', value: number) => {
    setDraft(prev => {
      let next = { ...prev, [field]: value };
      
      if (field === 'boys') {
        // Update total based on new boys count
        next.total = value + prev.girls;
      } else if (field === 'girls') {
        // Update total based on new girls count
        next.total = prev.boys + value;
      } else if (field === 'total') {
        // Adjust girls to match the new total, keeping boys constant
        next.girls = Math.max(0, value - prev.boys);
        // If total is smaller than current boys, set girls to 0 and reduce boys
        if (value < prev.boys) {
          next.boys = value;
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
    
    // This sends the data to the App state and LocalStorage/BroadcastChannel
    onSave(newStats);
    
    // Generate the hard-coded link for Google Sites
    const baseUrl = window.location.href.split('?')[0];
    const encoded = btoa(JSON.stringify(newStats));
    setPermanentLink(`${baseUrl}?d=${encoded}`);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const copyLink = () => {
    if (permanentLink) {
      navigator.clipboard.writeText(permanentLink);
      alert("Link copied! Use this for the 'Embed' link in Google Sites.");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack} 
          className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft size={14} className="mr-1" /> Back to Dashboard
        </button>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
            <AlertCircle size={10} className="mr-1.5" />
            Draft Mode
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin Control</h2>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest">Automatic Math Enabled</p>
          </div>
          <div className="p-3 bg-white rounded-2xl shadow-md text-indigo-500">
            <Calculator size={24} />
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Main Total Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Overall Total Students</label>
            <input
              type="number"
              value={draft.total}
              onChange={(e) => handleFieldChange('total', parseInt(e.target.value) || 0)}
              className="w-full px-5 py-4 bg-slate-900 text-white rounded-2xl focus:ring-4 ring-indigo-500/20 transition-all outline-none text-4xl font-black text-center"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Boys Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-indigo-500">Boys</label>
              <input
                type="number"
                value={draft.boys}
                onChange={(e) => handleFieldChange('boys', parseInt(e.target.value) || 0)}
                className="w-full px-5 py-4 bg-indigo-50 border-2 border-indigo-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none text-2xl font-black text-center text-indigo-600"
              />
            </div>
            {/* Girls Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-rose-500">Girls</label>
              <input
                type="number"
                value={draft.girls}
                onChange={(e) => handleFieldChange('girls', parseInt(e.target.value) || 0)}
                className="w-full px-5 py-4 bg-rose-50 border-2 border-rose-100 rounded-2xl focus:border-rose-500 focus:bg-white transition-all outline-none text-2xl font-black text-center text-rose-600"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handlePublish}
              className={`w-full py-5 rounded-2xl font-black text-base shadow-xl transition-all active:scale-[0.98] flex items-center justify-center space-x-3 ${
                isSaved ? 'bg-green-600 text-white shadow-green-100' : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'
              }`}
            >
              {isSaved ? <CheckCircle2 size={18} /> : <Globe size={18} />}
              <span>{isSaved ? 'Dashboard Updated!' : 'Publish to Public Site'}</span>
            </button>
            <p className="mt-3 text-[10px] text-center text-slate-400 font-bold uppercase tracking-tight">
              Changes won't appear publicly until you click publish.
            </p>
          </div>
        </div>

        {permanentLink && (
          <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center text-slate-800">
              <LinkIcon size={12} className="mr-2" /> Google Sites Link
            </h4>
            <div className="flex space-x-2">
              <input 
                readOnly 
                value={permanentLink} 
                className="flex-grow bg-white border border-slate-200 rounded-xl px-4 py-2 text-[9px] font-mono overflow-hidden text-slate-400"
              />
              <button onClick={copyLink} className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-all">
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
