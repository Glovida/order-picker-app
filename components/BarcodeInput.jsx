// components/BarcodeInput.js
import { useEffect, useRef, useState } from "react";

export default function BarcodeInput({ onBarcodeScanned }) {
  const inputRef = useRef(null);
  const [isOldAndroid, setIsOldAndroid] = useState(false);

  useEffect(() => {
    // Automatically focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Check if the user agent is Android and extract the version
    const ua = window.navigator.userAgent;
    const androidMatch = ua.match(/Android\s([0-9\.]+)/);
    if (androidMatch) {
      const version = parseFloat(androidMatch[1]);
      if (version < 11) {
        setIsOldAndroid(true);
      }
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
      type="search"
      id="barcodeInput"
      // Conditionally add the inputMode attribute if the OS is not old Android
      {...(!isOldAndroid ? { inputMode: "none" } : {})}
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
