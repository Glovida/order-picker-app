// components/OrderButton.jsx
import Link from "next/link";

export default function OrderButton({ order, formattedDate }) {
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
          backgroundColor: "#f0f0f0",
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
        <span>
          Order {order.orderNumber} - {formattedDate}
        </span>
      </a>
    </Link>
  );
}
