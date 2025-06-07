"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const ProductsContext = createContext({
  products: [],
  setProducts: () => {},
  isLoading: false,
  refreshProducts: () => {}, // New function to manually trigger a refresh
});

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      
      // Use enhanced fetch caching strategies
      const cacheStrategy = forceRefresh 
        ? { cache: 'no-store' } // Force fresh data when refreshing
        : { next: { revalidate: 300 } }; // Cache for 5 minutes otherwise
      
      const res = await fetch(process.env.NEXT_PUBLIC_PRODUCT_API_URL, cacheStrategy);
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching products in ProductsProvider:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products initially
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        setProducts,
        isLoading,
        refreshProducts: () => fetchProducts(true),
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
