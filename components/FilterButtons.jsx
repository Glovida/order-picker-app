"use client";
import React, { useMemo } from "react";

export default function FilterButtons({
  filters,
  currentFilter,
  setCurrentFilter,
  orders,
  doneOrders,
  pendingByPlatform,
}) {
  // Memoize filter counts to prevent expensive recalculations on every render
  const filterCounts = useMemo(() => {
    const counts = {};
    filters.forEach((filter) => {
      if (filter === "All") {
        counts[filter] = orders.length;
      } else if (filter === "Done") {
        counts[filter] = doneOrders.length;
      } else {
        counts[filter] = pendingByPlatform[filter] ? pendingByPlatform[filter].length : 0;
      }
    });
    return counts;
  }, [filters, orders.length, doneOrders.length, pendingByPlatform]);

  // Memoize filter buttons to prevent unnecessary re-renders
  const filterButtons = useMemo(() => {
    return filters.map((filter) => {
      const count = filterCounts[filter];
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
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}
        >
          <span 
            className={filter === "Done" ? "badge badge-done" : "badge badge-pending"}
            style={{ 
              minWidth: "20px",
              fontSize: "0.75rem",
              fontWeight: "600",
              textAlign: "center"
            }}
          >
            {count}
          </span>
          <span>{filter}</span>
        </button>
      );
    });
  }, [filters, filterCounts, currentFilter, setCurrentFilter]);

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex flex-wrap gap-2" style={{
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          width: '100%'
        }}>
          {filterButtons}
        </div>
      </div>
    </div>
  );
}
