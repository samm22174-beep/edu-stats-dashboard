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
      setError("Value cannot be negative.");
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
    setTimeout(() => setIsSaved(false), 2000);
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
    <div className="max-w-xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => window.location.search = ''}
          className="group flex items-center text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 
          Public Dashboard
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="p-8 bg-slate-50 border-b border-slate-100">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manage Counts</h2>
          <p className="text-sm text-slate-500 mt-1">Updates are published instantly.</p>
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
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Total Enrollment</p>
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
            disabled={isSaved}
            className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-[0.97] flex items-center justify-center space-x-3 ${
              isSaved ? 'bg-green-500 text-white shadow-green-100' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
            }`}
          >
            {isSaved ? <><CheckCircle2 size={20} /> <span>Live Update Complete</span></> : <><Save size={20} /> <span>Save Changes</span></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
