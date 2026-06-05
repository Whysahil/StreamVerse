import { create } from 'zustand';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export interface Profile {
  id: string;
  name: string;
  avatarUrl: string;
  isKids: boolean;
}

interface ProfileStore {
  profiles: Profile[];
  currentProfile: Profile | null;
  addProfile: (userId: string, profile: Omit<Profile, 'id'>) => Promise<void>;
  updateProfile: (userId: string, id: string, profile: Partial<Omit<Profile, 'id'>>) => Promise<void>;
  deleteProfile: (userId: string, id: string) => Promise<void>;
  setCurrentProfile: (profile: Profile | null) => void;
  loadProfiles: (userId: string) => void;
  clearProfiles: () => void;
}

export const AVATAR_REGISTRY = [
  '/avatars/frog-thinking.svg',
  '/avatars/frog-smoking.svg',
  '/avatars/frog-pink.svg',
  '/avatars/frog-orange.svg',
  '/avatars/goose-yellow.svg',
  '/avatars/goose-blue.svg',
  '/avatars/monkey-smoking.svg',
  '/avatars/monkey-king.svg',
  '/avatars/discord-red.svg',
  '/avatars/lal-guru.svg'
];

let unsubscribeProfiles: (() => void) | null = null;

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profiles: [],
  currentProfile: null,
  
  loadProfiles: (userId: string) => {
    if (unsubscribeProfiles) {
      unsubscribeProfiles();
    }
    
    if (!db) return;
    
    const docRef = doc(db, 'users', userId);
    unsubscribeProfiles = onSnapshot(docRef, (docSnap) => {
      const data = docSnap.exists() ? docSnap.data() : null;
      if (data && data.profiles && data.profiles.length > 0) {
        const loadedProfiles = data.profiles.map((p: Profile) => {
          // Automatic migration of old stock images or .png to new SVG registry
          if (!AVATAR_REGISTRY.includes(p.avatarUrl)) {
            const fileName = p.avatarUrl.split('/').pop()?.replace(/\.[^/.]+$/, "");
            const match = fileName ? AVATAR_REGISTRY.find(url => url.includes(fileName)) : null;
            return { ...p, avatarUrl: match || AVATAR_REGISTRY[0] };
          }
          return p;
        });
        set({ profiles: loadedProfiles });
        
        // Update current profile if it exists in the new list, or clear if deleted
        const state = get();
        if (state.currentProfile) {
          const updatedCurrent = loadedProfiles.find((p: Profile) => p.id === state.currentProfile!.id);
          if (updatedCurrent) {
            set({ currentProfile: updatedCurrent });
          } else {
            set({ currentProfile: null });
          }
        }
      } else {
        // Init default profile if empty
        const defaultProfile: Profile = {
          id: Math.random().toString(36).substr(2, 9),
          name: 'Player 1',
          avatarUrl: AVATAR_REGISTRY[0],
          isKids: false,
        };
        setDoc(docRef, { profiles: [defaultProfile] }, { merge: true });
      }
    });
  },
  
  clearProfiles: () => {
    if (unsubscribeProfiles) {
      unsubscribeProfiles();
      unsubscribeProfiles = null;
    }
    set({ profiles: [], currentProfile: null });
  },

  addProfile: async (userId, profile) => {
    if (!db) {
      console.error("Firestore db not initialized");
      throw new Error("Database not initialized");
    }
    const newProfile = { ...profile, id: Math.random().toString(36).substr(2, 9) };
    const newProfiles = [...get().profiles, newProfile];
    console.log("Saving new profile to firestore...");
    try {
      await setDoc(doc(db, 'users', userId), { profiles: newProfiles }, { merge: true });
      console.log("Firestore write resolved success");
    } catch (e) {
      console.error("Firestore write failed:", e);
      throw e;
    }
  },

  updateProfile: async (userId, id, updatedProfile) => {
    if (!db) {
      console.error("Firestore db not initialized");
      throw new Error("Database not initialized");
    }
    const newProfiles = get().profiles.map(p => p.id === id ? { ...p, ...updatedProfile } : p);
    console.log("Updating profile in firestore...");
    try {
      await setDoc(doc(db, 'users', userId), { profiles: newProfiles }, { merge: true });
      console.log("Firestore write resolved success");
    } catch (e) {
      console.error("Firestore write failed:", e);
      throw e;
    }
  },

  deleteProfile: async (userId, id) => {
    if (!db) return;
    const newProfiles = get().profiles.filter(p => p.id !== id);
    await setDoc(doc(db, 'users', userId), { profiles: newProfiles }, { merge: true });
  },

  setCurrentProfile: (profile) => {
    set({ currentProfile: profile });
    if (profile) {
      localStorage.setItem('verse_last_profile_id', profile.id);
    } else {
      localStorage.removeItem('verse_last_profile_id');
    }
  },
}));
