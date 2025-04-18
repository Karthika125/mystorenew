'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import Button from '@/components/Button';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  // Check if already signed in
  useEffect(() => {
    const checkSession = async () => {
      // Don't run this again if we've recently been redirected
      if (localStorage.getItem('signin_redirect_time')) {
        const lastRedirect = parseInt(localStorage.getItem('signin_redirect_time') || '0');
        const now = new Date().getTime();
        
        if (now - lastRedirect < 3000) {
          console.log('Recent redirect detected, skipping session check');
          return;
        }
      }
      
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log('Session already exists, redirecting to home');
        
        // Set a timestamp to prevent redirect loops
        localStorage.setItem('signin_redirect_time', new Date().getTime().toString());
        
        // Use router for most browsers
        if (navigator.userAgent.indexOf('Edg') === -1) {
          // For non-Edge browsers like Chrome, Firefox, etc.
          router.push('/');
        } else {
          // For Edge browser
          window.location.href = '/';
        }
      }
    };
    
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setError('');
      setIsSubmitting(true);
      
      // Direct sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error.message);
        setError(error.message || 'Failed to sign in');
        return;
      }
      
      if (data.user) {
        // Success! Store user info
        localStorage.setItem('mystore_auth_status', 'authenticated');
        localStorage.setItem('mystore_user_email', data.user.email || '');
        localStorage.setItem('mystore_user_id', data.user.id);
        
        // Set a timestamp to prevent redirect loops
        localStorage.setItem('signin_redirect_time', new Date().getTime().toString());
        
        toast.success('Signed in successfully!');
        
        console.log('LOGIN SUCCESS - REDIRECTING NOW');
        
        // Different redirect approach based on browser
        if (navigator.userAgent.indexOf('Edg') === -1) {
          // For non-Edge browsers like Chrome, Firefox, Brave, etc.
          router.push('/');
        } else {
          // For Edge browser - manual redirect with delay
          setTimeout(() => {
            window.location.href = '/';
          }, 300);
        }
      }
    } catch (err) {
      console.error('Unexpected sign in error:', err);
      setError('An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-background">
      <div className="max-w-md w-full m-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Sign In to MyStore</h1>
            <p className="text-gray-600 mt-2">
              Welcome back! Please enter your details.
            </p>
            
            {/* URGENT ACTION BUTTON - DIRECT CHECKOUT ACCESS */}
            <div className="mt-4 mb-2 p-2 bg-green-50 border border-green-200 rounded-md">
              <button
                type="button"
                onClick={() => {
                  console.log('DIRECT EMERGENCY CHECKOUT ACCESS');
                  window.location.href = '/emergency-checkout';
                }}
                className="w-full text-center py-2 px-4 font-bold text-white bg-green-500 hover:bg-green-600 rounded-md transition-colors duration-200"
              >
                ⚡ Use Emergency Checkout ⚡
              </button>
              <p className="text-xs text-green-700 mt-1">
                Skip sign-in and go directly to a simplified checkout page
              </p>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-2 pl-10 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-primary hover:text-primary-dark">
                  Forgot password?
                </Link>
              </div>
              
              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
              >
                Sign In
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary hover:text-primary-dark font-medium">
                Sign Up
              </Link>
            </p>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Having trouble signing in?</p>
              <button
                type="button"
                onClick={async () => {
                  // Clear all auth data
                  localStorage.clear();
                  sessionStorage.clear();
                  
                  // Force sign out
                  await supabase.auth.signOut();
                  
                  // Show message
                  toast.success('Auth data cleared! Try signing in again.');
                  
                  // Reload the page after a delay
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }}
                className="text-xs py-1 px-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
              >
                🔄 Repair Login System
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 