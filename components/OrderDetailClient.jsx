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
    <>
      {/* Main Content Container */}
      <div
        style={{
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          paddingBottom: "140px", // Extra bottom padding to ensure content isn't hidden by the fixed bottom section
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
        <h2>Items to Pick:</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {order.items.map((item) => {
            const normalizedBarcode = String(item.productBarcode || "")
              .trim()
              .toUpperCase();
            const required = Number(item.realQuantity);
            const scanned = scanCounts[normalizedBarcode] || 0;
            const progressPercent = Math.min((scanned / required) * 100, 100);
            return (
              <li key={normalizedBarcode} style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
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
                  <div>
                    <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                      {item.productName}
                    </div>
                    <div>
                      Required: {required} | Scanned: {scanned}
                    </div>
                  </div>
                </div>
                {/* Progress Bar */}
                <div
                  style={{
                    marginTop: "8px",
                    width: "100%",
                    height: "10px",
                    backgroundColor: "#dfe5f1",
                    borderRadius: "5px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progressPercent}%`,
                      height: "100%",
                      backgroundColor: "#2d3a55",
                    }}
                  ></div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Fixed "Scan Products" Section at the Bottom */}
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
            gap: "10px",
          }}
        >
          <BarcodeInput onBarcodeScanned={handleBarcodeScanned} />
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
              }}
            >
              Confirm Order Picking
            </button>
          )}
        </div>
      </div>
    </>
  );
}
