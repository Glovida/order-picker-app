"use client";
import React from "react";

export default function FilterButtons({
  filters,
  currentFilter,
  setCurrentFilter,
  orders,
  doneOrders,
  pendingByPlatform,
}) {
  return (
    <div
      style={{
        marginBottom: "20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      {filters.map((filter) => {
        let count = 0;
        if (filter === "All") {
          count = orders.length;
        } else if (filter === "Done") {
          count = doneOrders.length;
        } else {
          count = pendingByPlatform[filter]
            ? pendingByPlatform[filter].length
            : 0;
        }
        return (
          <button
            key={filter}
            onClick={() => setCurrentFilter(filter)}
            style={{
              padding: "8px 16px",
              fontSize: "1rem",
              backgroundColor: currentFilter === filter ? "#2d3a55" : "#dfe5f1",
              color: currentFilter === filter ? "#ffffff" : "#000000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                backgroundColor: "#ffffff",
                color: "#2d3a55",
                border: "1px solid #2d3a55",
                padding: "2px 6px",
                borderRadius: "3px",
                marginRight: "5px",
                fontSize: "0.8rem",
                minWidth: "20px",
                textAlign: "center",
              }}
            >
              {count}
            </span>
            {filter}
          </button>
        );
      })}
    </div>
  );
}
