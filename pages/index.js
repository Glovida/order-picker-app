// pages/index.js
import { useEffect, useState } from "react";
import Link from "next/link";
import OrderButton from "../components/OrderButton"; // Ensure this file exists
import ScrollToTop from "../components/ScrollToTop"; // Import the new component

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
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("All");

  const fetchOrders = () => {
    setIsLoading(true);
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
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleFetchAndSaveOrders = () => {
    setIsLoading(true);
    fetch(`${API_URL}?action=fetchAndSaveOrders`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Orders fetched and saved successfully!");
          fetchOrders();
        } else {
          alert("Failed to fetch and save orders: " + data.error);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error triggering fetchAndSaveOrders:", err);
        alert("Error triggering fetchAndSaveOrders: " + err.message);
        setIsLoading(false);
      });
  };

  const searchFilteredOrders = orders.filter((order) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const orderNumber = String(order.orderNumber || "").toLowerCase();
    const trackingNumber = String(order.trackingNumber || "").toLowerCase();
    return orderNumber.includes(term) || trackingNumber.includes(term);
  });

  const pendingOrders = searchFilteredOrders.filter(
    (order) => String(order.status || "").toLowerCase() === "pending"
  );
  const doneOrders = searchFilteredOrders.filter(
    (order) => String(order.status || "").toLowerCase() === "done"
  );

  // Calculate the overall pending orders per platform regardless of the current filter.
  const allPendingByPlatform = pendingOrders.reduce((acc, order) => {
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

  const pendingByPlatform = displayPending.reduce((acc, order) => {
    const platform = order.platform;
    if (!acc[platform]) acc[platform] = [];
    acc[platform].push(order);
    return acc;
  }, {});

  const filters = ["All", "Shopee", "Lazada", "Shopify", "TikTok", "Done"];

  // Inline spinner component
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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      {/* Fixed Search Bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: "10px",
          zIndex: 100,
          borderBottom: "1px solid #eaeaea",
          backgroundColor: "#ffffff",
        }}
      >
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

      {/* Main Content Container with extra top margin */}
      <div style={{ marginTop: "100px", padding: "20px" }}>
        {/* Refresh Button */}
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

        {/* Filter Buttons */}
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {filters.map((filter) => {
            let count = 0;
            if (filter === "All") {
              count = orders.length;
            } else if (filter === "Done") {
              count = doneOrders.length;
            } else {
              // Use the overall pending count for the specific platform
              count = allPendingByPlatform[filter]
                ? allPendingByPlatform[filter].length
                : 0;
            }
            return (
              <button
                key={filter}
                onClick={() => setCurrentFilter(filter)}
                style={{
                  padding: "8px 16px",
                  fontSize: "1rem",
                  backgroundColor:
                    currentFilter === filter ? "#2d3a55" : "#dfe5f1",
                  color: currentFilter === filter ? "#ffffff" : "#000000",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#2d3a55",
                    border: "1px solid #2d3a55",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    marginRight: "5px",
                    fontSize: "0.8rem",
                    minWidth: "20px",
                    textAlign: "center",
                  }}
                >
                  {count}
                </span>
                {filter}
              </button>
            );
          })}
        </div>

        {/* Display Orders Based on Filter */}
        {currentFilter === "All" && (
          <>
            {displayPending.length > 0 && (
              <div>
                <h1>Pending Orders</h1>
                {["Shopee", "Lazada", "Shopify", "TikTok"].map((platform) => {
                  if (
                    pendingByPlatform[platform] &&
                    pendingByPlatform[platform].length
                  ) {
                    return (
                      <div key={platform}>
                        <h2>{platform}</h2>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                          {pendingByPlatform[platform].map((order) => (
                            <li key={order.orderNumber}>
                              <OrderButton
                                order={order}
                                formattedDate={formatSingaporeTime(
                                  order.dateTimeConversion
                                )}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  }
                  return null;
                })}
                {Object.keys(pendingByPlatform)
                  .filter(
                    (platform) =>
                      !["Shopee", "Lazada", "Shopify", "TikTok"].includes(
                        platform
                      )
                  )
                  .map((platform) => (
                    <div key={platform}>
                      <h2>{platform}</h2>
                      <ul style={{ listStyle: "none", padding: 0 }}>
                        {pendingByPlatform[platform].map((order) => (
                          <li key={order.orderNumber}>
                            <OrderButton
                              order={order}
                              formattedDate={formatSingaporeTime(
                                order.dateTimeConversion
                              )}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            )}
            {displayDone.length > 0 && (
              <div>
                <h1>Done Orders</h1>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {displayDone.map((order) => (
                    <li key={order.orderNumber}>
                      <OrderButton
                        order={order}
                        formattedDate={formatSingaporeTime(
                          order.dateTimeConversion
                        )}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {currentFilter !== "All" && currentFilter !== "Done" && (
          <>
            {(displayPending.length > 0 || displayDone.length > 0) && (
              <>
                {displayPending.length > 0 && (
                  <div>
                    <h1>{currentFilter} Pending Orders</h1>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                      {displayPending.map((order) => (
                        <li key={order.orderNumber}>
                          <OrderButton
                            order={order}
                            formattedDate={formatSingaporeTime(
                              order.dateTimeConversion
                            )}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {displayDone.length > 0 && (
                  <div>
                    <h1>{currentFilter} Done Orders</h1>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                      {displayDone.map((order) => (
                        <li key={order.orderNumber}>
                          <OrderButton
                            order={order}
                            formattedDate={formatSingaporeTime(
                              order.dateTimeConversion
                            )}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
            {displayPending.length === 0 && displayDone.length === 0 && (
              <p>No orders match the current filter.</p>
            )}
          </>
        )}

        {currentFilter === "Done" && displayDone.length > 0 && (
          <div>
            <h1>Done Orders</h1>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {displayDone.map((order) => (
                <li key={order.orderNumber}>
                  <OrderButton
                    order={order}
                    formattedDate={formatSingaporeTime(
                      order.dateTimeConversion
                    )}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Log Out Button at the Bottom */}
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "#dfe5f1",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Log Out
          </button>
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
}
