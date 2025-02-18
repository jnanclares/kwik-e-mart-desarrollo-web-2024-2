import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../models';
import { Clock } from 'lucide-react';

const DAILY_DEALS: Product[] = [
  {
    id: '5',
    name: 'Buzz Cola',
    price: 2.49,
    salePrice: 1.49,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 75,
    description: 'The cola that gives you buzz!',
    onSale: true,
    dailyDeal: true
  },
  {
    id: '6',
    name: 'Krusty Burger',
    price: 5.99,
    salePrice: 3.99,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 122,
    description: 'Approved by Krusty himself!',
    onSale: true,
    dailyDeal: true
  }
];

export const DailyDeals = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Clock className="h-6 w-6 text-[#CC0000]" />
          <h2 className="text-3xl font-bold text-center">Daily Deals</h2>
        </div>
        <p className="text-center text-gray-600 mb-8">
          "These prices are crazy! Please buy something, anything!" - Apu
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {DAILY_DEALS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};