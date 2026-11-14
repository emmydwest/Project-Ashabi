import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Header, Footer } from "@/components/layout/header";
import { CookieConsentBanner } from "@/components/legal/cookie-consent-banner";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Project Ashabi — African Stories. Limitless Worlds.",
    template: "%s | Project Ashabi",
  },
  description:
    "Discover free-to-read African comics, graphic novels, webtoons, and serialized fiction on Project Ashabi.",
  icons: {
    icon: "/images/ashabi-logo.png",
    apple: "/images/ashabi-logo.png",
  },
  openGraph: {
    title: "Project Ashabi — African Stories. Limitless Worlds.",
    description:
      "An African-founded entertainment and digital publishing platform for comics, webtoons, graphic novels, and serialized fiction.",
    type: "website",
    images: [
      {
        url: "/images/hero-ashabi-dawn.webp",
        width: 1200,
        height: 630,
        alt: "Project Ashabi — African Stories. Limitless Worlds.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Ashabi — African Stories. Limitless Worlds.",
    description:
      "Discover African comics, graphic novels, webtoons, and serialized fiction on Project Ashabi.",
    images: ["/images/hero-ashabi-dawn.webp"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${cormorant.variable}`}>
      <head>
        <link rel="preconnect" href="https://s4.anilist.co" crossOrigin="" />
        <link rel="dns-prefetch" href="https://s4.anilist.co" />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
