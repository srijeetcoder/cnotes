// src/hooks/useSupabaseAuth.jsx
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';

// Context to provide auth throughout the app
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth changes – handles session persistence
  useEffect(() => {
    // If Supabase is not configured, fallback to a local mock user for testing
    if (!supabase) {
      setUser({ email: 'dev@example.com', id: 'dev-user-id' });
      setLoading(false);
      return;
    }

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email, password) => {
    if (!supabase) {
      setUser({ email, id: 'dev-user-id' });
      return;
    }
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signIn = async (email, password) => {
    if (!supabase) {
      setUser({ email, id: 'dev-user-id' });
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    if (!supabase) {
      setUser(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };
}
