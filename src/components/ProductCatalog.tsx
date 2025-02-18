import React, { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../models';
import { Search, Filter } from 'lucide-react';

const ALL_PRODUCTS: Product[] = [
  // Featured Products
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
  // More products
  {
    id: '7',
    name: 'Lard Lad Donuts',
    price: 4.99,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80',
    rating: 5,
    reviews: 256,
    description: 'Big as your head!',
  },
  {
    id: '8',
    name: 'Radioactive Man Comics',
    price: 9.99,
    category: 'essentials',
    image: 'https://images.unsplash.com/photo-1612036782180-6f0822045d23?auto=format&fit=crop&w=800&q=80',
    rating: 5,
    reviews: 42,
    description: 'Up and atom!',
  },
  {
    id: '9',
    name: 'Flaming Moe',
    price: 6.99,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 156,
    description: 'Happiness is just a Flaming Moe away',
  },
];

export const ProductCatalog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">All Products</h2>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D7337] focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-gray-300 py-2 px-4 focus:ring-2 focus:ring-[#2D7337] focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="beverages">Beverages</option>
              <option value="snacks">Snacks</option>
              <option value="essentials">Essentials</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              D'oh! No products found. Please try a different search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};