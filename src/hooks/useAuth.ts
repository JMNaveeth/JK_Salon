import { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabase';
import type { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'user' | null;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        await fetchRole(session.user.id);
      } else {
        setRole(null);
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen for state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoading(true);
      if (session?.user) {
        setUser(session.user);
        fetchRole(session.user.id).finally(() => setLoading(false));
      } else {
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (data) {
        setRole(data.role as UserRole);
      } else {
        setRole('user');
      }
    } catch (err) {
      console.error('Error fetching user role:', err);
      setRole('user');
    }
  };

  const isAdmin = role === 'admin';

  return { user, role, isAdmin, loading };
}