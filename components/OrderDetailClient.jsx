// components/OrderDetailClient.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import BarcodeInput from "./BarcodeInput";

export default function OrderDetailClient({ order, apiUrl }) {
  const router = useRouter();
  const [scanCounts, setScanCounts] = useState({});
  const [isComplete, setIsComplete] = useState(false);

  // Initialize scan counts for each item when the order loads.
  useEffect(() => {
    if (order) {
      const initialCounts = {};
      order.items.forEach((item) => {
        const normalizedBarcode = String(item.productBarcode || "")
          .trim()
          .toUpperCase();
        initialCounts[normalizedBarcode] = 0;
      });
      setScanCounts(initialCounts);
    }
  }, [order]);

  // Increase the count for a matching product when a barcode is scanned.
  const handleBarcodeScanned = (barcode) => {
    if (!order) return;
    const scannedCode = String(barcode || "")
      .trim()
      .toUpperCase();
    console.log("Handling scanned code:", scannedCode);

    const item = order.items.find((i) => {
      const normalizedStored = String(i.productBarcode || "")
        .trim()
        .toUpperCase();
      return normalizedStored === scannedCode;
    });

    if (item) {
      setScanCounts((prev) => {
        const newCount = (prev[scannedCode] || 0) + 1;
        console.log(`Incrementing count for ${scannedCode}: ${newCount}`);
        return { ...prev, [scannedCode]: newCount };
      });
    } else {
      console.log("No matching item found for barcode:", scannedCode);
    }
  };

  // Check if all items have been scanned the required number of times.
  useEffect(() => {
    if (order) {
      const complete = order.items.every((item) => {
        const required = Number(item.realQuantity);
        const normalizedBarcode = String(item.productBarcode || "")
          .trim()
          .toUpperCase();
        const scanned = scanCounts[normalizedBarcode] || 0;
        return scanned >= required;
      });
      setIsComplete(complete);
    }
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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Back Button */}
      <div style={{ marginBottom: "20px" }}>
        <Link href="/">
          <button style={{ padding: "8px 16px", fontSize: "1rem" }}>
            Back
          </button>
        </Link>
      </div>

      <h1>Order {order.orderNumber}</h1>
      <h2>Items to Pick:</h2>
      <ul>
        {order.items.map((item) => {
          const normalizedBarcode = String(item.productBarcode || "")
            .trim()
            .toUpperCase();
          return (
            <li key={normalizedBarcode} style={{ marginBottom: "20px" }}>
              {item.frontImage && (
                <img
                  src={item.frontImage}
                  alt={item.productName}
                  style={{
                    width: "100px",
                    height: "auto",
                    marginRight: "10px",
                  }}
                />
              )}
              <span>
                {item.productName} – Required: {item.realQuantity}, Scanned:{" "}
                {scanCounts[normalizedBarcode] || 0}
              </span>
            </li>
          );
        })}
      </ul>

      <h3>Scan Products</h3>
      <BarcodeInput onBarcodeScanned={handleBarcodeScanned} />

      {isComplete && (
        <button
          onClick={handleConfirm}
          style={{ marginTop: "20px", padding: "10px 20px" }}
        >
          Confirm Order Picking
        </button>
      )}
    </div>
  );
}
