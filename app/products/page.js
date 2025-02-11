"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeGrid as Grid } from "react-window";
import Spinner from "../../components/Spinner";
import SearchBox from "../../components/SearchBox";
import { useProducts } from "../../components/ProductsContext";

// Static style objects
const containerStyle = {
  backgroundColor: "#ffffff",
  minHeight: "100vh",
  padding: "20px",
};

const spinnerContainerStyle = {
  minHeight: "200px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

// Remove the margin from the product card style so that it fills its grid cell.
const productCardStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  border: "1px solid #eaeaea",
  borderRadius: "8px",
  padding: "10px",
  textAlign: "center",
  textDecoration: "none",
  color: "#000",
  backgroundColor: "#f9f9f9",
  width: "100%",
  height: "100%",
  boxSizing: "border-box",
};

const productImageStyle = {
  borderRadius: "4px",
  marginBottom: "10px",
};

const productTitleStyle = {
  fontSize: "1.1rem",
  fontWeight: "bold",
};

const productSkuStyle = {
  fontSize: "0.9rem",
  color: "#555",
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
                    <Link
                      href={`/products/${product.sku}`}
                      style={productCardStyle}
                    >
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

      {/* The container below must have an explicit height so that AutoSizer can compute dimensions.
          Adjust the height as needed depending on your layout. */}
      <div style={{ marginTop: "80px", height: "calc(100vh - 100px)" }}>
        {isLoading ? (
          <div style={spinnerContainerStyle}>
            <Spinner minHeight="200px" />
          </div>
        ) : (
          <VirtualisedProductGrid products={filteredProducts} />
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return <ProductsPageContent />;
}
