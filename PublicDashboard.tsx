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
  <div className={`relative overflow-hidden bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl ${shadow} transition-all hover:-translate-y-1 duration-300`}>
    <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 bg-gradient-to-br ${gradient}`}></div>
    <div className="flex items-center space-x-5 relative z-10">
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tight leading-none">{value.toLocaleString()}</p>
      </div>
    </div>
  </div>
);

const PublicDashboard: React.FC<Props> = ({ stats }) => {
  const chartData = [
    { name: 'Boys', value: stats.boys, color: '#4F46E5' }, // Indigo
    { name: 'Girls', value: stats.girls, color: '#EC4899' }, // Pink
  ];

  const femalePercentage = stats.total > 0 ? Math.round((stats.girls / stats.total) * 100) : 0;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Centered Heading */}
      <div className="text-center space-y-3">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">School Enrollment</h2>
        <div className="flex items-center justify-center space-x-2">
           <div className="h-[1px] w-8 bg-slate-200"></div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center bg-white px-4 py-1.5 rounded-full border border-slate-100 shadow-sm">
            <Clock size={12} className="mr-2 text-indigo-500" />
            Verified: {new Date(stats.lastUpdated).toLocaleDateString()}
          </p>
          <div className="h-[1px] w-8 bg-slate-200"></div>
        </div>
      </div>

      {/* Stats Row with Vibrant Gradients */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Students" 
          value={stats.total} 
          icon={<Users size={28} />} 
          gradient="from-slate-800 to-slate-950"
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

      {/* Smaller Centered Chart Section */}
      <div className="flex justify-center pt-2">
        <div className="w-full max-w-sm bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col items-center">
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="p-2.5 bg-indigo-50 rounded-2xl mb-3 text-indigo-600 border border-indigo-100 shadow-inner">
              <PieChartIcon size={20} />
            </div>
            <h3 className="text-base font-black text-slate-800 tracking-widest uppercase">Gender Ratio</h3>
            <div className="w-10 h-1 bg-indigo-600 rounded-full mt-2 opacity-20"></div>
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
                  paddingAngle={8}
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
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 40px -8px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: '900',
                    padding: '10px 18px'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={30} 
                  iconType="circle"
                  formatter={(value) => <span className="text-[10px] font-black text-slate-500 px-2 uppercase tracking-[0.2em]">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Percentage Display */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-4 text-center pointer-events-none">
              <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
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
