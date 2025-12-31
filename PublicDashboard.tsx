import React from 'react';
import { StudentStats } from './types';
import { Users, UserRound, UserRoundSearch, Clock } from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend
} from 'recharts';

interface Props {
  stats: StudentStats;
}

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  shadow: string;
}> = ({ title, value, icon, gradient, shadow }) => (
  <div className={`relative overflow-hidden bg-white p-5 rounded-[1.8rem] border border-slate-100 shadow-xl ${shadow} transition-all hover:-translate-y-1 duration-300`}>
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full opacity-5 bg-gradient-to-br ${gradient}`}></div>
    <div className="flex items-center space-x-4 relative z-10">
      <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 truncate">{title}</p>
        <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{value.toLocaleString()}</p>
      </div>
    </div>
  </div>
);

const PublicDashboard: React.FC<Props> = ({ stats }) => {
  const chartData = [
    { name: 'BOYS', value: stats.boys, color: '#6366F1' }, 
    { name: 'GIRLS', value: stats.girls, color: '#F43F5E' }, 
  ];

  const femalePercentage = stats.total > 0 ? Math.round((stats.girls / stats.total) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">Student Insights</h2>
        <div className="flex items-center justify-center">
           {/* Added key={stats.lastUpdated} to trigger re-animation on update */}
           <p 
            key={stats.lastUpdated}
            className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm animate-in zoom-in duration-300"
          >
            <Clock size={10} className="mr-1.5 text-indigo-500 animate-pulse" />
            Live Sync: {new Date(stats.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>
      </div>

      {/* High Contrast Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total" 
          value={stats.total} 
          icon={<Users size={22} />} 
          gradient="from-slate-800 to-slate-950"
          shadow="shadow-slate-200/50"
        />
        <StatCard 
          title="Boys" 
          value={stats.boys} 
          icon={<UserRound size={22} />} 
          gradient="from-indigo-500 to-indigo-700"
          shadow="shadow-indigo-200/40"
        />
        <StatCard 
          title="Girls" 
          value={stats.girls} 
          icon={<UserRoundSearch size={22} />} 
          gradient="from-rose-500 to-rose-700"
          shadow="shadow-rose-200/40"
        />
      </div>

      {/* Perfectly Centered & Balanced Gender Ratio Card */}
      <div className="flex justify-center pt-2">
        <div className="w-full max-w-[340px] bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 flex flex-col items-center overflow-hidden">
          <div className="flex flex-col items-center mb-0 text-center">
            <h3 className="text-[12px] font-black text-slate-800 tracking-[0.4em] uppercase">GENDER RATIO</h3>
            <div className="w-12 h-1 bg-indigo-500/10 rounded-full mt-2"></div>
          </div>

          <div className="h-72 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 10, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={82}
                  paddingAngle={6}
                  dataKey="value"
                  strokeWidth={0}
                  animationDuration={1000}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    fontSize: '10px',
                    fontWeight: '900'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={50} 
                  iconSize={12}
                  iconType="square"
                  wrapperStyle={{ 
                    paddingTop: '30px',
                    paddingLeft: '20px'
                  }}
                  formatter={(value) => <span className="text-[11px] font-black text-slate-400 px-2 uppercase tracking-[0.2em]">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Percentage Display - Locked to circle center at cy=45% */}
            <div className="absolute top-[43.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
                {femalePercentage}%
              </p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1.5">FEMALE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicDashboard;
