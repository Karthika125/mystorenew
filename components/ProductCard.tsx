"use client";

import React from 'react';
import Link from 'next/link';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { Product } from '@/context/CartContext';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  // Function to format price with commas and two decimal places
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Check if the product is in stock
  const isInStock = product.stock_quantity > 0;

  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
        {/* Product Image */}
        <div className="relative h-48 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${product.image_url || '/images/placeholder.jpg'})`,
              backgroundColor: '#f3f4f6'
            }}
          ></div>
          
          {/* Wishlist icon */}
          <button
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Add wishlist functionality here
            }}
            aria-label="Add to wishlist"
          >
            <FiHeart className="text-secondary" />
          </button>
          
          {/* Out of Stock overlay */}
          {!isInStock && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          <span className="text-xs text-primary font-medium">
            {product.categories?.name || 'General'}
          </span>
          
          <h3 className="text-lg font-semibold text-gray-800 mt-1 line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-600 mt-2 line-clamp-2 flex-grow">
            {product.description}
          </p>
          
          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className={`p-2 rounded-full ${
                isInStock 
                  ? 'bg-primary hover:bg-primary-dark' 
                  : 'bg-gray-300 cursor-not-allowed'
              } text-white transition-colors duration-200`}
              aria-label="Add to cart"
            >
              <FiShoppingCart className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 