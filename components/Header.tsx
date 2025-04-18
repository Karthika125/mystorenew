"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiMapPin, FiSettings } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/context/AdminContext';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState('Select location');
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { totalItems } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debug logging for user state
  useEffect(() => {
    console.log('🔍 Header Component - Auth State:', { 
      isLoggedIn: !!user, 
      userId: user?.id,
      userEmail: user?.email,
      localStorage: localStorage.getItem('mystore_auth_status')
    });
    
    // Check if we're in a reload loop prevention state
    const reloadAttempt = localStorage.getItem('reload_attempt');
    const currentTime = new Date().getTime();
    
    // Force rerender if localStorage indicates we're authenticated but user is null
    if (!user && localStorage.getItem('mystore_auth_status') === 'authenticated') {
      console.log('⚠️ Authentication mismatch detected - recovering session');
      
      // Try to recover the session from localStorage
      const userId = localStorage.getItem('mystore_user_id');
      const userEmail = localStorage.getItem('mystore_user_email');
      
      if (userId) {
        // Only try reload if we haven't attempted recently (avoid infinite loops)
        if (!reloadAttempt || (currentTime - parseInt(reloadAttempt)) > 5000) {
          // Force session check with Supabase
          supabase.auth.getSession().then(({ data }) => {
            if (data.session) {
              // Session exists but wasn't loaded in context
              console.log('✅ Valid session found, setting reload attempt timestamp');
              
              // Set reload attempt timestamp to prevent loops
              localStorage.setItem('reload_attempt', currentTime.toString());
              
              // Force page reload
              window.location.reload();
            } else {
              console.log('❌ No valid session found, removing localStorage data');
              // No valid session, clean up localStorage
              localStorage.removeItem('mystore_auth_status');
              localStorage.removeItem('mystore_user_id');
              localStorage.removeItem('mystore_user_email');
              localStorage.removeItem('reload_attempt');
            }
          });
        } else {
          console.log('⚠️ Preventing reload loop - recent reload attempt detected');
          // Clear reload attempt after some time to allow future recovery
          setTimeout(() => {
            localStorage.removeItem('reload_attempt');
          }, 10000);
        }
      }
    } else if (user) {
      // If user is available, remove reload attempt marker
      localStorage.removeItem('reload_attempt');
    }
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openLocationModal = () => {
    setIsLocationModalOpen(true);
  };

  const closeLocationModal = () => {
    setIsLocationModalOpen(false);
  };

  const setLocation = (location: string) => {
    setDeliveryLocation(location);
    closeLocationModal();
    // In a real app, you might want to store this in localStorage or in user's profile
    localStorage.setItem('deliveryLocation', location);
  };

  // Load saved location on component mount
  React.useEffect(() => {
    const savedLocation = localStorage.getItem('deliveryLocation');
    if (savedLocation) {
      setDeliveryLocation(savedLocation);
    } else {
      // Default to Kerala if no location is set
      setDeliveryLocation('Kochi, Kerala');
      localStorage.setItem('deliveryLocation', 'Kochi, Kerala');
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-gradient-main text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold">MyStore</h1>
          </Link>

          {/* Delivery Location - visible on all screen sizes */}
          <button 
            onClick={openLocationModal}
            className="flex items-center text-sm hover:text-secondary-light transition duration-200 mr-4"
          >
            <FiMapPin className="mr-1" />
            <div className="flex flex-col items-start">
              <span className="text-xs opacity-75">Deliver to</span>
              <span className="font-medium truncate max-w-[120px]">{deliveryLocation}</span>
            </div>
          </button>

          {/* Search Bar - Hide on mobile */}
          <div className="hidden md:block flex-grow mx-10">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full py-2 px-4 rounded-l-lg text-gray-800 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="bg-secondary hover:bg-secondary-dark px-4 rounded-r-lg transition duration-200"
              >
                <FiSearch className="text-white" />
              </button>
            </form>
          </div>

          {/* Navigation Links - Hide on mobile */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/categories" className="hover:text-secondary-light transition duration-200">
              Categories
            </Link>
            <Link href="/deals" className="hover:text-secondary-light transition duration-200">
              Deals
            </Link>
            
            {/* Cart Icon with Count */}
            <Link href="/cart" className="relative hover:text-secondary-light transition duration-200">
              <FiShoppingCart className="text-2xl" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* User Account */}
            {user || localStorage.getItem('mystore_auth_status') === 'authenticated' ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="flex items-center hover:text-secondary-light transition duration-200"
                  onClick={toggleDropdown}
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                >
                  <FiUser className="text-2xl mr-1" />
                  <span className="hidden lg:inline">Account</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 z-10">
                    <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                      My Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100">
                      My Orders
                    </Link>
                    {isAdmin && (
                      <>
                        <div className="border-t border-gray-100 my-1"></div>
                        <div className="px-4 py-1 text-xs text-gray-500">Admin</div>
                        <Link href="/admin" className="block px-4 py-2 hover:bg-gray-100 flex items-center">
                          <FiSettings className="mr-2" />
                          Admin Dashboard
                        </Link>
                      </>
                    )}
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={() => {
                        signOut();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                    <Link 
                      href="/signout"
                      className="block text-center px-4 py-2 mt-1 bg-red-100 text-red-600 hover:bg-red-200 rounded-md mx-2 text-sm font-medium"
                    >
                      Force Sign Out
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/signin" className="hover:text-secondary-light transition duration-200">
                <FiUser className="text-2xl inline-block mr-1" />
                <span className="hidden lg:inline">Sign In</span>
              </Link>
            )}
            <Link 
              href="/test-payment" 
              className="flex items-center text-gray-700 hover:text-primary rounded-md px-3 py-2"
            >
              <span className="mr-2">Test Payment</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-2xl" onClick={toggleMenu}>
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Search - Show only on mobile */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full py-2 px-4 rounded-l-lg text-gray-800 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="bg-secondary hover:bg-secondary-dark px-4 rounded-r-lg transition duration-200"
            >
              <FiSearch className="text-white" />
            </button>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="mt-3 md:hidden">
            <div className="flex flex-col space-y-3 bg-primary-dark rounded-lg p-4">
              {/* Delivery location for mobile */}
              <button 
                onClick={openLocationModal}
                className="flex items-center hover:text-secondary-light transition duration-200 py-1"
              >
                <FiMapPin className="mr-2" />
                <span>Deliver to: {deliveryLocation}</span>
              </button>
              
              <Link 
                href="/categories" 
                className="hover:text-secondary-light transition duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="/deals" 
                className="hover:text-secondary-light transition duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Deals
              </Link>
              <Link 
                href="/cart" 
                className="hover:text-secondary-light transition duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Cart ({totalItems})
              </Link>
              
              {/* User Account Section */}
              {user || localStorage.getItem('mystore_auth_status') === 'authenticated' ? (
                <>
                  <div className="border-t border-gray-600 my-2"></div>
                  <div className="text-xs text-gray-300 mb-1">Account</div>
                  <Link 
                    href="/profile" 
                    className="hover:text-secondary-light transition duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link 
                    href="/orders" 
                    className="hover:text-secondary-light transition duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  {isAdmin && (
                    <>
                      <div className="border-t border-gray-600 my-2"></div>
                      <div className="text-xs text-gray-300 mb-1">Admin</div>
                      <Link 
                        href="/admin" 
                        className="hover:text-secondary-light transition duration-200 flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiSettings className="mr-2" />
                        Admin Dashboard
                      </Link>
                    </>
                  )}
                  <div className="border-t border-gray-600 my-2"></div>
                  <button 
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md w-full text-center mt-2 flex items-center justify-center"
                  >
                    <FiX className="mr-2" />
                    Sign Out
                  </button>
                  <Link 
                    href="/signout"
                    className="mt-2 block text-center py-2 px-4 bg-red-100 text-red-600 hover:bg-red-200 rounded-md w-full text-sm font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Force Sign Out
                  </Link>
                </>
              ) : (
                <Link 
                  href="/signin" 
                  className="hover:text-secondary-light transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>

      {/* Location Selection Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full text-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Choose your location</h3>
              <button 
                onClick={closeLocationModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Delivery options and delivery speeds may vary for different locations
            </p>
            
            <div className="grid grid-cols-1 gap-2 mb-4">
              {user ? (
                <button
                  onClick={() => setLocation("123 Main St, New York, NY 10001")}
                  className="flex items-start p-3 border rounded-md hover:bg-gray-50 transition-colors"
                >
                  <FiMapPin className="text-primary mt-1 mr-2 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-medium">Default Address</p>
                    <p className="text-sm text-gray-600">123 Main St, New York, NY 10001</p>
                  </div>
                </button>
              ) : (
                <Link
                  href="/signin"
                  className="flex items-center justify-center p-3 border rounded-md hover:bg-gray-50 transition-colors text-primary"
                >
                  Sign in to see your addresses
                </Link>
              )}
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">Popular locations in Kerala</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Kochi, Kerala", 
                  "Thiruvananthapuram, Kerala", 
                  "Kozhikode, Kerala", 
                  "Thrissur, Kerala", 
                  "Kollam, Kerala", 
                  "Alappuzha, Kerala",
                  "Palakkad, Kerala",
                  "Kannur, Kerala"
                ].map((city) => (
                  <button
                    key={city}
                    onClick={() => setLocation(city)}
                    className="p-2 text-sm border rounded hover:bg-gray-50 transition-colors text-left"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">Other major cities in India</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Mumbai, Maharashtra", 
                  "Delhi, NCR", 
                  "Bangalore, Karnataka", 
                  "Chennai, Tamil Nadu", 
                  "Hyderabad, Telangana", 
                  "Kolkata, West Bengal"
                ].map((city) => (
                  <button
                    key={city}
                    onClick={() => setLocation(city)}
                    className="p-2 text-sm border rounded hover:bg-gray-50 transition-colors text-left"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
            
            <h4 className="font-medium mb-2">Enter a PIN code</h4>
            <div className="flex">
              <input 
                type="text" 
                placeholder="Enter 6-digit PIN code" 
                className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={6}
                pattern="[0-9]{6}"
              />
              <button 
                className="bg-primary text-white px-4 py-2 rounded-r hover:bg-primary-dark transition-colors"
                onClick={() => setLocation("PIN: 682001 (Kochi)")}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 