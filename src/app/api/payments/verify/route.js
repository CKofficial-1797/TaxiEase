import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { sendStatusUpdate } from '@/lib/notifications';

// POST - Verify Razorpay payment
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId
    } = body;
    
    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return NextResponse.json(
        { success: false, error: 'Missing required payment verification data' },
        { status: 400 }
      );
    }
    
    // Find the booking
    const booking = await Booking.findOne({ bookingId });
    
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Verify payment signature
    const isSignatureValid = await verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );
    
    if (!isSignatureValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      );
    }
    
    // Update booking with payment information
    booking.payment.status = 'paid';
    booking.payment.razorpayPaymentId = razorpay_payment_id;
    booking.payment.razorpaySignature = razorpay_signature;
    booking.payment.paidAt = new Date();
    booking.status = 'confirmed';
    
    await booking.save();
    
    // Send status update notification
    try {
      await sendStatusUpdate({
        bookingId: booking.bookingId,
        name: booking.customer.name,
        email: booking.customer.email,
        phone: booking.customer.phone,
        region: booking.trip.route,
        pickupDate: booking.trip.pickupDate,
        pickupTime: booking.trip.pickupTime,
        vehicleType: booking.vehicle.name,
        totalPrice: booking.pricing.totalAmount,
        status: booking.status,
        bookingDate: booking.createdAt
      }, 'confirmed');
    } catch (notificationError) {
      console.error('❌ Status update notification error:', notificationError);
      // Don't fail the payment verification if notifications fail
    }
    
    return NextResponse.json({
      success: true,
      data: {
        booking: booking.getSummary(),
        payment: {
          status: 'paid',
          paymentId: razorpay_payment_id,
          paidAt: booking.payment.paidAt
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
