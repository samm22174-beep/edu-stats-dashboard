import React, { useState } from 'react';
import { StudentStats } from './types';
import { Save, RefreshCw, AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';

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

  const total = formData.boys + formData.girls;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.boys < 0 || formData.girls < 0) {
      setError("Negative values are not allowed.");
      return;
    }

    const newStats: StudentStats = {
      total,
      boys: formData.boys,
      girls: formData.girls,
      lastUpdated: new Date().toISOString()
    };

    onSave(newStats);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const num = parseInt(value);
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(num) ? 0 : num
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => window.location.search = ''}
          className="flex items-center text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft size={14} className="mr-1" /> View Public Site
        </button>
        <div className="px-2 py-1 bg-amber-50 text-amber-600 rounded-md border border-amber-100 text-[10px] font-black uppercase tracking-widest">
          Secure Editor
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Update Numbers</h2>
          <p className="text-xs text-slate-500 mt-1">Changes are pushed instantly to the public dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Boys</label>
              <input
                type="number"
                name="boys"
                value={formData.boys}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xl font-bold transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Girls</label>
              <input
                type="number"
                name="girls"
                value={formData.girls}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-xl font-bold transition-all"
              />
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-5 text-white flex justify-between items-center">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Live Total</p>
              <p className="text-4xl font-black tracking-tighter">{total}</p>
            </div>
            <RefreshCw size={24} className="text-slate-700" />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[11px] font-bold flex items-center">
              <AlertCircle size={14} className="mr-2 flex-shrink-0" /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSaved}
            className={`w-full py-4 rounded-xl font-black text-base shadow-lg transition-all active:scale-[0.98] flex items-center justify-center space-x-2 ${
              isSaved ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isSaved ? <><CheckCircle2 size={18} /> <span>Data Published</span></> : <><Save size={18} /> <span>Save & Update Dashboard</span></>}
          </button>
        </form>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-start space-x-4">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 flex-shrink-0">
          <AlertCircle size={18} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-1">How it works</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Updating the numbers here saves the data to the browser's persistent storage. If you refresh the public site or visit it on this browser, the new numbers will show automatically. For multiple devices, ensure they point to the same database.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
