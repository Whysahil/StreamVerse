import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import type { Movie } from '@/types';

interface ListState {
  myList: Movie[];
  setList: (movies: Movie[]) => void;
  addToList: (movie: Movie) => void;
  removeFromList: (id: number) => void;
  isInList: (id: number) => boolean;
  syncFromFirebase: () => Promise<void>;
}

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      myList: [],
      setList: (movies) => set({ myList: movies }),
      addToList: async (movie) => {
        const list = get().myList;
        if (!list.find((m) => m.id === movie.id)) {
          const newList = [...list, movie];
          set({ myList: newList });
          
          if (!navigator.onLine) return; // Skip if offline
          
          const user = useAuthStore.getState().user;
          const profile = useProfileStore.getState().currentProfile;
          if (db && user && profile) {
            try {
              await setDoc(doc(db, 'users', user.uid, 'profiles', profile.id, 'lists', 'myList'), { movies: newList });
            } catch (e: any) {
              if (e?.code !== 'unavailable' && e?.code !== 'permission-denied' && !e?.message?.includes('offline')) {
                console.error("Failed to sync add to list to Firebase", e);
              }
            }
          }
        }
      },
      removeFromList: async (id) => {
        const newList = get().myList.filter((m) => m.id !== id);
        set({ myList: newList });
        
        if (!navigator.onLine) return; // Skip if offline
        
        const user = useAuthStore.getState().user;
        const profile = useProfileStore.getState().currentProfile;
        if (db && user && profile) {
          try {
            await setDoc(doc(db, 'users', user.uid, 'profiles', profile.id, 'lists', 'myList'), { movies: newList });
          } catch (e: any) {
             if (e?.code !== 'unavailable' && e?.code !== 'permission-denied' && !e?.message?.includes('offline')) {
               console.error("Failed to sync remove from list to Firebase", e);
             }
          }
        }
      },
      isInList: (id) => {
        return !!get().myList.find((m) => m.id === id);
      },
      syncFromFirebase: async () => {
        const user = useAuthStore.getState().user;
        const profile = useProfileStore.getState().currentProfile;
        
        // Skip if offline or not configured
        if (!navigator.onLine || !db || !user || !profile) return;
        
        try {
          const docRef = doc(db, 'users', user.uid, 'profiles', profile.id, 'lists', 'myList');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().movies) {
            set({ myList: docSnap.data().movies });
          } else {
            set({ myList: [] }); // Start fresh if no list exists for this profile on Firebase
          }
        } catch (e: any) {
          // Ignore offline and missing permission errors for a graceful fallback
          if (e?.code !== 'unavailable' && e?.code !== 'permission-denied' && !e?.message?.includes('offline')) {
            console.error("Failed to fetch list from Firebase", e);
          }
        }
      }
    }),
    {
      name: 'verse-my-list',
    }
  )
);
