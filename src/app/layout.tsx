import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout/header";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Ashabi — African stories. Global worlds.",
    template: "%s | Ashabi",
  },
  description:
    "Discover African comics, graphic novels, and illustrated worlds. Explore the first Ashabi concept collection.",
  icons: { icon: "/images/ashabi-logo.png" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
