// pages/index.js
import { useEffect, useState } from "react";
import Link from "next/link";

// Helper function to format an ISO date string to Singapore time (dd/mm/yyyy hh:mm)
function formatSingaporeTime(dateString) {
  const options = {
    timeZone: "Asia/Singapore",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  // Remove any stray comma that may appear between the date and time.
  return new Date(dateString).toLocaleString("en-GB", options).replace(",", "");
}

export default function Home() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // Replace with your actual Google Apps Script Web App URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) {
          setOrders(data.orders);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setIsLoading(false);
      });
  }, []);

  // Filter orders based on search input (matching order number or tracking number)
  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true; // include all orders if search is empty
    const orderNumber = String(order.orderNumber || "").toLowerCase();
    const trackingNumber = String(order.trackingNumber || "").toLowerCase();
    return orderNumber.includes(term) || trackingNumber.includes(term);
  });

  // Separate orders based on status (normalize status to lowercase)
  const pendingOrders = filteredOrders.filter(
    (order) => String(order.status || "").toLowerCase() === "pending"
  );
  const doneOrders = filteredOrders.filter(
    (order) => String(order.status || "").toLowerCase() === "done"
  );

  // Group pending orders by platform
  const pendingByPlatform = pendingOrders.reduce((acc, order) => {
    const platform = order.platform;
    if (!acc[platform]) acc[platform] = [];
    acc[platform].push(order);
    return acc;
  }, {});

  // Define the desired order of platforms for pending orders
  const platformOrder = ["Shopee", "Lazada", "Shopify", "TikTok"];

  if (isLoading) {
    return (
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Search Bar */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by Order or Tracking Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "10px",
            fontSize: "1rem",
          }}
        />
      </div>

      {/* Pending Orders Section */}
      {pendingOrders.length > 0 && (
        <div>
          <h1>Pending Orders</h1>
          {platformOrder.map((platform) => {
            if (
              pendingByPlatform[platform] &&
              pendingByPlatform[platform].length
            ) {
              return (
                <div key={platform}>
                  <h2>{platform}</h2>
                  <ul>
                    {pendingByPlatform[platform].map((order) => (
                      <li key={order.orderNumber}>
                        <Link href={`/order/${order.orderNumber}`}>
                          Order {order.orderNumber} -{" "}
                          {formatSingaporeTime(order.dateTimeConversion)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            return null;
          })}
          {/* Render any pending orders from platforms not in our desired order */}
          {Object.keys(pendingByPlatform)
            .filter((platform) => !platformOrder.includes(platform))
            .map((platform) => (
              <div key={platform}>
                <h2>{platform}</h2>
                <ul>
                  {pendingByPlatform[platform].map((order) => (
                    <li key={order.orderNumber}>
                      <Link href={`/order/${order.orderNumber}`}>
                        Order {order.orderNumber} -{" "}
                        {formatSingaporeTime(order.dateTimeConversion)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}

      {/* Done Orders Section */}
      {doneOrders.length > 0 && (
        <div>
          <h1>Done Orders</h1>
          <ul>
            {doneOrders.map((order) => (
              <li key={order.orderNumber}>
                <Link href={`/order/${order.orderNumber}`}>
                  Order {order.orderNumber} -{" "}
                  {formatSingaporeTime(order.dateTimeConversion)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
