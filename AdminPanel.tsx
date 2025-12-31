import React, { useState } from 'react';
import { StudentStats } from './types';
import { Save, RefreshCw, AlertCircle, CheckCircle2, ChevronLeft, Link as LinkIcon, Copy } from 'lucide-react';

interface Props {
  stats: StudentStats;
  onSave: (stats: StudentStats) => void;
}

const AdminPanel: React.FC<Props> = ({ stats, onSave }) => {
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

    onSave(newStats);
    setPermanentLink(generatePermanentLink(newStats));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
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
      alert("Link copied! Use this link in your Google Sites embed.");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => window.location.search = ''}
          className="group flex items-center text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="p-8 bg-slate-50 border-b border-slate-100">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Data Management</h2>
          <p className="text-sm text-slate-500 mt-1">Updates are published via the Permanent Link.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Boys</label>
              <input
                type="number"
                name="boys"
                value={formData.boys}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none text-2xl font-black"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Girls</label>
              <input
                type="number"
                name="girls"
                value={formData.girls}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-rose-500 focus:bg-white transition-all outline-none text-2xl font-black"
              />
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-7 text-white flex justify-between items-center shadow-inner">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">New Total</p>
              <p className="text-5xl font-black tracking-tighter">{total.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center">
              <RefreshCw size={28} className="text-slate-600" />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center">
              <AlertCircle size={16} className="mr-3 flex-shrink-0" /> {error}
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-[0.97] flex items-center justify-center space-x-3 ${
              isSaved ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isSaved ? <><CheckCircle2 size={20} /> <span>Saved Successfully</span></> : <><Save size={20} /> <span>Save & Get Link</span></>}
          </button>
        </form>

        {permanentLink && (
          <div className="p-8 bg-indigo-50 border-t border-indigo-100 space-y-4">
            <div className="flex items-center space-x-2 text-indigo-700">
              <LinkIcon size={18} />
              <h4 className="text-sm font-black uppercase tracking-widest">Google Sites Embed Link</h4>
            </div>
            <p className="text-xs text-indigo-600 font-medium leading-relaxed">
              Google Sites often resets data. To prevent this, copy the link below and use it for your "Embed" section in Google Sites. It will stay correct forever!
            </p>
            <div className="flex space-x-2">
              <input 
                readOnly 
                value={permanentLink} 
                className="flex-grow bg-white border border-indigo-200 rounded-xl px-4 py-2 text-[10px] font-mono text-indigo-800"
              />
              <button 
                onClick={copyToClipboard}
                className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
