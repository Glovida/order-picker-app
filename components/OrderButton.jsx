// components/OrderButton.jsx
import Link from "next/link";
import { useCallback, useState } from "react";

export default function OrderButton({ order, formattedDate }) {
  // State for image loading error handling
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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
    Amazon: {
      backgroundColor: "#fef8f1",
      borderColor: "#F19E38",
      platformColor: "#F19E38"
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

  // Image event handlers
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  // Memoize mouse event handlers to prevent recreation on every render
  const handleMouseEnter = useCallback((e) => {
    e.currentTarget.style.boxShadow = "var(--shadow-md)";
    e.currentTarget.style.borderColor = platformStyle.platformColor;
  }, [platformStyle.platformColor]);

  const handleMouseLeave = useCallback((e) => {
    e.currentTarget.style.boxShadow = "var(--shadow-sm)";
    e.currentTarget.style.borderColor = platformStyle.borderColor;
  }, [platformStyle.borderColor]);

  return (
    <>
      <style jsx>{`
        @media (max-width: 480px) {
          .order-header {
            align-items: flex-start !important;
          }
          .completed-badge {
            order: 1;
            margin-top: var(--space-1);
          }
        }
      `}</style>
      <Link
        href={`/order/${order.orderNumber}`}
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
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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
              {imageError ? (
                // Error fallback - show placeholder
                <div style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "var(--gray-100)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--gray-400)"
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                  </svg>
                </div>
              ) : (
                <>
                  {!imageLoaded && (
                    // Loading placeholder
                    <div style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "var(--gray-100)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--gray-400)"
                    }}>
                      <div className="spinner" style={{ width: "20px", height: "20px" }}></div>
                    </div>
                  )}
                  <img
                    src={firstItemImage}
                    alt={order.items[0]?.productName || "Product image"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      opacity: imageLoaded ? 1 : 0,
                      transition: "opacity 0.2s ease-in-out"
                    }}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                </>
              )}
            </div>
          )}
          
          {/* Order Information */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="order-header" style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "var(--space-2)", 
              marginBottom: "var(--space-1)",
              flexWrap: "wrap"
            }}>
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
                <span className="completed-badge" style={{
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
      </Link>
    </>
  );
}
