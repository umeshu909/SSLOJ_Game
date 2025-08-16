"use client";
import React from "react";
import { Artifact, Arayashiki, Character, Setups } from "@/lib/teambuilder/types";
import SelectableSlot from "./SelectableSlot";

const getCharImg = (c?: Character | null) => (c?.image ? c.image : "");
const getArayaImg = (a?: Arayashiki | null) => (a?.pic ? a.pic : "");
const getArtifactImg = (a?: Artifact | null) => (a?.icon ? a.icon : "");
const arayaOverlayUrl = (quality?: string) => (quality ? `/overlays/quality-${quality}.png` : "");

export default function CharacterSetupGrid({
  selectedCharacters,
  setups,
  onPickArtifact,
  onPickAraya,
}: {
  selectedCharacters: (Character | null)[];
  setups: Setups;
  onPickArtifact: (characterId: string | number) => void;
  onPickAraya: (characterId: string | number, arayaIndex: number) => void;
}) {
  return (
    <section className="mt-6 md:mt-8">
      <div className="border border-white/10 overflow-hidden">
        <div className="grid grid-cols-[1fr_24px_1fr_24px_1fr_1fr_1fr_1fr_1fr] gap-3 p-3 bg-white/5 text-white/70 text-[12px]">
          <div>Personnage</div>
          <div></div>
          <div>Artefact</div>
          <div></div>
          <div className="col-span-5">Arayashikis</div>
        </div>

        <div className="divide-y divide-white/10 bg-slate-900/30">
          {selectedCharacters.map((ch, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-[1fr_24px_1fr_24px_1fr_1fr_1fr_1fr_1fr] gap-3 p-3 items-center">
              {/* Perso (gradient 1px) */}
              <div className="aspect-[4/5]">
                <div className="w-full h-full relative border-gradient-1">
                  <div className="w-full h-full bg-[#0a091c]">
                    <SelectableSlot bordered={false} filled={!!ch} imageUrl={getCharImg(ch || undefined)} fill size="sm" />
                  </div>
                </div>
              </div>

              <div />
              {/* Artefact (1px solide) */}
              <div className="aspect-[4/5]">
                {ch ? (
                  <SelectableSlot
                    filled={!!setups[(ch as any).id]?.artifact}
                    imageUrl={getArtifactImg(setups[(ch as any).id]?.artifact)}
                    fill
                    size="sm"
                    onClick={() => onPickArtifact((ch as any).id)}
                  />
                ) : (
                  <div className="text-white/40 text-xs">—</div>
                )}
              </div>

              <div />
              {/* Arayas (1px solide + overlay qualité) */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="aspect-[4/5]">
                  {ch ? (
                    <SelectableSlot
                      filled={!!setups[(ch as any).id]?.arayas?.[i]}
                      imageUrl={getArayaImg(setups[(ch as any).id]?.arayas?.[i])}
                      fill
                      size="sm"
                      overlay={(() => {
                        const q = setups[(ch as any).id]?.arayas?.[i]?.quality as string | undefined;
                        const url = arayaOverlayUrl(q);
                        return url ? <img src={url} alt="quality overlay" className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none" /> : null;
                      })()}
                      onClick={() => onPickAraya((ch as any).id, i)}
                    />
                  ) : (
                    <div className="text-white/40 text-xs">—</div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}