import React, { useState, useEffect } from 'react';
import { 
    getAllProducts,
    Product
  } from '../../services/offers';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function CategoryDistribution() {
  // Calculate category distribution
  const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadData();
      }, []);
    
      const loadData = async () => {
        try {
          const [productsData] = await Promise.all([
            getAllProducts()
          ]);
          setProducts(productsData);
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setLoading(false);
        }
      };
  const categoryCount = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(categoryCount).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}