// pages/login.js
import { getProviders, signIn } from "next-auth/react";
import { useState } from "react";

export default function Login({ providers }) {
  const [error, setError] = useState(null);

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
                  if (result.error) {
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
        // If you add additional providers (like Google, GitHub, etc.)
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

// Fetch providers on the server-side.
export async function getStaticProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
