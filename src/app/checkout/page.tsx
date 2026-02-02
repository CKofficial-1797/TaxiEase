'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CheckoutForm = () => {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pickupDate: '',
    pickupTime: '',
    pickupAddress: '',
    dropAddress: '',
    passengers: 1,
    specialRequests: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get booking details from URL params
  const carName = searchParams.get('car') || 'Sedan';
  const carType = searchParams.get('type') || 'SEDAN (AC)';
  const route = searchParams.get('route') || 'Delhi → Ludhiana';
  const price = searchParams.get('price') || '4500';
  const capacity = searchParams.get('capacity') || '4+1 SEATER';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create booking
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email
          },
          trip: {
            from: route.split(' → ')[0],
            to: route.split(' → ')[1],
            pickupDate: formData.pickupDate,
            pickupTime: formData.pickupTime,
            pickupAddress: formData.pickupAddress,
            dropAddress: formData.dropAddress,
            passengers: formData.passengers,
            specialRequests: formData.specialRequests
          },
          vehicle: {
            id: carName.toLowerCase(),
            name: carName,
            type: carType,
            capacity: capacity
          },
          pricing: {
            totalAmount: parseInt(price)
          }
        }),
      });

      const bookingData = await bookingResponse.json();

      if (bookingData.success) {
        // Initialize Razorpay payment
        const options = {
          key: bookingData.data.payment.key,
          amount: bookingData.data.payment.amount,
          currency: bookingData.data.payment.currency,
          name: 'TaxiEase',
          description: `Booking for ${route}`,
          order_id: bookingData.data.payment.orderId,
          handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
            try {
              // Verify payment
              const verifyResponse = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  bookingId: bookingData.data.booking.bookingId
                }),
              });

              const verifyData = await verifyResponse.json();

              if (verifyData.success) {
                // Redirect to booking tracking page
                window.location.href = `/track/${bookingData.data.booking.bookingId}`;
              } else {
                alert('Payment verification failed. Please contact support.');
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              alert('Payment verification failed. Please contact support.');
            }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone
          },
          theme: {
            color: '#f59e0b'
          }
        };

        const razorpay = new (window as unknown as { 
          Razorpay: new (options: {
            key: string;
            amount: number;
            currency: string;
            name: string;
            description: string;
            order_id: string;
            handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
            prefill: { name: string; email: string; contact: string };
            theme: { color: string };
          }) => { open: () => void }
        }).Razorpay(options);
        razorpay.open();
      } else {
        setError(bookingData.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-black mb-2">Complete Your Booking</h1>
              <p className="text-gray-600">Fill in your details to confirm your taxi booking</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Booking Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-black mb-6">Booking Details</h2>
                  
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    {/* Trip Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pickup Date *
                        </label>
                        <input
                          type="date"
                          name="pickupDate"
                          value={formData.pickupDate}
                          onChange={handleInputChange}
                          min={today}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pickup Time *
                        </label>
                        <input
                          type="time"
                          name="pickupTime"
                          value={formData.pickupTime}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pickup Address *
                      </label>
                      <input
                        type="text"
                        name="pickupAddress"
                        value={formData.pickupAddress}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="Enter pickup location"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Drop Address *
                      </label>
                      <input
                        type="text"
                        name="dropAddress"
                        value={formData.dropAddress}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="Enter drop location"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Passengers *
                      </label>
                      <select
                        name="passengers"
                        value={formData.passengers}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      >
                        <option value={1}>1 Passenger</option>
                        <option value={2}>2 Passengers</option>
                        <option value={3}>3 Passengers</option>
                        <option value={4}>4 Passengers</option>
                        <option value={5}>5 Passengers</option>
                        <option value={6}>6 Passengers</option>
                        <option value={7}>7 Passengers</option>
                        <option value={8}>8+ Passengers</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Requests
                      </label>
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="Any special requirements or requests..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-yellow-500 text-black py-3 px-6 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing...' : 'Confirm Booking'}
                    </button>
                  </form>
                </div>
              </div>

               {/* Booking Summary */}
               <div className="lg:col-span-1">
                 <div className="bg-white rounded-lg shadow-md p-6 sticky top-4 max-h-screen overflow-y-auto">
                  <h3 className="text-lg font-semibold text-black mb-4">Booking Summary</h3>
                  
                  {/* Vehicle Details */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-3">
                       <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                         <Image
                           src={
                             carName.toLowerCase() === "crysta"
                               ? "/suv.avif"
                               : `/${carName.toLowerCase()}.png`
                           }
                           alt={carName}
                           fill
                           className="object-cover"
                         />
                       </div>
                      <div>
                        <h4 className="font-semibold text-black">{carName}</h4>
                        <p className="text-sm text-gray-600">{carType}</p>
                        <p className="text-sm text-gray-600">({capacity})</p>
                      </div>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-black mb-2">Route</h4>
                    <div className="flex items-center space-x-2">
                      <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                        {route}
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-black mb-2">Pricing</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Fare</span>
                        <span className="font-semibold">₹{price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Driver & Fuel</span>
                        <span className="text-green-600">Included</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Toll Charges</span>
                        <span className="text-green-600">Included</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Amount</span>
                        <span className="text-yellow-600">₹{price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-semibold text-black mb-2">Important Notes</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Payment to be made to driver</li>
                      <li>• Confirmation call within 30 minutes</li>
                      <li>• Free cancellation up to 2 hours before</li>
                      <li>• Driver details shared 1 hour before pickup</li>
                    </ul>
                  </div>
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

const CheckoutPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading booking form...</p>
      </div>
    </div>}>
      <CheckoutForm />
    </Suspense>
  );
};

export default CheckoutPage;
