'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const { signIn, user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  
  console.log('Auth state:', { user: !!user, isLoading, redirectTo, isRedirecting });

  // Handle redirect when user is authenticated
  const performRedirect = useCallback(() => {
    if (!user || isRedirecting) return;
    
    setIsRedirecting(true);
    console.log(`Redirecting to ${redirectTo}...`);
    
    // Small timeout to ensure the auth state is fully processed
    setTimeout(() => {
      try {
        toast.success(`Welcome back, ${user.email}!`);
        router.push(redirectTo);
        router.refresh();
      } catch (error) {
        console.error('Navigation error:', error);
        // Fallback to window.location if router fails
        window.location.href = redirectTo;
      }
    }, 300);
  }, [user, router, redirectTo, isRedirecting]);

  // If user is already signed in, redirect to the destination
  useEffect(() => {
    if (user && !isLoading && !isRedirecting) {
      performRedirect();
    }
  }, [user, isLoading, performRedirect, isRedirecting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setError('');
      setIsSubmitting(true);
      
      console.log(`Attempting to sign in as ${email}...`);
      const result = await signIn(email, password);
      
      if (result?.error) {
        console.error('Sign in error:', result.error);
        setError(result.error.message || 'Failed to sign in');
      } else {
        // No error means signin was successful
        console.log('Sign in successful, preparing to redirect...');
        // Let the useEffect handle the redirect
      }
    } catch (err: any) {
      console.error('Unexpected sign in error:', err);
      setError(err.message || 'An unknown error occurred');
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
          {isRedirecting && (
            <div className="bg-blue-50 text-blue-700 p-3 rounded-md mb-4 flex items-center justify-between">
              <span>Signed in successfully! Redirecting...</span>
              <div className="animate-spin h-5 w-5 border-2 border-blue-700 rounded-full border-t-transparent"></div>
            </div>
          )}
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Sign In to MyStore</h1>
            <p className="text-gray-600 mt-2">
              Welcome back! Please enter your details.
            </p>
            {redirectTo !== '/' && (
              <p className="text-primary text-sm mt-2">
                You'll be redirected to: {redirectTo}
              </p>
            )}
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
                    disabled={isRedirecting}
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
                    disabled={isRedirecting}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      disabled={isRedirecting}
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
                isLoading={isSubmitting || isRedirecting}
                disabled={isRedirecting}
              >
                {isRedirecting ? 'Redirecting...' : 'Sign In'}
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
          </div>
        </div>
      </div>
    </div>
  );
} 