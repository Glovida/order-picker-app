"use client";

import { useEffect, useState, useMemo } from "react";
import { signOut } from "next-auth/react";
import SearchBox from "../components/SearchBox";
import FilterButtons from "../components/FilterButtons";
import OrderListSection from "../components/OrderListSection";
import ScrollToTop from "../components/ScrollToTop";
import Spinner from "../components/Spinner";
import { useOrders } from "../components/OrdersContext";

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
  return new Date(dateString).toLocaleString("en-GB", options).replace(",", "");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const { orders, setOrders } = useOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("All");
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Async data fetching with AbortController for cancellation
  const fetchOrders = async (signal) => {
    try {
      setIsLoading(true);
      const res = await fetch(API_URL, { signal });
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error fetching orders:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchOrders(controller.signal);
    return () => {
      controller.abort();
    };
  }, [setOrders]);

  // Refresh orders function
  const handleFetchAndSaveOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}?action=fetchAndSaveOrders`);
      const data = await res.json();
      if (data.success) {
        alert("Orders fetched and saved successfully!");
        fetchOrders();
      } else {
        alert("Failed to fetch and save orders: " + data.error);
      }
    } catch (err) {
      console.error("Error triggering fetchAndSaveOrders:", err);
      alert("Error triggering fetchAndSaveOrders: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoise filtered orders
  const searchFilteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter((order) => {
      const orderNumber = String(order.orderNumber || "").toLowerCase();
      const trackingNumber = String(order.trackingNumber || "").toLowerCase();
      return orderNumber.includes(term) || trackingNumber.includes(term);
    });
  }, [orders, searchTerm]);

  const pendingOrders = searchFilteredOrders.filter(
    (order) => String(order.status || "").toLowerCase() === "pending"
  );
  const doneOrders = searchFilteredOrders.filter(
    (order) => String(order.status || "").toLowerCase() === "done"
  );

  // Group pending orders by platform (used when filter is "All")
  const pendingByPlatform = pendingOrders.reduce((acc, order) => {
    const platform = order.platform;
    if (!acc[platform]) acc[platform] = [];
    acc[platform].push(order);
    return acc;
  }, {});

  let displayPending = [];
  let displayDone = [];

  if (currentFilter === "All") {
    displayPending = pendingOrders;
    displayDone = doneOrders;
  } else if (currentFilter === "Done") {
    displayPending = [];
    displayDone = doneOrders;
  } else {
    displayPending = pendingOrders.filter(
      (order) => order.platform === currentFilter
    );
    displayDone = doneOrders.filter(
      (order) => order.platform === currentFilter
    );
  }

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div style={{ marginTop: "100px", padding: "20px" }}>
        {searchTerm === "" && (
          <>
            <div style={{ marginBottom: "20px" }}>
              <button
                onClick={handleFetchAndSaveOrders}
                style={{
                  padding: "10px 20px",
                  fontSize: "1rem",
                  marginBottom: "20px",
                  backgroundColor: "#dfe5f1",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Refresh Orders from External Source
              </button>
            </div>
            <FilterButtons
              filters={["All", "Shopee", "Lazada", "Shopify", "TikTok", "Done"]}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
              orders={orders}
              doneOrders={doneOrders}
              pendingByPlatform={pendingByPlatform}
            />
          </>
        )}
        {isLoading ? (
          <Spinner minHeight="200px" />
        ) : (
          <OrderListSection
            displayPending={displayPending}
            displayDone={displayDone}
            pendingByPlatform={pendingByPlatform}
            currentFilter={currentFilter}
            formatSingaporeTime={formatSingaporeTime}
            OrderButton={require("../components/OrderButton").default}
          />
        )}
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <button
            onClick={() => {
              setLogoutLoading(true);
              signOut({ callbackUrl: "/login" });
            }}
            disabled={logoutLoading}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "#dfe5f1",
              border: "none",
              borderRadius: "4px",
              cursor: logoutLoading ? "not-allowed" : "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minWidth: "100px",
            }}
          >
            {logoutLoading ? (
              <Spinner size={20} borderSize={3} minHeight="auto" />
            ) : (
              "Log Out"
            )}
          </button>
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
}
