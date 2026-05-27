import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import GoogleAuthProvider from "@/components/auth/GoogleAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://driveeasy.com"),
  title: "DriveEasy | Premium Car Rental Service",
  description: "Book premium cars at affordable prices. Fast, reliable, and hassle-free car rental with DriveEasy. Wide range of vehicles including SUVs, sedans, and luxury cars.",
  keywords: "car rental, book car, rent a car, vehicle rental, premium cars, DriveEasy, auto rental",
  authors: [{ name: "DriveEasy" }],
  openGraph: {
    title: "DriveEasy | Premium Car Rental",
    description: "Book premium cars instantly. Fast, reliable, and affordable car rental platform.",
    url: "https://driveeasy.com",
    siteName: "DriveEasy",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "DriveEasy Car Rental",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DriveEasy | Premium Car Rental",
    description: "Book premium cars instantly. Fast, reliable, and affordable car rental platform.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col transition-colors duration-300 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100`}>
        <GoogleAuthProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-grow min-h-screen">{children}</main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#1F2933",
                  color: "#fff",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  fontSize: "14px",
                },
                success: { iconTheme: { primary: "#10B981", secondary: "#fff" } },
                error:   { iconTheme: { primary: "#EF4444",  secondary: "#fff" } },
              }}
            />
          </ThemeProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
