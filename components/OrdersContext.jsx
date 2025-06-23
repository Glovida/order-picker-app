// components/OrdersContext.jsx
"use client";

import React, { createContext, useContext, useState, useMemo } from "react";

const OrdersContext = createContext({
  orders: [],
  setOrders: () => {},
});

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  
  // Memoize context value to prevent unnecessary re-renders of consumers
  const contextValue = useMemo(() => ({
    orders,
    setOrders
  }), [orders]);

  return (
    <OrdersContext.Provider value={contextValue}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrdersContext);
}
