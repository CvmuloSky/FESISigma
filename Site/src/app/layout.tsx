import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AOSProvider } from "@/components/aos-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NerVox - Advanced Voice Analysis",
  description: "Advanced AI-powered voice analysis platform for healthcare professionals",
  keywords: ["voice analysis", "AI", "healthcare", "medical", "diagnostics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-white`}>
        <AOSProvider>
          {children}
        </AOSProvider>
      </body>
    </html>
  );
}
