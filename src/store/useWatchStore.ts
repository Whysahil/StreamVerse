import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Movie } from '@/types';

interface WatchProgress {
  movieId: number;
  movie: Movie;
  progress: number; // 0 to 1
  timestamp: number;
}

interface WatchStore {
  history: Record<string, WatchProgress[]>; // profileId -> WatchProgress[]
  addToHistory: (profileId: string, movie: Movie, progress?: number) => void;
  getHistoryForProfile: (profileId: string) => WatchProgress[];
}

export const useWatchStore = create<WatchStore>()(
  persist(
    (set, get) => ({
      history: {},
      addToHistory: (profileId, movie, progress = 0.5) => {
        set((state) => {
          const profileHistory = state.history[profileId] || [];
          
          // Remove if exists to push to front
          const filtered = profileHistory.filter((item) => item.movieId !== movie.id);
          
          return {
            history: {
              ...state.history,
              [profileId]: [
                {
                  movieId: movie.id,
                  movie,
                  progress,
                  timestamp: Date.now(),
                },
                ...filtered,
              ].slice(0, 20), // keep last 20
            },
          };
        });
      },
      getHistoryForProfile: (profileId) => {
        return get().history[profileId] || [];
      },
    }),
    {
      name: 'watch-history-storage',
    }
  )
);
