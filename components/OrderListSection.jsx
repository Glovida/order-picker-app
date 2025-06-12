"use client";
import React, { Suspense, lazy } from "react";

// OrderListComponent renders the order list based on props.
const OrderListComponent = ({
  displayPending,
  displayDone,
  pendingByPlatform,
  currentFilter,
  formatSingaporeTime,
  OrderButton,
}) => {
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
                formattedDate={formatSingaporeTime(order.dateTimeConversion)}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
};

// Simulate lazy loading of the order list component (with a 1.5 sec delay)
const LazyOrderList = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({ default: OrderListComponent });
      }, 1500);
    })
);

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
