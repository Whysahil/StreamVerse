import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Profile {
  id: string;
  name: string;
  avatarUrl: string;
  isKids: boolean;
}

interface ProfileStore {
  profiles: Profile[];
  currentProfile: Profile | null;
  addProfile: (profile: Omit<Profile, 'id'>) => void;
  updateProfile: (id: string, profile: Partial<Omit<Profile, 'id'>>) => void;
  deleteProfile: (id: string) => void;
  setCurrentProfile: (profile: Profile | null) => void;
}

export const DEFAULT_AVATARS = [
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Ape&backgroundColor=ffdfbf', // Ape
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Duck&backgroundColor=c0aede', // Duck
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Frog&backgroundColor=b6e3f4', // Frog/Pepe
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Cloud&backgroundColor=d1d4f9', // Cloud
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=King&backgroundColor=ffd5dc', // King
];

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profiles: [
        {
          id: '1',
          name: 'Player 1',
          avatarUrl: DEFAULT_AVATARS[0],
          isKids: false,
        },
      ],
      currentProfile: null,
      addProfile: (profile) =>
        set((state) => ({
          profiles: [
            ...state.profiles,
            { ...profile, id: Math.random().toString(36).substr(2, 9) },
          ],
        })),
      updateProfile: (id, updatedProfile) =>
        set((state) => ({
          profiles: state.profiles.map((p) => (p.id === id ? { ...p, ...updatedProfile } : p)),
          currentProfile:
            state.currentProfile?.id === id
              ? { ...state.currentProfile, ...updatedProfile }
              : state.currentProfile,
        })),
      deleteProfile: (id) =>
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== id),
          currentProfile: state.currentProfile?.id === id ? null : state.currentProfile,
        })),
      setCurrentProfile: (profile) => set({ currentProfile: profile }),
    }),
    {
      name: 'profile-storage',
    }
  )
);
