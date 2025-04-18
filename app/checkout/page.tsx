'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiChevronRight, FiCreditCard, FiLock } from 'react-icons/fi';
import Button from '@/components/Button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { cartItems, totalItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    phoneNumber: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  // Redirect if not logged in or cart is empty
  useEffect(() => {
    const checkAuthAndCart = async () => {
      console.log('Checkout: Checking authentication and cart state...');
      console.log('Auth state:', { user: !!user, cartItems: cartItems.length });
      
      if (!user) {
        console.log('User not authenticated, redirecting to signin page...');
        // Add a small delay to ensure the state is fully updated
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push('/signin?redirect=/checkout');
        return;
      }
      
      if (cartItems.length === 0) {
        console.log('Cart is empty, redirecting to cart page...');
        router.push('/cart');
      }
    };
    
    checkAuthAndCart();
  }, [user, cartItems, router]);

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

  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (
      !shippingInfo.fullName ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.state ||
      !shippingInfo.postalCode ||
      !shippingInfo.phoneNumber
    ) {
      setError('Please fill in all required fields');
      return;
    }
    
    setError('');
    setCurrentStep('payment');
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic card validation
    if (
      !paymentInfo.cardNumber ||
      !paymentInfo.cardName ||
      !paymentInfo.expiry ||
      !paymentInfo.cvv
    ) {
      setError('Please fill in all payment details');
      return;
    }
    
    try {
      setError('');
      setIsSubmitting(true);
      
      // In a real app, you would process payment and create the order here
      // For this demo, we'll just simulate a successful order
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Move to confirmation step
      setCurrentStep('confirmation');
      
      // Clear the cart
      clearCart();
    } catch (err: any) {
      setError(err.message || 'An error occurred during payment processing');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is not logged in or cart is empty, show loading
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Checking Authentication...</h2>
            <p className="text-gray-600 mb-4">Please wait while we verify your account.</p>
            <div className="flex justify-center">
              <div className="animate-spin h-10 w-10 border-4 border-primary rounded-full border-t-transparent"></div>
            </div>
            <p className="text-sm text-gray-500 mt-4">You'll be redirected to sign in if needed.</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-4">Add some items to your cart before proceeding to checkout.</p>
            <Button 
              onClick={() => router.push('/')}
              variant="primary"
              size="lg"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Steps */}
        <div className="flex justify-center mb-8">
          <ol className="flex items-center w-full max-w-3xl">
            <li className={`flex items-center text-primary font-medium`}>
              <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep === 'shipping' ? 'border-primary bg-primary text-white' : 'border-primary'
              }`}>
                1
              </span>
              <span className="ms-2">Shipping</span>
            </li>
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
            <li className={`flex items-center ${
              currentStep === 'payment' || currentStep === 'confirmation' ? 'text-primary font-medium' : 'text-gray-500'
            }`}>
              <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep === 'payment' ? 'border-primary bg-primary text-white' : 
                currentStep === 'confirmation' ? 'border-primary' : 'border-gray-300'
              }`}>
                2
              </span>
              <span className="ms-2">Payment</span>
            </li>
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
            <li className={`flex items-center ${
              currentStep === 'confirmation' ? 'text-primary font-medium' : 'text-gray-500'
            }`}>
              <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep === 'confirmation' ? 'border-primary bg-primary text-white' : 'border-gray-300'
              }`}>
                3
              </span>
              <span className="ms-2">Confirmation</span>
            </li>
          </ol>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-6 max-w-3xl mx-auto">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="w-full lg:w-2/3">
            {/* Shipping Address Form */}
            {currentStep === 'shipping' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Information</h2>
                
                <form onSubmit={handleSubmitShipping}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleShippingInfoChange}
                        className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingInfoChange}
                        className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingInfoChange}
                        className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingInfoChange}
                        className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleShippingInfoChange}
                        className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleShippingInfoChange}
                        className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={shippingInfo.phoneNumber}
                        onChange={handleShippingInfoChange}
                        className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      rightIcon={<FiChevronRight />}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Payment Form */}
            {currentStep === 'payment' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h2>
                
                <form onSubmit={handleSubmitPayment}>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <FiCreditCard className="mr-2" /> Credit Card
                      </h3>
                      <div className="flex space-x-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">Visa</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">Mastercard</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">Amex</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={paymentInfo.cardNumber}
                            onChange={handlePaymentInfoChange}
                            className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            required
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <FiLock className="text-gray-400" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                          Name on Card *
                        </label>
                        <input
                          type="text"
                          id="cardName"
                          name="cardName"
                          value={paymentInfo.cardName}
                          onChange={handlePaymentInfoChange}
                          className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          id="expiry"
                          name="expiry"
                          value={paymentInfo.expiry}
                          onChange={handlePaymentInfoChange}
                          className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                          CVV *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={paymentInfo.cvv}
                            onChange={handlePaymentInfoChange}
                            className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="123"
                            maxLength={4}
                            required
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <FiLock className="text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => setCurrentStep('shipping')}
                    >
                      Back to Shipping
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isSubmitting}
                    >
                      Place Order
                    </Button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Order Confirmation */}
            {currentStep === 'confirmation' && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
                  <p className="text-gray-600">
                    Thank you for your purchase. Your order has been placed successfully.
                  </p>
                </div>
                
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Order Information</h3>
                  <p className="text-gray-600">Order #: 1234567890</p>
                  <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                </div>
                
                <Link href="/orders">
                  <Button variant="primary" size="lg">
                    View Order History
                  </Button>
                </Link>
                
                <div className="mt-4">
                  <Link href="/" className="text-primary hover:text-primary-dark">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="max-h-72 overflow-y-auto mb-4 pr-2">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-center py-3 border-b last:border-0">
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image
                        src={item.product.image_url || '/images/placeholder.jpg'}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover rounded"
                      />
                      <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className="text-sm font-medium">{item.product.name}</h4>
                      <p className="text-xs text-gray-500">
                        {item.product.categories?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
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
              
              <div className="flex justify-between mb-2">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold text-primary-dark">{formatPrice(orderTotal)}</span>
              </div>
              
              <div className="text-xs text-gray-500 mt-4">
                <p className="flex items-center justify-center">
                  <FiLock className="mr-1" /> Secure checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 