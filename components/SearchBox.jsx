"use client";
import React from "react";

export default function SearchBox({ searchTerm, setSearchTerm }) {
  return (
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
      }}
    >
      <input
        type="search"
        placeholder="Search by Order or Tracking Number"
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
  );
}
