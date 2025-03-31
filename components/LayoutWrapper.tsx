"use client"; // Directive pour indiquer que ce composant est un composant client-side

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const headerRef = useRef<HTMLElement>(null);
  const [offsetTop, setOffsetTop] = useState(0);
  const [activeLink, setActiveLink] = useState<string>("");
  const [language, setLanguage] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lang") || "FR";
    }
    return "FR";
  });

  const router = useRouter();

  useEffect(() => {
    const handleUrlChange = () => {
      setActiveLink(window.location.pathname);
    };
    handleUrlChange();
    window.addEventListener("popstate", handleUrlChange);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, []);

  useEffect(() => {
    if (headerRef.current) {
      setOffsetTop(headerRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    // Stocker la langue sélectionnée dans localStorage
    localStorage.setItem("lang", language);
  }, [language]);

  const handleBack = () => {
    if (document.referrer && window.history.length > 1) {
      router.back();
    } else {
      router.push("/characters");
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full bg-[#0a091c] shadow-md z-50 px-4 text-white"
      >
        {/* --- Mobile layout --- */}
        <div className="md:hidden">
          {/* Rangée supérieure : flèche + logo + sélecteur */}
          <div className="relative flex items-center justify-center pt-2 pb-2">
            <div className="absolute left-4 h-6 flex items-center">
              <button onClick={handleBack} className="p-1 hover:opacity-80 transition">
                <ArrowLeft className="w-6 h-6 text-white" strokeWidth={1} />
              </button>
            </div>
            <img src="/images/logo.png" alt="Logo" className="h-14" />
            <div className="absolute right-4">
              <select
                className="bg-transparent border border-white/30 text-white text-sm px-2 py-1 rounded"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="FR">FR</option>
                <option value="EN">EN</option>
                <option value="CN">CN</option>
                <option value="JP">JP</option>
              </select>
            </div>
          </div>

          {/* Navigation scrollable horizontalement en dessous */}
          <nav className="flex overflow-x-auto space-x-4 scrollbar-hide w-full justify-start px-2 pt-2 pb-4">
            {[
              { href: "/characters", label: "Personnages" },
              { href: "/arayashikis", label: "Arayashikis" },
              { href: "/artefacts", label: "Artefacts" },
              { href: "/vestiges", label: "Vestiges" },
              { href: "/statues", label: "Statues" },
            ].map(({ href, label }) => {
              const isActive = activeLink.startsWith(href);
              return (
                <a
                  key={href}
                  href={href}
                  className={`flex-shrink-0 relative group text-sm px-3 py-1 rounded transition-all whitespace-nowrap ${isActive ? "text-yellow-400" : "text-white hover:text-yellow-400"
                    }`}
                >
                  {label}
                  <span
                    className={`absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-[1px] rounded-full transition-all duration-500 bg-gradient-to-r from-[#0a091c] via-yellow-400 to-[#0a091c] ${isActive
                        ? "w-14 opacity-100"
                        : "w-0 group-hover:w-14 group-hover:opacity-100 opacity-0"
                      }`}
                  />
                </a>
              );
            })}
          </nav>
        </div>

        {/* --- Desktop layout --- */}
        <div className="hidden md:flex items-center justify-between h-[80px] px-6">
          {/* Navigation à gauche */}
          <nav className="flex space-x-2">
            {[
              { href: "/characters", label: "Personnages" },
              { href: "/arayashikis", label: "Arayashikis" },
              { href: "/artefacts", label: "Artefacts" },
              { href: "/vestiges", label: "Vestiges" },
              { href: "/statues", label: "Statues" },
            ].map(({ href, label }) => {
              const isActive = activeLink.startsWith(href);
              return (
                <a
                  key={href}
                  href={href}
                  className={`relative group text-m px-3 py-1 rounded transition-all ${isActive ? "text-yellow-400" : "text-white hover:text-yellow-400"
                    }`}
                >
                  {label}
                  <span
                    className={`absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-[1px] rounded-full transition-all duration-500 bg-gradient-to-r from-[#0a091c] via-yellow-400 to-[#0a091c] ${isActive
                        ? "w-14 opacity-100"
                        : "w-0 group-hover:w-14 group-hover:opacity-100 opacity-0"
                      }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Logo centré */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img src="/images/logo.png" alt="Logo" className="h-15" />
          </div>

          {/* Sélecteur de langue à droite */}
          <div>
            <select
              className="bg-transparent border border-white/30 text-white text-sm px-2 py-1 rounded"
              value={language}
              onChange={(e) => {
                                  setLanguage(e.target.value);
                                  window.location.reload(); // force un refresh complet
                                }}

            >
              <option value="FR">FR</option>
              <option value="EN">EN</option>
              <option value="CN">CN</option>
              <option value="JP">JP</option>
            </select>
          </div>
        </div>
      </header>

      {/* Contenu principal avec un padding en fonction de la hauteur du header */}
      <main style={{ paddingTop: offsetTop }}>{children}</main>
    </>
  );
}
