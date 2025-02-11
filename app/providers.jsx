"use client";

import { OrdersProvider } from "../components/OrdersContext";
import { ProductsProvider } from "../components/ProductsContext";

export function Providers({ children }) {
  return (
    <OrdersProvider>
      <ProductsProvider>{children}</ProductsProvider>
    </OrdersProvider>
  );
}
