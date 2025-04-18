'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProducts } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/context/CartContext';
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from '@/lib/fallback-data';

// Define Category type to ensure type safety
interface Category {
  id: number;
  name: string;
  image_url?: string;
}

export default function CategoryPage() {
  const params = useParams();
  const categoryId = typeof params.id === 'string' ? Number(params.id) : undefined;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategoryProducts = async () => {
      try {
        console.log(`Fetching products for category ${categoryId}...`);
        setIsLoading(true);
        setError(null);
        
        // Find category from fallback list if needed
        const fallbackCategory = FALLBACK_CATEGORIES.find(c => c.id === categoryId) as Category | undefined;
        if (fallbackCategory) {
          setCategory(fallbackCategory);
        }
        
        // Fetch products with timeout
        let productsData: Product[];
        try {
          productsData = await Promise.race([
            getProducts(categoryId) as Promise<Product[]>,
            new Promise<Product[]>((_, reject) => 
              setTimeout(() => reject(new Error('Products fetch timeout')), 5000)
            )
          ]);
        } catch (err) {
          console.error('Error fetching category products:', err);
          // Return filtered fallback products for this category
          productsData = FALLBACK_PRODUCTS.filter(p => p.category_id === categoryId) as Product[];
        }
        
        console.log(`Fetched ${productsData.length} products for category ${categoryId}`);
        setProducts(productsData);
        
        // Set category from the first product's category info if available
        if (productsData.length > 0 && productsData[0].categories) {
          setCategory(productsData[0].categories as Category);
        }
      } catch (error: any) {
        console.error('Error in fetchCategoryProducts:', error);
        setError(error.message || `Failed to load products for category ${categoryId}`);
        // Use filtered fallback data
        setProducts(FALLBACK_PRODUCTS.filter(p => p.category_id === categoryId) as Product[]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryId]);

  const handleRetry = () => {
    if (!categoryId) return;
    
    setIsLoading(true);
    setError(null);
    const fetchCategoryProducts = async () => {
      try {
        const productsData = await getProducts(categoryId);
        setProducts(productsData);
      } catch (error: any) {
        setError(error.message || `Failed to load products for category ${categoryId}`);
        setProducts(FALLBACK_PRODUCTS.filter(p => p.category_id === categoryId) as Product[]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategoryProducts();
  };

  if (!categoryId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <p>Invalid category. Please select a valid category.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">{category?.name || 'Category'}</h1>
      <p className="text-gray-600 mb-6">Browse our selection of {category?.name || 'products'}</p>
      
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((index) => (
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
        <div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 p-8 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-600">
                There are no products available in this category yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 