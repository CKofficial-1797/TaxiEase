'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import RouteSelection from '@/components/RouteSelection';
import CarCards from '@/components/CarCards';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [from, setFrom] = useState<string>('Delhi');
  const [to, setTo] = useState<string>('Ludhiana');

  const handleRouteChange = (newFrom: string, newTo: string) => {
    setFrom(newFrom);
    setTo(newTo);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <RouteSelection onRouteChange={handleRouteChange} />
        <CarCards from={from} to={to} />
      </main>
      <Footer />
    </div>
  );
}