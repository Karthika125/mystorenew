'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/supabase';
import { FALLBACK_CATEGORIES } from '@/lib/fallback-data';

// Define the Category type
interface Category {
  id: number;
  name: string;
  image_url?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories...');
        setIsLoading(true);
        setError(null);
        
        // Fetch categories with timeout
        let categoriesData: Category[];
        try {
          categoriesData = await Promise.race([
            getCategories() as Promise<Category[]>,
            new Promise<Category[]>((_, reject) => 
              setTimeout(() => reject(new Error('Categories fetch timeout')), 5000)
            )
          ]);
        } catch (err) {
          console.error('Error fetching categories:', err);
          categoriesData = FALLBACK_CATEGORIES as Category[];
        }
        
        console.log(`Fetched ${categoriesData.length} categories`);
        setCategories(categoriesData);
      } catch (error: any) {
        console.error('Error in fetchCategories:', error);
        setError(error.message || 'Failed to load categories');
        setCategories(FALLBACK_CATEGORIES as Category[]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error: any) {
        setError(error.message || 'Failed to load categories');
        setCategories(FALLBACK_CATEGORIES as Category[]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Shop by Category</h1>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 rounded-md flex justify-between items-center">
          <p>{error}</p>
          <button 
            onClick={handleRetry}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md"
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="bg-white rounded-lg shadow-md h-60 animate-pulse">
              <div className="h-full bg-gray-300 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        // Categories grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link href={`/categories/${category.id}`} key={category.id}>
              <div className="relative h-64 rounded-lg overflow-hidden group shadow-md hover:shadow-xl transition-shadow duration-300">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                  style={{ 
                    backgroundImage: `url(${category.image_url || `https://via.placeholder.com/800x600/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=${category.name}`})`,
                    backgroundColor: '#' + Math.floor(Math.random()*16777215).toString(16)
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">{category.name}</h2>
                    <p className="text-white/90 text-sm">View Products</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 