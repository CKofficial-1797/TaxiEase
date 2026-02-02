import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-yellow-500 text-black shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">TaxiEase</h1>
              <p className="text-gray-800 text-sm">One-Way Trip Booking</p>
            </div>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-gray-800 transition-colors font-medium">Home</Link>
            <Link href="/cars" className="hover:text-gray-800 transition-colors font-medium">Cars</Link>
            <a href="https://www.carondesire.com/contact" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800 transition-colors font-medium">Contact</a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
