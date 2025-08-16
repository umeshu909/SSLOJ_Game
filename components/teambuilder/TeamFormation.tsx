"use client";
import React from "react";
import { Character, Vestige } from "@/lib/teambuilder/types";
import SelectableSlot from "./SelectableSlot";
import VestigeSlot from "./VestigeSlot";

const getCharImg = (c?: Character | null) => (c?.image ? c.image : "");

export default function TeamFormation({
  characters,
  onPickCharacter,
  vestige,
  onPickVestige,
}: {
  characters: (Character | null)[];
  onPickCharacter: (slotIndex: number) => void;
  vestige: Vestige | null;
  onPickVestige: () => void;
}) {
  const [c1, c2, c3, c4, c5] = characters;

  const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="inline-block shrink-0 border-animated-gradient">
      <div className="bg-[#0a091c]">{children}</div>
    </div>
  );

  return (
    <section className="relative mx-auto w-full max-w-4xl px-2">
      <div className="absolute right-2 sm:right-4 md:right-6 top-1/2 translate-y-8 sm:translate-y-10 md:translate-y-12 z-10 text-right">
        <div className="text-[11px] sm:text-xs text-white/70 mb-1 sm:mb-1.5">Vestige</div>
        <VestigeSlot vestige={vestige} onClick={onPickVestige} className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28" size={4} />
      </div>

      <div className="relative py-2">
        <div className="flex items-end justify-center gap-4 sm:gap-6 md:gap-8">
          <div className="translate-y-1">
            <Frame>
              <SelectableSlot bordered={false} size="lg" filled={!!c3} imageUrl={getCharImg(c3)} badge="3" onClick={() => onPickCharacter(2)} />
            </Frame>
          </div>
          <div className="-translate-y-1">
            <Frame>
              <SelectableSlot bordered={false} size="lg" filled={!!c4} imageUrl={getCharImg(c4)} badge="4" onClick={() => onPickCharacter(3)} />
            </Frame>
          </div>
          <div className="translate-y-1">
            <Frame>
              <SelectableSlot bordered={false} size="lg" filled={!!c5} imageUrl={getCharImg(c5)} badge="5" onClick={() => onPickCharacter(4)} />
            </Frame>
          </div>
        </div>

        <div className="mt-2 sm:mt-3 flex items-start justify-center gap-6 sm:gap-10 md:gap-12">
          <Frame>
            <SelectableSlot bordered={false} size="lg" filled={!!c1} imageUrl={getCharImg(c1)} badge="1" onClick={() => onPickCharacter(0)} />
          </Frame>
          <Frame>
            <SelectableSlot bordered={false} size="lg" filled={!!c2} imageUrl={getCharImg(c2)} badge="2" onClick={() => onPickCharacter(1)} />
          </Frame>
        </div>
      </div>
    </section>
  );
}