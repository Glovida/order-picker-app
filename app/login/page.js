"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Spinner from "../../components/Spinner";

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
    <div className="flex items-center justify-center" style={{ minHeight: "100vh", background: "linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%)" }}>
      <div className="card" style={{ width: "100%", maxWidth: "400px", margin: "var(--space-4)" }}>
        <div className="card-header text-center">
          <div style={{ 
            width: "60px", 
            height: "60px", 
            background: "var(--primary-600)", 
            borderRadius: "50%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            margin: "0 auto var(--space-4)"
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2 style={{ margin: 0, color: "var(--gray-900)" }}>Welcome Back</h2>
          <p style={{ margin: "var(--space-2) 0 0", color: "var(--gray-600)" }}>
            Sign in to access your order dashboard
          </p>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
            </div>
            
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>
            
            {error && (
              <div style={{
                padding: "var(--space-3)",
                background: "var(--error-50)",
                border: "1px solid var(--error-200)",
                borderRadius: "var(--radius-md)",
                color: "var(--error-600)",
                fontSize: "0.875rem"
              }}>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  {error}
                </div>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: "100%" }}
            >
              {loading ? (
                <>
                  <Spinner size={16} borderSize={2} minHeight="auto" />
                  Signing in...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10,17 15,12 10,7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="card-footer text-center">
          <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--gray-500)" }}>
            Glovida Internal App v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
