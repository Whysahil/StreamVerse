import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Movie } from '@/types';

interface ListState {
  myList: Movie[];
  addToList: (movie: Movie) => void;
  removeFromList: (id: number) => void;
  isInList: (id: number) => boolean;
}

// In a real app we would sync this with Firestore, 
// using local storage via zustand/persist for immediate portfolio demo value
// preventing the need for deep Firestore rules setup.
export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      myList: [],
      addToList: (movie) => {
        const list = get().myList;
        if (!list.find((m) => m.id === movie.id)) {
          set({ myList: [...list, movie] });
        }
      },
      removeFromList: (id) => {
        set({ myList: get().myList.filter((m) => m.id !== id) });
      },
      isInList: (id) => {
        return !!get().myList.find((m) => m.id === id);
      },
    }),
    {
      name: 'netflix-my-list',
    }
  )
);
