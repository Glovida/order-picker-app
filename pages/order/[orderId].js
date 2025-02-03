// pages/order/[orderId].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import OrderDetailClient from "../../components/OrderDetailClient";

export default function OrderDetail() {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);
  // Replace with your actual Google Apps Script Web App URL.
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

useEffect(() => {
  if (orderId) {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        // Convert both values to strings and trim them before comparing.
        const found = data.orders.find(
          (o) => String(o.orderNumber).trim() === String(orderId).trim()
        );
        if (found) {
          setOrder(found);
        }
      })
      .catch((err) => console.error("Error fetching order:", err));
  }
}, [orderId]);

  if (!order) return <p>Loading order details...</p>;

  return <OrderDetailClient order={order} apiUrl={API_URL} />;
}
