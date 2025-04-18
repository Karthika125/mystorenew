'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';

export default function CheckoutSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear any lingering cart items or checkout state if needed
    // Could also trigger analytics events here
    console.log('Checkout completed successfully!');
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-primary mb-6">
          <FiCheckCircle className="inline-block text-7xl" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been successfully placed and is being processed.
        </p>
        
        <p className="text-gray-600 mb-4">
          A confirmation email will be sent to your registered email address with order details.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link 
            href="/orders" 
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            View Order
          </Link>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Continue Shopping <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
} 