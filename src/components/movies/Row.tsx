import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { fetchTMDB, IMAGE_BASE_URL_W500 } from '@/lib/tmdb';
import type { Movie } from '@/types';
import { cn } from '@/lib/utils';
import { useListStore } from '@/store/useListStore';
import { useNavigate } from 'react-router-dom';
import { HoverTrailer } from './HoverTrailer';

interface RowProps {
  title: string;
  fetchUrl: string;
  isLargeRow?: boolean;
}

export function Row({ title, fetchUrl, isLargeRow = false }: RowProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isMoved, setIsMoved] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      setError(false);
      try {
        const request = await fetchTMDB(fetchUrl);
        if (isMounted) {
          if (request && request.results) {
             setMovies(request.results);
          } else {
             setError(true);
          }
        }
      } catch(err) {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => { isMounted = false; };
  }, [fetchUrl]);

  const handleClick = (direction: 'left' | 'right') => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth
        : scrollLeft + clientWidth;
        
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (error) {
    return (
      <div className="space-y-4 pt-6 px-4 md:px-12 group relative -mt-8 z-20 flex-grow pb-4">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-white/50">{title}</h2>
        <div className="w-full h-[150px] flex flex-col items-center justify-center border border-white/5 bg-[#141414] rounded-lg text-white/50 gap-2">
            <AlertCircle className="w-6 h-6" />
            <p className="text-sm">Failed to load content</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4 pt-6 px-4 md:px-12 group relative -mt-8 z-20 flex-grow pb-4 overflow-hidden">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-white/90">
            <div className="w-48 h-6 bg-white/10 animate-pulse rounded" />
        </h2>
        <div className="flex items-center space-x-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
             <div 
               key={i} 
               className={cn(
                 "bg-white/10 animate-pulse rounded-lg flex-shrink-0",
                 isLargeRow ? "w-[140px] md:w-[178px] lg:w-[220px] aspect-[2/3]" : "w-[140px] md:w-[178px] lg:w-[240px] aspect-video"
               )}
             />
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) return null;

  return (
    <div className="space-y-4 pt-6 px-4 md:px-12 group relative -mt-8 z-20 flex-grow pb-4">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-white/90 hover:text-white transition-colors cursor-pointer w-fit">
        {title}
        <span className="w-8 h-px bg-white/20 hidden md:inline-block"></span>
      </h2>
      
      <div className="relative">
        <ChevronLeft 
          className={cn(
            "absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 bg-black/50 rounded-full text-white/75 hover:text-white p-1",
            !isMoved && 'hidden'
          )}
          onClick={() => handleClick('left')} 
        />
        
        <div 
          ref={rowRef} 
          className="flex items-center space-x-4 overflow-x-scroll no-scrollbar py-4"
        >
          {movies.map((movie) => (
            ((isLargeRow && movie.poster_path) ||
            (!isLargeRow && movie.backdrop_path)) && (
              <HoverTrailer key={movie.id} movie={movie} isLargeRow={isLargeRow} />
            )
          ))}
        </div>
        
        <ChevronRight 
          className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 bg-black/50 rounded-full text-white/75 hover:text-white p-1"
          onClick={() => handleClick('right')} 
        />
      </div>
    </div>
  );
}
