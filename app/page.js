"use client";

import { useEffect, useState, useMemo, useCallback, Suspense, useRef } from "react";
import SearchBox from "../components/SearchBox";
import FilterButtons from "../components/FilterButtons";
import OrderListSection from "../components/OrderListSection";
import ScrollToTop from "../components/ScrollToTop";
import Spinner from "../components/Spinner";
import OrderButton from "../components/OrderButton";
import { useOrders } from "../components/OrdersContext";

// Helper function to format an ISO date string to Singapore time (dd/mm/yyyy hh:mm)
function formatSingaporeTime(dateString) {
  // Create date and explicitly convert to Singapore timezone
  const date = new Date(dateString);
  
  // Use Intl.DateTimeFormat for more reliable timezone handling
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Singapore",
    day: "2-digit",
    month: "2-digit", 
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  
  return formatter.format(date).replace(",", "");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const { orders, setOrders } = useOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("All");
  
  // Refs to manage AbortControllers for concurrent operations
  const fetchOrdersControllerRef = useRef(null);
  const fetchAndSaveControllerRef = useRef(null);
  const updateTrackingControllerRef = useRef(null);

  // Async data fetching with AbortController for cancellation
  const fetchOrders = useCallback(async (signal) => {
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
  }, [setOrders]);

  useEffect(() => {
    const controller = new AbortController();
    fetchOrdersControllerRef.current = controller;
    fetchOrders(controller.signal);
    return () => {
      controller.abort();
      fetchOrdersControllerRef.current = null;
    };
  }, [fetchOrders]);

  // Cleanup all controllers on unmount
  useEffect(() => {
    return () => {
      [fetchOrdersControllerRef, fetchAndSaveControllerRef, updateTrackingControllerRef].forEach(ref => {
        if (ref.current) {
          ref.current.abort();
          ref.current = null;
        }
      });
    };
  }, []);

  // Refresh orders function
  const handleFetchAndSaveOrders = useCallback(async () => {
    // Cancel previous fetch and save operation if running
    if (fetchAndSaveControllerRef.current) {
      fetchAndSaveControllerRef.current.abort();
    }
    
    const controller = new AbortController();
    fetchAndSaveControllerRef.current = controller;
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}?action=fetchAndSaveOrders`, { signal: controller.signal });
      const data = await res.json();
      if (data.success) {
        alert("Orders fetched and saved successfully!");
        // Cancel previous fetchOrders call before making new one
        if (fetchOrdersControllerRef.current) {
          fetchOrdersControllerRef.current.abort();
        }
        const fetchController = new AbortController();
        fetchOrdersControllerRef.current = fetchController;
        fetchOrders(fetchController.signal);
      } else {
        alert("Failed to fetch and save orders: " + data.error);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error triggering fetchAndSaveOrders:", err);
        alert("Error triggering fetchAndSaveOrders: " + err.message);
      }
    } finally {
      setIsLoading(false);
      fetchAndSaveControllerRef.current = null;
    }
  }, [fetchOrders]);

  const handleUpdateMissingTrackingNumbers = useCallback(async () => {
    // Cancel previous tracking update operation if running
    if (updateTrackingControllerRef.current) {
      updateTrackingControllerRef.current.abort();
    }
    
    const controller = new AbortController();
    updateTrackingControllerRef.current = controller;
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}?action=updateMissingTrackingNumbers`, { signal: controller.signal });
      const text = await res.text(); // Get the raw response text
      console.log("Raw API response:", text); // Log raw response

      let data;
      try {
        data = JSON.parse(text); // Parse as JSON
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        alert("Error: API did not return valid JSON. Check console.");
        return;
      }

      console.log("Parsed API response:", data); // Log parsed response

      if (data.success) {
        alert(
          `Tracking numbers refreshed successfully! Updated ${data.updatedOrders} orders.`
        );
        // Cancel previous fetchOrders call before making new one
        if (fetchOrdersControllerRef.current) {
          fetchOrdersControllerRef.current.abort();
        }
        const fetchController = new AbortController();
        fetchOrdersControllerRef.current = fetchController;
        fetchOrders(fetchController.signal);
      } else {
        alert(
          `Failed to refresh tracking numbers: ${data.error || "Unknown error"}`
        );
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error triggering updateMissingTrackingNumbers:", err);
        alert("Error triggering updateMissingTrackingNumbers: " + err.message);
      }
    } finally {
      setIsLoading(false);
      updateTrackingControllerRef.current = null;
    }
  }, [fetchOrders]);

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

  // Memoize filtered orders by status
  const { pendingOrders, doneOrders } = useMemo(() => {
    const pending = searchFilteredOrders.filter(
      (order) => String(order.status || "").toLowerCase() === "pending"
    );
    const done = searchFilteredOrders.filter(
      (order) => String(order.status || "").toLowerCase() === "done"
    );
    return { pendingOrders: pending, doneOrders: done };
  }, [searchFilteredOrders]);

  // Memoize pending orders grouped by platform
  const pendingByPlatform = useMemo(() => {
    return pendingOrders.reduce((acc, order) => {
      const platform = order.platform;
      if (!acc[platform]) acc[platform] = [];
      acc[platform].push(order);
      return acc;
    }, {});
  }, [pendingOrders]);

  // Memoize display orders based on current filter
  const { displayPending, displayDone } = useMemo(() => {
    if (currentFilter === "All") {
      return { displayPending: pendingOrders, displayDone: doneOrders };
    } else if (currentFilter === "Done") {
      return { displayPending: [], displayDone: doneOrders };
    } else {
      return {
        displayPending: pendingOrders.filter(order => order.platform === currentFilter),
        displayDone: doneOrders.filter(order => order.platform === currentFilter)
      };
    }
  }, [currentFilter, pendingOrders, doneOrders]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div className="container" style={{ marginTop: "100px" }}>
        {searchTerm === "" && (
          <div className="card mb-4">
            <div className="card-body">
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={handleFetchAndSaveOrders}
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                    <path d="M21 3v5h-5"/>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                    <path d="M3 21v-5h5"/>
                  </svg>
                  Fetch Orders from OneCart
                </button>
                <button
                  onClick={handleUpdateMissingTrackingNumbers}
                  className="btn btn-secondary"
                  disabled={isLoading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                    <path d="M9 14l2 2 4-4"/>
                  </svg>
                  Refresh Tracking Numbers
                </button>
              </div>
            </div>
          </div>
        )}

        {searchTerm === "" && (
          <div className="mb-4">
            <FilterButtons
              filters={["All", "Shopee", "Lazada", "Shopify", "TikTok", "Amazon", "Done"]}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
              orders={orders}
              doneOrders={doneOrders}
              pendingByPlatform={pendingByPlatform}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="mb-4">
          {isLoading ? (
            <div className="card">
              <div className="card-body text-center py-8">
                <Spinner minHeight="200px" />
                <p className="mt-4">Loading orders...</p>
              </div>
            </div>
          ) : (
            <Suspense fallback={
              <div className="card">
                <div className="card-body text-center py-8">
                  <Spinner minHeight="200px" />
                  <p className="mt-4">Loading orders...</p>
                </div>
              </div>
            }>
              <OrderListSection
                displayPending={displayPending}
                displayDone={displayDone}
                pendingByPlatform={pendingByPlatform}
                currentFilter={currentFilter}
                formatSingaporeTime={formatSingaporeTime}
                OrderButton={OrderButton}
              />
            </Suspense>
          )}
        </div>
      </div>
      
      <ScrollToTop />
    </div>
  );
}
