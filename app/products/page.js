"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeGrid as Grid } from "react-window";
import Spinner from "../../components/Spinner";
import SearchBox from "../../components/SearchBox";
import { useProducts } from "../../components/ProductsContext";

// Static style objects
const containerStyle = {
  minHeight: "100vh",
  padding: "var(--space-4)",
};


// Modern product card style using design system
const productCardStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  border: "1px solid var(--border-color)",
  borderRadius: "var(--radius-lg)",
  padding: "var(--space-4)",
  textAlign: "center",
  textDecoration: "none",
  color: "var(--foreground)",
  backgroundColor: "var(--card-bg)",
  width: "100%",
  height: "100%",
  boxSizing: "border-box",
  boxShadow: "var(--shadow-sm)",
  transition: "all 0.2s ease",
};

const productTitleStyle = {
  fontSize: "0.875rem",
  fontWeight: "600",
  color: "var(--gray-900)",
  lineHeight: "1.2",
};

const productSkuStyle = {
  fontSize: "0.75rem",
  color: "var(--gray-500)",
  fontFamily: "var(--font-mono)",
};

// Virtualised grid component for the product cards
function VirtualisedProductGrid({ products }) {
  return (
    <AutoSizer>
      {({ height, width }) => {
        // Define the dimensions for each grid cell (and product card).
        const cardWidth = 220;
        const cardHeight = 320;

        // Calculate the number of columns that can fit in the available width.
        const numColumns = Math.max(Math.floor(width / cardWidth), 1);
        const numRows = Math.ceil(products.length / numColumns);

        return (
          <Grid
            columnCount={numColumns}
            columnWidth={cardWidth}
            height={height}
            rowCount={numRows}
            rowHeight={cardHeight}
            width={width}
          >
            {({ columnIndex, rowIndex, style }) => {
              const index = rowIndex * numColumns + columnIndex;
              if (index >= products.length) {
                return null;
              }
              const product = products[index];

              // Image container is left as is, with fixed dimensions.
              const imageContainerStyle = {
                position: "relative",
                width: "175px",
                height: "175px",
                borderRadius: "4px",
                marginBottom: "10px",
                overflow: "hidden", // Clip any overflow
              };

              return (
                <div style={style}>
                  {/* 
                    Wrap the Link in a container that applies padding.
                    This padding acts as a gap between grid cells 
                    while the grid cell (style from react-window) stays the same size.
                  */}
                  <div
                    style={{
                      padding: "10px",
                      width: "100%",
                      height: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    <Link href={`/products/${product.sku}`} style={productCardStyle}>
                      {product.front_image && (
                        <div style={imageContainerStyle}>
                          <Image
                            src={product.front_image}
                            alt={product.product_name}
                            fill
                            style={{ objectFit: "cover" }} // or "contain" as desired
                          />
                        </div>
                      )}
                      <div style={productTitleStyle}>
                        {product.product_name}
                      </div>
                      <div style={productSkuStyle}>SKU: {product.sku}</div>
                    </Link>
                  </div>
                </div>
              );
            }}
          </Grid>
        );
      }}
    </AutoSizer>
  );
}

function ProductsPageContent() {
  const { products, isLoading } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products by SKU, product name, or barcode_number.
  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) => {
      const sku = String(product.sku || "").toLowerCase();
      const name = String(product.product_name || "").toLowerCase();
      const barcode = String(product.barcode_number || "").toLowerCase();
      return (
        sku.includes(term) || name.includes(term) || barcode.includes(term)
      );
    });
  }, [products, searchTerm]);

  return (
    <div style={containerStyle}>
      <SearchBox
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search products by SKU, Name, or Barcode"
      />

      <div className="container" style={{ marginTop: "80px" }}>
        {/* Products Grid Container */}
        <div style={{ height: "calc(100vh - 100px)", minHeight: "400px" }}>
          {isLoading ? (
            <div className="card">
              <div className="card-body text-center py-8">
                <Spinner minHeight="200px" />
                <p className="mt-4">Loading products...</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-8">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="1.5" style={{ margin: "0 auto var(--space-4)" }}>
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <h3 style={{ color: "var(--gray-600)" }}>No products found</h3>
                <p style={{ color: "var(--gray-500)" }}>
                  {searchTerm ? `No products match "${searchTerm}"` : 'No products available'}
                </p>
              </div>
            </div>
          ) : (
            <Suspense fallback={
              <div className="card">
                <div className="card-body text-center py-8">
                  <Spinner minHeight="200px" />
                  <p className="mt-4">Loading products...</p>
                </div>
              </div>
            }>
              <VirtualisedProductGrid products={filteredProducts} />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return <ProductsPageContent />;
}
