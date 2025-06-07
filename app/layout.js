// app/layout.js
import { Providers } from "./providers";
import { WebVitals } from "../components/WebVitals";
import "../styles/globals.css";
import "../styles/Home.module.css";

export const metadata = {
  title: "Glovida Internal App",
  description: "Internal app for order picking",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#2d3a55",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body style={{ backgroundColor: "#ffffff" }}>
        <WebVitals />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
