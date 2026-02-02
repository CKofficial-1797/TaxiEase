'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BookingTracker = () => {
  const params = useParams();
  const bookingId = params.bookingId as string;
  const [booking, setBooking] = useState<{
    bookingId: string;
    customer: { name: string; phone: string; email: string };
    trip: { route: string; pickupDate: string; pickupTime: string; passengers: number; specialRequests?: string };
    vehicle: { name: string };
    pricing: { totalAmount: number };
    payment: { status: string };
    status: string;
    driver?: { name: string; phone: string; vehicleNumber: string };
    createdAt: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBooking = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/bookings/${bookingId}`);
      const data = await response.json();

      if (data.success) {
        setBooking(data.data);
      } else {
        setError('Booking not found');
      }
    } catch {
      setError('Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  }, [bookingId]);
  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId, fetchBooking]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'in-progress': return '🚗';
      case 'completed': return '🎉';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending': return 'Your booking is being processed. We will contact you shortly.';
      case 'confirmed': return 'Your booking is confirmed! Driver details will be shared 1 hour before pickup.';
      case 'in-progress': return 'Your trip is in progress. Have a safe journey!';
      case 'completed': return 'Trip completed successfully! Thank you for choosing TaxiEase.';
      case 'cancelled': return 'Your booking has been cancelled. Contact us for refund details.';
      default: return 'Booking status unknown.';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading booking details...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Not Found</h2>
                <p className="text-gray-600 mb-4">
                  {error || 'The booking you are looking for does not exist or has been removed.'}
                </p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-black mb-2">Booking Status</h1>
              <p className="text-gray-600">Track your one-way trip booking</p>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Booking ID: {booking.bookingId}</h2>
                  <p className="text-gray-600">Created on {new Date(booking.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                    <span className="mr-2">{getStatusIcon(booking.status)}</span>
                    {booking.status.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{getStatusMessage(booking.status)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Trip Details */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Route:</span>
                    <span className="font-medium">{booking.trip.route}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pickup Date:</span>
                    <span className="font-medium">{new Date(booking.trip.pickupDate).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pickup Time:</span>
                    <span className="font-medium">{booking.trip.pickupTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passengers:</span>
                    <span className="font-medium">{booking.trip.passengers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="font-medium">{booking.vehicle.name}</span>
                  </div>
                </div>
              </div>

              {/* Customer & Payment */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer & Payment</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{booking.customer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{booking.customer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium text-green-600">₹{booking.pricing.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.payment.status)}`}>
                      {booking.payment.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Information (if assigned) */}
            {booking.driver && booking.driver.name && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-gray-600">Driver Name:</span>
                    <p className="font-medium">{booking.driver.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-medium">{booking.driver.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Vehicle Number:</span>
                    <p className="font-medium">{booking.driver.vehicleNumber}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Special Requests */}
            {booking.trip.specialRequests && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Requests</h3>
                <p className="text-gray-700">{booking.trip.specialRequests}</p>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-yellow-50 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 mb-2">For any queries or changes:</p>
                  <p className="font-medium">📞 +91 98765 43210</p>
                  <p className="font-medium">📧 info@taxiease.com</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-2">Booking Reference:</p>
                  <p className="font-mono text-sm bg-white px-3 py-2 rounded border">{booking.bookingId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingTracker;
