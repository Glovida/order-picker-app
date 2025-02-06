"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Spinner from "/components/Spinner"; // adjust the path if needed

export default function Login() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show the spinner in the button
    const username = e.target.username.value;
    const password = e.target.password.value;

    const result = await signIn("credentials", {
      redirect: true,
      username,
      password,
      callbackUrl: "/",
    });

    // Handle errors and set loading to false if needed:
     if (result?.error) {
       setError(result.error);
       setLoading(false);
     }
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          type="text"
          placeholder="Username"
          required
          style={{ padding: "10px", marginBottom: "10px" }}
        />
        <br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          style={{ padding: "10px", marginBottom: "10px" }}
        />
        <br />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dfe5f1",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            minWidth: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading ? (
            // Use the same Spinner component with smaller size values
            <Spinner size={20} borderSize={3} minHeight="auto" />
          ) : (
            "Sign In"
          )}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
