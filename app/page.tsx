'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';
import HeroCarousel from '@/components/HeroCarousel';
import ProductCard from '@/components/ProductCard';
import Button from '@/components/Button';
import { getProducts, getCategories } from '@/lib/supabase';
import { Product } from '@/context/CartContext';

// Static fallback data in case the API calls fail
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'fallback-1',
    name: 'Premium Noise-Cancelling Headphones',
    description: 'Experience superior sound quality with our premium noise-cancelling headphones.',
    price: 249.99,
    image_url: 'https://via.placeholder.com/300x300/3498db/ffffff?text=Headphones',
    stock_quantity: 15,
    category_id: 1,
    categories: { id: 1, name: 'Electronics' }
  },
  {
    id: 'fallback-2',
    name: 'Slim Fit Cotton T-Shirt',
    description: 'A comfortable, breathable t-shirt perfect for everyday wear.',
    price: 24.99,
    image_url: 'https://via.placeholder.com/300x300/e74c3c/ffffff?text=T-Shirt',
    stock_quantity: 50,
    category_id: 2,
    categories: { id: 2, name: 'Clothing' }
  },
  {
    id: 'fallback-3',
    name: 'Smart Home Speaker',
    description: 'Control your home with voice commands using our smart speaker.',
    price: 129.99,
    image_url: 'https://via.placeholder.com/300x300/27ae60/ffffff?text=Speaker',
    stock_quantity: 20,
    category_id: 1,
    categories: { id: 1, name: 'Electronics' }
  },
  {
    id: 'fallback-4',
    name: 'Stainless Steel Water Bottle',
    description: 'Keep your drinks cold for 24 hours or hot for 12 hours.',
    price: 34.99,
    image_url: 'https://via.placeholder.com/300x300/9b59b6/ffffff?text=Bottle',
    stock_quantity: 35,
    category_id: 3,
    categories: { id: 3, name: 'Home & Kitchen' }
  },
];

// Static fallback categories
const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Electronics', image_url: 'https://via.placeholder.com/800x600/3498db/ffffff?text=Electronics' },
  { id: 2, name: 'Clothing', image_url: 'https://via.placeholder.com/800x600/e74c3c/ffffff?text=Fashion' },
  { id: 3, name: 'Home & Kitchen', image_url: 'https://via.placeholder.com/800x600/27ae60/ffffff?text=Home+Kitchen' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Placeholder data for hero images and categories if API call fails
  const placeholderHeroImages = useMemo(() => [
    { id: 1, image: 'https://via.placeholder.com/800x600/3498db/ffffff?text=Electronics', title: 'Electronics', url: '/categories/electronics' },
    { id: 2, image: 'https://via.placeholder.com/800x600/e74c3c/ffffff?text=Fashion', title: 'Fashion', url: '/categories/clothing' },
    { id: 3, image: 'https://via.placeholder.com/800x600/27ae60/ffffff?text=Home+Kitchen', title: 'Home & Kitchen', url: '/categories/home-kitchen' },
  ], []);

  const fetchData = useCallback(async () => {
    try {
      console.log('Fetching home page data...');
      setIsLoading(true);
      setError(null);
      
      // Fetch products with a timeout
      const productsPromise = Promise.race([
        getProducts(),
        new Promise<Product[]>((_, reject) => 
          setTimeout(() => reject(new Error('Products fetch timeout')), 5000)
        )
      ]);
      
      // Fetch categories with a timeout
      const categoriesPromise = Promise.race([
        getCategories(),
        new Promise<any[]>((_, reject) => 
          setTimeout(() => reject(new Error('Categories fetch timeout')), 5000)
        )
      ]);
      
      // Fetch both in parallel
      const [allProducts, categoriesData] = await Promise.all([
        productsPromise.catch(err => {
          console.error('Error fetching products:', err);
          return FALLBACK_PRODUCTS;
        }),
        categoriesPromise.catch(err => {
          console.error('Error fetching categories:', err);
          return FALLBACK_CATEGORIES;
        })
      ]);
      
      console.log(`Fetched ${allProducts.length} products and ${categoriesData.length} categories`);
      
      // Simulate featured and new arrivals by slicing the products array
      setFeaturedProducts(allProducts.slice(0, 4));
      setNewArrivals(allProducts.slice(4, 8));
      setCategories(categoriesData);
    } catch (error: any) {
      console.error('Error in fetchData:', error);
      setError(error.message || 'Failed to load data');
      
      // Use fallback data
      setFeaturedProducts(FALLBACK_PRODUCTS.slice(0, 4));
      setNewArrivals(FALLBACK_PRODUCTS.slice(0, 4));
      setCategories(FALLBACK_CATEGORIES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Function to retry loading data
  const handleRetry = () => {
    fetchData();
  };

  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel />
      
      {/* Error message with retry button */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 mx-4 my-6 rounded-md flex justify-between items-center">
          <p>{error}</p>
          <button 
            onClick={handleRetry}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md"
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Featured Products */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Featured Products</h2>
            <Link href="/products" className="flex items-center text-primary hover:text-primary-dark transition-colors">
              View All <FiArrowRight className="ml-2" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="bg-white rounded-lg shadow-md h-80 animate-pulse">
                  <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">No featured products available.</p>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Categories */}
      <section className="py-12 px-4 bg-background-dark">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our wide selection of products across various categories to find exactly what you're looking for.
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((index) => (
                <div key={index} className="bg-white rounded-lg shadow-md h-60 animate-pulse">
                  <div className="h-full bg-gray-300 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.length > 0 ? (
                categories.slice(0, 6).map((category, index) => (
                  <Link href={`/categories/${category.id}`} key={category.id}>
                    <div className="relative h-60 rounded-lg overflow-hidden group">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                        style={{ 
                          backgroundImage: `url(${category.image_url || placeholderHeroImages[index % 3].image})`,
                          backgroundColor: index % 3 === 0 ? '#3498db' : index % 3 === 1 ? '#e74c3c' : '#27ae60'
                        }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                          <p className="text-white/80 text-sm mt-1">Shop Now</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                // Fallback if no categories from API
                placeholderHeroImages.map((item) => (
                  <Link href={item.url} key={item.id}>
                    <div className="relative h-60 rounded-lg overflow-hidden group">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                        style={{ 
                          backgroundImage: `url(${item.image})`,
                          backgroundColor: item.id % 3 === 1 ? '#3498db' : item.id % 3 === 2 ? '#e74c3c' : '#27ae60'
                        }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                          <p className="text-white/80 text-sm mt-1">Shop Now</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* New Arrivals */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">New Arrivals</h2>
            <Link href="/products/new" className="flex items-center text-primary hover:text-primary-dark transition-colors">
              View All <FiArrowRight className="ml-2" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="bg-white rounded-lg shadow-md h-80 animate-pulse">
                  <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.length > 0 ? (
                newArrivals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">No new arrivals available.</p>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-16 px-4 bg-gradient-main text-white">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="mb-6">
              Stay updated on our latest products, exclusive offers, and promotions.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow py-3 px-4 rounded-l-lg text-gray-800 focus:outline-none sm:mb-0 mb-2"
                required
              />
              <Button variant="secondary" size="lg" className="sm:rounded-l-none rounded-lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 