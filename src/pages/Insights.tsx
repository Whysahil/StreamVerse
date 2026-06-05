import { useEffect, useState, useRef } from 'react';
import { useWatchStore } from '@/store/useWatchStore';
import { useProfileStore } from '@/store/useProfileStore';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Clock, TrendingUp, Film, Flame, MonitorPlay, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchWatchEvents, WatchEvent } from '@/lib/tracking';
import { Link } from 'react-router-dom';

const GENRE_MAP: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
  10759: 'Action & Adventure', 10762: 'Kids', 10763: 'News', 10764: 'Reality',
  10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics'
};

function SafeChartWrapper({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0].contentRect.width > 0 && entries[0].contentRect.height > 0) {
        setReady(true);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full flex-1">
      {ready ? children : <div className="w-full h-full" />}
    </div>
  );
}

export function Insights() {
  const { currentProfile } = useProfileStore();
  const [events, setEvents] = useState<WatchEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      if (!currentProfile) return;
      setLoading(true);
      const data = await fetchWatchEvents(currentProfile.id);
      setEvents(data || []);
      setLoading(false);
    }
    loadEvents();
    window.scrollTo(0, 0);
  }, [currentProfile]);

  const uniqueTitles = new Set(events.map(e => e.movieId)).size;
  const totalWatchHours = events.reduce((acc, e) => acc + (e.durationMs || 0), 0) / (1000 * 60 * 60);
  
  const movieCount = new Set(events.filter(e => e.type === 'movie').map(e => e.movieId)).size;
  const seriesCount = new Set(events.filter(e => e.type === 'tv').map(e => e.movieId)).size;
  const mostWatchedCategory = movieCount > seriesCount ? 'Movies' : seriesCount > movieCount ? 'Series' : 'Balanced';

  // Genre counts
  const genreCounts: Record<string, number> = {};
  events.forEach(e => {
    e.genres?.forEach(id => {
      const name = GENRE_MAP[id] || 'Other';
      genreCounts[name] = (genreCounts[name] || 0) + 1;
    });
  });

  const sortedGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  const favoriteGenre = sortedGenres.length > 0 ? sortedGenres[0].name : 'N/A';
  const top5Genres = sortedGenres.slice(0, 5);

  // Compute Personality
  let personality = "Casual Viewer";
  if (totalWatchHours > 20) {
    if (favoriteGenre === 'Action' || favoriteGenre === 'Action & Adventure') personality = "Action Explorer";
    else if (favoriteGenre === 'Sci-Fi' || favoriteGenre === 'Sci-Fi & Fantasy') personality = "Sci-Fi Enthusiast";
    else if (favoriteGenre === 'Thriller' || favoriteGenre === 'Crime') personality = "Thriller Addict";
    else if (favoriteGenre === 'Comedy') personality = "Comedy Critic";
    else if (favoriteGenre === 'Romance') personality = "Hopeless Romantic";
    else if (favoriteGenre === 'Documentary') personality = "Documentary Expert";
    else personality = "Premium Binger";
  } else if (events.length > 0) {
    personality = "Weekend Binger";
  }

  // Calculate Streak
  let streak = 0;
  if (events.length > 0) {
    const sortedDays = Array.from(new Set(events.map(e => {
      const d = new Date(e.timestamp);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let currentDayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    const msInDay = 24 * 60 * 60 * 1000;
    
    if (sortedDays.includes(currentDayStr) || sortedDays.includes(new Date(Date.now() - msInDay).toLocaleDateString('en-CA'))) {
      streak = 1;
      let checkDate = new Date();
       if (!sortedDays.includes(currentDayStr)) {
         checkDate = new Date(Date.now() - msInDay);
       }
      
      for (let i = 1; i < sortedDays.length; i++) {
        checkDate = new Date(checkDate.getTime() - msInDay);
        const dayStr = checkDate.toLocaleDateString('en-CA');
        if (sortedDays.includes(dayStr)) {
          streak++;
        } else {
          break;
        }
      }
    }
  }

  // Weekly Activity Array (Last 7 days)
  const weeklyData = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const msInDay = 24 * 60 * 60 * 1000;
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * msInDay);
    const dayStr = d.toLocaleDateString('en-CA');
    const dayEvents = events.filter(e => {
      const ed = new Date(e.timestamp);
      return ed.toLocaleDateString('en-CA') === dayStr;
    });
    const hours = dayEvents.reduce((acc, e) => acc + (e.durationMs || 0), 0) / (1000 * 60 * 60);
    weeklyData.push({
      name: daysOfWeek[d.getDay()],
      hours: Number(hours.toFixed(1))
    });
  }

  // Monthly Activity (Last 4 weeks)
  const monthlyData = [];
  for (let i = 3; i >= 0; i--) {
    const end = new Date(Date.now() - i * 7 * msInDay);
    const start = new Date(Date.now() - (i + 1) * 7 * msInDay);
    
    const weekEvents = events.filter(e => {
      const ed = new Date(e.timestamp);
      return ed >= start && ed <= end;
    });
    const hours = weekEvents.reduce((acc, e) => acc + (e.durationMs || 0), 0) / (1000 * 60 * 60);
    monthlyData.push({
      name: `Week ${4 - i}`,
      hours: Number(hours.toFixed(1))
    });
  }

  // Recently Watched (Unique by movieId)
  const recentlyWatchedMap = new Map();
  events.filter(e => e.eventType === 'watch').forEach(e => {
    if (!recentlyWatchedMap.has(e.movieId)) {
      recentlyWatchedMap.set(e.movieId, e);
    }
  });
  const recentlyWatched = Array.from(recentlyWatchedMap.values()).slice(0, 5);

  const COLORS = ['#E50914', '#FF5A5F', '#FF8A8E', '#FFB4B6', '#FFD2D3'];

  // Smart insights text
  const insightsList = [];
  if (totalWatchHours > 0) {
    insightsList.push(`You've unlocked the "${personality}" status.`);
    insightsList.push(`You watched ${totalWatchHours.toFixed(1)} hours of content.`);
    insightsList.push(`Your favorite genre is ${favoriteGenre}.`);
    insightsList.push(`Your current watch streak is ${streak} days.`);
  }

  if (loading) {
    return (
      <div className="pt-24 min-h-screen px-4 md:px-12 bg-[#050505] flex items-center justify-center">
        <div className="animate-pulse text-[#E50914]">Loading Insights...</div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="pt-24 min-h-screen px-4 md:px-12 bg-[#050505] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <MonitorPlay className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">No Data Yet</h2>
        <p className="text-gray-400 text-lg max-w-md mb-8">
          Start watching movies and TV shows to unlock your personal streaming insights.
        </p>
        <Link 
          to="/"
          className="bg-[#E50914] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#b8070f] transition-colors"
        >
          Explore Content
        </Link>
      </div>
    );
  }

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
              <img src={currentProfile.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border border-white/20 object-cover" />
              <span className="font-semibold text-white">{currentProfile.name}'s Stats</span>
            </div>
          )}
        </div>

        {/* Smart Insights Banner */}
        <div className="bg-gradient-to-r from-[#E50914]/20 to-indigo-900/20 border border-[#E50914]/30 rounded-3xl p-6 md:p-8 backdrop-blur-md">
           <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
             <MonitorPlay className="w-6 h-6 text-[#E50914]" /> Streaming Personality
           </h2>
           <p className="text-xl text-gray-200 leading-relaxed font-medium">
             {insightsList.join(' ')}
           </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
             icon={<Film className="w-6 h-6 text-[#E50914]" />} 
             label="Titles Watched" 
             value={uniqueTitles.toString()} 
          />
          <StatCard 
             icon={<TrendingUp className="w-6 h-6 text-green-500" />} 
             label="Favorite Genre" 
             value={favoriteGenre} 
          />
          <StatCard 
             icon={<Clock className="w-6 h-6 text-blue-500" />} 
             label="Total Watch Time" 
             value={`${totalWatchHours.toFixed(1)} Hrs`} 
          />
          <StatCard 
             icon={<Flame className="w-6 h-6 text-orange-500" />} 
             label="Viewing Streak" 
             value={`${streak} Days`} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
           <div className="lg:col-span-2 bg-[#141414] p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Activity Overview</h3>
                <div className="text-sm font-medium text-gray-400 bg-white/5 px-3 py-1 rounded-full">{mostWatchedCategory} Fan</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                <div className="w-full min-h-[250px]">
                  <p className="text-sm text-gray-400 mb-2 font-medium">Weekly (Hrs)</p>
                  <SafeChartWrapper>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weeklyData}>
                        <defs>
                          <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#E50914" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="#E50914" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} />
                        <YAxis stroke="#666" axisLine={false} tickLine={false} width={30} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                          itemStyle={{ color: '#E50914' }}
                        />
                        <Area type="monotone" dataKey="hours" stroke="#E50914" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </SafeChartWrapper>
                </div>
                <div className="w-full min-h-[250px]">
                  <p className="text-sm text-gray-400 mb-2 font-medium">Monthly (Hrs)</p>
                  <SafeChartWrapper>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} />
                        <YAxis stroke="#666" axisLine={false} tickLine={false} width={30} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar dataKey="hours" fill="#4B5563" radius={[4, 4, 0, 0]}>
                           {monthlyData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={index === monthlyData.length - 1 ? '#E50914' : '#4B5563'} />
                           ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </SafeChartWrapper>
                </div>
              </div>
           </div>

           <div className="bg-[#141414] p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col">
              <h3 className="text-xl font-bold text-white mb-6">Top Genres</h3>
              <div className="flex-1 w-full min-h-[300px]">
                <SafeChartWrapper>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={top5Genres} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#fff" width={80} axisLine={false} tickLine={false} />
                      <Tooltip 
                         contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                         itemStyle={{ color: '#E50914' }}
                         cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                        {top5Genres.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </SafeChartWrapper>
              </div>
           </div>
        </div>

        {/* Recently Watched Row */}
        {recentlyWatched.length > 0 && (
          <div className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-6">Recently Watched</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
               {recentlyWatched.map((event) => (
                  <Link 
                    key={event.id || event.movieId} 
                    to={`/movie/${event.type}/${event.movieId}`}
                    className="relative group block aspect-video rounded-xl overflow-hidden bg-[#141414] border border-white/10 hover:border-white/30 transition-all"
                  >
                    <img 
                       src={`https://image.tmdb.org/t/p/w500${event.moviePoster}`} 
                       alt={event.movieTitle} 
                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                       <h4 className="text-white font-medium text-sm line-clamp-1">{event.movieTitle}</h4>
                       <div className="w-full h-1 bg-gray-700/50 mt-2 rounded-full overflow-hidden">
                         <div className="h-full bg-[#E50914]" style={{ width: `${Math.min(event.progress * 100, 100)}%` }} />
                       </div>
                    </div>
                  </Link>
               ))}
            </div>
          </div>
        )}
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
      <h3 className="text-3xl font-black text-white truncate">{value}</h3>
    </div>
  );
}
