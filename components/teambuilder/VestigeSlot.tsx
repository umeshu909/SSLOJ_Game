"use client";
import React from "react";
import IconCanvas from "@/components/IconCanvas";
import { Vestige } from "@/lib/teambuilder/types";

export default function VestigeSlot({
  vestige,
  onClick,
  size = 3,
  className = "",
}: {
  vestige: Vestige | null;
  onClick: () => void;
  size?: number;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-none border border-white/15 bg-white/5 hover:bg-white/10 grid place-items-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/30 ${className}`}
    >
      {!vestige?.pic ? (
        <div className="w-full h-full bg-slate-900/40" />
      ) : (
        <div className="w-full aspect-square overflow-hidden flex items-center justify-center">
          <div className="[&>canvas]:block [&>canvas]:w-full [&>canvas]:h-full [&>canvas]:max-w-full [&>canvas]:max-h-full [&>canvas]:object-contain">
            <IconCanvas
              prefix="sactx-0-2048x4096-ASTC 6x6-shenghen-"
              iconName={vestige.pic}
              jsonDir="/images/atlas/shenghen/"
              canvasId={`canvas-vestige-${vestige.id ?? "x"}`}
              imgHeight={4096}
              size={size}
            />
          </div>
        </div>
      )}
    </button>
  );
}