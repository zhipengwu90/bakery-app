import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Brazen Poppy Bakery - Fresh Baked Goods & Coffee in Parksville, BC",
  description:
    "Award-winning bakery cafe in Parksville, BC offering homemade sandwiches with freshly baked bread, homemade soup, signature poppy seed rolls, and premium coffee. Daily breakfast and lunch specials.",
  keywords: [
    "bakery Parksville",
    "cafe Parksville BC",
    "fresh bread",
    "homemade sandwiches",
    "poppy seed rolls",
    "coffee shop",
    "breakfast Parksville",
    "lunch Parksville",
    "homemade soup",
    "fresh baked goods",
    "local bakery Vancouver Island",
  ],
  authors: [{ name: "Brazen Poppy Bakery" }],
  creator: "Brazen Poppy Bakery",
  publisher: "Brazen Poppy Bakery",
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
  openGraph: {
    title: "Brazen Poppy Bakery - Fresh Baked Goods & Coffee in Parksville, BC",
    description:
      "Award-winning bakery cafe in Parksville, BC offering homemade sandwiches with freshly baked bread, homemade soup, signature poppy seed rolls, and premium coffee.",
    url: "https://brazenpoppy.ca",
    siteName: "Brazen Poppy Bakery",
    images: [
      {
        url: "https://lh3.googleusercontent.com/p/AF1QipOsp3wSjL8xuybkzCalbYo1NcXOBYLGi6sOFRcQ=s1360-w1360-h1020",
        width: 1200,
        height: 630,
        alt: "Brazen Poppy Bakery storefront in Parksville, BC",
      },
    ],
    locale: "en_CA",
    type: "website",
  },

  other: {
    "geo.region": "CA-BC",
    "geo.placename": "Parksville",
    "geo.position": "49.3175;-124.3139",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MJ9SM199H3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MJ9SM199H3');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavBar />
        {children}
        <div id="modal-root"></div>
        <Footer />
      </body>
    </html>
  );
}
