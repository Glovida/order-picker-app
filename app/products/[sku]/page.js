"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner";
import { useProducts } from "../../../components/ProductsContext";

// The endpoint for fetching products (fallback)
const API_PRODUCTS_URL = process.env.NEXT_PUBLIC_PRODUCT_API_URL;
// The endpoint for updating the barcode via the Next.js API route
const UPDATE_BARCODE_API_URL = "/api/updateBarcode";

export default function ProductDetailPage() {
  const { sku } = useParams();
  const router = useRouter();
  const { products } = useProducts();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // New state to control editing and hold the input value
  const [isEditing, setIsEditing] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");

  useEffect(() => {
    async function fetchProductFallback() {
      try {
        setIsLoading(true);
        const res = await fetch(API_PRODUCTS_URL);
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
        console.error("Error fetching product fallback:", error);
      } finally {
        setIsLoading(false);
      }
    }

    // First, try to get the product from the global context.
    if (sku && products.length > 0) {
      const found = products.find(
        (p) =>
          String(p.sku).trim().toLowerCase() ===
          String(sku).trim().toLowerCase()
      );
      if (found) {
        setProduct(found);
        setBarcodeInput(found.barcode_number || "");
        setIsLoading(false);
        return;
      }
    }
    // Otherwise, fallback to fetching the product data.
    if (sku) {
      fetchProductFallback();
    }
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
        // Update the local product state with the new barcode value
        setProduct({
          ...product,
          barcode_number: barcodeInput,
        });
        // Use Next.js quick refresh to update the page without a full reload
        router.refresh();
      } else {
        console.error("Failed to update barcode");
      }
    } catch (error) {
      console.error("Error updating barcode:", error);
    }
    // Switch off edit mode after saving
    setIsEditing(false);
  }

  if (isLoading) {
    return <Spinner minHeight="200px" />;
  }

  if (!product) {
    return <p>Product not found</p>;
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
          barcodeInput === (product.barcode_number || "") ? (
            <button
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
            >
              Close
            </button>
          ) : (
            <button
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
            >
              Save
            </button>
          )
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
        {product.front_image && (
          <img
            src={product.front_image}
            alt={product.product_name}
            style={{
              width: "300px",
              height: "auto",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          />
        )}
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
