import React from 'react';
import { StudentStats, InsightData } from './types';
import { Users, UserRound, UserRoundSearch, PieChart as PieChartIcon, Clock } from 'lucide-react';
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
  insights: InsightData | null;
  loadingInsights: boolean;
}

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  shadow: string;
}> = ({ title, value, icon, gradient, shadow }) => (
  <div className={`relative overflow-hidden bg-white p-6 rounded-3xl border border-slate-100 shadow-xl ${shadow} transition-all hover:-translate-y-1 duration-300`}>
    <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 bg-gradient-to-br ${gradient}`}></div>
    <div className="flex items-center space-x-4 relative z-10">
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-slate-800 tracking-tight">{value.toLocaleString()}</p>
      </div>
    </div>
  </div>
);

const PublicDashboard: React.FC<Props> = ({ stats }) => {
  const chartData = [
    { name: 'Boys', value: stats.boys, color: '#4F46E5' },
    { name: 'Girls', value: stats.girls, color: '#DB2777' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Student Statistics</h2>
        <div className="flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <Clock size={12} className="mr-1.5" />
          Updated: {new Date(stats.lastUpdated).toLocaleDateString()} at {new Date(stats.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Students" 
          value={stats.total} 
          icon={<Users size={28} />} 
          gradient="from-slate-700 to-slate-900"
          shadow="shadow-slate-200"
        />
        <StatCard 
          title="Total Boys" 
          value={stats.boys} 
          icon={<UserRound size={28} />} 
          gradient="from-indigo-500 to-blue-600"
          shadow="shadow-indigo-100"
        />
        <StatCard 
          title="Total Girls" 
          value={stats.girls} 
          icon={<UserRoundSearch size={28} />} 
          gradient="from-pink-500 to-rose-600"
          shadow="shadow-pink-100"
        />
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-lg bg-white p-8 rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200">
          <div className="flex flex-col items-center mb-8">
            <div className="p-3 bg-slate-50 rounded-2xl mb-3">
              <PieChartIcon size={24} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Gender Ratio</h3>
            <div className="h-1 w-12 bg-indigo-600 rounded-full mt-2"></div>
          </div>
          
          <div className="h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={1500}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '12px 16px',
                    fontWeight: 'bold'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-slate-600 font-bold px-2">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-4 text-center pointer-events-none">
              <p className="text-4xl font-black text-slate-800">
                {stats.total > 0 ? Math.round((stats.girls / stats.total) * 100) : 0}%
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Female</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicDashboard;
