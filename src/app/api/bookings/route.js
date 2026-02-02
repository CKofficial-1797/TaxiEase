import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { createRazorpayOrder } from '@/lib/razorpay';
import { sendBookingConfirmation } from '@/lib/notifications';

// GET - Fetch all bookings (with pagination and filters)
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const search = searchParams.get('search');
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter['payment.status'] = paymentStatus;
    if (search) {
      filter.$or = [
        { bookingId: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } },
        { 'trip.route': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Fetch bookings with pagination
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const total = await Booking.countDocuments(filter);
    
    return NextResponse.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST - Create new booking
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      customer,
      trip,
      vehicle,
      pricing
    } = body;
    
    // Validate required fields
    if (!customer?.name || !customer?.phone) {
      return NextResponse.json(
        { success: false, error: 'Customer name and phone are required' },
        { status: 400 }
      );
    }
    
    if (!trip?.from || !trip?.to || !trip?.pickupDate || !trip?.pickupTime) {
      return NextResponse.json(
        { success: false, error: 'Trip details are required' },
        { status: 400 }
      );
    }
    
    if (!vehicle?.id || !vehicle?.name) {
      return NextResponse.json(
        { success: false, error: 'Vehicle details are required' },
        { status: 400 }
      );
    }
    
    if (!pricing?.totalAmount) {
      return NextResponse.json(
        { success: false, error: 'Pricing information is required' },
        { status: 400 }
      );
    }
    
    // Generate unique booking ID
    let bookingId;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      bookingId = Booking.generateBookingId();
      const existing = await Booking.findOne({ bookingId });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }
    
    if (!isUnique) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate unique booking ID' },
        { status: 500 }
      );
    }
    
    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(
      pricing.totalAmount,
      'INR',
      bookingId
    );
    
    if (!razorpayOrder.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to create payment order' },
        { status: 500 }
      );
    }
    
    // Create booking
    const booking = new Booking({
      bookingId,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email?.trim() || ''
      },
      trip: {
        from: trip.from.trim(),
        to: trip.to.trim(),
        route: `${trip.from} → ${trip.to}`,
        pickupDate: new Date(trip.pickupDate),
        pickupTime: trip.pickupTime,
        pickupAddress: trip.pickupAddress?.trim() || '',
        dropAddress: trip.dropAddress?.trim() || '',
        passengers: parseInt(trip.passengers) || 1,
        specialRequests: trip.specialRequests?.trim() || ''
      },
      vehicle: {
        id: vehicle.id,
        name: vehicle.name,
        type: vehicle.type,
        capacity: vehicle.capacity
      },
      pricing: {
        baseFare: pricing.totalAmount,
        totalAmount: pricing.totalAmount,
        currency: 'INR'
      },
      payment: {
        status: 'pending',
        method: 'razorpay',
        razorpayOrderId: razorpayOrder.order.id
      }
    });
    
    await booking.save();
    
    // Send confirmation notifications
    try {
      await sendBookingConfirmation({
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
      });
    } catch (notificationError) {
      console.error('❌ Notification error:', notificationError);
      // Don't fail the booking if notifications fail
    }
    
    return NextResponse.json({
      success: true,
      data: {
        booking: booking.getSummary(),
        payment: {
          orderId: razorpayOrder.order.id,
          amount: razorpayOrder.order.amount,
          currency: razorpayOrder.order.currency,
          key: process.env.RAZORPAY_KEY_ID
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
