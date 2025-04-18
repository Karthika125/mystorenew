"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-main text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold">MyStore</h1>
          </Link>

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
            {user ? (
              <div className="relative group">
                <button className="flex items-center hover:text-secondary-light transition duration-200">
                  <FiUser className="text-2xl mr-1" />
                  <span className="hidden lg:inline">Account</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 z-10 hidden group-hover:block">
                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                    My Profile
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100">
                    My Orders
                  </Link>
                  <button 
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/signin" className="hover:text-secondary-light transition duration-200">
                <FiUser className="text-2xl inline-block mr-1" />
                <span className="hidden lg:inline">Sign In</span>
              </Link>
            )}
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
              {user ? (
                <>
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
                  <button 
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="text-left hover:text-secondary-light transition duration-200"
                  >
                    Sign Out
                  </button>
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
    </header>
  );
};

export default Header; 