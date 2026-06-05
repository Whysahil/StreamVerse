import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchTMDB, requests } from '@/lib/tmdb';
import type { Movie } from '@/types';
import { Loader2, Search as SearchIcon, Clock, TrendingUp, X } from 'lucide-react';
import { HoverTrailer } from '@/components/movies/HoverTrailer';
import { trackActivityEvent } from '@/lib/tracking';

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 500);
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Movie[]>([]);
  const [people, setPeople] = useState<any[]>([]);
  
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('verse_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
    
    // Load recommended
    async function loadRecommended() {
      const data = await fetchTMDB(requests.fetchTrending);
      if (data?.results) setRecommended(data.results.slice(0, 10));
    }
    loadRecommended();
  }, []);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('verse_recent_searches', JSON.stringify(updated));
  };

  const removeRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(t => t !== term);
    setRecentSearches(updated);
    localStorage.setItem('verse_recent_searches', JSON.stringify(updated));
  };

  useEffect(() => {
    if (query !== initialQuery) {
      if (query) {
        setSearchParams({ q: query }, { replace: true });
      } else {
        setSearchParams({}, { replace: true });
      }
    }
  }, [query, setSearchParams, initialQuery]);

  useEffect(() => {
    async function performSearch() {
      if (!debouncedQuery) {
        setMovies([]);
        setSeries([]);
        setPeople([]);
        return;
      }
      setLoading(true);
      const data = await fetchTMDB(requests.searchMovies(debouncedQuery));
      if (data?.results) {
        setMovies(data.results.filter((item: any) => item.media_type === 'movie' && (item.poster_path || item.backdrop_path)));
        setSeries(data.results.filter((item: any) => item.media_type === 'tv' && (item.poster_path || item.backdrop_path)));
        setPeople(data.results.filter((item: any) => item.media_type === 'person' && item.profile_path));
      } else {
        setMovies([]);
        setSeries([]);
        setPeople([]);
      }
      setLoading(false);
      
      // Save to recent if it's a substantive search
      if (debouncedQuery.length > 2) {
        saveRecentSearch(debouncedQuery);
        trackActivityEvent('search', null, 0, 0, debouncedQuery);
      }
    }
    
    performSearch();
    window.scrollTo(0, 0);
  }, [debouncedQuery]);

  return (
    <div className="pt-24 min-h-[70vh] px-4 md:px-12 bg-[#050505]">
      
      <div className="relative max-w-2xl mx-auto mb-12">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-4 w-6 h-6 text-gray-400" />
          <input
            type="text"
            placeholder="Search for movies, series, or people..."
            className="w-full bg-[#141414] border border-white/20 text-white text-lg rounded-full py-4 pl-14 pr-12 outline-none focus:border-white/50 focus:bg-[#202020] transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 p-1 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      
      {!query ? (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {recentSearches.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <Clock className="w-5 h-5 text-gray-400" /> Recent Searches
              </h3>
              <div className="flex flex-col gap-2">
                {recentSearches.map((term) => (
                  <div key={term} className="flex items-center justify-between group p-2 hover:bg-[#141414] rounded-md cursor-pointer transition" onClick={() => setQuery(term)}>
                    <span className="text-gray-300 font-medium">{term}</span>
                    <button onClick={(e) => removeRecentSearch(term, e)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-white transition">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className={recentSearches.length === 0 ? "col-span-full" : "col-span-1"}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5 text-[#E50914]" /> Trending Searches
            </h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {['Avatar', 'Inception', 'Breaking Bad', 'Marvel', 'Stranger Things'].map((term) => (
                <button 
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-4 py-2 rounded-full bg-[#141414] border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition-all font-medium text-sm"
                >
                  {term}
                </button>
              ))}
            </div>

            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <SearchIcon className="w-5 h-5 text-purple-500" /> Browse by Genre
            </h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {['Action', 'Comedy', 'Sci-Fi', 'Romance', 'Thriller', 'Horror', 'Documentary'].map((genre) => (
                <button 
                  key={genre}
                  onClick={() => setQuery(genre)}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all font-medium text-sm"
                >
                  {genre}
                </button>
              ))}
            </div>

            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white mt-10 border-b border-white/10 pb-2">
              Recommended For You
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recommended.map((movie) => (
                <HoverTrailer key={movie.id} movie={movie} isLargeRow inGrid />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto pb-20">
          {loading ? (
            <div className="flex justify-center mt-20">
              <Loader2 className="w-10 h-10 animate-spin text-[#E50914]" />
            </div>
          ) : movies.length === 0 && series.length === 0 && people.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-gray-500 mt-20 text-center px-4 animate-in fade-in">
              <p className="text-xl mb-2 text-white font-medium">No results found for "{query}"</p>
              <p className="text-sm">Suggestions:</p>
              <ul className="text-sm mt-2 list-disc list-inside">
                <li>Try checking your spelling</li>
                <li>Try using fewer keywords</li>
                <li>Try using more general keywords</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in duration-500">
              {movies.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-2">Movies</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {movies.map((movie) => (
                      <HoverTrailer key={movie.id} movie={movie} isLargeRow inGrid />
                    ))}
                  </div>
                </div>
              )}
              
              {series.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-2">Series</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {series.map((show) => (
                      <HoverTrailer key={show.id} movie={show} isLargeRow inGrid />
                    ))}
                  </div>
                </div>
              )}
              
              {people.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-2">People</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {people.map((person) => (
                      <div key={person.id} className="flex flex-col items-center group cursor-pointer">
                        <div className="w-full aspect-square rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-white transition-all transform group-hover:scale-105">
                          <img 
                            src={`https://image.tmdb.org/t/p/w200${person.profile_path}`} 
                            alt={person.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-center font-medium text-white group-hover:text-[#E50914] transition-colors">{person.name}</span>
                        <span className="text-xs text-gray-500 text-center line-clamp-1">{person.known_for_department}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
