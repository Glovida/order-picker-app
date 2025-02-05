// components/OrdersContext.jsx
"use client";

import React, { createContext, useContext, useState } from "react";

const OrdersContext = createContext({
  orders: [],
  setOrders: () => {},
});

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  return (
    <OrdersContext.Provider value={{ orders, setOrders }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrdersContext);
}
