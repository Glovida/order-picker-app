// components/LoadingOverlay.jsx
export default function LoadingOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.7)", // semi-transparent white overlay
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999, // make sure it sits on top of everything
      }}
    >
      <div
        className="spinner"
        style={{
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
