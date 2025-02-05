// app/layout.js
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
      <body style={{ backgroundColor: "#ffffff" }}>{children}</body>
    </html>
  );
}
