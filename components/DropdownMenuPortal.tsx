"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function DropdownMenuPortal({
  children,
  position,
}: {
  children: React.ReactNode;
  position: { top: number; left: number };
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed z-[999] bg-[#1a183a] border border-white/10 rounded shadow-lg min-w-[120px]"
      style={{ top: position.top, left: position.left }}
    >
      {children}
    </div>,
    document.body
  );
}
