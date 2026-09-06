import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TerraMind AI — Environmental & Resource Conservation Intelligence",
  description: "Planetary Earth Observation Satellite Intelligence, AI-Driven Conservation Tracking, and Explainable Risk Predictors across India",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FBFBF8] text-[#14281D] min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
