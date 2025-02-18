import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../models';

const FEATURED_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Squishee Classic',
    price: 2.99,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    rating: 5,
    reviews: 128,
    description: 'The original brain-freezing Squishee drink',
    featured: true
  },
  {
    id: '2',
    name: 'Hot Dogs',
    price: 3.99,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1619740455993-9d77a82c0649?auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 89,
    description: 'Rolling since the morning... maybe',
    featured: true,
    onSale: true,
    salePrice: 2.99
  },
  {
    id: '3',
    name: 'Pink Donuts',
    price: 1.99,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80',
    rating: 5,
    reviews: 256,
    description: 'Homer\'s favorite!',
    featured: true
  },
  {
    id: '4',
    name: 'Duff Beer',
    price: 4.99,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 167,
    description: 'Can\'t get enough of that wonderful Duff!',
    featured: true
  }
];

export const FeaturedProducts = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};