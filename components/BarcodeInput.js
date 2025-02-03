// components/BarcodeInput.js
import { useEffect, useRef } from "react";

export default function BarcodeInput({ onBarcodeScanned }) {
  const inputRef = useRef(null);

  useEffect(() => {
    // Automatically focus the input field so it's always ready.
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const barcode = e.target.value.trim();
      console.log("Scanned barcode:", barcode); // Debug log
      if (barcode) {
        onBarcodeScanned(barcode);
      }
      e.target.value = ""; // Clear input for the next scan.
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      onKeyDown={handleKeyDown}
      placeholder="Scan barcode here..."
      style={{
        width: "100%",
        maxWidth: "400px",
        padding: "10px",
        fontSize: "1rem",
        marginTop: "10px",
      }}
    />
  );
}
