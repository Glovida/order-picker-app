"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Login() {
  const [providers, setProviders] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/auth/providers")
      .then((res) => res.json())
      .then((data) => setProviders(data))
      .catch((err) => console.error("Error fetching providers:", err));
  }, []);

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
      {Object.values(providers).map((provider) => {
        if (provider.id === "credentials") {
          return (
            <div key={provider.name}>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const username = e.target.username.value;
                  const password = e.target.password.value;
                  const result = await signIn(provider.id, {
                    username,
                    password,
                    callbackUrl: "/",
                  });
                  if (result?.error) {
                    setError(result.error);
                  }
                }}
              >
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
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#dfe5f1",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Sign In
                </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
              </form>
            </div>
          );
        }
        return (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </button>
          </div>
        );
      })}
    </div>
  );
}
