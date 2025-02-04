// components/OrderButton.jsx
import Link from "next/link";

export default function OrderButton({ order, formattedDate }) {
  // Mapping of platform names to background colors.
  const platformColors = {
    Shopee: "#FCF1EE",
    Lazada: "#EBEEFE",
    Shopify: "#EFFADF",
    TikTok: "#74F1EC",
  };

  // Get the background color for the order's platform; if not specified, fallback to a default.
  const backgroundColor = platformColors[order.platform] || "#f0f0f0";

  // Get the first item's image (if available)
  const firstItemImage =
    order.items && order.items.length > 0 ? order.items[0].frontImage : null;

  return (
    <Link href={`/order/${order.orderNumber}`} legacyBehavior>
      <a
        style={{
          display: "flex",
          alignItems: "center",
          padding: "15px 20px",
          margin: "10px 0",
          backgroundColor, // Use the color based on the order platform
          borderRadius: "8px",
          textDecoration: "none",
          color: "#000",
          fontSize: "1.2rem",
        }}
      >
        {firstItemImage && (
          <img
            src={firstItemImage}
            alt={order.items[0].productName}
            style={{
              width: "60px",
              height: "60px",
              objectFit: "contain",
              marginRight: "10px",
            }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            Order {order.orderNumber} - {formattedDate}
          </span>
          <span style={{ fontSize: "0.8rem", color: "#555" }}>
            {order.platform} | Tracking No.: {order.trackingNumber}
          </span>
        </div>
      </a>
    </Link>
  );
}
