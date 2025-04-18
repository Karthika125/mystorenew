'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiChevronRight, FiCheck, FiShoppingBag, FiArrowLeft, FiShield, FiMapPin, FiUser, FiPhone, FiMail, FiHome } from 'react-icons/fi';
import Button from '@/components/Button';
import RazorpayCheckout from '@/components/RazorpayCheckout';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

interface AddressForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const [address, setAddress] = useState<AddressForm>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  
  const [isFormValid, setIsFormValid] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Shipping options
  const shippingOptions = [
    { id: 'standard', name: 'Standard Delivery', price: 40, days: '3-5' },
    { id: 'express', name: 'Express Delivery', price: 100, days: '1-2' },
  ];
  
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0]);

  // Coupon functionality
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);
  
  // Total calculations
  const subtotal = totalPrice;
  const shippingCost = selectedShipping.price;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% tax
  const grandTotal = subtotal + shippingCost + tax - discount;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pre-fill user data if available
    if (user) {
      setAddress(prevAddress => ({
        ...prevAddress,
        email: user.email || '',
        fullName: user.user_metadata?.full_name || '',
      }));
    }
    
    // Check if cart is empty
    if (cartItems.length === 0) {
      router.push('/cart');
      toast.error('Your cart is empty');
    }

    // Simulate loading cart items from localStorage or context
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [user, cartItems, router]);

  useEffect(() => {
    // Validate form
    const { fullName, email, phone, address, city, state, pincode } = address;
    setIsFormValid(
      fullName.trim() !== '' &&
      email.trim() !== '' &&
      phone.trim() !== '' &&
      address.trim() !== '' &&
      city.trim() !== '' &&
      state.trim() !== '' &&
      pincode.trim() !== ''
    );
  }, [address]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleCouponApply = () => {
    // Mock coupon validation logic
    if (couponCode.toUpperCase() === 'WELCOME10') {
      const discountAmount = Math.round(subtotal * 0.1 * 100) / 100; // 10% discount
      setAppliedCoupon({ code: couponCode, discount: discountAmount });
      toast.success('Coupon applied successfully!');
    } else if (couponCode.toUpperCase() === 'FLAT100') {
      setAppliedCoupon({ code: couponCode, discount: 100 });
      toast.success('Coupon applied successfully!');
    } else {
      toast.error('Invalid coupon code');
    }
    setCouponCode('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  const goToPayment = () => {
    if (!isFormValid) {
      toast.error('Please fill all required fields');
      return;
    }
    setActiveStep(2);
  };

  const goBack = () => {
    setActiveStep(1);
  };

  const handlePaymentSuccess = (response: any) => {
    console.log('Payment successful:', response);
    // Clear cart and redirect to success page
    clearCart();
    router.push(`/checkout/success?orderId=${response.razorpay_order_id}`);
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
    toast.error('Payment failed. Please try again.');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Add some products to your cart to continue shopping</p>
        <Button onClick={() => router.push('/')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm mb-6">
            <ol className="flex items-center">
              <li className="flex items-center">
                <Link href="/" className="text-gray-500 hover:text-primary">Home</Link>
                <FiChevronRight className="mx-2 text-gray-400" />
              </li>
              <li className="flex items-center">
                <Link href="/cart" className="text-gray-500 hover:text-primary">Cart</Link>
                <FiChevronRight className="mx-2 text-gray-400" />
              </li>
              <li className="text-gray-800 font-medium">Checkout</li>
            </ol>
          </nav>

          <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

          {/* Checkout Steps */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                activeStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {activeStep > 1 ? <FiCheck className="w-5 h-5" /> : 1}
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                activeStep > 1 ? 'bg-primary' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                activeStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {activeStep > 2 ? <FiCheck className="w-5 h-5" /> : 2}
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                activeStep > 2 ? 'bg-primary' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                activeStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm font-medium">Shipping</span>
              <span className="text-sm font-medium">Payment</span>
              <span className="text-sm font-medium">Confirmation</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Form */}
            <div className="lg:col-span-2">
              {activeStep === 1 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-gray-700 text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={address.fullName}
                        onChange={handleAddressChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={address.email}
                        onChange={handleAddressChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={address.phone}
                        onChange={handleAddressChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-gray-700 text-sm font-medium mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={address.address}
                        onChange={handleAddressChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-gray-700 text-sm font-medium mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={address.city}
                        onChange={handleAddressChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-gray-700 text-sm font-medium mb-2">
                        State *
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={address.state}
                        onChange={handleAddressChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      >
                        <option value="">Select State</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        {/* Add more states as needed */}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="pincode" className="block text-gray-700 text-sm font-medium mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={address.pincode}
                        onChange={handleAddressChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mt-8 mb-4">Shipping Method</h3>
                  <div className="space-y-4">
                    {shippingOptions.map((option) => (
                      <div 
                        key={option.id}
                        className={`flex justify-between items-center p-4 border rounded-lg cursor-pointer ${
                          selectedShipping.id === option.id ? 'border-primary bg-primary-light/10' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedShipping(option)}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            selectedShipping.id === option.id ? 'border-primary' : 'border-gray-300'
                          }`}>
                            {selectedShipping.id === option.id && (
                              <div className="w-3 h-3 rounded-full bg-primary"></div>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{option.name}</p>
                            <p className="text-sm text-gray-500">Delivery in {option.days} business days</p>
                          </div>
                        </div>
                        <p className="font-medium">₹{option.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-between">
                    <Link href="/cart">
                      <Button variant="outline" leftIcon={<FiArrowLeft />}>
                        Back to Cart
                      </Button>
                    </Link>
                    <Button onClick={goToPayment} disabled={!isFormValid}>
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-6">Payment</h2>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <p>{address.fullName}</p>
                    <p>{address.address}</p>
                    <p>{address.city}, {address.state} {address.pincode}</p>
                    <p>Phone: {address.phone}</p>
                    <p>Email: {address.email}</p>
                    <button 
                      onClick={goBack}
                      className="text-primary text-sm mt-2 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  
                  <div className="flex items-center bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
                    <FiShield className="text-green-500 mr-3 text-lg" />
                    <div>
                      <p className="font-medium text-green-800">Secure Payment</p>
                      <p className="text-sm text-green-700">Your payment information is encrypted and secure.</p>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <p className="text-sm text-gray-600 mb-3">Choose a payment method:</p>
                    <div className="border border-primary rounded-lg p-4 bg-primary-light/5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full border border-primary flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                          </div>
                          <span className="ml-2 font-medium">Pay with Razorpay</span>
                        </div>
                        <Image 
                          src="https://razorpay.com/assets/razorpay-logo.svg" 
                          alt="Razorpay"
                          width={80}
                          height={24}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Safe and secure payments with credit/debit cards, UPI, and more.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button
                      onClick={goBack}
                      className="text-gray-600 hover:text-gray-800 flex items-center"
                    >
                      <FiArrowLeft className="mr-2" />
                      Back
                    </button>
                    
                    <RazorpayCheckout
                      orderId={`order_${Date.now()}`}
                      amount={grandTotal}
                      name={address.fullName}
                      email={address.email}
                      phone={address.phone}
                      isDisabled={!isFormValid}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <FiShoppingBag className="mr-2" />
                  Order Summary
                </h2>
                
                <div className="max-h-60 overflow-y-auto mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center py-3 border-b">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute top-0 right-0 bg-gray-800 text-white text-xs px-1 rounded-bl">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{item.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Coupon Code */}
                {!appliedCoupon ? (
                  <div className="flex mb-6">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      onClick={handleCouponApply}
                      disabled={!couponCode}
                      className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary-dark disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded-md mb-6">
                    <div className="flex items-center">
                      <FiCheck className="text-green-500 mr-2" />
                      <span className="text-sm font-medium">
                        {appliedCoupon.code}: ₹{appliedCoupon.discount.toFixed(2)} off
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
                
                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>₹{shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{appliedCoupon.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 