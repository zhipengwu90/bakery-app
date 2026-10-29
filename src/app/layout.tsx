import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import Script from "next/script";
import AuthLinkRedirect from "./AuthLinkRedirect";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["SOFT", "opsz"],
});
const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://brazenpoppy.ca"),
  title: {
    default: "Brazen Poppy Bakery Restaurant | Café in Parksville, BC",
    template: "%s · Brazen Poppy Bakery Restaurant",
  },
  description:
    "Bakery café in Parksville, BC: sandwiches on fresh-baked bread, homemade soup, poppy seed rolls and great coffee. Open for breakfast and lunch.",
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
    title: "Brazen Poppy Bakery Restaurant | Café in Parksville, BC",
    description:
      "Bakery café in Parksville, BC: sandwiches on fresh-baked bread, homemade soup, poppy seed rolls and great coffee. Open for breakfast and lunch.",
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MJ9SM199H3"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MJ9SM199H3');
          `}
        </Script>
      </head>
      <body>
        <AuthLinkRedirect />
        {children}
      </body>
    </html>
  );
}
