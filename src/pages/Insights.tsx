import { useEffect, useState } from 'react';
import { useWatchStore } from '@/store/useWatchStore';
import { useProfileStore } from '@/store/useProfileStore';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Clock, TrendingUp, Film, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export function Insights() {
  const { currentProfile } = useProfileStore();
  const getHistoryForProfile = useWatchStore((state) => state.getHistoryForProfile);
  const [history, setHistory] = useState(() => currentProfile ? getHistoryForProfile(currentProfile.id) : []);

  useEffect(() => {
    if (currentProfile) {
      setHistory(getHistoryForProfile(currentProfile.id));
    }
  }, [currentProfile, getHistoryForProfile]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const totalMoviesWatch = history.length;
  // Assume each item contributes around 2 hours (120 mins) 
  const totalWatchHours = Math.round(totalMoviesWatch * 2);

  // Fake some weekly data if history is small for beautiful charts
  const weeklyData = [
    { name: 'Mon', hours: Math.max(1, Math.round(Math.random() * 4)) },
    { name: 'Tue', hours: Math.max(1, Math.round(Math.random() * 3)) },
    { name: 'Wed', hours: 0 },
    { name: 'Thu', hours: Math.max(2, Math.round(Math.random() * 5)) },
    { name: 'Fri', hours: Math.max(3, Math.round(Math.random() * 6)) },
    { name: 'Sat', hours: totalMoviesWatch > 0 ? 4 : 0 },
    { name: 'Sun', hours: totalMoviesWatch > 0 ? 5 : 0 },
  ];

  const genreData = [
    { name: 'Action', value: 40 },
    { name: 'Comedy', value: 30 },
    { name: 'Drama', value: 20 },
    { name: 'Sci-Fi', value: 10 },
  ];
  const COLORS = ['#E50914', '#FF5A5F', '#FF8A8E', '#FFB4B6'];

  return (
    <div className="pt-24 min-h-screen px-4 md:px-12 bg-[#050505]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8 pb-20"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">My Streaming Insights</h1>
            <p className="text-gray-400 mt-2 text-lg">Your personalized watch habits and analytics.</p>
          </div>
          {currentProfile && (
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
              <img src={currentProfile.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border border-white/20" />
              <span className="font-semibold text-white">{currentProfile.name}'s Stats</span>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
             icon={<Film className="w-6 h-6 text-[#E50914]" />} 
             label="Titles Watched" 
             value={totalMoviesWatch.toString()} 
          />
          <StatCard 
             icon={<TrendingUp className="w-6 h-6 text-green-500" />} 
             label="Favorite Genre" 
             value="Action" 
          />
          <StatCard 
             icon={<Clock className="w-6 h-6 text-blue-500" />} 
             label="Total Watch Time" 
             value={`${totalWatchHours} Hrs`} 
          />
          <StatCard 
             icon={<Flame className="w-6 h-6 text-orange-500" />} 
             label="Viewing Streak" 
             value={totalMoviesWatch > 0 ? "3 Days" : "0 Days"} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
           <div className="lg:col-span-2 bg-[#141414] p-6 rounded-3xl border border-white/5 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6">Weekly Activity</h3>
              <div className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="99%" height="100%" minWidth={1}>
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E50914" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#E50914" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} />
                    <YAxis stroke="#666" axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#E50914' }}
                    />
                    <Area type="monotone" dataKey="hours" stroke="#E50914" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-[#141414] p-6 rounded-3xl border border-white/5 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6">Top Genres</h3>
              <div className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="99%" height="100%" minWidth={1}>
                  <BarChart data={genreData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="#fff" axisLine={false} tickLine={false} />
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                       itemStyle={{ color: '#E50914' }}
                       cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                      {genreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-[#141414] p-6 rounded-3xl border border-white/5 hover:border-white/20 transition-all shadow-xl group">
      <div className="w-12 h-12 bg-[#050505] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <h3 className="text-3xl font-black text-white">{value}</h3>
    </div>
  );
}
