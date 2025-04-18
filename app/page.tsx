'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeroCarousel from '@/components/HeroCarousel';
import ProductCard from '@/components/ProductCard';
import { FiArrowRight, FiTruck, FiShield, FiCreditCard, FiGift } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { getProducts, getCategories } from '@/lib/supabase';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        const categoriesData = await getCategories();
        setCategories(categoriesData.slice(0, 6)); // Only first 6 categories

        // Fetch products
        const productsData = await getProducts();
        
        // Setup featured and trending products (normally you'd have fields in DB for this)
        if (productsData.length) {
          // Featured products (first 4 products)
          setFeaturedProducts(productsData.slice(0, 4));
          
          // Trending products (next 8 products, or randomized)
          setTrendingProducts(productsData.slice(4, 12));
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="w-full">
        <HeroCarousel />
      </section>

      {/* USP Feature Strip */}
      <section className="bg-white py-4 border-t border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center p-2 w-full sm:w-1/2 md:w-1/4">
              <FiTruck className="text-primary text-2xl mr-3" />
              <div>
                <h3 className="font-medium text-sm">Free Shipping</h3>
                <p className="text-xs text-gray-500">On orders over ₹500</p>
              </div>
            </div>
            <div className="flex items-center p-2 w-full sm:w-1/2 md:w-1/4">
              <FiShield className="text-primary text-2xl mr-3" />
              <div>
                <h3 className="font-medium text-sm">Secure Payments</h3>
                <p className="text-xs text-gray-500">Protected by Razorpay</p>
              </div>
            </div>
            <div className="flex items-center p-2 w-full sm:w-1/2 md:w-1/4">
              <FiCreditCard className="text-primary text-2xl mr-3" />
              <div>
                <h3 className="font-medium text-sm">Easy Returns</h3>
                <p className="text-xs text-gray-500">30 day return policy</p>
              </div>
            </div>
            <div className="flex items-center p-2 w-full sm:w-1/2 md:w-1/4">
              <FiGift className="text-primary text-2xl mr-3" />
              <div>
                <h3 className="font-medium text-sm">Exclusive Offers</h3>
                <p className="text-xs text-gray-500">For members only</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Shop by Category</h2>
            <Link href="/categories" className="text-primary flex items-center text-sm font-medium hover:text-primary-dark">
              View All Categories <FiArrowRight className="ml-2" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-lg h-40 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link 
                  key={category.id} 
                  href={`/categories/${category.id}`} 
                  className="group"
                >
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg"
                  >
                    <div className="h-32 bg-gray-100 relative">
                      {category.image_url ? (
                        <Image 
                          src={category.image_url} 
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-primary/10">
                          <span className="text-4xl text-primary opacity-30">
                            {category.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="font-medium text-gray-800 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
            <Link href="/products" className="text-primary flex items-center text-sm font-medium hover:text-primary-dark">
              View All Products <FiArrowRight className="ml-2" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Deal of the Day */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-secondary font-bold mb-2">Special Offer</h4>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Deal of the Day</h2>
              <p className="mb-6 opacity-90">
                Get up to 50% off on selected products. Limited time offer!
              </p>
              <div className="flex space-x-4 mb-8">
                <div className="bg-white/20 rounded-lg p-3 text-center min-w-[70px]">
                  <span className="block text-2xl font-bold">24</span>
                  <span className="text-sm opacity-80">Hours</span>
                </div>
                <div className="bg-white/20 rounded-lg p-3 text-center min-w-[70px]">
                  <span className="block text-2xl font-bold">36</span>
                  <span className="text-sm opacity-80">Minutes</span>
                </div>
                <div className="bg-white/20 rounded-lg p-3 text-center min-w-[70px]">
                  <span className="block text-2xl font-bold">42</span>
                  <span className="text-sm opacity-80">Seconds</span>
                </div>
              </div>
              <Link href="/deals">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300"
                >
                  Shop Now
                </motion.button>
              </Link>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image 
                src="https://via.placeholder.com/600x400/f5f5f5/333333?text=Deal+of+the+Day"
                alt="Deal of the day product"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Trending Now</h2>
            <Link href="/trending" className="text-primary flex items-center text-sm font-medium hover:text-primary-dark">
              View All <FiArrowRight className="ml-2" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Join Our Newsletter
            </h2>
            <p className="text-gray-600 mb-6">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300"
                required
              />
              <button 
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-lg transition duration-300"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
              By subscribing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 