// app/providers.jsx
"use client";

import { OrdersProvider } from "../components/OrdersContext";

export function Providers({ children }) {
  return <OrdersProvider>{children}</OrdersProvider>;
}
