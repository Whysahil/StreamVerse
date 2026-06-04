import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Plus, Check, ArrowLeft } from 'lucide-react';
import { fetchTMDB, requests, IMAGE_BASE_URL } from '@/lib/tmdb';
import { useListStore } from '@/store/useListStore';
import type { Movie } from '@/types';
import { Loader2 } from 'lucide-react';

export function MovieDetails() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const { addToList, removeFromList, isInList } = useListStore();
  
  useEffect(() => {
    async function fetchData() {
      if (!type || !id) return;
      setLoading(true);
      const data = await fetchTMDB(requests.fetchMovieDetails(type, id));
      if (data) {
        setMovie({ ...data, media_type: type as 'movie' | 'tv' });
      }
      setLoading(false);
      window.scrollTo(0, 0);
    }
    fetchData();
  }, [type, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#E50914]" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen pt-24 px-12 text-white bg-[#050505]">
        <h2>Content not found.</h2>
        <button onClick={() => navigate('/')} className="mt-4 bg-[#E50914] px-4 py-2 rounded">Go Home</button>
      </div>
    );
  }

  const isSaved = isInList(movie.id);

  const toggleList = () => {
    if (isSaved) {
      removeFromList(movie.id);
    } else {
      addToList(movie);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505]">
      <div className="hero-glow z-10" />
      <div 
        className="relative h-[60vh] md:h-[85vh] w-full"
      >
        {/* Background Image wrapper */}
        <div 
          className="absolute inset-0 overflow-hidden bg-[#121212]"
          style={{
            backgroundImage: `url("${IMAGE_BASE_URL}${movie?.backdrop_path || movie?.poster_path}")`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
          <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-gradient-to-br from-indigo-900 via-black to-red-900" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="absolute inset-0 cinematic-gradient-bottom z-0" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-24 left-4 md:left-12 z-50 p-2 rounded-full glass hover:bg-white/10 text-white transition-all shadow-lg"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="absolute bottom-[2%] md:bottom-[10%] left-4 md:left-12 pr-4 md:pr-0 w-full md:w-auto max-w-[90%] md:max-w-3xl z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 drop-shadow-md tracking-tighter leading-tight text-white line-clamp-2 md:line-clamp-none">
            {movie?.title || movie?.name || movie?.original_name}
          </h1>
          
          <div className="flex items-center gap-4 text-xs md:text-sm font-semibold mb-6 drop-shadow text-gray-400">
            <span className="px-2 py-0.5 bg-[#E50914] text-[10px] font-bold rounded-sm tracking-widest uppercase text-white">MATCH {Math.round(movie.vote_average * 10)}%</span>
            <span>{movie.release_date ? movie.release_date.substring(0,4) : movie.first_air_date?.substring(0,4)}</span>
            {movie.media_type === 'tv' && <span>TV SERIES</span>}
          </div>

          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => navigate(`/play/${movie.media_type}/${movie.id}`)}
              className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-md font-bold text-lg hover:bg-white/90 transition shadow-lg"
            >
              <Play className="w-6 h-6 fill-black" /> Play
            </button>
            <button 
              onClick={toggleList}
              className="flex items-center justify-center p-3 md:p-3.5 border border-white/20 glass text-white rounded-full hover:bg-white/10 transition shadow-lg"
              title={isSaved ? "Remove from My List" : "Add to My List"}
            >
              {isSaved ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
            </button>
          </div>
          
          <p className="max-w-xl text-sm md:text-lg text-gray-300 leading-relaxed font-medium">
            {movie.overview}
          </p>
        </div>
      </div>
    </div>
  );
}
