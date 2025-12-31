import React, { useState } from 'react';
import { StudentStats } from './types';
import { Save, RefreshCw, AlertCircle, CheckCircle2, ExternalLink, MousePointer2, Layout } from 'lucide-react';

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
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
          <div className="p-8 bg-slate-50 border-b border-slate-200">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Data Management</h2>
            <p className="text-slate-500 mt-1">Update the student counts for your live dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Boys Enrollment</label>
                <input
                  type="number"
                  name="boys"
                  value={formData.boys}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none text-xl font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Girls Enrollment</label>
                <input
                  type="number"
                  name="girls"
                  value={formData.girls}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-pink-500 focus:bg-white transition-all outline-none text-xl font-bold"
                />
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                <RefreshCw size={80} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Calculated</p>
              <p className="text-5xl font-black tracking-tighter">{total.toLocaleString()}</p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold flex items-center">
                <AlertCircle size={18} className="mr-2" /> {error}
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-5 rounded-2xl font-black text-lg shadow-2xl transition-all active:scale-95 flex items-center justify-center space-x-3 ${
                isSaved ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
              }`}
            >
              {isSaved ? <><CheckCircle2 /> <span>Data Saved!</span></> : <><Save /> <span>Update Public Dashboard</span></>}
            </button>
          </form>
        </div>

        <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
              <Layout className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-black mb-4">Google Sites Help</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <div className="bg-white/20 rounded-lg p-1 mt-0.5"><ExternalLink size={14}/></div>
                <p className="text-sm font-medium leading-tight">Public URL: <b>your-site.com</b></p>
              </li>
              <li className="flex items-start space-x-3">
                <div className="bg-white/20 rounded-lg p-1 mt-0.5"><MousePointer2 size={14}/></div>
                <p className="text-sm font-medium leading-tight">Admin URL: <b>your-site.com?admin=true</b></p>
              </li>
              <li className="flex items-start space-x-3">
                <div className="bg-white/20 rounded-lg p-1 mt-0.5"><Layout size={14}/></div>
                <p className="text-sm font-medium leading-tight">Embed only the Public URL for your students.</p>
              </li>
            </ul>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Security Note</p>
            <p className="text-xs text-indigo-100 mt-2">
              Keep the <b>?admin=true</b> link private. Only those with the link can edit the data.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
