import { create } from 'zustand';

interface CacheState {
  trailers: Record<string, string | null>;
  setTrailer: (key: string, videoId: string | null) => void;
}

export const useTrailerCache = create<CacheState>((set) => ({
  trailers: {},
  setTrailer: (key, videoId) => set((state) => ({
    trailers: { ...state.trailers, [key]: videoId }
  }))
}));
