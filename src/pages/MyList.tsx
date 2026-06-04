import { useEffect } from 'react';
import { useListStore } from '@/store/useListStore';
import { useNavigate } from 'react-router-dom';
import { HoverTrailer } from '@/components/movies/HoverTrailer';

export function MyList() {
  const { myList } = useListStore();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 min-h-[70vh] px-4 md:px-12">
      <h1 className="text-2xl md:text-3xl font-semibold mb-8 text-white">My List</h1>
      
      {myList.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-20">
          <p className="text-xl">You haven't added any titles to your list yet.</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 bg-white text-black px-6 py-2 rounded font-semibold hover:bg-white/80 transition"
          >
            Find something to watch
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {myList.map((movie) => (
            <HoverTrailer key={movie.id} movie={movie} isLargeRow inGrid />
          ))}
        </div>
      )}
    </div>
  );
}
