'use client';

import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CarsPage = () => {
  const cars = [
    {
      id: 'sedan',
      name: 'Sedan',
      type: 'SEDAN (AC)',
      capacity: '4+1 SEATER',
      price: '₹2,200 - ₹2,500',
      images: [
        { id: 1, src: '/sedan_int.png', alt: 'Sedan Exterior' },
        { id: 2, src: '/sedan_space.avif', alt: 'Sedan Interior' },
        { id: 3, src: '/sedan.png', alt: 'Sedan Rear' }
      ],
      features: [
        '4 Passengers',
        'Air Conditioning',
        '3 Luggage Capacity',
        'Smooth City Drive'
      ],
      idealFor: [
        'Couples',
        'Small Families',
        'Business Travelers',
        'Airport Transfers'
      ],
      description: 'Compact sedan known for reliability, comfort, and ideal for long rides. Ideal for daily commutes and city rides.'
    },
    {
      id: 'ertiga',
      name: 'Ertiga',
      type: 'SUV (AC)',
      capacity: '6+1 SEATER',
      price: '₹2,800 - ₹3,500',
      images: [
        { id: 1, src: '/ertiga.png', alt: 'Ertiga Exterior' },
        { id: 2, src: '/ertiga_int.png', alt: 'Ertiga Interior' },
        { id: 3, src: '/ertiga_space.webp', alt: 'Ertiga Rear' }
      ],
      features: [
        '6+1 Passengers',
        'Air Conditioning',
        'Large Luggage Space',
        'Comfortable Long Drives'
      ],
      idealFor: [
        'Large Families',
        'Group Travel',
        'Corporate Trips',
        'Long Distance Travel'
      ],
      description: 'Spacious SUV perfect for larger groups and families. Excellent comfort and ample luggage space for extended journeys.'
    },
    {
      id: 'crysta',
      name: 'Crysta',
      type: 'MINI BUS (AC)',
      capacity: '12+1 SEATER',
      price: '₹3,800 - ₹4,500',
      images: [
        { id: 1, src: './suv.avif', alt: 'Crysta Exterior' },
        { id: 2, src: '/suv_int.png', alt: 'Crysta Interior' }
      ],
      features: [
        '12+1 Passengers',
        'Air Conditioning',
        'Extra Large Luggage',
        'Group Comfort'
      ],
      idealFor: [
        'Large Groups',
        'Corporate Events',
        'Family Outings',
        'Wedding Parties'
      ],
      description: 'Perfect for large groups and corporate travel. Maximum comfort and space for group journeys with excellent amenities.'
    }
  ];

  const [selectedCar, setSelectedCar] = React.useState(0);
  const [selectedImage, setSelectedImage] = React.useState(0);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">
              Our <span className="text-orange-500">Vehicles</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from a diverse fleet designed to make every journey smooth, safe, and memorable.
            </p>
          </div>
        </section>

        {/* Vehicle Display */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                  {/* Image Gallery */}
                  <div className="md:w-1/2 p-8">
                    {/* Main Image */}
                    <div className="mb-4">
                      <div className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <div className="text-center relative w-full h-full">
                          <Image src={cars[selectedCar].images[selectedImage].src} alt={cars[selectedCar].images[selectedImage].alt} fill className="object-cover" />
                          {/* <p className="text-gray-600 font-medium">{cars[selectedCar].name}</p> */}
                        </div>
                      </div>
                    </div>
                    
                    {/* Thumbnails */}
                    <div className="flex space-x-3">
                      {cars[selectedCar].images.map((image, index) => (
                        <div
                          key={image.id}
                          className={`w-20 h-16 rounded-lg cursor-pointer border-2 ${
                            selectedImage === index ? 'border-yellow-500' : 'border-gray-200'
                          }`}
                          onClick={() => setSelectedImage(index)}
                        >
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                            <Image src={image.src} alt={image.alt} fill className="object-cover" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="md:w-1/2 p-8">
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-black mb-4">{cars[selectedCar].name}</h2>
                      <p className="text-gray-700 mb-6">{cars[selectedCar].description}</p>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-black mb-3">Features:</h3>
                      <ul className="space-y-2">
                        {cars[selectedCar].features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-gray-700">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Ideal For */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-black mb-3">Ideal For:</h3>
                      <div className="flex flex-wrap gap-2">
                        {cars[selectedCar].idealFor.map((item, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Book Button */}
                    <button
                      onClick={() => {
                        const car = cars[selectedCar];
                        const params = new URLSearchParams({
                          car: car.name,
                          type: car.type,
                          route: 'Delhi → Ludhiana', // Default route
                          price: car.price.split(' - ')[0].replace('₹', ''), // Get minimum price
                          capacity: car.capacity
                        });
                        window.location.href = `/checkout?${params.toString()}`;
                      }}
                      className="bg-blue-500 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 flex items-center"
                    >
                      Book This Vehicle
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Car Selection */}
              <div className="mt-8 flex justify-center space-x-4">
                {cars.map((car, index) => (
                  <button
                    key={car.id}
                    onClick={() => {
                      setSelectedCar(index);
                      setSelectedImage(0);
                    }}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                      selectedCar === index
                        ? 'bg-yellow-500 text-black'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {car.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors duration-300"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        </a>
        <a
          href="tel:+919876543210"
          className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
      </div>

      <Footer />
    </div>
  );
};

export default CarsPage;
