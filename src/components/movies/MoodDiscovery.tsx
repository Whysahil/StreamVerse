import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HoverTrailer } from '@/components/movies/HoverTrailer';
import { fetchTMDB, requests } from '@/lib/tmdb';
import type { Movie } from '@/types';
import { Loader2 } from 'lucide-react';

const MOODS = [
  { id: 'fun', emoji: '🎉', label: 'Fun & Light', genreId: 35, color: 'from-yellow-400 to-orange-500' },
  { id: 'emotional', emoji: '😢', label: 'Emotional', genreId: 18, color: 'from-blue-400 to-indigo-600' },
  { id: 'thriller', emoji: '😨', label: 'Edge of Seat', genreId: 53, color: 'from-red-500 to-red-900' },
  { id: 'romantic', emoji: '❤️', label: 'Romantic', genreId: 10749, color: 'from-pink-400 to-rose-600' },
  { id: 'scifi', emoji: '🚀', label: 'Mind-Bending', genreId: 878, color: 'from-cyan-400 to-blue-600' },
  { id: 'motivation', emoji: '💪', label: 'Inspiring', genreId: 99, color: 'from-green-400 to-emerald-600' },
];

export function MoodDiscovery() {
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[0] | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchMoodMovies() {
      if (!selectedMood) return;
      setLoading(true);
      try {
        const data = await fetchTMDB(`/discover/movie?with_genres=${selectedMood.genreId}&sort_by=popularity.desc`);
        if (data?.results) {
          setMovies(data.results.slice(0, 10)); // Top 10 for the mood
        }
      } catch (err) {
        console.error("Failed to fetch mood movies", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMoodMovies();
  }, [selectedMood]);

  return (
    <div className="space-y-6 py-10 px-4 md:px-12 group relative z-20 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black mb-2 text-white tracking-tight drop-shadow-md">
            What are you feeling today?
          </h2>
          <p className="text-gray-400 text-sm md:text-base">Let Verse find the perfect match for your mood.</p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar">
        {MOODS.map((mood) => {
          const isSelected = selectedMood?.id === mood.id;
          return (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(isSelected ? null : mood)}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-full font-bold transition-all duration-300 ${
                isSelected 
                  ? `bg-gradient-to-r ${mood.color} text-white shadow-lg scale-105` 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <span className="text-xl">{mood.emoji}</span>
              <span>{mood.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {selectedMood && (
          <motion.div
            key={selectedMood.id}
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="pt-4"
          >
            <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 backdrop-blur-sm relative overflow-hidden">
               {/* Background glow based on mood */}
               <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${selectedMood.color} opacity-10 blur-3xl rounded-full`} />
               
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                 {selectedMood.emoji} Perfect for feeling {selectedMood.label.toLowerCase()}
               </h3>
               
               {loading ? (
                 <div className="flex justify-center items-center h-40">
                   <Loader2 className="w-8 h-8 text-white animate-spin opacity-50" />
                 </div>
               ) : (
                 <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar relative z-10">
                    {movies.map((movie) => (
                      <div key={movie.id} className="min-w-[42vw] md:min-w-[26vw] lg:min-w-[16vw] xl:min-w-[14vw]">
                         <HoverTrailer movie={movie} isLargeRow={false} />
                      </div>
                    ))}
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
