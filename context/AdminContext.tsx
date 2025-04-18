"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);
        
        // Log the current user for debugging
        console.log('Checking admin status for user:', user?.email);
        
        if (!user) {
          console.log('No user found, setting isAdmin to false');
          setIsAdmin(false);
          return;
        }
        
        // For reliability, we'll use a direct approach without database queries
        // Define admin emails directly
        const adminEmails = ['admin@mystore.com', 'karthikakathz.v2@gmail.com', 'karthikasuresh.v2@gmail.com'];
        
        // Check if the user's email is in our admin list
        const userEmail = user.email?.toLowerCase() || '';
        const isAdminByEmail = adminEmails.includes(userEmail);
        
        // Also check user_metadata for admin flag as a fallback
        const isAdminMetadata = user.user_metadata?.is_admin === true;
        
        // Set admin status based on email or metadata
        const adminStatus = isAdminByEmail || isAdminMetadata;
        console.log('Admin check result:', { 
          email: user.email, 
          isAdminByEmail, 
          isAdminMetadata, 
          finalStatus: adminStatus 
        });
        
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error('Unexpected error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const value = {
    isAdmin,
    isLoading
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export default AdminProvider; 