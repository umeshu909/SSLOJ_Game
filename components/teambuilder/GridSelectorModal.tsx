"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { resolveName } from "@/lib/teambuilder/filters";
import type { Entity } from "@/lib/teambuilder/types";
import { useTranslation } from "next-i18next";

type Props<T extends Entity> = {
  open: boolean;
  onClose: () => void;
  title: string;
  data: T[];
  renderTile: (item: T) => { url?: string; label: string; extra?: React.ReactNode };
  onSelect: (item: T) => void;
  resetOnOpen?: boolean;
};

export default function GridSelectorModal<T extends Entity>({
  open,
  onClose,
  title,
  data,
  renderTile,
  onSelect,
  resetOnOpen = false,
}: Props<T>) {
  const { t } = useTranslation("common");
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // reset/focus à chaque ouverture
  useEffect(() => {
    if (!open) return;
    if (resetOnOpen) setQ("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [open, resetOnOpen]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return data || [];
    return (data || []).filter((d) => resolveName(d, "").toLowerCase().includes(s));
  }, [q, data]);

  if (!open) return null;

  function Tile({ item }: { item: T }) {
    const [err, setErr] = useState(false);
    const { url, label, extra } = renderTile(item);
    return (
      <button
        onClick={() => onSelect(item)}
        className="group relative rounded-none border border-white/10 bg-white/5 hover:bg-white/10 transition overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/30"
      >
        {url && !err ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={label}
            className="w-full h-28 sm:h-32 object-contain p-2 bg-slate-900/40"
            onError={() => setErr(true)}
          />
        ) : (
          <div className="w-full h-28 sm:h-32 grid place-items-center text-white/40 text-sm">
            {t("teambuilder.noPreview")}
          </div>
        )}
        {extra ? <div className="pointer-events-none absolute inset-0 z-10">{extra}</div> : null}
        <div className="absolute inset-x-0 bottom-0 z-20 p-1.5 bg-gradient-to-t from-black/80 to-transparent text-[11px] text-white/90 pointer-events-none">
          {label}
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-x-0 top-8 mx-auto w-[min(1200px,94vw)] rounded-2xl bg-slate-950/95 border border-white/10 p-5 shadow-2xl">
        <header className="flex items-center justify-between gap-4">
          <h3 className="text-white text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="px-3 py-1.5 text-sm rounded-md bg-white/10 hover:bg-white/20">
            {t("teambuilder.close")}
          </button>
        </header>
        <div className="mt-3">
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("teambuilder.search")}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 max-h-[75vh] overflow-y-auto pr-1">
          {(list || []).map((item) => (
            <Tile key={String(item.id ?? resolveName(item, "?"))} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}