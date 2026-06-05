import { db } from '@/lib/firebase';
import { doc, setDoc, collection, addDoc, query, getDocs, orderBy } from 'firebase/firestore';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import type { Movie } from '@/types';

export interface WatchEvent {
  id?: string;
  movieId: number;
  movieTitle: string;
  moviePoster: string;
  genres: number[];
  type: 'movie' | 'tv';
  progress: number;
  durationMs: number; // actual time spent watching in this session
  timestamp: number; // when it happened
  eventType: 'watch' | 'click' | 'list_add' | 'search';
}

export const trackActivityEvent = async (
  eventType: 'watch' | 'click' | 'list_add' | 'search',
  movie?: Movie | null,
  progress: number = 0, 
  durationMs: number = 0,
  queryStr?: string
) => {
  const user = useAuthStore.getState().user;
  const profile = useProfileStore.getState().currentProfile;
  
  if (!navigator.onLine || !db || !user || !profile) return;
  
  try {
    const event: any = {
      eventType,
      timestamp: Date.now()
    };

    if (movie) {
      event.movieId = movie.id;
      event.movieTitle = movie.title || movie.name || 'Unknown';
      event.moviePoster = movie.poster_path || movie.backdrop_path || '';
      event.genres = movie.genre_ids || [];
      event.type = movie.media_type === 'tv' ? 'tv' : 'movie';
      event.progress = progress;
      event.durationMs = durationMs;
    }

    if (queryStr) {
       event.queryStr = queryStr;
    }
    
    await addDoc(collection(db, 'users', user.uid, 'profiles', profile.id, 'activityEvents'), event);
    
    // Update the last watched state as well (for continue watching)
    if (movie && eventType === 'watch') {
      await setDoc(doc(db, 'users', user.uid, 'profiles', profile.id, 'progress', String(movie.id)), {
        movie,
        progress,
        timestamp: Date.now()
      }, { merge: true });
    }
    
  } catch (error) {
    console.error("Failed to track activity event", error);
  }
};

// Aliases for backward compatibility in components
export const trackWatchEvent = (movie: Movie, progress: number, durationMs: number = 0) => 
  trackActivityEvent('watch', movie, progress, durationMs);

export const fetchWatchEvents = async (profileId: string): Promise<WatchEvent[]> => {
  const user = useAuthStore.getState().user;
  if (!db || !user || !profileId) return [];
  
  try {
    const q = query(
      collection(db, 'users', user.uid, 'profiles', profileId, 'activityEvents'),
      orderBy('timestamp', 'desc')
    );
    const snap = await getDocs(q);
    
    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as WatchEvent[];
  } catch (error) {
    console.error("Failed to fetch activity events", error);
    return [];
  }
};

export const fetchWatchProgress = async (profileId: string) => {
  const user = useAuthStore.getState().user;
  if (!db || !user || !profileId) return [];
  
  try {
    const q = query(
      collection(db, 'users', user.uid, 'profiles', profileId, 'progress'),
      orderBy('timestamp', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Failed to fetch watch progress", error);
    return [];
  }
};
