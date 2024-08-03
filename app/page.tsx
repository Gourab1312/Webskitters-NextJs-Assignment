import React from 'react';
import ProductGrid from './components/ProductGrid';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Product Grid</h1>
      <ProductGrid />
    </main>
  );
}