import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import "@/styles/global.css";
import I18nProvider from '@/components/I18nProvider';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Saint Seiya Legend of Justice – Codex",
  description: "Discover all characters, relics, and new features from the game Saint Seiya: Legend of Justice. Online database for all versions. (CN, JP, Global).",
  keywords: ["saint seiya", "legend of justice", "codex", "guide", "characters", "athena", "shiryu", "hades", "seiya", "poseidon", "update", "gacha", "CN", "JP", "global"],
  authors: [{ name: "Saint Seiya Codex", url: "https://ssloj.com" }],
  creator: "Saint Seiya Codex",
  metadataBase: new URL("https://ssloj.com"),
  openGraph: {
    title: "Saint Seiya Codex – Complete database",
    description: "All News about versions CN, JP et Global (EN, FR, BR, ES, IT) of the game Saint Seiya: Legend of Justice.",
    url: "https://ssloj.com",
    siteName: "Saint Seiya Codex",
    images: [
      {
        url: "https://ssloj.com/images/share-preview.png",
        width: 1200,
        height: 630,
        alt: "Saint Seiya Codex Logo",
      },
    ],
    locale: "en_US",
    alternateLocales: ["fr_FR", "pt_BR", "es_ES", "it_IT", "zh_CN", "ja_JP"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saint Seiya Codex – Derniers ajouts",
    description: "All news about versions CN, JP et Global of the game Saint Seiya: Legend of Justice.",
    images: ["https://ssloj.com/images/share-logo.png"],
    creator: "@saintseiyacodex",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-64x64.png", sizes: "64x64", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <I18nProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </I18nProvider>
      </body>
    </html>
  );
}
