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

  // Pre-compute a lookup for normalised barcodes.
  const barcodeLookup = useMemo(() => {
    const lookup = {};
    order.items.forEach((item) => {
      const normalizedBarcode = String(item.productBarcode || "")
        .trim()
        .toUpperCase();
      lookup[normalizedBarcode] = item;
    });
    return lookup;
  }, [order]);

  // Initialise scan counts for each item.
  useEffect(() => {
    const initialCounts = {};
    Object.keys(barcodeLookup).forEach((barcode) => {
      initialCounts[barcode] = 0;
    });
    setScanCounts(initialCounts);
  }, [barcodeLookup]);

  // Increase the count for a matching product when a barcode is scanned.
  const handleBarcodeScanned = (barcode) => {
    if (!order) return;
    const scannedCode = String(barcode || "")
      .trim()
      .toUpperCase();
    console.log("Handling scanned code:", scannedCode);

    const item = barcodeLookup[scannedCode];

    if (item) {
      setScanCounts((prev) => {
        const currentCount = prev[scannedCode] || 0;
        const required = Number(item.realQuantity);
        if (currentCount >= required) {
          window.alert("Scanned too many times. Please check quantity.");
          return prev;
        }
        const newCount = currentCount + 1;
        console.log(`Incrementing count for ${scannedCode}: ${newCount}`);
        return { ...prev, [scannedCode]: newCount };
      });
    } else {
      window.alert("Wrong item scanned. Please scan correct item.");
    }
  };

  // Check if all items have been scanned the required number of times.
  useEffect(() => {
    const complete = order.items.every((item) => {
      const required = Number(item.realQuantity);
      const normalizedBarcode = String(item.productBarcode || "")
        .trim()
        .toUpperCase();
      const scanned = scanCounts[normalizedBarcode] || 0;
      return scanned >= required;
    });
    setIsComplete(complete);
  }, [scanCounts, order]);

  const handleConfirm = async () => {
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
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error updating order: " + error.message);
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
            <BarcodeInput onBarcodeScanned={handleBarcodeScanned} />
          </div>
          {isComplete && (
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
          )}
        </div>
      </div>
    </div>
  );
}
