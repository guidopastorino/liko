import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/auth';
import type { Session } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (fullname: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, fullname, email, created_at, updated_at')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    fullname: data.fullname ?? null,
    email: data.email ?? null,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    profile: null,
    loading: true,
  });

  const refreshProfile = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setState((s) => ({ ...s, profile: null }));
      return;
    }
    const profile = await fetchProfile(session.user.id);
    setState((s) => ({ ...s, profile }));
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setState((s) => ({ ...s, session, loading: true }));
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setState((s) => ({ ...s, session, profile, loading: false }));
      } else {
        setState((s) => ({ ...s, session, profile: null, loading: false }));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setState((s) => ({ ...s, session, loading: true }));
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setState((s) => ({ ...s, session, profile, loading: false }));
      } else {
        setState((s) => ({ ...s, session, profile: null, loading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (fullname: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullname },
      },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value: AuthContextValue = {
    ...state,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
