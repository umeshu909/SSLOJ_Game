'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Accueil", href: "/" },
  { label: "Chevaliers", href: "/chevaliers" },
  { label: "Arayashikis", href: "/arayashikis" },
  { label: "Vestiges", href: "/vestiges" },
  { label: "Artefacts", href: "/artefacts" },
  { label: "Statues", href: "/statues" },
  { label: "Pêche", href: "/fishery" },
  { label: "Timeline", href: "/timeline" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full fixed top-0 z-50 bg-[#0b0a18]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">
          Saint Seiya
        </Link>

        <nav className="flex gap-4 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-1 rounded transition-colors",
                pathname === item.href
                  ? "text-purple-300 font-semibold"
                  : "text-white hover:text-purple-300"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
