'use client';

import React, { useState } from 'react';

// const locations = ['Delhi', 'Ludhiana', 'Panawal']; // Not used in current implementation

interface RouteSelectionProps {
  onRouteChange: (from: string, to: string) => void;
}

const RouteSelection: React.FC<RouteSelectionProps> = ({ onRouteChange }) => {
  const [from, setFrom] = useState<string>('Delhi');
  const [to, setTo] = useState<string>('Ludhiana');
  const [isSwapped, setIsSwapped] = useState<boolean>(false);

  // Get available cities based on swap state
  const getAvailableFromCities = (): string[] => {
    if (isSwapped) {
      return ['Ludhiana', 'Chandigarh']; // When swapped, From has 2 options
    } else {
      return ['Delhi']; // Default: From is fixed as Delhi
    }
  };

  const getAvailableToCities = (): string[] => {
    if (isSwapped) {
      return ['Delhi']; // When swapped, To is fixed as Delhi
    } else {
      return ['Ludhiana', 'Chandigarh']; // Default: To has 2 options
    }
  };

  const handleFromChange = (value: string) => {
    setFrom(value);
    onRouteChange(value, to);
  };

  const handleToChange = (value: string) => {
    setTo(value);
    onRouteChange(from, value);
  };

  const handleSwap = () => {
    setIsSwapped(!isSwapped);
    if (!isSwapped) {
      // Swapping to: From = Ludhiana/Chandigarh, To = Delhi
      setFrom('Ludhiana');
      setTo('Delhi');
      onRouteChange('Ludhiana', 'Delhi');
    } else {
      // Swapping back to: From = Delhi, To = Ludhiana/Chandigarh
      setFrom('Delhi');
      setTo('Ludhiana');
      onRouteChange('Delhi', 'Ludhiana');
    }
  };

  const getRouteInfo = (from: string, to: string) => {
    const routeMap: { [key: string]: { distance: string; duration: string } } = {
      'Delhi-Ludhiana': { distance: '320 km', duration: '5-6 hours' },
      'Delhi-Chandigarh': { distance: '320 km', duration: '5-6 hours' },
      'Ludhiana-Delhi': { distance: '320 km', duration: '5-6 hours' },
      'Chandigarh-Delhi': { distance: '320 km', duration: '5-6 hours' }
    };
    
    return routeMap[`${from}-${to}`] || { distance: 'N/A', duration: 'N/A' };
  };

  const routeInfo = getRouteInfo(from, to);
  const availableToCities = getAvailableToCities();
  const availableFromCities = getAvailableFromCities();

  return (
    <section id="routes" className="bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Route Display */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-yellow-500 text-black px-6 py-3 rounded-full font-semibold text-lg">
              {from}
            </div>
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="bg-yellow-500 text-black px-6 py-3 rounded-full font-semibold text-lg">
              {to}
            </div>
          </div>

          {/* Selection Controls */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between gap-4">
              {/* From Selection */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <select
                  value={from}
                  onChange={(e) => handleFromChange(e.target.value)}
                  disabled={availableFromCities.length === 1}
                  className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm ${
                    availableFromCities.length === 1 ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                  }`}
                >
                  {availableFromCities.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="flex flex-col items-center justify-center pt-6">
                <button
                  onClick={handleSwap}
                  className="w-8 h-8 bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center transition-colors duration-300"
                  title="Swap locations"
                >
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>

              {/* To Selection */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <select
                  value={to}
                  onChange={(e) => handleToChange(e.target.value)}
                  disabled={availableToCities.length === 1}
                  className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm ${
                    availableToCities.length === 1 ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                  }`}
                >
                  {availableToCities.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Route Info */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>{routeInfo.distance}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{routeInfo.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RouteSelection;
