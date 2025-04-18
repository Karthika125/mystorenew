'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiTrash2, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import Button from '@/components/Button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { user } = useAuth();

  // Function to format price with commas and two decimal places
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Calculate shipping cost (free if order is over $50)
  const shippingCost = totalPrice >= 50 ? 0 : 5.99;
  
  // Calculate tax (assume 7% tax rate)
  const taxRate = 0.07;
  const taxAmount = totalPrice * taxRate;
  
  // Calculate the order total
  const orderTotal = totalPrice + shippingCost + taxAmount;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Your Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6 text-center">
            <FiShoppingBag className="inline-block text-6xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700">Your cart is empty</h2>
            <p className="text-gray-500 mt-2">Looks like you haven't added anything to your cart yet.</p>
          </div>
          <Link href="/products">
            <Button variant="primary" size="lg">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header Row */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 text-gray-600 font-medium border-b">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            
            {/* Cart Items */}
            {cartItems.map((item) => (
              <div 
                key={item.product.id} 
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b last:border-b-0 items-center"
              >
                {/* Product Info */}
                <div className="col-span-1 md:col-span-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image
                        src={item.product.image_url || '/images/placeholder.jpg'}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="ml-4">
                      <Link 
                        href={`/product/${item.product.id}`}
                        className="text-primary-dark hover:text-primary font-medium"
                      >
                        {item.product.name}
                      </Link>
                      {item.product.categories && (
                        <p className="text-sm text-gray-500">{item.product.categories.name}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Price */}
                <div className="md:col-span-2 text-left md:text-center">
                  <div className="md:hidden inline-block font-medium text-gray-600 mr-2">Price:</div>
                  {formatPrice(item.product.price)}
                </div>
                
                {/* Quantity */}
                <div className="md:col-span-2 flex justify-start md:justify-center items-center">
                  <div className="md:hidden inline-block font-medium text-gray-600 mr-2">Quantity:</div>
                  <div className="flex border border-gray-300 rounded">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="px-2 py-1 border-r border-gray-300 hover:bg-gray-100"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={item.product.stock_quantity}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                      className="w-10 text-center focus:outline-none"
                    />
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="px-2 py-1 border-l border-gray-300 hover:bg-gray-100"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="ml-3 text-gray-500 hover:text-secondary transition-colors"
                    aria-label="Remove item"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                
                {/* Item Total */}
                <div className="md:col-span-2 text-left md:text-right font-semibold">
                  <div className="md:hidden inline-block font-medium text-gray-600 mr-2">Total:</div>
                  {formatPrice(item.product.price * item.quantity)}
                </div>
              </div>
            ))}
            
            {/* Cart Actions */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between">
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 flex items-center transition-colors"
              >
                <FiTrash2 className="mr-1" /> Clear Cart
              </button>
              <Link href="/products" className="text-primary-dark hover:text-primary flex items-center">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">{formatPrice(taxAmount)}</span>
              </div>
            </div>
            
            <div className="flex justify-between mb-6">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold text-primary-dark">{formatPrice(orderTotal)}</span>
            </div>
            
            <Button
              variant="primary"
              size="lg"
              rightIcon={<FiArrowRight />}
              fullWidth
              onClick={() => window.location.href = user ? '/checkout' : '/signin?redirect=/checkout'}
            >
              {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
            </Button>
            
            {!user && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                You need to be signed in to complete your purchase.
              </p>
            )}
            
            <div className="mt-6 text-xs text-gray-500">
              <p>We accept the following payment methods:</p>
              <div className="flex justify-between mt-2">
                <span>Visa</span>
                <span>Mastercard</span>
                <span>American Express</span>
                <span>PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 