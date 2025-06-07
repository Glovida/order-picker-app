// components/OrderButton.jsx
import Link from "next/link";

export default function OrderButton({ order, formattedDate }) {
  // Enhanced platform colors with better contrast and elegance
  const platformStyles = {
    Shopee: {
      backgroundColor: "#fff5f2",
      borderColor: "#ff6b35",
      platformColor: "#ff6b35"
    },
    Lazada: {
      backgroundColor: "#f8f6ff", 
      borderColor: "#6366f1",
      platformColor: "#6366f1"
    },
    Shopify: {
      backgroundColor: "#f0fdf4",
      borderColor: "#22c55e", 
      platformColor: "#22c55e"
    },
    TikTok: {
      backgroundColor: "#f0fdfa",
      borderColor: "#14b8a6",
      platformColor: "#14b8a6"
    },
  };

  // Get the styling for the order's platform
  const platformStyle = platformStyles[order.platform] || {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    platformColor: "#64748b"
  };

  // Get the first item's image (if available)
  const firstItemImage =
    order.items && order.items.length > 0 ? order.items[0].frontImage : null;

  // Status indicator
  const isCompleted = order.status === "done";

  return (
    <Link href={`/order/${order.orderNumber}`} legacyBehavior>
      <a
        style={{
          display: "block",
          textDecoration: "none",
          color: "inherit",
          marginBottom: "var(--space-3)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "var(--space-4)",
            backgroundColor: platformStyle.backgroundColor,
            border: `2px solid ${platformStyle.borderColor}`,
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
            transition: "all 0.2s ease",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "var(--shadow-md)";
            e.currentTarget.style.borderColor = platformStyle.platformColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            e.currentTarget.style.borderColor = platformStyle.borderColor;
          }}
        >
          {/* Product Image */}
          {firstItemImage && (
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                marginRight: "var(--space-4)",
                border: "1px solid var(--gray-200)",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={firstItemImage}
                alt={order.items[0].productName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          )}
          
          {/* Order Information */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
              <h3 style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "var(--gray-900)",
                margin: 0,
                lineHeight: "1.4"
              }}>
                Order #{order.orderNumber}
              </h3>
              {isCompleted && (
                <span style={{
                  backgroundColor: "var(--success-100)",
                  color: "var(--success-700)",
                  padding: "var(--space-1) var(--space-2)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.025em"
                }}>
                  Completed
                </span>
              )}
            </div>
            
            <p style={{
              fontSize: "0.875rem",
              color: "var(--gray-600)",
              margin: "0 0 var(--space-2) 0",
              lineHeight: "1.4"
            }}>
              {formattedDate}
            </p>
            
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-1)",
                fontSize: "0.75rem",
                fontWeight: "600",
                color: platformStyle.platformColor,
                backgroundColor: "white",
                padding: "var(--space-1) var(--space-2)",
                borderRadius: "var(--radius-sm)",
                border: `1px solid ${platformStyle.borderColor}`,
              }}>
                <div style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: platformStyle.platformColor
                }}></div>
                {order.platform}
              </span>
              
              {order.trackingNumber && (
                <span style={{
                  fontSize: "0.75rem",
                  color: "var(--gray-500)",
                  fontFamily: "var(--font-mono)",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  padding: "var(--space-1) var(--space-2)",
                  borderRadius: "var(--radius-sm)",
                }}>
                  {order.trackingNumber}
                </span>
              )}
            </div>
          </div>
          
          {/* Arrow indicator */}
          <div style={{
            marginLeft: "var(--space-2)",
            color: "var(--gray-400)",
            transition: "color 0.2s ease"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>
      </a>
    </Link>
  );
}
