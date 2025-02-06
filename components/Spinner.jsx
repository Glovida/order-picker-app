// components/Spinner.jsx
"use client";

export default function Spinner({
  minHeight = "100vh",
  size = 50,
  borderSize = 6,
}) {
  const spinnerStyle = {
    display: "inline-block",
    width: `${size}px`,
    height: `${size}px`,
    border: `${borderSize}px solid #dfe5f1`,
    borderTopColor: "#2d3a55",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

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
      <div style={spinnerStyle}></div>
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
