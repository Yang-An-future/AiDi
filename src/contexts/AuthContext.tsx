import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  linkWithCredential,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type AuthCredential,
  type User,
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { UserProfile } from '../types/portal';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  linkGoogleWithPassword: (email: string, password: string, pendingCredential: AuthCredential) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!db || !user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (snapshot) => {
        setProfile(snapshot.exists() ? (snapshot.data() as UserProfile) : null);
        setProfileLoading(false);
      },
      () => {
        setProfile(null);
        setProfileLoading(false);
      }
    );
    return unsubscribe;
  }, [user]);

  const loginWithGoogle = async () => {
    if (!auth) {
      throw new Error('Firebase 尚未設定，請聯繫網站管理員設定 VITE_FIREBASE_* 環境變數。');
    }
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  // Handles the one-time case where an email already has a password-based
  // account (e.g. accounts created before Google sign-in existed): the user
  // proves ownership with their password, then we link the pending Google
  // credential onto that same account/uid so their existing profile carries over.
  const linkGoogleWithPassword = async (email: string, password: string, pendingCredential: AuthCredential) => {
    if (!auth) {
      throw new Error('Firebase 尚未設定，請聯繫網站管理員設定 VITE_FIREBASE_* 環境變數。');
    }
    const result = await signInWithEmailAndPassword(auth, email, password);
    await linkWithCredential(result.user, pendingCredential);
  };

  const logout = () => (auth ? signOut(auth) : Promise.resolve());

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, profileLoading, loginWithGoogle, linkGoogleWithPassword, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
