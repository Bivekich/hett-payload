import React, { Suspense } from 'react';
import type { Metadata } from "next";
import { Roboto, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-roboto",
});

const roboto_condensed = Roboto_Condensed({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-roboto-condensed",
});

export const metadata: Metadata = {
  title: "Hett Automotive",
  description: "Hett Automotive",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body 
        className={`${
          roboto.variable
        } ${roboto_condensed.variable}`}
      >
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <main className="flex-1 mt-[140px] md:mt-[160px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
