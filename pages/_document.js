import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon.ico" />
        {/* Link to the manifest */}
        <link rel="manifest" href="/manifest.json" />
        {/* Set theme color */}
        <meta name="theme-color" content="#2d3a55" />
        {/* Apple-specific tags for iOS support */}
        <link rel="apple-touch-icon" href="/icons/glovidalogosq192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        {/* You can add other meta tags for splash screen images if needed */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
