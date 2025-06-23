"use client";

import { useState, useMemo, Suspense, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
const ProductCard = ({ product, screenSize }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Responsive image container dimensions based on screen size
  const getImageSize = () => {
    switch (screenSize) {
      case 'xs':
        return "100px";
      case 'mobile':
        return "120px";
      default:
        return "175px";
    }
  };

  const imageSize = getImageSize();
  const imageContainerStyle = {
    position: "relative",
    width: imageSize,
    height: imageSize,
    borderRadius: "4px",
    marginBottom: screenSize === 'xs' ? "4px" : screenSize === 'mobile' ? "5px" : "10px",
    overflow: "hidden",
  };

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const getPadding = () => {
    switch (screenSize) {
      case 'xs':
        return "6px";
      case 'mobile':
        return "8px";
      default:
        return "10px";
    }
  };

  const getTitleFontSize = () => {
    switch (screenSize) {
      case 'xs':
        return "0.65rem";
      case 'mobile':
        return "0.75rem";
      default:
        return "0.875rem";
    }
  };

  const getSkuFontSize = () => {
    switch (screenSize) {
      case 'xs':
        return "0.6rem";
      case 'mobile':
        return "0.65rem";
      default:
        return "0.75rem";
    }
  };

  return (
    <div style={{
      padding: getPadding(),
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
    }}>
      <Link href={`/products/${product.sku}`} style={productCardStyle}>
          <div style={imageContainerStyle}>
            {product.front_image && !imageError ? (
              <>
                {!imageLoaded && <ImagePlaceholder />}
                <Image
                  src={product.front_image}
                  alt={product.product_name}
                  fill
                  sizes={imageSize}
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
            fontSize: getTitleFontSize(),
            lineHeight: screenSize === 'xs' ? "1.0" : screenSize === 'mobile' ? "1.1" : "1.2",
            maxHeight: screenSize === 'xs' ? "1.8rem" : screenSize === 'mobile' ? "2.2rem" : "auto",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: screenSize === 'xs' ? 2 : screenSize === 'mobile' ? 2 : 3,
            WebkitBoxOrient: "vertical",
            textOverflow: "ellipsis"
          }}>
            {product.product_name}
          </div>
          <div style={{
            ...productSkuStyle,
            fontSize: getSkuFontSize(),
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>SKU: {product.sku}</div>
        </Link>
    </div>
  );
};

// Regular grid component for the product cards
function ProductGrid({ products }) {
  const [screenSize, setScreenSize] = useState('desktop');

  // Detect screen size with multiple breakpoints
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 425) {
        setScreenSize('xs');
      } else if (width < 768) {
        setScreenSize('mobile');
      } else {
        setScreenSize('desktop');
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getGridColumns = () => {
    switch (screenSize) {
      case 'xs':
        return 'repeat(2, 1fr)';
      case 'mobile':
        return 'repeat(2, 1fr)';
      default:
        return 'repeat(auto-fill, minmax(220px, 1fr))';
    }
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: getGridColumns(),
    gap: screenSize === 'xs' ? '6px' : screenSize === 'mobile' ? '8px' : '10px',
    padding: screenSize === 'xs' ? '15px 5px' : screenSize === 'mobile' ? '20px 10px' : '20px 0',
  };

  return (
    <div style={gridStyle}>
      {products.map((product) => (
        <ProductCard key={product.sku} product={product} screenSize={screenSize} />
      ))}
    </div>
  );
}

function ProductsPageContent() {
  const { products, isLoading, error, fetchProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products when the page loads (only if not already loaded)
  useEffect(() => {
    if (products.length === 0 && !isLoading) {
      fetchProducts();
    }
  }, [fetchProducts, products.length, isLoading]);

  // Memoize valid products separately to avoid recalculating when only search term changes
  const validProducts = useMemo(() => {
    return products.filter((product) => {
      return product && 
             product.sku && 
             String(product.sku).trim() !== "" &&
             product.product_name && 
             String(product.product_name).trim() !== "";
    });
  }, [products]);

  // Memoize search term processing
  const normalizedSearchTerm = useMemo(() => {
    return searchTerm.trim().toLowerCase();
  }, [searchTerm]);

  // Filter products by SKU, product name, or barcode_number
  const filteredProducts = useMemo(() => {
    if (!normalizedSearchTerm) return validProducts;
    
    return validProducts.filter((product) => {
      const sku = String(product.sku || "").toLowerCase();
      const name = String(product.product_name || "").toLowerCase();
      const barcode = String(product.barcode_number || "").toLowerCase();
      return (
        sku.includes(normalizedSearchTerm) || 
        name.includes(normalizedSearchTerm) || 
        barcode.includes(normalizedSearchTerm)
      );
    });
  }, [validProducts, normalizedSearchTerm]);

  return (
    <div style={containerStyle}>
      <SearchBox
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search products by SKU, Name, or Barcode"
      />

      <div className="container" style={{ marginTop: "80px" }}>
        {/* Products Grid Container */}
        <div>
          {error ? (
            <div className="card">
              <div className="card-body text-center py-8">
                <svg 
                  width="48" 
                  height="48" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="var(--error-500)" 
                  strokeWidth="2"
                  style={{ margin: "0 auto var(--space-4)" }}
                >
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <h3 style={{ color: "var(--error-600)", marginBottom: "var(--space-2)" }}>
                  Failed to load products
                </h3>
                <p style={{ color: "var(--gray-600)", marginBottom: "var(--space-4)" }}>
                  {error}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => fetchProducts(true)}
                  disabled={isLoading}
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : isLoading ? (
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
              <ProductGrid products={filteredProducts} />
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
