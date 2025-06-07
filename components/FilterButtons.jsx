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
    <div className="card">
      <div className="card-body">
        <div className="flex flex-wrap gap-2">
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
            
            const isActive = currentFilter === filter;
            const buttonClass = isActive ? "btn btn-primary" : "btn btn-secondary";
            
            return (
              <button
                key={filter}
                onClick={() => setCurrentFilter(filter)}
                className={buttonClass}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                }}
              >
                <span 
                  className={filter === "Done" ? "badge badge-done" : "badge badge-pending"}
                  style={{ 
                    minWidth: "24px",
                    fontSize: "0.75rem",
                    fontWeight: "600"
                  }}
                >
                  {count}
                </span>
                <span>{filter}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
