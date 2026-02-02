import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';

// GET - Fetch single booking by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    const booking = await Booking.findOne({ bookingId: id });
    
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: booking
    });
    
  } catch (error) {
    console.error('❌ Error fetching booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

// PUT - Update booking
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await request.json();
    
    const booking = await Booking.findOne({ bookingId: id });
    
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Update allowed fields
    const allowedUpdates = [
      'status',
      'driver',
      'notes',
      'trip.pickupAddress',
      'trip.dropAddress',
      'trip.specialRequests'
    ];
    
    const updates = {};
    for (const [key, value] of Object.entries(body)) {
      if (allowedUpdates.includes(key) || key.startsWith('driver.') || key.startsWith('trip.')) {
        updates[key] = value;
      }
    }
    
    Object.assign(booking, updates);
    await booking.save();
    
    return NextResponse.json({
      success: true,
      data: booking
    });
    
  } catch (error) {
    console.error('❌ Error updating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel booking
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    const booking = await Booking.findOne({ bookingId: id });
    
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Only allow cancellation if booking is not completed
    if (booking.status === 'completed') {
      return NextResponse.json(
        { success: false, error: 'Cannot cancel completed booking' },
        { status: 400 }
      );
    }
    
    booking.status = 'cancelled';
    await booking.save();
    
    return NextResponse.json({
      success: true,
      data: booking
    });
    
  } catch (error) {
    console.error('❌ Error cancelling booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}
