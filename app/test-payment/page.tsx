'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import RazorpayCheckout from '@/components/RazorpayCheckout';
import { toast } from 'react-hot-toast';

export default function TestPaymentPage() {
  const router = useRouter();
  const [amount, setAmount] = useState(100);
  const [name, setName] = useState('Test User');
  const [email, setEmail] = useState('test@example.com');
  const [phone, setPhone] = useState('9876543210');

  const handlePaymentSuccess = (response: any) => {
    console.log('Payment successful:', response);
    toast.success('Payment successful!');
    // Navigate to success page
    router.push(`/checkout/success?orderId=${response.razorpay_order_id}&paymentId=${response.razorpay_payment_id}`);
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    toast.error('Payment failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Test Razorpay Integration</h1>
          
          <div className="space-y-4 mb-8">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="1"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <RazorpayCheckout
              orderId={`order_${Date.now()}`}
              amount={amount}
              name={name}
              email={email}
              phone={phone}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h2 className="text-lg font-medium mb-2">Razorpay Test Cards</h2>
              <ul className="text-sm space-y-2 text-gray-600">
                <li><strong>Card Number:</strong> 4111 1111 1111 1111</li>
                <li><strong>Expiry:</strong> Any future date</li>
                <li><strong>CVV:</strong> Any 3 digits</li>
                <li><strong>OTP:</strong> 1234</li>
              </ul>
              <p className="text-xs mt-2 text-gray-500">
                For more test cards, visit the <a href="https://razorpay.com/docs/payments/payments/test-card-details/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Razorpay documentation</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 