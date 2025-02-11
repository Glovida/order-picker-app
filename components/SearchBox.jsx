"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function SearchBox({
  searchTerm,
  setSearchTerm,
  placeholder = "Search by Order or Tracking Number",
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          padding: "10px",
          zIndex: 100,
          borderBottom: "1px solid #eaeaea",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
        }}
      >
        <button
          onClick={toggleMenu}
          style={{
            marginRight: "10px",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
          aria-label="Open Menu"
        >
          ☰
        </button>
        <input
          type="search"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "10px",
            fontSize: "1rem",
          }}
        />
      </div>

      {/* Slide-out Menu */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100%",
          width: "250px",
          backgroundColor: "#ffffff",
          zIndex: 200,
          transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-out",
          boxShadow: isMenuOpen ? "2px 0px 5px rgba(0,0,0,0.3)" : "none",
          padding: "20px",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#2d3a55" }}>Menu</h2>
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <Link
            href="/"
            style={{
              fontSize: "1.2rem",
              textDecoration: "none",
              color: "#2d3a55",
              paddingBottom: "10px",
            }}
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            href="/products"
            style={{
              fontSize: "1.2rem",
              textDecoration: "none",
              color: "#2d3a55",
              paddingBottom: "10px",
            }}
            onClick={toggleMenu}
          >
            Products
          </Link>
        </nav>
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
          }}
        ></div>
      )}
    </>
  );
}
