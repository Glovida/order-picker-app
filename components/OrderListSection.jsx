"use client";
import React, { Suspense, lazy, useMemo } from "react";

// OrderListComponent renders the order list based on props.
const OrderListComponent = ({
  displayPending,
  displayDone,
  pendingByPlatform,
  currentFilter,
  formatSingaporeTime,
  OrderButton,
}) => {
  // Memoize formatted dates to prevent repeated calculations
  const formattedDates = useMemo(() => {
    const dateMap = new Map();
    
    // Helper function to add dates, memoized to prevent recreation
    const addDates = (orders) => {
      if (!Array.isArray(orders)) return;
      orders.forEach(order => {
        if (order?.dateTimeConversion && order?.orderNumber && !dateMap.has(order.orderNumber)) {
          try {
            dateMap.set(order.orderNumber, formatSingaporeTime(order.dateTimeConversion));
          } catch (error) {
            console.warn('Error formatting date for order:', order.orderNumber, error);
          }
        }
      });
    };
    
    // Only process the orders we actually need based on current filter
    if (currentFilter === "All") {
      addDates(displayPending);
      addDates(displayDone);
    } else if (currentFilter === "Done") {
      addDates(displayDone);
    } else {
      // For platform-specific filters, only process those orders
      addDates(displayPending);
      addDates(displayDone);
    }
    
    return dateMap;
  }, [displayPending, displayDone, currentFilter, formatSingaporeTime]);
  if (currentFilter === "All") {
    return (
      <>
        {displayPending.length > 0 && (
          <div>
            <h1>Pending Orders</h1>
            {["Shopee", "Lazada", "Shopify", "TikTok", "Amazon"].map((platform) => {
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
                            formattedDate={formattedDates.get(order.orderNumber)}
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
                  !["Shopee", "Lazada", "Shopify", "TikTok", "Amazon"].includes(platform)
              )
              .map((platform) => (
                <div key={platform}>
                  <h2>{platform}</h2>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {pendingByPlatform[platform].map((order) => (
                      <li key={order.orderNumber}>
                        <OrderButton
                          order={order}
                          formattedDate={formattedDates.get(order.orderNumber)}
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
                    formattedDate={formattedDates.get(order.orderNumber)}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    );
  }
  if (currentFilter !== "All" && currentFilter !== "Done") {
    return (
      <>
        {displayPending.length > 0 || displayDone.length > 0 ? (
          <>
            {displayPending.length > 0 && (
              <div>
                <h1>{currentFilter} Pending Orders</h1>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {displayPending.map((order) => (
                    <li key={order.orderNumber}>
                      <OrderButton
                        order={order}
                        formattedDate={formattedDates.get(order.orderNumber)}
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
                        formattedDate={formattedDates.get(order.orderNumber)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <p>No orders match the current filter.</p>
        )}
      </>
    );
  }
  if (currentFilter === "Done" && displayDone.length > 0) {
    return (
      <div>
        <h1>Done Orders</h1>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {displayDone.map((order) => (
            <li key={order.orderNumber}>
              <OrderButton
                order={order}
                formattedDate={formattedDates.get(order.orderNumber)}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
};

// Lazy loading of the order list component
const LazyOrderList = lazy(() => Promise.resolve({ default: OrderListComponent }));

// A fallback spinner for the order list section
const SpinnerFallback = () => (
  <div
    style={{
      backgroundColor: "#ffffff",
      minHeight: "300px",
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

export default function OrderListSection(props) {
  return (
    <Suspense fallback={<SpinnerFallback />}>
      <LazyOrderList {...props} />
    </Suspense>
  );
}
