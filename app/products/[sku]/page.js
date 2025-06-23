"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Spinner from "../../../components/Spinner";
import { useProducts } from "../../../components/ProductsContext";

// The endpoint for fetching products (fallback)
const API_PRODUCTS_URL = process.env.NEXT_PUBLIC_PRODUCT_API_URL;
// The endpoint for updating the barcode via the Next.js API route
const UPDATE_BARCODE_API_URL = "/api/updateBarcode";

// Image placeholder component for better loading UX
function ImagePlaceholder({ width = "300px", height = "300px" }) {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "var(--gray-100)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--gray-400)"
        strokeWidth="1"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21,15 16,10 5,21"/>
      </svg>
    </div>
  );
}

export default function ProductDetailPage() {
  const { sku } = useParams();
  const router = useRouter();
  const { products, setProducts } = useProducts();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // New state to control editing and hold the input value
  const [isEditing, setIsEditing] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  
  // Image loading states
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Image loading handlers
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  useEffect(() => {
    async function fetchProductFallback(signal) {
      try {
        setIsLoading(true);
        const res = await fetch(API_PRODUCTS_URL, { signal });
        const data = await res.json();
        if (data.products) {
          const found = data.products.find(
            (p) =>
              String(p.sku).trim().toLowerCase() ===
              String(sku).trim().toLowerCase()
          );
          setProduct(found);
          if (found && found.barcode_number) {
            setBarcodeInput(found.barcode_number);
          }
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching product fallback:", error);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (!sku) {
      return;
    }

    const controller = new AbortController();

    // Reset image states when product changes
    setImageLoaded(false);
    setImageError(false);

    // First, try to get the product from the global context.
    if (products.length > 0) {
      const found = products.find(
        (p) =>
          String(p.sku).trim().toLowerCase() ===
          String(sku).trim().toLowerCase()
      );
      if (found) {
        setProduct(found);
        setBarcodeInput(found.barcode_number || "");
        setIsLoading(false);
        // Return cleanup function even for early returns
        return () => {
          controller.abort();
        };
      }
    }
    
    // Only fetch from API if not found in context and context has been loaded
    // If products array is empty, it means ProductsContext is still loading
    if (products.length === 0) {
      // Wait for ProductsContext to load first - return cleanup function
      return () => {
        controller.abort();
      };
    }
    
    // Product not found in context, fallback to API
    fetchProductFallback(controller.signal);

    return () => {
      controller.abort();
    };
  }, [sku, products]);

  // Called when "Save" is confirmed
  async function handleSave() {
    try {
      const response = await fetch(UPDATE_BARCODE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sku: product.sku,
          barcode: barcodeInput,
        }),
      });

      if (response.ok) {
        const updatedProduct = { ...product, barcode_number: barcodeInput };

        // Update local state
        setProduct(updatedProduct);

        // Update global state in ProductsContext
        setProducts((prevProducts) =>
          prevProducts.map((p) => (p.sku === product.sku ? updatedProduct : p))
        );
      } else {
        console.error("Failed to update barcode");
      }
    } catch (error) {
      console.error("Error updating barcode:", error);
    }

    setIsEditing(false);
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="card-body text-center py-8">
          <Spinner minHeight="200px" />
          <p className="mt-4">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="card">
        <div className="card-body text-center py-8">
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="var(--gray-400)" 
            strokeWidth="1.5"
            style={{ margin: "0 auto var(--space-4)" }}
          >
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <h3 style={{ color: "var(--gray-600)" }}>Product not found</h3>
          <p style={{ color: "var(--gray-500)" }}>
            The product with SKU &quot;{sku}&quot; could not be found.
          </p>
          <button 
            onClick={() => router.back()} 
            className="btn btn-primary mt-4"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
      }}
    >
      {/* Header with Back and Edit/Save/Close buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            padding: "8px 16px",
            fontSize: "1rem",
            border: "none",
            borderRadius: "4px",
            backgroundColor: "#dfe5f1",
            cursor: "pointer",
          }}
        >
          Back
        </button>
        {isEditing ? (
          // If no changes were made, show "Close" with a red background; otherwise show "Save"
          (barcodeInput === (product.barcode_number || "") ? (<button
            onClick={() => setIsEditing(false)}
            style={{
              padding: "8px 16px",
              fontSize: "1rem",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "red",
              color: "#fff",
              cursor: "pointer",
            }}
          >Close
                        </button>) : (<button
            onClick={() => {
              if (window.confirm("Confirm changes?")) {
                handleSave();
              }
            }}
            style={{
              padding: "8px 16px",
              fontSize: "1rem",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              cursor: "pointer",
            }}
          >Save
                        </button>))
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              padding: "8px 16px",
              fontSize: "1rem",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Edit
          </button>
        )}
      </div>
      {/* Product Details */}
      <div style={{ textAlign: "center" }}>
        {product.front_image && !imageError ? (
          <div style={{ position: "relative", display: "inline-block" }}>
            {!imageLoaded && <ImagePlaceholder width="300px" height="300px" />}
            <img
              src={product.front_image}
              alt={product.product_name}
              style={{
                width: "300px",
                height: "auto",
                borderRadius: "8px",
                marginBottom: "20px",
                opacity: imageLoaded ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
                position: imageLoaded ? "static" : "absolute",
                top: 0,
                left: 0
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        ) : product.front_image ? (
          <ImagePlaceholder width="300px" height="300px" />
        ) : null}
        <h1 style={{ fontSize: "1.8rem" }}>{product.product_name}</h1>
        <p style={{ fontSize: "1rem", color: "#555" }}>SKU: {product.sku}</p>

        {isEditing ? (
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="barcode"
              style={{ fontSize: "1rem", color: "#555" }}
            >
              Barcode:
            </label>
            <input
              id="barcode"
              type="search"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              style={{
                marginLeft: "10px",
                padding: "4px 8px",
                fontSize: "1rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        ) : (
          <p style={{ fontSize: "1rem", color: "#555" }}>
            Barcode: {product.barcode_number}
          </p>
        )}

        {/* Display the barcode image below the barcode number */}
        {product.barcode_image && (
          <div style={{ marginTop: "10px" }}>
            <img
              src={product.barcode_image}
              alt="Barcode image"
              style={{ maxWidth: "300px", height: "auto" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
