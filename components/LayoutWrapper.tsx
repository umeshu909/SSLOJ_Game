"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import DropdownMenuPortal from "../components/DropdownMenuPortal";


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

  const fisheryRef = useRef<HTMLDivElement>(null);
  const autresRef = useRef<HTMLDivElement>(null);
  const [showFisheryDropdown, setShowFisheryDropdown] = useState(false);
  const [showAutresDropdown, setShowAutresDropdown] = useState(false);
  const [fisheryPos, setFisheryPos] = useState({ top: 0, left: 0 });
  const [autresPos, setAutresPos] = useState({ top: 0, left: 0 });
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    if (!headerRef.current) return;

    const updateOffset = () => {
      setOffsetTop(headerRef.current!.offsetHeight);
    };

    updateOffset();
    const observer = new ResizeObserver(updateOffset);
    observer.observe(headerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", language);
  }, [language]);

  useEffect(() => {
    if (showFisheryDropdown && fisheryRef.current) {
      const rect = fisheryRef.current.getBoundingClientRect();
      setFisheryPos({ top: rect.bottom + 4, left: rect.left });
    }
  }, [showFisheryDropdown]);

  useEffect(() => {
    if (showAutresDropdown && autresRef.current) {
      const rect = autresRef.current.getBoundingClientRect();
      setAutresPos({ top: rect.bottom + 4, left: rect.left });
    }
  }, [showAutresDropdown]);


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
        className="fixed top-0 right-0 left-0 w-full bg-[#0a091c] shadow-md z-50 text-white"
      >
        {/* Header commun mobile/desktop */}
        <div className="relative flex items-center justify-between pt-2 pb-2">
          <button onClick={handleBack} className="md:hidden p-1 hover:opacity-80 transition absolute left-3">
            <ArrowLeft className="w-6 h-6 text-white" strokeWidth={1} />
          </button>

          <div className="flex-1 flex justify-center">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-14 cursor-pointer"
              onClick={() => {
                setActiveLink("/"); // ← mise à jour manuelle de l'état actif
                router.push("/");
              }}
            />
          </div>

          <div className="absolute right-4">
            <select
              className="bg-gray-800 border border-white/30 text-white text-sm px-2 py-1 rounded"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                window.location.reload();
              }}
            >
              <option value="FR">FR</option>
              <option value="EN">EN</option>
              <option value="CN">CN</option>
              <option value="JP">JP</option>
            </select>
          </div>
        </div>

        <nav
          className="
            flex items-center gap-1
            px-2 pb-3 pt-2
            overflow-x-auto scrollbar-hide
            md:justify-center md:flex-wrap md:overflow-visible
          "
        >
          {["characters", "arayashikis", "artefacts", "vestiges", "statues"].map((path) => {
            const href = `/${path}`;
            const label = path.charAt(0).toUpperCase() + path.slice(1);
            const isActive = activeLink !== "/" && activeLink.startsWith(href);
            return (
              <a
                key={href}
                href={href}
                className={`relative group text-sm px-3 py-1 rounded transition-all whitespace-nowrap ${isActive ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}
              >
                {label}
                <span
                  className={`absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-[1px] rounded-full transition-all duration-500 bg-gradient-to-r from-[#0a091c] via-yellow-400 to-[#0a091c] ${isActive ? "w-14 opacity-100" : "w-0 group-hover:w-14 group-hover:opacity-100 opacity-0"}`}
                />
              </a>
            );
          })}

          {/* Menu déroulant Pecherie */}
          {isMounted && (
            <div
              ref={fisheryRef}
              onClick={() => {
                setShowFisheryDropdown(!showFisheryDropdown);
                setShowAutresDropdown(false);
              }}
              className="relative text-sm px-3 py-1 rounded text-white hover:text-yellow-400 transition-all whitespace-nowrap cursor-pointer"
            >
              Pêcherie
            </div>
            )}


          {isMounted && showFisheryDropdown && (
            <DropdownMenuPortal position={fisheryPos}>
              <a
                href="/fishery"
                className={`block px-3 py-2 text-sm hover:bg-[#2a274a] ${
                  activeLink.startsWith("/fishery") ? "text-yellow-400" : "text-white"
                }`}
                onClick={() => setShowFisheryDropdown(false)}
              >
                Poissons
              </a>
              <a
                href="/fishery/tools"
                className={`block px-3 py-2 text-sm hover:bg-[#2a274a] ${
                  activeLink.startsWith("/fishery/tools") ? "text-yellow-400" : "text-white"
                }`}
                onClick={() => setShowFisheryDropdown(false)}
              >
                Matériel
              </a>
            </DropdownMenuPortal>
          )}


          {/* Menu déroulant Autres */}
          <div
            ref={autresRef}
            onClick={() => {
              setShowAutresDropdown(!showAutresDropdown);
              setShowFisheryDropdown(false); // fermer l'autre menu
            }}
            className="relative text-sm px-3 py-1 rounded text-white hover:text-yellow-400 transition-all whitespace-nowrap cursor-pointer"
          >
            Autres
          </div>

          {isMounted && showAutresDropdown && (
            <DropdownMenuPortal position={autresPos}>
              <a
                href="/articles"
                className={`block px-3 py-2 text-sm hover:bg-[#2a274a] ${
                  activeLink.startsWith("/articles") ? "text-yellow-400" : "text-white"
                }`}
                onClick={() => setShowAutresDropdown(false)}
              >
                Articles
              </a>
              <a
                href="/timeline"
                className={`block px-3 py-2 text-sm hover:bg-[#2a274a] ${
                  activeLink.startsWith("/timeline") ? "text-yellow-400" : "text-white"
                }`}
                onClick={() => setShowAutresDropdown(false)}
              >
                Timeline
              </a>
              <a
                href="/calendar"
                className={`block px-3 py-2 text-sm hover:bg-[#2a274a] ${
                  activeLink.startsWith("/calendar") ? "text-yellow-400" : "text-white"
                }`}
                onClick={() => setShowAutresDropdown(false)}
              >
                Planning
              </a>
            </DropdownMenuPortal>
          )}






        </nav>


      </header>

      <main
        style={{ paddingTop: offsetTop }}
        className="bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] min-h-screen overflow-visible"
      >

        {children}
      </main>
    </>
  );
}
