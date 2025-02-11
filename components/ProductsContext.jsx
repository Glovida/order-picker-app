"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const ProductsContext = createContext({
  products: [],
  setProducts: () => {},
  isLoading: false,
});

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Initialise as true

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_PRODUCT_API_URL);
        const data = await res.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching products in ProductsProvider:", error);
      } finally {
        setIsLoading(false); // Ensure this runs whether or not the fetch succeeds
      }
    }
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, setProducts, isLoading }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
