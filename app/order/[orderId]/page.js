"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import OrderDetailClient from "../../../components/OrderDetailClient";
import Spinner from "../../../components/Spinner";
import { useOrders } from "../../../components/OrdersContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OrderDetail() {
  const { orderId } = useParams();
  const { orders } = useOrders();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Try to find the order in the context
    if (orders && orders.length > 0) {
      const found = orders.find(
        (o) => String(o.orderNumber).trim() === String(orderId).trim()
      );
      if (found) {
        setOrder(found);
        return;
      }
    }
    // If not found in context, fetch the order data from the API
    if (orderId) {
      fetch(API_URL)
        .then((res) => res.json())
        .then((data) => {
          const found = data.orders.find(
            (o) => String(o.orderNumber).trim() === String(orderId).trim()
          );
          if (found) {
            setOrder(found);
          }
        })
        .catch((err) => console.error("Error fetching order:", err));
    }
  }, [orderId, orders]);

  if (!order) return <Spinner minHeight="100vh" />;

  return <OrderDetailClient order={order} apiUrl={API_URL} />;
}
