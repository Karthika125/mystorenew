import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

// Initialize Razorpay with your key_id and key_secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_hGNciVI2I1xDMg',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'QfJLmvZ1gUpbwTsX38jJfaG9',
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { amount, currency = 'INR', receipt, notes } = data;
    
    // Validate required parameters
    if (!amount) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      );
    }

    // Create a Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Razorpay amount is in paisa (1/100 rupee)
      currency,
      receipt,
      notes,
      payment_capture: 1,
    };
    
    console.log('Creating Razorpay order with options:', options);
    
    const order = await razorpay.orders.create(options);
    
    // Store order info in your database if needed
    if (order.id) {
      // Save to Supabase orders table
      const { data, error } = await supabase
        .from('orders')
        .insert({
          order_id: order.id,
          amount: amount,
          currency: currency,
          receipt: receipt,
          status: 'created',
          payment_status: 'pending',
        });
        
      if (error) {
        console.error('Error saving order to database:', error);
      }
    }
    
    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
} 