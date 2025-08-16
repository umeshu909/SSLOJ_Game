"use client";
import React, { useState } from "react";

export default function SelectableSlot({
  filled,
  label,
  onClick,
  imageUrl,
  size = "md",
  badge,
  overlay,
  bordered = true,
  fill = false,
}: {
  filled: boolean;
  label?: string;
  onClick?: () => void;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
  badge?: string;
  overlay?: React.ReactNode;
  bordered?: boolean;
  fill?: boolean;
}) {
  const [errored, setErrored] = useState(false);
  const sizeClass = fill
    ? "w-full h-full"
    : size === "lg"
    ? "w-28 h-36 sm:w-32 sm:h-40 md:w-40 md:h-48"
    : size === "sm"
    ? "w-16 h-20"
    : "w-24 h-28 sm:w-28 sm:h-32";
  const showPlus = !imageUrl || errored;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative ${sizeClass} ${bordered ? "border border-white/15" : ""} rounded-none bg-white/5 hover:bg-white/10 transition-colors grid place-items-center overflow-hidden shadow-none focus:outline-none focus:ring-2 focus:ring-white/30`}
      aria-label={label || (filled ? "Modifier" : "Sélectionner")}
    >
      {badge ? (
        <div className="absolute left-1 top-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white/90">{badge}</div>
      ) : null}
      {overlay ? <div className="pointer-events-none absolute inset-0 z-10">{overlay}</div> : null}
      {showPlus ? (
        <span className="text-2xl font-semibold select-none">+</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={label || "image"} className="w-full h-full object-contain p-2 bg-slate-900/40" onError={() => setErrored(true)} />
      )}
    </button>
  );
}