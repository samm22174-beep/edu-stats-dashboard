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
  iconColor: string;
}> = ({ title, value, icon, gradient, iconColor }) => (
  <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/40 p-5 flex items-center space-x-4 flex-1 transition-all hover:shadow-xl hover:-translate-y-1">
    <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${gradient} ${iconColor} shadow-sm flex-shrink-0`}>
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 22 }) : icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5 truncate">{title}</p>
      <p className="text-2xl font-black text-slate-900 tracking-tighter leading-tight">{value.toLocaleString()}</p>
    </div>
  </div>
);

const PublicDashboard: React.FC<Props> = ({ stats }) => {
  const chartData = [
    { name: 'Boys', value: stats.boys, color: '#4F46E5' }, // Modern Indigo
    { name: 'Girls', value: stats.girls, color: '#EC4899' }, // Modern Pink
  ];

  const femalePercentage = stats.total > 0 ? Math.round((stats.girls / stats.total) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
      {/* Centered Heading */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Student Overview</h2>
        <div className="flex items-center justify-center space-x-2">
           <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.3em] flex items-center bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
            <Clock size={10} className="mr-2 text-indigo-500" />
            Live Sync: {new Date(stats.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Improved Stats Row with Vibrant Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard 
          title="Total Students" 
          value={stats.total} 
          icon={<Users />} 
          gradient="from-slate-800 to-slate-900"
          iconColor="text-white"
        />
        <StatCard 
          title="Total Boys" 
          value={stats.boys} 
          icon={<UserRound />} 
          gradient="from-indigo-500 to-blue-600"
          iconColor="text-white"
        />
        <StatCard 
          title="Total Girls" 
          value={stats.girls} 
          icon={<UserRoundSearch />} 
          gradient="from-pink-500 to-rose-600"
          iconColor="text-white"
        />
      </div>

      {/* Extra Small Centered Chart Section */}
      <div className="flex justify-center pt-2">
        <div className="w-full max-w-sm bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center">
          <div className="flex flex-col items-center mb-4 text-center">
            <div className="p-2 bg-slate-50 rounded-xl mb-2 text-indigo-600 border border-slate-100">
              <PieChartIcon size={18} />
            </div>
            <h3 className="text-sm font-black text-slate-800 tracking-wider uppercase">Gender Ratio</h3>
            <div className="w-8 h-1 bg-indigo-500/20 rounded-full mt-1.5"></div>
          </div>

          <div className="h-48 md:h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={6}
                  dataKey="value"
                  strokeWidth={0}
                  animationDuration={1200}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 15px 30px -5px rgb(0 0 0 / 0.1)',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '8px 12px'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={30} 
                  iconType="circle"
                  formatter={(value) => <span className="text-[9px] font-black text-slate-500 px-1 uppercase tracking-widest">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Percentage Display */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-3.5 text-center pointer-events-none">
              <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
                {femalePercentage}%
              </p>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Female</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicDashboard;
