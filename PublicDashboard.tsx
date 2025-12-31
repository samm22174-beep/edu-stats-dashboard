import React from 'react';
import { StudentStats } from './types';
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
}

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  shadow: string;
}> = ({ title, value, icon, gradient, shadow }) => (
  <div className={`relative overflow-hidden bg-white p-4 rounded-2xl border border-slate-100 shadow-sm ${shadow} flex-1 transition-transform hover:scale-[1.02]`}>
    <div className={`absolute top-0 right-0 w-12 h-12 -mr-2 -mt-2 rounded-full opacity-5 bg-gradient-to-br ${gradient}`}></div>
    <div className="flex items-center space-x-3 relative z-10">
      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-sm flex-shrink-0`}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 18 }) : icon}
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{title}</p>
        <p className="text-xl font-black text-slate-800 tracking-tighter leading-none">{value.toLocaleString()}</p>
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
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Centered Heading */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Current Enrollment</h2>
        <div className="flex items-center justify-center text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full w-max mx-auto">
          <Clock size={10} className="mr-1.5 text-indigo-500" />
          Updated: {new Date(stats.lastUpdated).toLocaleDateString()}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard 
          title="Total Students" 
          value={stats.total} 
          icon={<Users />} 
          gradient="from-slate-700 to-slate-900"
          shadow="shadow-slate-200/50"
        />
        <StatCard 
          title="Total Boys" 
          value={stats.boys} 
          icon={<UserRound />} 
          gradient="from-indigo-500 to-blue-600"
          shadow="shadow-indigo-200/50"
        />
        <StatCard 
          title="Total Girls" 
          value={stats.girls} 
          icon={<UserRoundSearch />} 
          gradient="from-pink-500 to-rose-600"
          shadow="shadow-pink-200/50"
        />
      </div>

      {/* Centered Chart Section */}
      <div className="flex justify-center pt-2">
        <div className="w-full max-w-lg bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/30">
          <div className="flex flex-col items-center mb-4">
            <div className="p-2 bg-indigo-50 rounded-xl mb-1 text-indigo-600">
              <PieChartIcon size={18} />
            </div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gender Distribution Ratio</h3>
          </div>
          
          <div className="h-52 md:h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
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
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={30} 
                  iconType="circle"
                  formatter={(value) => <span className="text-[10px] font-bold text-slate-500 px-1 uppercase tracking-wider">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Percentage Display */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-3 text-center pointer-events-none">
              <p className="text-3xl font-black text-slate-800 tracking-tighter leading-none">
                {stats.total > 0 ? Math.round((stats.girls / stats.total) * 100) : 0}%
              </p>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Female</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicDashboard;
