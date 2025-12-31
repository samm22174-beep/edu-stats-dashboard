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
  color: string;
  bg: string;
}> = ({ title, value, icon, color, bg }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center space-x-4 flex-1">
    <div className={`p-3 rounded-xl ${bg} ${color}`}>
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 20 }) : icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{title}</p>
      <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{value.toLocaleString()}</p>
    </div>
  </div>
);

const PublicDashboard: React.FC<Props> = ({ stats }) => {
  const chartData = [
    { name: 'Boys', value: stats.boys, color: '#4F46E5' },
    { name: 'Girls', value: stats.girls, color: '#DB2777' },
  ];

  const femalePercentage = stats.total > 0 ? Math.round((stats.girls / stats.total) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Dynamic Title and Date */}
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Snapshot</h2>
        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center justify-center">
          <Clock size={10} className="mr-1.5" />
          Refreshed: {new Date(stats.lastUpdated).toLocaleDateString()}
        </p>
      </div>

      {/* Stats Cards - Always Horizontal on Desktop, Stack on small mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard 
          title="Total Students" 
          value={stats.total} 
          icon={<Users />} 
          color="text-slate-700"
          bg="bg-slate-50"
        />
        <StatCard 
          title="Total Boys" 
          value={stats.boys} 
          icon={<UserRound />} 
          color="text-indigo-600"
          bg="bg-indigo-50"
        />
        <StatCard 
          title="Total Girls" 
          value={stats.girls} 
          icon={<UserRoundSearch />} 
          color="text-pink-600"
          bg="bg-pink-50"
        />
      </div>

      {/* Centered Gender Ratio Box */}
      <div className="flex justify-center pt-2">
        <div className="w-full max-w-md bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center">
          <div className="flex flex-col items-center mb-6">
            <div className="p-2 bg-indigo-50 rounded-xl mb-2 text-indigo-600">
              <PieChartIcon size={20} />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Gender Ratio</h3>
            <div className="w-8 h-1 bg-indigo-600/20 rounded-full mt-2"></div>
          </div>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                  strokeWidth={0}
                  animationDuration={1200}
                  animationBegin={0}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 20px -5px rgb(0 0 0 / 0.1)',
                    fontSize: '11px',
                    fontWeight: '800'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={30} 
                  iconType="circle"
                  formatter={(value) => <span className="text-[10px] font-extrabold text-slate-500 px-1 uppercase tracking-wider">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Percentage Display */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-4 text-center pointer-events-none">
              <p className="text-4xl font-black text-slate-800 tracking-tighter leading-none">
                {femalePercentage}%
              </p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Female</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicDashboard;
