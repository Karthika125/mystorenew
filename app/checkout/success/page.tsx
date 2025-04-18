'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiCheck, FiChevronRight, FiHome, FiPackage } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '@/components/Button';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState({
    id: orderId || 'ORDER' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    paymentMethod: 'Razorpay',
    total: '₹ 2,399.00', // This would come from the order details in a real app
    items: 3, // This would come from the order details in a real app
  });

  useEffect(() => {
    // In a real app, you would fetch the order details from your backend
    // For now, we'll just simulate a loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-white p-6 text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-4"
            >
              <FiCheck className="text-primary text-4xl" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold mb-2"
            >
              Payment Successful!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-primary-light"
            >
              Thank you for your purchase. Your order has been confirmed.
            </motion.p>
          </div>

          {/* Order Details */}
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Order ID</p>
                    <p className="font-medium">{orderDetails.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Date</p>
                    <p className="font-medium">{orderDetails.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Payment Method</p>
                    <p className="font-medium">{orderDetails.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Amount</p>
                    <p className="font-medium">{orderDetails.total}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Order Timeline</h2>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                      <FiCheck />
                    </div>
                    <div className="h-full border-l border-gray-300 mx-auto mt-2"></div>
                  </div>
                  <div>
                    <h3 className="font-medium">Order Confirmed</h3>
                    <p className="text-sm text-gray-500">Your order has been placed successfully</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center">
                      <FiPackage />
                    </div>
                    <div className="h-10 border-l border-gray-300 mx-auto mt-2"></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Processing</h3>
                    <p className="text-sm text-gray-500">Your order is being processed</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center">
                      <FiPackage />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Shipped</h3>
                    <p className="text-sm text-gray-500">Your items will be shipped soon</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-8 p-4 bg-primary-light/10 rounded-lg border border-primary-light/30">
              <h3 className="font-medium text-primary-dark mb-2">What happens next?</h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-start">
                  <FiCheck className="mt-1 mr-2 text-primary" />
                  <span>You will receive an order confirmation email with details of your order.</span>
                </li>
                <li className="flex items-start">
                  <FiCheck className="mt-1 mr-2 text-primary" />
                  <span>Once your order ships, we will send you a tracking number via email.</span>
                </li>
                <li className="flex items-start">
                  <FiCheck className="mt-1 mr-2 text-primary" />
                  <span>If you have any questions, please contact our customer support.</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/orders">
                <Button variant="outline" className="w-full sm:w-auto">
                  View Order History
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full sm:w-auto" leftIcon={<FiHome />}>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 