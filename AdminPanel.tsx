import React, { useState } from 'react';
import { StudentStats } from './types';
import { Save, RefreshCw, AlertCircle, CheckCircle2, ChevronLeft, Link as LinkIcon, Copy, Info, Eye } from 'lucide-react';

interface Props {
  stats: StudentStats;
  onSave: (stats: StudentStats) => void;
  onBack: () => void;
}

const AdminPanel: React.FC<Props> = ({ stats, onSave, onBack }) => {
  const [formData, setFormData] = useState({
    boys: stats.boys,
    girls: stats.girls
  });
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permanentLink, setPermanentLink] = useState<string | null>(null);

  const total = formData.boys + formData.girls;

  const generatePermanentLink = (data: StudentStats) => {
    const baseUrl = window.location.href.split('?')[0];
    const encoded = btoa(JSON.stringify(data));
    return `${baseUrl}?d=${encoded}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.boys < 0 || formData.girls < 0) {
      setError("Counts cannot be negative.");
      return;
    }

    const newStats: StudentStats = {
      total,
      boys: formData.boys,
      girls: formData.girls,
      lastUpdated: new Date().toISOString()
    };

    onSave(newStats); // Updates parent state instantly
    setPermanentLink(generatePermanentLink(newStats));
    setIsSaved(true);
    // Note: No automatic view switch here so user can copy the link
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const num = parseInt(value);
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(num) ? 0 : num
    }));
  };

  const copyToClipboard = () => {
    if (permanentLink) {
      navigator.clipboard.writeText(permanentLink);
      alert("Link copied! Use this link in your Google Site to show the updated numbers.");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="group flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm"
        >
          <ChevronLeft size={14} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 
          Dashboard
        </button>

        {isSaved && (
           <button 
           onClick={onBack}
           className="flex items-center text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 animate-pulse"
         >
           <Eye size={14} className="mr-2" /> 
           View Changes
         </button>
        )}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Edit Enrollment</h2>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest">Instant Update Mode</p>
          </div>
          <div className="p-3 bg-white rounded-2xl shadow-md">
             <RefreshCw size={24} className="text-indigo-500" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Boys</label>
              <input
                type="number"
                name="boys"
                value={formData.boys}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none text-2xl font-black"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Girls</label>
              <input
                type="number"
                name="girls"
                value={formData.girls}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-rose-500 focus:bg-white transition-all outline-none text-2xl font-black"
              />
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-6 text-white flex justify-between items-center shadow-xl">
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Live Calculated Total</p>
              <p className="text-4xl font-black tracking-tighter">{total.toLocaleString()}</p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center">
              <AlertCircle size={16} className="mr-3 flex-shrink-0" /> {error}
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-5 rounded-2xl font-black text-base shadow-xl transition-all active:scale-[0.98] flex items-center justify-center space-x-3 ${
              isSaved ? 'bg-green-500 text-white shadow-green-100' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
            }`}
          >
            {isSaved ? <><CheckCircle2 size={18} /> <span>Saved Successfully</span></> : <><Save size={18} /> <span>Save & Publish</span></>}
          </button>
        </form>

        {permanentLink && (
          <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-4">
            <div className="flex items-center space-x-2 text-slate-700">
              <LinkIcon size={16} />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Google Sites Embed Link</h4>
            </div>
            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <p className="text-[10px] text-indigo-700 font-bold leading-relaxed uppercase tracking-wider">
                Note: Since Google Sites has no database, you MUST re-embed using this link to update your public site.
              </p>
            </div>
            <div className="flex space-x-2">
              <input 
                readOnly 
                value={permanentLink} 
                className="flex-grow bg-white border border-slate-200 rounded-xl px-4 py-2 text-[9px] font-mono text-slate-400"
              />
              <button 
                onClick={copyToClipboard}
                className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-md active:scale-90"
              >
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
