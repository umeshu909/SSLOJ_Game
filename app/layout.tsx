import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import "@/styles/global.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Saint Seiya Legend of Justice – Codex",
  description: "Découvrez tous les personnages, vestiges et nouveautés du jeu Saint Seiya: Legend of Justice. Base de données en ligne pour toutes les versions (CN, JP, Global).",
  keywords: ["saint seiya", "legend of justice", "codex", "guide", "personnages", "athena", "shiryu", "mise à jour", "gacha", "CN", "JP", "global"],
  authors: [{ name: "Saint Seiya Codex", url: "https://ssloj.com" }],
  creator: "Saint Seiya Codex",
  metadataBase: new URL("https://ssloj.com"),
  openGraph: {
    title: "Saint Seiya Codex – Base de données complète",
    description: "Toutes les nouveautés des versions CN, JP et Global du jeu Saint Seiya: Legend of Justice.",
    url: "https://ssloj.com",
    siteName: "Saint Seiya Codex",
    images: [
      {
        url: "/images/share-preview.png",
        width: 1200,
        height: 630,
        alt: "Saint Seiya Codex Logo",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saint Seiya Codex – Derniers ajouts",
    description: "Toutes les nouveautés des versions CN, JP et Global du jeu Saint Seiya: Legend of Justice.",
    images: ["/images/share-logo.png"],
    creator: "@saintseiyacodex",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
      </head>
      <body className="...">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
