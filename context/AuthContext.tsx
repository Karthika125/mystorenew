"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{error: any} | undefined>;
  signUp: (email: string, password: string, fullName: string) => Promise<{error: any} | undefined>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Initialize auth state - optimized to run only once
  useEffect(() => {
    if (authInitialized) return;

    const initAuth = async () => {
      try {
        console.log('Initializing auth state...');
        setIsLoading(true);

        // Check active session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
        } else if (data.session) {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            console.log('User found in session:', userData.user.id);
            setUser(userData.user);
          }
        } else {
          console.log('No active session found');
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
      } finally {
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };

    initAuth();

    // Set up auth change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        if (session) {
          const { data: userData } = await supabase.auth.getUser();
          console.log('User authenticated:', userData?.user?.id);
          setUser(userData?.user || null);
        } else {
          console.log('User signed out');
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [authInitialized]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in:', email);
      setIsLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error.message);
        toast.error(error.message || 'Failed to sign in');
        return { error };
      }

      if (data.user) {
        console.log('Sign in successful for:', data.user.id);
        toast.success('Signed in successfully!');
        setUser(data.user);
      }
    } catch (error: any) {
      console.error('Unexpected error during sign in:', error);
      toast.error(error.message || 'An error occurred during sign in');
      return { error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    try {
      console.log('Attempting to sign up:', email);
      setIsLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error.message);
        toast.error(error.message || 'Failed to sign up');
        return { error };
      }

      if (data.user) {
        console.log('Sign up successful for:', data.user.id);
        toast.success('Signed up successfully! Please check your email to confirm your account.');
      }
    } catch (error: any) {
      console.error('Unexpected error during sign up:', error);
      toast.error(error.message || 'An error occurred during sign up');
      return { error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      console.log('Attempting to sign out');
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error.message);
        toast.error(error.message || 'Failed to sign out');
      } else {
        console.log('Sign out successful');
        toast.success('Signed out successfully!');
        setUser(null);
      }
    } catch (error: any) {
      console.error('Unexpected error during sign out:', error);
      toast.error(error.message || 'An error occurred during sign out');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 