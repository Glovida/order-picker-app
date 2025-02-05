// components/Spinner.jsx
"use client";

export default function Spinner({ minHeight = "100vh" }) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        minHeight,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "inline-block",
          width: "50px",
          height: "50px",
          border: "6px solid #dfe5f1",
          borderTopColor: "#2d3a55",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
