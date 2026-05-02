import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '@/src/lib/firebase';

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: 'student' | 'senior' | 'alumni' | 'faculty' | 'moderator' | 'admin';
  caLevel: string;
  profilePhotoUrl?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  accountStatus: 'active' | 'suspended' | 'warned';
}

interface AuthState {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  fetchProfile: (uid: string) => Promise<void>;
  syncProfile: (user: FirebaseUser, role?: string, level?: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  fetchProfile: async (uid) => {
    const path = `users/${uid}`;
    try {
      const docRef = doc(db, path);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        set({ profile: { id: docSnap.id, ...docSnap.data() } as UserProfile });
      } else {
        set({ profile: null });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },
  syncProfile: async (user, role = 'student', level = 'Foundation') => {
    const path = `users/${user.uid}`;
    try {
      const docRef = doc(db, path);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        const newProfile = {
          fullName: user.displayName || 'New User',
          email: user.email,
          role: role,
          caLevel: level,
          profilePhotoUrl: user.photoURL,
          verificationStatus: 'pending',
          accountStatus: 'active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(docRef, newProfile);
        set({ profile: { id: user.uid, ...newProfile } as UserProfile });
      } else {
        set({ profile: { id: docSnap.id, ...docSnap.data() } as UserProfile });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
}));
