import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, AlertCircle } from 'lucide-react';
import { fetchTMDB, requests, IMAGE_BASE_URL } from '@/lib/tmdb';
import type { Movie } from '@/types';

export function Hero() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      setError(false);
      try {
        const request = await fetchTMDB(requests.fetchNetflixOriginals);
        if (isMounted) {
          if (request && request.results && request.results.length > 0) {
            setMovie(request.results[Math.floor(Math.random() * request.results.length)]);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => { isMounted = false; };
  }, []);

  function truncate(str: string | undefined, n: number) {
    return str?.length! > n ? str?.substring(0, n - 1) + "..." : str;
  }

  if (loading) {
    return (
      <div className="h-[75vh] w-full bg-[#141414] animate-pulse flex flex-col justify-end px-4 md:px-12 pb-24 md:pb-32 gap-4">
        <div className="w-32 h-6 bg-white/10 rounded" />
        <div className="w-2/3 h-16 bg-white/10 rounded" />
        <div className="w-1/2 h-24 bg-white/10 rounded" />
        <div className="flex gap-4">
          <div className="w-32 h-12 bg-white/10 rounded" />
          <div className="w-40 h-12 bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="h-[75vh] w-full bg-[#141414] flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-2xl font-bold text-white">Oops, something went wrong</h2>
        <p className="text-gray-400 max-w-md">
          Unable to load featured content. Please check your network connection or verify your TMDB API Key settings.
        </p>
      </div>
    );
  }

  const handlePlayClick = () => {
    navigate(`/play/tv/${movie.id}`);
  };

  const handleMoreInfoClick = () => {
    navigate(`/movie/tv/${movie.id}`);
  };

  return (
    <header className="relative h-[85vh] w-full flex-shrink-0">
      <div className="hero-glow z-10" />
      
      <div 
        className="absolute inset-0 overflow-hidden bg-[#121212]"
        style={{
          backgroundImage: `url("${IMAGE_BASE_URL}${movie?.backdrop_path || movie?.poster_path}")`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-gradient-to-br from-indigo-900 via-black to-red-900" />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      <div className="absolute inset-0 netflix-gradient-bottom z-0" />

      <div className="relative z-10 h-full flex flex-col justify-end px-4 md:px-12 pb-24 md:pb-32">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 bg-[#E50914] text-[10px] font-bold rounded-sm tracking-widest uppercase text-white">Featured</span>
          <span className="text-xs font-semibold text-gray-400">
            {movie?.vote_average ? `IMDB ${movie.vote_average.toFixed(1)}` : 'NEW'}
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tighter leading-tight text-white drop-shadow-md max-w-3xl">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        
        <p className="max-w-xl text-sm md:text-lg text-gray-300 mb-8 leading-relaxed font-medium">
          {truncate(movie?.overview, 150)}
        </p>
        
        <div className="flex gap-4">
          <button 
            onClick={handlePlayClick}
            className="flex items-center gap-2 px-6 md:px-8 py-2 md:py-3 bg-white text-black font-bold rounded-md hover:bg-white/90 transition-all shadow-lg"
          >
            <Play className="w-5 h-5 md:w-6 md:h-6 fill-black" />
            Play
          </button>
          <button 
            onClick={handleMoreInfoClick}
            className="flex items-center gap-2 px-6 md:px-8 py-2 md:py-3 glass text-white font-bold rounded-md hover:bg-white/10 transition-all shadow-lg"
          >
            <Info className="w-5 h-5 md:w-6 md:h-6 text-white" />
            More Info
          </button>
        </div>
      </div>
    </header>
  );
}
