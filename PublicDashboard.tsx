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
  <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-5 md:p-7 flex items-center space-x-5 flex-1 transition-transform hover:scale-[1.02]">
    <div className={`p-4 rounded-2xl ${bg} ${color} shadow-sm`}>
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24 }) : icon}
    </div>
    <div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
      <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{value.toLocaleString()}</p>
    </div>
  </div>
);

const PublicDashboard: React.FC<Props> = ({ stats }) => {
  const chartData = [
    { name: 'Boys', value: stats.boys, color: '#6366f1' }, // Indigo-500
    { name: 'Girls', value: stats.girls, color: '#f43f5e' }, // Rose-500
  ];

  const femalePercentage = stats.total > 0 ? Math.round((stats.girls / stats.total) * 100) : 0;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Centered Heading */}
      <div className="text-center space-y-3">
        <h2 className="text-5xl font-black text-slate-900 tracking-tight">Student Statistics</h2>
        <div className="flex items-center justify-center space-x-2">
           <div className="h-[1px] w-8 bg-slate-200"></div>
           <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.3em] flex items-center">
            <Clock size={12} className="mr-2 text-indigo-500" />
            Updated: {new Date(stats.lastUpdated).toLocaleDateString()}
          </p>
          <div className="h-[1px] w-8 bg-slate-200"></div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          color="text-rose-600"
          bg="bg-rose-50"
        />
      </div>

      {/* Large Centered Chart Section */}
      <div className="flex justify-center pt-4">
        <div className="w-full max-w-2xl bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60 flex flex-col items-center">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="p-3 bg-indigo-50 rounded-2xl mb-4 text-indigo-600 shadow-inner">
              <PieChartIcon size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Gender Ratio</h3>
            <div className="w-12 h-1.5 bg-indigo-600 rounded-full mt-3"></div>
          </div>

          <div className="h-72 md:h-96 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={115}
                  paddingAngle={10}
                  dataKey="value"
                  strokeWidth={0}
                  animationDuration={1500}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                    fontSize: '14px',
                    fontWeight: '900',
                    padding: '12px 20px'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={40} 
                  iconType="circle"
                  formatter={(value) => <span className="text-xs font-black text-slate-500 px-2 uppercase tracking-widest">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Percentage Display */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-5 text-center pointer-events-none">
              <p className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
                {femalePercentage}%
              </p>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Female</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicDashboard;
