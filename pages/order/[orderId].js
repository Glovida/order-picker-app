// pages/order/[orderId].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import OrderDetailClient from "../../components/OrderDetailClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Define a simple inline Spinner component.
const Spinner = () => (
  <div
    style={{
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        display: "inline-block",
        width: "50px",
        height: "50px",
        border: "6px solid #dfe5f1",
        borderTopColor: "#2d3a55",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    ></div>
    <style jsx>{`
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </div>
);

export default function OrderDetail() {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);

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

  if (!order) return <Spinner />;

  return <OrderDetailClient order={order} apiUrl={API_URL} />;
}
