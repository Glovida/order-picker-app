"use client";

import { useState, useMemo, Suspense, useCallback } from "react";
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

// Image placeholder component for better loading UX
function ImagePlaceholder() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "var(--gray-100)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "4px",
      }}
    >
      <svg
        width="48"
        height="48"
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

// Optimized product card component
const ProductCard = ({ product, style, isMobile }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Responsive image container dimensions
  const imageSize = isMobile ? "87px" : "175px";
  const imageContainerStyle = {
    position: "relative",
    width: imageSize,
    height: imageSize,
    borderRadius: "4px",
    marginBottom: isMobile ? "5px" : "10px",
    overflow: "hidden",
  };

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  return (
    <div style={style}>
      <div
        style={{
          padding: "10px",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        <Link href={`/products/${product.sku}`} style={productCardStyle}>
          <div style={imageContainerStyle}>
            {product.front_image && !imageError ? (
              <>
                {!imageLoaded && <ImagePlaceholder />}
                <Image
                  src={product.front_image}
                  alt={product.product_name}
                  fill
                  sizes={isMobile ? "87px" : "175px"}
                  priority={false}
                  loading="lazy"
                  quality={75}
                  style={{ 
                    objectFit: "cover",
                    opacity: imageLoaded ? 1 : 0,
                    transition: "opacity 0.2s ease-in-out"
                  }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </>
            ) : (
              <ImagePlaceholder />
            )}
          </div>
          <div style={{
            ...productTitleStyle,
            fontSize: isMobile ? "0.75rem" : "0.875rem",
            lineHeight: isMobile ? "1.1" : "1.2",
            maxHeight: isMobile ? "2.2rem" : "auto",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: isMobile ? 2 : 3,
            WebkitBoxOrient: "vertical",
            textOverflow: "ellipsis"
          }}>
            {product.product_name}
          </div>
          <div style={{
            ...productSkuStyle,
            fontSize: isMobile ? "0.65rem" : "0.75rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>SKU: {product.sku}</div>
        </Link>
      </div>
    </div>
  );
};

// Virtualised grid component for the product cards
function VirtualisedProductGrid({ products }) {
  const Cell = useCallback(({ columnIndex, rowIndex, style, data }) => {
    const { numColumns, isMobile } = data;
    const index = rowIndex * numColumns + columnIndex;
    if (index >= products.length) {
      return null;
    }
    const product = products[index];
    return <ProductCard key={product.sku} product={product} style={style} isMobile={isMobile} />;
  }, [products]);

  return (
    <AutoSizer>
      {({ height, width }) => {
        // Detect mobile screen (width < 768px)
        const isMobile = width < 768;
        
        // Responsive card dimensions
        const cardWidth = isMobile ? 110 : 220;
        const cardHeight = isMobile ? 190 : 320;
        
        const numColumns = Math.max(Math.floor(width / cardWidth), 1);
        const numRows = products.length === 0 ? 0 : Math.ceil(products.length / numColumns);

        if (products.length === 0) {
          return null;
        }

        return (
          <Grid
            key={`grid-${products.length}-${numColumns}`}
            columnCount={numColumns}
            columnWidth={cardWidth}
            height={height}
            rowCount={numRows}
            rowHeight={cardHeight}
            width={width}
            overscanRowCount={1}
            overscanColumnCount={0}
            itemData={{ numColumns, isMobile }}
          >
            {Cell}
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
  // Also filter out empty/invalid products from Google Sheets
  const filteredProducts = useMemo(() => {
    // First filter out empty/invalid products
    const validProducts = products.filter((product) => {
      return product && 
             product.sku && 
             String(product.sku).trim() !== "" &&
             product.product_name && 
             String(product.product_name).trim() !== "";
    });

    // Then apply search filter if needed
    const term = searchTerm.trim().toLowerCase();
    if (!term) return validProducts;
    
    return validProducts.filter((product) => {
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
