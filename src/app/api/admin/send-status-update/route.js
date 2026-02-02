import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { sendStatusUpdate } from '@/lib/notifications';
import { verifyAdminToken } from '@/lib/adminAuth';

// POST - Send status update notification
export async function POST(request) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    const { bookingId, newStatus } = body;
    
    // Validate required fields
    if (!bookingId || !newStatus) {
      return NextResponse.json(
        { success: false, error: 'Booking ID and new status are required' },
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
      }, newStatus);
      
      return NextResponse.json({
        success: true,
        message: 'Status update notification sent successfully'
      });
    } catch (notificationError) {
      console.error('❌ Status update notification error:', notificationError);
      return NextResponse.json(
        { success: false, error: 'Failed to send notification' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('❌ Error sending status update notification:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
