'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ForceSignOutPage() {
  const router = useRouter();

  useEffect(() => {
    const forceSignOut = async () => {
      try {
        // Clear any stored auth data
        localStorage.removeItem('mystore_auth_status');
        localStorage.removeItem('supabase.auth.token');
        
        // Force sign out from Supabase
        await supabase.auth.signOut();
        
        // Clear session storage as well
        sessionStorage.clear();
        
        // Wait a moment before redirecting
        setTimeout(() => {
          // Redirect to home page
          window.location.href = '/';
        }, 1000);
      } catch (error) {
        console.error('Error during force sign out:', error);
      }
    };

    forceSignOut();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Signing Out...</h1>
        <p className="text-gray-600 mb-6">Clearing all authentication data and redirecting you to the home page.</p>
        <div className="animate-pulse text-primary text-3xl">⟳</div>
      </div>
    </div>
  );
} 