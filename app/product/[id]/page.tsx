'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiShoppingCart, FiHeart, FiShare2 } from 'react-icons/fi';
import Button from '@/components/Button';
import { useCart } from '@/context/CartContext';
import { getProductById, getProducts } from '@/lib/supabase';
import { Product } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch the product details
        const productData = await getProductById(id);
        
        if (productData) {
          setProduct(productData);
          
          // Fetch related products (products in the same category)
          const allProducts = await getProducts(productData.category_id);
          const related = allProducts.filter(p => p.id !== id).slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && product && value <= product.stock_quantity) {
      setQuantity(value);
    }
  };

  const handleIncreaseQuantity = () => {
    if (product && quantity < product.stock_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  // Function to format price with commas and two decimal places
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 h-96 bg-gray-300 animate-pulse rounded-lg"></div>
          <div className="w-full md:w-1/2">
            <div className="h-8 bg-gray-300 animate-pulse rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-300 animate-pulse rounded w-1/2 mb-6"></div>
            <div className="h-24 bg-gray-300 animate-pulse rounded mb-6"></div>
            <div className="h-10 bg-gray-300 animate-pulse rounded w-1/3 mb-6"></div>
            <div className="h-12 bg-gray-300 animate-pulse rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-6">Sorry, we couldn't find the product you're looking for.</p>
        <Link href="/products">
          <Button variant="primary">Browse Products</Button>
        </Link>
      </div>
    );
  }

  const inStock = product.stock_quantity > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        {product.categories && (
          <>
            <Link 
              href={`/categories/${product.category_id}`} 
              className="hover:text-primary transition-colors"
            >
              {product.categories.name}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-gray-800 font-medium">{product.name}</span>
      </div>

      {/* Product Details */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          <div className="relative h-96 bg-white rounded-lg overflow-hidden shadow-md">
            <Image
              src={product.image_url || '/images/placeholder.jpg'}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
          
          {product.categories && (
            <Link 
              href={`/categories/${product.category_id}`}
              className="text-primary hover:text-primary-dark transition-colors text-sm mb-4 inline-block"
            >
              {product.categories.name}
            </Link>
          )}
          
          <div className="text-2xl font-bold text-gray-900 mb-4">
            {formatPrice(product.price)}
          </div>
          
          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          {/* Stock Status */}
          <div className="mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              inStock 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {inStock ? 'In Stock' : 'Out of Stock'}
            </span>
            {inStock && (
              <span className="ml-2 text-sm text-gray-500">
                {product.stock_quantity} available
              </span>
            )}
          </div>
          
          {/* Quantity Selector */}
          {inStock && (
            <div className="flex items-center mb-6">
              <label htmlFor="quantity" className="mr-4 font-medium">
                Quantity:
              </label>
              <div className="flex border border-gray-300 rounded">
                <button
                  onClick={handleDecreaseQuantity}
                  className="px-3 py-1 border-r border-gray-300 hover:bg-gray-100"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={product.stock_quantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-12 text-center focus:outline-none"
                />
                <button
                  onClick={handleIncreaseQuantity}
                  className="px-3 py-1 border-l border-gray-300 hover:bg-gray-100"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          )}
          
          {/* Add to Cart Button */}
          <div className="flex mb-6">
            <Button
              onClick={handleAddToCart}
              disabled={!inStock}
              variant="primary"
              leftIcon={<FiShoppingCart />}
              className="mr-2"
              fullWidth
            >
              Add to Cart
            </Button>
            
            <Button
              variant="outline"
              className="px-3"
              aria-label="Add to wishlist"
            >
              <FiHeart />
            </Button>
            
            <Button
              variant="outline"
              className="ml-2 px-3"
              aria-label="Share product"
            >
              <FiShare2 />
            </Button>
          </div>
          
          {/* Additional Info */}
          <div className="text-sm text-gray-500">
            <p>Free shipping on orders over $50</p>
            <p>30-day easy returns</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
} 