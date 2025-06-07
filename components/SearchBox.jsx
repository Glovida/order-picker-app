"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function SearchBox({
  searchTerm,
  setSearchTerm,
  placeholder = "Search by Order or Tracking Number",
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      {/* Fixed header with hamburger menu and search box */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: "var(--space-4)",
          zIndex: 100,
          borderBottom: "1px solid var(--primary-800)",
          backgroundColor: "rgb(45, 58, 85)",
          boxShadow: "var(--shadow-md)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)",
        }}
      >
        <button
          onClick={toggleMenu}
          style={{
            padding: "var(--space-2)",
            minWidth: "auto",
            aspectRatio: "1",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "var(--radius-md)",
            color: "white",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
            e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
          }}
          aria-label="Open Menu"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        
        <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="var(--gray-400)" 
            strokeWidth="2"
            style={{
              position: "absolute",
              left: "var(--space-3)",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none"
            }}
          >
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="search"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              paddingLeft: "var(--space-10)",
              fontSize: "0.875rem",
            }}
          />
        </div>
      </div>
      {/* Slide-out Menu */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100%",
          width: "320px",
          backgroundColor: "var(--card-bg)",
          zIndex: 200,
          transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-out",
          boxShadow: isMenuOpen ? "var(--shadow-lg)" : "none",
          borderRight: "1px solid var(--border-color)",
        }}
      >
        <div style={{ padding: "var(--space-6)", height: "100%", display: "flex", flexDirection: "column" }}>
          <div className="flex items-center justify-between mb-6">
            <h3 style={{ margin: 0, color: "var(--gray-900)" }}>Navigation</h3>
            <button
              onClick={toggleMenu}
              className="btn btn-secondary btn-sm"
              style={{
                padding: "var(--space-1)",
                minWidth: "auto",
                aspectRatio: "1",
              }}
              aria-label="Close Menu"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-4 text-decoration-none"
              style={{
                color: "var(--gray-700)",
                padding: "var(--space-3) 0",
                minHeight: "48px",
              }}
              onClick={toggleMenu}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              <span style={{ fontSize: "1rem", fontWeight: "600" }}>Orders Dashboard</span>
            </Link>
            
            <Link
              href="/products"
              className="flex items-center gap-4 text-decoration-none"
              style={{
                color: "var(--gray-700)",
                padding: "var(--space-3) 0",
                minHeight: "48px",
              }}
              onClick={toggleMenu}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              <span style={{ fontSize: "1rem", fontWeight: "600" }}>Product Catalog</span>
            </Link>
          </nav>
          
          {/* Logout Button */}
          <div style={{ marginTop: "auto", paddingTop: "var(--space-6)", borderTop: "1px solid var(--border-color)" }}>
            <button
              onClick={() => {
                setLogoutLoading(true);
                signOut({ callbackUrl: "/login" });
              }}
              disabled={logoutLoading}
              className="flex items-center gap-4"
              style={{
                color: "var(--error-600)",
                padding: "var(--space-3) 0",
                minHeight: "48px",
                border: "none",
                backgroundColor: "transparent",
                width: "100%",
                cursor: logoutLoading ? "not-allowed" : "pointer",
                opacity: logoutLoading ? 0.6 : 1,
                textAlign: "left",
              }}
            >
              {logoutLoading ? (
                <>
                  <div className="spinner" style={{ width: "24px", height: "24px" }}></div>
                  <span style={{ fontSize: "1rem", fontWeight: "600" }}>Logging out...</span>
                </>
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16,17 21,12 16,7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  <span style={{ fontSize: "1rem", fontWeight: "600" }}>Log Out</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Backdrop overlay */}
      {isMenuOpen && (
        <div
          onClick={toggleMenu}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 150,
            transition: "opacity 0.3s ease",
          }}
        ></div>
      )}
    </>
  );
}
