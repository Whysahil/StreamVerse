import { useEffect, useState } from 'react';
import { useListStore } from '@/store/useListStore';
import { useNavigate } from 'react-router-dom';
import { HoverTrailer } from '@/components/movies/HoverTrailer';
import { Film, Tv, Clock, BookmarkPlus } from 'lucide-react';

export function MyList() {
  const { myList } = useListStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'series'>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const movies = myList.filter(item => item.media_type === 'movie' || !item.media_type || item.title);
  const series = myList.filter(item => item.media_type === 'tv' || item.name);
  
  // Assuming the list appends to the end, the last ones are the most recent.
  const recentlySaved = [...myList].reverse().slice(0, 10);

  const displayList = activeTab === 'all' ? myList : activeTab === 'movies' ? movies : series;

  return (
    <div className="pt-24 min-h-screen px-4 md:px-12 bg-[#050505]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
          <BookmarkPlus className="w-8 h-8 text-[#E50914]" />
          My List
        </h1>
        
        {myList.length > 0 && (
          <div className="flex bg-[#141414] p-1 rounded-md border border-white/10 w-fit">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
            >
              All ({myList.length})
            </button>
            <button 
              onClick={() => setActiveTab('movies')}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'movies' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
            >
              <Film className="w-4 h-4" /> Movies ({movies.length})
            </button>
            <button 
              onClick={() => setActiveTab('series')}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'series' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
            >
              <Tv className="w-4 h-4" /> Series ({series.length})
            </button>
          </div>
        )}
      </div>
      
      {myList.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-32 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center">
            <BookmarkPlus className="w-12 h-12 text-[#E50914]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your list is empty</h2>
          <p className="text-lg mb-8 max-w-md text-center">Save shows and movies to keep track of what you want to watch.</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 bg-[#E50914] text-white px-8 py-3 rounded font-bold hover:bg-[#E50914]/90 transition transform hover:scale-105 shadow-lg shadow-red-900/20"
          >
            Find Something to Watch
          </button>
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in duration-500 pb-20">
          {activeTab === 'all' && recentlySaved.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white border-b border-white/10 pb-2">
                <Clock className="w-5 h-5 text-gray-400" /> Recently Added
              </h2>
              <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
                {recentlySaved.map((movie) => (
                  <div key={movie.id} className="min-w-[200px]">
                    <HoverTrailer movie={movie} isLargeRow={false} />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h2 className="text-xl font-bold mb-4 text-white border-b border-white/10 pb-2">
              {activeTab === 'all' ? 'Everything' : activeTab === 'movies' ? 'Saved Movies' : 'Saved Series'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {displayList.map((movie) => (
                <HoverTrailer key={movie.id} movie={movie} isLargeRow inGrid />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
