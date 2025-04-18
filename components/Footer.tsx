"use client";

import React from 'react';
import Link from 'next/link';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Shop Categories */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/electronics" className="hover:text-secondary-light transition duration-200">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/categories/clothing" className="hover:text-secondary-light transition duration-200">
                  Clothing
                </Link>
              </li>
              <li>
                <Link href="/categories/home-kitchen" className="hover:text-secondary-light transition duration-200">
                  Home & Kitchen
                </Link>
              </li>
              <li>
                <Link href="/categories/books" className="hover:text-secondary-light transition duration-200">
                  Books
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:text-secondary-light transition duration-200">
                  Today's Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="hover:text-secondary-light transition duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-secondary-light transition duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-secondary-light transition duration-200">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-secondary-light transition duration-200">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/orders/track" className="hover:text-secondary-light transition duration-200">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xl font-semibold mb-4">About MyStore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-secondary-light transition duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-secondary-light transition duration-200">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-secondary-light transition duration-200">
                  Press Releases
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-secondary-light transition duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="hover:text-secondary-light transition duration-200">
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect with Us */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Connect with Us</h3>
            <div className="flex space-x-4 mb-6">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl hover:text-secondary-light transition duration-200"
                aria-label="Instagram"
              >
                <FiInstagram />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl hover:text-secondary-light transition duration-200"
                aria-label="Facebook"
              >
                <FiFacebook />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl hover:text-secondary-light transition duration-200"
                aria-label="Twitter"
              >
                <FiTwitter />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl hover:text-secondary-light transition duration-200"
                aria-label="YouTube"
              >
                <FiYoutube />
              </a>
            </div>
            
            <h4 className="text-lg font-semibold mb-2">Subscribe to Our Newsletter</h4>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full py-2 px-4 rounded-l-lg text-gray-800 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-secondary hover:bg-secondary-dark px-4 py-2 rounded-r-lg transition duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <hr className="my-6 border-gray-600" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} MyStore. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center space-x-4">
            <Link href="/privacy" className="hover:text-secondary-light transition duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-secondary-light transition duration-200">
              Terms of Service
            </Link>
            <Link href="/accessibility" className="hover:text-secondary-light transition duration-200">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 