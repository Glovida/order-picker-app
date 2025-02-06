// components/ItemList.jsx
"use client";

export default function ItemList({ order, scanCounts }) {
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {order.items.map((item, index) => {
        const required = Number(item.realQuantity);
        const scanned = scanCounts[index] || 0;
        const progressPercent = Math.min((scanned / required) * 100, 100);
        return (
          <li key={item.lineItemKey} style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {item.frontImage && (
                <img
                  src={item.frontImage}
                  alt={item.productName}
                  style={{
                    width: "100px",
                    height: "auto",
                    marginRight: "10px",
                  }}
                />
              )}
              <div>
                <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  {item.productName}
                </div>
                <div style={{ fontSize: "1rem" }}>
                  {item.realSkuNumber} | Required: {required} | Scanned:{" "}
                  {scanned}
                </div>
              </div>
            </div>
            {/* Progress Bar */}
            <div
              style={{
                marginTop: "8px",
                width: "100%",
                height: "10px",
                backgroundColor: "#dfe5f1",
                borderRadius: "5px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  backgroundColor: "#2d3a55",
                }}
              ></div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
