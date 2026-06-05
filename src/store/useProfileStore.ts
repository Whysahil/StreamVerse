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
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&h=400&fit=crop',
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
      if (docSnap.exists() && docSnap.data().profiles) {
        const loadedProfiles = docSnap.data().profiles;
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
    if (!db) return;
    const newProfile = { ...profile, id: Math.random().toString(36).substr(2, 9) };
    const newProfiles = [...get().profiles, newProfile];
    await setDoc(doc(db, 'users', userId), { profiles: newProfiles }, { merge: true });
  },

  updateProfile: async (userId, id, updatedProfile) => {
    if (!db) return;
    const newProfiles = get().profiles.map(p => p.id === id ? { ...p, ...updatedProfile } : p);
    await setDoc(doc(db, 'users', userId), { profiles: newProfiles }, { merge: true });
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
