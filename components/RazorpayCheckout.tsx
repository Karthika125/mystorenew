'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import Button from '@/components/Button';
import { toast } from 'react-hot-toast';

interface RazorpayCheckoutProps {
  orderId: string;
  amount: number;
  name: string;
  email: string;
  phone: string;
  isDisabled?: boolean;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
  orderId,
  amount,
  name,
  email,
  phone,
  isDisabled = false,
  onSuccess,
  onError,
}) => {
  const router = useRouter();
  
  // Convert amount to paise (Razorpay accepts amount in smallest currency unit)
  const amountInPaise = Math.round(amount * 100);

  const handlePayment = async () => {
    if (isDisabled) return;
    
    if (!window.Razorpay) {
      toast.error('Razorpay SDK failed to load. Please try again later.');
      return;
    }

    try {
      // Create an order first
      console.log('Creating order for amount:', amount);
      const orderResponse = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: {
            name: name,
            email: email,
            phone: phone
          },
        }),
      });
      
      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        toast.error('Failed to create order: ' + (errorData.error || 'Unknown error'));
        return;
      }
      
      const orderData = await orderResponse.json();
      console.log('Order created successfully:', orderData);
      
      // Now initialize Razorpay with the order
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_hGNciVI2I1xDMg',
        amount: orderData.amount, // Amount from the created order
        currency: orderData.currency,
        name: 'MyStore',
        description: 'Purchase from MyStore',
        image: '/logo.png', // Replace with your store logo
        order_id: orderData.id,
        prefill: {
          name: name,
          email: email,
          contact: phone,
        },
        notes: {
          address: 'MyStore Corporate Office',
        },
        theme: {
          color: '#6366F1', // Primary color of your application
        },
        handler: async function (response: any) {
          // Handle successful payment
          console.log('Payment successful', response);
          
          // Verify the payment with your backend
          try {
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              }),
            });
            
            const verifyData = await verifyResponse.json();
            
            if (verifyData.verified) {
              console.log('Payment verified successfully');
              toast.success('Payment successful!');
              
              // Call the success callback if provided
              if (onSuccess) {
                onSuccess(response);
              } else {
                // Default behavior - redirect to success page
                router.push(`/checkout/success?orderId=${response.razorpay_order_id}&paymentId=${response.razorpay_payment_id}`);
              }
            } else {
              console.error('Payment verification failed', verifyData);
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Error verifying payment:', error);
            toast.error('Error processing payment confirmation');
          }
        },
        modal: {
          ondismiss: function() {
            toast.error('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error initializing Razorpay', error);
      toast.error('Failed to initialize payment. Please try again.');
      if (onError) onError(error);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onError={() => {
          toast.error('Razorpay SDK failed to load. Please try again later.');
        }}
      />
      
      <Button
        onClick={handlePayment}
        disabled={isDisabled}
        className="w-full py-3"
      >
        Pay ₹ {amount.toFixed(2)}
      </Button>
    </>
  );
};

export default RazorpayCheckout; 