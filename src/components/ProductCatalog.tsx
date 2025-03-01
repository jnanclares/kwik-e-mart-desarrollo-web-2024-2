import React, { useState, useEffect, useMemo } from "react";
import { ProductCard } from "./ProductCard";
import { fetchProducts } from "../services/products";
import { ProductModal } from "./ProductModal";
import { Product } from "../models/products";
import { Search, Filter, ArrowUpDown, XCircle } from "lucide-react";
import { useCart } from "../context/CartContext";

export const ProductCatalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceMin, setPriceMin] = useState<number | "">("");
  const [priceMax, setPriceMax] = useState<number | "">("");
  const [sortBy, setSortBy] = useState<string>("default");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { dispatch } = useCart(); // Acceder al carrito

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    loadProducts();
  }, []);

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceMin("");
    setPriceMax("");
    setSortBy("default");
  };

  // Filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === "all" || product.category === selectedCategory;

        const matchesPrice =
          (priceMin === "" || product.price >= priceMin) &&
          (priceMax === "" || product.price <= priceMax);

        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0;
      });
  }, [searchQuery, selectedCategory, priceMin, priceMax, sortBy, products]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Todos los Productos</h2>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
          {/* Barra de búsqueda */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D7337] focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Filtro por categoría */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-gray-300 py-2 px-4 focus:ring-2 focus:ring-[#2D7337] focus:border-transparent"
            >
              <option value="all">Todas las categorías</option>
              <option value="beverages">Bebidas</option>
              <option value="snacks">Snacks</option>
              <option value="essentials">Esenciales</option>
            </select>
          </div>

          {/* Filtros de Precio (Inputs) */}
          <div className="flex items-center gap-2">
            <span>Precio:</span>
            <input
              type="number"
              placeholder="Mín"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value ? Number(e.target.value) : "")}
              className="w-20 py-1 px-2 border border-gray-300 rounded-md text-center"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Máx"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : "")}
              className="w-20 py-1 px-2 border border-gray-300 rounded-md text-center"
            />
          </div>

          {/* Ordenar por */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5 text-gray-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-gray-300 py-2 px-4 focus:ring-2 focus:ring-[#2D7337] focus:border-transparent"
            >
              <option value="default">Ordenar por...</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="reviews">Popularidad</option>
            </select>
          </div>

          {/* Botón de limpiar filtros con tooltip */}
          <div className="relative group">
            <button
              onClick={clearFilters}
              className="text-red-500 hover:text-red-600 transition"
            >
              <XCircle className="h-6 w-6" />
            </button>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Limpiar filtros
            </div>
          </div>
        </div>

        {/* Mostrar productos filtrados */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              ¡D'oh! No se encontraron productos. Intenta con otra búsqueda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
              key={product.id}
              onClick={(e) => {
                if (!(e.target as HTMLElement).closest(".add-to-cart-button")) {
                  setSelectedProduct(product);
                }
              }}
              className="cursor-pointer"
            >
              <ProductCard product={product} dispatch={dispatch} />
            </div>

            ))}
          </div>
        )}
      </div>

      {/* Modal de Producto */}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </section>
  );
};
