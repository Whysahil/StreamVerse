import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useWatchStore } from '@/store/useWatchStore';
import { useProfileStore } from '@/store/useProfileStore';
import { cn } from '@/lib/utils';
import { HoverTrailer } from './HoverTrailer';

export function ContinueWatchingRow() {
  const { currentProfile } = useProfileStore();
  const { getHistoryForProfile } = useWatchStore();
  
  const history = currentProfile ? getHistoryForProfile(currentProfile.id) : [];
  const [isMoved, setIsMoved] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  if (!history || history.length === 0) return null;

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

  return (
    <div className="space-y-4 pt-6 px-4 md:px-12 group relative -mt-8 z-20 flex-grow pb-4">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-white/90 hover:text-white transition-colors cursor-pointer w-fit">
        Continue Watching for {currentProfile?.name}
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
          {history.map((item) => (
             <div key={item.movieId} className="relative flex-shrink-0 flex flex-col">
               <HoverTrailer movie={item.movie} isLargeRow={false} />
               <div className="w-full absolute bottom-0 left-0 h-1 bg-gray-700 z-40 rounded-sm overflow-hidden">
                 <div 
                   className="h-full bg-[#E50914]" 
                   style={{ width: `${item.progress * 100}%` }}
                 />
               </div>
             </div>
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
