import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

// Your Razorpay key secret
const keySecret = process.env.RAZORPAY_KEY_SECRET || 'QfJLmvZ1gUpbwTsX38jJfaG9';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
    
    // Validate required parameters
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification parameters' },
        { status: 400 }
      );
    }

    // Create a signature to verify the payment
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    
    // Verify the signature
    const isAuthentic = expectedSignature === razorpay_signature;
    
    if (isAuthentic) {
      // Update order status in your database
      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'completed',
          payment_id: razorpay_payment_id,
          updated_at: new Date().toISOString()
        })
        .eq('order_id', razorpay_order_id);
      
      if (error) {
        console.error('Error updating order status:', error);
        return NextResponse.json(
          { success: true, verified: true, error: 'Failed to update order status' },
          { status: 200 }
        );
      }
      
      return NextResponse.json({
        success: true,
        verified: true,
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id
      });
    } else {
      return NextResponse.json(
        { success: false, verified: false, error: 'Invalid signature' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
} 