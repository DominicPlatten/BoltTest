import { create } from 'zustand';
import { 
  signInWithPopup,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  getRedirectResult,
  type User 
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: (useRedirect?: boolean) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async (useRedirect = false) => {
    set({ loading: true, error: null });
    try {
      if (useRedirect) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          set({ user: result.user });
        } catch (error: any) {
          if (error.code === 'auth/popup-blocked') {
            await signInWithRedirect(auth, googleProvider);
          } else {
            throw error;
          }
        }
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      set({ 
        error: error.code === 'auth/api-key-not-valid' 
          ? 'Firebase configuration is missing or invalid.'
          : 'Failed to sign in. Please try again.',
        loading: false
      });
    }
  },
  signInWithEmail: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      set({ user: result.user });
    } catch (error: any) {
      console.error('Error signing in:', error);
      set({ 
        error: error.code === 'auth/invalid-credential'
          ? 'Invalid email or password.'
          : 'Failed to sign in. Please try again.',
        loading: false
      });
    }
  },
  signUpWithEmail: async (email: string, password: string, name: string) => {
    set({ loading: true, error: null });
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      set({ user });
    } catch (error: any) {
      console.error('Error signing up:', error);
      set({ 
        error: error.code === 'auth/email-already-in-use'
          ? 'Email already in use.'
          : 'Failed to sign up. Please try again.',
        loading: false
      });
    }
  },
  signOut: async () => {
    set({ loading: true, error: null });
    try {
      await firebaseSignOut(auth);
      set({ user: null });
    } catch (error) {
      console.error('Error signing out:', error);
      set({ error: 'Failed to sign out. Please try again.' });
    } finally {
      set({ loading: false });
    }
  },
  clearError: () => set({ error: null })
}));

// Handle redirect result
getRedirectResult(auth).then((result) => {
  if (result?.user) {
    useAuthStore.setState({ user: result.user, loading: false });
  }
}).catch((error) => {
  console.error('Error with redirect sign-in:', error);
  useAuthStore.setState({ 
    error: 'Failed to complete sign-in. Please try again.',
    loading: false
  });
});

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user, loading: false });
});