// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Verify the credentials using environment variables.
        // For an internal app, these values can be set in .env.local.
        const username = process.env.CREDENTIAL_USERNAME;
        const password = process.env.CREDENTIAL_PASSWORD;

        if (
          credentials.username === username &&
          credentials.password === password
        ) {
          // Return an object representing the user.
          return { id: 1, name: "Admin", email: "admin@example.com" };
        }
        // Return null if authentication fails.
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: "/login", // Custom login page
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production", // use secure cookies only in production
      },
    },
  },
  debug: true, // Enable debug logging to see more info in your console/logs
});
