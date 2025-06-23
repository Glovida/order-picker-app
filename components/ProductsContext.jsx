"use client";
import React, { createContext, useContext, useState, useMemo, useCallback, useEffect, useRef } from "react";

const ProductsContext = createContext({
  products: [],
  setProducts: () => {},
  isLoading: false,
  error: null,
  refreshProducts: () => {}, // New function to manually trigger a refresh
  fetchProducts: () => {},
});

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Use ref to track current fetch operation and prevent concurrent calls
  const fetchPromiseRef = useRef(null);
  const abortControllerRef = useRef(null);

  const fetchProducts = useCallback(async (forceRefresh = false, signal) => {
    // Prevent concurrent fetch calls
    if (fetchPromiseRef.current && !forceRefresh) {
      return fetchPromiseRef.current;
    }

    // Cancel previous request if exists
    if (abortControllerRef.current && !forceRefresh) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController if none provided
    const controller = signal ? null : new AbortController();
    const fetchSignal = signal || controller?.signal;
    
    if (controller) {
      abortControllerRef.current = controller;
    }

    const fetchPromise = (async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use enhanced fetch caching strategies
        const cacheStrategy = forceRefresh 
          ? { cache: 'no-store', signal: fetchSignal } // Force fresh data when refreshing
          : { next: { revalidate: 300 }, signal: fetchSignal }; // Cache for 5 minutes otherwise
        
        const res = await fetch(process.env.NEXT_PUBLIC_PRODUCT_API_URL, cacheStrategy);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        if (data.products) {
          // Deduplicate products by SKU to prevent React key conflicts
          const uniqueProducts = data.products.reduce((acc, product) => {
            if (!acc.some(p => p.sku === product.sku)) {
              acc.push(product);
            }
            return acc;
          }, []);
          setProducts(uniqueProducts);
          setError(null);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching products in ProductsProvider:", error);
          setError(error.message || "Failed to fetch products");
        }
      } finally {
        setIsLoading(false);
        fetchPromiseRef.current = null;
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    })();

    fetchPromiseRef.current = fetchPromise;
    return fetchPromise;
  }, []);

  // Memoize refreshProducts function to prevent recreation on every render
  const refreshProducts = useCallback(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  // Auto-fetch products on mount
  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(false, controller.signal);
    
    return () => {
      controller.abort();
    };
  }, [fetchProducts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Memoize context value to prevent unnecessary re-renders of consumers
  const contextValue = useMemo(() => ({
    products,
    setProducts,
    isLoading,
    error,
    fetchProducts,
    refreshProducts,
  }), [products, setProducts, isLoading, error, fetchProducts, refreshProducts]);

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
