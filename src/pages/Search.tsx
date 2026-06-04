import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchTMDB, requests } from '@/lib/tmdb';
import type { Movie } from '@/types';
import { Loader2 } from 'lucide-react';
import { HoverTrailer } from '@/components/movies/HoverTrailer';

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function performSearch() {
      if (!query) {
        setMovies([]);
        return;
      }
      setLoading(true);
      const data = await fetchTMDB(requests.searchMovies(query));
      if (data?.results) {
        // Filter out people or items without posters
        const filtered = data.results.filter(
          (item: any) => (item.media_type === 'movie' || item.media_type === 'tv') && (item.poster_path || item.backdrop_path)
        );
        setMovies(filtered);
      } else {
        setMovies([]);
      }
      setLoading(false);
    }
    
    performSearch();
    window.scrollTo(0, 0);
  }, [query]);

  if (!query) {
    return (
      <div className="pt-32 px-12 text-center text-gray-400">
        <h2 className="text-2xl">Enter a search term...</h2>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-[70vh] px-4 md:px-12">
      <h1 className="text-xl md:text-2xl font-semibold mb-8 text-gray-400">
        Search results for "{query}"
      </h1>
      
      {loading ? (
        <div className="flex justify-center mt-20">
          <Loader2 className="w-8 h-8 animate-spin text-netflix" />
        </div>
      ) : movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-20 text-center px-4">
          <p className="text-xl mb-2">Your search for "{query}" did not have any matches.</p>
          <p className="text-sm">Suggestions:</p>
          <ul className="text-sm mt-2 list-disc list-inside">
            <li>Try different keywords</li>
            <li>Looking for a movie or TV show?</li>
            <li>Try using a movie, TV show title, an actor or director</li>
          </ul>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-20">
          {movies.map((movie) => (
             <HoverTrailer key={movie.id} movie={movie} isLargeRow inGrid />
          ))}
        </div>
      )}
    </div>
  );
}
