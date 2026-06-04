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
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1557683316-973673baf926?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&h=200&fit=crop'
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
