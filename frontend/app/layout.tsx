import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "DigiTwin — Digital Twin Healthcare Platform",
  description: "Predictive healthcare powered by your personal digital twin. Monitor vitals, simulate treatments, and optimize your health.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased bg-bg text-dark">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
