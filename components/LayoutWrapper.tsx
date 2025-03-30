"use client"; // Directive pour indiquer que ce composant est un composant client-side

import React, { useRef, useEffect, useState } from "react";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const headerRef = useRef<HTMLElement>(null);
  const [offsetTop, setOffsetTop] = useState(0);
  const [activeLink, setActiveLink] = useState<string>("");
  const [language, setLanguage] = useState<string>("FR");

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

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full bg-[#0a091c] shadow-md z-50 flex items-center justify-between px-6 h-[80px] text-white"
      >
        {/* Navigation à gauche */}
        <nav className="flex space-x-2">
          {[
            { href: "/characters", label: "Personnages" },
            { href: "/arayashikis", label: "Arayashikis" },
            { href: "/artefacts", label: "Artefacts" },
            { href: "/vestiges", label: "Vestiges" },
          ].map(({ href, label }) => {
            const isActive = activeLink.startsWith(href);
            return (
              <a
                key={href}
                href={href}
                className={`relative group text-m px-3 py-1 rounded transition-all ${
                  isActive ? "text-yellow-400" : "text-white hover:text-yellow-400"
                }`}
              >
                {label}
                <span
                  className={`absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-[1px] rounded-full transition-all duration-500 bg-gradient-to-r from-[#0a091c] via-yellow-400 to-[#0a091c] ${
                    isActive
                      ? "w-14 opacity-100"
                      : "w-0 group-hover:w-14 group-hover:opacity-100 opacity-0"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Logo centré qui dépasse un peu du header */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src="/images/logo.png" alt="Logo" className="h-15" />
        </div>

        {/* Sélecteur de langue à droite */}
        <div>
          <select
            className="bg-transparent border border-white/30 text-white text-sm px-2 py-1 rounded"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="FR">Français</option>
            <option value="EN">Anglais</option>
            <option value="CN">Chinois</option>
            <option value="JP">Japonais</option>
          </select>
        </div>
      </header>

      {/* Contenu principal avec un padding en fonction de la hauteur du header */}
      <main style={{ paddingTop: offsetTop }}>{children}</main>
    </>
  );
}