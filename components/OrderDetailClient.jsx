"use client";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BarcodeInput from "./BarcodeInput";
import dynamic from "next/dynamic";
import Spinner from "./Spinner";

// Lazy load the ItemList component.
const ItemList = dynamic(() => import("./ItemList"), {
  ssr: false,
  loading: () => <Spinner minHeight="100px" />,
});

export default function OrderDetailClient({ order, apiUrl }) {
  const router = useRouter();
  const [scanCounts, setScanCounts] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Build a lookup mapping from normalized barcode to an array of line item indices.
  const barcodeIndexLookup = useMemo(() => {
    const lookup = {};
    order.items.forEach((item, index) => {
      const normalizedBarcode = String(item.productBarcode || "")
        .trim()
        .toUpperCase();
      if (!lookup[normalizedBarcode]) {
        lookup[normalizedBarcode] = [];
      }
      lookup[normalizedBarcode].push(index);
    });
    return lookup;
  }, [order]);

  // Initialize scan counts based on order status
  useEffect(() => {
    const initialCounts = {};
    order.items.forEach((item, index) => {
      initialCounts[index] =
        order.status === "done" ? Number(item.realQuantity) : 0;
    });
    setScanCounts(initialCounts);
  }, [order]);

  // Increase the count for the correct line item when a barcode is scanned.
  const handleBarcodeScanned = (barcode) => {
    if (!order || order.status === "done") return;

    const scannedCode = String(barcode || "")
      .trim()
      .toUpperCase();
    console.log("Handling scanned code:", scannedCode);

    const indices = barcodeIndexLookup[scannedCode];
    if (indices && indices.length > 0) {
      let updated = false;
      setScanCounts((prev) => {
        const newCounts = { ...prev };

        for (let i = 0; i < indices.length; i++) {
          const index = indices[i];
          const item = order.items[index];
          const required = Number(item.realQuantity);
          const currentCount = prev[index] || 0;

          if (currentCount < required) {
            newCounts[index] = currentCount + 1;
            console.log(
              `Incrementing count for item index ${index}: ${newCounts[index]}`
            );
            updated = true;
            break;
          }
        }
        return newCounts;
      });

      if (!updated) {
        window.alert("Scanned too many times. Please check quantity.");
      }
    } else {
      window.alert("Wrong item scanned. Please scan correct item.");
    }
  };

  // Check if all line items have been scanned the required number of times.
  useEffect(() => {
    const complete = order.items.every((item, index) => {
      const required = Number(item.realQuantity);
      const scanned = scanCounts[index] || 0;
      return scanned >= required;
    });
    setIsComplete(complete);
  }, [scanCounts, order]);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/updateStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderNumber: order.orderNumber }),
      });
      const result = await response.json();
      if (result.success) {
        alert("Order confirmed as picked and updated!");
        router.push("/");
      } else {
        alert("Failed to update order: " + result.error);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error updating order: " + error.message);
      setIsSubmitting(false);
    }
  };

  if (!order) return <p>Loading order details...</p>;

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        paddingBottom: "140px",
      }}
    >
      {/* Back Button */}
      <div style={{ marginBottom: "20px" }}>
        <Link href="/">
          <button style={{ padding: "8px 16px", fontSize: "1rem" }}>
            Back
          </button>
        </Link>
      </div>

      <h1>Order {order.orderNumber}</h1>
      {/* Platform and Tracking Number Info */}
      <p style={{ fontSize: "1rem", marginBottom: "20px" }}>
        {order.platform} | Tracking No.: {order.trackingNumber}
      </p>

      <h2>Items to Pick:</h2>
      {/* Lazy-loaded item list */}
      <Suspense fallback={<Spinner minHeight="100px" />}>
        <ItemList order={order} scanCounts={scanCounts} />
      </Suspense>

      {/* Fixed "Scan Products" Section */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#ffffff",
          padding: "10px",
          borderTop: "1px solid #eaeaea",
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: 1 }}>
            {order.status === "done" ? (
              <p style={{ fontSize: "1rem", fontWeight: "bold" }}>
                Order Picked
              </p>
            ) : (
              <BarcodeInput onBarcodeScanned={handleBarcodeScanned} />
            )}
          </div>
          {isComplete &&
            order.status !== "done" &&
            (isSubmitting ? (
              <Spinner minHeight="40px" />
            ) : (
              <button
                onClick={handleConfirm}
                style={{
                  padding: "10px 20px",
                  fontSize: "1rem",
                  backgroundColor: "#dfe5f1",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginLeft: "10px",
                }}
              >
                Confirm Order Picking
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
