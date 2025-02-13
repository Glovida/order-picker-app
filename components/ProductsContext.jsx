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

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(process.env.NEXT_PUBLIC_PRODUCT_API_URL);
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
        refreshProducts: fetchProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
