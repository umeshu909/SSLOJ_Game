"use client";

import React, { useMemo, useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Character, Vestige } from "@/lib/teambuilder/types";
import SelectableSlot from "./SelectableSlot";
import VestigeSlot from "./VestigeSlot";

const getCharImg = (c?: Character | null) => (c?.image ? c.image : "");

// Un item "sortable" minimaliste qui gère la fluidité
function SortableSlot({
  id,
  filled,
  imageUrl,
  badge,
  onClick,
  isGhost,
}: {
  id: string;
  filled: boolean;
  imageUrl: string;
  badge: string;
  onClick: () => void;
  isGhost?: boolean; // quand l’élément est celui qu’on drag (placeholder)
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isSorting } = useSortable({ id });

  // Transforms fluides + GPU
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "transform 0.06s ease-out" : transition || "transform 220ms cubic-bezier(.2,.8,.2,1)",
    willChange: "transform",
  };

  // Le placeholder garde la place (pas de rétrécissement)
  const ghostClass = isGhost ? "opacity-30" : "";

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className={`inline-block shrink-0 border-animated-gradient`}>
        <div className={`bg-[#0a091c] ${ghostClass}`}>
          <SelectableSlot
            bordered={false}
            size="lg"
            filled={filled}
            imageUrl={imageUrl}
            badge={badge}
            onClick={onClick}
          />
        </div>
      </div>
    </div>
  );
}

export default function TeamFormation({
  characters,
  onPickCharacter,
  vestige,
  onPickVestige,
  onReorder, // <— ajoute ce prop si pas encore fait ; handler (from, to)
}: {
  characters: (Character | null)[];
  onPickCharacter: (slotIndex: number) => void;
  vestige: Vestige | null;
  onPickVestige: () => void;
  onReorder: (from: number, to: number) => void;
}) {
  // indices fixes pour garder le layout (3 en haut, 2 en bas)
  const ids = useMemo(() => ["slot-0", "slot-1", "slot-2", "slot-3", "slot-4"], []);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 }, // petit seuil pour éviter les drags accidentels
    })
  );

  // mapping id <-> index
  const idToIndex = (id: string) => parseInt(id.split("-")[1] || "0", 10);

  const handleDragStart = (e: any) => {
    setActiveId(e.active?.id ?? null);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const fromId = e.active?.id as string | undefined;
    const toId = e.over?.id as string | undefined;
    setActiveId(null);

    if (!fromId || !toId) return;
    const from = idToIndex(fromId);
    const to = idToIndex(toId);
    if (from === to) return;

    // On ne réordonne qu’au drop (pas pendant le drag) → zéro “danse” du layout
    onReorder(from, to);
  };

  // Élément sous la souris (pour DragOverlay)
  const activeIndex = activeId ? idToIndex(activeId) : -1;
  const activeChar = activeIndex >= 0 ? characters[activeIndex] : null;

  const [c1, c2, c3, c4, c5] = characters;

  return (
    <section className="relative mx-auto w-full max-w-4xl px-2">
      <div className="absolute right-2 sm:right-4 md:right-6 top-1/2 translate-y-8 sm:translate-y-10 md:translate-y-12 z-10 text-right">
        <div className="text-[11px] sm:text-xs text-white/70 mb-1 sm:mb-1.5">Vestige</div>
        <VestigeSlot vestige={vestige} onClick={onPickVestige} className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28" size={4} />
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* SortableContext ne bouge pas l’ordre pendant le drag (on garde ids fixes) */}
        <SortableContext items={ids} strategy={() => null}>
          <div className="relative py-2">
            {/* Rangée haute: 3,4,5 (indices 2,3,4) */}
            <div className="flex items-end justify-center gap-4 sm:gap-6 md:gap-8">
              <div className="translate-y-1">
                <SortableSlot
                  id="slot-2"
                  filled={!!c3}
                  imageUrl={getCharImg(c3)}
                  badge="3"
                  onClick={() => onPickCharacter(2)}
                  isGhost={activeId === "slot-2"}
                />
              </div>
              <div className="-translate-y-1">
                <SortableSlot
                  id="slot-3"
                  filled={!!c4}
                  imageUrl={getCharImg(c4)}
                  badge="4"
                  onClick={() => onPickCharacter(3)}
                  isGhost={activeId === "slot-3"}
                />
              </div>
              <div className="translate-y-1">
                <SortableSlot
                  id="slot-4"
                  filled={!!c5}
                  imageUrl={getCharImg(c5)}
                  badge="5"
                  onClick={() => onPickCharacter(4)}
                  isGhost={activeId === "slot-4"}
                />
              </div>
            </div>

            {/* Rangée basse: 1,2 (indices 0,1) */}
            <div className="mt-2 sm:mt-3 flex items-start justify-center gap-6 sm:gap-10 md:gap-12">
              <SortableSlot
                id="slot-0"
                filled={!!c1}
                imageUrl={getCharImg(c1)}
                badge="1"
                onClick={() => onPickCharacter(0)}
                isGhost={activeId === "slot-0"}
              />
              <SortableSlot
                id="slot-1"
                filled={!!c2}
                imageUrl={getCharImg(c2)}
                badge="2"
                onClick={() => onPickCharacter(1)}
                isGhost={activeId === "slot-1"}
              />
            </div>
          </div>
        </SortableContext>

        {/* Clone volant ultra fluide */}
        <DragOverlay dropAnimation={{
          duration: 180,
          easing: "cubic-bezier(.2,.8,.2,1)",
        }}>
          {activeChar ? (
            <div className="pointer-events-none z-50 scale-[1.04] will-change-transform">
              <div className="inline-block shrink-0 border-animated-gradient">
                <div className="bg-[#0a091c]">
                  <SelectableSlot
                    bordered={false}
                    size="lg"
                    filled={!!activeChar}
                    imageUrl={getCharImg(activeChar)}
                    badge=""
                    onClick={() => {}}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </section>
  );
}